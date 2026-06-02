import { describe, expect, it } from "vitest";
import { defaultLocale, toLocalizedPath } from "./routing";

describe("i18n routing", () => {
  it("keeps the default locale home unprefixed (as-needed)", () => {
    expect(toLocalizedPath("/", defaultLocale)).toBe("/");
  });

  it("keeps default-locale public paths unprefixed", () => {
    expect(toLocalizedPath("/urunler", defaultLocale)).toBe("/urunler");
    expect(toLocalizedPath("/teklif-al", defaultLocale)).toBe("/teklif-al");
  });

  it("prefixes non-default locale home", () => {
    expect(toLocalizedPath("/", "en")).toBe("/en");
    expect(toLocalizedPath("/", "de")).toBe("/de");
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
