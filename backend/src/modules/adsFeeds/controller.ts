import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@/core/env';
import { pool } from '@/db/client';
import { handleRouteError } from '@agro/shared-backend/modules/_shared';

type Locale = 'tr';

type FeedProductRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price: string | number | null;
  stock_quantity: number | null;
  product_code: string | null;
  category_name: string | null;
  category_slug: string | null;
  updated_at: string | Date | null;
};

const LOCALE: Locale = 'tr';
const SITE_ORIGIN = env.FRONTEND_URL.replace(/\/+$/, '');
const STATIC_PAGES = [
  {
    url: `${SITE_ORIGIN}/${LOCALE}/teklif-al`,
    label: 'teklif',
  },
  {
    url: `${SITE_ORIGIN}/${LOCALE}/urunler`,
    label: 'urunler',
  },
  {
    url: `${SITE_ORIGIN}/${LOCALE}/toplu-satis`,
    label: 'toplu-satis',
  },
  {
    url: `${SITE_ORIGIN}/${LOCALE}/iletisim`,
    label: 'iletisim',
  },
] as const;

function csvEscape(value: string | number | null | undefined): string {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function tsvEscape(value: string | number | null | undefined): string {
  return (value == null ? '' : String(value))
    .replace(/\t/g, ' ')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function absoluteImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${SITE_ORIGIN}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
}

function productUrl(row: FeedProductRow): string {
  return `${SITE_ORIGIN}/${LOCALE}/urunler/${row.slug}`;
}

function categoryLabel(row: FeedProductRow): string {
  return row.category_slug ? `kategori-${row.category_slug}` : 'urun';
}

function normalizeDescription(row: FeedProductRow): string {
  const fallback = `${row.title} profesyonel sebze tohumu hakkında bilgi alın ve Vista Seeds ekibinden teklif isteyin.`;
  return (row.description || fallback).replace(/\s+/g, ' ').trim().slice(0, 5000);
}

function availability(_row: FeedProductRow): string {
  return 'in_stock';
}

async function fetchFeedProducts(): Promise<FeedProductRow[]> {
  const [rows] = await pool.execute(
    `SELECT
       p.id,
       i.title,
       i.slug,
       i.description,
       p.image_url,
       p.price,
       p.stock_quantity,
       p.product_code,
       ci.name AS category_name,
       ci.slug AS category_slug,
       p.updated_at
     FROM products p
     INNER JOIN product_i18n i
       ON i.product_id = p.id AND i.locale = ?
     LEFT JOIN category_i18n ci
       ON ci.category_id = p.category_id AND ci.locale = ?
     WHERE p.is_active = 1
       AND p.item_type = 'product'
     ORDER BY p.order_num ASC, i.title ASC`,
    [LOCALE, LOCALE],
  ) as [FeedProductRow[], unknown];

  return rows;
}

export async function getGoogleAdsPageFeed(req: FastifyRequest, reply: FastifyReply) {
  try {
    const products = await fetchFeedProducts();
    const rows = [
      ['Page URL', 'Custom label'],
      ...STATIC_PAGES.map((page) => [page.url, page.label]),
      ...products.map((product) => [productUrl(product), `urun;${categoryLabel(product)}`]),
    ];

    reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Cache-Control', 'public, max-age=900, s-maxage=3600');

    return reply.send(rows.map((row) => row.map(csvEscape).join(',')).join('\n'));
  } catch (error) {
    return handleRouteError(reply, req, error, 'google_ads_page_feed');
  }
}

export async function getGoogleMerchantProductFeed(req: FastifyRequest, reply: FastifyReply) {
  try {
    const products = await fetchFeedProducts();
    const headers = [
      'id',
      'title',
      'description',
      'link',
      'image_link',
      'availability',
      'price',
      'brand',
      'condition',
      'product_type',
      'mpn',
      'identifier_exists',
    ];
    const rows = products.map((product) => [
      product.product_code || product.id,
      product.title,
      normalizeDescription(product),
      productUrl(product),
      absoluteImageUrl(product.image_url),
      availability(product),
      `${Number(product.price ?? 0).toFixed(2)} TRY`,
      'Vista Seeds',
      'new',
      product.category_name || 'Sebze tohumu',
      product.product_code || product.id,
      'yes',
    ]);

    reply
      .header('Content-Type', 'text/tab-separated-values; charset=utf-8')
      .header('Cache-Control', 'public, max-age=900, s-maxage=3600');

    return reply.send([headers, ...rows].map((row) => row.map(tsvEscape).join('\t')).join('\n'));
  } catch (error) {
    return handleRouteError(reply, req, error, 'google_merchant_product_feed');
  }
}
