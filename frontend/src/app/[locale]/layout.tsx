import { JsonLd } from "@agro/shared-ui/public/seo/JsonLd";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BackToTopWidgetClient from "@/components/widgets/BackToTopWidgetClient";
import FrostWarningWidgetClient from "@/components/widgets/FrostWarningWidgetClient";
import { ROUTES } from "@/config/routes";
import { appLocales, type AppLocale } from "@/i18n/routing";
import { fetchSiteSettings } from "@/lib/site-settings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

  const currentLocale = locale as AppLocale;
  const settings = await fetchSiteSettings(currentLocale);
  const tNav = await getTranslations({ locale: currentLocale, namespace: "Common.navigation" });
  const tFooter = await getTranslations({ locale: currentLocale, namespace: "Footer" });

  const sameAs = [
    settings.social_facebook,
    settings.social_instagram,
    settings.social_twitter,
    settings.social_linkedin,
    settings.social_youtube,
  ].filter(Boolean);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    ...(settings.site_name && { name: settings.site_name }),
    url: SITE_URL,
    ...(settings.site_logo && {
      logo: settings.site_logo.startsWith("http")
        ? settings.site_logo
        : `${SITE_URL}${settings.site_logo}`,
    }),
    ...(settings.contact_email && { email: settings.contact_email }),
    ...(settings.contact_phone && { telephone: settings.contact_phone }),
    ...(settings.contact_address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.contact_address,
        addressCountry: "TR",
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    ...(settings.site_name && { name: settings.site_name }),
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${currentLocale}/urunler?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <FrostWarningWidgetClient />
      <BackToTopWidgetClient />
      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
      <Header
        siteName={settings.site_name}
        siteSubtitle={settings.site_description}
        logoUrl={settings.site_logo}
        logoUrlDark={settings.site_logo_dark}
      />
      <main className="grow">{children}</main>
      <Footer
        siteName={settings.site_name}
        logoUrl={settings.site_logo}
        logoUrlDark={settings.site_logo_dark}
        locale={currentLocale}
        columns={[
          {
            title: tNav("corporate"),
            links: [
              { label: tNav("about"), href: ROUTES.static.about },
              { label: tFooter("rdCenter"), href: ROUTES.static.rd_center },
              { label: tFooter("sustainability"), href: ROUTES.static.sustainability },
              { label: tNav("hr"), href: ROUTES.static.hr },
            ],
          },
          {
            title: tNav("support"),
            links: [
              { label: tFooter("plantingGuide"), href: ROUTES.static.planting_guide },
              { label: tNav("faq"), href: ROUTES.static.faq },
              { label: tNav("dealerNetwork"), href: ROUTES.static.dealer_network },
              { label: tFooter("dealerLogin"), href: ROUTES.static.dealer_login },
            ],
          },
          {
            title: tNav("products"),
            links: [
              { label: tFooter("vegetableSeeds"), href: ROUTES.products.list },
              { label: tFooter("fieldSeeds"), href: ROUTES.products.list },
              { label: tFooter("allProducts"), href: ROUTES.products.list },
            ],
          },
          {
            title: tFooter("legal"),
            links: [
              { label: tNav("privacy"), href: ROUTES.static.privacy },
              { label: tNav("terms"), href: ROUTES.static.terms },
              { label: tNav("kvkk"), href: ROUTES.static.kvkk },
            ],
          },
        ]}
        helpTitle={tFooter("helpTitle")}
        helpDescription={
          <>
            <a href={`/${currentLocale}${ROUTES.static.faq}`} className="text-white/70 underline hover:text-white">
              {tFooter("faqLink")}
            </a>{" "}
            {tFooter("helpDescriptionMiddle")}{" "}
            <a href={`/${currentLocale}${ROUTES.static.contact}`} className="text-white/70 underline hover:text-white">
              {tFooter("contactLink")}
            </a>.
          </>
        }
        followTitle={tFooter("followTitle")}
        copyrightText={tFooter("copyright")}
        builtByText={tFooter("builtBy")}
        contactEmail={settings.contact_email}
        contactPhone={settings.contact_phone}
        socialFacebook={settings.social_facebook}
        socialInstagram={settings.social_instagram}
        socialTwitter={settings.social_twitter}
        socialLinkedin={settings.social_linkedin}
        socialYoutube={settings.social_youtube}
      />
    </div>
  );
}
