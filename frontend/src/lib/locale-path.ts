import { defaultLocale, isAppLocale, type AppLocale } from "@/i18n/routing";

/**
 * `/panel/...` gibi yolları aktif locale ile önekler; zaten locale varsa dokunmaz.
 * `localePrefix: "as-needed"` → varsayılan dil (tr) öneksizdir.
 */
export function localePath(locale: string, path: string): string {
  if (!path.startsWith("/")) return path;
  const first = path.split("/").filter(Boolean)[0];
  if (first && isAppLocale(first)) return path;
  const loc = isAppLocale(locale) ? locale : defaultLocale;
  const prefix = loc === defaultLocale ? "" : `/${loc}`;
  if (path === "/") return prefix || "/";
  return `${prefix}${path}`;
}

/** `usePathname()` çıktısından locale segmentini çıkarır (`/tr/panel/...` → `/panel/...`). */
export function pathnameWithoutLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && isAppLocale(parts[0] as AppLocale)) {
    const rest = parts.slice(1);
    return rest.length ? `/${rest.join("/")}` : "/";
  }
  return pathname;
}
