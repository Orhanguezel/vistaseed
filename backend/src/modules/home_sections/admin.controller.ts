// src/modules/home_sections/admin.controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  repoFindAllSections,
  repoFindSectionById,
  repoInsertSection,
  repoUpdateSection,
  repoDeleteSection,
  repoMaxOrderIndex,
  rowToAdminDto,
} from './repository';
import {
  createHomeSectionSchema,
  patchHomeSectionSchema,
  reorderHomeSectionsSchema,
} from './validation';

type IdParams = { Params: { id: string } };

function isDuplicateError(e: unknown): boolean {
  return (e as { code?: string })?.code === 'ER_DUP_ENTRY';
}

export async function adminListHomeSections(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const rows = await repoFindAllSections();
    return reply.send(rows.map(rowToAdminDto));
  } catch {
    return reply.code(500).send({ message: 'server_error' });
  }
}

export async function adminGetHomeSection(req: FastifyRequest<IdParams>, reply: FastifyReply) {
  try {
    const row = await repoFindSectionById(req.params.id);
    if (!row) return reply.code(404).send({ message: 'not_found' });
    return reply.send(rowToAdminDto(row));
  } catch {
    return reply.code(500).send({ message: 'server_error' });
  }
}

export async function adminCreateHomeSection(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = createHomeSectionSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ errors: parsed.error.flatten() });
    }
    const b = parsed.data;
    const nextOrder = b.order_index ?? (await repoMaxOrderIndex()) + 10;
    const id = await repoInsertSection({
      slug: b.slug,
      label: b.label,
      componentKey: b.component_key,
      orderIndex: nextOrder,
      isActive: b.is_active ?? 1,
      config: b.config ?? null,
    });
    const row = await repoFindSectionById(id);
    return reply.code(201).send(row ? rowToAdminDto(row) : { id });
  } catch (e) {
    if (isDuplicateError(e)) {
      return reply.code(409).send({ message: 'duplicate_slug' });
    }
    return reply.code(500).send({ message: 'server_error' });
  }
}

export async function adminPatchHomeSection(req: FastifyRequest<IdParams>, reply: FastifyReply) {
  try {
    const existing = await repoFindSectionById(req.params.id);
    if (!existing) return reply.code(404).send({ message: 'not_found' });

    const parsed = patchHomeSectionSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ errors: parsed.error.flatten() });
    }
    const b = parsed.data;
    await repoUpdateSection(req.params.id, {
      slug: b.slug,
      label: b.label,
      componentKey: b.component_key,
      orderIndex: b.order_index,
      isActive: b.is_active,
      config: b.config === undefined ? undefined : b.config,
    });
    const row = await repoFindSectionById(req.params.id);
    return reply.send(row ? rowToAdminDto(row) : { id: req.params.id });
  } catch (e) {
    if (isDuplicateError(e)) {
      return reply.code(409).send({ message: 'duplicate_slug' });
    }
    return reply.code(500).send({ message: 'server_error' });
  }
}

export async function adminDeleteHomeSection(req: FastifyRequest<IdParams>, reply: FastifyReply) {
  try {
    const existing = await repoFindSectionById(req.params.id);
    if (!existing) return reply.code(404).send({ message: 'not_found' });
    await repoDeleteSection(req.params.id);
    return reply.code(204).send();
  } catch {
    return reply.code(500).send({ message: 'server_error' });
  }
}

export async function adminReorderHomeSections(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = reorderHomeSectionsSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ errors: parsed.error.flatten() });
    }
    let count = 0;
    for (const it of parsed.data.items) {
      await repoUpdateSection(it.id, { orderIndex: it.order_index });
      count += 1;
    }
    return reply.send({ ok: true, count });
  } catch {
    return reply.code(500).send({ message: 'server_error' });
  }
}
