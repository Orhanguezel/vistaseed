import { describe, expect, it } from "vitest";
import { getLocaleAlternates } from "./seo";

describe("seo alternates", () => {
  it("builds canonical and hreflang links for localized pages", () => {
    const alternates = getLocaleAlternates("en", "/urunler");

    expect(alternates.canonical).toContain("/en/urunler");
    expect(alternates.languages.en).toContain("/en/urunler");
    expect(alternates.languages.de).toContain("/de/urunler");
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

    expect(alternates.canonical).toContain("/en/karsilastirma");
    expect(alternates.languages.tr).toContain("/tr/karsilastirma");
    expect(alternates.languages.de).toContain("/de/karsilastirma");
  });

  it("builds localized alternates for the dealer network page", () => {
    const alternates = getLocaleAlternates("de", "/bayi-agi");

    expect(alternates.canonical).toContain("/de/bayi-agi");
    expect(alternates.languages.tr).toContain("/tr/bayi-agi");
    expect(alternates.languages.en).toContain("/en/bayi-agi");
  });

  it("builds localized alternates for the bulk sales page", () => {
    const alternates = getLocaleAlternates("en", "/toplu-satis");

    expect(alternates.canonical).toContain("/en/toplu-satis");
    expect(alternates.languages.tr).toContain("/tr/toplu-satis");
    expect(alternates.languages.de).toContain("/de/toplu-satis");
  });

  it("builds localized alternates for the offer request page", () => {
    const alternates = getLocaleAlternates("tr", "/teklif-al");

    expect(alternates.canonical).toContain("/tr/teklif-al");
    expect(alternates.languages.en).toContain("/en/teklif-al");
    expect(alternates.languages.de).toContain("/de/teklif-al");
    expect(alternates.languages["x-default"]).toContain("/tr/teklif-al");
  });

  it("builds localized alternates for the references page", () => {
    const alternates = getLocaleAlternates("de", "/referanslar");

    expect(alternates.canonical).toContain("/de/referanslar");
    expect(alternates.languages.tr).toContain("/tr/referanslar");
    expect(alternates.languages.en).toContain("/en/referanslar");
  });
});
