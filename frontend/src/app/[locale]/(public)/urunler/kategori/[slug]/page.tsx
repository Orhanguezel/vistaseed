import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { API } from "@/config/api-endpoints";
import { getServerApiOrigin } from "@/lib/runtime-config";
import { appLocales, defaultLocale, toLocalizedPath } from "@/i18n/routing";
import { ROUTES } from "@/config/routes";
import { getLocaleAlternates } from "@/lib/seo";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, siteOrigin } from "@/lib/schema-org";
import JsonLd from "@/components/seo/JsonLd";
import ProductCard from "@/modules/product/components/ProductCard";
import type { Product, ProductCategory } from "@/modules/product/product.type";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const BASE_URL = getServerApiOrigin();

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return fallback;
    const data = await res.json();
    return (Array.isArray(data) ? data : data.data ?? data) as T;
  } catch {
    return fallback;
  }
}

async function getCategories(locale: string): Promise<ProductCategory[]> {
  const url = `${BASE_URL}${API.products.categories}?locale=${locale}`;
  const rows = await fetchJson<ProductCategory[]>(url, []);
  if (rows.length > 0 || locale === defaultLocale) return rows;
  return fetchJson<ProductCategory[]>(`${BASE_URL}${API.products.categories}?locale=${defaultLocale}`, []);
}

async function getProducts(locale: string): Promise<Product[]> {
  const url = `${BASE_URL}${API.products.list}?is_active=true&locale=${locale}&sort=order_num&order=asc`;
  const rows = await fetchJson<Product[]>(url, []);
  if (rows.length > 0 || locale === defaultLocale) return rows;
  return fetchJson<Product[]>(`${BASE_URL}${API.products.list}?is_active=true&locale=${defaultLocale}&sort=order_num&order=asc`, []);
}

function findCategory(categories: ProductCategory[], slug: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}

/** customPages içeriği {"html":"..."} JSON veya düz HTML olarak gelebilir. */
function extractHtml(content: string | null | undefined): string {
  if (!content) return "";
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed.html === "string") return parsed.html;
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

export async function generateStaticParams() {
  const categories = await getCategories(defaultLocale);
  return categories.filter((c) => c.slug).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const [categories, page] = await Promise.all([
    getCategories(locale),
    getCustomPageBySlug(`kategori-${slug}`, locale).catch(() => null),
  ]);
  const category = findCategory(categories, slug);
  if (!category) return {};

  const title = page?.meta_title || category.meta_title || `${category.name} | Vista Seeds`;
  const description = page?.meta_description || category.meta_description || category.description || undefined;
  const alternates = getLocaleAlternates(locale, `/urunler/kategori/${slug}`);

  return {
    title,
    description,
    alternates,
    robots: { index: true, follow: true },
    openGraph: { title, description: description ?? undefined },
  };
}

export default async function CategoryLandingPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const [categories, products, page, t] = await Promise.all([
    getCategories(locale),
    getProducts(locale),
    getCustomPageBySlug(`kategori-${slug}`, locale).catch(() => null),
    getTranslations({ locale, namespace: "Products.list" }),
  ]);

  const category = findCategory(categories, slug);
  if (!category) notFound();

  const categoryProducts = products.filter((p) => p.category?.id === category.id);
  const html = extractHtml(page?.content);
  const intro = page?.summary || category.description || "";

  const origin = siteOrigin();
  const productsHref = toLocalizedPath(ROUTES.products.list, locale);
  const orderHref = toLocalizedPath(ROUTES.static.request_offer, locale);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Vista Seeds", url: `${origin}${toLocalizedPath("/", locale)}` },
    { name: t("title"), url: `${origin}${productsHref}` },
    { name: category.name, url: `${origin}${toLocalizedPath(`/urunler/kategori/${slug}`, locale)}` },
  ]);

  const itemListLd = buildItemListJsonLd(
    categoryProducts.map((p) => ({
      name: p.title,
      url: `${origin}${toLocalizedPath(`/urunler/${p.slug}`, locale)}`,
      image: p.image_url ?? p.images?.[0] ?? null,
    })),
  );

  return (
    <div className="bg-background min-h-screen">
      <JsonLd type="BreadcrumbList" data={breadcrumbLd} />
      {categoryProducts.length > 0 && <JsonLd type="ItemList" data={itemListLd} />}

      <section className="border-b border-border-soft bg-bg-alt">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">Vista Seeds</p>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">{category.name}</h1>
          {intro ? <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{intro}</p> : null}
        </div>
      </section>

      {categoryProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {html ? (
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <article
            className="prose prose-neutral max-w-none prose-headings:font-extrabold prose-a:text-brand"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-border-soft bg-bg-alt p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-base font-medium text-foreground">{intro || category.name}</p>
          <div className="flex shrink-0 gap-3">
            <Link href={orderHref} className="rounded-full bg-brand px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-brand-dark">
              Sipariş / Teklif Al
            </Link>
            <Link href={productsHref} className="rounded-full border border-border-soft px-6 py-3 text-sm font-black uppercase tracking-widest text-foreground transition hover:border-brand">
              Tüm Ürünler
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
