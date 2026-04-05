import { describe, expect, it } from "vitest";
import { buildProductJsonLd } from "./schema-org";

describe("schema-org helpers", () => {
  it("builds product schema with aggregate rating and properties", () => {
    const schema = buildProductJsonLd({
      name: "Lucky F1",
      description: "Hybrid pepper seed",
      image: ["https://example.com/lucky.webp"],
      pageUrl: "https://example.com/tr/urunler/lucky-f1",
      sku: "LCK-F1",
      category: "Pepper",
      brandName: "VistaSeed",
      tags: ["hibrit", "erkenci"],
      ratingValue: 4.6,
      reviewCount: 12,
      additionalProperties: [
        { name: "Adaptation", value: "Aegean" },
        { name: "Harvest", value: "Seasonal" },
      ],
    });

    expect(schema.name).toBe("Lucky F1");
    expect(schema.url).toContain("/tr/urunler/lucky-f1");
    expect(schema.brand).toEqual({ "@type": "Brand", name: "VistaSeed" });
    expect(schema.aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: 4.6,
      reviewCount: 12,
    });
    expect(schema.additionalProperty).toHaveLength(2);
    expect(schema.keywords).toContain("hibrit");
  });
});
