import { describe, expect, it } from "vitest";
import { defaultLocale, toLocalizedPath } from "./routing";

describe("i18n routing", () => {
  it("prefixes locale for home", () => {
    expect(toLocalizedPath("/", defaultLocale)).toBe(`/${defaultLocale}`);
  });

  it("localizes known public paths", () => {
    expect(toLocalizedPath("/urunler", "en")).toBe("/en/products");
    expect(toLocalizedPath("/urunler", "de")).toBe("/de/produkte");
    expect(toLocalizedPath("/referanslar", "en")).toBe("/en/references");
    expect(toLocalizedPath("/referanslar", "de")).toBe("/de/referenzen");
    expect(toLocalizedPath("/karsilastirma", "de")).toBe("/de/vergleich");
    expect(toLocalizedPath("/bayi-agi", "en")).toBe("/en/dealer-network");
    expect(toLocalizedPath("/toplu-satis", "en")).toBe("/en/bulk-sales");
    expect(toLocalizedPath("/toplu-satis", "de")).toBe("/de/grossverkauf");
  });
});
