import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { isAppLocale, routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Next.js 16+: `proxy.ts` varsayılan dışa aktarımı kullanmalı; aksi halde i18n middleware hiç çalışmaz. */
export default async function proxy(request: NextRequest) {
  const res = await Promise.resolve(intlMiddleware(request));
  const pathname = request.nextUrl.pathname;
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isAppLocale(first)) {
    res.headers.set("x-vistaseed-locale", first);
  }
  return res;
}

export const config = {
  matcher: ["/", "/(tr|en|de)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
