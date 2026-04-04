"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Trash2, ShoppingBag, Info, Star } from "lucide-react";
import { API } from "@/config/api-endpoints";
import { ROUTES } from "@/config/routes";
import {
  clearCompareSlugs,
  getCompareSlugs,
  removeCompareSlug,
  setCompareSlugs,
  COMPARE_MAX,
} from "@/lib/compare-storage";
import { resolveImageUrl } from "@/lib/utils";
import { toLocalizedPath } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "@/modules/product/product.type";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");

type CompareResponse = { data: Product[]; requested: number; matched: number };
type CompareSpecGroupKey = "overview" | "cultivation" | "environment" | "commercial";

function normalizeSpecKey(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveCompareSpecGroup(name: string): CompareSpecGroupKey {
  const key = normalizeSpecKey(name);

  if (
    key.includes("yetistirme") ||
    key.includes("cultivation") ||
    key.includes("anbau") ||
    key.includes("kullanim") ||
    key.includes("usage") ||
    key.includes("einsatz") ||
    key.includes("alan") ||
    key.includes("donem") ||
    key.includes("window")
  ) {
    return "cultivation";
  }

  if (
    key.includes("tolerans") ||
    key.includes("tolerance") ||
    key.includes("iklim") ||
    key.includes("climate") ||
    key.includes("toprak") ||
    key.includes("soil") ||
    key.includes("water") ||
    key.includes("gunes") ||
    key.includes("sun") ||
    key.includes("sicak") ||
    key.includes("heat") ||
    key.includes("hitz") ||
    key.includes("soguk") ||
    key.includes("cold")
  ) {
    return "environment";
  }

  if (
    key.includes("ticari") ||
    key.includes("commercial") ||
    key.includes("handels") ||
    key.includes("dayanim") ||
    key.includes("durability") ||
    key.includes("raf") ||
    key.includes("tat") ||
    key.includes("geschmack") ||
    key.includes("kalite")
  ) {
    return "commercial";
  }

  return "overview";
}

function SectionRow({ label, columns }: { label: string; columns: number }) {
  return (
    <tr className="bg-brand/[0.06]">
      <td className="p-4 font-black text-[10px] uppercase tracking-[0.24em] text-brand sticky left-0 bg-brand/[0.06] backdrop-blur-md z-10 border-r border-brand/10">
        {label}
      </td>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="border-l border-brand/10" />
      ))}
    </tr>
  );
}

function getProductImageTreatment(product: Product) {
  const isRootstock = product.category?.slug === "anac" || product.slug === "avar";

  if (isRootstock) {
    return {
      frameClass: "bg-gradient-to-br from-emerald-50 via-white to-lime-50",
      imageClass: "object-contain p-2 sm:p-3 scale-[1.03]",
    };
  }

  return {
    frameClass: "bg-bg-alt/50",
    imageClass: "object-contain p-4",
  };
}

function formatClimateZonesClient(zones: string[] | undefined, tP: (key: string) => string): string {
  if (!zones?.length) return "—";
  return zones.map((z) => tP(`detail.agEnum.climate.${z}`)).join(", ");
}

function formatPlantingSeasonsClient(seasons: string[] | undefined, tP: (key: string) => string): string {
  if (!seasons?.length) return "—";
  return seasons.map((season) => tP(`detail.agEnum.season.${season}`)).join(", ");
}

function formatSoilTypesClient(soilTypes: string[] | undefined, tP: (key: string) => string): string {
  if (!soilTypes?.length) return "—";
  return soilTypes.map((soil) => tP(`detail.agEnum.soil.${soil}`)).join(", ");
}

function formatWaterClient(w: string | null | undefined, tP: (key: string) => string): string {
  if (!w) return "—";
  return tP(`detail.agEnum.water.${w}`);
}

function formatSunClient(s: string | null | undefined, tP: (key: string) => string): string {
  if (!s) return "—";
  return tP(`detail.agEnum.sun.${s}`);
}

function formatTempRange(min: number | null | undefined, max: number | null | undefined): string {
  if (min == null && max == null) return "—";
  if (min != null && max != null) return `${min}°C / ${max}°C`;
  return `${min ?? "—"}°C / ${max ?? "—"}°C`;
}

function parseSlugsFromSearch(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseIdsFromSearch(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function mergeUniqueSlugs(a: string[], b: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of [...a, ...b]) {
    const k = x.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
    if (out.length >= COMPARE_MAX) break;
  }
  return out;
}

function mergeUniqueIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (!UUID_RE.test(id)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= COMPARE_MAX) break;
  }
  return out;
}

function replaceCompareQuery(slugs: string[]) {
  const sp = new URLSearchParams(window.location.search);
  sp.set("slugs", slugs.join(","));
  sp.delete("ids");
  const q = sp.toString();
  window.history.replaceState(null, "", q ? `${window.location.pathname}?${q}` : window.location.pathname);
}

export default function ComparePageClient() {
  const t = useTranslations("Compare");
  const tProducts = useTranslations("Products");
  const locale = useLocale() as AppLocale;
  const searchParams = useSearchParams();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const slugFromUrl = parseSlugsFromSearch(searchParams.get("slugs"));
    const idsFromUrl = mergeUniqueIds(parseIdsFromSearch(searchParams.get("ids")));
    const fromStore = getCompareSlugs();

    const runSlugFetch = async (mergedSlugs: string[]) => {
      if (mergedSlugs.join(",") !== fromStore.join(",")) {
        setCompareSlugs(mergedSlugs);
      }
      if (mergedSlugs.length < 2) {
        setProducts([]);
        setLoading(false);
        setError(null);
        return;
      }
      if (typeof window !== "undefined") {
        replaceCompareQuery(mergedSlugs);
      }
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({
          slugs: mergedSlugs.join(","),
          locale,
        });
        const res = await fetch(`${BASE_URL}${API.products.compare}?${qs.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(
            typeof err?.error?.detail === "string" ? err.error.detail : t("fetchError"),
          );
          setProducts([]);
          return;
        }
        const json = (await res.json()) as CompareResponse;
        setProducts(json.data ?? []);
        if (json.matched < json.requested) {
          setError(t("mismatch"));
        }
      } catch {
        setError(t("fetchError"));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (slugFromUrl.length > 0) {
      await runSlugFetch(mergeUniqueSlugs(slugFromUrl, fromStore));
      return;
    }

    if (idsFromUrl.length > 0) {
      if (idsFromUrl.length < 2) {
        setProducts([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({
          ids: idsFromUrl.join(","),
          locale,
        });
        const res = await fetch(`${BASE_URL}${API.products.compare}?${qs.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(
            typeof err?.error?.detail === "string" ? err.error.detail : t("fetchError"),
          );
          setProducts([]);
          return;
        }
        const json = (await res.json()) as CompareResponse;
        const list = json.data ?? [];
        setProducts(list);
        const slugs = list.map((p) => p.slug);
        setCompareSlugs(slugs);
        if (typeof window !== "undefined" && slugs.length >= 2) {
          replaceCompareQuery(slugs);
        }
        if (json.matched < json.requested) {
          setError(t("mismatch"));
        }
      } catch {
        setError(t("fetchError"));
        setProducts([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    await runSlugFetch(fromStore);
  }, [searchParams, locale, t]);

  React.useEffect(() => {
    load();
  }, [load]);

  const specKeys = React.useMemo(() => {
    const keys = new Set<string>();
    for (const p of products) {
      const spec = p.specifications;
      if (spec && typeof spec === "object") {
        Object.keys(spec).forEach((k) => keys.add(k));
      }
    }
    return Array.from(keys).sort();
  }, [products]);

  const groupedSpecKeys = React.useMemo(() => {
    const groups: Record<CompareSpecGroupKey, string[]> = {
      overview: [],
      cultivation: [],
      environment: [],
      commercial: [],
    };

    for (const key of specKeys) {
      groups[resolveCompareSpecGroup(key)].push(key);
    }

    return groups;
  }, [specKeys]);

  const listHref = toLocalizedPath(ROUTES.products.list, locale);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter text-foreground mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">{t("subtitle")}</p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-brand animate-pulse">
          <div className="w-5 h-5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <span className="font-bold uppercase tracking-widest text-xs">{t("loading")}</span>
        </div>
      )}

      {!loading && products.length < 2 && (
        <div className="rounded-3xl border border-dashed border-border-soft bg-surface/50 p-12 text-center">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-brand" />
          </div>
          <p className="text-xl font-bold text-foreground mb-4">{t("empty")}</p>
          <Link 
            href={listHref} 
            className="inline-flex items-center justify-center px-6 py-3 bg-brand text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-brand-dark transition-all"
          >
            {t("browseProducts")}
          </Link>
        </div>
      )}

      {error && products.length >= 2 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
          <Info className="w-4 h-4" />
          {error}
        </div>
      )}

      {!loading && products.length >= 2 && (
        <>
          <div className="flex justify-start mb-8">
            <button
              type="button"
              onClick={() => {
                clearCompareSlugs();
                setProducts([]);
                window.history.replaceState(null, "", `${window.location.pathname}`);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors text-xs font-black uppercase tracking-widest"
            >
              <Trash2 className="h-4 w-4" />
              {t("clear")}
            </button>
          </div>

          <div className="overflow-x-auto rounded-[2rem] border border-border-soft bg-surface shadow-2xl shadow-brand/5 relative">
            <table className="w-full text-sm min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-border-soft">
                  <th className="text-left p-6 font-black text-xs uppercase tracking-widest text-muted-foreground w-48 sticky left-0 bg-surface/95 backdrop-blur-md z-20 border-r border-border-soft/50">
                    {t("attribute")}
                  </th>
                  {products.map((p) => (
                    <th key={p.id} className="p-6 text-left align-top min-w-[250px] group">
                      {(() => {
                        const imageTreatment = getProductImageTreatment(p);
                        return (
                      <div className="flex flex-col gap-4">
                        <div className={`relative w-full aspect-square rounded-2xl overflow-hidden border border-border-soft/50 group-hover:border-brand/30 transition-all duration-500 ${imageTreatment.frameClass}`}>
                          <Image
                            src={resolveImageUrl(p.image_url)}
                            alt=""
                            fill
                            className={`${imageTreatment.imageClass} group-hover:scale-105 transition-transform duration-700`}
                            sizes="250px"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 hover:bg-destructive hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow-lg"
                            onClick={() => {
                              removeCompareSlug(p.slug);
                              load();
                            }}
                            title={t("remove")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-brand uppercase tracking-widest opacity-60">
                            {p.category?.name}
                          </div>
                          <Link
                            href={toLocalizedPath(ROUTES.products.detail(p.slug), locale)}
                            className="text-base font-black text-foreground hover:text-brand transition-colors line-clamp-2 tracking-tight"
                          >
                            {p.title}
                          </Link>
                        </div>
                      </div>
                        );
                      })()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft/50">
                <SectionRow label={t("sections.overview")} columns={products.length} />
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowCode")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 font-bold text-foreground/80">
                      {p.product_code ?? "—"}
                    </td>
                  ))}
                </tr>

                <SectionRow label={t("sections.environment")} columns={products.length} />
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowBotanical")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80">
                      {p.botanical_name?.trim() || "—"}
                    </td>
                  ))}
                </tr>
                <SectionRow label={t("sections.cultivation")} columns={products.length} />
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowClimate")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80 leading-relaxed">
                      {formatClimateZonesClient(p.climate_zones, tProducts)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowPlanting")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80 leading-relaxed">
                      {formatPlantingSeasonsClient(p.planting_seasons, tProducts)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowSoil")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80 leading-relaxed">
                      {formatSoilTypesClient(p.soil_types, tProducts)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowHarvestDays")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80">
                      {p.harvest_days != null ? String(p.harvest_days) : "—"}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowTemp")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80">
                      {formatTempRange(p.min_temp, p.max_temp)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowWater")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80">
                      {formatWaterClient(p.water_need, tProducts)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowSun")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80">
                      {formatSunClient(p.sun_exposure, tProducts)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowDepth")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80">
                      {p.seed_depth_cm != null ? `${p.seed_depth_cm} cm` : "—"}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowYield")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80">
                      {p.yield_per_sqm?.trim() || "—"}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowGermination")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80">
                      {p.germination_days != null ? String(p.germination_days) : "—"}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowSpacing")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5 text-foreground/80">
                      {p.row_spacing_cm != null || p.plant_spacing_cm != null
                        ? `${p.row_spacing_cm ?? "—"} / ${p.plant_spacing_cm ?? "—"}`
                        : "—"}
                    </td>
                  ))}
                </tr>

                <SectionRow label={t("sections.commercial")} columns={products.length} />
                {/* Price (Conditional B2B logic) */}
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowPrice")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5">
                      <span className="text-xs font-bold text-muted-foreground italic">{t("priceContact")}</span>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50">
                    {t("rowRating")}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5">
                      {p.review_count > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-foreground">{p.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-muted-foreground">({p.review_count})</span>
                        </div>
                      ) : "—"}
                    </td>
                  ))}
                </tr>

                {/* Specs */}
                {(["overview", "cultivation", "environment", "commercial"] as CompareSpecGroupKey[]).map((groupKey) => (
                  <React.Fragment key={groupKey}>
                    {groupedSpecKeys[groupKey].length > 0 && (
                      <SectionRow label={t(`sections.${groupKey}`)} columns={products.length} />
                    )}
                    {groupedSpecKeys[groupKey].map((key) => (
                      <tr key={key} className="hover:bg-bg-alt/30 transition-colors">
                        <td className="p-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface/95 backdrop-blur-md z-10 border-r border-border-soft/50 italic">
                          {key}
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="p-5 text-foreground/70 leading-relaxed">
                            {(p.specifications && p.specifications[key]) ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
