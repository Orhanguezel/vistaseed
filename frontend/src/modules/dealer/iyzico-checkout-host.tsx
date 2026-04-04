"use client";

import * as React from "react";

/** Iyzico `checkoutFormContent` HTML + script (React innerHTML script calistirmaz; yeniden enjekte edilir). */
export function IyzicoCheckoutHost({ html }: { html: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !html) return;
    el.innerHTML = html;
    el.querySelectorAll("script").forEach((old) => {
      const s = document.createElement("script");
      Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.parentNode?.replaceChild(s, old);
    });
  }, [html]);

  return <div ref={ref} className="w-full min-h-[480px] rounded-2xl border border-border/15 bg-surface p-4" />;
}
