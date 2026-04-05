import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { API } from "@/config/api-endpoints";
import { ROUTES } from "@/config/routes";
import { getPageMetadata } from "@/lib/seo";
import { toLocalizedPath } from "@/i18n/routing";
import type { BlogListResponse } from "@/modules/blog/blog.types";
import { fetchLibraryList } from "@/modules/library/library.service";
import { fetchReferenceHighlights } from "@/modules/ecosystem/ecosystem-content";
import EcosystemSpotlight from "@/components/sections/EcosystemSpotlight";
import ProductDiscoveryLinks, { type DiscoveryItem } from "@/components/sections/ProductDiscoveryLinks";

export const revalidate = 300;

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");

async function fetchBlogList(locale: string): Promise<BlogListResponse | null> {
  try {
    const params = new URLSearchParams({ locale, limit: "50", page: "1" });
    const res = await fetch(`${BASE_URL}${API.blog.list}?${params.toString()}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<BlogListResponse>;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const base = await getPageMetadata("blog", {
    locale,
    pathname: "/blog",
  });
  return {
    ...base,
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function BlogListPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const [result, ecosystemKnowledge, ecosystemReferences] = await Promise.all([
    fetchBlogList(locale),
    fetchLibraryList({ locale, limit: 2 }),
    fetchReferenceHighlights(locale, 2),
  ]);
  const posts = result?.data ?? [];
  const discoveryItems: DiscoveryItem[] = [
    {
      id: "greenhouse",
      title: t("discovery.items.greenhouse.title"),
      description: t("discovery.items.greenhouse.description"),
      query: { cultivation: "greenhouse" } as Record<string, string>,
    },
    {
      id: "tswv",
      title: t("discovery.items.tswv.title"),
      description: t("discovery.items.tswv.description"),
      query: { tolerance: "tswv" } as Record<string, string>,
    },
    {
      id: "breakfast",
      title: t("discovery.items.breakfast.title"),
      description: t("discovery.items.breakfast.description"),
      query: { type: "breakfast" } as Record<string, string>,
    },
    {
      id: "rootstock",
      title: t("discovery.items.rootstock.title"),
      description: t("discovery.items.rootstock.description"),
      query: { type: "rootstock" } as Record<string, string>,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <section className="pt-14">
        <EcosystemSpotlight
          locale={locale}
          title={t("ecosystemTitle")}
          subtitle={t("ecosystemDescription")}
          labels={{
            knowledgeEyebrow: t("ecosystemKnowledgeEyebrow"),
            referenceEyebrow: t("ecosystemReferenceEyebrow"),
            knowledgeCta: t("ecosystemKnowledgeCta"),
            referenceCta: t("ecosystemReferenceCta"),
          }}
          knowledgeItems={ecosystemKnowledge}
          referenceItems={ecosystemReferences}
        />
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">{t("listTitle")}</h1>
            <p className="text-muted-foreground max-w-2xl">{t("listDescription")}</p>
          </div>
          <a
            href={`${BASE_URL}${API.blog.rss}?locale=${encodeURIComponent(locale)}`}
            className="text-sm font-medium text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("rssHint")}
          </a>
        </div>

        <ProductDiscoveryLinks
          locale={locale}
          eyebrow={t("discovery.eyebrow")}
          title={t("discovery.title")}
          subtitle={t("discovery.subtitle")}
          ctaLabel={t("discovery.cta")}
          items={discoveryItems}
          compact
        />

        {posts.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <ul className="space-y-10">
            {posts.map((post) => (
              <li key={post.id} className="border-b border-border/30 pb-10 last:border-0">
                <article>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand mb-2">{post.category}</p>
                  <h2 className="text-2xl font-bold tracking-tight mb-3">
                    <Link
                      href={toLocalizedPath(`${ROUTES.static.blog}/${post.slug}`, locale)}
                      className="hover:text-brand transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>}
                  <Link
                    href={toLocalizedPath(`${ROUTES.static.blog}/${post.slug}`, locale)}
                    className="inline-flex text-sm font-semibold text-brand hover:underline"
                  >
                    {t("readMore")}
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
