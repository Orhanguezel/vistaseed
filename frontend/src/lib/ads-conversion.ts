// src/lib/ads-conversion.ts
// Google Ads dönüşüm ateşleme — send_to etiketleri layout'ta
// window.__adsConversions'a site_settings'ten yazılır (hard-code yok).

type GtagFn = (...args: unknown[]) => void;

type AdsWindow = Window & {
  gtag?: GtagFn;
  dataLayer?: unknown[];
  __adsConversions?: Record<string, string>;
};

/**
 * Dönüşüm event'i gönderir. Etiket tanımlı değilse sessizce çıkar —
 * form akışını asla bozmaz.
 */
export function fireAdsConversion(key: 'quote'): void {
  try {
    const w = window as AdsWindow;
    const sendTo = w.__adsConversions?.[key];
    if (!sendTo) return;

    if (typeof w.gtag === 'function') {
      w.gtag('event', 'conversion', { send_to: sendTo });
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push(['event', 'conversion', { send_to: sendTo }]);
    }

    // GTM/GA4 tarafı için ham olay (ileride GTM tetikleyicisi kurulabilir)
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: 'quote_request_submitted' });
    }
  } catch {
    // analytics hatası kullanıcı akışını etkilemez
  }
}
