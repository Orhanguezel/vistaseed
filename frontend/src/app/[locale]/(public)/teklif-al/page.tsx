import { getTranslations, setRequestLocale } from "next-intl/server";
import { OfferForm } from "@/modules/offers/offer-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Offers" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function OfferPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative py-12 px-6 overflow-hidden">
      {/* Dekoratif Arka Plan Elemanları */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 opacity-20 dark:opacity-10 blur-3xl">
        <div className="h-96 w-96 rounded-full bg-brand" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 opacity-15 dark:opacity-5 blur-3xl">
        <div className="h-72 w-72 rounded-full bg-emerald-500" />
      </div>

      <div className="max-w-7xl mx-auto">
        <OfferForm />
      </div>
    </main>
  );
}
