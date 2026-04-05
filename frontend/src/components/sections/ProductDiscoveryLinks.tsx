import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { toLocalizedPath } from "@/i18n/routing";

export interface DiscoveryItem {
  id: string;
  title: string;
  description: string;
  query: Record<string, string>;
}

interface ProductDiscoveryLinksProps {
  locale: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  items: DiscoveryItem[];
  compact?: boolean;
}

function buildDiscoveryHref(locale: string, query: Record<string, string>) {
  const params = new URLSearchParams(query);
  const pathname = toLocalizedPath(ROUTES.products.list, locale);
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export default function ProductDiscoveryLinks({
  locale,
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  items,
  compact = false,
}: ProductDiscoveryLinksProps) {
  return (
    <section className={compact ? "py-10" : "py-20"}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-10">
          {eyebrow && (
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-brand">{eyebrow}</p>
          )}
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">{title}</h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
        </div>

        <div className={`grid gap-4 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4"}`}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={buildDiscoveryHref(locale, item.query)}
              className="group rounded-[2rem] border border-border/70 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-brand/5"
            >
              <div className="flex h-full flex-col">
                <h3 className="text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-brand">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-brand">
                  <span>{ctaLabel}</span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
