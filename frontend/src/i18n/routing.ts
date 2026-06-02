import { defineRouting } from "next-intl/routing";

export const appLocales = ["tr", "en", "de"] as const;
export type AppLocale = (typeof appLocales)[number];
export const defaultLocale: AppLocale = "tr";

/** Dil değiştirici için merkezi etiketler (endonim) — hard-code yerine config kaynağı. */
export const localeLabels: Record<AppLocale, { native: string; short: string }> = {
  tr: { native: "Türkçe", short: "TR" },
  en: { native: "English", short: "EN" },
  de: { native: "Deutsch", short: "DE" },
};

export const routing = defineRouting({
  locales: appLocales,
  defaultLocale: defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/urunler": "/urunler",
    "/hakkimizda": "/hakkimizda",
    "/insan-kaynaklari": "/insan-kaynaklari",
    "/sss": "/sss",
    "/iletisim": "/iletisim",
    "/destek": "/destek",
    "/gizlilik-politikasi": "/gizlilik-politikasi",
    "/iade-politikasi": "/iade-politikasi",
    "/kullanim-kosullari": "/kullanim-kosullari",
    "/kvkk": "/kvkk",
    "/bayi-girisi": "/bayi-girisi",
    "/uye-girisi": "/uye-girisi",
    "/bilgi-bankasi": "/bilgi-bankasi",
    "/ekim-rehberi": "/ekim-rehberi",
    "/arge-merkezi": "/arge-merkezi",
    "/surdurulebilirlik": "/surdurulebilirlik",
    "/blog": "/blog",
    "/referanslar": "/referanslar",
    "/karsilastirma": "/karsilastirma",
    "/bayi-agi": "/bayi-agi",
    "/toplu-satis": "/toplu-satis",
    "/panel/destek": "/panel/destek",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return (appLocales as readonly string[]).includes(value);
}

export function getLocaleFromPathname(pathname: string): AppLocale {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isAppLocale(first) ? first : defaultLocale;
}

export function localePrefix(locale: string): string {
  const safeLocale = isAppLocale(locale) ? locale : defaultLocale;
  // `localePrefix: "always"` → tüm diller (tr dahil) URL önekli.
  return `/${safeLocale}`;
}

export function toLocalizedPath(pathname: string, locale: string): string {
  const safeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const prefix = localePrefix(safeLocale);
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalizedPathname === "/") {
    return prefix;
  }

  const matchedPathname = Object.keys(routing.pathnames)
    .sort((left, right) => right.length - left.length)
    .find((candidate) => normalizedPathname === candidate || normalizedPathname.startsWith(`${candidate}/`));

  if (!matchedPathname) {
    return `${prefix}${normalizedPathname}`;
  }

  const localizedEntry = routing.pathnames[matchedPathname as Pathnames];
  const localizedBase =
    typeof localizedEntry === "string" ? localizedEntry : (localizedEntry[safeLocale] ?? matchedPathname);
  const suffix = normalizedPathname.slice(matchedPathname.length);

  return `${prefix}${localizedBase}${suffix}`;
}
