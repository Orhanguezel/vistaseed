"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, X, MapPin, SlidersHorizontal } from "lucide-react";
import { API } from "@/config/api-endpoints";
import BayiMap from "@/modules/dealer-network/bayi-map";
import type { PublicDealer } from "@/modules/dealer-network/types";
import { DealerCard, DealerCardSkeleton } from "@/modules/dealer-network/dealer-components";

const BASE_URL = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");

export default function DealersNetworkClient() {
  const t = useTranslations("DealersNetwork");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [dealers, setDealers] = React.useState<PublicDealer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const q = searchParams.get("q") ?? "";
  const city = searchParams.get("city") ?? "";
  const region = searchParams.get("region") ?? "";

  const [form, setForm] = React.useState({ q, city, region });

  React.useEffect(() => {
    setForm({ q, city, region });
  }, [q, city, region]);

  React.useEffect(() => {
    const qs = new URLSearchParams({ locale, limit: "100", page: "1" });
    if (q) qs.set("q", q);
    if (city) qs.set("city", city);
    if (region) qs.set("region", region);

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}${API.dealers.public}?${qs.toString()}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("fetch");
        return res.json() as Promise<{ data: PublicDealer[] }>;
      })
      .then((json) => {
        if (!cancelled) setDealers(json.data ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("fetchError"));
          setDealers([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q, city, region, locale, t]);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (form.q.trim()) p.set("q", form.q.trim());
    if (form.city.trim()) p.set("city", form.city.trim());
    if (form.region.trim()) p.set("region", form.region.trim());
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const clearFilters = () => {
    setForm({ q: "", city: "", region: "" });
    router.push(pathname);
  };

  const hasFilters = q || city || region;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* ── Section 1: Hero Header ── */}
      <section className="bg-surface border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
           <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand mb-4">{t("meta.title")}</p>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none">{t("title")}</h1>
           <p className="mt-8 text-xl text-muted-foreground/80 max-w-2xl leading-relaxed">{t("description")}</p>
        </div>
      </section>

      {/* ── Section 2: Full-Bleed Map & Floating Search ── */}
      <section className="relative w-full h-[600px] md:h-[700px] bg-surface-alt border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <BayiMap 
            dealers={dealers} 
            emptyLabel={t("mapEmpty")} 
            mapHint={t("mapHint")} 
            height="100%" 
            rounded={false}
          />
        </div>

        {/* Floating Premium Search Portal */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-10">
          <div className="bg-white/80 dark:bg-navy-mid/90 backdrop-blur-2xl p-2 rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col md:flex-row items-center gap-2">
            
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-brand transition-transform group-focus-within:scale-110" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={form.q}
                onChange={(e) => setForm(f => ({ ...f, q: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && applyFilters(e as any)}
                className="w-full bg-transparent pl-14 pr-6 py-5 text-sm font-medium outline-none text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="h-10 w-px bg-border/40 hidden md:block" />

            <div className="relative flex-none w-full md:w-56 group">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-brand" />
              <input
                type="text"
                placeholder={t("cityPlaceholder")}
                value={form.city}
                onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && applyFilters(e as any)}
                className="w-full bg-transparent pl-14 pr-6 py-5 text-sm font-medium outline-none text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            <button
               onClick={applyFilters}
               className="w-full md:w-auto bg-brand text-white px-8 py-4 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-brand-dark transition-all active:scale-95 shadow-xl shadow-brand/20 flex items-center justify-center gap-2"
            >
              {t("search")}
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="p-4 text-muted-foreground hover:text-destructive transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Active Filters Result Count Bubbles */}
          {!loading && dealers.length > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="bg-brand/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {dealers.length} {t("resultCount")}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 3: Detailed Results Grid ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
         <div className="flex items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">{t("listTitle")}</h2>
              <p className="text-muted-foreground mt-2">{t("listSection")}</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="h-px w-24 bg-border/50 hidden md:block" />
               <SlidersHorizontal className="h-5 w-5 text-muted-foreground/40" />
            </div>
         </div>

         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1, 2, 3, 4, 5, 6].map(i => <DealerCardSkeleton key={i} />)}
            </div>
         ) : dealers.length === 0 ? (
            <div className="py-24 text-center rounded-[3rem] border border-dashed border-border/60 bg-surface-alt/40">
               <Search className="h-12 w-12 text-muted-foreground/20 mx-auto mb-6" />
               <p className="text-lg font-medium text-muted-foreground">{t("listEmpty")}</p>
               <button onClick={clearFilters} className="mt-6 text-brand font-black uppercase tracking-widest text-xs hover:underline">
                  {t("clear")}
               </button>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {dealers.map((d) => (
                  <DealerCard key={d.id} dealer={d} t={t} />
               ))}
            </div>
         )}
      </section>

      {error && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 p-4 rounded-2xl bg-destructive text-destructive-foreground shadow-2xl animate-in slide-in-from-bottom-5">
          <X className="h-5 w-5" />
          <span className="font-bold">{error}</span>
        </div>
      )}
    </div>
  );
}
