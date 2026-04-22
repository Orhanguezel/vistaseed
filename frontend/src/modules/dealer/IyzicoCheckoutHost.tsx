'use client';

import * as React from 'react';

export function IyzicoCheckoutHost({ html }: { html: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !html) return;
    el.innerHTML = html;

    const form = el.querySelector('form') as HTMLFormElement | null;
    if (form) {
      const data: Record<string, string> = {};
      Array.from(form.elements).forEach((f) => {
        const inp = f as HTMLInputElement;
        if (inp.name) data[inp.name] = inp.value;
      });
      console.warn('[PaymentDebug] Form fields:', JSON.stringify(data, null, 2));
      console.warn('[PaymentDebug] action:', form.action);
    }

    el.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.parentNode?.replaceChild(s, old);
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="w-full min-h-[480px] rounded-[2.5rem] border border-border/10 p-4 surface-elevated"
    />
  );
}
