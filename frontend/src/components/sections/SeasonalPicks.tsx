"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { getLocaleFromPathname, toLocalizedPath } from "@/i18n/routing";

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  image_url?: string | null;
  category?: { name: string } | null;
  tags?: string[];
}

interface SeasonalPicksProps {
  title?: string;
  description?: string;
  products: ProductItem[];
}

export default function SeasonalPicks({
  title = "Bu Mevsim Onerilerimiz",
  description = "Sezona uygun en verimli cesitlerimizi inceleyin.",
  products,
}: SeasonalPicksProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  if (products.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-brand/5">
      {/* Abstract background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
              {title}
            </h2>
            <p className="text-muted text-lg max-w-lg">
              {description}
            </p>
          </div>
          <Link
            href={toLocalizedPath(ROUTES.products.list, locale)}
            className="inline-flex items-center gap-2 group text-brand font-black text-sm uppercase tracking-widest hover:text-brand-dark transition-colors"
          >
            Tumunu Gor
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((p) => (
            <Link
              key={p.id}
              href={toLocalizedPath(ROUTES.products.detail(p.slug), locale)}
              className="group flex flex-col surface-elevated overflow-hidden hover:border-brand/50 transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-bg-alt">
                <Image
                  src={p.image_url || "/assets/images/noImage.png"}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                
                {/* Floating tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {p.category && (
                    <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-sm text-brand rounded-lg shadow-sm">
                      {p.category.name}
                    </span>
                  )}
                </div>

                {/* Hover overlay content */}
                <div className="absolute inset-0 bg-linear-to-t from-brand/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                   <span className="text-white text-xs font-bold uppercase tracking-widest">Incele →</span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-black text-foreground tracking-tight group-hover:text-brand transition-colors line-clamp-2">
                  {p.title}
                </h3>
                
                {p.tags && p.tags.length > 0 && (
                  <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] font-bold text-muted uppercase tracking-wider px-2 py-0.5 bg-bg-alt rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
