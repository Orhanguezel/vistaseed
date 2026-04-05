"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { getLocaleFromPathname, toLocalizedPath } from "@/i18n/routing";

interface HeroProps {
  title?: string;
  highlight?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  imageUrl?: string;
  badge?: string;
}

export default function HeroSection({
  title = "Geleceği",
  highlight = "Birlikte",
  description = "Sürdürülebilir çözümler ve yüksek teknoloji ile sektörde fark yaratıyoruz.",
  ctaLabel = "Ürünleri Keşfet",
  ctaHref = ROUTES.products.list,
  secondaryLabel = "Hakkımızda",
  secondaryHref = ROUTES.static.about,
  imageUrl = "/assets/hero/agriculture-main.jpg",
  badge = "Sektörün Öncüsü",
}: HeroProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  return (
    <section className="relative min-h-[85vh] flex items-center pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/5 via-background to-background" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-black tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
              </span>
              {badge}
            </div>
          )}

          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-foreground">
            {title} <span className="text-brand">{highlight}</span> İnşa Ediyoruz
          </h1>

          <p className="text-lg text-muted max-w-lg leading-relaxed font-medium">
            {description}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href={toLocalizedPath(ctaHref, locale)}
              className="px-8 py-4 bg-brand text-white font-black rounded-2xl hover:bg-brand/90 transition-all shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              {ctaLabel}
            </Link>
            <Link
              href={toLocalizedPath(secondaryHref, locale)}
              className="px-8 py-4 bg-surface text-foreground font-black rounded-2xl border border-border hover:bg-bg-alt transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="relative aspect-square lg:aspect-video rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent mix-blend-overlay z-10" />
          <Image
            src={imageUrl}
            alt="Hero"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
