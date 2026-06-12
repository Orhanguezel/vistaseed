// src/modules/twitter-content/hashtags.ts
// Kural-tabanlı hashtag — AI ÜRETMEZ. Sıra: [bağlam ≤2] + imza + marka, maks 4.

export const TWITTER_BRAND_TAG = '#VistaSeeds';
export const TWITTER_SIGNATURE_TAG = '#TohumdaYerliGüç';
export const TWITTER_LOCAL_SEED_TAG = '#yerlitohum';
export const TWITTER_SEED_TAG = '#tohum';
export const TWITTER_VEGETABLE_SEED_TAG = '#sebzetohumu';
export const TWITTER_AGRICULTURE_TAG = '#tarim';
export const TWITTER_EXPORT_TAGS = '#Türktohumu #ihracat #VistaSeeds';

const MAX_TAGS = 4;
const MAX_CONTEXT_TAGS = 2;

function trLower(value: string) {
  return value.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
}

export function toTag(name: string): string | null {
  const cleaned = trLower(name)
    .replace(/['"()./,\-]/g, ' ')
    .replace(/\s+/g, '')
    .trim();
  if (cleaned.length < 2) return null;
  return `#${cleaned}`;
}

// Mahsul sözlüğü: ürün başlığındaki mahsulü tanır → Türkçe hashtag.
const CROP_TAGS: Array<{ match: RegExp; tag: string }> = [
  { match: /biber/i, tag: '#biber' },
  { match: /domates/i, tag: '#domates' },
  { match: /salatal[ıi]k|h[ıi]yar/i, tag: '#salatalık' },
  { match: /patl[ıi]can/i, tag: '#patlıcan' },
  { match: /kavun/i, tag: '#kavun' },
  { match: /karpuz/i, tag: '#karpuz' },
  { match: /kabak/i, tag: '#kabak' },
  { match: /marul/i, tag: '#marul' },
  { match: /m[ıi]s[ıi]r/i, tag: '#mısır' },
  { match: /fasulye/i, tag: '#fasulye' },
];

export function cropTagFromTitle(title?: string | null): string | null {
  const t = String(title ?? '');
  for (const { match, tag } of CROP_TAGS) if (match.test(t)) return tag;
  return null;
}

function normalizeContextTag(raw?: string | null): string | null {
  const t = String(raw ?? '').trim();
  if (!t) return null;
  if (t.startsWith('#')) return t.replace(/\s+/g, '');
  return toTag(t);
}

/**
 * Tweet için hashtag dizisi.
 *  - productTitle → mahsul etiketi (çeşit tanıtımı / agronomi)
 *  - eventTag     → sektör/fuar etiketi
 *  - dayTag       → milli gün etiketi
 */
/**
 * Instagram hashtag bloğu — X'ten farklı: ~10 etiket, keşfet odaklı.
 * Sıra: mahsul + sabit havuz; dedup, maks 12.
 */
export function deriveInstagramHashtags(productTitle?: string | null): string {
  const pool = [
    cropTagFromTitle(productTitle),
    '#VistaSeeds',
    '#yerlitohum',
    '#tohum',
    '#sebzetohumu',
    '#tarım',
    '#çiftçi',
    '#sera',
    '#fide',
    '#üretici',
    '#tohumculuk',
  ].filter(Boolean) as string[];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of pool) {
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return out.slice(0, 12).join(' ');
}

export function deriveTwitterHashtags(input: {
  productTitle?: string | null;
  eventTag?: string | null;
  dayTag?: string | null;
}): string {
  const ctx: string[] = [];
  const crop = cropTagFromTitle(input.productTitle);
  if (crop) ctx.push(crop);
  const ev = normalizeContextTag(input.eventTag);
  if (ev) ctx.push(ev);
  const day = normalizeContextTag(input.dayTag);
  if (day) ctx.push(day);

  const all = [...ctx.slice(0, MAX_CONTEXT_TAGS), TWITTER_SIGNATURE_TAG, TWITTER_BRAND_TAG];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of all) {
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return out.slice(0, MAX_TAGS).join(' ');
}
