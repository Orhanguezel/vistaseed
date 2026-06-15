// src/app.ts
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import type { FastifyStaticOptions } from '@fastify/static';
import type { FastifyInstance, FastifyRequest } from 'fastify';

import authPlugin from './plugins/authPlugin';
import mysqlPlugin from '@/plugins/mysql';
import redisPlugin from '@/plugins/redis';
import sentryPlugin from '@/plugins/sentry';
import swaggerPlugin from '@/plugins/swagger';
import { env } from '@/core/env';
import { registerErrorHandlers } from '@agro/shared-backend/core/error';
import { loggerConfig } from '@agro/shared-backend/core/logger';
import { requestLoggerPlugin } from '@agro/shared-backend/modules/audit/requestLogger.plugin';
import { getStorageSettings } from '@agro/shared-backend/modules/siteSettings';
import { registerAllRoutes } from './routes';
import { parseCorsOrigins, pickUploadsRoot, pickUploadsPrefix } from './app.helpers';

const setUploadSeoHeaders: NonNullable<FastifyStaticOptions['setHeaders']> = (res, filePath) => {
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (normalizedPath.includes('/offers/') || normalizedPath.includes('/support/library/')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
};

function firstHeader(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function isLoopbackIp(ip?: string): boolean {
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
}

function rateLimitKey(req: FastifyRequest): string {
  return firstHeader(req.headers['cf-connecting-ip']) || req.ip;
}

function isInternalBuildRequest(req: FastifyRequest): boolean {
  const token = process.env.INTERNAL_BUILD_TOKEN || '';
  if (token && firstHeader(req.headers['x-internal-build']) === token) return true;
  const forwarded = firstHeader(req.headers['x-forwarded-for']);
  const cloudflareIp = firstHeader(req.headers['cf-connecting-ip']);
  return isLoopbackIp(req.ip) && !forwarded && !cloudflareIp;
}

export async function createApp() {
  const { default: buildFastify } =
    (await import('fastify')) as unknown as { default: typeof import('fastify').default };

  const app = buildFastify({ logger: loggerConfig, trustProxy: true }) as FastifyInstance;

  // ── Plugins ────────────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: parseCorsOrigins(env.CORS_ORIGIN),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 'Authorization', 'Prefer', 'Accept', 'Accept-Language',
      'x-skip-auth', 'Range',
    ],
    exposedHeaders: ['x-total-count', 'content-range', 'range'],
  });

  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
    },
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: 'access_token', signed: false },
  });

  const uploadsPrefix = pickUploadsPrefix(null);
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: rateLimitKey,
    allowList: (req: FastifyRequest) => {
      const url = req.url || '';
      return url.startsWith(uploadsPrefix) || isInternalBuildRequest(req);
    },
  });

  await app.register(authPlugin);
  await app.register(mysqlPlugin);
  // await app.register(redisPlugin);
  await app.register(sentryPlugin);
  await app.register(swaggerPlugin);

  await app.register(multipart, {
    throwFileSizeLimit: true,
    limits: { fileSize: 20 * 1024 * 1024 },
  });

  // ── Static uploads ─────────────────────────────────────────────────────────
  let storageSettings: Awaited<ReturnType<typeof getStorageSettings>> | null = null;
  try { storageSettings = await getStorageSettings(); } catch { /* ignore */ }

  await app.register(fastifyStatic, {
    root: pickUploadsRoot(storageSettings?.localRoot),
    prefix: pickUploadsPrefix(storageSettings?.localBaseUrl),
    decorateReply: false,
    setHeaders: setUploadSeoHeaders,
  });

  // ── Content parsers ────────────────────────────────────────────────────────
  app.addContentTypeParser(
    'application/x-www-form-urlencoded',
    { parseAs: 'string' },
    (_req, body, done) => {
      try { done(null, Object.fromEntries(new URLSearchParams(body as string))); }
      catch { done(null, {}); }
    },
  );

  // ── Audit logger ───────────────────────────────────────────────────────────
  await app.register(requestLoggerPlugin);

  // ── Routes ─────────────────────────────────────────────────────────────────
  await registerAllRoutes(app);

  // ── Error handlers ─────────────────────────────────────────────────────────
  registerErrorHandlers(app);

  return app;
}
