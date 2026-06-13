import { getPublicSiteOrigin } from "@/lib/runtime-config";

const SITE_URL = getPublicSiteOrigin();

export function siteOrigin(): string {
  return SITE_URL;
}

export function buildArticleJsonLd(input: {
  headline: string;
  description: string | null;
  image: string | null;
  datePublished: string;
  dateModified?: string | null;
  pageUrl: string;
  publisherName: string;
  publisherLogoUrl?: string | null;
  authorName?: string | null;
}) {
  const publisherLogo = input.publisherLogoUrl
    ? (input.publisherLogoUrl.startsWith("http") ? input.publisherLogoUrl : `${SITE_URL}${input.publisherLogoUrl}`)
    : undefined;

  return {
    headline: input.headline,
    ...(input.description && { description: input.description }),
    ...(input.image && { image: [input.image] }),
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.pageUrl,
    },
    author: {
      "@type": "Organization",
      name: input.authorName || input.publisherName,
      url: SITE_URL,
      knowsAbout: ["Tohumculuk", "Hibrit Tohum", "Sebze Yetiştiriciliği", "Sera Tarımı"],
    },
    publisher: {
      "@type": "Organization",
      name: input.publisherName,
      url: SITE_URL,
      ...(publisherLogo && {
        logo: { "@type": "ImageObject", url: publisherLogo },
      }),
    },
    inLanguage: "tr",
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  // Boş/eksik isimli item'lar Google'da "name belirtilmelidir" hatası verir.
  // Çevirisi gelmemiş veya kategori adı boş gelen item'ları ele, pozisyonları yeniden numaralandır.
  const validItems = items.filter((it) => Boolean(it.name?.trim()) && Boolean(it.url));

  return {
    itemListElement: validItems.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name.trim(),
      item: it.url,
    })),
  };
}

export function buildItemListJsonLd(items: { name: string; url: string; image?: string | null }[]) {
  return {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      name: item.name,
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}

export function buildFaqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function buildProductJsonLd(input: {
  name: string;
  description?: string | null;
  image?: string[];
  pageUrl: string;
  sku?: string | null;
  category?: string | null;
  brandName: string;
  tags?: string[];
  ratingValue?: number | null;
  reviewCount?: number | null;
  price?: number | null;
  currency?: string;
  inStock?: boolean;
  additionalProperties?: { name: string; value: string }[];
}) {
  const availability = `https://schema.org/${input.inStock === false ? "OutOfStock" : "InStock"}`;
  // Teklif (fiyatsız) modeli: fiyat yoksa "offers" HİÇ eklenmez. Fiyatsız Offer,
  // Google Merchant listings'te "price alanı eksik" hatası üretir (schema.org/Offer price ister).
  // Fiyat varsa geçerli fiyatlı offer eklenir.
  const offers = input.price && input.price > 0
    ? {
        "@type": "Offer",
        price: Number(input.price.toFixed(2)),
        priceCurrency: input.currency ?? "TRY",
        availability,
        url: input.pageUrl,
      }
    : null;
  return {
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.image?.length && { image: input.image }),
    url: input.pageUrl,
    ...(input.sku && { sku: input.sku }),
    brand: {
      "@type": "Brand",
      name: input.brandName,
    },
    manufacturer: {
      "@type": "Organization",
      name: input.brandName,
      url: SITE_URL,
    },
    ...(input.category && { category: input.category }),
    ...(input.tags?.length && { keywords: input.tags.join(", ") }),
    ...(offers && { offers }),
    ...(input.ratingValue && input.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(input.ratingValue.toFixed(1)),
            reviewCount: input.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(input.additionalProperties?.length
      ? {
          additionalProperty: input.additionalProperties.map((prop) => ({
            "@type": "PropertyValue",
            name: prop.name,
            value: prop.value,
          })),
        }
      : {}),
  };
}
