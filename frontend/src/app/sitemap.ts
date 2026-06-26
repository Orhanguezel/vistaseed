import type { MetadataRoute } from "next";
import { appLocales, defaultLocale, toLocalizedPath } from "@/i18n/routing";
import { getPublicApiV1, getPublicSiteOrigin } from "@/lib/runtime-config";

const SITE_URL = getPublicSiteOrigin();
const API_V1 = getPublicApiV1();

interface ProductSitemapItem {
  slug: string;
  updated_at?: string;
}

interface BlogSitemapItem {
  slug: string;
  updated_at?: string;
}

async function fetchBlogPostsForSitemap(): Promise<BlogSitemapItem[]> {
  try {
    const res = await fetch(
      `${API_V1}/blog?limit=50&page=1&locale=${encodeURIComponent(defaultLocale)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.data ?? [];
    return rows.map((p: BlogSitemapItem) => ({
      slug: p.slug,
      updated_at: p.updated_at,
    }));
  } catch {
    return [];
  }
}

async function fetchCategoriesForSitemap(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(`${API_V1}/categories?locale=${encodeURIComponent(defaultLocale)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.data ?? [];
    return rows.filter((c: { slug?: string }) => c.slug).map((c: { slug: string }) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

async function fetchActiveProducts(): Promise<ProductSitemapItem[]> {
  try {
    const res = await fetch(`${API_V1}/products?limit=500&is_active=true&locale=${encodeURIComponent(defaultLocale)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : data.data ?? []).map((p: ProductSitemapItem) => ({
      slug: p.slug,
      updated_at: p.updated_at,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchActiveProducts();
  const blogPosts = await fetchBlogPostsForSitemap();
  const categories = await fetchCategoriesForSitemap();
  const now = new Date().toISOString().split("T")[0];

  const publicPages = [
    { path: "/", changeFrequency: "daily" as const, priority: 1 },
    { path: "/urunler", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/hakkimizda", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/insan-kaynaklari", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.65 },
    { path: "/karsilastirma", changeFrequency: "monthly" as const, priority: 0.55 },
    { path: "/bayi-agi", changeFrequency: "monthly" as const, priority: 0.55 },
    { path: "/toplu-satis", changeFrequency: "monthly" as const, priority: 0.55 },
    { path: "/siparis-ver", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/sss", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/iletisim", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/gizlilik-politikasi", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/iade-politikasi", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/kullanim-kosullari", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const staticPages: MetadataRoute.Sitemap = publicPages.flatMap((page) =>
    appLocales.map((locale) => ({
      url: `${SITE_URL}${toLocalizedPath(page.path, locale)}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          appLocales.map((altLocale) => [altLocale, `${SITE_URL}${toLocalizedPath(page.path, altLocale)}`]),
        ),
      },
    })),
  );

  const blogPages: MetadataRoute.Sitemap = blogPosts.flatMap((p) =>
    [defaultLocale].map((locale) => ({
      url: `${SITE_URL}${toLocalizedPath(`/blog/${p.slug}`, locale)}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          [defaultLocale].map((altLocale) => [altLocale, `${SITE_URL}${toLocalizedPath(`/blog/${p.slug}`, altLocale)}`]),
        ),
      },
    })),
  );

  const productPages: MetadataRoute.Sitemap = products.flatMap((p) =>
    appLocales.map((locale) => ({
      url: `${SITE_URL}${toLocalizedPath(`/urunler/${p.slug}`, locale)}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          appLocales.map((altLocale) => [altLocale, `${SITE_URL}${toLocalizedPath(`/urunler/${p.slug}`, altLocale)}`]),
        ),
      },
    })),
  );

  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((c) =>
    [defaultLocale].map((locale) => ({
      url: `${SITE_URL}${toLocalizedPath(`/urunler/kategori/${c.slug}`, locale)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
      alternates: {
        languages: Object.fromEntries(
          [defaultLocale].map((altLocale) => [altLocale, `${SITE_URL}${toLocalizedPath(`/urunler/kategori/${c.slug}`, altLocale)}`]),
        ),
      },
    })),
  );

  return [...staticPages, ...blogPages, ...productPages, ...categoryPages];
}
