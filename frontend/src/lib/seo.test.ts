import { describe, expect, it } from "vitest";
import { getLocaleAlternates } from "./seo";

describe("seo alternates", () => {
  it("builds canonical and hreflang links for localized pages", () => {
    const alternates = getLocaleAlternates("en", "/urunler");

    expect(alternates.canonical).toContain("/en/products");
    expect(alternates.languages.en).toContain("/en/products");
    expect(alternates.languages.de).toContain("/de/produkte");
    expect(alternates.languages.tr).toContain("/tr/urunler");
    expect(alternates.languages["x-default"]).toContain("/tr/urunler");
  });

  it("preserves dynamic slug paths across localized blog alternates", () => {
    const alternates = getLocaleAlternates("tr", "/blog/antigravity-seed");

    expect(alternates.canonical).toContain("/tr/blog/antigravity-seed");
    expect(alternates.languages.en).toContain("/en/blog/antigravity-seed");
    expect(alternates.languages.de).toContain("/de/blog/antigravity-seed");
  });

  it("builds localized alternates for the compare page", () => {
    const alternates = getLocaleAlternates("en", "/karsilastirma");

    expect(alternates.canonical).toContain("/en/compare");
    expect(alternates.languages.tr).toContain("/tr/karsilastirma");
    expect(alternates.languages.de).toContain("/de/vergleich");
  });

  it("builds localized alternates for the dealer network page", () => {
    const alternates = getLocaleAlternates("de", "/bayi-agi");

    expect(alternates.canonical).toContain("/de/handlernetz");
    expect(alternates.languages.tr).toContain("/tr/bayi-agi");
    expect(alternates.languages.en).toContain("/en/dealer-network");
  });

  it("builds localized alternates for the bulk sales page", () => {
    const alternates = getLocaleAlternates("en", "/toplu-satis");

    expect(alternates.canonical).toContain("/en/bulk-sales");
    expect(alternates.languages.tr).toContain("/tr/toplu-satis");
    expect(alternates.languages.de).toContain("/de/grossverkauf");
  });

  it("builds localized alternates for the references page", () => {
    const alternates = getLocaleAlternates("de", "/referanslar");

    expect(alternates.canonical).toContain("/de/referenzen");
    expect(alternates.languages.tr).toContain("/tr/referanslar");
    expect(alternates.languages.en).toContain("/en/references");
  });
});
