import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/config/routes";
import { API } from "@/config/api-endpoints";
import { buildMetadata } from "@/lib/seo";
import { resolveImageUrl } from "@/lib/utils";
import { toLocalizedPath } from "@/i18n/routing";
import type { Product, ProductSpec, ProductReview, ProductFaq } from "@/modules/product/product.type";
import JsonLd from "@/components/seo/JsonLd";
import { LibraryKnowledgeLinks } from "@/modules/library/components/library-knowledge-links";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, buildProductJsonLd, siteOrigin } from "@/lib/schema-org";
import AddToCompareButton from "@/modules/product/components/AddToCompareButton";
import ProductImageGallery from "@/modules/product/components/ProductImageGallery";
import ProductReviews from "@/modules/product/components/ProductReviews";
import FaqQuestionForm from "@/modules/product/components/FaqQuestionForm";
import ReviewForm from "@/modules/product/components/ReviewForm";
import { Sprout, ShieldCheck, Thermometer, Calendar, Layers, Leaf } from "lucide-react";
import { fetchSiteSettings } from "@/lib/site-settings";
import { fetchReferenceHighlights, resolveEcosystemImage, resolveEcosystemReferencePath, type EcosystemReferenceItem } from "@/modules/ecosystem/ecosystem-content";

export const revalidate = 300;

const BASE_URL = (
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8083"
).replace(/\/$/, "");

type ProductDetailMessages = {
  breadcrumb: {
    home: string;
    products: string;
  };
  detail: {
    productCode: string;
    specs: string;
    faqs: string;
    reviews: string;
    reviewSummary: string;
    noReviewsCta: string;
    ecosystemKicker: string;
    ecosystemTitle: string;
    ecosystemSubtitle: string;
    ecosystemCta: string;
    cta: string;
    notFound: string;
    reviewCount: (count: number) => string;
  };
  badges: {
    hybrid: string;
    early: string;
    featured: string;
  };
  quickSpecs: {
    botanical: string;
    seedType: string;
    seedTypeFallback: string;
    certificate: string;
    certificateValue: string;
    climate: string;
    climateFallback: string;
    harvest: string;
    harvestValue: string;
    harvestDays: (days: number) => string;
    planting: string;
    plantingFallback: string;
    soil: string;
    soilFallback: string;
    tempRange: string;
    tempFallback: string;
    water: string;
    waterFallback: string;
    sun: string;
    sunFallback: string;
    days: string;
  };
  profile: {
    eyebrow: string;
    title: string;
    subtitle: string;
    groups: {
      growing: string;
      spacing: string;
      environment: string;
    };
    fields: {
      planting: string;
      soil: string;
      harvest: string;
      germination: string;
      seedDepth: string;
      rowSpacing: string;
      plantSpacing: string;
      temperature: string;
      water: string;
      sun: string;
      yield: string;
    };
  };
  ctaPanel: {
    title: string;
    subtitle: string;
  };
  specCategories: Record<ProductSpec["category"], string>;
  specGroups: {
    fruit: string;
    cultivation: string;
    tolerance: string;
    commercial: string;
  };
};

/* ── Fetchers ───────────────────────────────────────────────── */

async function fetchSingle<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchList<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch {
    return [];
  }
}

async function getProduct(slug: string, locale: string): Promise<Product | null> {
  return fetchSingle<Product>(`${BASE_URL}${API.products.detail(slug)}?locale=${encodeURIComponent(locale)}`);
}

async function getSpecs(productId: string, locale: string): Promise<ProductSpec[]> {
  return fetchList<ProductSpec>(`${BASE_URL}${API.products.specs}?product_id=${productId}&locale=${encodeURIComponent(locale)}`);
}

async function getReviews(productId: string): Promise<ProductReview[]> {
  return fetchList<ProductReview>(`${BASE_URL}${API.products.reviews}?product_id=${productId}`);
}

async function getFaqs(productId: string, locale: string): Promise<ProductFaq[]> {
  return fetchList<ProductFaq>(`${BASE_URL}${API.products.faqs}?product_id=${productId}&locale=${encodeURIComponent(locale)}`);
}

/* ── Stars SVG ──────────────────────────────────────────────── */

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  if (half) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" className="text-amber-400">
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#halfStar)" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className={filled ? "text-amber-400" : "text-slate-200"}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function RatingStars({ rating, count, reviewCountLabel }: { rating: number; count: number; reviewCountLabel: (count: number) => string }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 py-1.5 px-3 rounded-full border border-border-soft w-fit">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }, (_, i) => <StarIcon key={`f${i}`} filled />)}
        {hasHalf && <StarIcon filled={false} half />}
        {Array.from({ length: empty }, (_, i) => <StarIcon key={`e${i}`} filled={false} />)}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-black text-foreground">{rating.toFixed(1)}</span>
        <span className="text-xs font-bold text-muted uppercase tracking-wider">{reviewCountLabel(count)}</span>
      </div>
    </div>
  );
}

/* ── Technical Quick Specs ──────────────────────────────────── */

function QuickSpecItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface border border-border-soft group hover:border-brand/30 transition-all">
      <div className="w-10 h-10 rounded-xl bg-brand/5 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition-all">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-black text-muted uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-sm font-bold text-foreground leading-tight">{value}</p>
      </div>
    </div>
  );
}

/* ── Specs table (grouped by category) ──────────────────────── */

function normalizeSpecKey(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveSpecGroup(spec: ProductSpec): keyof ProductDetailMessages["specGroups"] {
  const key = normalizeSpecKey(spec.name);

  if (
    key.includes("meyve") ||
    key.includes("fruit") ||
    key.includes("frucht") ||
    key.includes("kabuk") ||
    key.includes("skin") ||
    key.includes("schal") ||
    key.includes("renk") ||
    key.includes("color") ||
    key.includes("farbe") ||
    key.includes("lob") ||
    key.includes("tat") ||
    key.includes("geschmack") ||
    key.includes("acilik") ||
    key.includes("scharfe")
  ) {
    return "fruit";
  }

  if (
    key.includes("yetistirme") ||
    key.includes("cultivation") ||
    key.includes("anbau") ||
    key.includes("kullanim") ||
    key.includes("usage") ||
    key.includes("einsatz") ||
    key.includes("alan") ||
    key.includes("donem") ||
    key.includes("window") ||
    key.includes("zeitraum") ||
    key.includes("adaptasyon") ||
    key.includes("adaptation") ||
    key.includes("anpassung") ||
    key.includes("uretim")
  ) {
    return "cultivation";
  }

  if (
    key.includes("tolerans") ||
    key.includes("tolerance") ||
    key.includes("direnc") ||
    key.includes("widerstand") ||
    key.includes("cold") ||
    key.includes("soguk") ||
    key.includes("kalteleistung") ||
    key.includes("sicak") ||
    key.includes("heat") ||
    key.includes("hitz")
  ) {
    return "tolerance";
  }

  return "commercial";
}

function SpecsSection({ specs, messages }: { specs: ProductSpec[]; messages: ProductDetailMessages }) {
  if (specs.length === 0) return null;

  const grouped = specs.reduce<Record<string, ProductSpec[]>>((acc, s) => {
    const key = resolveSpecGroup(s);
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const categoryOrder: Array<keyof ProductDetailMessages["specGroups"]> = ["fruit", "cultivation", "tolerance", "commercial"];
  const sortedGroups = categoryOrder.filter((c) => grouped[c]);

  return (
    <details className="group border border-border-soft rounded-2xl overflow-hidden bg-surface shadow-sm" open>
      <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-black tracking-tight text-foreground hover:bg-bg-alt/50 transition-colors uppercase text-sm">
        <span className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand" />
          {messages.detail.specs}
        </span>
        <ChevronIcon />
      </summary>
      <div className="px-6 pb-6 space-y-6">
        {sortedGroups.map((cat) => (
          <div key={cat} className="space-y-3">
            <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.2em] opacity-80 border-l-2 border-brand/40 pl-3">
              {messages.specGroups[cat]}
            </h4>
            <div className="grid grid-cols-1 gap-1">
              {grouped[cat].map((spec, i) => (
                <div key={spec.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-bg-alt/40 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">{spec.name}</span>
                  <span className="text-sm font-black text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

/* ── FAQs ───────────────────────────────────────────────────── */

function FaqsSection({ faqs, title }: { faqs: ProductFaq[]; title: string }) {
  if (faqs.length === 0) return null;
  return (
    <details className="group border border-border-soft rounded-2xl overflow-hidden bg-surface shadow-sm">
      <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-black tracking-tight text-foreground hover:bg-bg-alt/50 transition-colors uppercase text-sm">
        {title}
        <ChevronIcon />
      </summary>
      <div className="px-6 pb-6 space-y-3">
        {faqs.map((faq) => (
          <details key={faq.id} className="group/faq overflow-hidden rounded-xl border border-border-soft/50">
            <summary className="cursor-pointer text-sm font-bold text-foreground hover:text-brand transition-colors p-4 list-none flex items-center justify-between">
              {faq.question}
              <ChevronIcon size={12} />
            </summary>
            <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </details>
  );
}

/* ── Shared Chevron ─────────────────────────────────────────── */

function ChevronIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted group-open:rotate-180 transition-transform">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function formatClimateZones(
  zones: string[] | undefined,
  t: (key: string, values?: Record<string, number | string>) => string,
): string {
  if (!zones?.length) return t("detail.quickSpecs.climateFallback");
  return zones.map((z) => t(`detail.agEnum.climate.${z}` as "detail.agEnum.climate.akdeniz")).join(", ");
}

function formatPlantingSeasons(
  seasons: string[] | undefined,
  t: (key: string, values?: Record<string, number | string>) => string,
): string {
  if (!seasons?.length) return t("detail.quickSpecs.plantingFallback");
  return seasons.map((season) => t(`detail.agEnum.season.${season}` as "detail.agEnum.season.ilkbahar")).join(", ");
}

function formatSoilTypes(
  soilTypes: string[] | undefined,
  t: (key: string, values?: Record<string, number | string>) => string,
): string {
  if (!soilTypes?.length) return t("detail.quickSpecs.soilFallback");
  return soilTypes.map((soil) => t(`detail.agEnum.soil.${soil}` as "detail.agEnum.soil.kumlu")).join(", ");
}

function formatWaterNeed(
  waterNeed: string | null | undefined,
  t: (key: string, values?: Record<string, number | string>) => string,
): string {
  if (!waterNeed) return t("detail.quickSpecs.waterFallback");
  return t(`detail.agEnum.water.${waterNeed}` as "detail.agEnum.water.low");
}

function formatSunExposure(
  sunExposure: string | null | undefined,
  t: (key: string, values?: Record<string, number | string>) => string,
): string {
  if (!sunExposure) return t("detail.quickSpecs.sunFallback");
  return t(`detail.agEnum.sun.${sunExposure}` as "detail.agEnum.sun.full");
}

function formatTemperatureRange(
  minTemp: number | null | undefined,
  maxTemp: number | null | undefined,
  fallback: string,
): string {
  if (minTemp == null && maxTemp == null) return fallback;
  if (minTemp != null && maxTemp != null) return `${minTemp}°C / ${maxTemp}°C`;
  return `${minTemp ?? "—"}°C / ${maxTemp ?? "—"}°C`;
}

function formatNullableNumber(value: number | null | undefined, suffix = ""): string {
  if (value == null) return "—";
  return `${value}${suffix}`;
}

function ProfileValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border-soft/70 bg-background/70 px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-2">{label}</p>
      <p className="text-sm font-bold text-foreground leading-relaxed">{value}</p>
    </div>
  );
}

function EcosystemReferenceLinks({
  items,
  locale,
  messages,
}: {
  items: EcosystemReferenceItem[];
  locale: string;
  messages: ProductDetailMessages;
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-brand mb-2">{messages.detail.ecosystemKicker}</p>
          <h2 className="text-2xl font-black text-foreground tracking-tight">{messages.detail.ecosystemTitle}</h2>
          <p className="text-muted text-sm mt-2 max-w-2xl">{messages.detail.ecosystemSubtitle}</p>
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => {
          const href = toLocalizedPath(resolveEcosystemReferencePath(item.slug), locale);
          const image = resolveEcosystemImage(item.featured_image);
          return (
            <li key={item.id}>
              <Link
                href={href}
                className="group flex gap-4 rounded-2xl border border-border-soft bg-surface p-4 hover:border-brand/40 transition-colors"
              >
                {image && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                    <img src={image} alt={item.title ?? ""} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground group-hover:text-brand transition-colors line-clamp-2">{item.title}</h3>
                  {item.summary && <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{item.summary}</p>}
                  <span className="inline-flex mt-3 text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand transition-colors">
                    {messages.detail.ecosystemCta}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Products" });
  const product = await getProduct(slug, locale);
  if (!product) return { title: t("detail.notFound") };
  return buildMetadata(null, {
    locale,
    pathname: `/urunler/${slug}`,
    title: product.meta_title || product.title,
    description: product.meta_description || product.description || "",
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale: currentLocale, slug } = await params;
  const t = await getTranslations({ locale: currentLocale, namespace: "Products" });
  const messages: ProductDetailMessages = {
    breadcrumb: {
      home: t("breadcrumb.home"),
      products: t("breadcrumb.products"),
    },
    detail: {
      productCode: t("detail.productCode"),
      specs: t("detail.specs"),
      faqs: t("detail.faqs"),
      reviews: t("detail.reviews"),
      reviewSummary: t("detail.reviewSummary"),
      noReviewsCta: t("detail.noReviewsCta"),
      ecosystemKicker: t("detail.ecosystemKicker"),
      ecosystemTitle: t("detail.ecosystemTitle"),
      ecosystemSubtitle: t("detail.ecosystemSubtitle"),
      ecosystemCta: t("detail.ecosystemCta"),
      cta: t("detail.cta"),
      notFound: t("detail.notFound"),
      reviewCount: (count: number) => t("detail.reviewCount", { count }),
    },
    badges: {
      hybrid: t("detail.badges.hybrid"),
      early: t("detail.badges.early"),
      featured: t("detail.badges.featured"),
    },
    quickSpecs: {
      botanical: t("detail.quickSpecs.botanical"),
      seedType: t("detail.quickSpecs.seedType"),
      seedTypeFallback: t("detail.quickSpecs.seedTypeFallback"),
      certificate: t("detail.quickSpecs.certificate"),
      certificateValue: t("detail.quickSpecs.certificateValue"),
      climate: t("detail.quickSpecs.climate"),
      climateFallback: t("detail.quickSpecs.climateFallback"),
      harvest: t("detail.quickSpecs.harvest"),
      harvestValue: t("detail.quickSpecs.harvestValue"),
      harvestDays: (days: number) => t("detail.quickSpecs.harvestDays", { days }),
      planting: t("detail.quickSpecs.planting"),
      plantingFallback: t("detail.quickSpecs.plantingFallback"),
      soil: t("detail.quickSpecs.soil"),
      soilFallback: t("detail.quickSpecs.soilFallback"),
      tempRange: t("detail.quickSpecs.tempRange"),
      tempFallback: t("detail.quickSpecs.tempFallback"),
      water: t("detail.quickSpecs.water"),
      waterFallback: t("detail.quickSpecs.waterFallback"),
      sun: t("detail.quickSpecs.sun"),
      sunFallback: t("detail.quickSpecs.sunFallback"),
      days: t("detail.quickSpecs.days"),
    },
    profile: {
      eyebrow: t("detail.profile.eyebrow"),
      title: t("detail.profile.title"),
      subtitle: t("detail.profile.subtitle"),
      groups: {
        growing: t("detail.profile.groups.growing"),
        spacing: t("detail.profile.groups.spacing"),
        environment: t("detail.profile.groups.environment"),
      },
      fields: {
        planting: t("detail.profile.fields.planting"),
        soil: t("detail.profile.fields.soil"),
        harvest: t("detail.profile.fields.harvest"),
        germination: t("detail.profile.fields.germination"),
        seedDepth: t("detail.profile.fields.seedDepth"),
        rowSpacing: t("detail.profile.fields.rowSpacing"),
        plantSpacing: t("detail.profile.fields.plantSpacing"),
        temperature: t("detail.profile.fields.temperature"),
        water: t("detail.profile.fields.water"),
        sun: t("detail.profile.fields.sun"),
        yield: t("detail.profile.fields.yield"),
      },
    },
    ctaPanel: {
      title: t("detail.ctaPanel.title"),
      subtitle: t("detail.ctaPanel.subtitle"),
    },
    specCategories: {
      physical: t("specCategories.physical"),
      material: t("specCategories.material"),
      custom: t("specCategories.custom"),
      service: t("specCategories.service"),
    },
    specGroups: {
      fruit: t("detail.specGroups.fruit"),
      cultivation: t("detail.specGroups.cultivation"),
      tolerance: t("detail.specGroups.tolerance"),
      commercial: t("detail.specGroups.commercial"),
    },
  };

  const product = await getProduct(slug, currentLocale);
  if (!product) notFound();

  const [specs, reviews, faqs, settings, ecosystemReferences] = await Promise.all([
    getSpecs(product.id, currentLocale),
    getReviews(product.id),
    getFaqs(product.id, currentLocale),
    fetchSiteSettings(currentLocale),
    fetchReferenceHighlights(currentLocale, 2),
  ]);

  const allImages = [
    product.image_url,
    ...(product.images || []),
  ].filter((v, i, arr) => Boolean(v) && arr.indexOf(v) === i).map((image) => resolveImageUrl(image)) as string[];

  const origin = siteOrigin();
  const pageUrl = `${origin}${toLocalizedPath(`/urunler/${slug}`, currentLocale)}`;
  const siteName = settings.site_name || process.env.NEXT_PUBLIC_SITE_NAME || "vistaseeds";
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: messages.breadcrumb.home, url: `${origin}${toLocalizedPath(ROUTES.home, currentLocale)}` },
    { name: messages.breadcrumb.products, url: `${origin}${toLocalizedPath(ROUTES.products.list, currentLocale)}` },
    ...(product.category
      ? [{ name: product.category.name, url: `${origin}${toLocalizedPath(ROUTES.products.list, currentLocale)}?category=${product.category.slug}` }]
      : []),
    { name: product.title, url: pageUrl },
  ]);
  const productLd = buildProductJsonLd({
    name: product.title,
    description: product.meta_description || product.description,
    image: allImages,
    pageUrl,
    sku: product.product_code,
    category: product.category?.name ?? product.sub_category?.name ?? null,
    brandName: siteName,
    tags: product.tags,
    ratingValue: product.review_count > 0 ? product.rating : null,
    reviewCount: product.review_count > 0 ? product.review_count : null,
    additionalProperties: specs.slice(0, 12).map((spec) => ({
      name: spec.name,
      value: spec.value,
    })),
  });

  // Agricultural specific tags logic
  const isHybrid = product.tags.some(t => t.toLowerCase().includes("hibrit"));
  const isEarly = product.tags.some(t => t.toLowerCase().includes("erkenci") || t.toLowerCase().includes("early"));
  const imageVariant = product.category?.slug === "anac" || product.slug === "avar" ? "rootstock" : "standard";

  return (
    <div className="bg-background min-h-screen">
      <JsonLd type="BreadcrumbList" data={breadcrumbLd} />
      <JsonLd type="Product" data={productLd} />
      {faqs.length > 0 && <JsonLd type="FAQPage" data={buildFaqPageJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />}
      
      {/* Breadcrumb */}
      <div className="border-b border-border/10 bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted/60">
            <Link href={toLocalizedPath(ROUTES.home, currentLocale)} className="hover:text-brand transition-colors">
              {messages.breadcrumb.home}
            </Link>
            <ChevronIcon size={10} />
            <Link href={toLocalizedPath(ROUTES.products.list, currentLocale)} className="hover:text-brand transition-colors">
              {messages.breadcrumb.products}
            </Link>
            {product.category && (
              <>
                <ChevronIcon size={10} />
                <span className="text-muted/80">{product.category.name}</span>
              </>
            )}
            <ChevronIcon size={10} />
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ── Hero: Image + Info ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image gallery */}
          <div className="space-y-6">
             <ProductImageGallery images={allImages} alt={product.title} variant={imageVariant} />
             
             {/* Quick Agricultural Summary */}
             <div className="grid grid-cols-2 gap-4">
                <QuickSpecItem
                  icon={Sprout}
                  label={messages.quickSpecs.botanical}
                  value={
                    product.botanical_name?.trim() ||
                    product.category?.name ||
                    messages.quickSpecs.seedTypeFallback
                  }
                />
                <QuickSpecItem
                  icon={ShieldCheck}
                  label={messages.quickSpecs.certificate}
                  value={messages.quickSpecs.certificateValue}
                />
                <QuickSpecItem
                  icon={Thermometer}
                  label={messages.quickSpecs.climate}
                  value={formatClimateZones(product.climate_zones, t)}
                />
                <QuickSpecItem
                  icon={Calendar}
                  label={messages.quickSpecs.harvest}
                  value={
                    product.harvest_days != null
                      ? messages.quickSpecs.harvestDays(product.harvest_days)
                      : messages.quickSpecs.harvestValue
                  }
                />
                <QuickSpecItem
                  icon={Calendar}
                  label={messages.quickSpecs.planting}
                  value={formatPlantingSeasons(product.planting_seasons, t)}
                />
                <QuickSpecItem
                  icon={Leaf}
                  label={messages.quickSpecs.soil}
                  value={formatSoilTypes(product.soil_types, t)}
                />
                <QuickSpecItem
                  icon={Thermometer}
                  label={messages.quickSpecs.tempRange}
                  value={formatTemperatureRange(product.min_temp, product.max_temp, messages.quickSpecs.tempFallback)}
                />
                <QuickSpecItem
                  icon={ShieldCheck}
                  label={messages.quickSpecs.water}
                  value={formatWaterNeed(product.water_need, t)}
                />
                <QuickSpecItem
                  icon={ShieldCheck}
                  label={messages.quickSpecs.sun}
                  value={formatSunExposure(product.sun_exposure, t)}
                />
             </div>
          </div>

          {/* Right: Content Panel */}
          <div className="space-y-8">
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                {isHybrid && (
                  <span className="px-4 py-1 bg-brand text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-brand/20">
                    {messages.badges.hybrid}
                  </span>
                )}
                {isEarly && (
                  <span className="px-4 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-amber-500/20">
                    {messages.badges.early}
                  </span>
                )}
                {product.is_featured && (
                  <span className="px-4 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                    {messages.badges.featured}
                  </span>
                )}
              </div>

              <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-foreground leading-none">
                {product.title}
              </h1>

              {/* Rating */}
              {product.review_count > 0 && (
                <RatingStars rating={product.rating} count={product.review_count} reviewCountLabel={messages.detail.reviewCount} />
              )}

              {product.product_code && (
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted/60">
                  <span className="w-2 h-2 rounded-full bg-brand/40" />
                  {messages.detail.productCode}: <span className="text-foreground">{product.product_code}</span>
                </div>
              )}
            </div>

            {/* Description Card */}
            {product.description && (
              <div className="p-8 rounded-[2.5rem] bg-surface-elevated/50 border border-border-soft relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full -mr-10 -mt-10 blur-2xl group-hover:bg-brand/10 transition-colors" />
                <p className="text-foreground/80 leading-loose text-lg font-medium relative z-10">
                  {product.description}
                </p>
              </div>
            )}

            <section className="relative overflow-hidden rounded-[2.5rem] border border-brand/15 bg-gradient-to-br from-brand/[0.06] via-surface to-surface p-8 shadow-xl shadow-brand/5">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
              <div className="relative space-y-8">
                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand">{messages.profile.eyebrow}</p>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">{messages.profile.title}</h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{messages.profile.subtitle}</p>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                  <div className="space-y-3 rounded-3xl border border-border-soft/70 bg-surface/80 p-5">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/70">{messages.profile.groups.growing}</h3>
                    <div className="space-y-3">
                      <ProfileValue label={messages.profile.fields.planting} value={formatPlantingSeasons(product.planting_seasons, t)} />
                      <ProfileValue label={messages.profile.fields.soil} value={formatSoilTypes(product.soil_types, t)} />
                      <ProfileValue
                        label={messages.profile.fields.harvest}
                        value={product.harvest_days != null ? messages.quickSpecs.harvestDays(product.harvest_days) : messages.quickSpecs.harvestValue}
                      />
                      <ProfileValue label={messages.profile.fields.germination} value={formatNullableNumber(product.germination_days, ` ${messages.quickSpecs.days}`)} />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-border-soft/70 bg-surface/80 p-5">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/70">{messages.profile.groups.spacing}</h3>
                    <div className="space-y-3">
                      <ProfileValue label={messages.profile.fields.seedDepth} value={formatNullableNumber(product.seed_depth_cm, " cm")} />
                      <ProfileValue label={messages.profile.fields.rowSpacing} value={formatNullableNumber(product.row_spacing_cm, " cm")} />
                      <ProfileValue label={messages.profile.fields.plantSpacing} value={formatNullableNumber(product.plant_spacing_cm, " cm")} />
                      <ProfileValue label={messages.profile.fields.yield} value={product.yield_per_sqm?.trim() || "—"} />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-border-soft/70 bg-surface/80 p-5">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/70">{messages.profile.groups.environment}</h3>
                    <div className="space-y-3">
                      <ProfileValue
                        label={messages.profile.fields.temperature}
                        value={formatTemperatureRange(product.min_temp, product.max_temp, messages.quickSpecs.tempFallback)}
                      />
                      <ProfileValue label={messages.profile.fields.water} value={formatWaterNeed(product.water_need, t)} />
                      <ProfileValue label={messages.profile.fields.sun} value={formatSunExposure(product.sun_exposure, t)} />
                      <ProfileValue label={messages.quickSpecs.climate} value={formatClimateZones(product.climate_zones, t)} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Metadata Sections */}
            <div className="space-y-4">
              <SpecsSection specs={specs} messages={messages} />
              <FaqsSection faqs={faqs} title={messages.detail.faqs} />
            </div>

            {/* Action Panel */}
            <div className="p-8 rounded-[2rem] bg-slate-900 dark:bg-brand/10 border border-white/5 space-y-6 shadow-2xl">
              <div className="flex items-center gap-4 text-white">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-brand" />
                 </div>
                 <div>
                    <h4 className="font-black tracking-tight text-lg">{messages.ctaPanel.title}</h4>
                    <p className="text-xs text-white/50 font-bold uppercase tracking-widest">{messages.ctaPanel.subtitle}</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href={toLocalizedPath(ROUTES.static.contact, currentLocale)}
                  className="flex items-center justify-center px-8 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-brand hover:text-white transition-all shadow-xl"
                >
                  {messages.detail.cta}
                </Link>
                <AddToCompareButton productSlug={product.slug} className="w-full !rounded-2xl !py-5 !bg-white/5 !border-white/10 !text-white hover:!bg-white/10" />
              </div>
            </div>

            {/* FAQ Question Form */}
            <div className="pt-4">
              <FaqQuestionForm productId={product.id} />
            </div>
          </div>
        </div>

        <LibraryKnowledgeLinks tags={product.tags} locale={currentLocale} />
        <EcosystemReferenceLinks items={ecosystemReferences} locale={currentLocale} messages={messages} />

        {/* ── Reviews Section ─────────────────────────────────── */}
        <div className="mt-24 border-t border-border-soft pt-16">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-black text-foreground tracking-tighter mb-4 flex items-center gap-4">
              {messages.detail.reviews}
              {reviews.length > 0 && (
                <span className="text-lg font-black text-brand bg-brand/5 py-1 px-4 rounded-full">
                  {reviews.length}
                </span>
              )}
            </h2>
            <p className="text-muted-foreground text-lg mb-12">{messages.detail.reviewSummary}</p>
            
            {reviews.length > 0 ? (
              <ProductReviews reviews={reviews} />
            ) : (
              <div className="p-10 rounded-3xl border border-dashed border-border-soft text-center text-muted-foreground font-medium italic">
                 {messages.detail.noReviewsCta}
              </div>
            )}
            
            <div className="mt-12 p-10 rounded-[3rem] bg-bg-alt/30 border border-border-soft">
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
