// =============================================================
// FILE: src/server/fetch-branding.ts
// Server-only utility — SSR'da branding config'i backend'den çeker
// =============================================================

import { DEFAULT_BRANDING, type AdminBrandingConfig } from '@/config/app-config';

function getServerApiUrl(): string {
  const panel = (process.env.PANEL_API_URL || '').trim().replace(/\/+$/, '');
  if (panel) return `${panel}/api`;

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim().replace(/\/+$/, '');
  if (base) return base;

  const pub = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/+$/, '');
  if (pub) return pub;

  return 'https://vistaseeds.com.tr/api';
}

function extractMediaUrl(raw: unknown): string {
  if (!raw) return '';
  const val = typeof raw === 'string' ? (() => { try { return JSON.parse(raw); } catch { return raw; } })() : raw;
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return (val as { url?: string }).url ?? '';
  return '';
}

async function fetchSettingUrl(base: string, key: string): Promise<string> {
  try {
    const res = await fetch(`${base}/site_settings/${key}?locale=tr`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return '';
    const data = await res.json();
    return extractMediaUrl(data?.value);
  } catch {
    return '';
  }
}

export async function fetchBrandingConfig(): Promise<AdminBrandingConfig> {
  const base = getServerApiUrl();

  const [brandingRes, logoUrl, faviconUrl, appleTouchUrl] = await Promise.allSettled([
    fetch(`${base}/site_settings/ui_admin_config`, { next: { revalidate: 300 } }),
    fetchSettingUrl(base, 'site_logo'),
    fetchSettingUrl(base, 'site_favicon'),
    fetchSettingUrl(base, 'site_apple_touch_icon'),
  ]);

  const logo = logoUrl.status === 'fulfilled' ? logoUrl.value : '';
  const favicon = faviconUrl.status === 'fulfilled' ? faviconUrl.value : '';
  const appleTouch = appleTouchUrl.status === 'fulfilled' ? appleTouchUrl.value : '';

  let metaBranding: Partial<AdminBrandingConfig> = {};
  if (brandingRes.status === 'fulfilled' && brandingRes.value.ok) {
    try {
      const data = await brandingRes.value.json();
      const value = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      const b = value?.branding;
      if (b?.meta?.title) {
        metaBranding = {
          ...b,
          meta: { ...DEFAULT_BRANDING.meta, ...b.meta },
        };
      }
    } catch {
      /* fallback */
    }
  }

  return {
    ...DEFAULT_BRANDING,
    ...metaBranding,
    logo_url: logo || DEFAULT_BRANDING.logo_url,
    favicon_url: favicon || DEFAULT_BRANDING.favicon_url,
    apple_touch_url: appleTouch || DEFAULT_BRANDING.apple_touch_url,
  };
}
