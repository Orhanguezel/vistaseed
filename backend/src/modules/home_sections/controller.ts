// src/modules/home_sections/controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { repoFindActiveLayout } from './repository';

export async function getHomeLayoutPublic(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await repoFindActiveLayout();
    return reply.send(data);
  } catch {
    return reply.code(500).send({ message: 'server_error' });
  }
}
