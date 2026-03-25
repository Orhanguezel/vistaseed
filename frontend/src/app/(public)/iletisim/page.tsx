import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import { ContactPageClient } from "@/modules/contact/ContactPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("iletisim", {
    title: "Iletisim & Destek",
    description: "vistaseed destek merkezi. E-posta, WhatsApp ve iletişim formu.",
  });
}

export default function IletisimPage() {
  return <ContactPageClient />;
}
