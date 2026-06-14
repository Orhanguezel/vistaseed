"use client";

// Her sayfa goruntulemesinde backend'e hafif bir beacon atar (fire-and-forget).
// Backend gercek IP/UA/referer/gclid ile audit_request_logs'a pageview yazar.
// vs_self cookie'si olan tarayicilar backend tarafinda is_internal=1 ile elenir.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function beaconUrl(): string {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  if (!base) return "";
  const v1 = base.includes("/api/") ? base : `${base}/api/v1`;
  return `${v1}/audit/pageview`;
}

export default function PageviewBeacon() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastSent.current === pathname) return;
    const url = beaconUrl();
    if (!url) return;
    lastSent.current = pathname;

    try {
      const payload = JSON.stringify({
        path: pathname,
        url: window.location.href,
        referer: document.referrer || "",
      });
      const blob = new Blob([payload], { type: "application/json" });
      if (typeof navigator !== "undefined" && navigator.sendBeacon?.(url, blob)) return;
      void fetch(url, {
        method: "POST",
        body: payload,
        headers: { "content-type": "application/json" },
        keepalive: true,
        credentials: "include",
      }).catch(() => {});
    } catch {
      // sessiz yut — beacon asla sayfayi etkilemez
    }
  }, [pathname]);

  return null;
}
