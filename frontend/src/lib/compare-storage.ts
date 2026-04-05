const STORAGE_KEY = "vistaseed_compare_product_slugs";
export const COMPARE_MAX = 5;

function readSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
  } catch {
    return [];
  }
}

function writeSlugs(slugs: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

export function getCompareSlugs(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const slug of readSlugs()) {
    const k = slug.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(slug);
    if (out.length >= COMPARE_MAX) break;
  }
  return out;
}

export function addCompareSlug(slug: string): { ok: true } | { ok: false; reason: "max" | "duplicate" } {
  const slugs = getCompareSlugs();
  const key = slug.toLowerCase();
  if (slugs.some((s) => s.toLowerCase() === key)) return { ok: false, reason: "duplicate" };
  if (slugs.length >= COMPARE_MAX) return { ok: false, reason: "max" };
  writeSlugs([...slugs, slug]);
  return { ok: true };
}

export function removeCompareSlug(slug: string): void {
  const key = slug.toLowerCase();
  writeSlugs(getCompareSlugs().filter((s) => s.toLowerCase() !== key));
}

export function setCompareSlugs(slugs: string[]): void {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const slug of slugs) {
    const k = slug.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(slug);
    if (out.length >= COMPARE_MAX) break;
  }
  writeSlugs(out);
}

export function clearCompareSlugs(): void {
  writeSlugs([]);
}
