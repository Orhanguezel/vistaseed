const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

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
  return {
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
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
  additionalProperties?: { name: string; value: string }[];
}) {
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
