import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { API } from "@/config/api-endpoints";
import { ROUTES } from "@/config/routes";
import { buildMetadata } from "@/lib/seo";
import { toLocalizedPath } from "@/i18n/routing";
import type { BlogPostDetail } from "@/modules/blog/blog.types";

export const revalidate = 300;

const BASE_URL = (
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8083"
).replace(/\/$/, "");

async function fetchBlogPost(slug: string, locale: string): Promise<BlogPostDetail | null> {
  try {
    const params = new URLSearchParams({ locale });
    const res = await fetch(`${BASE_URL}${API.blog.detail(slug)}?${params.toString()}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<BlogPostDetail>;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await fetchBlogPost(slug, locale);
  if (!post) {
    return { title: "Blog" };
  }
  const title = post.meta_title?.trim() || post.title;
  const description = post.meta_description?.trim() || post.excerpt || undefined;
  return buildMetadata(null, {
    locale,
    pathname: `/blog/${slug}`,
    title,
    description,
    openGraph: { title, description },
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const post = await fetchBlogPost(slug, locale);
  if (!post) notFound();

  const pub = post.published_at ? new Date(post.published_at).toLocaleDateString(locale) : null;

  return (
    <div className="bg-background min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href={toLocalizedPath(ROUTES.static.blog, locale)}
          className="text-sm font-medium text-brand hover:underline mb-8 inline-block"
        >
          {t("backToBlog")}
        </Link>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand mb-2">{post.category}</p>
        <h1 className="text-4xl font-black tracking-tighter text-foreground mb-4">{post.title}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-10">
          {post.author && <span>{post.author}</span>}
          {pub && <time dateTime={post.published_at ?? undefined}>{pub}</time>}
        </div>
        {post.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image_url} alt="" className="w-full rounded-2xl mb-10 object-cover max-h-72" />
        )}
        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
