"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { localePath } from "@/lib/locale-path";
import { ROUTES } from "@/config/routes";

/** Eski rota: sipariş oluşturma artık `panel/siparisler#dealer-order` içinde. */
export default function BayiSiparisRedirectPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    router.replace(`${localePath(locale, ROUTES.orders.list)}#dealer-order`);
  }, [router, locale]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" aria-hidden />
    </div>
  );
}
