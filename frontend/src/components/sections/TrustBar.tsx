"use client";

import { useTranslations } from "next-intl";

interface TrustBadge {
  icon: string;
  label: string;
  description?: string;
}

interface TrustBarProps {
  badges?: TrustBadge[];
}

const FALLBACK_BADGE_ICONS = ["shield-check", "leaf", "flask-conical", "sprout"] as const;

const ICON_MAP: Record<string, string> = {
  "shield-check": "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "leaf": "M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75",
  "flask-conical": "M10 2v7.527a2 2 0 01-.211.896L4.72 20.55a1 1 0 00.9 1.45h12.76a1 1 0 00.9-1.45l-5.069-10.127A2 2 0 0114 9.527V2M8.5 2h7M6.5 17h11",
  "sprout": "M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 00-1.5 3.5 9.8 9.8 0 015-1c1.8-.5 3.2-1.5 3.4-3.5-2-.5-3.7 0-5 1",
};

function TrustIcon({ name }: { name: string }) {
  const path = ICON_MAP[name];
  if (!path) return <span className="w-5 h-5 rounded-full bg-brand/20" />;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand shrink-0">
      <path d={path} />
    </svg>
  );
}

export default function TrustBar({ badges }: TrustBarProps) {
  const t = useTranslations("Sections.trustBar");
  const fallbackBadges: TrustBadge[] = FALLBACK_BADGE_ICONS.map((icon, index) => ({
    icon,
    label: t(`items.${index}.label`),
    description: t(`items.${index}.description`),
  }));
  const items = badges && badges.length > 0 ? badges : fallbackBadges;

  return (
    <section className="relative z-30 -mt-10 mb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((b, i) => (
            <div 
              key={b.label} 
              className="flex items-center gap-4 p-5 surface-elevated group hover:border-brand/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                <TrustIcon name={b.icon} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black text-foreground tracking-tight leading-tight">{b.label}</div>
                {b.description && (
                  <div className="text-xs text-muted leading-tight mt-1">{b.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
