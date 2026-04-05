import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo";
import {
  fetchHomepageSettings,
  fetchTrustBadges,
  fetchPlantingGuide,
  fetchNewsletterConfig,
  fetchCustomPageBySlug,
  fetchSiteSettings,
  fetchHomepageFeaturePanels,
} from "@/lib/site-settings";
import { API } from "@/config/api-endpoints";

import AnimatedSections from "@/components/sections/AnimatedSections";
import HeroSliderClient, { type Slide } from "@/components/sections/HeroSliderClient";
import TrustBar from "@/components/sections/TrustBar";
import StatsSection from "@/components/sections/StatsSection";
import SeasonalPicks from "@/components/sections/SeasonalPicks";
import ValuesSection from "@/components/sections/ValuesSection";
import PlantingGuide from "@/components/sections/PlantingGuide";
import ProductsPreview from "@/components/sections/ProductsPreview";
import ProductDiscoveryLinks, { type DiscoveryItem } from "@/components/sections/ProductDiscoveryLinks";
import EcosystemSpotlight from "@/components/sections/EcosystemSpotlight";
import HomepageFeaturePanels from "@/components/sections/HomepageFeaturePanels";
import TimelineSection from "@/components/sections/TimelineSection";
import FaqPreview from "@/components/sections/FaqPreview";
import Newsletter from "@/components/sections/Newsletter";
import CtaSection from "@/components/sections/CtaSection";
import JsonLd from "@/components/seo/JsonLd";
import { fetchLibraryList } from "@/modules/library/library.service";
import { fetchReferenceHighlights } from "@/modules/ecosystem/ecosystem-content";

export const revalidate = 300;

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata("home", {
    locale,
    pathname: "/",
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Website",
  });
}

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");
const API_V1 = `${BASE_URL}/api/v1`;

function getCurrentSeasonTag(): string {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return "bahar";
  if (month >= 6 && month <= 8) return "yaz";
  if (month >= 9 && month <= 11) return "guz";
  return "kis";
}

function getCurrentSeasonName(placeholder: string, seasonNames: Record<string, string>, fallbackTitle: string): string {
  const tag = getCurrentSeasonTag();
  const seasonName = seasonNames[tag] || seasonNames.spring || fallbackTitle;
  return placeholder.replace("{season}", seasonName) || fallbackTitle;
}

async function getFallbackSlides(locale: string): Promise<Slide[]> {
  const t = await getTranslations({ locale, namespace: "Home.hero" });
  const images = [
    "/assets/hero/slide-1-field.webp",
    "/assets/hero/slide-2-corn.webp",
    "/assets/hero/slide-3-hero.webp",
    "/assets/hero/slide-4-agriculture.webp",
  ];

  return [0, 1, 2].map((i) => ({
    id: `fallback-${i}`,
    title: t(`fallbacks.${i}.title`),
    description: t(`fallbacks.${i}.description`),
    image: images[i] || images[0],
    alt: t(`fallbacks.${i}.title`),
    buttonText: t(`fallbacks.${i}.buttonText`),
    buttonLink: i === 0 ? "/urunler" : i === 1 ? "/hakkimizda" : "/sss",
  }));
}

async function getSliders(locale: string): Promise<Slide[]> {
  const fallbackSlides = await getFallbackSlides(locale);
  try {
    const res = await fetch(`${API_V1}/sliders?locale=${locale}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallbackSlides;
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.data ?? [];
    const mapped = rows
      .filter((r: any) => r.isActive !== false && r.is_active !== false)
      .map((r: any) => {
        let img = r.image || r.image_url || "/assets/hero/slide-1-field.webp";
        // /uploads: Next rewrites -> backend (tarayicida :8083'e dogrudan gitme)
        return {
          id: String(r.id),
          title: r.title || r.name || "",
          description: r.description ?? null,
          image: img,
          alt: r.alt ?? null,
          buttonText: r.buttonText || r.button_text || null,
          buttonLink: r.buttonLink || r.button_link || null,
        };
      });
    return mapped.length > 0 ? mapped : fallbackSlides;
  } catch {
    return fallbackSlides;
  }
}

async function getFeaturedProducts(locale: string) {
  try {
    const res = await fetch(
      `${BASE_URL}${API.products.list}?is_active=true&is_featured=true&locale=${locale}&sort=order_num&order=asc&limit=6`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.data ?? [];
    return rows.map((p: any) => p);
  } catch {
    return [];
  }
}

async function getSeasonalProducts(locale: string) {
  try {
    const season = getCurrentSeasonTag();
    const res = await fetch(
      `${BASE_URL}${API.products.list}?is_active=true&locale=${locale}&tags=${season}&sort=order_num&order=asc&limit=4`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.data ?? [];
    return rows.map((p: any) => p);
  } catch {
    return [];
  }
}

async function getFaqs(locale: string) {
  try {
    const res = await fetch(
      `${BASE_URL}${API.support.faqs}?locale=${locale}&is_published=true&limit=5`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  const tHome = await getTranslations({ locale, namespace: "Home" });
  const seasonalSubtitle = tHome("sections.seasonal.subtitle");
  const newsletterTitle = tHome("sections.newsletter.title");
  const newsletterDescription = tHome("sections.newsletter.description");
  const newsletterButtonLabel = tHome("sections.newsletter.buttonLabel");
  const newsletterPlaceholder = tHome("sections.newsletter.placeholder");
  const seasonalTitle = tHome("sections.seasonal.title");
  const seasonNames: Record<string, string> = {
    bahar: tHome("seasons.spring"),
    yaz: tHome("seasons.summer"),
    guz: tHome("seasons.fall"),
    kis: tHome("seasons.winter"),
    spring: tHome("seasons.spring"),
  };
  const currentSeason = seasonNames[getCurrentSeasonTag()] || seasonNames.spring || "";
  const placeholder = tHome("sections.seasonal.placeholder", { season: currentSeason });

  const [
    sliders,
    homepage,
    trustBadges,
    plantingGuide,
    newsletterConfig,
    featuredProducts,
    seasonalProducts,
    ecosystemKnowledge,
    ecosystemReferences,
    homepageFeaturePanels,
    faqs,
    nedenBizPage,
    siteSettings,
  ] = await Promise.all([
    getSliders(locale),
    fetchHomepageSettings(locale),
    fetchTrustBadges(locale),
    fetchPlantingGuide(locale),
    fetchNewsletterConfig(locale),
    getFeaturedProducts(locale),
    getSeasonalProducts(locale),
    fetchLibraryList({ locale, limit: 3 }),
    fetchReferenceHighlights(locale, 3),
    fetchHomepageFeaturePanels(locale),
    getFaqs(locale),
    fetchCustomPageBySlug("neden-biz", locale),
    fetchSiteSettings(locale),
  ]);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const siteName = siteSettings.site_name || process.env.NEXT_PUBLIC_SITE_NAME || "Website";
  const siteLogo = siteSettings.site_logo
    ? (siteSettings.site_logo.startsWith("http") ? siteSettings.site_logo : `${siteUrl}${siteSettings.site_logo}`)
    : undefined;
  const contactPhone = siteSettings.contact_phone || undefined;

  const sections = homepage.sections as Record<string, unknown> | null;

  const stats = Array.isArray((sections as any)?.stats) ? (sections as any).stats : undefined;
  
  // Custom Page handle for Neden Biz
  let values = Array.isArray((sections as any)?.values) ? (sections as any).values : undefined;
  let valuesTitle = (sections as any)?.values_title;
  let valuesSubtitle = (sections as any)?.values_subtitle;

  if (nedenBizPage) {
     valuesTitle = nedenBizPage.title;
     valuesSubtitle = nedenBizPage.summary;
     try {
       const parsedContent = JSON.parse(nedenBizPage.content || "[]");
       if (Array.isArray(parsedContent)) {
         values = parsedContent;
       }
     } catch {
       // content is not JSON, might be HTML description. Use the setting values instead but keep the custom title.
     }
  }

  const sourcePanelItems = Array.isArray(homepageFeaturePanels?.items)
    ? homepageFeaturePanels.items.map((item) => ({ ...item }))
    : [];
  const sourcePanelCover = homepageFeaturePanels?.cover_image_url;

  const timeline = Array.isArray((sections as any)?.timeline) ? (sections as any).timeline : undefined;
  const timelineTitle = (sections as any)?.timeline_title;
  const timelineSubtitle = (sections as any)?.timeline_subtitle;
  const discoveryItems: DiscoveryItem[] = [
    {
      id: "rootstock",
      title: tHome("sections.discovery.items.rootstock.title"),
      description: tHome("sections.discovery.items.rootstock.description"),
      query: { type: "rootstock" },
    },
    {
      id: "greenhouse-tswv",
      title: tHome("sections.discovery.items.greenhouseTswv.title"),
      description: tHome("sections.discovery.items.greenhouseTswv.description"),
      query: { cultivation: "greenhouse", tolerance: "tswv" },
    },
    {
      id: "kapia",
      title: tHome("sections.discovery.items.kapia.title"),
      description: tHome("sections.discovery.items.kapia.description"),
      query: { type: "kapia", taste: "sweet" },
    },
    {
      id: "open-field",
      title: tHome("sections.discovery.items.openField.title"),
      description: tHome("sections.discovery.items.openField.description"),
      query: { cultivation: "openField", taste: "sweet" },
    },
  ];

  return (
    <div className="surface-page overflow-hidden">
      {/* Structured Data — LocalBusiness for homepage (physical presence + brand) */}
      <JsonLd
        type="LocalBusiness"
        data={{
          "@id": `${siteUrl}/#localbusiness`,
          name: siteName,
          url: siteUrl,
          ...(siteLogo && { logo: siteLogo, image: siteLogo }),
          ...(siteSettings.contact_email && { email: siteSettings.contact_email }),
          ...(contactPhone && { telephone: contactPhone }),
          ...(siteSettings.contact_address && {
            address: {
              "@type": "PostalAddress",
              streetAddress: siteSettings.contact_address,
              addressCountry: "TR",
            },
          }),
          ...(siteSettings.contact_map_lat && siteSettings.contact_map_lng && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: siteSettings.contact_map_lat,
              longitude: siteSettings.contact_map_lng,
            },
          }),
          ...(contactPhone && {
            contactPoint: {
              "@type": "ContactPoint",
              telephone: contactPhone,
              contactType: "customer service",
              availableLanguage: ["Turkish", "English", "German"],
            },
          }),
          priceRange: "$$",
          foundingDate: "1990",
          areaServed: { "@type": "Country", name: "Turkey" },
          knowsAbout: ["Tohumculuk", "Hibrit Tohum", "Sebze Tohumu", "Fide Uretimi", "Sera Tarimi"],
        }}
      />

      <AnimatedSections>
        {/* 1. Hero Slider */}
        <HeroSliderClient slides={sliders} />

        {/* 2. Guven Sinyalleri */}
        <TrustBar badges={trustBadges ?? undefined} />

        {/* 3. Istatistikler */}
        <StatsSection items={stats} />

        {/* 4. Bu Mevsim Onerileri */}
        <SeasonalPicks
          title={(sections as any)?.seasonal_picks_title || placeholder || seasonalTitle}
          description={(sections as any)?.seasonal_picks_description || seasonalSubtitle}
          products={seasonalProducts}
        />

        {/* 5. Temel Değerler (Neden Biz) */}
        <ValuesSection title={valuesTitle} subtitle={valuesSubtitle} items={values} />

        <HomepageFeaturePanels
          title={homepageFeaturePanels?.title}
          subtitle={homepageFeaturePanels?.subtitle}
          coverImageUrl={sourcePanelCover}
          coverImageAlt={homepageFeaturePanels?.cover_image_alt}
          items={sourcePanelItems}
        />

        {/* 6. Ekim Rehberi */}
        <PlantingGuide
          title={plantingGuide?.title}
          description={plantingGuide?.description}
          seasons={plantingGuide?.seasons}
        />

        {/* 7. Ekosistem İçeriği */}
        <EcosystemSpotlight
          locale={locale}
          title={tHome("sections.ecosystem.title")}
          subtitle={tHome("sections.ecosystem.subtitle")}
          labels={{
            knowledgeEyebrow: tHome("sections.ecosystem.knowledgeEyebrow"),
            referenceEyebrow: tHome("sections.ecosystem.referenceEyebrow"),
            knowledgeCta: tHome("sections.ecosystem.knowledgeCta"),
            referenceCta: tHome("sections.ecosystem.referenceCta"),
          }}
          knowledgeItems={ecosystemKnowledge}
          referenceItems={ecosystemReferences}
        />

        {/* 8. One Cikan Urunler */}
        <ProductDiscoveryLinks
          locale={locale}
          eyebrow={tHome("sections.discovery.eyebrow")}
          title={tHome("sections.discovery.title")}
          subtitle={tHome("sections.discovery.subtitle")}
          ctaLabel={tHome("sections.discovery.cta")}
          items={discoveryItems}
        />

        <ProductsPreview products={featuredProducts} />

        {/* 9. Tarihçe */}
        <TimelineSection 
          items={timeline} 
          title={timelineTitle}
          subtitle={timelineSubtitle}
        />

        {/* 10. SSS Onizleme */}
        <FaqPreview faqs={faqs} />

        {/* 11. Newsletter */}
        <Newsletter
          title={newsletterConfig?.title || newsletterTitle}
          description={newsletterConfig?.description || newsletterDescription}
          buttonLabel={newsletterConfig?.button_label || newsletterButtonLabel}
          placeholder={newsletterConfig?.placeholder || newsletterPlaceholder}
        />

        {/* 12. Iletisim CTA */}
        <CtaSection />
      </AnimatedSections>
    </div>
  );
}
