// =============================================================
// FILE: src/lib/meta.ts
// Meta Pixel — Lead olayı (CAPI ile dedup için event_id üretir) + fb çerezleri
// =============================================================

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

function uuid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  }
}

/** Dedup için yeni event_id üretir (form gönderiminde body'ye konur). */
export function newMetaEventId(): string {
  return uuid();
}

/** Tarayıcı pixel'inde verilen event_id ile Lead ateşler (CAPI ile dedup). */
export function fireMetaLead(eventId: string): void {
  try {
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    fbq?.("track", "Lead", {}, { eventID: eventId });
  } catch {
    /* pixel yoksa sessiz */
  }
}

/** CAPI eşleştirmesi için Meta çerezleri. */
export function getFbCookies(): { fbp: string; fbc: string } {
  return { fbp: readCookie("_fbp"), fbc: readCookie("_fbc") };
}
