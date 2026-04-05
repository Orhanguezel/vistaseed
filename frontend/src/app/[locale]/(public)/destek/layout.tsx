import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata("destek", { locale, pathname: "/destek" });
}

export default function DestekLayout({ children }: Props) {
  return children;
}
