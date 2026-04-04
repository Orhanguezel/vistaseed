import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo";
import { API } from "@/config/api-endpoints";
import ProductFilters from "@/modules/product/components/ProductFilters";
import { applyProductFilters, findCategoryName } from "@/modules/product/product-filters";
import type { Product, ProductCategory } from "@/modules/product/product.type";

export const revalidate = 300;

interface LocalePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

type ProductsListTranslations = Awaited<ReturnType<typeof getTranslations<"Products.list">>>;

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = searchParams[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export async function generateMetadata({ params, searchParams }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  return buildProductsMetadata(locale, resolvedSearchParams);
}

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");
async function getProducts(locale: string): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE_URL}${API.products.list}?is_active=true&locale=${locale}&sort=order_num&order=asc`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

async function getCategories(locale: string): Promise<ProductCategory[]> {
  try {
    const res = await fetch(`${BASE_URL}${API.products.categories}?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

function buildActiveFilterLabels(
  searchParams: Record<string, string | string[] | undefined>,
  categories: ProductCategory[],
  t: ProductsListTranslations,
) {
  const labels: string[] = [];
  const search = readSearchParam(searchParams, "q").trim();
  const categoryId = readSearchParam(searchParams, "category");
  const activeTag = readSearchParam(searchParams, "tag");
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const smartGroups = ["type", "cultivation", "taste", "tolerance"] as const;

  if (search) {
    labels.push(`${t("activeFilters.search")}: ${search}`);
  }

  if (selectedCategory) {
    labels.push(`${t("activeFilters.category")}: ${selectedCategory.name}`);
  }

  if (activeTag) {
    labels.push(`${t("activeFilters.tag")}: ${activeTag}`);
  }

  for (const group of smartGroups) {
    const value = readSearchParam(searchParams, group);
    if (!value) continue;
    labels.push(`${t(`activeFilters.${group}`)}: ${t(`filters.${group}.options.${value}`)}`);
  }

  return labels;
}

async function buildProductsMetadata(
  locale: string,
  searchParams: Record<string, string | string[] | undefined>,
): Promise<Metadata> {
  const [baseMetadata, categories, t] = await Promise.all([
    getPageMetadata("products", {
      locale,
      pathname: "/urunler",
    }),
    getCategories(locale),
    getTranslations({ locale, namespace: "Products.list" }),
  ]);

  const activeLabels = buildActiveFilterLabels(searchParams, categories, t);

  if (activeLabels.length === 0) {
    return baseMetadata;
  }

  const filters = activeLabels.join(", ");
  const title = t("meta.filteredTitle", { filters, title: t("title") });
  const description = t("meta.filteredDescription", { filters, title: t("title") });

  return {
    ...baseMetadata,
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
    },
  };
}

function getInitialFilters(searchParams: Record<string, string | string[] | undefined>) {
  return {
    search: readSearchParam(searchParams, "q"),
    categoryId: readSearchParam(searchParams, "category"),
    activeTag: readSearchParam(searchParams, "tag"),
    selectedType: readSearchParam(searchParams, "type"),
    selectedCultivation: readSearchParam(searchParams, "cultivation"),
    selectedTaste: readSearchParam(searchParams, "taste"),
    selectedTolerance: readSearchParam(searchParams, "tolerance"),
  };
}

export default async function ProductsPage({ params, searchParams }: LocalePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: "Products.list" });
  const [products, categories] = await Promise.all([getProducts(locale), getCategories(locale)]);
  const initialFilters = getInitialFilters(resolvedSearchParams);
  const filteredProducts = applyProductFilters(products, initialFilters);
  const activeLabels = buildActiveFilterLabels(resolvedSearchParams, categories, t);
  const selectedCategoryName = findCategoryName(categories, initialFilters.categoryId);
  const introText =
    activeLabels.length > 0
      ? t("intro.filtered", {
          count: filteredProducts.length,
          filters: activeLabels.join(", "),
        })
      : t("intro.default", {
          count: products.length,
          category: selectedCategoryName ?? t("allCategories"),
        });

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">{t("title")}</h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">{introText}</p>
        </div>

        <ProductFilters
          products={products}
          categories={categories}
          initialFilters={initialFilters}
        />
      </div>
    </div>
  );
}
