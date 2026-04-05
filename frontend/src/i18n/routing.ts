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
    "/urunler": { tr: "/urunler", en: "/products", de: "/produkte" },
    "/hakkimizda": { tr: "/hakkimizda", en: "/about", de: "/uber-uns" },
    "/insan-kaynaklari": { tr: "/insan-kaynaklari", en: "/careers", de: "/karriere" },
    "/sss": { tr: "/sss", en: "/faq", de: "/faq" },
    "/iletisim": { tr: "/iletisim", en: "/contact", de: "/kontakt" },
    "/destek": { tr: "/destek", en: "/support", de: "/support" },
    "/gizlilik-politikasi": { tr: "/gizlilik-politikasi", en: "/privacy-policy", de: "/datenschutz" },
    "/kullanim-kosullari": { tr: "/kullanim-kosullari", en: "/terms-of-use", de: "/nutzungsbedingungen" },
    "/kvkk": { tr: "/kvkk", en: "/kvkk", de: "/kvkk" },
    "/bayi-girisi": { tr: "/bayi-girisi", en: "/dealer-login", de: "/handler-login" },
    "/uye-girisi": { tr: "/uye-girisi", en: "/member-login", de: "/mitglied-login" },
    "/bilgi-bankasi": { tr: "/bilgi-bankasi", en: "/knowledge-base", de: "/wissensdatenbank" },
    "/ekim-rehberi": { tr: "/ekim-rehberi", en: "/planting-guide", de: "/anbauleitfaden" },
    "/arge-merkezi": { tr: "/arge-merkezi", en: "/r-and-d-center", de: "/forschungszentrum" },
    "/surdurulebilirlik": { tr: "/surdurulebilirlik", en: "/sustainability", de: "/nachhaltigkeit" },
    "/blog": { tr: "/blog", en: "/blog", de: "/blog" },
    "/referanslar": { tr: "/referanslar", en: "/references", de: "/referenzen" },
    "/karsilastirma": { tr: "/karsilastirma", en: "/compare", de: "/vergleich" },
    "/bayi-agi": { tr: "/bayi-agi", en: "/dealer-network", de: "/handlernetz" },
    "/toplu-satis": { tr: "/toplu-satis", en: "/bulk-sales", de: "/grossverkauf" },
    "/panel/destek": { tr: "/panel/destek", en: "/panel/destek", de: "/panel/destek" },
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
