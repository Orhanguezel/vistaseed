import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AuthForm from "@/modules/auth/components/AuthForm";
import { getPageMetadata } from "@/lib/seo";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AuthPages.member" });
  return getPageMetadata("uye-girisi", {
    locale,
    pathname: "/uye-girisi",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function UyeGirisiPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AuthPages.member" });

  return (
    <div className="surface-page min-h-screen py-32 flex items-center justify-center bg-bg-alt/10">
      <div className="max-w-xl mx-auto px-6 w-full">
        <AuthForm 
          title={t("title")}
          subtitle={t("subtitle")}
          role="customer"
          redirectPath="/uye-dashboard"
        />
      </div>
    </div>
  );
}
