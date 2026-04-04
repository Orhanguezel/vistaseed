"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/config/routes";
import { getLocaleFromPathname, toLocalizedPath } from "@/i18n/routing";

interface ProductPreviewItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
}

interface ProductsPreviewProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  products: ProductPreviewItem[];
}

export default function ProductsPreview({
  title,
  subtitle,
  ctaLabel,
  products,
}: ProductsPreviewProps) {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const tHome = useTranslations("Home.sections.featured");
  const tCommon = useTranslations("Common.actions");

  return (
    <section className="py-24 relative bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
              {title || tHome("title")}
            </h2>
            <p className="text-muted text-lg">
              {subtitle || tHome("subtitle")}
            </p>
          </div>
          <Link
            href={toLocalizedPath(ROUTES.products.list, currentLocale)}
            className="group inline-flex items-center gap-4 text-sm font-black text-brand uppercase tracking-widest transition-all"
          >
            <span className="group-hover:tracking-[0.2em] transition-all duration-300">{ctaLabel || tCommon("seeAll")}</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 text-brand group-hover:bg-brand group-hover:text-white transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {products.map((item) => (
              <Link
                key={item.id}
                href={toLocalizedPath(ROUTES.products.detail(item.slug), currentLocale)}
                className="group flex flex-col hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-xl shadow-navy/5 group-hover:shadow-brand/20 transition-all duration-700">
                  <Image
                    src={item.image_url || "/assets/images/noImage.png"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                <h3 className="text-2xl font-black tracking-tight text-foreground mb-3 group-hover:text-brand transition-colors">
                  {item.title}
                </h3>
                
                {item.description && (
                  <p className="text-muted text-base line-clamp-2 leading-relaxed font-medium">
                    {item.description}
                  </p>
                )}
                
                <div className="mt-6 flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                  Ürünü İncele
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted font-bold animate-pulse">
            {tCommon("loading")}
          </div>
        )}
      </div>
    </section>
  );
}
