import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo";
import { fetchSiteSettings } from "@/lib/site-settings";
import { ContactPageClient } from "@/modules/contact/ContactPageClient";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.meta" });
  return getPageMetadata("iletisim", {
    locale,
    pathname: "/iletisim",
    title: t("title"),
    description: t("description"),
  });
}

export default async function IletisimPage() {
  const settings = await fetchSiteSettings();
  
  return <ContactPageClient settings={settings} />;
}
