"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/config/routes";
import { getLocaleFromPathname, toLocalizedPath } from "@/i18n/routing";
import { addCompareSlug, getCompareSlugs, removeCompareSlug } from "@/lib/compare-storage";
import { resolveImageUrl } from "@/lib/utils";
import type { Product } from "../product.type";

interface Props {
  product: Product;
  selected?: boolean;
  onToggleCompare?: (productSlug: string) => void;
}

function getProductImageTreatment(product: Product) {
  const isRootstock = product.category?.slug === "anac" || product.slug === "avar";

  if (isRootstock) {
    return {
      frameClass: "bg-gradient-to-br from-emerald-50 via-white to-lime-50",
      imageClass: "object-contain p-2 sm:p-3 scale-[1.02] group-hover:scale-[1.06]",
    };
  }

  return {
    frameClass: "bg-white/50 backdrop-blur-sm",
    imageClass: "object-contain p-6 scale-95 group-hover:scale-100",
  };
}

export default function ProductCard({ product, selected = false, onToggleCompare }: Props) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = useTranslations("Compare");
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    setCompareCount(getCompareSlugs().length);
  }, [selected]);

  const compareHref = useMemo(() => {
    const slugs = getCompareSlugs();
    return `${toLocalizedPath(ROUTES.static.compare, locale)}?slugs=${encodeURIComponent(slugs.join(","))}`;
  }, [locale, selected, compareCount]);

  function handleToggleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (onToggleCompare) {
      onToggleCompare(product.slug);
      return;
    }

    if (selected) {
      removeCompareSlug(product.slug);
    } else {
      addCompareSlug(product.slug);
    }
    setCompareCount(getCompareSlugs().length);
  }

  const isHybrid = product.tags?.some(tag => tag.toLowerCase().includes("hibrit") || tag.toLowerCase().includes("hybrid"));
  const isEarly = product.tags?.some(tag => tag.toLowerCase().includes("erkenci") || tag.toLowerCase().includes("early"));
  const imageTreatment = getProductImageTreatment(product);
  const primarySrc =
    resolveImageUrl(product.image_url || (product.images?.length ? product.images[0] : null));

  return (
    <article className="group flex flex-col items-center bg-surface hover:shadow-2xl hover:shadow-brand/5 transition-all duration-500 rounded-3xl p-4 border border-border/50 hover:border-brand/30 relative">
      
      {/* Agricultural Status Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
        {isHybrid && (
          <span className="px-2.5 py-1 bg-navy text-white text-[9px] font-black uppercase tracking-widest rounded-lg backdrop-blur-md shadow-lg">
            F1 Hibrit
          </span>
        )}
        {isEarly && (
          <span className="px-2.5 py-1 bg-brand text-white text-[9px] font-black uppercase tracking-widest rounded-lg backdrop-blur-md shadow-lg">
            Erkenci
          </span>
        )}
      </div>

      <Link
        href={toLocalizedPath(ROUTES.products.detail(product.slug), locale)}
        className="flex w-full flex-col items-center text-center"
      >
        <div className={`relative w-full aspect-square overflow-hidden rounded-2xl border border-border-soft/50 group-hover:border-brand/20 transition-all ${imageTreatment.frameClass}`}>
          <Image
            src={primarySrc}
            alt={product.title}
            fill
            className={`${imageTreatment.imageClass} transition-transform duration-700 ease-out`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        
        <div className="mt-5 space-y-2">
          {product.category && (
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em] opacity-80">
              {product.category.name}
            </span>
          )}
          <h3 className="text-lg font-black text-foreground group-hover:text-brand transition-colors tracking-tight leading-tight px-2">
            {product.title}
          </h3>
          {product.product_code && (
            <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              {product.product_code}
            </div>
          )}
        </div>
      </Link>

      <div className="mt-6 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={handleToggleCompare}
          className={`inline-flex w-full items-center justify-center rounded-xl border px-3 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
            selected
              ? "border-brand bg-brand text-white shadow-lg shadow-brand/20"
              : "border-border-soft bg-surface-elevated text-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
          }`}
        >
          {selected ? t("selected") : t("addToCompare")}
        </button>

        <div className="h-4 flex justify-center">
          {compareCount >= 2 && (
            <Link href={compareHref} className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline hover:opacity-80 transition-all">
              {t("goToCompare", { count: compareCount })} &rarr;
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
