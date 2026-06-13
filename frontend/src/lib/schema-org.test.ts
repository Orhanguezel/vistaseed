import { describe, expect, it } from "vitest";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "./schema-org";

describe("schema-org helpers", () => {
  it("builds product schema with aggregate rating and properties", () => {
    const schema = buildProductJsonLd({
      name: "Lucky F1",
      description: "Hybrid pepper seed",
      image: ["https://example.com/lucky.webp"],
      pageUrl: "https://example.com/tr/urunler/lucky-f1",
      sku: "LCK-F1",
      category: "Pepper",
      brandName: "vistaseeds",
      tags: ["hibrit", "erkenci"],
      ratingValue: 4.6,
      reviewCount: 12,
      price: 120,
      currency: "TRY",
      inStock: true,
      additionalProperties: [
        { name: "Adaptation", value: "Aegean" },
        { name: "Harvest", value: "Seasonal" },
      ],
    });

    expect(schema.name).toBe("Lucky F1");
    expect(schema.url).toContain("/tr/urunler/lucky-f1");
    expect(schema.brand).toEqual({ "@type": "Brand", name: "vistaseeds" });
    expect(schema.aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: 4.6,
      reviewCount: 12,
      bestRating: 5,
      worstRating: 1,
    });
    expect(schema.offers).toEqual({
      "@type": "Offer",
      price: 120,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: "https://example.com/tr/urunler/lucky-f1",
    });
    expect(schema.additionalProperty).toHaveLength(2);
    expect(schema.keywords).toContain("hibrit");
  });

  it("omits offers entirely when no price is provided (teklif/quote model)", () => {
    const schema = buildProductJsonLd({
      name: "Quote Only F1",
      pageUrl: "https://example.com/tr/urunler/quote-only-f1",
      brandName: "vistaseeds",
      inStock: false,
    });

    // Fiyatsız Offer Merchant listings'te "price eksik" hatası verir -> hiç eklenmez.
    expect(schema.offers).toBeUndefined();
    expect(schema.aggregateRating).toBeUndefined();
  });

  it("drops breadcrumb items with empty names and renumbers positions", () => {
    const schema = buildBreadcrumbJsonLd([
      { name: "Ana Sayfa", url: "https://example.com/tr" },
      { name: "  ", url: "https://example.com/tr/urunler?category=" },
      { name: "Domates", url: "https://example.com/tr/urunler/domates" },
    ]);

    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]).toMatchObject({ position: 1, name: "Ana Sayfa" });
    expect(schema.itemListElement[1]).toMatchObject({ position: 2, name: "Domates" });
  });
});
