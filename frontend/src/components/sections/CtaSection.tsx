"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { getLocaleFromPathname, toLocalizedPath } from "@/i18n/routing";

interface CtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function CtaSection({
  title,
  description,
  ctaLabel,
  ctaHref = ROUTES.static.contact,
}: CtaProps) {
  const t = useTranslations("Sections.cta");
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");
  const resolvedCtaLabel = ctaLabel ?? t("ctaLabel");

  return (
    <section className="relative w-full bg-background py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[3rem] bg-navy pt-20 pb-24 px-8 md:px-16 text-center overflow-hidden shadow-2xl shadow-navy/20 border border-white/10 group">
          
          {/* Animated Background Ambience */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-brand/20 blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:opacity-80 opacity-50" />
          
          {/* Subtle Graphic Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at center, white 2px, transparent 2.5px)', backgroundSize: '40px 40px' }}
          />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand/30 bg-brand/10 backdrop-blur-md shadow-inner shadow-white/5 mb-8">
              <Sparkles className="w-4 h-4 text-brand animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-brand">{t("eyebrow")}</span>
            </div>

            {/* Typography */}
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-8 drop-shadow-2xl selection:bg-brand selection:text-white">
              {resolvedTitle}
            </h2>
            <p className="text-lg md:text-2xl text-white/70 font-medium leading-relaxed max-w-2xl text-balance mb-12">
              {resolvedDescription}
            </p>

            {/* Action Area */}
            <div className="pt-4 flex flex-col items-center">
              <Link
                href={toLocalizedPath(ctaHref, locale)}
                className="group/btn relative px-10 py-5 bg-brand rounded-full overflow-hidden shadow-[0_0_40px_-5px_rgba(var(--brand),0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                {/* Button Shine */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                
                <span className="relative z-10 text-white font-black text-lg tracking-widest uppercase">
                  {resolvedCtaLabel}
                </span>
                <div className="relative z-10 bg-white/20 p-1.5 rounded-full backdrop-blur-sm transition-transform group-hover/btn:translate-x-1">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
