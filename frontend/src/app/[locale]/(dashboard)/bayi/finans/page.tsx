// src/app/(dashboard)/bayi/finans/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useDealerStore } from "@/modules/dealer/dealer.store";
import { listDealerTransactions } from "@/modules/dealer/dealer.service";
import type { DealerTransaction } from "@/modules/dealer/dealer.type";

export default function FinancePage() {
  const t = useTranslations("Dashboard.finance");
  const { balance, fetchBalance, isLoading: isBalanceLoading } = useDealerStore();
  const [transactions, setTransactions] = useState<DealerTransaction[]>([]);
  const [isTransLoading, setIsTransLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchBalance();
    setIsTransLoading(true);
    listDealerTransactions({ limit: 50 })
      .then((res) => {
        setTransactions(res.data);
      })
      .catch(() => {
        setTransactions([]);
      })
      .finally(() => {
        setIsTransLoading(false);
      });
  }, [fetchBalance]);

  if (!isMounted) return null;

  const formatCurrency = (val?: number) => 
    (val || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });

  return (
    <div className="space-y-12">
      <header className="pb-8 border-b border-border/10">
         <h1 className="text-4xl font-black tracking-tighter text-foreground">{t("title")}</h1>
         <p className="text-muted text-sm font-medium mt-1 italic">{t("description")}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 shadow-sm border-l-4 border-l-brand">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4 italic">{t("cards.currentBalance")}</div>
            <div className={`text-3xl font-black tracking-tighter ${ (balance?.balance || 0) > 0 ? 'text-red-500' : 'text-green-500' }`}>
               {formatCurrency(balance?.balance)}
            </div>
            <div className="text-[9px] font-bold text-muted uppercase mt-2">{ (balance?.balance || 0) > 0 ? t("cards.debtBalance") : t("cards.creditBalance") }</div>
         </div>
         
         <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4 italic">{t("cards.creditLimit")}</div>
            <div className="text-3xl font-black text-foreground tracking-tighter">{formatCurrency(balance?.credit_limit)}</div>
         </div>

         <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 shadow-sm overflow-hidden relative">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4 italic">{t("cards.availableLimit")}</div>
            <div className="text-3xl font-black text-brand tracking-tighter">{formatCurrency(balance?.available_limit)}</div>
            <div className="absolute bottom-0 left-0 h-1 bg-brand/10 w-full">
               <div className="h-full bg-brand" style={{ width: `${Math.round(((balance?.available_limit || 0) / (balance?.credit_limit || 1)) * 100)}%` }} />
            </div>
         </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-2xl font-black text-foreground tracking-tight">{t("transactions.title")}</h3>
         <div className="surface-elevated rounded-[2.5rem] border border-border/10 overflow-hidden">
            {isTransLoading ? (
              <div className="p-20 text-center"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : transactions.length > 0 ? (
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-bg-alt/50 border-b border-border/5">
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t("transactions.table.date")}</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t("transactions.table.type")}</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t("transactions.table.description")}</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t("transactions.table.amount")}</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted text-right">{t("transactions.table.balance")}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/5">
                     {transactions.map(item => (
                       <tr key={item.id} className="hover:bg-bg-alt/30 transition-colors">
                          <td className="px-6 py-5 text-sm font-medium text-muted">{new Date(item.created_at).toLocaleDateString('tr-TR')}</td>
                          <td className="px-6 py-5 uppercase text-[9px] font-black tracking-widest">
                             <span className={`px-2 py-0.5 rounded-full ${item.type === 'order' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                {item.type === 'order' ? t("transactions.types.order") : item.type === 'payment' ? t("transactions.types.payment") : t("transactions.types.adjustment")}
                             </span>
                          </td>
                          <td className="px-6 py-5 text-xs font-bold text-foreground opacity-80">{item.description || '-'}</td>
                          <td className={`px-6 py-5 font-black ${item.amount < 0 ? 'text-green-600' : 'text-red-500'}`}>
                             {item.amount > 0 ? `+${formatCurrency(item.amount)}` : formatCurrency(item.amount)}
                          </td>
                          <td className="px-6 py-5 font-black text-foreground text-right">{formatCurrency(item.balance_after)}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            ) : (
               <div className="py-24 text-center text-muted italic font-medium">{t("transactions.empty")}</div>
            ) }
         </div>
      </div>
    </div>
  );
}
