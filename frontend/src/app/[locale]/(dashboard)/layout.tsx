"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useDealerStore } from "@/modules/dealer/dealer.store";
import { logout, fetchCurrentUser } from "@/modules/auth/auth.service";
import { ROUTES } from "@/config/routes";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { localePath, pathnameWithoutLocale } from "@/lib/locale-path";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Dashboard.layout");
  const locale = useLocale();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { balance, fetchBalance } = useDealerStore();
  const router = useRouter();
  const pathname = usePathname();
  const pathNoLocale = pathnameWithoutLocale(pathname);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isLoading && !isAuthenticated) {
        fetchCurrentUser().then(u => {
            if (!u) router.push(localePath(locale, ROUTES.static.dealer_login));
        });
    }
  }, [isAuthenticated, isLoading, router, locale]);

  useEffect(() => {
    if (user?.role === "dealer" && !balance) {
      fetchBalance();
    }
  }, [user, balance, fetchBalance]);

  if (!isMounted || isLoading || !isAuthenticated) {
     return <div className="min-h-screen flex items-center justify-center bg-bg-alt/20">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
     </div>;
  }

  const isDealer = user?.role === "dealer";

  return (
    <div className="min-h-screen bg-bg-alt/10 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-surface border-r border-border/10 p-6 flex flex-col shadow-xl z-10 transition-all duration-300">
         <div className="mb-10 px-4">
            <Link href={localePath(locale, ROUTES.home)} className="flex items-center gap-3 group">
                <Image src="/assets/logo/logo.jpeg" alt="Logo" width={44} height={44} className="h-8 w-8 object-contain rounded-lg" />
                <span className="text-xl font-black tracking-tighter text-foreground uppercase group-hover:text-brand transition-colors">{process.env.NEXT_PUBLIC_SITE_NAME || "VISTA SEED"}</span>
            </Link>
            
            <div className="mt-8 p-4 bg-bg-alt/50 rounded-2xl border border-border/5">
               <div className="flex items-center justify-between mb-2">
                 <div className="text-[10px] font-black uppercase tracking-widest text-brand">
                    {isDealer ? t("portal.dealer") : t("portal.customer")}
                 </div>
                 <ThemeToggle className="scale-75" />
               </div>
               <div className="text-sm font-bold text-foreground truncate">{user?.full_name || user?.email}</div>
               
               {isDealer && balance && (
                 <div className="mt-4 pt-4 border-t border-border/10">
                    <div className="text-[9px] font-black uppercase text-muted tracking-widest mb-1">{t("limitStatus")}</div>
                    <div className="text-lg font-black text-brand tracking-tighter">
                      ₺{balance.available_limit?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </div>
                 </div>
               )}
            </div>
         </div>

         <nav className="grow space-y-2">
            <DashboardLink 
               href={localePath(locale, isDealer ? ROUTES.dealer.dashboard : ROUTES.panel.root)} 
               label={t("nav.overview")}
               active={pathNoLocale === ROUTES.dealer.dashboard || pathNoLocale === ROUTES.panel.root} 
            />
            {isDealer && (
              <>
                <DashboardLink 
                   href={localePath(locale, ROUTES.orders.list)} 
                   label={t("nav.orders")}
                   active={pathNoLocale.includes(ROUTES.orders.list)} 
                />
                <DashboardLink 
                   href={localePath(locale, ROUTES.dealer.finance)} 
                   label={t("nav.finance")}
                   active={pathNoLocale.includes(ROUTES.dealer.finance)} 
                />
              </>
            )}
            <DashboardLink
              href={localePath(locale, ROUTES.panel.support)}
              label={t("nav.help")}
              active={pathNoLocale.startsWith(ROUTES.panel.support)}
            />
            <DashboardLink href={localePath(locale, ROUTES.panel.profile)} label={t("nav.account")} active={pathNoLocale === ROUTES.panel.profile} />
         </nav>

         <button
            onClick={async () => { await logout(); router.push(localePath(locale, ROUTES.home)); }}
            className="mt-10 flex items-center justify-center gap-3 w-full py-4 text-xs font-black uppercase tracking-widest text-muted hover:text-red-500 hover:bg-red-50/50 rounded-2xl transition-all border border-transparent hover:border-red-500/10"
         >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {t("logout")}
         </button>
      </aside>

      {/* Main Area */}
      <main className="grow p-6 md:p-12 lg:p-16 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

function DashboardLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all border border-transparent ${
        active 
          ? "bg-brand text-white shadow-xl shadow-brand/20 border-brand/10 font-black" 
          : "text-muted font-bold hover:bg-bg-alt hover:text-foreground hover:border-border/10"
      }`}
    >
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </Link>
  );
}
