import { defineRouting } from "next-intl/routing";

export const appLocales = ["tr", "en", "de"] as const;
export type AppLocale = (typeof appLocales)[number];
export const defaultLocale: AppLocale = "tr";

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

export function toLocalizedPath(pathname: string, locale: string): string {
  const safeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalizedPathname === "/") {
    return `/${safeLocale}`;
  }

  const matchedPathname = Object.keys(routing.pathnames)
    .sort((left, right) => right.length - left.length)
    .find((candidate) => normalizedPathname === candidate || normalizedPathname.startsWith(`${candidate}/`));

  if (!matchedPathname) {
    return `/${safeLocale}${normalizedPathname}`;
  }

  const localizedEntry = routing.pathnames[matchedPathname as Pathnames];
  const localizedBase =
    typeof localizedEntry === "string" ? localizedEntry : (localizedEntry[safeLocale] ?? matchedPathname);
  const suffix = normalizedPathname.slice(matchedPathname.length);

  return `/${safeLocale}${localizedBase}${suffix}`;
}
