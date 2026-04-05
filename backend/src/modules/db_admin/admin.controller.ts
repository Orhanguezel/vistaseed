import type { FastifyRequest, FastifyReply } from "fastify";
import { createReadStream } from "node:fs";
import { extname } from "node:path";
import { Buffer } from "node:buffer";
import { z } from "zod";
import _fetch from "node-fetch";
import {
  DB,
  tmpFilePath,
  rmSafe,
  runMysqlDumpAll,
  dumpDbViaConnection,
  isGzipContent,
  gunzipBuffer,
  runSqlImport,
  ImportSqlSchema,
  ensureSnapshotDir,
  loadSnapshotIndex,
  saveSnapshotIndex,
  snapshotFileExists,
  snapshotFileStat,
  snapshotFileRead,
  snapshotFileDelete,
  getSnapshotPath,
  type DbSnapshotMeta,
} from "./helpers";
import { randomBytes } from "node:crypto";

const fetchAny: typeof fetch = (globalThis as unknown as { fetch?: typeof fetch }).fetch || (_fetch as unknown as typeof fetch);

// ── Export: GET /admin/db/export ─────────────────────────────────────────────

export async function adminExportSql(req: FastifyRequest, reply: FastifyReply) {
  const cfg = DB();
  const stamp = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const filename = `dump_${stamp.getFullYear()}${pad(stamp.getMonth() + 1)}${pad(stamp.getDate())}_${pad(stamp.getHours())}${pad(stamp.getMinutes())}.sql`;
  const tmpOut = tmpFilePath(".sql");

  try {
    try {
      await runMysqlDumpAll(cfg, tmpOut);
    } catch (err: unknown) {
      const msg = String(err instanceof Error ? err.message : "");
      if (msg.includes("ENOENT") || msg.includes("spawn_error")) {
        await dumpDbViaConnection(cfg, tmpOut);
      } else {
        throw err;
      }
    }

    const stream = createReadStream(tmpOut);
    stream.on("close", () => rmSafe(tmpOut));
    stream.on("error", () => rmSafe(tmpOut));

    return reply.header("Content-Disposition", `attachment; filename="${filename}"`).send(stream);
  } catch (err: unknown) {
    req.log.error({ err }, "db export failed");
    rmSafe(tmpOut);
    const message = err instanceof Error ? err.message : "export_failed";
    return reply.code(500).send({ error: { message } });
  }
}

// ── Import JSON: POST /admin/db/import-sql ───────────────────────────────────

export async function adminImportSqlText(req: FastifyRequest, reply: FastifyReply) {
  const body = ImportSqlSchema.parse(req.body || {});
  const res = await runSqlImport(body);
  if (!res.ok) return reply.code(400).send(res);
  return reply.send(res);
}

// ── Import URL: POST /admin/db/import-url ────────────────────────────────────

const UrlBody = z.object({
  url: z.string().url(),
  dryRun: z.boolean().optional().default(false),
  truncateBefore: z.boolean().optional().default(false),
});

export async function adminImportSqlFromUrl(req: FastifyRequest, reply: FastifyReply) {
  const { url, dryRun, truncateBefore } = UrlBody.parse(req.body || {});
  const r = await fetchAny(url);
  if (!r.ok) return reply.code(400).send({ ok: false, error: "URL fetch failed" });

  const ct = r.headers.get("content-type");
  const ce = r.headers.get("content-encoding");
  const arr = await r.arrayBuffer();
  let u8 = new Uint8Array(arr);

  if (isGzipContent(ct, ce, url)) {
    try {
      u8 = new Uint8Array(await gunzipBuffer(u8));
    } catch {
      return reply.code(400).send({ ok: false, error: "Gzip decompress failed" });
    }
  }

  const sql = Buffer.from(u8).toString("utf8");
  const res = await runSqlImport({ sql, dryRun, truncateBefore });
  if (!res.ok) return reply.code(400).send(res);
  return reply.send(res);
}

// ── Import File: POST /admin/db/import-file ──────────────────────────────────

export async function adminImportSqlFromFile(req: FastifyRequest, reply: FastifyReply) {
  const mp = await (req as FastifyRequest & { file?: () => Promise<{ filename: string; toBuffer: () => Promise<Buffer>; fields: Record<string, unknown> }> }).file?.();
  if (!mp) return reply.code(400).send({ ok: false, error: "No file" });

  const ext = extname(mp.filename || "").toLowerCase();
  const buf: Buffer = await mp.toBuffer();
  let u8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

  if (ext === ".gz") {
    try {
      u8 = new Uint8Array(await gunzipBuffer(u8));
    } catch {
      return reply.code(400).send({ ok: false, error: "Gzip decompress failed" });
    }
  }

  const sql = Buffer.from(u8).toString("utf8");
  const fields = mp.fields || {};
  const truncateBefore =
    typeof fields.truncateBefore !== "undefined"
      ? String(fields.truncateBefore).toLowerCase() === "true"
      : String(fields.truncate_before_import ?? "").toLowerCase() === "true";

  const res = await runSqlImport({ sql, dryRun: false, truncateBefore });
  if (!res.ok) return reply.code(400).send(res);
  return reply.send(res);
}

// ── Snapshot: GET /admin/db/snapshots ────────────────────────────────────────

export async function adminListDbSnapshots(_req: FastifyRequest, reply: FastifyReply) {
  ensureSnapshotDir();
  const index = loadSnapshotIndex();

  const items = index
    .map((meta): DbSnapshotMeta | null => {
      if (!snapshotFileExists(meta.filename)) return null;
      try {
        const st = snapshotFileStat(meta.filename);
        return { ...meta, size_bytes: st.size, created_at: meta.created_at || st.mtime.toISOString() };
      } catch {
        return null;
      }
    })
    .filter((x): x is DbSnapshotMeta => x !== null)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return reply.send(items);
}

// ── Snapshot: POST /admin/db/snapshots ───────────────────────────────────────

const SnapshotCreateSchema = z.object({
  label: z.string().trim().min(1).max(255).optional(),
  note: z.string().trim().max(1000).optional(),
});

export async function adminCreateDbSnapshot(req: FastifyRequest, reply: FastifyReply) {
  const cfg = DB();
  ensureSnapshotDir();
  const body = SnapshotCreateSchema.parse(req.body || {});

  const stamp = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ts = `${stamp.getFullYear()}${pad(stamp.getMonth() + 1)}${pad(stamp.getDate())}_${pad(stamp.getHours())}${pad(stamp.getMinutes())}`;
  const id = randomBytes(8).toString("hex");
  const filename = `snapshot_${ts}_${id}.sql`;
  const fullPath = getSnapshotPath(filename);

  try {
    try {
      await runMysqlDumpAll(cfg, fullPath);
    } catch (err: unknown) {
      const msg = String(err instanceof Error ? err.message : "");
      if (msg.includes("ENOENT") || msg.includes("spawn_error")) {
        await dumpDbViaConnection(cfg, fullPath);
      } else {
        throw err;
      }
    }

    const st = snapshotFileStat(filename);
    const meta: DbSnapshotMeta = {
      id,
      filename,
      label: body.label ?? null,
      note: body.note ?? null,
      created_at: st.mtime.toISOString(),
      size_bytes: st.size,
    };

    const index = loadSnapshotIndex().filter((x) => x.id !== id);
    index.push(meta);
    saveSnapshotIndex(index);
    return reply.send(meta);
  } catch (err: unknown) {
    req.log.error({ err }, "db snapshot create failed");
    try { snapshotFileDelete(filename); } catch { /* ignore */ }
    const message = err instanceof Error ? err.message : "snapshot_create_failed";
    return reply.code(500).send({ ok: false, error: message });
  }
}

// ── Snapshot: POST /admin/db/snapshots/:id/restore ───────────────────────────

const SnapshotRestoreBody = z.object({
  dryRun: z.boolean().optional().default(false),
  truncateBefore: z.boolean().optional().default(true),
});

export async function adminRestoreDbSnapshot(req: FastifyRequest, reply: FastifyReply) {
  const { id } = (req.params || {}) as { id?: string };
  if (!id) return reply.code(400).send({ ok: false, error: "snapshot_id_required" });

  ensureSnapshotDir();
  const meta = loadSnapshotIndex().find((x) => x.id === id);
  if (!meta) return reply.code(404).send({ ok: false, error: "snapshot_not_found" });
  if (!snapshotFileExists(meta.filename)) return reply.code(404).send({ ok: false, error: "snapshot_file_missing" });

  const { dryRun, truncateBefore } = SnapshotRestoreBody.parse(req.body || {});

  try {
    const sql = snapshotFileRead(meta.filename);
    const res = await runSqlImport({ sql, dryRun, truncateBefore });
    if (!res.ok) return reply.code(400).send(res);
    return reply.send(res);
  } catch (err: unknown) {
    req.log.error({ err, id }, "db snapshot restore failed");
    const message = err instanceof Error ? err.message : "snapshot_restore_failed";
    return reply.code(500).send({ ok: false, error: message });
  }
}

// ── Snapshot: DELETE /admin/db/snapshots/:id ─────────────────────────────────

export async function adminDeleteDbSnapshot(req: FastifyRequest, reply: FastifyReply) {
  const { id } = (req.params || {}) as { id?: string };
  if (!id) return reply.code(400).send({ ok: false, error: "snapshot_id_required" });

  ensureSnapshotDir();
  const index = loadSnapshotIndex();
  const meta = index.find((x) => x.id === id);
  if (!meta) return reply.code(404).send({ ok: false, error: "snapshot_not_found" });

  try { snapshotFileDelete(meta.filename); } catch (err: unknown) {
    req.log.error({ err, id }, "snapshot file delete failed");
  }

  saveSnapshotIndex(index.filter((x) => x.id !== id));
  return reply.send({ ok: true, message: "snapshot_deleted" });
}
