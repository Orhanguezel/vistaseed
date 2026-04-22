"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ROUTES } from "@/config/routes";
import { localePath, pathnameWithoutLocale } from "@/lib/locale-path";
import { logout, fetchCurrentUser } from "@/modules/auth/auth.service";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useDealerStore } from "@/modules/dealer/dealer.store";
import { getStoredAccessToken } from "@/lib/auth-token";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Dashboard.layout");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { balance, fetchBalance } = useDealerStore();
  const [isMounted, setIsMounted] = useState(false);
  const pathNoLocale = pathnameWithoutLocale(pathname);

  useEffect(() => {
    setIsMounted(true);
    if (!isLoading && !isAuthenticated) {
      const token = getStoredAccessToken();
      if (!token) {
        router.push(localePath(locale, ROUTES.static.dealer_login));
        return;
      }
      fetchCurrentUser().then((currentUser) => {
        if (!currentUser) {
          router.push(localePath(locale, ROUTES.static.dealer_login));
        }
      });
    }
  }, [isAuthenticated, isLoading, locale, router]);

  useEffect(() => {
    if (user?.role === "dealer" && !balance) {
      fetchBalance();
    }
  }, [balance, fetchBalance, user]);

  if (!isMounted || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  const isDealer = user?.role === "dealer";

  return (
    <section className="bg-bg-alt/10">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-screen-2xl flex-col md:flex-row">
        <aside className="w-full bg-surface p-6 shadow-xl transition-all duration-300 md:sticky md:top-24 md:h-[calc(100vh-8rem)] md:w-72 md:self-start md:border-r md:border-border/10">
          <div className="mb-10 px-4">
            <Link href={localePath(locale, ROUTES.home)} className="group flex items-center gap-3">
              <Image
                src="/uploads/media/logo/vistaseed_logo.png"
                alt="Logo"
                width={44}
                height={44}
                className="h-8 w-8 rounded-lg object-contain"
              />
            </Link>

            <div className="mt-8 rounded-2xl border border-border/5 bg-bg-alt/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-black uppercase tracking-widest text-brand">
                  {isDealer ? t("portal.dealer") : t("portal.customer")}
                </div>
                <ThemeToggle className="scale-75" />
              </div>
              <div className="truncate text-sm font-bold text-foreground">
                {user?.full_name || user?.email}
              </div>

              {isDealer && balance && (
                <div className="mt-4 border-t border-border/10 pt-4">
                  <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-muted">
                    {t("limitStatus")}
                  </div>
                  <div className="text-lg font-black tracking-tighter text-brand">
                    ₺{balance.available_limit?.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
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
            <DashboardLink
              href={localePath(locale, ROUTES.panel.profile)}
              label={t("nav.account")}
              active={pathNoLocale === ROUTES.panel.profile}
            />
          </nav>

          <button
            onClick={async () => {
              await logout();
              router.push(localePath(locale, ROUTES.home));
            }}
            className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl border border-transparent py-4 text-xs font-black uppercase tracking-widest text-muted transition-all hover:border-red-500/10 hover:bg-red-50/50 hover:text-red-500"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t("logout")}
          </button>
        </aside>

        <div className="min-w-0 grow px-4 py-6 md:px-8 md:py-10 lg:px-12 lg:py-14">{children}</div>
      </div>
    </section>
  );
}

function DashboardLink({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl border px-5 py-4 transition-all ${
        active
          ? "border-brand/10 bg-brand font-black text-white shadow-xl shadow-brand/20"
          : "border-transparent font-bold text-muted hover:border-border/10 hover:bg-bg-alt hover:text-foreground"
      }`}
    >
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </Link>
  );
}
