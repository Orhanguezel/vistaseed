import { API } from "@/config/api-endpoints";
import { getApiUrl } from "@/lib/site-settings";
import type { LibraryItem, LibraryFile, LibraryImage } from "./library.type";

export async function fetchLibraryList(params: {
  type?: string;
  locale?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
}) {
  const queryParts: string[] = [];
  if (params.type) queryParts.push(`type=${params.type}`);
  if (params.locale) queryParts.push(`locale=${params.locale}`);
  if (params.limit) queryParts.push(`limit=${params.limit}`);
  if (params.offset) queryParts.push(`offset=${params.offset}`);
  if (params.featured !== undefined) queryParts.push(`featured=${params.featured}`);

  const query = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  try {
    const res = await fetch(`${getApiUrl()}${API.library.list}${query}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return (await res.json()) as LibraryItem[];
  } catch {
    return [];
  }
}

export async function fetchLibraryBySlug(slug: string, locale = "tr"): Promise<LibraryItem | null> {
  try {
    const res = await fetch(`${getApiUrl()}${API.library.bySlug(slug)}?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchLibraryFiles(id: string): Promise<LibraryFile[]> {
  try {
    const res = await fetch(`${getApiUrl()}${API.library.files(id)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return (await res.json()) as LibraryFile[];
  } catch {
    return [];
  }
}

export async function fetchLibraryImages(id: string, locale = "tr"): Promise<LibraryImage[]> {
  try {
    const res = await fetch(`${getApiUrl()}${API.library.images(id)}?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return (await res.json()) as LibraryImage[];
  } catch {
    return [];
  }
}
