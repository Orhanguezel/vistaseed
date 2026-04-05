// src/app/(dashboard)/panel/profil/page.tsx
"use client";

import { useAuthStore } from "@/modules/auth/auth.store";
import { useDealerStore } from "@/modules/dealer/dealer.store";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("Dashboard.profile");
  const { user } = useAuthStore();
  const { profile, fetchProfile, isLoading } = useDealerStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (user?.role === 'dealer') fetchProfile();
  }, [user, fetchProfile]);

  if (!isMounted) return null;

  return (
    <div className="max-w-4xl space-y-12">
      <header className="pb-8 border-b border-border/10">
         <h1 className="text-4xl font-black tracking-tighter text-foreground">{t("title")}</h1>
         <p className="text-muted text-sm font-medium mt-1 italic">{t("description")}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         {/* User Info */}
         <section className="space-y-6">
            <h3 className="text-xl font-black text-brand tracking-tight">{t("personal.title")}</h3>
            <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 space-y-4">
               <div>
                  <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-1 block">{t("personal.fields.fullName")}</label>
                  <div className="text-sm font-bold text-foreground">{user?.full_name || '-'}</div>
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-1 block">{t("personal.fields.email")}</label>
                  <div className="text-sm font-bold text-foreground">{user?.email || '-'}</div>
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-1 block">{t("personal.fields.phone")}</label>
                  <div className="text-sm font-bold text-foreground">{user?.phone || '-'}</div>
               </div>
            </div>
         </section>

         {/* Dealer Info */}
         {user?.role === 'dealer' && (
           <section className="space-y-6">
              <h3 className="text-xl font-black text-brand tracking-tight">{t("corporate.title")}</h3>
              <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 space-y-4">
                 {isLoading ? (
                    <div className="py-10 text-center animate-pulse text-muted">{t("loading")}</div>
                 ) : (
                    <>
                       <div>
                          <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-1 block">{t("corporate.fields.companyName")}</label>
                          <div className="text-sm font-bold text-foreground">{profile?.company_name || '-'}</div>
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-1 block">{t("corporate.fields.tax")}</label>
                          <div className="text-sm font-bold text-foreground">{profile?.tax_office} / {profile?.tax_number}</div>
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-1 block">{t("corporate.fields.address")}</label>
                          <div className="text-sm font-bold text-foreground leading-relaxed italic">{profile?.address || '-'}</div>
                       </div>
                    </>
                 )}
              </div>
           </section>
         )}
      </div>

      <div className="pt-10">
         <button className="px-10 py-5 bg-bg-alt text-foreground font-black text-xs uppercase tracking-widest rounded-2xl border border-border/10 hover:bg-surface transition-all">{t("changePassword")}</button>
      </div>
    </div>
  );
}
