import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { fetchLibraryBySlug, fetchLibraryFiles, fetchLibraryImages } from "@/modules/library/library.service";
import { buildMetadata, getPageMetadata } from "@/lib/seo";
import { JsonLd } from "@agro/shared-ui/public/seo/JsonLd";
import { fetchSiteSettings } from "@/lib/site-settings";
import { toLocalizedPath } from "@/i18n/routing";
import { absolutePublicAssetUrl, resolveImageUrl } from "@/lib/utils";
import { LibraryProductLinks } from "@/modules/library/components/library-product-links";
import { LibraryImageGallery } from "@/modules/library/components/library-image-gallery";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, siteOrigin } from "@/lib/schema-org";

interface GuideDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const BASE_URL = (
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8083"
).replace(/\/$/, "");

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await fetchLibraryBySlug(slug, locale);

  if (!item) {
    return getPageMetadata("notFound", { locale });
  }

  const ogImage = absolutePublicAssetUrl(item.featured_image);
  return buildMetadata(null, {
    locale,
    pathname: `/ekim-rehberi/${slug}`,
    title: item.title,
    description: item.summary || undefined,
    openGraph: {
      title: item.title,
      description: item.summary || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  });
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Library.guideDetail" });
  const item = await fetchLibraryBySlug(slug, locale);

  if (!item) {
    notFound();
  }

  const [files, images, settings] = await Promise.all([
    fetchLibraryFiles(item.id),
    fetchLibraryImages(item.id, locale),
    fetchSiteSettings(locale),
  ]);

  let htmlContent = item.content || "";
  try {
    const parsed = JSON.parse(htmlContent);
    if (parsed && typeof parsed === "object" && parsed.html) {
      htmlContent = parsed.html;
    }
  } catch {
    // raw html
  }

  const mainImg = item.featured_image || item.image_url;
  const fullImg = mainImg ? resolveImageUrl(mainImg) : null;
  const articleImageAbsolute = absolutePublicAssetUrl(mainImg) ?? null;
  const excludeGallery = new Set<string>();
  if (fullImg) excludeGallery.add(fullImg);

  const origin = siteOrigin();
  const pageUrl = `${origin}${toLocalizedPath(`/ekim-rehberi/${slug}`, locale)}`;
  const publisherName = settings.site_name || process.env.NEXT_PUBLIC_SITE_NAME || "vistaseeds";
  const logo = settings.site_logo?.trim()
    ? settings.site_logo.startsWith("http")
      ? settings.site_logo
      : resolveImageUrl(settings.site_logo)
    : null;

  const articleLd = buildArticleJsonLd({
    headline: item.title,
    description: item.summary,
    image: articleImageAbsolute,
    datePublished: item.published_at || new Date().toISOString(),
    pageUrl,
    publisherName,
    publisherLogoUrl: logo,
  });

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t("breadcrumbHome"), url: `${origin}${toLocalizedPath("/", locale)}` },
    { name: t("breadcrumbGuides"), url: `${origin}${toLocalizedPath("/ekim-rehberi", locale)}` },
    { name: item.title, url: pageUrl },
  ]);

  return (
    <div className="surface-page min-h-screen pb-24">
      <JsonLd type="Article" data={articleLd} />
      <JsonLd type="BreadcrumbList" data={breadcrumbLd} />

      <div className="pt-32 pb-16 bg-bg-alt/30 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-brand bg-brand/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {t("guideBadge")}
            </span>
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider text-muted-foreground/60">
              {t("documentNumber")}: {item.id.slice(0, 8)}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-6">{item.title}</h1>

          {item.summary && (
            <p className="text-muted text-xl leading-relaxed max-w-2xl font-medium text-foreground/70">{item.summary}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {fullImg && (
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl group border border-border/10">
                <img
                  src={fullImg}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
            )}

            <article
              className="prose prose-lg prose-invert max-w-none text-foreground/80 leading-relaxed
              prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight
              prose-strong:text-foreground prose-a:text-brand hover:prose-a:text-brand-dark
              prose-img:rounded-3xl prose-blockquote:border-brand prose-blockquote:bg-brand/5 prose-blockquote:py-1 prose-blockquote:my-8"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <LibraryImageGallery
              images={images}
              baseUrl={BASE_URL}
              excludeUrls={excludeGallery}
              title={t("galleryTitle")}
            />
          </div>

          <div className="lg:col-span-1 space-y-8">
            {files.length > 0 && (
              <div className="surface-elevated p-8 rounded-3xl border border-border-soft shadow-xl shadow-brand/5">
                <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  {t("downloadTitle")}
                </h3>

                <div className="space-y-3">
                  {files.map((file) => (
                    <a
                      key={file.id}
                      href={file.file_url.startsWith("http") ? file.file_url : resolveImageUrl(file.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col p-4 rounded-xl bg-bg-alt/50 hover:bg-brand/10 transition-all border border-transparent hover:border-brand/30"
                    >
                      <span className="text-sm font-bold text-foreground group-hover:text-brand transition-colors truncate">
                        {file.name || t("guideFile")}
                      </span>
                      <span className="text-[10px] font-bold text-muted mt-1 uppercase tracking-widest text-muted-foreground/60">
                        PDF • {file.size_bytes ? `${Math.round(file.size_bytes / 1024)} KB` : t("documentLabel")}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-brand/5 p-8 rounded-3xl border border-brand/20">
              <h4 className="text-brand text-sm font-black uppercase tracking-widest mb-4">{t("tipTitle")}</h4>
              <p className="text-muted text-sm leading-relaxed text-foreground/70">{t("tipBody")}</p>
            </div>

            <Link
              href={toLocalizedPath("/ekim-rehberi", locale)}
              className="inline-flex items-center text-sm font-black text-foreground hover:text-brand transition-colors group"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="mr-2 group-hover:-translate-x-1 transition-transform"
              >
                <path d="M19 12H5m7-7-7 7 7 7" />
              </svg>
              {t("backToGuides")}
            </Link>
          </div>
        </div>

        <LibraryProductLinks tags={item.tags || undefined} locale={locale} />
      </div>
    </div>
  );
}
