import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@agro/shared-ui/public/seo/JsonLd";
import { buildMetadata, getPageMetadata } from "@/lib/seo";
import { fetchSiteSettings } from "@/lib/site-settings";
import { absolutePublicAssetUrl, resolveImageUrl } from "@/lib/utils";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, siteOrigin } from "@/lib/schema-org";
import { toLocalizedPath } from "@/i18n/routing";
import { fetchReferenceBySlug } from "@/modules/reference/reference.service";

interface ReferenceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function resolveReferenceImage(url: string | null | undefined) {
  if (!url) return null;
  return resolveImageUrl(url);
}

export async function generateMetadata({ params }: ReferenceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await fetchReferenceBySlug(slug, locale);

  if (!item) {
    return getPageMetadata("notFound", { locale });
  }

  const ogImage = absolutePublicAssetUrl(item.featured_image);
  return buildMetadata(null, {
    locale,
    pathname: `/referanslar/${slug}`,
    title: item.meta_title?.trim() || item.title,
    description: item.meta_description?.trim() || item.summary || undefined,
    openGraph: {
      title: item.meta_title?.trim() || item.title,
      description: item.meta_description?.trim() || item.summary || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  });
}

export default async function ReferenceDetailPage({ params }: ReferenceDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "References.detail" });
  const item = await fetchReferenceBySlug(slug, locale);

  if (!item) notFound();

  const settings = await fetchSiteSettings(locale);
  const origin = siteOrigin();
  const pageUrl = `${origin}${toLocalizedPath(`/referanslar/${slug}`, locale)}`;
  const heroImage = resolveReferenceImage(item.featured_image);
  const gallery = (item.images ?? [])
    .map((image) => resolveReferenceImage(image))
    .filter((image): image is string => Boolean(image))
    .filter((image) => image !== heroImage);
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t("breadcrumbHome"), url: `${origin}${toLocalizedPath("/", locale)}` },
    { name: t("breadcrumbList"), url: `${origin}${toLocalizedPath("/referanslar", locale)}` },
    { name: item.title, url: pageUrl },
  ]);
  const galleryLd = buildItemListJsonLd(
    gallery.map((image, index) => ({
      name: `${item.title} ${t("galleryItem")} ${index + 1}`,
      url: pageUrl,
      image: absolutePublicAssetUrl(image) ?? image,
    })),
  );
  const websiteHref = item.website_url?.trim() || null;
  const siteName = settings.site_name || process.env.NEXT_PUBLIC_SITE_NAME || "VistaSeed";

  return (
    <div className="surface-page min-h-screen pb-24">
      <JsonLd type="BreadcrumbList" data={breadcrumbLd} />
      {gallery.length > 0 ? <JsonLd type="ItemList" data={galleryLd} /> : null}

      <div className="pt-32 pb-16 bg-bg-alt/30 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-brand mb-4">{t("eyebrow")}</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground max-w-4xl">{item.title}</h1>
          {item.summary ? (
            <p className="mt-6 text-lg leading-8 max-w-3xl text-muted-foreground">{item.summary}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            <span className="rounded-full bg-brand/10 text-brand px-4 py-2">{siteName}</span>
            {websiteHref ? <span className="rounded-full bg-foreground/5 px-4 py-2">{t("sourceBadge")}</span> : null}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {heroImage ? (
          <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem] border border-border/60 shadow-2xl shadow-brand/10 mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt={item.featured_image_alt || item.title} className="w-full h-full object-cover" />
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-12">
          <article
            className="prose prose-lg prose-invert max-w-none text-foreground/80 leading-relaxed prose-headings:text-foreground prose-headings:font-black prose-strong:text-foreground prose-a:text-brand prose-img:rounded-3xl"
            dangerouslySetInnerHTML={{ __html: item.content || `<p>${item.summary || ""}</p>` }}
          />

          <aside className="space-y-6">
            {websiteHref ? (
              <div className="rounded-[2rem] border border-border/60 bg-white/80 dark:bg-white/5 p-7 shadow-xl shadow-brand/5">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("sourceTitle")}</p>
                <p className="text-sm leading-7 text-muted-foreground mb-5">{t("sourceDescription")}</p>
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white hover:bg-brand-dark transition-colors"
                >
                  {t("sourceCta")}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            ) : null}

            <Link
              href={toLocalizedPath("/referanslar", locale)}
              className="inline-flex items-center gap-2 text-sm font-black text-foreground hover:text-brand transition-colors"
            >
              <span aria-hidden="true">←</span>
              {t("backToList")}
            </Link>
          </aside>
        </div>

        {gallery.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("galleryEyebrow")}</p>
                <h2 className="text-3xl font-black tracking-tight text-foreground">{t("galleryTitle")}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {gallery.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-white/80 dark:bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={`${item.title} ${t("galleryItem")} ${index + 1}`} className="w-full aspect-[4/3] object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
