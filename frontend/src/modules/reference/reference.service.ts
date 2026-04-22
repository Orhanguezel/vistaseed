import { API } from "@/config/api-endpoints";
import { getApiUrl } from "@/lib/site-settings";
import type { ReferenceItem } from "./reference.types";

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function fetchReferenceList(params: {
  locale?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
  sort?: "created_at" | "updated_at" | "display_order";
  orderDir?: "asc" | "desc";
} = {}): Promise<ReferenceItem[]> {
  try {
    const query = buildQuery({
      locale: params.locale,
      limit: params.limit,
      offset: params.offset,
      is_featured: params.featured,
      sort: params.sort,
      orderDir: params.orderDir,
    });
    const res = await fetch(`${getApiUrl()}${API.references.list}${query}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as ReferenceItem[]) : [];
  } catch {
    return [];
  }
}

export async function fetchReferenceBySlug(slug: string, locale = "tr"): Promise<ReferenceItem | null> {
  try {
    const query = buildQuery({ locale });
    const res = await fetch(`${getApiUrl()}${API.references.bySlug(slug)}${query}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as ReferenceItem & { gallery?: string[] };
    const images = raw.images?.length ? raw.images : raw.gallery ?? [];
    return { ...raw, images };
  } catch {
    return null;
  }
}

