import type { FastifyReply, FastifyRequest } from "fastify";
import type { RowDataPacket } from "mysql2/promise";

import { pool } from "@/db/client";
import { handleRouteError } from "@agro/shared-backend/modules/_shared";

type PaymentAttemptsQuery = {
  limit?: string;
  offset?: string;
  provider?: string;
  status?: string;
  q?: string;
};

type PaymentAttemptRow = RowDataPacket & {
  id: string;
  order_id: string;
  payment_ref: string;
  provider: string;
  status: "pending" | "succeeded" | "failed" | "expired";
  amount: string | number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  order_status: string | null;
  order_payment_status: string | null;
  order_payment_method: string | null;
};

type CountRow = RowDataPacket & { total: number };

function toLimit(raw?: string): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return 20;
  return Math.min(parsed, 100);
}

function toOffset(raw?: string): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

function buildFilters(query: PaymentAttemptsQuery) {
  const where: string[] = [];
  const values: unknown[] = [];

  const provider = (query.provider ?? "").trim().toLowerCase();
  if (provider) {
    where.push("LOWER(pa.provider) = ?");
    values.push(provider);
  }

  const status = (query.status ?? "").trim().toLowerCase();
  if (status) {
    where.push("LOWER(pa.status) = ?");
    values.push(status);
  }

  const q = (query.q ?? "").trim();
  if (q) {
    const like = `%${q}%`;
    where.push(
      "(pa.id LIKE ? OR pa.order_id LIKE ? OR pa.payment_ref LIKE ? OR COALESCE(pa.last_error, '') LIKE ?)",
    );
    values.push(like, like, like, like);
  }

  return {
    clause: where.length ? `WHERE ${where.join(" AND ")}` : "",
    values,
  };
}

export async function adminListPaymentAttempts(
  req: FastifyRequest<{ Querystring: PaymentAttemptsQuery }>,
  reply: FastifyReply,
) {
  try {
    const limit = toLimit(req.query.limit);
    const offset = toOffset(req.query.offset);
    const { clause, values } = buildFilters(req.query);

    const [rows] = await pool.query<PaymentAttemptRow[]>(
      `
        SELECT
          pa.id,
          pa.order_id,
          pa.payment_ref,
          pa.provider,
          pa.status,
          pa.amount,
          pa.last_error,
          pa.created_at,
          pa.updated_at,
          o.status AS order_status,
          o.payment_status AS order_payment_status,
          o.payment_method AS order_payment_method
        FROM payment_attempts pa
        LEFT JOIN orders o ON o.id = pa.order_id
        ${clause}
        ORDER BY pa.created_at DESC
        LIMIT ?
        OFFSET ?
      `,
      [...values, limit, offset],
    );

    const [countRows] = await pool.query<CountRow[]>(
      `
        SELECT COUNT(*) AS total
        FROM payment_attempts pa
        LEFT JOIN orders o ON o.id = pa.order_id
        ${clause}
      `,
      values,
    );

    return reply.send({
      data: rows.map((row) => ({
        ...row,
        amount: Number.parseFloat(String(row.amount ?? 0)),
      })),
      total: Number(countRows[0]?.total ?? 0),
      limit,
      offset,
    });
  } catch (err) {
    return handleRouteError(reply, req, err, "payment_attempts_list_failed");
  }
}
