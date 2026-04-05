import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme-provider";
import { defaultLocale } from "@/i18n/routing";
import { fetchSiteSettings, fetchAnalyticsConfig } from "@/lib/site-settings";
import Analytics, { GtmNoscript } from "@/components/seo/Analytics";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");
const API_V1 = `${API_URL}/api/v1`;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "VistaSeed";

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
  const locale = defaultLocale;
  // Fetch branding and SEO in parallel
  const [branding, { seo, meta }] = await Promise.all([
    fetchSiteSettings(locale),
    fetchGlobalSeo(locale),
  ]);

  const siteName = branding.site_name || seo?.site_name || SITE_NAME;
  const titleTemplate = seo?.title_template || (siteName ? `%s | ${siteName}` : "%s");
  const titleDefault = meta?.title || seo?.title_default || siteName;
  const description = meta?.description || seo?.description || branding.site_description || "";
  const keywords = meta?.keywords
    ? meta.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : [];
  const author = seo?.author || siteName;

  const ogImages = seo?.open_graph?.images?.length
    ? seo.open_graph.images.map((img: string) => img.startsWith("/") ? `${SITE_URL}${img}` : img)
    : branding.site_logo ? [branding.site_logo] : [];

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
        { url: branding.site_favicon || "/favicon.ico" },
        { url: branding.site_logo || "/assets/logo/logo.jpeg", type: "image/jpeg" },
      ],
      shortcut: branding.site_favicon || "/favicon.ico",
      apple: branding.site_apple_touch || branding.site_logo || "/assets/logo/logo.jpeg",
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
  const [settings, analytics] = await Promise.all([
    fetchSiteSettings(defaultLocale),
    fetchAnalyticsConfig(),
  ]);

  return (
    <html
      lang={defaultLocale}
      data-brand="vistaseed"
      suppressHydrationWarning
      className={`${dmSans.variable} font-sans`}
      style={{ 
        // @ts-ignore
        "--font-size-base": settings.theme_font_size || "16px",
        "--font-size-scale": settings.theme_font_scale || 1
      }}
    >
      <head>
        <Analytics ga4Id={analytics.ga4Id} gtmId={analytics.gtmId} />
      </head>
      <body suppressHydrationWarning>
        {analytics.gtmId && <GtmNoscript gtmId={analytics.gtmId} />}
        <NextIntlClientProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
