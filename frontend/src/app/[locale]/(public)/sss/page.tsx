import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo";
import { API } from "@/config/api-endpoints";

export const revalidate = 300;

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata("faq", {
    locale,
    pathname: "/sss",
  });
}

const BASE_URL = (
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8083"
).replace(/\/$/, "");

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
}

async function getFaqs(locale: string): Promise<FaqItem[]> {
  try {
    const res = await fetch(`${BASE_URL}${API.support.faqs}?locale=${encodeURIComponent(locale)}&is_published=true`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

export default async function FaqPage({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });
  const faqs = await getFaqs(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground font-medium">
            {t("description")}
          </p>
        </div>

        {faqs.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">{t("empty")}</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group bg-surface rounded-2xl border border-border/50 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-foreground hover:text-brand transition-colors">
                  <span>{faq.question}</span>
                  <span className="ml-4 text-xl text-muted-foreground group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
