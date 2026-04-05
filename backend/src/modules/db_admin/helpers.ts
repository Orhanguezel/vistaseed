import { env } from "@/core/env";
import {
  createPool,
  type Pool,
  type PoolConnection,
  type RowDataPacket,
} from "mysql2/promise";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  existsSync,
  unlinkSync,
  createWriteStream,
  createReadStream,
  readFileSync,
  writeFileSync,
  mkdirSync,
  statSync,
} from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { createGunzip } from "node:zlib";
import { spawn } from "node:child_process";
import { Buffer } from "node:buffer";
import { escape as mysqlEscape } from "mysql2";
import { z } from "zod";

const pump = promisify(pipeline);

// ── DB Config ────────────────────────────────────────────────────────────────

export function DB() {
  return {
    host: env.DB.host,
    port: env.DB.port,
    user: env.DB.user,
    password: env.DB.password,
    database: env.DB.name,
  };
}

export type DbConfig = ReturnType<typeof DB>;

// ── Pool (cached, two variants) ──────────────────────────────────────────────

let _poolMulti: Pool | null = null;
let _poolSingle: Pool | null = null;

export function pool(multipleStatements = false): Pool {
  if (multipleStatements) {
    if (_poolMulti) return _poolMulti;
    const cfg = DB();
    _poolMulti = createPool({ ...cfg, database: cfg.database, charset: "utf8mb4", multipleStatements: true });
    return _poolMulti;
  }
  if (_poolSingle) return _poolSingle;
  const cfg = DB();
  _poolSingle = createPool({ ...cfg, database: cfg.database, charset: "utf8mb4", multipleStatements: false });
  return _poolSingle;
}

// ── SQL Helpers ──────────────────────────────────────────────────────────────

export function backtickIdent(name: string) {
  return "`" + String(name).replace(/`/g, "``") + "`";
}

function toSqlPrimitive(v: unknown): string | number | boolean | Date | Buffer {
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return v;
  if (Buffer.isBuffer(v)) return v;
  if (v instanceof Date) return v;
  return String(v);
}

export function sqlEscapeCell(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  return mysqlEscape(toSqlPrimitive(v));
}

export interface TableRow extends RowDataPacket {
  name: string;
}

export async function listTables(conn: PoolConnection, dbName: string): Promise<string[]> {
  const [rows] = await conn.query<TableRow[]>(
    `SELECT TABLE_NAME AS name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
    [dbName],
  );
  return rows.map((r) => r.name);
}

export async function listDbTables(): Promise<string[]> {
  const cfg = DB();
  const p = pool();
  const conn = await p.getConnection();
  try {
    const [rows] = await conn.query<TableRow[]>(
      `SELECT TABLE_NAME AS name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [cfg.database],
    );
    return (rows || []).map((r) => String(r.name)).filter(Boolean).sort();
  } finally {
    conn.release();
  }
}

// ── FS Helpers ───────────────────────────────────────────────────────────────

export function tmpFilePath(suffix = "") {
  const id = randomBytes(8).toString("hex");
  return join(tmpdir(), `dbdump_${id}${suffix}`);
}

export function rmSafe(p?: string) {
  if (!p) return;
  try {
    if (existsSync(p)) unlinkSync(p);
  } catch { /* ignore */ }
}

export async function gunzipIfNeeded(path: string): Promise<string> {
  if (!/\.gz$/i.test(path)) return path;
  const out = path.replace(/\.gz$/i, "") || `${path}.sql`;
  await pump(createReadStream(path), createGunzip(), createWriteStream(out));
  return out;
}

export function isGzipContent(ct: string | null | undefined, ce: string | null | undefined, url?: string) {
  const ctype = (ct || "").toLowerCase();
  const cenc = (ce || "").toLowerCase();
  return cenc.includes("gzip") || ctype.includes("application/gzip") || (url || "").toLowerCase().endsWith(".gz");
}

export async function gunzipBuffer(buf: Uint8Array): Promise<Buffer> {
  return new Promise((res, rej) => {
    const chunks: Buffer[] = [];
    const gun = createGunzip();
    gun.on("data", (c: Buffer) => chunks.push(c));
    gun.on("end", () => res(Buffer.concat(chunks)));
    gun.on("error", rej);
    gun.end(Buffer.from(buf));
  });
}

// ── Dump Helpers ─────────────────────────────────────────────────────────────

type DumpAttempt = { bin: string; args: string[] };

function baseArgs(cfg: DbConfig) {
  const args = ["-h", cfg.host, "-P", String(cfg.port), "-u", cfg.user];
  if (cfg.password) args.push(`-p${cfg.password}`);
  return args;
}

async function tryDump(
  bin: string,
  args: string[],
  outPath: string,
): Promise<{ ok: true } | { ok: false; code?: number; stderr: string }> {
  return new Promise((res) => {
    const p = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    const ws = createWriteStream(outPath);
    let stderr = "";

    p.stdout.pipe(ws);
    p.stderr.on("data", (d) => { stderr += String(d || ""); });

    p.on("error", (e) => {
      try { ws.close(); } catch { /* ignore */ }
      res({ ok: false, stderr: (e && (e as NodeJS.ErrnoException).message) || String(e) });
    });

    p.on("close", (code) => {
      if (code === 0) return res({ ok: true });
      try { ws.close(); } catch { /* ignore */ }
      res({ ok: false, code: code ?? undefined, stderr });
    });
  });
}

export async function runMysqlDumpAll(cfg: DbConfig, outPath: string): Promise<void> {
  const common = ["--single-transaction", "--quick", "--skip-lock-tables", "--no-tablespaces"];
  const fullFlags = ["--routines", "--triggers", "--events"];

  const bins = [
    process.env.MYSQLDUMP_BIN?.trim(),
    "mysqldump",
    "mariadb-dump",
    "/usr/bin/mysqldump",
    "/usr/bin/mariadb-dump",
  ].filter(Boolean) as string[];

  const attempts: DumpAttempt[] = [];
  for (const bin of bins) {
    attempts.push({ bin, args: [...baseArgs(cfg), ...common, ...fullFlags, cfg.database] });
    attempts.push({ bin, args: [...baseArgs(cfg), ...common, cfg.database] });
  }

  let lastErr = "";
  for (const a of attempts) {
    console.log("[mysqldump] trying:", a.bin, a.args.join(" "));
    const r = await tryDump(a.bin, a.args, outPath);
    if (r.ok) {
      console.log("[mysqldump] success with", a.bin);
      return;
    }
    lastErr = `[${a.bin}] exit=${"code" in r ? r.code : "spawn_error"} :: ${r.stderr?.slice(0, 800) || "no-stderr"}`;
    console.error("[mysqldump] failed attempt:", lastErr);
  }

  throw new Error(`mysqldump failed (all attempts). ${lastErr}`);
}

export async function dumpDbViaConnection(cfg: DbConfig, outPath: string) {
  const p = pool(true);
  const conn = await p.getConnection();
  const ws = createWriteStream(outPath, { encoding: "utf8" });

  const write = (chunk: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const ok = ws.write(chunk, (err) => (err ? reject(err) : resolve()));
      if (!ok) ws.once("drain", () => resolve());
    });

  try {
    const tables = await listTables(conn, cfg.database);
    const [vars] = await conn.query<RowDataPacket[]>(
      "SELECT @@character_set_database AS cs, @@collation_database AS co",
    );
    const cs = vars?.[0]?.cs || "utf8mb4";
    const co = vars?.[0]?.co || "utf8mb4_unicode_ci";

    await write(`-- SQL dump generated at ${new Date().toISOString()}\n\n`);
    await write(`CREATE DATABASE IF NOT EXISTS ${backtickIdent(cfg.database)} /*!40100 DEFAULT CHARACTER SET ${cs} COLLATE ${co} */;\n`);
    await write(`USE ${backtickIdent(cfg.database)};\n\n`);

    for (const table of tables) {
      const [createRows] = await conn.query<RowDataPacket[]>(`SHOW CREATE TABLE ${backtickIdent(table)}`);
      const createSql = createRows?.[0]?.["Create Table"];
      if (!createSql) continue;

      await write(`\n-- Table: ${backtickIdent(table)}\n`);
      await write(`DROP TABLE IF EXISTS ${backtickIdent(table)};\n`);
      await write(`${createSql};\n\n`);

      const [rows] = await conn.query<RowDataPacket[]>(`SELECT * FROM ${backtickIdent(table)}`);
      const data = rows as Record<string, unknown>[];
      if (!data.length) continue;

      const columns = Object.keys(data[0]);
      const colList = columns.map((c) => backtickIdent(c)).join(", ");
      const insertPrefix = `INSERT INTO ${backtickIdent(table)} (${colList}) VALUES `;

      const chunkSize = 100;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const valuesSql = chunk
          .map((row) => {
            const vals = columns.map((col) => sqlEscapeCell(row[col]));
            return `(${vals.join(", ")})`;
          })
          .join(",\n");
        await write(insertPrefix + "\n" + valuesSql + ";\n");
      }
    }
  } finally {
    await new Promise<void>((resolve, reject) => {
      ws.end((err: Error | null | undefined) => (err ? reject(err) : resolve()));
    });
    conn.release();
  }
}

// ── SQL Import ───────────────────────────────────────────────────────────────

export const ImportSqlSchema = z.object({
  sql: z.string().min(1),
  dryRun: z.boolean().optional().default(false),
  truncateBefore: z.boolean().optional().default(false),
});

export async function runSqlImport({ sql, dryRun, truncateBefore }: z.infer<typeof ImportSqlSchema>) {
  const cfg = DB();
  const p = pool(true);
  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("SET FOREIGN_KEY_CHECKS=0; SET SQL_SAFE_UPDATES=0;");

    if (truncateBefore) {
      const tables = await listTables(conn, cfg.database);
      for (const t of tables) {
        await conn.query(`TRUNCATE TABLE ${backtickIdent(t)};`);
      }
    }

    await conn.query(sql);

    if (dryRun) {
      await conn.rollback();
      return { ok: true as const, dryRun: true as const };
    }

    await conn.commit();
    return { ok: true as const };
  } catch (err: unknown) {
    try { await conn.rollback(); } catch { /* ignore */ }
    const message = err instanceof Error ? err.message : "SQL import failed";
    return { ok: false as const, error: message };
  } finally {
    try { await conn.query("SET FOREIGN_KEY_CHECKS=1;"); } catch { /* ignore */ }
    conn.release();
  }
}

// ── Snapshot Storage ─────────────────────────────────────────────────────────

const SNAPSHOT_DIR = join(process.cwd(), "uploads", "db_snapshots");
const SNAPSHOT_INDEX_FILE = join(SNAPSHOT_DIR, "index.json");

export type DbSnapshotMeta = {
  id: string;
  filename: string;
  label?: string | null;
  note?: string | null;
  created_at: string;
  size_bytes?: number | null;
};

export function ensureSnapshotDir() {
  try {
    if (!existsSync(SNAPSHOT_DIR)) mkdirSync(SNAPSHOT_DIR, { recursive: true });
  } catch { /* ignore */ }
}

export function getSnapshotPath(filename: string) {
  return join(SNAPSHOT_DIR, filename);
}

export function loadSnapshotIndex(): DbSnapshotMeta[] {
  try {
    if (!existsSync(SNAPSHOT_INDEX_FILE)) return [];
    const raw = readFileSync(SNAPSHOT_INDEX_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const results: DbSnapshotMeta[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const rec = item as Record<string, unknown>;
      const id = String(rec.id || "");
      const filename = String(rec.filename || "");
      if (!id || !filename) continue;

      const created_at = typeof rec.created_at === "string" ? rec.created_at : new Date().toISOString();
      const sizeRaw = rec.size_bytes;
      const size_bytes = typeof sizeRaw === "number" ? sizeRaw : sizeRaw == null ? null : Number.isFinite(Number(sizeRaw)) ? Number(sizeRaw) : null;

      results.push({ id, filename, label: (rec.label as string) ?? null, note: (rec.note as string) ?? null, created_at, size_bytes });
    }
    return results;
  } catch {
    return [];
  }
}

export function saveSnapshotIndex(list: DbSnapshotMeta[]) {
  try {
    ensureSnapshotDir();
    writeFileSync(SNAPSHOT_INDEX_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch { /* ignore */ }
}

export function snapshotFileExists(filename: string) {
  return existsSync(getSnapshotPath(filename));
}

export function snapshotFileStat(filename: string) {
  return statSync(getSnapshotPath(filename));
}

export function snapshotFileRead(filename: string) {
  return readFileSync(getSnapshotPath(filename), "utf8");
}

export function snapshotFileDelete(filename: string) {
  const full = getSnapshotPath(filename);
  if (existsSync(full)) unlinkSync(full);
}
