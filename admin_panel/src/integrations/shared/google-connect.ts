// ===================================================================
// FILE: src/integrations/shared/google-connect.ts
// Panelden Google bağlan/yenile (rotasyon) tipleri
// ===================================================================

export const GOOGLE_CONNECT_ADMIN_BASE = '/admin/google-connect';

export type GoogleConnectStatusResp = {
  connected: boolean;
  scopes: string[];
  services: Record<string, boolean>;
};
export type GoogleAuthUrlResp = { url: string; redirect_uri: string };
export type GoogleExchangeResp = { ok: boolean; scopes: string[] };
export type GoogleExchangeArgs = { code: string; redirect_uri?: string };

export const GOOGLE_SERVICE_LABELS: Record<string, string> = {
  ads: 'Google Ads',
  ga4: 'GA4 Analytics',
  gtm: 'Tag Manager',
  gsc: 'Search Console',
};
