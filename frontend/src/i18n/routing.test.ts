import { describe, expect, it } from "vitest";
import { defaultLocale, toLocalizedPath } from "./routing";

describe("i18n routing", () => {
  it("prefixes locale for home", () => {
    expect(toLocalizedPath("/", defaultLocale)).toBe(`/${defaultLocale}`);
  });

  it("localizes known public paths", () => {
    expect(toLocalizedPath("/urunler", "en")).toBe("/en/urunler");
    expect(toLocalizedPath("/urunler", "de")).toBe("/de/urunler");
    expect(toLocalizedPath("/referanslar", "en")).toBe("/en/referanslar");
    expect(toLocalizedPath("/referanslar", "de")).toBe("/de/referanslar");
    expect(toLocalizedPath("/karsilastirma", "de")).toBe("/de/karsilastirma");
    expect(toLocalizedPath("/bayi-agi", "en")).toBe("/en/bayi-agi");
    expect(toLocalizedPath("/toplu-satis", "en")).toBe("/en/toplu-satis");
    expect(toLocalizedPath("/toplu-satis", "de")).toBe("/de/toplu-satis");
    expect(toLocalizedPath("/teklif-al", "en")).toBe("/en/teklif-al");
    expect(toLocalizedPath("/teklif-al", "de")).toBe("/de/teklif-al");
  });
});
