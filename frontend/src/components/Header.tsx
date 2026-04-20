"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { API } from "@/config/api-endpoints";
import { ROUTES } from "@/config/routes";
import { getLocaleFromPathname, toLocalizedPath } from "@/i18n/routing";
import { resolveImageUrl } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MegaMenuItem {
  label: string;
  href: string;
  query?: Record<string, string>;
}

interface MegaMenuPanel {
  title: string;
  description?: string;
  exploreLabel?: string;
  exploreHref?: string;
  items: MegaMenuItem[];
}

interface NavItem {
  label: string;
  href: string;
  mega?: MegaMenuPanel;
}

interface HeaderProps {
  siteName?: string;
  siteSubtitle?: string;
  logoUrl?: string;
  logoUrlDark?: string;
}

interface HeaderSearchSuggestion {
  id: string;
  title: string;
  slug: string;
  image_url?: string | null;
  product_code?: string | null;
  category?: {
    name?: string | null;
  } | null;
}

/* ------------------------------------------------------------------ */
/*  Chevron SVG                                                        */
/* ------------------------------------------------------------------ */

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className}>
      <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Search icon                                                        */
/* ------------------------------------------------------------------ */

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Header({
  siteName = "",
  siteSubtitle = "",
  logoUrl = "",
  logoUrlDark = "",
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const tNav = useTranslations("Common.navigation");
  const tHeader = useTranslations("Header");
  const locale = getLocaleFromPathname(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HeaderSearchSuggestion[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = pathname === "/";

  // Close mobile & mega on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMega(null);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchLoading(false);
    setActiveSuggestionIndex(-1);
    document.body.style.overflow = "auto";
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const term = searchQuery.trim();

    if (term.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const params = new URLSearchParams({
          locale,
          q: term,
          limit: "5",
          is_active: "true",
          sort: "order_num",
          order: "asc",
        });
        const response = await fetch(`${BASE_URL}${API.products.list}?${params.toString()}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("fetch_failed");
        const json = await response.json();
        const data = Array.isArray(json) ? json : json.data ?? [];
        if (!cancelled) {
          setSearchResults(data);
          setActiveSuggestionIndex(-1);
        }
      } catch {
        if (!cancelled) {
          setSearchResults([]);
          setActiveSuggestionIndex(-1);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [searchQuery, locale]);

  // Scroll detection for transparent → solid transition
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mega menu hover handlers (with delay to prevent flicker)
  const handleEnter = useCallback((key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMega(key);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMega(null), 150);
  }, []);

  const navItems: NavItem[] = [
    {
      label: tNav("home"),
      href: ROUTES.home,
    },
    {
      label: tNav("products"),
      href: ROUTES.products.list,
      mega: {
        title: tNav("products"),
        description: tHeader("productsDescription"),
        exploreLabel: tHeader("allProducts"),
        exploreHref: ROUTES.products.list,
        items: [
          { label: tHeader("vegetableSeeds"), href: ROUTES.products.list },
          { label: tHeader("fieldSeeds"), href: ROUTES.products.list },
          { label: tHeader("rootstockRoute"), href: ROUTES.products.list, query: { type: "rootstock" } },
          { label: tHeader("greenhouseRoute"), href: ROUTES.products.list, query: { cultivation: "greenhouse" } },
          { label: tHeader("tswvRoute"), href: ROUTES.products.list, query: { tolerance: "tswv" } },
          { label: tHeader("kapiaRoute"), href: ROUTES.products.list, query: { type: "kapia", taste: "sweet" } },
          { label: tNav("compare"), href: ROUTES.static.compare },
        ],
      },
    },
    {
      label: tNav("corporate"),
      href: ROUTES.static.about,
      mega: {
        title: tNav("corporate"),
        description: tHeader("corporateDescription"),
        items: [
          { label: tNav("about"), href: ROUTES.static.about },
          { label: tNav("references"), href: ROUTES.static.references },
          { label: tHeader("rdCenter"), href: ROUTES.static.rd_center },
          { label: tHeader("sustainability"), href: ROUTES.static.sustainability },
          { label: tNav("dealerNetwork"), href: ROUTES.static.dealer_network },
          { label: tNav("bulkSales"), href: ROUTES.static.bulk_sales },
          { label: tNav("hr"), href: ROUTES.static.hr },
        ],
      },
    },
    {
      label: tNav("support"),
      href: ROUTES.static.faq,
      mega: {
        title: tHeader("knowledgeCenter"),
        description: tHeader("supportDescription"),
        items: [
          { label: tHeader("knowledgeBase"), href: ROUTES.static.knowledge_base },
          { label: tHeader("plantingGuide"), href: ROUTES.static.planting_guide },
          { label: tNav("blog"), href: ROUTES.static.blog },
          { label: tNav("references"), href: ROUTES.static.references },
          { label: tNav("faq"), href: ROUTES.static.faq },
          { label: tNav("contact"), href: ROUTES.static.contact },
        ],
      },
    },
    { label: tHeader("dealerLogin"), href: ROUTES.static.dealer_login },
  ];

  const searchPlaceholder = tHeader("searchPlaceholder");
  const searchLoadingLabel = tHeader("searchLoading");
  const searchEmptyLabel = tHeader("searchEmpty");
  const searchResultsLabel = tHeader("searchResults");
  const searchViewAllLabel = tHeader("searchViewAll");
  const homeAriaLabel = tHeader("homeAriaLabel");
  const searchAriaLabel = tHeader("searchAriaLabel");
  const menuAriaLabel = tHeader("menuAriaLabel");

  const localize = (href: string) => toLocalizedPath(href, locale);
  const localizeItemHref = (item: MegaMenuItem) => {
    const base = localize(item.href);
    if (!item.query) return base;
    const queryString = new URLSearchParams(item.query).toString();
    return queryString ? `${base}?${queryString}` : base;
  };

  const isActive = (href: string) => {
    const localizedHref = localize(href);
    return pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
  };

  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;

  // Use perfectly identical logo files (same size/shape) for seamless theme transition
  const LOGO_GREEN = "/uploads/media/logo/vistaseed_logo_green.png";
  const LOGO_WHITE = "/uploads/media/logo/vistaseed_logo_white.png";
  
  const resolvedLogoUrl = currentTheme === "dark" ? LOGO_WHITE : LOGO_GREEN;

  const isTransparent = false;

  function resolveSuggestionImage(url?: string | null) {
    if (!url) return "/assets/images/noImage.png";
    return resolveImageUrl(url);
  }

  function submitSearch() {
    const trimmedQuery = searchQuery.trim();
    const basePath = localize(ROUTES.products.list);

    if (!trimmedQuery) {
      router.push(basePath);
      setSearchOpen(false);
      setMobileOpen(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    const params = new URLSearchParams({ q: trimmedQuery });
    router.push(`${basePath}?${params.toString()}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setActiveSuggestionIndex(-1);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeSuggestionIndex >= 0 && searchResults[activeSuggestionIndex]) {
      router.push(toLocalizedPath(ROUTES.products.detail(searchResults[activeSuggestionIndex].slug), locale));
      setSearchOpen(false);
      setMobileOpen(false);
      setActiveSuggestionIndex(-1);
      return;
    }
    submitSearch();
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!searchResults.length) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((current) => (current + 1) % searchResults.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((current) => (current <= 0 ? searchResults.length - 1 : current - 1));
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setSearchOpen(false);
      setMobileOpen(false);
      setActiveSuggestionIndex(-1);
    }
  }

  function renderSearchSuggestions() {
    const term = searchQuery.trim();
    if (term.length < 2) return null;

    return (
      <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-2xl shadow-black/10">
        <div className="border-b border-border/50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">
          {searchResultsLabel}
        </div>
        {searchLoading ? (
          <div className="px-4 py-4 text-sm text-muted-foreground">{searchLoadingLabel}</div>
        ) : searchResults.length === 0 ? (
          <div className="px-4 py-4 text-sm text-muted-foreground">{searchEmptyLabel}</div>
        ) : (
          <div className="divide-y divide-border/40">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                href={toLocalizedPath(ROUTES.products.detail(product.slug), locale)}
                className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors ${
                  activeSuggestionIndex >= 0 && searchResults[activeSuggestionIndex]?.id === product.id
                    ? "bg-brand/10"
                    : "hover:bg-brand/5"
                }`}
                onClick={() => {
                  setSearchOpen(false);
                  setMobileOpen(false);
                  setActiveSuggestionIndex(-1);
                }}
                onMouseEnter={() => setActiveSuggestionIndex(searchResults.findIndex((item) => item.id === product.id))}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-background">
                    <Image
                      src={resolveSuggestionImage(product.image_url)}
                      alt={product.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{product.title}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {[product.category?.name, product.product_code].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">→</span>
              </Link>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={submitSearch}
          className="flex w-full items-center justify-between border-t border-border/50 px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
        >
          <span>{searchViewAllLabel}</span>
          <span>→</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 lg:h-24 flex items-center justify-between">

          {/* Left: Logo + Name */}
          <Link href={localize(ROUTES.home)} aria-label={siteName || homeAriaLabel} className="inline-flex items-center gap-3 md:gap-4 shrink-0 h-full group transition-all">
            {resolvedLogoUrl && (
              <div className="flex items-center h-full py-0 transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src={resolvedLogoUrl}
                  alt={siteName || "Logo"}
                  width={300}
                  height={80}
                  priority
                  className="h-full w-auto object-contain transition-all duration-300"
                />
              </div>
            )}
            
            {!resolvedLogoUrl && (
              <div className="flex flex-col leading-none" aria-hidden="true">
                <span className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-foreground uppercase transition-all">
                  {siteName || "VISTA SEED"}
                </span>
                <span className="text-[9px] md:text-[10px] lg:text-xs font-bold tracking-[0.2em] text-brand uppercase mt-1 opacity-80">
                  {siteSubtitle || "Digital Ecosystem"}
                </span>
              </div>
            )}
          </Link>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.mega && handleEnter(item.label)}
                onMouseLeave={() => item.mega && handleLeave()}
              >
                <Link
                  href={localize(item.href)}
                  className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-[14px] font-bold tracking-tight transition-all rounded-full ${
                    isActive(item.href)
                      ? "text-brand bg-brand/5 shadow-sm shadow-brand/10"
                      : "text-foreground/80 hover:text-brand hover:bg-brand/5"
                  }`}
                >
                  {item.label}
                  {item.mega && (
                    <ChevronDown
                      className={`transition-transform duration-300 ${
                        openMega === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right: Search + Theme + Hamburger */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex w-10 h-10 items-center justify-center rounded-full text-muted hover:text-brand hover:bg-brand/5 border border-transparent hover:border-brand/10 transition-all duration-300"
              aria-label={searchAriaLabel}
            >
              <SearchIcon />
            </button>

            <div className="w-[1px] h-6 bg-border/60 mx-1 hidden sm:block" />

            <ThemeToggle />

            {/* Hamburger (mobile) */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-bg-alt/50 text-foreground hover:bg-brand/5 hover:text-brand transition-all"
              aria-label={menuAriaLabel}
              aria-expanded={mobileOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar (slide down) */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-border/50 animate-in slide-in-from-top-4 duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full h-14 pl-12 pr-6 text-base rounded-2xl bg-background border border-border/60 text-foreground placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <SearchIcon />
                </div>
                {renderSearchSuggestions()}
              </form>
            </div>
          </div>
        )}

        {/* Mega menu dropdown (desktop) */}
        {openMega && (
          <div
            className="hidden lg:block absolute left-0 right-0 top-full bg-surface/98 backdrop-blur-xl border-t border-border/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 animate-in fade-in slide-in-from-top-2 duration-300"
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
            }}
            onMouseLeave={handleLeave}
          >
            {navItems.filter((n) => n.mega && n.label === openMega).map((item) => {
              const mega = item.mega!;
              return (
                <div key={item.label} className="max-w-7xl mx-auto px-6 py-12">
                  <div className="grid grid-cols-[320px_1fr] gap-16">
                    {/* Left: Description */}
                    <div className="space-y-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand/5 text-brand">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-foreground tracking-tight">
                          {mega.title}
                        </h3>
                        {mega.description && (
                          <p className="text-base text-muted leading-relaxed">
                            {mega.description}
                          </p>
                        )}
                      </div>
                      {mega.exploreLabel && mega.exploreHref && (
                        <Link
                          href={localize(mega.exploreHref)}
                          className="inline-flex items-center gap-2 text-sm font-black text-brand uppercase tracking-widest hover:gap-3 transition-all"
                        >
                          {mega.exploreLabel}
                          <span>→</span>
                        </Link>
                      )}
                    </div>

                    {/* Right: Links */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {mega.items.map((mi) => (
                        <Link
                          key={mi.label + mi.href}
                          href={localizeItemHref(mi)}
                          className="group flex items-center justify-between py-4 px-4 rounded-2xl hover:bg-brand/5 transition-all underline-offset-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand/20 group-hover:bg-brand group-hover:scale-150 transition-all" />
                            <span className="text-base font-semibold text-foreground/80 group-hover:text-brand transition-colors">
                              {mi.label}
                            </span>
                          </div>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted/40 group-hover:text-brand opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden fixed inset-x-0 bottom-0 top-[64px] z-50 bg-surface overflow-y-auto border-t border-border/10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-2">
              {navItems.map((item) => (
                <div key={item.label} className="space-y-1">
                  <Link
                    href={localize(item.href)}
                    className={`flex items-center justify-between px-4 py-4 rounded-2xl text-base font-bold transition-all ${
                      isActive(item.href)
                        ? "text-brand bg-brand/5 border border-brand/10"
                        : "text-foreground hover:bg-bg-alt border border-transparent"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                  {/* Mobile sub-items */}
                  {item.mega && (
                    <div className="grid grid-cols-1 gap-1 pl-4 pt-1">
                      {item.mega.items.map((mi) => (
                        <Link
                          key={mi.label + mi.href}
                          href={localizeItemHref(mi)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            isActive(mi.href)
                              ? "text-brand bg-brand/5"
                              : "text-muted hover:text-brand hover:bg-bg-alt"
                          }`}
                        >
                          <div className="w-1 h-1 rounded-full bg-brand/40" />
                          {mi.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-8 pt-8 border-t border-border/50">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full h-14 pl-12 pr-4 text-base rounded-2xl bg-background border border-border/80 text-foreground outline-none focus:border-brand"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                    <SearchIcon />
                  </div>
                </form>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Overlay to close mega menu on click outside */}
      {openMega && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenMega(null)}
        />
      )}
    </>
  );
}
