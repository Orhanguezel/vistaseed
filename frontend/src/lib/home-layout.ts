// =============================================================
// FILE: src/lib/home-layout.ts
// Anasayfa section sırası ve aktif/pasif durumu — admin panelden
// yönetilen "home_sections" tablosundan okunur.
// API erişilemezse veya boşsa default sıra (DEFAULT_HOME_LAYOUT) kullanılır.
// =============================================================

export interface HomeLayoutSection {
  slug: string;
  component_key: string;
  order_index: number;
  is_active: number;
  config: Record<string, unknown> | null;
}

// Frontend tarafında varsayılan section sırası — DB seed ile aynı.
// API ulaşılamadığında veya tablo boş döndüğünde bu sıra render edilir.
export const DEFAULT_HOME_LAYOUT: HomeLayoutSection[] = [
  { slug: 'hero', component_key: 'HeroSlider', order_index: 10, is_active: 1, config: null },
  { slug: 'trust_bar', component_key: 'TrustBar', order_index: 20, is_active: 1, config: null },
  { slug: 'stats', component_key: 'Stats', order_index: 30, is_active: 1, config: null },
  { slug: 'seasonal_picks', component_key: 'SeasonalPicks', order_index: 40, is_active: 1, config: null },
  { slug: 'values', component_key: 'Values', order_index: 50, is_active: 1, config: null },
  { slug: 'feature_panels', component_key: 'HomepageFeaturePanels', order_index: 60, is_active: 1, config: null },
  { slug: 'planting_guide', component_key: 'PlantingGuide', order_index: 70, is_active: 1, config: null },
  { slug: 'ecosystem_spotlight', component_key: 'EcosystemSpotlight', order_index: 80, is_active: 1, config: null },
  { slug: 'product_discovery', component_key: 'ProductDiscoveryLinks', order_index: 90, is_active: 1, config: null },
  { slug: 'products_preview', component_key: 'ProductsPreview', order_index: 100, is_active: 1, config: null },
  { slug: 'timeline', component_key: 'Timeline', order_index: 110, is_active: 1, config: null },
  { slug: 'faq_preview', component_key: 'FaqPreview', order_index: 120, is_active: 1, config: null },
  { slug: 'newsletter', component_key: 'Newsletter', order_index: 130, is_active: 1, config: null },
  { slug: 'cta', component_key: 'CtaSection', order_index: 140, is_active: 1, config: null },
];

function getApiBase(): string {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8083'
  ).replace(/\/$/, '');
}

export async function fetchHomeLayout(): Promise<HomeLayoutSection[]> {
  try {
    const res = await fetch(`${getApiBase()}/api/v1/home/layout`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return DEFAULT_HOME_LAYOUT;
    const data = await res.json();
    const rows: unknown = Array.isArray(data) ? data : (data?.data ?? []);
    if (!Array.isArray(rows) || rows.length === 0) return DEFAULT_HOME_LAYOUT;
    return (rows as HomeLayoutSection[])
      .filter((r) => Number(r.is_active) === 1)
      .sort((a, b) => Number(a.order_index) - Number(b.order_index));
  } catch {
    return DEFAULT_HOME_LAYOUT;
  }
}
