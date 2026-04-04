"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Loader2, MoveRight } from "lucide-react";
import { API } from "@/config/api-endpoints";
import { API_URL } from "@/lib/site-settings";
import { resolveImageUrl } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { toLocalizedPath } from "@/i18n/routing";

type LibraryRow = {
  id: string;
  slug: string;
  type: string;
  title?: string;
  name?: string | null;
  summary?: string | null;
  description?: string | null;
  featured_image?: string | null;
  image_url?: string | null;
};

export function LibraryKnowledgeLinks({ tags, locale }: { tags: string[]; locale: string }) {
  const t = useTranslations("Products.detail");
  const [items, setItems] = React.useState<LibraryRow[]>([]);
  const [loading, setLoading] = React.useState(() => tags.length > 0);

  React.useEffect(() => {
    if (!tags.length) {
      setLoading(false);
      return;
    }
    const q = tags.slice(0, 4).join(" ");
    const qs = new URLSearchParams({ locale, limit: "8", q });
    fetch(`${API_URL}${API.library.list}?${qs}`)
      .then((r) => r.json())
      .then((rows: LibraryRow[]) => {
        const list = Array.isArray(rows) ? rows : [];
        setItems(list);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [tags, locale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 border-t border-border-soft mt-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand" aria-hidden />
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border-soft">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-brand mb-2">{t("relatedKnowledgeKicker")}</p>
          <h2 className="text-2xl font-black text-foreground tracking-tight">{t("relatedKnowledgeTitle")}</h2>
          <p className="text-muted text-sm mt-2 max-w-xl">{t("relatedKnowledgeSubtitle")}</p>
        </div>
        <Link
          href={toLocalizedPath(ROUTES.static.knowledge_base, locale)}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-brand transition-colors shrink-0"
        >
          {t("relatedKnowledgeSeeAll")}
          <MoveRight className="h-4 w-4" />
        </Link>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => {
          const label = item.name ?? item.title ?? item.slug;
          const excerpt = item.summary ?? item.description ?? "";
          const href =
            item.type === "guide"
              ? toLocalizedPath(`/ekim-rehberi/${item.slug}`, locale)
              : toLocalizedPath(`/bilgi-bankasi/${item.slug}`, locale);
          const img = item.featured_image || item.image_url;
          const imgSrc = img ? resolveImageUrl(img) : null;

          return (
            <li key={item.id}>
              <Link
                href={href}
                className="group flex gap-4 rounded-2xl border border-border-soft bg-surface p-4 hover:border-brand/40 transition-colors"
              >
                {imgSrc && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                    <img src={imgSrc} alt={label} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground group-hover:text-brand transition-colors line-clamp-2">{label}</h3>
                  {excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{excerpt}</p>}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
