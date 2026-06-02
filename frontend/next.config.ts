import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const localizedPathRedirects = [
  ["/en/products/:path*", "/en/urunler/:path*"],
  ["/de/produkte/:path*", "/de/urunler/:path*"],
  ["/en/about", "/en/hakkimizda"],
  ["/de/uber-uns", "/de/hakkimizda"],
  ["/en/careers", "/en/insan-kaynaklari"],
  ["/de/karriere", "/de/insan-kaynaklari"],
  ["/en/faq", "/en/sss"],
  ["/de/faq", "/de/sss"],
  ["/en/contact", "/en/iletisim"],
  ["/de/kontakt", "/de/iletisim"],
  ["/en/support", "/en/destek"],
  ["/de/support", "/de/destek"],
  ["/en/privacy-policy", "/en/gizlilik-politikasi"],
  ["/de/datenschutz", "/de/gizlilik-politikasi"],
  ["/en/return-policy", "/en/iade-politikasi"],
  ["/de/ruckgaberecht", "/de/iade-politikasi"],
  ["/en/terms-of-use", "/en/kullanim-kosullari"],
  ["/de/nutzungsbedingungen", "/de/kullanim-kosullari"],
  ["/en/dealer-login", "/en/bayi-girisi"],
  ["/de/handler-login", "/de/bayi-girisi"],
  ["/en/member-login", "/en/uye-girisi"],
  ["/de/mitglied-login", "/de/uye-girisi"],
  ["/en/knowledge-base/:path*", "/en/bilgi-bankasi/:path*"],
  ["/de/wissensdatenbank/:path*", "/de/bilgi-bankasi/:path*"],
  ["/en/planting-guide/:path*", "/en/ekim-rehberi/:path*"],
  ["/de/anbauleitfaden/:path*", "/de/ekim-rehberi/:path*"],
  ["/en/r-and-d-center", "/en/arge-merkezi"],
  ["/de/forschungszentrum", "/de/arge-merkezi"],
  ["/en/sustainability", "/en/surdurulebilirlik"],
  ["/de/nachhaltigkeit", "/de/surdurulebilirlik"],
  ["/en/references/:path*", "/en/referanslar/:path*"],
  ["/de/referenzen/:path*", "/de/referanslar/:path*"],
  ["/en/compare", "/en/karsilastirma"],
  ["/de/vergleich", "/de/karsilastirma"],
  ["/en/dealer-network", "/en/bayi-agi"],
  ["/de/handlernetz", "/de/bayi-agi"],
  ["/en/bulk-sales", "/en/toplu-satis"],
  ["/de/grossverkauf", "/de/toplu-satis"],
] as const;

function apiRemotePattern() {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) return [];

  try {
    const parsed = new URL(raw);
    return [
      {
        protocol: parsed.protocol.replace(":", "") as "http" | "https",
        hostname: parsed.hostname,
        port: parsed.port || undefined,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  transpilePackages: ["@agro/shared-ui", "@agro/ecosystem-weather-widget"],
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.vistaseeds.com.tr" },
      ...apiRemotePattern(),
    ],
  },
  serverExternalPackages: [],
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  async redirects() {
    return [
      ...localizedPathRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      {
        source: "/teklif",
        destination: "/teklif-al",
        permanent: true,
      },
      {
        source: "/tr/teklif",
        destination: "/teklif-al",
        permanent: true,
      },
      {
        source: "/en/teklif",
        destination: "/en/teklif-al",
        permanent: true,
      },
      {
        source: "/de/teklif",
        destination: "/de/teklif-al",
        permanent: true,
      },

      // Eski WordPress sitemap URL'leri (Google Search Console 5xx kaynağı)
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-0.xml", destination: "/sitemap.xml", permanent: true },

      // Eski kategori URL pattern'leri → query string (Google 404 kaynağı)
      {
        source: "/:locale(tr|en|de)/urunler/kategori/:slug",
        destination: "/:locale/urunler?category=:slug",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/kategori/:slug",
        destination: "/:locale/urunler?category=:slug",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/blog/kategori/:slug",
        destination: "/:locale/blog?category=:slug",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/iletisim/bayilik",
        destination: "/:locale/bayi-agi",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/urun/:slug",
        destination: "/:locale/urunler/:slug",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/grup-sirketlerimiz/:slug",
        destination: "/:locale/hakkimizda",
        permanent: true,
      },

      // Soft 404 — e-ticaret/auth kalıntıları (Vista Seeds katalog/B2B, bu sayfalar yok)
      {
        source: "/:locale(tr|en|de)/login",
        destination: "/:locale/bayi-girisi",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/giris",
        destination: "/:locale/bayi-girisi",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/register",
        destination: "/:locale/bayi-girisi",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/profile",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/sepet",
        destination: "/:locale/teklif-al",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/checkout",
        destination: "/:locale/teklif-al",
        permanent: true,
      },
      {
        source: "/:locale(tr|en|de)/siparis",
        destination: "/:locale/teklif-al",
        permanent: true,
      },

      // WordPress prob'ları
      { source: "/wp-admin", destination: "/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: true },
      { source: "/wp-login.php", destination: "/", permanent: true },

      // `localePrefix: "as-needed"` geçişi — eski /tr/* URL'leri öneksiz forma 301'le.
      // Bu kural en SONDA durur; üstteki özel /tr/... kuralları (teklif, legacy kategori)
      // önce eşleşir, ardından kalan tüm /tr/* yolları buradan temizlenir.
      { source: "/tr", destination: "/", permanent: true },
      { source: "/tr/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/uploads/offers/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/uploads/support/library/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, noarchive" },
        ],
      },
    ];
  },
  async rewrites() {
    const apiUrl = (
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8083"
    ).replace(/\/$/, "");
    const weatherWidgetApiUrl = (
      process.env.WEATHER_WIDGET_API_URL ||
      process.env.NEXT_PUBLIC_WEATHER_WIDGET_API_URL ||
      "https://tarimiklim.com/api/v1"
    ).replace(/\/$/, "");
    return [
      {
        source: "/weather-widget-api/:path*",
        destination: `${weatherWidgetApiUrl}/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiUrl}/uploads/:path*`,
      }
    ];
  },
};

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/i18n/request.ts",
});

export default withNextIntl(nextConfig);
