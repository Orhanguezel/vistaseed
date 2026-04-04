import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { fetchLibraryList } from "@/modules/library/library.service";
import { getPageMetadata } from "@/lib/seo";
import { JsonLd } from "@agro/shared-ui/public/seo/JsonLd";
import { defaultLocale, isAppLocale, toLocalizedPath } from "@/i18n/routing";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, siteOrigin } from "@/lib/schema-org";
import { absolutePublicAssetUrl } from "@/lib/utils";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Library.guides" });
  return getPageMetadata("ekim-rehberi", {
    locale,
    pathname: "/ekim-rehberi",
    title: t("title"),
    description: t("description"),
  });
}

export default async function EkimRehberiPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const appLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "Library.guides" });
  const guides = await fetchLibraryList({ type: "guide", locale });
  const origin = siteOrigin();
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t("breadcrumbHome"), url: `${origin}${toLocalizedPath("/", appLocale)}` },
    { name: t("title"), url: `${origin}${toLocalizedPath("/ekim-rehberi", appLocale)}` },
  ]);
  const itemListLd = buildItemListJsonLd(
    guides.map((item) => {
      const image = item.featured_image || item.image_url;
      return {
        name: item.title,
        url: `${origin}${toLocalizedPath(`/ekim-rehberi/${item.slug}`, appLocale)}`,
        image: image ? (image.startsWith("http") ? image : absolutePublicAssetUrl(image) ?? null) : null,
      };
    }),
  );

  return (
    <div className="surface-page min-h-screen">
      <JsonLd type="BreadcrumbList" data={breadcrumbLd} />
      <JsonLd type="ItemList" data={itemListLd} />

      {/* Hero Header */}
      <div className="pt-32 pb-20 bg-bg-alt/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6">
             {t("title")}
           </h1>
           <div className="w-24 h-2 bg-brand mx-auto rounded-full mb-8" />
           <p className="text-muted text-xl max-w-2xl mx-auto leading-relaxed">
             {t("heroDescription")}
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {guides.length === 0 ? (
          <div className="text-center py-20 surface-elevated rounded-3xl">
            <p className="text-muted text-lg italic">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guides.map((item) => {
              const img = item.featured_image || item.image_url || "/assets/placeholder.webp";

              return (
                <Link
                  key={item.id}
                  href={toLocalizedPath(`/ekim-rehberi/${item.slug}`, locale)}
                  className="group block surface-elevated overflow-hidden hover:border-brand/40 transition-all duration-500"
                >
                  <div className="relative aspect-[4/5] overflow-hidden grayscale-50 group-hover:grayscale-0 transition-all duration-700">
                    <img
                      src={img}
                      alt={item.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute bottom-6 left-6 right-6">
                       <span className="inline-block text-[10px] font-black uppercase tracking-widest text-brand bg-brand/10 px-2 py-0.5 rounded-full mb-3 backdrop-blur-sm">
                         {item.type === "guide" ? t("guideBadge") : t("infoBadge")}
                       </span>
                       <h3 className="text-xl font-black text-white leading-tight tracking-tight group-hover:text-brand transition-colors">
                         {item.title}
                       </h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-muted text-sm line-clamp-2 leading-relaxed mb-4">
                      {item.summary || t("fallbackSummary")}
                    </p>
                    <div className="flex items-center text-xs font-bold text-foreground">
                       {t("reviewLink")}
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                       </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
