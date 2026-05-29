import type { Metadata } from "next";
import { CustomPageView } from "@/modules/customPage/CustomPageView";
import { getPageMetadata } from "@/lib/seo";

export const revalidate = 300;

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

const content = {
  tr: {
    title: "İade Politikası",
    summary: "Vista Seeds ürünlerinde iade, değişim ve hasarlı teslimat süreçleri hakkında bilgilendirme.",
    html: `
      <p>Bu iade politikası, Vista Seeds markası altında sunulan tohum ve tarımsal ürünlerin online ürün listeleme ve teklif süreçleri için hazırlanmıştır.</p>
      <h2>İade Süresi</h2>
      <p>Ürün tesliminden itibaren 14 gün içinde iade talebi oluşturulabilir. İade talebinin değerlendirilebilmesi için ürünün kullanılmamış, ambalajı açılmamış ve yeniden satışa uygun durumda olması gerekir.</p>
      <h2>Kusurlu veya Hasarlı Ürünler</h2>
      <p>Taşıma sırasında hasar gören, yanlış gönderilen veya üretim kaynaklı kusur şüphesi bulunan ürünler için müşteri, teslimattan sonra en kısa sürede Vista Seeds ile iletişime geçmelidir. İnceleme sonucunda uygun bulunan taleplerde değişim, iade veya telafi süreci başlatılır.</p>
      <h2>İade Edilemeyen Durumlar</h2>
      <p>Açılmış, kullanılmış, saklama koşulları bozulmuş veya müşteri tarafından zarar görmüş ürünlerde iade kabul edilmeyebilir. Tohum ürünleri canlı üretim materyali niteliği taşıdığı için saklama ve kullanım koşullarına bağlı kalite kayıpları ayrıca değerlendirilir.</p>
      <h2>İade Kargo Ücreti</h2>
      <p>Kusurlu, hasarlı veya hatalı gönderilen ürünlerde iade kargo süreci Vista Seeds tarafından yönlendirilir. Müşteri tercihine bağlı iade taleplerinde kargo ücreti müşteriye ait olabilir.</p>
      <h2>İletişim</h2>
      <p>İade ve değişim talepleri için <a href="/tr/iletisim">iletişim sayfamızdan</a> Vista Seeds ekibine ulaşabilirsiniz.</p>
    `,
  },
  en: {
    title: "Return Policy",
    summary: "Information about returns, exchanges, and damaged deliveries for Vista Seeds products.",
    html: `
      <p>This return policy applies to seed and agricultural products listed or quoted under the Vista Seeds brand.</p>
      <h2>Return Period</h2>
      <p>Return requests may be submitted within 14 days after delivery. Products must be unused, unopened, and suitable for resale.</p>
      <h2>Defective or Damaged Products</h2>
      <p>If a product is damaged in transit, sent incorrectly, or appears defective, please contact Vista Seeds as soon as possible after delivery. Eligible requests may be resolved through replacement, return, or another appropriate remedy.</p>
      <h2>Non-Returnable Cases</h2>
      <p>Opened, used, improperly stored, or customer-damaged products may not be eligible for return. Seed products are agricultural production materials, so quality concerns related to storage and usage conditions are reviewed separately.</p>
      <h2>Return Shipping</h2>
      <p>For defective, damaged, or incorrectly shipped products, Vista Seeds will guide the return shipping process. For customer-preference returns, shipping costs may be the customer's responsibility.</p>
      <h2>Contact</h2>
      <p>For return and exchange requests, please contact the Vista Seeds team through our <a href="/en/contact">contact page</a>.</p>
    `,
  },
  de: {
    title: "Rückgaberecht",
    summary: "Informationen zu Rückgabe, Umtausch und beschädigten Lieferungen bei Vista Seeds Produkten.",
    html: `
      <p>Diese Rückgaberichtlinie gilt für Saatgut und landwirtschaftliche Produkte, die unter der Marke Vista Seeds gelistet oder angeboten werden.</p>
      <h2>Rückgabefrist</h2>
      <p>Rückgabeanfragen können innerhalb von 14 Tagen nach Lieferung gestellt werden. Die Produkte müssen unbenutzt, ungeöffnet und für den Wiederverkauf geeignet sein.</p>
      <h2>Defekte oder beschädigte Produkte</h2>
      <p>Wenn ein Produkt beim Transport beschädigt wurde, falsch geliefert wurde oder ein Produktionsmangel vermutet wird, kontaktieren Sie Vista Seeds bitte so schnell wie möglich nach der Lieferung.</p>
      <h2>Nicht rückgabefähige Fälle</h2>
      <p>Geöffnete, benutzte, unsachgemäß gelagerte oder vom Kunden beschädigte Produkte sind möglicherweise von der Rückgabe ausgeschlossen. Saatgut ist ein landwirtschaftliches Produktionsmaterial und wird daher auch nach Lager- und Nutzungsbedingungen bewertet.</p>
      <h2>Rücksendekosten</h2>
      <p>Bei defekten, beschädigten oder falsch gelieferten Produkten begleitet Vista Seeds den Rücksendeprozess. Bei Rückgaben aus Kundenwunsch können die Versandkosten vom Kunden getragen werden.</p>
      <h2>Kontakt</h2>
      <p>Für Rückgabe- und Umtauschanfragen kontaktieren Sie das Vista Seeds Team über unsere <a href="/de/kontakt">Kontaktseite</a>.</p>
    `,
  },
} as const;

function getContent(locale: string) {
  return content[locale as keyof typeof content] ?? content.tr;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = getContent(locale);

  return getPageMetadata("iade-politikasi", {
    locale,
    pathname: "/iade-politikasi",
    title: page.title,
    description: page.summary,
  });
}

export default async function IadePolitikasiPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const page = getContent(locale);

  return <CustomPageView title={page.title} summary={page.summary} html={page.html} eyebrow="Vista Seeds" />;
}
