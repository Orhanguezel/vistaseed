import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/modules/customPage/customPage.service";
import { CustomPageView } from "@/modules/customPage/CustomPageView";
import { getPageMetadata } from "@/lib/seo";

export const revalidate = 300;

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.terms" });
  try {
    const page = await getCustomPageBySlug("kullanim-kosullari", locale);
    return getPageMetadata("kullanim-kosullari", {
      locale,
      pathname: "/kullanim-kosullari",
      title: page.meta_title || page.title,
      description: page.meta_description || page.summary || t("fallbackDescription"),
    });
  } catch {
    return getPageMetadata("kullanim-kosullari", {
      locale,
      pathname: "/kullanim-kosullari",
      title: t("fallbackTitle"),
      description: t("fallbackDescription"),
    });
  }
}

export default async function KullanimKosullariPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.common" });
  try {
    const page = await getCustomPageBySlug("kullanim-kosullari", locale);
    return <CustomPageView title={page.title} summary={page.summary} html={page.content} eyebrow={t("eyebrow")} emptyHtml={t("emptyHtml")} />;
  } catch {
    notFound();
  }
}
