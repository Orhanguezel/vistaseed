import type { FastifyRequest, FastifyReply } from 'fastify';
import { pool } from '@/db/client';
import { env } from '@/core/env';
import { handleRouteError } from '@agro/shared-backend/modules/_shared';

type FeedItem = {
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  image: string | null;
  publishedAt: string | null;
  type: string;
  url: string;
};

export async function getContentFederation(req: FastifyRequest, reply: FastifyReply) {
  try {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.ECOSYSTEM_API_KEY || 'eco-secret-123';

    if (apiKey !== expectedKey && env.NODE_ENV === 'production') {
      return reply.status(403).send({ error: 'Invalid API Key' });
    }

    const { type, limit = '20', offset = '0', locale = 'tr' } = req.query as any;
    const l = parseInt(limit, 10) || 20;
    const o = parseInt(offset, 10) || 0;

    const items: FeedItem[] = [];
    const baseUrl = env.FRONTEND_URL.replace(/\/$/, '');

    // 1. BLOG
    if (!type || type === 'blog') {
      const [rows] = await pool.execute(
        `SELECT i.title, i.slug, i.excerpt, p.image_url, p.published_at
         FROM blog_posts p
         INNER JOIN blog_posts_i18n i ON i.blog_post_id = p.id AND i.locale = ?
         WHERE p.status = 'published' AND p.is_active = 1
         ORDER BY p.published_at DESC LIMIT ? OFFSET ?`,
        [locale, l, o]
      ) as [any[], any];

      items.push(...rows.map((r: any) => ({
        title: r.title ?? null,
        slug: r.slug ?? null,
        excerpt: r.excerpt ?? null,
        image: r.image_url ?? null,
        publishedAt: r.published_at ?? null,
        type: 'blog',
        url: `${baseUrl}/${locale}/blog/${r.slug}`,
      })));
    }

    // 2. PRODUCTS
    if (!type || type === 'product') {
      const [rows] = await pool.execute(
        `SELECT i.title, i.slug, i.description AS excerpt, p.image_url, p.created_at AS published_at
         FROM products p
         INNER JOIN product_i18n i ON i.product_id = p.id AND i.locale = ?
         WHERE p.is_active = 1
         ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
        [locale, l, o]
      ) as [any[], any];

      items.push(...rows.map((r: any) => ({
        title: r.title ?? null,
        slug: r.slug ?? null,
        excerpt: r.excerpt ?? null,
        image: r.image_url ?? null,
        publishedAt: r.published_at ?? null,
        type: 'product',
        url: `${baseUrl}/${locale}/urunler/${r.slug}`,
      })));
    }

    // 3. LIBRARY / PLANTING GUIDE
    if (!type || type === 'knowledge' || type === 'planting-guide') {
      const [rows] = await pool.execute(
        `SELECT i.name AS title, i.slug, i.description AS excerpt, l.image_url, l.created_at AS published_at, l.type AS lib_type
         FROM library l
         INNER JOIN library_i18n i ON i.library_id = l.id AND i.locale = ?
         WHERE l.is_active = 1
         ORDER BY l.created_at DESC LIMIT ? OFFSET ?`,
        [locale, l, o]
      ) as [any[], any];

      items.push(...rows.map((r: any) => ({
        title: r.title ?? null,
        slug: r.slug ?? null,
        excerpt: r.excerpt ? String(r.excerpt).substring(0, 160) : null,
        image: r.image_url ?? null,
        publishedAt: r.published_at ?? null,
        type: r.lib_type === 'guide' ? 'planting-guide' : 'knowledge',
        url: r.lib_type === 'guide'
          ? `${baseUrl}/${locale}/ekim-rehberi/${r.slug}`
          : `${baseUrl}/${locale}/bilgi-bankasi/${r.slug}`,
      })));
    }

    // 4. DEALERS
    if (!type || type === 'dealer') {
      const [rows] = await pool.execute(
        `SELECT dp.company_name, dp.id, dp.city, dp.region, dp.created_at
         FROM dealer_profiles dp
         INNER JOIN users u ON u.id = dp.user_id
         WHERE dp.is_approved = 1 AND dp.list_public = 1 AND u.is_active = 1
         ORDER BY dp.created_at DESC LIMIT ? OFFSET ?`,
        [l, o]
      ) as [any[], any];

      items.push(...rows.map((r: any) => ({
        title: r.company_name ?? null,
        slug: r.id ?? null,
        excerpt: `${r.city ?? ''} / ${r.region ?? ''}`,
        image: null,
        publishedAt: r.created_at ?? null,
        type: 'dealer',
        url: `${baseUrl}/${locale}/bayi-agi`,
      })));
    }

    return reply.send({
      source: 'vistaseed',
      items: items
        .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
        .slice(0, l),
    });
  } catch (e) {
    return handleRouteError(reply, req, e, 'ecosystem_content');
  }
}

export async function ssoVerify(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { token } = req.body as any;
    if (!token) return reply.status(400).send({ error: 'Token is required' });

    if (token === 'test-token') {
      return reply.send({
        valid: true,
        user: {
          ecosystem_id: 'mock-eco-id-123',
          email: 'eco-user@example.com',
          role: 'user',
          full_name: 'Ecosystem Explorer',
        },
      });
    }

    return reply.status(401).send({ valid: false, message: 'Invalid or expired token' });
  } catch (e) {
    return handleRouteError(reply, req, e, 'ecosystem_sso_verify');
  }
}
