import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo";
import TopluSatisClient from "./toplu-satis-client";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BulkSales" });
  const base = await getPageMetadata("toplu-satis", {
    locale,
    pathname: "/toplu-satis",
  });
  return {
    ...base,
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function TopluSatisPage() {
  return <TopluSatisClient />;
}
