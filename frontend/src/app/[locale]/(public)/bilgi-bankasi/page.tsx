import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { fetchLibraryList } from "@/modules/library/library.service";
import { getPageMetadata } from "@/lib/seo";
import { JsonLd } from "@agro/shared-ui/public/seo/JsonLd";
import { defaultLocale, isAppLocale, type AppLocale, toLocalizedPath } from "@/i18n/routing";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, siteOrigin } from "@/lib/schema-org";
import { absolutePublicAssetUrl } from "@/lib/utils";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Library.knowledgeBase" });
  return getPageMetadata("knowledge-base", {
    locale,
    pathname: "/bilgi-bankasi",
    title: t("title"),
    description: t("description"),
  });
}

export default async function KnowledgeBasePage({ params }: LocalePageProps) {
  const { locale } = await params;
  const appLocale: AppLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "Library.knowledgeBase" });
  const items = await fetchLibraryList({ locale });
  const origin = siteOrigin();

  const guides = items.filter(i => i.type === "guide");
  const supports = items.filter(i => i.type === "support");
  const others = items.filter(i => i.type !== "guide" && i.type !== "support");
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t("breadcrumbHome"), url: `${origin}${toLocalizedPath("/", appLocale)}` },
    { name: t("title"), url: `${origin}${toLocalizedPath("/bilgi-bankasi", appLocale)}` },
  ]);
  const itemListLd = buildItemListJsonLd(
    items.map((item) => {
      const href = item.type === "guide"
        ? toLocalizedPath(`/ekim-rehberi/${item.slug}`, appLocale)
        : toLocalizedPath(`/bilgi-bankasi/${item.slug}`, appLocale);
      const image = item.featured_image || item.image_url;
      return {
        name: item.title,
        url: `${origin}${href}`,
        image: image ? (image.startsWith("http") ? image : absolutePublicAssetUrl(image) ?? null) : null,
      };
    }),
  );

  return (
    <div className="surface-page min-h-screen">
      <JsonLd type="BreadcrumbList" data={breadcrumbLd} />
      <JsonLd type="ItemList" data={itemListLd} />

      {/* Hero */}
      <div className="pt-32 pb-20 bg-bg-alt/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6">
             {t("title")}
           </h1>
           <p className="text-muted text-xl max-w-2xl mx-auto leading-relaxed">
             {t("heroDescription")}
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Guides Section (Ekim Rehberleri) */}
        {guides.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8 border-l-4 border-brand pl-6">
               <h2 className="text-3xl font-black text-foreground tracking-tight">{t("guidesTitle")}</h2>
               <Link href={toLocalizedPath("/ekim-rehberi", locale)} className="text-brand text-sm font-bold hover:underline">{t("seeAllGuides")}</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {guides.slice(0, 3).map(item => (
                <LibraryCard key={item.id} item={item} locale={appLocale} />
              ))}
            </div>
          </section>
        )}

        {/* Supports Section */}
        {supports.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center mb-8 border-l-4 border-brand-dark pl-6">
               <h2 className="text-3xl font-black text-foreground tracking-tight">{t("supportsTitle")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {supports.map(item => (
                 <LibraryCard key={item.id} item={item} horizontal locale={appLocale} />
               ))}
            </div>
          </section>
        )}

        {/* Others Section */}
        {others.length > 0 && (
          <section>
            <div className="flex items-center mb-8 border-l-4 border-muted pl-6">
               <h2 className="text-3xl font-black text-foreground tracking-tight">{t("othersTitle")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {others.map(item => (
                 <LibraryCard key={item.id} item={item} small locale={appLocale} />
               ))}
            </div>
          </section>
        )}

        {items.length === 0 && (
          <div className="text-center py-24 surface-elevated rounded-3xl">
             <p className="text-muted italic">{t("empty")}</p>
          </div>
        )}

      </div>
    </div>
  );
}

async function LibraryCard({ item, horizontal = false, small = false, locale = "tr" }: { item: any; horizontal?: boolean; small?: boolean; locale?: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Library.knowledgeBase" });
  const img = item.featured_image || item.image_url || "/assets/placeholder.webp";

  const href = item.type === "guide"
    ? toLocalizedPath(`/ekim-rehberi/${item.slug}`, locale)
    : toLocalizedPath(`/bilgi-bankasi/${item.slug}`, locale);

  if (horizontal) {
    return (
      <Link href={href} className="group flex flex-col md:flex-row gap-6 surface-elevated overflow-hidden hover:border-brand/40 transition-all p-4">
        <div className="relative w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden shrink-0">
          <img src={img} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-brand transition-colors">{item.title}</h3>
          <p className="text-muted text-sm line-clamp-2 leading-relaxed mb-4">{item.summary}</p>
          <div className="text-xs font-bold uppercase tracking-widest text-brand">{t("reviewDetailCta")} &rarr;</div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block surface-elevated overflow-hidden hover:border-brand/40 transition-all">
      <div className={`relative ${small ? 'aspect-video' : 'aspect-[4/5]'} overflow-hidden`}>
        <img src={img} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="absolute bottom-4 left-4 right-4">
           <h3 className={`font-black text-white leading-tight ${small ? 'text-base' : 'text-xl'}`}>{item.title}</h3>
        </div>
      </div>
      {!small && (
        <div className="p-5">
           <p className="text-muted text-sm line-clamp-2 mb-3">{item.summary}</p>
        </div>
      )}
    </Link>
  );
}
