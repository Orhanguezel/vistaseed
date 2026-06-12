// ===================================================================
// FILE: src/integrations/shared/google-ads.ts
// Google Ads Admin API types + settings keys
// ===================================================================

export const GOOGLE_ADS_ADMIN_BASE = '/admin/google-ads';

export const GOOGLE_ADS_SETTINGS_KEYS = [
  'google_ads_enabled',
  'google_ads_developer_token',
  'google_ads_client_id',
  'google_ads_client_secret',
  'google_ads_refresh_token',
  'google_ads_customer_id',
  'google_ads_login_customer_id',
] as const;

export type GoogleAdsSettingsKey = (typeof GOOGLE_ADS_SETTINGS_KEYS)[number];
export type GoogleAdsSettingsModel = Record<GoogleAdsSettingsKey, string>;

export const GOOGLE_ADS_BOOLEAN_SETTINGS_KEYS = new Set<GoogleAdsSettingsKey>([
  'google_ads_enabled',
]);

export function createGoogleAdsSettingsDefaults(): GoogleAdsSettingsModel {
  return {
    google_ads_enabled: 'false',
    google_ads_developer_token: '',
    google_ads_client_id: '',
    google_ads_client_secret: '',
    google_ads_refresh_token: '',
    google_ads_customer_id: '',
    google_ads_login_customer_id: '',
  };
}

export type GoogleAdsCredentialFieldDef = {
  settingsKey: GoogleAdsSettingsKey;
  i18nKey: string;
};

export const GOOGLE_ADS_CREDENTIAL_FIELDS: GoogleAdsCredentialFieldDef[] = [
  { settingsKey: 'google_ads_developer_token', i18nKey: 'developerToken' },
  { settingsKey: 'google_ads_client_id', i18nKey: 'clientId' },
  { settingsKey: 'google_ads_client_secret', i18nKey: 'clientSecret' },
  { settingsKey: 'google_ads_refresh_token', i18nKey: 'refreshToken' },
  { settingsKey: 'google_ads_customer_id', i18nKey: 'customerId' },
  { settingsKey: 'google_ads_login_customer_id', i18nKey: 'loginCustomerId' },
] as const;

export const GOOGLE_ADS_DATE_RANGES = [
  'TODAY',
  'YESTERDAY',
  'LAST_7_DAYS',
  'LAST_30_DAYS',
  'THIS_MONTH',
  'LAST_MONTH',
] as const;
export type GoogleAdsDateRange = (typeof GOOGLE_ADS_DATE_RANGES)[number];

export type GoogleAdsStatusResp = {
  enabled: boolean;
  has_credentials: boolean;
  customer_id: string;
};

export type GoogleAdsVerifyResp = {
  ok: boolean;
  customers?: string[];
};

export type GoogleAdsCampaignRow = {
  id: string;
  name: string;
  status: string;
  channel_type: string;
  budget_id: string;
  budget_micros: number;
  impressions: number;
  clicks: number;
  ctr: number;
  average_cpc_micros: number;
  cost_micros: number;
  conversions: number;
};

export type GoogleAdsCampaignsResp = {
  items: GoogleAdsCampaignRow[];
  range: GoogleAdsDateRange;
};

/** micros → TL (para birimi hesabın kendi birimi) */
export function microsToUnit(micros: number): string {
  return (micros / 1_000_000).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
}

export function formatCtr(ctr: number): string {
  return `%${(ctr * 100).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}`;
}

/** POST /admin/google-ads/campaigns/:id/status */
export type GoogleAdsSetStatusBody = {
  id: string;
  status: "ENABLED" | "PAUSED";
};

export type GoogleAdsSetStatusResp = {
  ok: boolean;
  campaign_id: string;
  status: string;
};

/** POST /admin/google-ads/campaigns/budget */
export type GoogleAdsSetBudgetBody = {
  budget_id: string;
  amount: number;
};

export type GoogleAdsSetBudgetResp = {
  ok: boolean;
  budget_id: string;
  amount_micros: number;
};

/** Durum/kanal etiketleri (TR) — bilinmeyen değer ham haliyle gösterilir */
export const ADS_STATUS_LABELS: Record<string, string> = {
  ENABLED: "Etkin",
  PAUSED: "Duraklatıldı",
  REMOVED: "Kaldırıldı",
  HIDDEN: "Gizli",
  UNKNOWN: "Bilinmiyor",
};

export const ADS_CHANNEL_LABELS: Record<string, string> = {
  SEARCH: "Arama",
  PERFORMANCE_MAX: "Maks. Performans",
  DISPLAY: "Görüntülü",
  VIDEO: "Video",
  SHOPPING: "Alışveriş",
  DEMAND_GEN: "Talep Yaratma",
  MULTI_CHANNEL: "Çoklu Kanal",
};

export const ADS_DEVICE_LABELS: Record<string, string> = {
  MOBILE: "Mobil",
  DESKTOP: "Masaüstü",
  TABLET: "Tablet",
  CONNECTED_TV: "TV",
  OTHER: "Diğer",
};

export const ADS_MATCH_TYPE_LABELS: Record<string, string> = {
  BROAD: "Geniş",
  PHRASE: "Sıralı",
  EXACT: "Tam",
};

export function adsLabel(map: Record<string, string>, value: string): string {
  return map[value] ?? value;
}

/** GET /admin/google-ads/insights */
export type GoogleAdsConversionAction = {
  name: string;
  status: string;
  type: string;
};

export type GoogleAdsTermRow = {
  term: string;
  match_type?: string;
  resource_name?: string;
  status?: string;
  campaign: string;
  clicks: number;
  impressions: number;
  ctr: number;
  cost_micros: number;
  conversions: number;
};

export type GoogleAdsDeviceRow = {
  campaign: string;
  device: string;
  clicks: number;
  cost_micros: number;
  conversions: number;
};

export type GoogleAdsRecommendationRow = {
  type: string;
  dismissed: boolean;
  campaign: string;
};

export const ADS_RECOMMENDATION_LABELS: Record<string, string> = {
  IMPROVE_PERFORMANCE_MAX_AD_STRENGTH: "Maks. Performans reklam gücünü iyileştir (başlık/açıklama/görsel ekle)",
  CAMPAIGN_BUDGET: "Kampanya bütçesini artır",
  KEYWORD: "Yeni anahtar kelime ekle",
  TARGET_CPA_OPT_IN: "Hedef EBM teklif stratejisine geç",
  MAXIMIZE_CONVERSIONS_OPT_IN: "Dönüşümleri en üst düzeye çıkar stratejisine geç",
  ENHANCED_CPC_OPT_IN: "Geliştirilmiş TBM'ye geç",
  RESPONSIVE_SEARCH_AD: "Yeni duyarlı arama reklamı ekle",
  SITELINK_ASSET: "Site bağlantısı öğesi ekle",
  CALLOUT_ASSET: "Açıklama metni öğesi ekle",
};

export type GoogleAdsInsightsResp = {
  recommendations: GoogleAdsRecommendationRow[];
  conversion_actions: GoogleAdsConversionAction[];
  search_terms: GoogleAdsTermRow[];
  keywords: GoogleAdsTermRow[];
  devices: GoogleAdsDeviceRow[];
  range: GoogleAdsDateRange;
};

/** POST /admin/google-ads/keywords/status */
export type GoogleAdsKeywordStatusBody = {
  resource_name: string;
  status: "ENABLED" | "PAUSED";
};

export type GoogleAdsKeywordStatusResp = {
  ok: boolean;
  resource_name: string;
  status: string;
};
