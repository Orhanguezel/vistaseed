"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { getLocaleFromPathname, toLocalizedPath } from "@/i18n/routing";

interface SeasonalHeroProps {
  season?: string;
  title?: string;
  highlight?: string;
  suffix?: string;
  description?: string;
  badge?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const SEASON_GRADIENT: Record<string, string> = {
  spring: "from-brand/10 via-brand/3 to-transparent",
  summer: "from-yellow-500/10 via-yellow-500/3 to-transparent",
  autumn: "from-orange-500/10 via-orange-500/3 to-transparent",
  winter: "from-blue-400/10 via-blue-400/3 to-transparent",
};

export default function SeasonalHero({
  season = "spring",
  title = "Tohumun Bereketi",
  highlight = "Toprakla",
  suffix = "Başlar",
  description = "Yüksek verimli, sertifikalı tohum çeşitlerimizle sürdürülebilir tarımın gücü elinizde.",
  badge = "2026 Bahar Sezonu",
  imageUrl = "/assets/hero/spring-field.jpg",
  ctaLabel = "Ürünleri Keşfet",
  ctaHref = ROUTES.products.list,
  secondaryLabel = "Ekim Rehberi",
  secondaryHref = ROUTES.static.faq,
}: SeasonalHeroProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const gradient = SEASON_GRADIENT[season] || SEASON_GRADIENT.spring;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Season badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
              </span>
              {badge}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-foreground">
            {title}{" "}
            <span className="text-brand">{highlight}</span>
            {suffix && <> {suffix}</>}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted max-w-lg leading-relaxed">
            {description}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={toLocalizedPath(ctaHref, locale)}
              className="px-7 py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 text-sm"
            >
              {ctaLabel}
            </Link>
            <Link
              href={toLocalizedPath(secondaryHref, locale)}
              className="px-7 py-3.5 bg-surface/80 backdrop-blur-sm text-foreground font-bold rounded-xl border border-border hover:bg-surface transition-all text-sm"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
