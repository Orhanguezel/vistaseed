"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LayoutGrid, List, Search } from "lucide-react";
import { fetchDealerCatalog } from "@/modules/dealer/dealer.service";
import type { DealerCatalogProduct } from "@/modules/dealer/dealer.type";
import type { DealerSharedCatalogState } from "@/modules/dealer/use-dealer-shared-catalog";
import { resolveImageUrl } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { localePath } from "@/lib/locale-path";

type ViewMode = "list" | "grid";

type Props = {
  locale: string;
  /** Verilirse tek API istegi (ust hook); arama istemci tarafinda filtrelenir. */
  shared?: DealerSharedCatalogState;
};

export function DealerCatalogPanel({ locale, shared }: Props) {
  const t = useTranslations("Dashboard.dealerCatalog");
  const [view, setView] = React.useState<ViewMode>("grid");
  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [internalItems, setInternalItems] = React.useState<DealerCatalogProduct[]>([]);
  const [discountRate, setDiscountRate] = React.useState(0);
  const [loading, setLoading] = React.useState(!shared);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => window.clearTimeout(id);
  }, [q]);

  React.useEffect(() => {
    if (shared) return;
    let cancelled = false;
    setLoading(true);
    setErr(null);
    fetchDealerCatalog({
      locale,
      q: debouncedQ || undefined,
      limit: 200,
      offset: 0,
    })
      .then((res) => {
        if (!cancelled) {
          setInternalItems(res.data);
          setDiscountRate(res.discount_rate);
        }
      })
      .catch(() => {
        if (!cancelled) setErr("load_failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale, debouncedQ, shared]);

  const baseItems = shared?.products ?? internalItems;
  const effectiveDiscount = shared ? shared.discountRate : discountRate;
  const effectiveLoading = shared ? shared.loading : loading;
  const effectiveErr = shared ? shared.error : Boolean(err);

  const displayItems = React.useMemo(() => {
    const needle = debouncedQ.toLowerCase();
    if (!needle) return baseItems;
    return baseItems.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        (p.product_code?.toLowerCase().includes(needle) ?? false),
    );
  }, [baseItems, debouncedQ]);

  const fmt = (s: string) =>
    Number.parseFloat(s).toLocaleString("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    });

  const thumb = (p: DealerCatalogProduct) => {
    const first = p.images?.[0];
    return resolveImageUrl(first || p.image_url || null);
  };

  return (
    <section id="dealer-catalog" className="scroll-mt-28 space-y-6 mb-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">{t("title")}</h2>
          <p className="text-sm text-muted mt-1">{t("subtitle")}</p>
          <p className="text-xs font-bold text-brand mt-2">
            {t("discountLabel", { rate: effectiveDiscount.toFixed(2) })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border/15 bg-surface text-sm font-medium"
            />
          </div>
          <div className="flex rounded-2xl border border-border/15 p-1 bg-bg-alt/40">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                view === "list" ? "bg-brand text-white shadow" : "text-muted"
              }`}
            >
              <List className="w-4 h-4" />
              {t("listView")}
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                view === "grid" ? "bg-brand text-white shadow" : "text-muted"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              {t("gridView")}
            </button>
          </div>
        </div>
      </div>

      {effectiveErr && (
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-sm font-medium text-red-600">
          {t("loadError")}
        </div>
      )}

      {effectiveLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : view === "list" ? (
        <div className="surface-elevated rounded-4xl border border-border/10 overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[720px]">
            <thead>
              <tr className="bg-bg-alt/50 border-b border-border/5">
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted">
                  {t("colProduct")}
                </th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted">
                  {t("colCode")}
                </th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted">
                  {t("colCategory")}
                </th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted text-right">
                  {t("colList")}
                </th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted text-right">
                  {t("colUnit")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {displayItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-muted italic">
                    {t("empty")}
                  </td>
                </tr>
              ) : (
                displayItems.map((p) => (
                  <tr key={p.id} className="hover:bg-bg-alt/20">
                    <td className="px-5 py-4">
                      <Link
                        href={localePath(locale, ROUTES.products.detail(p.slug))}
                        className="font-bold text-foreground hover:text-brand"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted">{p.product_code ?? "—"}</td>
                    <td className="px-5 py-4 text-sm text-muted">{p.category?.name ?? "—"}</td>
                    <td className="px-5 py-4 text-right font-mono text-sm">{fmt(p.list_price)}</td>
                    <td className="px-5 py-4 text-right font-black text-brand">{fmt(p.unit_price)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayItems.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted italic">{t("empty")}</div>
          ) : (
            displayItems.map((p) => (
              <article
                key={p.id}
                className="surface-elevated rounded-4xl border border-border/10 overflow-hidden flex flex-col"
              >
                <Link
                  href={localePath(locale, ROUTES.products.detail(p.slug))}
                  className="relative aspect-4/3 bg-bg-alt/40 block"
                >
                  <Image
                    src={thumb(p)}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-4"
                  />
                </Link>
                <div className="p-6 flex flex-col gap-3 grow">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted">
                    {p.product_code ?? "—"}
                  </div>
                  <h3 className="text-lg font-black leading-tight">
                    <Link href={localePath(locale, ROUTES.products.detail(p.slug))} className="hover:text-brand">
                      {p.title}
                    </Link>
                  </h3>
                  <div className="mt-auto pt-2 flex justify-between items-baseline gap-2 border-t border-border/10">
                    <div>
                      <div className="text-[9px] font-black uppercase text-muted">{t("colList")}</div>
                      <div className="text-sm font-mono line-through text-muted">{fmt(p.list_price)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-black uppercase text-brand">{t("colUnit")}</div>
                      <div className="text-xl font-black text-brand">{fmt(p.unit_price)}</div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}
