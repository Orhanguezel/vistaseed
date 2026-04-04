import type { FastifyRequest, FastifyReply } from "fastify";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import { createReadStream, createWriteStream } from "node:fs";
import { DB, pool, backtickIdent, tmpFilePath, rmSafe, sqlEscapeCell, type TableRow } from "./helpers";
import { MODULES, type ModuleKey, isModuleKey } from "./moduleManifest";

// ── SQL Split (quote/comment aware) ─────────────────────────────────────────

function splitSqlStatements(sql: string): string[] {
  const out: string[] = [];
  const s = String(sql || "");
  let cur = "";
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;

  const flush = () => {
    const trimmed = cur.trim();
    if (trimmed && trimmed !== ";") out.push(trimmed);
    cur = "";
  };

  while (i < s.length) {
    const ch = s[i];
    const next = i + 1 < s.length ? s[i + 1] : "";

    if (inLineComment) { cur += ch; if (ch === "\n") inLineComment = false; i++; continue; }
    if (inBlockComment) { cur += ch; if (ch === "*" && next === "/") { cur += next; i += 2; inBlockComment = false; continue; } i++; continue; }

    if (!inSingle && !inDouble && !inBacktick) {
      if (ch === "-" && next === "-") {
        const after = i + 2 < s.length ? s[i + 2] : "";
        if (after === " " || after === "\t" || after === "\r" || after === "\n") { inLineComment = true; cur += ch + next; i += 2; continue; }
      }
      if (ch === "#") { inLineComment = true; cur += ch; i++; continue; }
      if (ch === "/" && next === "*") { inBlockComment = true; cur += ch + next; i += 2; continue; }
    }

    if (!inDouble && !inBacktick && ch === "'" && !inSingle) { inSingle = true; cur += ch; i++; continue; }
    if (inSingle) { cur += ch; if (ch === "\\" && next) { cur += next; i += 2; continue; } if (ch === "'") inSingle = false; i++; continue; }

    if (!inSingle && !inBacktick && ch === '"' && !inDouble) { inDouble = true; cur += ch; i++; continue; }
    if (inDouble) { cur += ch; if (ch === "\\" && next) { cur += next; i += 2; continue; } if (ch === '"') inDouble = false; i++; continue; }

    if (!inSingle && !inDouble && ch === "`") { inBacktick = !inBacktick; cur += ch; i++; continue; }
    if (!inSingle && !inDouble && !inBacktick && ch === ";") { cur += ch; flush(); i++; continue; }

    cur += ch;
    i++;
  }

  flush();
  return out;
}

// ── Statement Validation ────────────────────────────────────────────────────

type ParsedStmt =
  | { kind: "set" | "start" | "commit" | "rollback" | "comment"; table?: undefined }
  | { kind: "insert" | "replace" | "update" | "delete"; table: string }
  | { kind: "unknown"; table?: string };

const DISALLOWED_KEYWORDS = [
  "create", "alter", "drop", "truncate", "rename", "use",
  "grant", "revoke", "load", "outfile", "infile",
  "procedure", "function", "trigger", "event",
];

function stripLeadingComments(stmt: string): string {
  let s = stmt.trimStart();
  while (s.startsWith("/*")) { const end = s.indexOf("*/"); if (end === -1) break; s = s.slice(end + 2).trimStart(); }
  while (s.startsWith("--") || s.startsWith("#")) { const nl = s.indexOf("\n"); if (nl === -1) return ""; s = s.slice(nl + 1).trimStart(); }
  return s;
}

function normalizeTableName(raw: string): string {
  let t = raw.trim();
  if (!t) return "";
  if (t.includes(".")) t = t.split(".").pop() || t;
  t = t.replace(/`/g, "").replace(/^["']|["']$/g, "");
  return t.trim();
}

function parseStatement(stmt: string): ParsedStmt {
  const s0 = stripLeadingComments(stmt);
  if (!s0) return { kind: "comment" };
  const lower = s0.trim().toLowerCase();

  for (const kw of DISALLOWED_KEYWORDS) {
    if (new RegExp(`\\b${kw}\\b`, "i").test(lower)) return { kind: "unknown" };
  }

  if (/^set\b/i.test(lower)) return { kind: "set" };
  if (/^start\s+transaction\b/i.test(lower)) return { kind: "start" };
  if (/^commit\b/i.test(lower)) return { kind: "commit" };
  if (/^rollback\b/i.test(lower)) return { kind: "rollback" };

  const s = s0.trim();
  let m = s.match(/^\s*insert\s+(?:ignore\s+)?into\s+([`"']?[\w.-]+[`"']?)/i) || s.match(/^\s*insert\s+into\s+([`"']?[\w.-]+[`"']?)/i);
  if (m?.[1]) return { kind: "insert", table: normalizeTableName(m[1]) };

  m = s.match(/^\s*replace\s+into\s+([`"']?[\w.-]+[`"']?)/i);
  if (m?.[1]) return { kind: "replace", table: normalizeTableName(m[1]) };

  m = s.match(/^\s*update\s+([`"']?[\w.-]+[`"']?)\s+set\b/i);
  if (m?.[1]) return { kind: "update", table: normalizeTableName(m[1]) };

  m = s.match(/^\s*delete\s+from\s+([`"']?[\w.-]+[`"']?)/i);
  if (m?.[1]) return { kind: "delete", table: normalizeTableName(m[1]) };

  return { kind: "unknown" };
}

function validateStatementsOrThrow(module: ModuleKey, statements: string[]): { ok: true } {
  const allowedTables = new Set(MODULES[module].tablesInOrder);
  const bad: { index: number; reason: string; stmt: string }[] = [];

  statements.forEach((st, idx) => {
    const p = parseStatement(st);
    if (p.kind === "unknown") {
      bad.push({ index: idx, reason: "Statement type not allowed (or contains disallowed keyword).", stmt: st.slice(0, 500) });
      return;
    }
    if (p.kind === "insert" || p.kind === "replace" || p.kind === "update" || p.kind === "delete") {
      if (!p.table || !allowedTables.has(p.table)) {
        bad.push({ index: idx, reason: `Table not allowed for module '${module}': '${p.table || "?"}'`, stmt: st.slice(0, 500) });
      }
    }
  });

  if (bad.length) {
    const first = bad[0];
    const extra = bad.length > 1 ? ` (+${bad.length - 1} more)` : "";
    const err = new Error(`SQL rejected. Statement #${first.index + 1}: ${first.reason}${extra}`);
    (err as Error & { details: unknown }).details = bad;
    throw err;
  }
  return { ok: true };
}

// ── Module Helpers ──────────────────────────────────────────────────────────

function getTruncateList(module: ModuleKey): string[] {
  const m = MODULES[module];
  return m.truncateInOrder?.length ? [...m.truncateInOrder] : [...m.tablesInOrder].reverse();
}

async function truncateModuleTables(conn: PoolConnection, module: ModuleKey) {
  for (const t of getTruncateList(module)) {
    await conn.query(`TRUNCATE TABLE ${backtickIdent(t)};`);
  }
}

function buildOnDuplicateUpdateClause(columns: string[]): string {
  const skip = new Set(["id", "created_at"]);
  const updatable = columns.filter((c) => !skip.has(c));
  if (!updatable.length) return "";
  return `ON DUPLICATE KEY UPDATE\n  ${updatable.map((c) => `${backtickIdent(c)} = VALUES(${backtickIdent(c)})`).join(",\n  ")}`;
}

// ── Dump Module Data ────────────────────────────────────────────────────────

async function dumpModuleDataOnly(conn: PoolConnection, module: ModuleKey, outPath: string, upsert: boolean) {
  const ws = createWriteStream(outPath, { encoding: "utf8" });
  const write = (chunk: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const ok = ws.write(chunk, (err) => (err ? reject(err) : resolve()));
      if (!ok) ws.once("drain", () => resolve());
    });
  const close = (): Promise<void> => new Promise((resolve, reject) => { ws.end((err: Error | null | undefined) => (err ? reject(err) : resolve())); });

  const tables = MODULES[module].tablesInOrder;

  try {
    await write(`-- Module export (DATA ONLY)\n-- module: ${module}\n-- upsert: ${upsert ? "1" : "0"}\n-- generated_at: ${new Date().toISOString()}\n\n`);
    await write(`SET NAMES utf8mb4;\nSET time_zone = '+00:00';\nSET FOREIGN_KEY_CHECKS=0;\nSET SQL_SAFE_UPDATES=0;\n\n`);

    for (const table of tables) {
      const [chk] = await conn.query<TableRow[]>(
        `SELECT TABLE_NAME AS name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? LIMIT 1`,
        [DB().database, table],
      );
      if (!chk?.length) { await write(`-- WARN: table not found, skipped: ${backtickIdent(table)}\n\n`); continue; }

      const [rows] = await conn.query<RowDataPacket[]>(`SELECT * FROM ${backtickIdent(table)}`);
      const data = rows as Record<string, unknown>[];
      if (!data.length) { await write(`-- ${backtickIdent(table)}: no rows\n\n`); continue; }

      await write(`-- TABLE: ${backtickIdent(table)} (rows: ${data.length})\n`);
      const columns = Object.keys(data[0] || {});
      const colList = columns.map((c) => backtickIdent(c)).join(", ");
      const insertPrefix = `INSERT INTO ${backtickIdent(table)} (${colList}) VALUES `;

      const chunkSize = 200;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const valuesSql = chunk
          .map((row) => `(${columns.map((col) => sqlEscapeCell(row[col])).join(", ")})`)
          .join(",\n");
        const onDup = upsert ? buildOnDuplicateUpdateClause(columns) : "";
        await write(onDup ? `${insertPrefix}\n${valuesSql}\n${onDup}\n;\n\n` : `${insertPrefix}\n${valuesSql}\n;\n\n`);
      }
    }

    await write(`SET FOREIGN_KEY_CHECKS=1;\n`);
  } finally {
    await close();
  }
}

// ── EXPORT MODULE: GET /admin/db/export-module ──────────────────────────────

const ExportModuleQuery = z.object({
  module: z.string().min(1),
  upsert: z.union([z.string(), z.boolean()]).optional().transform((v) => {
    if (typeof v === "boolean") return v;
    const s = String(v ?? "").toLowerCase().trim();
    return !s || s === "1" || s === "true" || s === "yes";
  }),
});

export async function adminExportModuleSql(req: FastifyRequest, reply: FastifyReply) {
  const parsed = ExportModuleQuery.safeParse(req.query || {});
  if (!parsed.success) return reply.code(400).send({ ok: false, error: "module_required" });

  if (!isModuleKey(parsed.data.module)) {
    return reply.code(400).send({ ok: false, error: "invalid_module", allowed: Object.keys(MODULES) });
  }

  const module = parsed.data.module;
  const upsert = parsed.data.upsert ?? true;

  const stamp = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const filename = `module_${module}_${stamp.getFullYear()}${pad(stamp.getMonth() + 1)}${pad(stamp.getDate())}_${pad(stamp.getHours())}${pad(stamp.getMinutes())}.sql`;
  const tmpOut = tmpFilePath(".sql");
  const p = pool();
  const conn = await p.getConnection();

  try {
    await dumpModuleDataOnly(conn, module, tmpOut, upsert);
    const stream = createReadStream(tmpOut);
    stream.on("close", () => rmSafe(tmpOut));
    stream.on("error", () => rmSafe(tmpOut));
    return reply.header("Content-Disposition", `attachment; filename="${filename}"`).send(stream);
  } catch (err: unknown) {
    req.log.error({ err }, "module export failed");
    rmSafe(tmpOut);
    const message = err instanceof Error ? err.message : "module_export_failed";
    return reply.code(500).send({ ok: false, error: message });
  } finally {
    conn.release();
  }
}

// ── IMPORT MODULE: POST /admin/db/import-module ─────────────────────────────

const ImportModuleBody = z.object({
  module: z.string().min(1),
  sql: z.string().min(1),
  dryRun: z.boolean().optional().default(false),
  truncateBefore: z.boolean().optional().default(false),
});

export async function adminImportModuleSql(req: FastifyRequest, reply: FastifyReply) {
  const body = ImportModuleBody.safeParse(req.body || {});
  if (!body.success) return reply.code(400).send({ ok: false, error: "invalid_body", details: body.error.flatten() });

  if (!isModuleKey(body.data.module)) {
    return reply.code(400).send({ ok: false, error: "invalid_module", allowed: Object.keys(MODULES) });
  }

  const module = body.data.module;
  const { sql, dryRun, truncateBefore } = body.data;
  const statements = splitSqlStatements(sql);

  try {
    validateStatementsOrThrow(module, statements);
  } catch (err: unknown) {
    const e = err as Error & { details?: unknown };
    return reply.code(400).send({ ok: false, error: "sql_rejected", message: e.message, details: e.details ?? null });
  }

  const p = pool();
  const conn = await p.getConnection();

  try {
    await conn.beginTransaction();
    await conn.query("SET FOREIGN_KEY_CHECKS=0;");
    await conn.query("SET SQL_SAFE_UPDATES=0;");

    if (truncateBefore) await truncateModuleTables(conn, module);

    for (const st of statements) {
      const stripped = stripLeadingComments(st);
      if (!stripped.trim()) continue;
      const execStmt = st.trim().replace(/;\s*$/g, "");
      if (!execStmt) continue;
      await conn.query(execStmt);
    }

    if (dryRun) { await conn.rollback(); return reply.send({ ok: true, dryRun: true }); }
    await conn.commit();
    return reply.send({ ok: true });
  } catch (err: unknown) {
    try { await conn.rollback(); } catch { /* ignore */ }
    req.log.error({ err, module }, "module import failed");
    const message = err instanceof Error ? err.message : "module_import_failed";
    return reply.code(400).send({ ok: false, error: message });
  } finally {
    try { await conn.query("SET FOREIGN_KEY_CHECKS=1;"); } catch { /* ignore */ }
    conn.release();
  }
}

// ── SITE SETTINGS: UI EXPORT ────────────────────────────────────────────────

interface SiteSettingRow extends RowDataPacket {
  id: string;
  key: string;
  locale: string;
  value: unknown;
}

const UiExportQuery = z.object({
  fromLocale: z.string().trim().min(2).max(10).default("tr"),
  prefix: z.union([z.string(), z.array(z.string())]).optional(),
});

function asPrefixList(v: unknown): string[] {
  if (!v) return ["ui_"];
  if (Array.isArray(v)) return v.map((x) => String(x || "")).filter(Boolean);
  return [String(v || "")].filter(Boolean);
}

function safeJsonParse(v: unknown): unknown {
  if (v === null || typeof v === "undefined") return null;
  if (typeof v === "object") return v;
  const s = String(v);
  if (!s) return "";
  try { return JSON.parse(s); } catch { return s; }
}

export async function adminExportSiteSettingsUiJson(req: FastifyRequest, reply: FastifyReply) {
  const parsed = UiExportQuery.safeParse(req.query || {});
  if (!parsed.success) return reply.code(400).send({ ok: false, error: "invalid_query", details: parsed.error.flatten() });

  const { fromLocale } = parsed.data;
  const prefixes = asPrefixList(parsed.data.prefix).map((p) => p.trim()).filter(Boolean);
  const p = pool();
  const conn = await p.getConnection();

  try {
    const where = prefixes.map(() => "`key` LIKE ?").join(" OR ");
    const args = prefixes.map((pref) => `${pref}%`);

    const [rows] = await conn.query<SiteSettingRow[]>(
      `SELECT id, \`key\` as \`key\`, locale, \`value\` FROM site_settings WHERE locale = ? AND (${where}) ORDER BY \`key\` ASC`,
      [fromLocale, ...args],
    );

    const items: Record<string, unknown> = {};
    for (const r of rows || []) items[String(r.key)] = safeJsonParse(r.value);

    return reply.send({ ok: true, fromLocale, prefixes, count: Object.keys(items).length, items });
  } catch (err: unknown) {
    req.log.error({ err }, "ui-export failed");
    const message = err instanceof Error ? err.message : "ui_export_failed";
    return reply.code(500).send({ ok: false, error: message });
  } finally {
    conn.release();
  }
}

// ── SITE SETTINGS: UI BOOTSTRAP ─────────────────────────────────────────────

const UiBootstrapBody = z.object({
  sourceLocale: z.string().trim().min(2).max(10),
  targetLocale: z.string().trim().min(2).max(10),
  prefixes: z.array(z.string().trim().min(1)).optional().default(["ui_"]),
  overwrite: z.boolean().optional().default(false),
});

export async function adminBootstrapSiteSettingsUiLocale(req: FastifyRequest, reply: FastifyReply) {
  const parsed = UiBootstrapBody.safeParse(req.body || {});
  if (!parsed.success) return reply.code(400).send({ ok: false, error: "invalid_body", details: parsed.error.flatten() });

  const { sourceLocale, targetLocale, prefixes, overwrite } = parsed.data;
  if (sourceLocale === targetLocale) return reply.code(400).send({ ok: false, error: "same_locale", message: "sourceLocale and targetLocale must differ." });

  const p = pool();
  const conn = await p.getConnection();
  const where = prefixes.map(() => "`key` LIKE ?").join(" OR ");
  const args = prefixes.map((pref) => `${pref}%`);

  try {
    await conn.beginTransaction();
    await conn.query("SET FOREIGN_KEY_CHECKS=0;");
    await conn.query("SET SQL_SAFE_UPDATES=0;");

    const [srcRows] = await conn.query<SiteSettingRow[]>(
      `SELECT \`key\`, \`value\` FROM site_settings WHERE locale = ? AND (${where}) ORDER BY \`key\` ASC`,
      [sourceLocale, ...args],
    );

    const source = (srcRows || []).map((r) => ({ key: String(r.key), value: r.value }));
    if (!source.length) {
      await conn.rollback();
      return reply.send({ ok: true, message: "no_source_rows", sourceLocale, targetLocale, prefixes, insertedOrUpdated: 0 });
    }

    let existing = new Set<string>();
    if (!overwrite) {
      const [tgtRows] = await conn.query<RowDataPacket[]>(
        `SELECT \`key\` FROM site_settings WHERE locale = ? AND (${where})`,
        [targetLocale, ...args],
      );
      existing = new Set((tgtRows || []).map((x) => String((x as { key: string }).key)));
    }

    let count = 0;
    for (const row of source) {
      if (!overwrite && existing.has(row.key)) continue;
      await conn.query(
        `INSERT INTO site_settings (id, \`key\`, locale, \`value\`, created_at, updated_at) VALUES (UUID(), ?, ?, ?, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), \`updated_at\` = VALUES(\`updated_at\`)`,
        [row.key, targetLocale, row.value],
      );
      count++;
    }

    await conn.commit();
    return reply.send({ ok: true, sourceLocale, targetLocale, prefixes, overwrite, insertedOrUpdated: count });
  } catch (err: unknown) {
    try { await conn.rollback(); } catch { /* ignore */ }
    req.log.error({ err }, "ui-bootstrap failed");
    const message = err instanceof Error ? err.message : "ui_bootstrap_failed";
    return reply.code(500).send({ ok: false, error: message });
  } finally {
    try { await conn.query("SET FOREIGN_KEY_CHECKS=1;"); } catch { /* ignore */ }
    conn.release();
  }
}
