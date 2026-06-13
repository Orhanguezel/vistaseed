import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/providers/theme-provider";
import { fetchSiteSettings, fetchAnalyticsConfig } from "@/lib/site-settings";
import { getPublicApiV1, getPublicSiteOrigin } from "@/lib/runtime-config";
import Analytics, { GoogleAdsTag, GtmNoscript, MetaPixel } from "@/components/seo/Analytics";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = getPublicSiteOrigin();
const API_V1 = getPublicApiV1();
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "vistaseeds";
const GOOGLE_SITE_VERIFICATION = "967f1x4pD5AKD7ZEFj9nISGfkQGAKsGKte_RbkZCzrM";

async function fetchGlobalSeo(locale: string) {
  try {
    const [seoRes, metaRes] = await Promise.all([
      fetch(`${API_V1}/site_settings/site_seo?locale=${encodeURIComponent(locale)}`, { next: { revalidate: 300 } }),
      fetch(`${API_V1}/site_settings/site_meta_default?locale=${encodeURIComponent(locale)}`, { next: { revalidate: 300 } }),
    ]);
    const seo = seoRes.ok ? ((await seoRes.json())?.value ?? null) : null;
    const meta = metaRes.ok ? ((await metaRes.json())?.value ?? null) : null;
    return { seo, meta };
  } catch {
    return { seo: null, meta: null };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  // Fetch branding and SEO in parallel
  const [branding, { seo, meta }] = await Promise.all([
    fetchSiteSettings(locale),
    fetchGlobalSeo(locale),
  ]);

  const siteName = branding.site_name || seo?.site_name || SITE_NAME;
  // Normalize DB templates: {{title}} → %s, {{SITE_NAME}} → actual site name
  const rawTemplate = seo?.title_template;
  const titleTemplate = rawTemplate
    ? rawTemplate.replace(/\{\{title\}\}/gi, "%s").replace(/\{\{SITE_NAME\}\}/gi, siteName)
    : (siteName ? `%s | ${siteName}` : "%s");
  const titleDefault = meta?.title || seo?.title_default || siteName;
  const description = meta?.description || seo?.description || branding.site_description || "";
  const keywords = meta?.keywords
    ? meta.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : [];
  const author = seo?.author || siteName;

  const ogImages = seo?.open_graph?.images?.length
    ? seo.open_graph.images.map((img: string) => img.startsWith("/") ? `${SITE_URL}${img}` : img)
    : branding.site_og_image
      ? [branding.site_og_image.startsWith("http") ? branding.site_og_image : `${SITE_URL}${branding.site_og_image}`]
      : [];

  const twitterCard = seo?.twitter?.card ?? "summary_large_image";
  const twitterSite = seo?.twitter?.site || undefined;

  return {
    title: { default: titleDefault, template: titleTemplate },
    description,
    ...(keywords.length > 0 && { keywords }),
    ...(author && { authors: [{ name: author }], publisher: author }),
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: branding.site_favicon || "/icon-512.png", type: "image/png" },
      ],
      shortcut: branding.site_favicon || "/favicon.ico",
      apple: branding.site_apple_touch || "/apple-touch-icon.png",
    },
    openGraph: {
      ...(siteName && { siteName }),
      type: "website",
      locale,
      url: SITE_URL,
      ...(ogImages.length > 0 && { images: ogImages }),
    },
    twitter: {
      card: twitterCard as "summary_large_image",
      ...(twitterSite && { site: twitterSite }),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const [settings, analytics] = await Promise.all([
    fetchSiteSettings(locale),
    fetchAnalyticsConfig(),
  ]);

  const brandSlug = (process.env.NEXT_PUBLIC_SITE_BRAND || SITE_NAME).trim().toLowerCase();

  return (
    <html
      lang={locale}
      data-brand={brandSlug}
      suppressHydrationWarning
      className={`${dmSans.variable} font-sans`}
      style={{ 
        // @ts-ignore
        "--font-size-base": settings.theme_font_size || "16px",
        "--font-size-scale": settings.theme_font_scale || 1
      }}
    >
      <head>
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
        <Analytics ga4Id={analytics.ga4Id} gtmId={analytics.gtmId} />
        {analytics.metaPixelId ? <MetaPixel pixelId={analytics.metaPixelId} /> : null}
        {analytics.adsTagId ? (
          <GoogleAdsTag
            awId={analytics.adsTagId}
            conversions={analytics.adsConversionQuote ? { quote: analytics.adsConversionQuote } : {}}
          />
        ) : null}
      </head>
      <body suppressHydrationWarning>
        {analytics.gtmId && <GtmNoscript gtmId={analytics.gtmId} />}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
