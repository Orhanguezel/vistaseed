import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo";
import ProductDiscoveryLinks, { type DiscoveryItem } from "@/components/sections/ProductDiscoveryLinks";
import DealersNetworkClient from "./dealers-network-client";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DealersNetwork" });
  const base = await getPageMetadata("dealers-network", {
    locale,
    pathname: "/bayi-agi",
  });
  return {
    ...base,
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

function Fallback() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-muted-foreground animate-pulse">…</div>
  );
}

export default async function BayiAgiPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DealersNetwork" });
  const discoveryItems: DiscoveryItem[] = [
    {
      id: "greenhouse",
      title: t("discovery.items.greenhouse.title"),
      description: t("discovery.items.greenhouse.description"),
      query: { cultivation: "greenhouse" },
    },
    {
      id: "open-field",
      title: t("discovery.items.openField.title"),
      description: t("discovery.items.openField.description"),
      query: { cultivation: "openField" },
    },
    {
      id: "rootstock",
      title: t("discovery.items.rootstock.title"),
      description: t("discovery.items.rootstock.description"),
      query: { type: "rootstock" },
    },
    {
      id: "tswv",
      title: t("discovery.items.tswv.title"),
      description: t("discovery.items.tswv.description"),
      query: { tolerance: "tswv" },
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<Fallback />}>
        <DealersNetworkClient />
      </Suspense>
      <ProductDiscoveryLinks
        locale={locale}
        eyebrow={t("discovery.eyebrow")}
        title={t("discovery.title")}
        subtitle={t("discovery.subtitle")}
        ctaLabel={t("discovery.cta")}
        items={discoveryItems}
        compact
      />
    </div>
  );
}
