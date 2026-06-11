// src/modules/twitter-content/repository.ts
// İçerik motoru DB sorguları — aktif ürünler (tr)

import { desc, eq, and } from 'drizzle-orm';
import { db } from '@/db/client';
import { products, productI18n } from '@agro/shared-backend/modules/products';
import { env } from '@/core/env';

const PRODUCT_PATH = 'urunler';

export type TwitterProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  productUrl: string;
};

export function buildProductUrl(slug: string): string {
  const base = env.FRONTEND_URL.replace(/\/$/, '');
  return `${base}/${env.FRONTEND_DEFAULT_LOCALE}/${PRODUCT_PATH}/${slug}`;
}

/** Aktif ürünleri (varsayılan locale içeriğiyle) son güncellenenden başlayarak döner. */
export async function repoGetTwitterProducts(limit = 50): Promise<TwitterProduct[]> {
  const rows = await db
    .select({
      id: products.id,
      imageUrl: products.image_url,
      title: productI18n.title,
      slug: productI18n.slug,
      description: productI18n.description,
    })
    .from(products)
    .innerJoin(
      productI18n,
      and(eq(productI18n.product_id, products.id), eq(productI18n.locale, env.FRONTEND_DEFAULT_LOCALE)),
    )
    .where(and(eq(products.is_active, true), eq(products.item_type, 'product')))
    .orderBy(desc(products.updated_at))
    .limit(Math.max(1, Math.min(50, limit)));

  return rows.map((row) => ({
    id: String(row.id),
    title: String(row.title || ''),
    slug: String(row.slug || row.id),
    description: String(row.description || ''),
    imageUrl: row.imageUrl ? String(row.imageUrl) : null,
    productUrl: buildProductUrl(String(row.slug || row.id)),
  }));
}
