import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCustomPageBySlug } from "@/lib/site-settings";
import { buildMetadata, getPageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { defaultLocale, isAppLocale, type AppLocale } from "@/i18n/routing";
import { ChevronRight, Calendar, Clock, Share2 } from "lucide-react";
import Link from "next/link";

interface CustomPageRouteProps {
  params: Promise<{ locale: string; slug: string }>;
}

function calculateReadingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({ params }: CustomPageRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const appLocale: AppLocale = isAppLocale(locale) ? locale : defaultLocale;
  const page = await fetchCustomPageBySlug(slug, locale);

  if (!page) {
    return getPageMetadata("notFound", { locale: appLocale });
  }

  return buildMetadata(null, {
    locale: appLocale,
    pathname: `/${slug}`,
    title: page.title,
    description: page.summary || undefined,
    openGraph: {
      title: page.title,
      description: page.summary || undefined,
      images: page.featured_image ? [page.featured_image] : undefined,
    },
  });
}

export default async function CustomPageRoute({ params }: CustomPageRouteProps) {
  const { locale, slug } = await params;
  const page = await fetchCustomPageBySlug(slug, locale);

  if (!page) {
    notFound();
  }

  let htmlContent = page.content || "";
  try {
    const parsed = JSON.parse(htmlContent);
    if (parsed && typeof parsed === "object" && parsed.html) {
      htmlContent = parsed.html;
    }
  } catch {
    // raw HTML
  }

  const readingTime = calculateReadingTime(htmlContent);
  const formattedDate = new Date(page.updated_at || page.created_at || Date.now()).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="surface-page min-h-screen pb-24">
      <JsonLd 
        type="Article" 
        data={{
          headline: page.title,
          description: page.summary,
          image: page.featured_image,
          datePublished: page.created_at,
          dateModified: page.updated_at
        }} 
      />

      {/* Breadroom & Hero section */}
      <div className="pt-28 pb-12 bg-surface-alt/40 border-b border-border-soft overflow-hidden relative">
        <div className="absolute top-0 right-0 h-64 w-64 bg-brand/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/2" />
        
        <div className="max-w-4xl mx-auto px-6 space-y-8 relative">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 transition-colors">
            <Link href="/" className="hover:text-brand transition-colors">Anasayfa</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-foreground truncate max-w-[200px]">{page.title}</span>
          </nav>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.05]">
              {page.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand" />
                {readingTime} Dakika Okuma
              </div>
            </div>

            {page.summary && (
              <p className="text-lg md:text-xl leading-relaxed text-foreground/70 max-w-2xl border-l-4 border-brand/20 pl-6">
                {page.summary}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {page.featured_image && (
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 shadow-2xl shadow-brand/10 group">
            <img 
              src={page.featured_image.startsWith("http") ? page.featured_image : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083") + page.featured_image} 
              alt={page.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        )}

        <div 
          className="prose prose-lg prose-invert max-w-none 
          text-foreground/80 leading-relaxed
          prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tighter
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-strong:text-foreground prose-strong:font-bold
          prose-a:text-brand hover:prose-a:text-brand transition-all
          prose-img:rounded-3xl prose-img:shadow-xl
          prose-blockquote:border-brand prose-blockquote:bg-surface-alt prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:font-medium
          prose-ul:list-disc prose-li:marker:text-brand"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
        
        <div className="mt-20 pt-10 border-t border-border-soft flex items-center justify-between">
           <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-brand transition-colors p-2 rounded-lg hover:bg-brand/5">
                <Share2 className="h-4 w-4" />
                Paylaş
             </button>
           </div>
           <Link href="/" className="text-sm font-bold text-brand hover:underline">
             Anasayfaya Dön
           </Link>
        </div>
      </div>
    </div>
  );
}
