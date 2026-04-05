import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { db } from '@/db/client';
import { and, desc, eq, sql } from 'drizzle-orm';
import { env } from '@/core/env';

// Schemas
import { blogPosts, blogPostsI18n } from '../blog/schema';
import { dealerProfiles } from '../dealerFinance/schema';
import { users } from '@agro/shared-backend/modules/auth/schema';
import { products, productI18n } from '@agro/shared-backend/modules/products/schema';
import { library, libraryI18n } from '@agro/shared-backend/modules/library/schema';

// Helpers
import { handleRouteError } from '@agro/shared-backend/modules/_shared';

export async function getContentFederation(req: FastifyRequest, reply: FastifyReply) {
  try {
    // API KEY CHECK (P2.3)
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.ECOSYSTEM_API_KEY || 'eco-secret-123';
    
    if (apiKey !== expectedKey && env.NODE_ENV === 'production') {
      return reply.status(403).send({ error: 'Invalid API Key' });
    }

    const { type, limit = '20', offset = '0', locale = 'tr' } = req.query as any;
    const l = parseInt(limit, 10) || 20;
    const o = parseInt(offset, 10) || 0;

    const items: any[] = [];
    const baseUrl = env.FRONTEND_URL.replace(/\/$/, '');

    // 1. BLOG
    if (!type || type === 'blog') {
      const rows = await db
        .select({
          title: blogPostsI18n.title,
          slug: blogPostsI18n.slug,
          excerpt: blogPostsI18n.excerpt,
          image: blogPosts.image_url,
          publishedAt: blogPosts.published_at,
        })
        .from(blogPosts)
        .innerJoin(blogPostsI18n, and(eq(blogPostsI18n.blog_post_id, blogPosts.id), eq(blogPostsI18n.locale, locale)))
        .where(and(eq(blogPosts.status, 'published'), eq(blogPosts.is_active, 1)))
        .orderBy(desc(blogPosts.published_at))
        .limit(l)
        .offset(o);

      items.push(...rows.map(r => ({
        ...r,
        type: 'blog',
        url: `${baseUrl}/${locale}/blog/${r.slug}`,
      })));
    }

    // 2. PRODUCTS
    if (!type || type === 'product') {
      const rows = await db
        .select({
          title: productI18n.title,
          slug: productI18n.slug,
          excerpt: productI18n.description,
          image: products.image_url,
          publishedAt: products.created_at,
        })
        .from(products)
        .innerJoin(productI18n, and(eq(productI18n.product_id, products.id), eq(productI18n.locale, locale)))
        .where(sql`${products.is_active} = 1`)
        .orderBy(desc(products.created_at))
        .limit(l)
        .offset(o);

      items.push(...rows.map(r => ({
        ...r,
        type: 'product',
        url: `${baseUrl}/${locale}/urunler/${r.slug}`,
      })));
    }

    // 3. LIBRARY / PLANTING GUIDE
    if (!type || type === 'knowledge' || type === 'planting-guide') {
      const rows = await db
        .select({
          title: libraryI18n.name,
          slug: libraryI18n.slug,
          excerpt: libraryI18n.description,
          image: library.image_url,
          publishedAt: library.created_at,
          libType: library.type,
        })
        .from(library)
        .innerJoin(libraryI18n, and(eq(libraryI18n.library_id, library.id), eq(libraryI18n.locale, locale)))
        .where(sql`${library.is_active} = 1`)
        .orderBy(desc(library.created_at))
        .limit(l)
        .offset(o);

      items.push(...rows.map(r => ({
        title: r.title,
        slug: r.slug,
        excerpt: (r.excerpt || '').substring(0, 160),
        image: r.image,
        publishedAt: r.publishedAt,
        type: r.libType === 'guide' ? 'planting-guide' : 'knowledge',
        url: r.libType === 'guide' 
          ? `${baseUrl}/${locale}/ekim-rehberi/${r.slug}` 
          : `${baseUrl}/${locale}/bilgi-bankasi/${r.slug}`,
      })));
    }

    // 4. DEALERS
    if (!type || type === 'dealer') {
      const rows = await db
        .select({
          title: dealerProfiles.company_name,
          slug: dealerProfiles.id,
          city: dealerProfiles.city,
          region: dealerProfiles.region,
          publishedAt: dealerProfiles.created_at,
        })
        .from(dealerProfiles)
        .innerJoin(users, eq(users.id, dealerProfiles.user_id))
        .where(and(eq(dealerProfiles.is_approved, 1), eq(dealerProfiles.list_public, 1), eq(users.is_active, 1)))
        .orderBy(desc(dealerProfiles.created_at))
        .limit(l)
        .offset(o);

      items.push(...rows.map(r => ({
        title: r.title,
        slug: r.slug,
        excerpt: `${r.city} / ${r.region}`,
        image: null,
        publishedAt: r.publishedAt,
        type: 'dealer',
        url: `${baseUrl}/${locale}/bayi-agi`,
      })));
    }

    return reply.send({
      source: 'vistaseed',
      items: items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, l),
    });
  } catch (e) {
    return handleRouteError(reply, req, e, 'ecosystem_content');
  }
}

/**
 * SSO Verify Stub (P2.4)
 * Future: Validates a JWT token from another ecosystem platform
 */
export async function ssoVerify(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { token, target_platform } = req.body as any;
    if (!token) return reply.status(400).send({ error: 'Token is required' });

    // For now, this is a stub that returns a mock success if token is "test-token"
    // In P3, this will use jwt.verify and check ecosystem_id
    if (token === 'test-token') {
      return reply.send({
        valid: true,
        user: {
          ecosystem_id: 'mock-eco-id-123',
          email: 'eco-user@example.com',
          role: 'user',
          full_name: 'Ecosystem Explorer'
        }
      });
    }

    return reply.status(401).send({ valid: false, message: 'Invalid or expired token' });
  } catch (e) {
    return handleRouteError(reply, req, e, 'ecosystem_sso_verify');
  }
}
