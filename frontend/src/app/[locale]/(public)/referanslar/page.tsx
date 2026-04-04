import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@agro/shared-ui/public/seo/JsonLd";
import { getPageMetadata } from "@/lib/seo";
import { absolutePublicAssetUrl, resolveImageUrl } from "@/lib/utils";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, siteOrigin } from "@/lib/schema-org";
import { defaultLocale, isAppLocale, toLocalizedPath, type AppLocale } from "@/i18n/routing";
import { fetchReferenceList } from "@/modules/reference/reference.service";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "References.list" });
  return getPageMetadata("references", {
    locale,
    pathname: "/referanslar",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ReferencesPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const appLocale: AppLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "References.list" });
  const items = await fetchReferenceList({
    locale,
    sort: "display_order",
    orderDir: "asc",
  });
  const origin = siteOrigin();
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t("breadcrumbHome"), url: `${origin}${toLocalizedPath("/", appLocale)}` },
    { name: t("title"), url: `${origin}${toLocalizedPath("/referanslar", appLocale)}` },
  ]);
  const itemListLd = buildItemListJsonLd(
    items.map((item) => ({
      name: item.title,
      url: `${origin}${toLocalizedPath(`/referanslar/${item.slug}`, appLocale)}`,
      image: item.featured_image
        ? item.featured_image.startsWith("http")
          ? item.featured_image
          : absolutePublicAssetUrl(item.featured_image) ?? null
        : null,
    })),
  );

  return (
    <div className="surface-page min-h-screen">
      <JsonLd type="BreadcrumbList" data={breadcrumbLd} />
      <JsonLd type="ItemList" data={itemListLd} />

      <div className="pt-32 pb-20 bg-bg-alt/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-brand mb-4">{t("eyebrow")}</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6">{t("title")}</h1>
          <p className="text-muted text-xl max-w-3xl mx-auto leading-relaxed">{t("heroDescription")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {items.map((item) => {
              const image = item.featured_image ? resolveImageUrl(item.featured_image) : "/assets/placeholder.webp";

              return (
                <Link
                  key={item.id}
                  href={toLocalizedPath(`/referanslar/${item.slug}`, appLocale)}
                  className="group overflow-hidden rounded-[2rem] border border-border/60 bg-white/80 dark:bg-white/5 shadow-xl shadow-brand/5 hover:border-brand/40 transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={item.featured_image_alt || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="absolute left-5 right-5 bottom-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70 mb-2">{t("cardKicker")}</p>
                      <h2 className="text-2xl font-black tracking-tight text-white">{item.title}</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-7 text-muted-foreground line-clamp-3 min-h-[5.25rem]">
                      {item.summary || t("fallbackSummary")}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-brand">
                      {t("detailCta")}
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border/70 p-14 text-center text-muted-foreground">
            {t("empty")}
          </div>
        )}
      </div>
    </div>
  );
}

