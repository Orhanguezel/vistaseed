// src/app/(dashboard)/panel/siparisler/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useOrderStore } from "@/modules/order/order.store";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ROUTES } from "@/config/routes";
import Link from "next/link";
import { useLocale } from "next-intl";
import { localePath } from "@/lib/locale-path";
import { DealerCatalogPanel } from "./dealer-catalog-panel";
import { DealerOrderForm } from "@/modules/dealer/dealer-order-form";
import { useDealerSharedCatalog } from "@/modules/dealer/use-dealer-shared-catalog";

function DealerOrdersBlock({ locale }: { locale: string }) {
  const shared = useDealerSharedCatalog(locale);
  return (
    <>
      <DealerCatalogPanel locale={locale} shared={shared} />
      <DealerOrderForm locale={locale} shared={shared} />
    </>
  );
}

export default function OrdersPage() {
  const locale = useLocale();
  const { user } = useAuthStore();
  const isDealer = user?.role === "dealer";
  const t = useTranslations("Dashboard.memberOrders");
  const { orders, fetchOrders, isLoading } = useOrderStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchOrders();
  }, [fetchOrders]);

  if (!isMounted) return null;

  const formatCurrency = (val?: number) => 
    (val || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between pb-8 border-b border-border/10">
         <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">{t("title")}</h1>
            <p className="text-muted text-sm font-medium mt-1 italic">{t("description")}</p>
         </div>
         <Link
           href={
             isDealer
               ? `${localePath(locale, ROUTES.orders.list)}#dealer-order`
               : localePath(locale, ROUTES.products.list)
           }
           className="px-6 py-3 bg-brand text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand/20"
         >
           {t("newOrder")}
         </Link>
      </header>

      {isDealer && <DealerOrdersBlock locale={locale} />}

      <div className="surface-elevated rounded-[2.5rem] border border-border/10 overflow-hidden">
         {isLoading ? (
           <div className="p-20 text-center"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" /></div>
         ) : orders.length > 0 ? (
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-bg-alt/50 border-b border-border/5">
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t("table.orderNo")}</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t("table.date")}</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t("table.total")}</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t("table.status")}</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t("table.actions")}</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border/5">
                   {orders.map(order => (
                     <tr key={order.id} className="hover:bg-bg-alt/30 transition-colors">
                        <td className="px-6 py-5 font-black text-foreground">#{order.id.slice(-8).toUpperCase()}</td>
                        <td className="px-6 py-5 text-sm font-medium text-muted">{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                        <td className="px-6 py-5 font-black text-foreground">{formatCurrency(order.total_amount)}</td>
                        <td className="px-6 py-5">
                           <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-5 text-right">
                           <Link 
                             href={localePath(locale, ROUTES.orders.detail(order.id))}
                             className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline"
                           >
                             {t("details")}
                           </Link>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
         ) : (
           <div className="py-32 text-center text-muted italic font-medium">{t("empty")}</div>
         )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("Dashboard.orderStatus");
  const configs: Record<string, { label: string, color: string }> = {
    pending: { label: t("pending"), color: 'bg-yellow-500/10 text-yellow-500' },
    confirmed: { label: t("confirmed"), color: 'bg-blue-500/10 text-blue-500' },
    processing: { label: t("processing"), color: 'bg-indigo-500/10 text-indigo-500' },
    shipped: { label: t("shipped"), color: 'bg-purple-500/10 text-purple-500' },
    delivered: { label: t("delivered"), color: 'bg-green-500/10 text-green-500' },
    cancelled: { label: t("cancelled"), color: 'bg-red-500/10 text-red-500' },
  };

  const config = configs[status] || { label: status, color: 'bg-muted/10 text-muted' };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${config.color}`}>
      {config.label}
    </span>
  );
}
