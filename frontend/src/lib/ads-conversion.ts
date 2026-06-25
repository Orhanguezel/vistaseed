// src/lib/ads-conversion.ts
// Google Ads dönüşüm ateşleme — send_to etiketleri layout'ta
// window.__adsConversions'a site_settings'ten yazılır (hard-code yok).

type GtagFn = (...args: unknown[]) => void;

type AdsWindow = Window & {
  gtag?: GtagFn;
  dataLayer?: unknown[];
  __adsConversions?: Record<string, string>;
};

export type AdsConversionKey = 'quote' | 'whatsapp';

// Her dönüşüm kaynağı için GA4 event adı + kaynak etiketi + ham dataLayer olayı.
// Etiketler hard-code degil; Ads send_to anahtari __adsConversions[key]'ten gelir.
const CONVERSION_META: Record<AdsConversionKey, { ga4Event: string; source: string; rawEvent: string }> = {
  quote: { ga4Event: 'generate_lead', source: 'quote_form', rawEvent: 'quote_request_submitted' },
  whatsapp: { ga4Event: 'whatsapp_click', source: 'order_cta', rawEvent: 'whatsapp_click' },
};

/**
 * Dönüşüm event'i gönderir. Etiket tanımlı değilse sessizce çıkar —
 * kullanıcı akışını asla bozmaz.
 *
 * Üç hedef:
 *  1) Google Ads conversion (send_to etiketi __adsConversions[key]'te varsa)
 *  2) GA4 key event (quote → generate_lead, whatsapp → whatsapp_click) — doğrudan
 *     gtag config'li G-... mülküne. send_to YOK = tüm GA mülkleri.
 *  3) dataLayer ham olay (ileride GTM tetikleyicisi kurulabilir)
 */
export function fireAdsConversion(key: AdsConversionKey): void {
  try {
    const w = window as AdsWindow;
    const sendTo = w.__adsConversions?.[key];
    const meta = CONVERSION_META[key];
    const ga4Params = { event_source: meta.source, currency: 'TRY' };

    if (typeof w.gtag === 'function') {
      if (sendTo) w.gtag('event', 'conversion', { send_to: sendTo });
      // GA4 key event — send_to belirtilmez ki gtag'in config'lediği GA4 mülküne gitsin.
      w.gtag('event', meta.ga4Event, ga4Params);
    } else if (Array.isArray(w.dataLayer)) {
      if (sendTo) w.dataLayer.push(['event', 'conversion', { send_to: sendTo }]);
      w.dataLayer.push(['event', meta.ga4Event, ga4Params]);
    }

    // GTM/GA4 tarafı için ham olay (ileride GTM tetikleyicisi kurulabilir)
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: meta.rawEvent });
    }
  } catch {
    // analytics hatası kullanıcı akışını etkilemez
  }
}
