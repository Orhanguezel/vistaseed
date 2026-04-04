import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AuthForm from "@/modules/auth/components/AuthForm";
import { getPageMetadata } from "@/lib/seo";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AuthPages.dealer" });
  return getPageMetadata("bayi-girisi", {
    locale,
    pathname: "/bayi-girisi",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function BayiGirisiPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AuthPages.dealer" });
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="surface-page min-h-screen py-32 flex items-center justify-center bg-bg-alt/10">
      <div className="max-w-xl mx-auto px-6 w-full">
        <AuthForm 
          title={t("title")}
          subtitle={t("subtitle")}
          role="dealer"
          redirectPath="/bayi-dashboard"
          initialEmail="bayi@example.com"
          initialPassword="admin123"
          devCredentialsHint={
            isDev
              ? "Geliştirme hesabı: bayi@example.com — şifre: admin123 (CALISTIRMA.md)"
              : undefined
          }
        />
      </div>
    </div>
  );
}
