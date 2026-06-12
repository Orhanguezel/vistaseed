// =============================================================
// FILE: src/lib/gclid.ts
// Google Ads tıklama kimliğini (gclid/gbraid/wbraid) URL'den yakalar ve
// çerezde saklar; teklif formu gönderiminde offline dönüşüm için kullanılır.
// =============================================================

export type GclidSource = "gclid" | "gbraid" | "wbraid";

const COOKIE = "_vs_gclid";
const MAX_AGE = 90 * 24 * 60 * 60; // 90 gün (Google dönüşüm penceresi)

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;
}

/** Sayfa yüklenince URL'deki gclid/gbraid/wbraid'i yakalayıp çereze yazar. */
export function captureGclidFromUrl(): void {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  for (const src of ["gclid", "gbraid", "wbraid"] as GclidSource[]) {
    const v = p.get(src);
    if (v && v.trim()) {
      writeCookie(COOKIE, JSON.stringify({ id: v.trim(), source: src, at: Date.now() }));
      return;
    }
  }
}

/** Saklı tıklama kimliğini döner (yoksa null). */
export function getStoredGclid(): { id: string; source: GclidSource } | null {
  const raw = readCookie(COOKIE);
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as { id?: string; source?: GclidSource };
    if (v?.id) return { id: v.id, source: v.source ?? "gclid" };
  } catch {
    /* bozuk çerez — yok say */
  }
  return null;
}
