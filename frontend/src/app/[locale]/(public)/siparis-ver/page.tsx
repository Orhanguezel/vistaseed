import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FlaskConical, Leaf, PackageCheck, ShieldCheck, Sprout, Truck } from "lucide-react";
import { OfferForm } from "@/modules/offers/offer-form";
import { getPageMetadata } from "@/lib/seo";
import { toLocalizedPath } from "@/i18n/routing";
import { ROUTES } from "@/config/routes";

type Props = {
  params: Promise<{ locale: string }>;
};

const pageContent = {
  tr: {
    metaTitle: "Sebze Tohumu Siparişi Ver",
    metaDescription:
      "Biber, domates ve profesyonel sebze tohumu talepleriniz için Vista Seeds ekibine ürün odaklı sipariş talebi gönderin.",
    eyebrow: "Profesyonel sebze tohumu tedariği",
    introTitle: "Vista Seeds sipariş sayfası hangi talepler için uygundur?",
    intro:
      "Bu sayfa, sera işletmeleri, üreticiler, bayiler, kooperatifler ve kurumsal tedarik ekipleri için sebze tohumu sipariş talebini doğru ürün grubuna bağlamak amacıyla hazırlanmıştır. Talebiniz yalnızca fiyat istemi olarak değil; ürün tipi, yetiştirme bölgesi, sezon, tahmini hacim ve teknik ihtiyaçlar birlikte değerlendirilerek ele alınır.",
    productTitle: "Sipariş verebileceğiniz ana ürün grupları",
    products: [
      {
        title: "Biber tohumları",
        text: "Kapya, çarliston, kıl biber, üçburun ve dolmalık tiplerinde F1 hibrit çeşitler için sezon ve bölgeye göre yönlendirme yapılır.",
      },
      {
        title: "Domates ve sebze tohumu talepleri",
        text: "Sera ve açık tarla üretimine uygun sebze tohumu ihtiyaçları, planlanan ekim dönemi ve üretim hedefiyle birlikte değerlendirilir.",
      },
      {
        title: "Anaç ve özel hibrit çözümler",
        text: "Hastalık toleransı, soğuk performansı, raf ömrü ve pazar beklentisi gibi kriterler üzerinden uygun çeşit önerisi hazırlanır.",
      },
    ],
    processTitle: "Sipariş süreci nasıl ilerler?",
    process: [
      "Formdaki ürün, miktar, şehir ve kullanım amacını inceleriz.",
      "Talebi mevcut ürün portföyü ve sezon uygunluğu ile eşleştiririz.",
      "Gerekirse teknik ekip ürün tipi, tolerans ve yetiştirme koşulları için ek bilgi ister.",
      "Size ürün önerisi, tedarik notu ve siparişe uygun fiyat bilgisi ile dönüş yapılır.",
    ],
    trustTitle: "Neden Vista Seeds?",
    detailTitle: "Tohum seçimi, fiyat ve teknik uygunluk aynı akışta değerlendirilir.",
    detailText:
      "Reklam kampanyasından gelen kullanıcılar bu sayfada doğrudan form doldurabilir, ürün kataloğuna geçebilir veya iletişim kanallarından ek bilgi alabilir. Böylece sipariş talebi tek bir boş form yerine ürün ve kurum bilgisiyle desteklenen açık bir karar sayfasına dönüşür.",
    trust: [
      "Tohum portföyü profesyonel üretici ve bayi ihtiyaçlarına göre kurgulanır.",
      "Ürün sayfalarında çeşit tipi, tolerans, kullanım alanı ve pazar avantajı açıkça belirtilir.",
      "Aksu / Antalya merkezli operasyon, saha bilgisi ve üretici geri bildirimleriyle desteklenir.",
      "Sipariş talepleri ürün kataloğu, bayi ağı ve iletişim kanallarıyla aynı sistem içinde takip edilir.",
    ],
    faqTitle: "Sipariş öncesi sık sorulanlar",
    faqs: [
      {
        q: "Sipariş vermek için kesin miktar belirtmek zorunda mıyım?",
        a: "Hayır. Tahmini adet, kilogram veya üretim alanı bilgisini paylaşmanız yeterlidir. Net hacim daha sonra ekiple birlikte kesinleştirilebilir.",
      },
      {
        q: "Sadece tek ürün için mi sipariş talebi gönderebilirim?",
        a: "Tek ürün, ürün grubu veya sezonluk toplu ihtiyaç için sipariş talebi gönderebilirsiniz. Mesaj alanına çeşit, bölge ve ekim zamanı bilgisini eklemeniz değerlendirmeyi hızlandırır.",
      },
      {
        q: "Sipariş formu reklam kampanyası için ana hedef sayfa olabilir mi?",
        a: "Evet. Sayfa ürün grupları, süreç, şirket bilgisi, iç bağlantılar ve iletişim seçenekleriyle birlikte kurumsal sipariş hedefi olarak kullanılmak üzere düzenlenmiştir.",
      },
    ],
    linksTitle: "Talebinizi netleştirmek için",
    footerTitle: "Vista Seeds ürün ve iletişim sayfaları",
    links: [
      { label: "Ürün kataloğunu inceleyin", href: ROUTES.products.list },
      { label: "Toplu satış akışına bakın", href: ROUTES.static.bulk_sales },
      { label: "Bize ulaşın", href: ROUTES.static.contact },
    ],
  },
  en: {
    metaTitle: "Place a Vegetable Seed Order",
    metaDescription:
      "Send a product-focused order request to Vista Seeds for pepper, tomato and professional vegetable seed supply.",
    eyebrow: "Professional vegetable seed supply",
    introTitle: "What kind of requests is this order page built for?",
    intro:
      "This page is prepared for greenhouse businesses, growers, dealers, cooperatives and corporate supply teams that need a clear seed order flow. Requests are reviewed together with product type, growing region, season, estimated volume and technical requirements.",
    productTitle: "Main product groups for orders",
    products: [
      {
        title: "Pepper seeds",
        text: "F1 hybrid options for kapia, charleston, thin pepper, breakfast pepper and stuffing pepper types are evaluated by season and region.",
      },
      {
        title: "Tomato and vegetable seed requests",
        text: "Vegetable seed needs for greenhouse or open-field production are reviewed with the planned planting period and production target.",
      },
      {
        title: "Rootstock and special hybrid solutions",
        text: "Disease tolerance, cold performance, shelf life and market expectations are considered when preparing product recommendations.",
      },
    ],
    processTitle: "How the order process works",
    process: [
      "We review product, quantity, city and intended use from the form.",
      "We match the request with the current portfolio and seasonal availability.",
      "If needed, the technical team asks for more detail on product type, tolerance and growing conditions.",
      "We return with product recommendation, supply notes and order-ready pricing information.",
    ],
    trustTitle: "Why Vista Seeds?",
    detailTitle: "Seed selection, pricing and technical fit are evaluated in one flow.",
    detailText:
      "Visitors arriving from ads can submit the form directly, review the product catalog or use contact channels for additional information. The order request is supported by product and company context rather than a standalone empty form.",
    trust: [
      "The seed portfolio is shaped around professional grower and dealer needs.",
      "Product pages describe variety type, tolerance, use case and market advantage clearly.",
      "The Aksu / Antalya based operation is supported by field knowledge and grower feedback.",
      "Order requests are tracked in the same system as the product catalog, dealer network and contact channels.",
    ],
    faqTitle: "Common questions before placing an order",
    faqs: [
      {
        q: "Do I need to know the exact quantity?",
        a: "No. An estimated unit, kilogram or production area is enough. The final volume can be clarified with the team later.",
      },
      {
        q: "Can I place an order request for more than one product?",
        a: "Yes. You can request a single product, a product group or a seasonal bulk need. Adding variety, region and planting period details speeds up evaluation.",
      },
      {
        q: "Can this order page be used as the main ads landing page?",
        a: "Yes. The page now includes product groups, process details, company context, internal links and contact options for a corporate order campaign.",
      },
    ],
    linksTitle: "Helpful next steps",
    footerTitle: "Vista Seeds product and contact pages",
    links: [
      { label: "Explore product catalog", href: ROUTES.products.list },
      { label: "See bulk sales flow", href: ROUTES.static.bulk_sales },
      { label: "Contact us", href: ROUTES.static.contact },
    ],
  },
  de: {
    metaTitle: "Gemüsesaatgut-Bestellung aufgeben",
    metaDescription:
      "Senden Sie eine produktbezogene Bestellanfrage an Vista Seeds für Paprika-, Tomaten- und professionelles Gemüsesaatgut.",
    eyebrow: "Professionelle Versorgung mit Gemüsesaatgut",
    introTitle: "Für welche Anfragen ist diese Bestellseite gedacht?",
    intro:
      "Diese Seite richtet sich an Gewächshausbetriebe, Erzeuger, Händler, Kooperativen und Einkaufsteams, die Saatgutbestellungen strukturiert anfragen möchten. Produktart, Anbauregion, Saison, geschätztes Volumen und technische Anforderungen werden gemeinsam bewertet.",
    productTitle: "Wichtige Produktgruppen für Bestellungen",
    products: [
      {
        title: "Paprikasaatgut",
        text: "F1-Hybride für Kapia, Charleston, dünne Paprika, Frühstückspaprika und Blocktypen werden je nach Saison und Region bewertet.",
      },
      {
        title: "Tomaten- und Gemüsesaatgut",
        text: "Saatgutbedarf für Gewächshaus oder Freiland wird mit geplanter Pflanzperiode und Produktionsziel geprüft.",
      },
      {
        title: "Unterlagen und spezielle Hybridlösungen",
        text: "Krankheitstoleranz, Kälteleistung, Haltbarkeit und Markterwartungen fließen in die Produktempfehlung ein.",
      },
    ],
    processTitle: "So läuft der Bestellprozess",
    process: [
      "Wir prüfen Produkt, Menge, Stadt und Einsatzzweck aus dem Formular.",
      "Die Anfrage wird mit Portfolio und saisonaler Verfügbarkeit abgeglichen.",
      "Bei Bedarf fragt das technische Team weitere Details zu Sorte, Toleranz und Bedingungen ab.",
      "Sie erhalten Produktempfehlung, Lieferhinweise und bestellfertige Preisinformationen.",
    ],
    trustTitle: "Warum Vista Seeds?",
    detailTitle: "Saatgutauswahl, Preis und technische Eignung werden gemeinsam bewertet.",
    detailText:
      "Besucher aus Anzeigen können das Formular direkt senden, den Produktkatalog prüfen oder zusätzliche Informationen über die Kontaktkanäle anfordern. Die Bestellanfrage wird durch Produkt- und Unternehmenskontext unterstützt.",
    trust: [
      "Das Saatgutportfolio ist auf professionelle Erzeuger und Händler ausgerichtet.",
      "Produktseiten zeigen Sortentyp, Toleranz, Einsatzbereich und Marktvorteile transparent.",
      "Der Standort Aksu / Antalya wird durch Feldwissen und Erzeugerfeedback unterstützt.",
      "Bestellanfragen werden mit Produktkatalog, Händlernetz und Kontaktkanälen im selben System verfolgt.",
    ],
    faqTitle: "Häufige Fragen vor der Bestellung",
    faqs: [
      {
        q: "Muss ich die genaue Menge kennen?",
        a: "Nein. Eine Schätzung in Stück, Kilogramm oder Produktionsfläche reicht aus. Das finale Volumen kann später geklärt werden.",
      },
      {
        q: "Kann ich mehrere Produkte bestellen?",
        a: "Ja. Einzelprodukte, Produktgruppen oder saisonale Sammelbedarfe sind möglich. Sorte, Region und Pflanzzeit helfen bei der Bewertung.",
      },
      {
        q: "Kann diese Seite als Ads-Zielseite verwendet werden?",
        a: "Ja. Die Seite enthält Produktgruppen, Prozessdetails, Unternehmenskontext, interne Links und Kontaktoptionen für eine Bestellkampagne.",
      },
    ],
    linksTitle: "Nächste hilfreiche Schritte",
    footerTitle: "Vista Seeds Produkt- und Kontaktseiten",
    links: [
      { label: "Produktkatalog ansehen", href: ROUTES.products.list },
      { label: "Großverkauf ansehen", href: ROUTES.static.bulk_sales },
      { label: "Kontakt aufnehmen", href: ROUTES.static.contact },
    ],
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = pageContent[locale as keyof typeof pageContent] ?? pageContent.tr;
  const base = await getPageMetadata("teklif-al", { locale, pathname: "/siparis-ver" });
  return {
    ...base,
    title: content.metaTitle,
    description: content.metaDescription,
  };
}

export default async function OfferPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = pageContent[locale as keyof typeof pageContent] ?? pageContent.tr;
  const productHref = toLocalizedPath(ROUTES.products.list, locale);

  return (
    <main className="surface-page">
      <section className="relative overflow-hidden border-b border-border-soft bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/uploads/slide/slide-7-seeds.webp')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand">{content.eyebrow}</p>
            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
              {content.introTitle}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/78 md:text-lg">{content.intro}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              {content.links.map((link) => (
                <Link
                  key={link.href}
                  href={toLocalizedPath(link.href, locale)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:border-brand hover:bg-brand"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <OfferForm />
        </div>
      </section>

      <section className="border-y border-border-soft bg-surface-alt/40 px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {content.products.map((item, index) => {
            const Icon = [Sprout, Leaf, FlaskConical][index] ?? Sprout;
            return (
              <article key={item.title} className="rounded-2xl border border-border-soft bg-surface p-6">
                <Icon className="mb-5 h-8 w-8 text-brand" />
                <h2 className="mb-3 text-xl font-black tracking-tight text-foreground">{item.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand">{content.trustTitle}</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
              {content.detailTitle}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {content.detailText}
            </p>
            <Link href={productHref} className="inline-flex items-center gap-2 text-sm font-black text-brand hover:underline">
              {content.links[0].label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.trust.map((item, index) => {
              const Icon = [ShieldCheck, PackageCheck, Truck, CheckCircle2][index] ?? CheckCircle2;
              return (
                <div key={item} className="rounded-2xl border border-border-soft bg-surface p-5">
                  <Icon className="mb-4 h-6 w-6 text-brand" />
                  <p className="text-sm font-semibold leading-7 text-foreground/82">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border-soft px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-black tracking-tight text-foreground">{content.processTitle}</h2>
            <ol className="space-y-4">
              {content.process.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-2xl border border-border-soft bg-surface p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm font-medium leading-7 text-foreground/80">{step}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="mb-6 text-3xl font-black tracking-tight text-foreground">{content.faqTitle}</h2>
            <div className="space-y-4">
              {content.faqs.map((faq) => (
                <article key={faq.q} className="rounded-2xl border border-border-soft bg-surface p-5">
                  <h3 className="mb-2 text-base font-black text-foreground">{faq.q}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{faq.a}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand">{content.linksTitle}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">{content.footerTitle}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {content.links.map((link) => (
              <Link
                key={link.href}
                href={toLocalizedPath(link.href, locale)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-navy transition hover:bg-brand hover:text-white"
              >
                {link.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
