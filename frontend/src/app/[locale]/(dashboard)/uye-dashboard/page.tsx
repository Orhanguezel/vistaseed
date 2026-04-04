import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard.memberHome.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function UyeDashboardPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard.memberHome" });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-border/10">
         <div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand mb-2">{t("welcome")}</h2>
            <h1 className="text-4xl font-black tracking-tighter text-foreground mb-1">{t("title")}</h1>
            <p className="text-muted text-sm font-medium italic">{t("description")}</p>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center text-3xl mb-6">👤</div>
            <h3 className="text-lg font-black text-foreground mb-2">{t("cards.profile.title")}</h3>
            <p className="text-muted text-xs mb-6 px-4">{t("cards.profile.description")}</p>
            <button className="mt-auto px-6 py-2 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand hover:text-white transition-all">{t("cards.profile.cta")}</button>
         </div>

         <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center text-3xl mb-6">🛍️</div>
            <h3 className="text-lg font-black text-foreground mb-2">{t("cards.orders.title")}</h3>
            <p className="text-muted text-xs mb-6 px-4">{t("cards.orders.description")}</p>
            <button className="mt-auto px-6 py-2 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand hover:text-white transition-all">{t("cards.orders.cta")}</button>
         </div>

         <div className="surface-elevated p-8 rounded-[2.5rem] border border-border/10 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center text-3xl mb-6">⭐</div>
            <h3 className="text-lg font-black text-foreground mb-2">{t("cards.favorites.title")}</h3>
            <p className="text-muted text-xs mb-6 px-4">{t("cards.favorites.description")}</p>
            <button className="mt-auto px-6 py-2 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand hover:text-white transition-all">{t("cards.favorites.cta")}</button>
         </div>
      </div>

      <div className="surface-elevated p-10 rounded-[3rem] border border-border/10 shadow-sm relative overflow-hidden bg-navy-mid group">
         <div className="relative z-10 max-w-lg">
            <h3 className="text-white text-2xl font-black mb-4 tracking-tight">{t("cta.title")}</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-8">{t("cta.description")}</p>
            <button className="px-8 py-3 bg-brand text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-brand-dark transition-all shadow-xl shadow-brand/20">{t("cta.button")}</button>
         </div>
         <div className="absolute right-[-5%] bottom-[-20%] text-[10rem] opacity-5 group-hover:scale-110 transition-transform duration-1000 select-none">🌱</div>
      </div>
    </div>
  );
}
