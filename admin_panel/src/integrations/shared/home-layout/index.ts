// =============================================================
// FILE: src/integrations/shared/home-layout/index.ts
// Home layout (anasayfa düzeni) shared types + component options
// =============================================================

export interface HomeSectionDto {
  id: string;
  slug: string;
  label: string;
  component_key: string;
  order_index: number;
  is_active: number;
  config: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface HomeSectionCreatePayload {
  slug: string;
  label: string;
  component_key: string;
  order_index?: number;
  is_active?: number;
  config?: Record<string, unknown> | null;
}

export interface HomeSectionUpdatePayload {
  slug?: string;
  label?: string;
  component_key?: string;
  order_index?: number;
  is_active?: number;
  config?: Record<string, unknown> | null;
}

export interface HomeSectionReorderPayload {
  items: Array<{ id: string; order_index: number }>;
}

// vistaseeds anasayfasında render edilen section component'leri.
// Frontend tarafında (frontend/src/app/[locale]/(public)/page.tsx) bu key'lere
// karşılık gelen component map bulunur.
export const HOME_LAYOUT_COMPONENT_OPTIONS = [
  { key: 'HeroSlider', label: 'Hero Slider (üst vitrin)' },
  { key: 'TrustBar', label: 'Güven Sinyalleri' },
  { key: 'Stats', label: 'İstatistikler' },
  { key: 'SeasonalPicks', label: 'Mevsim Önerileri' },
  { key: 'Values', label: 'Neden Biz / Değerler' },
  { key: 'HomepageFeaturePanels', label: 'Özellik Panelleri' },
  { key: 'PlantingGuide', label: 'Ekim Rehberi' },
  { key: 'EcosystemSpotlight', label: 'Ekosistem İçeriği' },
  { key: 'ProductDiscoveryLinks', label: 'Ürün Keşif Linkleri' },
  { key: 'ProductsPreview', label: 'Öne Çıkan Ürünler' },
  { key: 'Timeline', label: 'Tarihçe' },
  { key: 'FaqPreview', label: 'SSS Önizleme' },
  { key: 'Newsletter', label: 'Bülten' },
  { key: 'CtaSection', label: 'İletişim CTA' },
] as const;

export type HomeLayoutComponentKey = typeof HOME_LAYOUT_COMPONENT_OPTIONS[number]['key'];
