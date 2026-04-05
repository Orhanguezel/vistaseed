import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo";
import ComparePageClient from "./compare-page-client";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Compare" });
  const base = await getPageMetadata("compare", {
    locale,
    pathname: "/karsilastirma",
  });
  return {
    ...base,
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

function CompareFallback() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-muted-foreground animate-pulse">
      …
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<CompareFallback />}>
        <ComparePageClient />
      </Suspense>
    </div>
  );
}
