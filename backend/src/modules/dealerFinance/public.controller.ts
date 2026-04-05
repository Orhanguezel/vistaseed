// GET /dealers/public — onaylı bayiler (harita / liste)
import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  parsePage,
  handleRouteError,
  sendValidationError,
  setContentRange,
} from '@agro/shared-backend/modules/_shared';
import { publicDealersQuerySchema } from './validation';
import { repoCountPublicDealers, repoListPublicDealers } from './repository';

export async function listPublicDealers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const raw = req.query as Record<string, string>;
    const parsed = publicDealersQuerySchema.safeParse(raw);
    if (!parsed.success) return sendValidationError(reply, parsed.error.issues);

    const { page, limit, offset } = parsePage(raw, { maxLimit: 50 });
    const filters = {
      q: parsed.data.q,
      city: parsed.data.city,
      region: parsed.data.region,
    };

    const total = await repoCountPublicDealers(filters);
    const rows = await repoListPublicDealers({
      ...filters,
      limit,
      offset,
    });

    const data = rows.map((row) => ({
      id: row.id,
      company_name: row.company_name,
      city: row.city ?? null,
      region: row.region ?? null,
      latitude: row.latitude !== null && row.latitude !== undefined ? String(row.latitude) : null,
      longitude: row.longitude !== null && row.longitude !== undefined ? String(row.longitude) : null,
      phone: row.phone ?? null,
    }));

    setContentRange(reply, offset, limit, total);
    return reply.send({ data, page, limit, total });
  } catch (e) {
    return handleRouteError(reply, req, e, 'dealers_public_list');
  }
}
