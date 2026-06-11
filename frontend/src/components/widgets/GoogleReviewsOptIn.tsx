"use client";

import * as React from "react";
import Script from "next/script";

type GapiSurveyOptIn = {
  load: (lib: string, cb: () => void) => void;
  surveyoptin?: { render: (opts: Record<string, unknown>) => void };
};

declare global {
  interface Window {
    gapi?: GapiSurveyOptIn;
  }
}

const MERCHANT_ID = process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID;
const DELIVERY_COUNTRY = process.env.NEXT_PUBLIC_GCR_DELIVERY_COUNTRY || "TR";
const DELIVERY_DAYS = Number(process.env.NEXT_PUBLIC_GCR_DELIVERY_DAYS) || 7;
const PLATFORM_SRC = "https://apis.google.com/js/platform.js";

function estimatedDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + DELIVERY_DAYS);
  return d.toISOString().slice(0, 10);
}

function alreadyShown(orderId: string) {
  try {
    return window.sessionStorage.getItem(`gcr-optin-${orderId}`) === "1";
  } catch {
    return false;
  }
}

function markShown(orderId: string) {
  try {
    window.sessionStorage.setItem(`gcr-optin-${orderId}`, "1");
  } catch {
    /* storage erisilemiyorsa anket yine de gosterilir */
  }
}

/**
 * Google Musteri Yorumlari (GCR) anket opt-in'i.
 * Siparis onayi sonrasi bir kez render edilir; ayni siparis icin
 * sayfa yenilemelerinde tekrar tetiklenmez (sessionStorage guard).
 */
export function GoogleReviewsOptIn({ orderId, email }: { orderId: string; email: string }) {
  const firedRef = React.useRef(false);

  const fire = React.useCallback(() => {
    if (firedRef.current || alreadyShown(orderId)) return;
    firedRef.current = true;
    window.gapi?.load("surveyoptin", () => {
      window.gapi?.surveyoptin?.render({
        merchant_id: Number(MERCHANT_ID),
        order_id: orderId,
        email,
        delivery_country: DELIVERY_COUNTRY,
        estimated_delivery_date: estimatedDeliveryDate(),
      });
      markShown(orderId);
    });
  }, [orderId, email]);

  React.useEffect(() => {
    if (window.gapi) fire();
  }, [fire]);

  if (!MERCHANT_ID || !orderId || !email) return null;

  return <Script src={PLATFORM_SRC} strategy="afterInteractive" onLoad={fire} />;
}
