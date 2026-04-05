import type { FastifyInstance } from 'fastify';
import { sql } from 'drizzle-orm';

export async function repoCheckHealth(app: FastifyInstance) {
  const rows = await app.db.execute(sql`SELECT 1 AS ok`);
  const first = Array.isArray(rows) ? rows[0] : (rows as any).rows?.[0];
  const dbOk = first?.ok === 1;
  const redisReply = app.redis ? await app.redis.ping().catch(() => 'FAIL') : 'SKIP';
  const redisOk = redisReply === 'PONG';

  return {
    status: dbOk && (app.redis ? redisOk : true) ? 'ok' : 'error',
    db: dbOk ? 'ok' : 'error',
    redis: app.redis ? (redisOk ? 'ok' : 'error') : 'disabled',
    uptime: process.uptime(),
  };
}
