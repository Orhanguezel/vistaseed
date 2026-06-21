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
 *
 * Üç hedef:
 *  1) Google Ads conversion (send_to etiketi varsa)
 *  2) GA4 `generate_lead` event (doğrudan gtag config'li G-... mülküne) — lead'in
 *     GA4'te conversion/key event olarak görünmesi için. send_to YOK = tüm GA mülkleri.
 *  3) dataLayer ham olay (ileride GTM tetikleyicisi kurulabilir)
 */
export function fireAdsConversion(key: 'quote'): void {
  try {
    const w = window as AdsWindow;
    const sendTo = w.__adsConversions?.[key];

    if (typeof w.gtag === 'function') {
      if (sendTo) w.gtag('event', 'conversion', { send_to: sendTo });
      // GA4 lead event — send_to belirtilmez ki gtag'in config'lediği GA4 mülküne gitsin.
      w.gtag('event', 'generate_lead', { event_source: 'quote_form', currency: 'TRY' });
    } else if (Array.isArray(w.dataLayer)) {
      if (sendTo) w.dataLayer.push(['event', 'conversion', { send_to: sendTo }]);
      w.dataLayer.push(['event', 'generate_lead', { event_source: 'quote_form', currency: 'TRY' }]);
    }

    // GTM/GA4 tarafı için ham olay (ileride GTM tetikleyicisi kurulabilir)
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: 'quote_request_submitted' });
    }
  } catch {
    // analytics hatası kullanıcı akışını etkilemez
  }
}
