import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { isAppLocale, routing } from "@/i18n/routing";
import { getPublicApiV1 } from "@/lib/runtime-config";

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false,
});

// Panelden yönetilen URL yönlendirmeleri: 301 (taşındı) / 410 (kalıcı kaldırıldı).
// Kurallar backend'den çekilip kısa TTL ile bellekte tutulur; her istekte DB'ye gidilmez.
type RedirectRule = { source_path: string; type: "301" | "410"; destination: string | null };

const REDIRECT_TTL_MS = 60_000;
let redirectCache: { at: number; rules: Map<string, RedirectRule> } | null = null;

function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

async function getRedirectRules(): Promise<Map<string, RedirectRule>> {
  const now = Date.now();
  if (redirectCache && now - redirectCache.at < REDIRECT_TTL_MS) return redirectCache.rules;

  const map = new Map<string, RedirectRule>();
  try {
    const res = await fetch(`${getPublicApiV1()}/redirects/active`, { cache: "no-store" });
    if (res.ok) {
      const rows = (await res.json()) as RedirectRule[];
      for (const r of rows) {
        if (r?.source_path) map.set(normalizePath(r.source_path), r);
      }
    }
  } catch {
    // Backend erişilemezse mevcut (veya boş) önbellek korunur; site çalışmaya devam eder.
  }
  redirectCache = { at: now, rules: map };
  return map;
}

function buildRedirectResponse(rule: RedirectRule, request: NextRequest): NextResponse | null {
  if (rule.type === "410") {
    return new NextResponse("410 Gone", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }
  const pathname = request.nextUrl.pathname;
  if (rule.destination && rule.destination !== pathname) {
    const target = rule.destination.startsWith("http")
      ? rule.destination
      : new URL(`${rule.destination}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(target, 301);
  }
  return null;
}

/** Next.js 16+: `proxy.ts` varsayılan dışa aktarımı kullanmalı; aksi halde i18n middleware hiç çalışmaz. */
export default async function proxy(request: NextRequest) {
  const rule = (await getRedirectRules()).get(normalizePath(request.nextUrl.pathname));
  if (rule) {
    const redirectRes = buildRedirectResponse(rule, request);
    if (redirectRes) return redirectRes;
  }

  const res = await Promise.resolve(intlMiddleware(request));
  const pathname = request.nextUrl.pathname;
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isAppLocale(first)) {
    res.headers.set("x-vistaseeds-locale", first);
  }
  return res;
}

export const config = {
  matcher: ["/", "/(tr|en|de)/:path*", "/((?!api|weather-widget-api|_next|_vercel|.*\\..*).*)"],
};
