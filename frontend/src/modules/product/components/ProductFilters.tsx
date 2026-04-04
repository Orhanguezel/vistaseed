"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { toLocalizedPath } from "@/i18n/routing";
import { addCompareSlug, clearCompareSlugs, getCompareSlugs, removeCompareSlug } from "@/lib/compare-storage";
import type { Product, ProductCategory } from "../product.type";
import { applyProductFilters, getAvailableSmartFilters, type ProductFilterValues, type SmartFilterGroup } from "../product-filters";
import ProductGrid from "./ProductGrid";

interface ProductFiltersProps {
  products: Product[];
  categories: ProductCategory[];
  initialFilters?: {
    search?: string;
    categoryId?: string;
    activeTag?: string;
    selectedType?: string;
    selectedCultivation?: string;
    selectedTaste?: string;
    selectedTolerance?: string;
  };
}

type ActiveFilterChip = {
  id: string;
  label: string;
  onRemove: () => void;
};

const FILTER_QUERY_KEYS = ["q", "category", "tag", "type", "cultivation", "taste", "tolerance"] as const;

function buildFilterParams(
  searchParams: URLSearchParams,
  values: ProductFilterValues,
) {
  const nextParams = new URLSearchParams(searchParams.toString());

  for (const key of FILTER_QUERY_KEYS) {
    nextParams.delete(key);
  }

  if (values.search.trim()) nextParams.set("q", values.search.trim());
  if (values.categoryId) nextParams.set("category", values.categoryId);
  if (values.activeTag) nextParams.set("tag", values.activeTag);
  if (values.selectedType) nextParams.set("type", values.selectedType);
  if (values.selectedCultivation) nextParams.set("cultivation", values.selectedCultivation);
  if (values.selectedTaste) nextParams.set("taste", values.selectedTaste);
  if (values.selectedTolerance) nextParams.set("tolerance", values.selectedTolerance);

  return nextParams;
}

export default function ProductFilters({ products, categories, initialFilters }: ProductFiltersProps) {
  const t = useTranslations("Products.list");
  const compareT = useTranslations("Compare");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const localePath = pathname ?? "/";
  const querySearch = searchParams.get("q") ?? "";
  const queryCategoryId = searchParams.get("category") ?? "";
  const queryTag = searchParams.get("tag") ?? "";
  const queryType = searchParams.get("type") ?? "";
  const queryCultivation = searchParams.get("cultivation") ?? "";
  const queryTaste = searchParams.get("taste") ?? "";
  const queryTolerance = searchParams.get("tolerance") ?? "";
  const [search, setSearch] = useState(initialFilters?.search ?? querySearch);
  const [categoryId, setCategoryId] = useState(initialFilters?.categoryId ?? queryCategoryId);
  const [activeTag, setActiveTag] = useState(initialFilters?.activeTag ?? queryTag);
  const [selectedType, setSelectedType] = useState(initialFilters?.selectedType ?? queryType);
  const [selectedCultivation, setSelectedCultivation] = useState(initialFilters?.selectedCultivation ?? queryCultivation);
  const [selectedTaste, setSelectedTaste] = useState(initialFilters?.selectedTaste ?? queryTaste);
  const [selectedTolerance, setSelectedTolerance] = useState(initialFilters?.selectedTolerance ?? queryTolerance);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => getCompareSlugs());
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    setSearch(querySearch);
    setCategoryId(queryCategoryId);
    setActiveTag(queryTag);
    setSelectedType(queryType);
    setSelectedCultivation(queryCultivation);
    setSelectedTaste(queryTaste);
    setSelectedTolerance(queryTolerance);
  }, [querySearch, queryCategoryId, queryTag, queryType, queryCultivation, queryTaste, queryTolerance]);

  useEffect(() => {
    const nextParams = buildFilterParams(searchParams, {
      search,
      categoryId,
      activeTag,
      selectedType,
      selectedCultivation,
      selectedTaste,
      selectedTolerance,
    });
    const nextQuery = nextParams.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) return;

    router.replace(nextQuery ? `${localePath}?${nextQuery}` : localePath, { scroll: false });
  }, [
    router,
    localePath,
    searchParams,
    search,
    categoryId,
    activeTag,
    selectedType,
    selectedCultivation,
    selectedTaste,
    selectedTolerance,
  ]);

  /* Tüm benzersiz tag'leri ürünlerden çıkart */
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const p of products) {
      for (const tag of p.tags) tagSet.add(tag);
    }
    return Array.from(tagSet).sort();
  }, [products]);

  const availableSmartFilters = useMemo(() => {
    return getAvailableSmartFilters(products);
  }, [products]);

  const filtered = useMemo(() => {
    return applyProductFilters(products, {
      search,
      categoryId,
      activeTag,
      selectedType,
      selectedCultivation,
      selectedTaste,
      selectedTolerance,
    });
  }, [products, search, categoryId, activeTag, selectedType, selectedCultivation, selectedTaste, selectedTolerance]);
  const activeFilterChips = useMemo<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];
    const selectedCategory = categories.find((category) => category.id === categoryId);

    if (search.trim()) {
      chips.push({
        id: "search",
        label: `${t("activeFilters.search")}: ${search.trim()}`,
        onRemove: () => setSearch(""),
      });
    }

    if (selectedCategory) {
      chips.push({
        id: "category",
        label: `${t("activeFilters.category")}: ${selectedCategory.name}`,
        onRemove: () => setCategoryId(""),
      });
    }

    if (activeTag) {
      chips.push({
        id: "tag",
        label: `${t("activeFilters.tag")}: ${activeTag}`,
        onRemove: () => setActiveTag(""),
      });
    }

    for (const group of availableSmartFilters) {
      const selectedValue = getSelectedValue(group.id);
      if (!selectedValue) continue;

      chips.push({
        id: group.id,
        label: `${t(`activeFilters.${group.id}`)}: ${t(`filters.${group.id}.options.${selectedValue}`)}`,
        onRemove: () => setSelectedValue(group.id, ""),
      });
    }

    return chips;
  }, [search, categories, categoryId, activeTag, availableSmartFilters, t, selectedType, selectedCultivation, selectedTaste, selectedTolerance]);

  const hasFilters = search || categoryId || activeTag || selectedType || selectedCultivation || selectedTaste || selectedTolerance;
  const selectedProducts = useMemo(() => {
    const bySlug = new Map(products.map((product) => [product.slug.toLowerCase(), product]));
    return selectedSlugs
      .map((slug) => bySlug.get(slug.toLowerCase()))
      .filter((product): product is Product => Boolean(product));
  }, [products, selectedSlugs]);
  const compareHref = `${toLocalizedPath(ROUTES.static.compare, localePath.split("/")[1] || "tr")}?slugs=${encodeURIComponent(selectedSlugs.join(","))}`;

  function clearAll() {
    setSearch("");
    setCategoryId("");
    setActiveTag("");
    setSelectedType("");
    setSelectedCultivation("");
    setSelectedTaste("");
    setSelectedTolerance("");
    setShareStatus("idle");
  }

  function toggleCompare(productSlug: string) {
    const key = productSlug.toLowerCase();
    if (selectedSlugs.some((s) => s.toLowerCase() === key)) {
      removeCompareSlug(productSlug);
    } else {
      addCompareSlug(productSlug);
    }
    setSelectedSlugs(getCompareSlugs());
  }

  function clearCompare() {
    clearCompareSlugs();
    setSelectedSlugs([]);
  }

  function getSelectedValue(groupId: SmartFilterGroup["id"]) {
    if (groupId === "type") return selectedType;
    if (groupId === "cultivation") return selectedCultivation;
    if (groupId === "taste") return selectedTaste;
    return selectedTolerance;
  }

  function setSelectedValue(groupId: SmartFilterGroup["id"], value: string) {
    if (groupId === "type") setSelectedType(value);
    else if (groupId === "cultivation") setSelectedCultivation(value);
    else if (groupId === "taste") setSelectedTaste(value);
    else setSelectedTolerance(value);
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("copied");
    } catch {
      setShareStatus("error");
    }
  }

  useEffect(() => {
    if (shareStatus === "idle") return;
    const timeout = window.setTimeout(() => setShareStatus("idle"), 2400);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar filters */}
      <aside className="lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-20 space-y-6">
          {/* Search */}
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="w-full h-10 px-3 text-sm rounded-xl bg-surface border border-border text-foreground placeholder:text-faint outline-none focus:border-brand/40 transition-colors"
            />
          </div>

          {availableSmartFilters.map((group) => {
            const selectedValue = getSelectedValue(group.id);
            return (
              <div key={group.id}>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                  {t(`filters.${group.id}.label`)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedValue(group.id, selectedValue === option.id ? "" : option.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        selectedValue === option.id
                          ? "bg-brand text-white"
                          : "bg-bg-alt text-muted hover:text-foreground"
                      }`}
                    >
                      {t(`filters.${group.id}.options.${option.id}`)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Category */}
          {categories.length > 0 && (
            <div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setCategoryId("")}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !categoryId ? "bg-brand/10 text-brand font-bold" : "text-foreground hover:bg-bg-alt"
                  }`}
                >
                  {t("allCategories")}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      categoryId === c.id ? "bg-brand/10 text-brand font-bold" : "text-foreground hover:bg-bg-alt"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags (DB'den gelen) */}
          {allTags.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTag === tag
                        ? "bg-brand text-white"
                        : "bg-bg-alt text-muted hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="w-full py-2 text-xs font-bold text-danger hover:underline"
            >
              {t("clearFilters")}
            </button>
          )}

          {/* Result count */}
          <p className="text-xs text-muted">
            {t("resultCount", { count: filtered.length })}
          </p>
        </div>
      </aside>

      {/* Product grid */}
      <div className="flex-1 min-w-0">
        {activeFilterChips.length > 0 && (
          <div className="mb-6 rounded-2xl border border-border bg-surface/60 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="mr-2 text-[11px] font-black uppercase tracking-[0.24em] text-muted-foreground">
                  {t("activeFilters.title")}
                </p>
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand/10"
                  >
                    <span>{chip.label}</span>
                    <span className="text-muted-foreground">×</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand/30 hover:text-brand"
                >
                  {t("share.action")}
                </button>
                {shareStatus === "copied" && <p className="text-xs text-brand">{t("share.copied")}</p>}
                {shareStatus === "error" && <p className="text-xs text-danger">{t("share.error")}</p>}
              </div>
            </div>
          </div>
        )}
        {selectedProducts.length > 0 && (
          <div className="mb-6 rounded-2xl border border-brand/20 bg-brand/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {compareT("selectedCount", { count: selectedProducts.length })}
                </p>
                <p className="text-sm text-muted-foreground">{compareT("trayHint")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {selectedProducts.length >= 2 && (
                  <Link href={compareHref} className="inline-flex items-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                    {compareT("compareNow")}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={clearCompare}
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  {compareT("clear")}
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleCompare(product.slug)}
                  className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <span>{product.title}</span>
                  <span className="text-muted-foreground">×</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <ProductGrid
          products={filtered}
          emptyMessage={t("noResults")}
          selectedSlugs={selectedSlugs}
          onToggleCompare={toggleCompare}
        />
      </div>
    </div>
  );
}
