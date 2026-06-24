import { describe, expect, it } from "vitest";
import { defaultLocale, toLocalizedPath } from "./routing";

describe("i18n routing", () => {
  it("prefixes locale for home (always)", () => {
    expect(toLocalizedPath("/", defaultLocale)).toBe(`/${defaultLocale}`);
    expect(toLocalizedPath("/", "en")).toBe("/en");
    expect(toLocalizedPath("/", "de")).toBe("/de");
  });

  it("prefixes default-locale public paths", () => {
    expect(toLocalizedPath("/urunler", defaultLocale)).toBe("/tr/urunler");
    expect(toLocalizedPath("/siparis-ver", defaultLocale)).toBe("/tr/siparis-ver");
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
    expect(toLocalizedPath("/siparis-ver", "en")).toBe("/en/siparis-ver");
    expect(toLocalizedPath("/siparis-ver", "de")).toBe("/de/siparis-ver");
  });
});
