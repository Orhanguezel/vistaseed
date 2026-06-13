import { NextResponse, type NextRequest } from "next/server";
import { getPublicApiV1 } from "@/lib/runtime-config";

// Panelden yönetilen URL yönlendirmeleri: 301 (taşındı) / 410 (kalıcı kaldırıldı).
// Kurallar backend'den çekilip kısa TTL ile bellekte tutulur; her istekte DB'ye gidilmez.

type RedirectRule = { source_path: string; type: "301" | "410"; destination: string | null };

const TTL_MS = 60_000;
let cache: { at: number; rules: Map<string, RedirectRule> } | null = null;

function normalize(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

async function getRules(): Promise<Map<string, RedirectRule>> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.rules;

  const map = new Map<string, RedirectRule>();
  try {
    const res = await fetch(`${getPublicApiV1()}/redirects/active`, { cache: "no-store" });
    if (res.ok) {
      const rows = (await res.json()) as RedirectRule[];
      for (const r of rows) {
        if (r?.source_path) map.set(normalize(r.source_path), r);
      }
    }
  } catch {
    // Backend erişilemezse mevcut (veya boş) önbellek korunur; site çalışmaya devam eder.
  }
  cache = { at: now, rules: map };
  return map;
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl;
  const rule = (await getRules()).get(normalize(pathname));
  if (!rule) return NextResponse.next();

  if (rule.type === "410") {
    return new NextResponse("410 Gone", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  if (rule.destination && rule.destination !== pathname) {
    const target = rule.destination.startsWith("http")
      ? rule.destination
      : new URL(`${rule.destination}${search}`, req.url);
    return NextResponse.redirect(target, 301);
  }

  return NextResponse.next();
}

export const config = {
  // _next, api ve uzantılı statik dosyalar hariç tüm yollar.
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};
