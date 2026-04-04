"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useDealerStore } from "@/modules/dealer/dealer.store";
import { useOrderStore } from "@/modules/order/order.store";
import { ROUTES } from "@/config/routes";
import Link from "next/link";
import { useLocale } from "next-intl";
import { localePath } from "@/lib/locale-path";

export default function BayiDashboardPage() {
  const locale = useLocale();
  const t = useTranslations("Dashboard.dealerHome");
  const { user } = useAuthStore();
  const { balance } = useDealerStore();
  const { orders, fetchOrders, isLoading: isOrderLoading } = useOrderStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchOrders({ limit: 5 });
  }, [fetchOrders]);

  if (!isMounted) return null;

  const formatCurrency = (val?: number) => 
    (val || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });

  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const totalSpend = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row items-start justify-between gap-8 pb-10 border-b border-border/5">
         <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-foreground">
              {t("welcome")} <span className="text-brand">{user?.full_name?.split(' ')[0] || t("fallbackName")}</span>
            </h1>
            <p className="text-muted text-lg font-medium italic opacity-70">{t("description")}</p>
         </div>
         
         <div className="flex items-center gap-6 bg-surface p-6 rounded-3xl border border-border/10 shadow-sm border-l-4 border-l-brand">
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">{t("currentBalance")}</span>
               <span className="text-3xl font-black text-foreground tracking-tighter">{formatCurrency(balance?.balance)}</span>
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatCard label={t("stats.openOrders.label")} value={activeOrdersCount.toString()} subValue={t("stats.openOrders.subValue")} />
         <StatCard label={t("stats.availableLimit")} value={formatCurrency(balance?.available_limit)} isCurrency />
         <StatCard label={t("stats.totalSpend")} value={formatCurrency(totalSpend)} isCurrency />
         <StatCard label={t("stats.creditUsage")} value={`${Math.round(((balance?.balance || 0) / (balance?.credit_limit || 1)) * 100)}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-foreground tracking-tight">{t("recentOrders.title")}</h3>
               <Link href={localePath(locale, ROUTES.orders.list)} className="text-xs font-black uppercase tracking-widest text-brand hover:opacity-70 transition-opacity">{t("recentOrders.viewAll")}</Link>
            </div>
            
            <div className="surface-elevated rounded-[2.5rem] border border-border/10 overflow-hidden">
               {isOrderLoading ? (
                 <div className="p-20 text-center"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" /></div>
               ) : orders.length > 0 ? (
                 <div className="divide-y divide-border/5">
                   {orders.map(order => (
                     <div key={order.id} className="p-6 flex items-center justify-between hover:bg-bg-alt/30 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-bg-alt flex items-center justify-center text-xl">📦</div>
                           <div>
                              <div className="font-black text-foreground">#{order.id.slice(-6).toUpperCase()}</div>
                              <div className="text-xs text-muted font-bold">{new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                           </div>
                        </div>
                       <div className="text-right">
                           <div className="font-black text-foreground">{formatCurrency(order.total_amount)}</div>
                           <StatusBadge status={order.status} />
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-24 text-center space-y-6">
                    <div className="text-6xl grayscale opacity-20">📦</div>
                    <p className="text-muted text-sm italic font-medium">{t("recentOrders.empty")}</p>
                    <Link
                      href={`${localePath(locale, ROUTES.orders.list)}#dealer-order`}
                      className="inline-block px-10 py-4 bg-brand text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {t("recentOrders.catalogCta")}
                    </Link>
                 </div>
               )}
            </div>
         </div>

         <div className="lg:col-span-1 space-y-8">
            <h3 className="text-2xl font-black text-foreground tracking-tight">{t("operations.title")}</h3>
            <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 shadow-sm space-y-6">
               <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-brand/5 border border-brand/10 group hover:bg-brand/10 transition-colors cursor-default">
                     <span className="text-[10px] font-black text-brand uppercase tracking-widest mb-2 block">{t("operations.creditLimit")}</span>
                     <div className="h-2 w-full bg-border/20 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-brand transition-all duration-1000" 
                           style={{ width: `${Math.min(100, Math.round(((balance?.balance || 0) / (balance?.credit_limit || 1)) * 100))}%` }} 
                        />
                     </div>
                     <div className="mt-2 flex justify-between text-[10px] font-bold text-muted uppercase">
                        <span>{t("operations.used")}: {formatCurrency(balance?.balance)}</span>
                        <span>{t("operations.limit")}: {formatCurrency(balance?.credit_limit)}</span>
                     </div>
                  </div>
                  
                  <div className="p-6 rounded-3xl bg-bg-alt/50 border border-border/10">
                      <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-3">{t("support.title")}</h4>
                      <p className="text-xs font-medium text-muted leading-relaxed mb-4">{t("support.description")}</p>
                      <Link href={localePath(locale, ROUTES.panel.support)} className="text-[10px] font-black text-brand uppercase tracking-widest border-b border-brand/20 hover:border-brand transition-all pb-0.5">{t("support.cta")}</Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subValue, isCurrency = false }: { label: string; value: string; subValue?: string; isCurrency?: boolean }) {
  return (
    <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 shadow-sm hover:border-brand/20 transition-all group">
       <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4 italic group-hover:text-brand transition-colors">{label}</div>
       <div className="space-y-1">
          <div className="text-3xl font-black text-foreground tracking-tighter truncate">{value || '---'}</div>
          {subValue && <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{subValue}</div>}
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
    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-1 ${config.color}`}>
      {config.label}
    </span>
  );
}
