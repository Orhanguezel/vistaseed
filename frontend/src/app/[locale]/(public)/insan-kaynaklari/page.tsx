import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo";
import { ROUTES } from "@/config/routes";
import { toLocalizedPath } from "@/i18n/routing";

export const revalidate = 300;

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata("hr", {
    locale,
    pathname: "/insan-kaynaklari",
  });
}

export default async function HRPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HR" });

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl font-black tracking-tighter text-foreground mb-4">{t("title")}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { value: "100+", label: t("stats.expertTeam") },
            { value: "250+", label: t("stats.totalStaff") },
            { value: "300+", label: t("stats.employees") },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-8 bg-surface rounded-2xl border border-border/50">
              <div className="text-4xl font-black text-brand mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">{t("whyUsTitle")}</h2>
            <ul className="space-y-3">
              {[
                t("reasons.0"),
                t("reasons.1"),
                t("reasons.2"),
                t("reasons.3"),
                t("reasons.4"),
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-brand shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold tracking-tight mb-4">{t("applicationTitle")}</h2>
            <p className="text-muted-foreground mb-6">
              {t("applicationDescription")}
            </p>
            <Link
              href={toLocalizedPath(ROUTES.static.contact, locale)}
              className="inline-flex px-8 py-4 bg-brand text-white font-black rounded-2xl hover:bg-brand/90 transition-all shadow-xl shadow-brand/20"
            >
              {t("contactCta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
