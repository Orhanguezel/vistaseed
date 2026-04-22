import { getApiUrl } from "@/lib/site-settings";
import { resolveImageUrl } from "@/lib/utils";

export interface EcosystemReferenceItem {
  id: string;
  title: string | null;
  slug: string | null;
  summary: string | null;
  featured_image: string | null;
  website_url: string | null;
  is_featured?: number | boolean | null;
}

export const referenceRouteMap: Record<string, string> = {
  "bereket-fide-uretim-kampusu": "/hakkimizda",
  "antalya-aksu-operasyon-merkezi": "/iletisim",
  "asili-fide-kapasite-programi": "/urunler",
  "bayi-agi-ve-bolgesel-dagitim-modeli": "/bayi-agi",
  "toplu-satis-ve-kurumsal-tedarik-akisi": "/toplu-satis",
  "teknik-icerik-ve-bilgi-bankasi-yayinlari": "/bilgi-bankasi",
};

export function resolveEcosystemReferencePath(slug: string | null | undefined): string {
  if (!slug) return "/hakkimizda";
  return referenceRouteMap[slug] ?? `/referanslar/${slug}`;
}

export async function fetchReferenceHighlights(locale: string, limit = 3): Promise<EcosystemReferenceItem[]> {
  try {
    const params = new URLSearchParams({
      locale,
      limit: String(limit),
      sort: "display_order",
      orderDir: "asc",
      is_featured: "true",
    });
    const res = await fetch(`${getApiUrl()}/api/v1/references?${params.toString()}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as EcosystemReferenceItem[]) : [];
  } catch {
    return [];
  }
}

export function resolveEcosystemImage(url: string | null | undefined): string | null {
  if (!url) return null;
  return resolveImageUrl(url);
}
