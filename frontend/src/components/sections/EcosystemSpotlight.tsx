import Link from "next/link";
import { toLocalizedPath } from "@/i18n/routing";
import type { LibraryItem } from "@/modules/library/library.type";
import {
  resolveEcosystemImage,
  resolveEcosystemReferencePath,
  type EcosystemReferenceItem,
} from "@/modules/ecosystem/ecosystem-content";

type Labels = {
  knowledgeEyebrow: string;
  referenceEyebrow: string;
  knowledgeCta: string;
  referenceCta: string;
};

export default function EcosystemSpotlight({
  locale,
  title,
  subtitle,
  labels,
  knowledgeItems,
  referenceItems,
}: {
  locale: string;
  title: string;
  subtitle: string;
  labels: Labels;
  knowledgeItems: LibraryItem[];
  referenceItems: EcosystemReferenceItem[];
}) {
  if (knowledgeItems.length === 0 && referenceItems.length === 0) return null;

  return (
    <section className="py-24 bg-bg-alt/40 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted leading-relaxed">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-5">
            {knowledgeItems.map((item) => {
              const href =
                item.type === "guide"
                  ? toLocalizedPath(`/ekim-rehberi/${item.slug}`, locale)
                  : toLocalizedPath(`/bilgi-bankasi/${item.slug}`, locale);
              const image = resolveEcosystemImage(item.featured_image || item.image_url);

              return (
                <Link
                  key={item.id}
                  href={href}
                  className="group flex gap-5 rounded-[2rem] border border-border-soft bg-surface p-5 hover:border-brand/40 hover:-translate-y-1 transition-all"
                >
                  {image && (
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-surface-alt">
                      <img src={image} alt={item.title ?? ""} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-2">{labels.knowledgeEyebrow}</p>
                    <h3 className="text-xl font-black tracking-tight text-foreground group-hover:text-brand transition-colors">{item.title}</h3>
                    {item.summary && <p className="text-sm text-muted mt-2 line-clamp-3 leading-relaxed">{item.summary}</p>}
                    <span className="inline-flex mt-4 text-xs font-black uppercase tracking-[0.18em] text-foreground/70 group-hover:text-brand transition-colors">
                      {labels.knowledgeCta}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="space-y-5">
            {referenceItems.map((item) => {
              const href = toLocalizedPath(resolveEcosystemReferencePath(item.slug), locale);
              const image = resolveEcosystemImage(item.featured_image);

              return (
                <Link
                  key={item.id}
                  href={href}
                  className="group flex gap-5 rounded-[2rem] border border-border-soft bg-navy p-5 hover:border-brand/40 hover:-translate-y-1 transition-all"
                >
                  {image && (
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-white/5">
                      <img src={image} alt={item.title ?? ""} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-2">{labels.referenceEyebrow}</p>
                    <h3 className="text-xl font-black tracking-tight text-white group-hover:text-brand transition-colors">{item.title}</h3>
                    {item.summary && <p className="text-sm text-white/65 mt-2 line-clamp-3 leading-relaxed">{item.summary}</p>}
                    <span className="inline-flex mt-4 text-xs font-black uppercase tracking-[0.18em] text-white/70 group-hover:text-brand transition-colors">
                      {labels.referenceCta}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
