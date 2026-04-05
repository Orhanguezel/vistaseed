import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { appLocales, type AppLocale } from '@/i18n/routing';

export function generateStaticParams() {
  return appLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!appLocales.includes(locale as AppLocale)) {
    notFound();
  }

  setRequestLocale(locale);
  return children;
}
