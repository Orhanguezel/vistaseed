"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  appLocales,
  getLocaleFromPathname,
  localeLabels,
  toLocalizedPath,
} from "@/i18n/routing";
import { pathnameWithoutLocale } from "@/lib/locale-path";
import { cn } from "@/lib/utils";

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

interface Props {
  className?: string;
}

export function LanguageSwitcher({ className }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeLocale = getLocaleFromPathname(pathname);
  const basePath = pathnameWithoutLocale(pathname);
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : "";

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(locale: string) {
    setOpen(false);
    if (locale === activeLocale) return;
    router.push(`${toLocalizedPath(basePath, locale)}${suffix}`);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Dil / Language"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-muted hover:text-foreground hover:bg-bg-alt transition-colors"
      >
        <GlobeIcon />
        <span>{localeLabels[activeLocale].short}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-border-soft bg-surface py-1 shadow-lg"
        >
          {appLocales.map((locale) => (
            <li key={locale}>
              <button
                type="button"
                role="option"
                aria-selected={locale === activeLocale}
                onClick={() => switchTo(locale)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors",
                  locale === activeLocale
                    ? "font-semibold text-brand"
                    : "text-foreground hover:bg-bg-alt",
                )}
              >
                <span>{localeLabels[locale].native}</span>
                <span className="text-xs text-muted">{localeLabels[locale].short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
