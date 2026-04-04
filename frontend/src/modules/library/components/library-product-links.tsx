"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MoveRight, Loader2 } from "lucide-react";
import { API } from "@/config/api-endpoints";
import { resolveImageUrl } from "@/lib/utils";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  summary?: string;
}

interface LibraryProductLinksProps {
  tags?: string;
  locale: string;
}

export function LibraryProductLinks({ tags, locale }: LibraryProductLinksProps) {
  const t = useTranslations("Library.relatedProducts");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!tags) {
      setLoading(false);
      return;
    }

    const qs = new URLSearchParams({ 
      locale, 
      tags, 
      limit: "3", 
      is_active: "true" 
    });

    fetch(`${BASE_URL}${API.products.list}?${qs.toString()}`)
      .then(res => res.json())
      .then(json => {
        const rows = Array.isArray(json) ? json : json.data ?? [];
        setProducts(rows);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [tags, locale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-20 pt-20 border-t border-border-soft">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-brand">{t("kicker")}</h3>
          <h2 className="text-3xl font-black tracking-tighter text-foreground">{t("title")}</h2>
        </div>
        <Link 
          href={`/${locale}/urunler`}
          className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-brand transition-colors"
        >
          {t("seeAll")}
          <MoveRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p) => (
          <Link 
            key={p.id} 
            href={`/${locale}/urunler/${p.slug}`}
            className="group flex flex-col surface-elevated overflow-hidden hover:border-brand/40 transition-all p-4 rounded-3xl"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-surface-alt">
              {p.image_url && (
                <img 
                  src={resolveImageUrl(p.image_url)} 
                  alt={p.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                />
              )}
            </div>
            <h4 className="text-lg font-black text-foreground mb-2 group-hover:text-brand transition-colors">{p.name}</h4>
            <p className="text-muted text-xs line-clamp-2 leading-relaxed">{p.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
