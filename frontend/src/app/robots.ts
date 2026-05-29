import type { MetadataRoute } from "next";
import { getPublicSiteOrigin } from "@/lib/runtime-config";

const SITE_URL = getPublicSiteOrigin();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/*?_rsc="],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: ["Bytespider", "CCBot"],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
