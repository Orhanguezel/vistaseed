import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo";
import { fetchAboutPageData } from "@/lib/site-settings";
import { resolveImageUrl } from "@/lib/utils";
import { fetchReferenceList } from "@/modules/reference/reference.service";
import { fetchLibraryList } from "@/modules/library/library.service";
import { ROUTES } from "@/config/routes";
import { toLocalizedPath } from "@/i18n/routing";
import ProductDiscoveryLinks, { type DiscoveryItem } from "@/components/sections/ProductDiscoveryLinks";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function resolveAsset(url?: string | null) {
  if (!url?.trim()) return null;
  return resolveImageUrl(url);
}

function iconForValue(icon?: string) {
  if (icon === "sprout") return "Ç";
  if (icon === "shield") return "G";
  if (icon === "users") return "Y";
  if (icon === "flask") return "A";
  return "V";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return getPageMetadata("about", {
    locale,
    pathname: "/hakkimizda",
    title: t("title"),
    description: t("pageDescription"),
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  const [about, references, knowledgeItems] = await Promise.all([
    fetchAboutPageData(locale),
    fetchReferenceList({ locale, limit: 4, sort: "display_order", orderDir: "asc", featured: true }),
    fetchLibraryList({ locale, limit: 2 }),
  ]);

  const heroImage = resolveAsset(about?.hero?.image_url);
  const featurePanels = about?.feature_panels ?? [];
  const values = about?.values ?? [];
  const stats = about?.stats ?? [];
  const timeline = about?.timeline ?? [];
  const activityItems = about?.activities?.items ?? [];
  const memberships = about?.memberships;
  const discoveryItems: DiscoveryItem[] = [
    {
      id: "rootstock",
      title: t("discovery.items.rootstock.title"),
      description: t("discovery.items.rootstock.description"),
      query: { type: "rootstock" },
    },
    {
      id: "greenhouse",
      title: t("discovery.items.greenhouse.title"),
      description: t("discovery.items.greenhouse.description"),
      query: { cultivation: "greenhouse" },
    },
    {
      id: "tswv",
      title: t("discovery.items.tswv.title"),
      description: t("discovery.items.tswv.description"),
      query: { tolerance: "tswv" },
    },
    {
      id: "kapia",
      title: t("discovery.items.kapia.title"),
      description: t("discovery.items.kapia.description"),
      query: { type: "kapia", taste: "sweet" },
    },
  ];

  return (
    <div className="surface-page min-h-screen">
      <section className="relative overflow-hidden border-b border-border/50 bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(186,140,77,0.14),transparent_42%),linear-gradient(180deg,rgba(10,15,10,0.05),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center relative z-10">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-brand mb-5">{t("eyebrow")}</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-foreground">
              {about?.hero?.title || t("title")}
            </h1>
            <p className="mt-8 text-lg md:text-xl leading-8 text-muted-foreground max-w-2xl">
              {about?.hero?.description || t("pageDescription")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={toLocalizedPath(ROUTES.static.references, locale)}
                className="rounded-full bg-brand px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-dark"
              >
                {t("referencesCta")}
              </Link>
              <Link
                href={toLocalizedPath(ROUTES.static.contact, locale)}
                className="rounded-full border border-border/70 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {t("contactCta")}
              </Link>
            </div>
          </div>

          <div className="relative">
            {heroImage ? (
              <div className="overflow-hidden rounded-[2rem] border border-border/60 shadow-2xl shadow-brand/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt={about?.hero?.image_alt || about?.hero?.title || t("title")}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-12">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-4">
              {about?.intro?.subtitle || t("introKicker")}
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground max-w-3xl">
              {about?.intro?.title || t("introTitle")}
            </h2>
            <p className="mt-8 text-lg leading-8 text-muted-foreground max-w-3xl">
              {about?.intro?.content}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-[2rem] border border-border/60 bg-white/80 dark:bg-white/5 p-8 shadow-xl shadow-brand/5">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("visionTitle")}</p>
              <h3 className="text-2xl font-black tracking-tight text-foreground mb-3">{about?.vision?.title || t("visionTitle")}</h3>
              <p className="text-muted-foreground leading-7">{about?.vision?.content}</p>
            </div>
            <div className="rounded-[2rem] border border-border/60 bg-navy-mid p-8 shadow-2xl shadow-black/10">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("missionTitle")}</p>
              <h3 className="text-2xl font-black tracking-tight text-white mb-3">{about?.mission?.title || t("missionTitle")}</h3>
              <p className="text-white/70 leading-7">{about?.mission?.content}</p>
            </div>
          </div>
        </div>
      </section>

      {stats.length > 0 ? (
        <section className="bg-brand py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((item) => (
              <div key={`${item.label}-${item.value}`} className="text-center">
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-white">{item.value}</div>
                <div className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-white/80">{item.label}</div>
                {item.description ? <div className="mt-2 text-sm text-white/70">{item.description}</div> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {featurePanels.length > 0 ? (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("featureKicker")}</p>
              <h2 className="text-4xl font-black tracking-tighter text-foreground">{t("featureTitle")}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {featurePanels.map((panel) => {
              const image = resolveAsset(panel.image_url);
              return (
                <div key={panel.title} className="overflow-hidden rounded-[2rem] border border-border/60 bg-white/80 dark:bg-white/5 shadow-xl shadow-brand/5">
                  {image ? (
                    <div className="relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt={panel.image_alt || panel.title} className="w-full aspect-[4/3] object-cover" />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <h3 className="text-xl font-black tracking-tight text-foreground">{panel.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{panel.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {values.length > 0 ? (
        <section className="border-y border-border/50 bg-surface-elevated/40">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-black tracking-tighter text-foreground mb-10">{t("valuesTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="rounded-[2rem] border border-border/60 bg-white/80 dark:bg-white/5 p-7">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center text-lg font-black mb-5">
                    {iconForValue(value.icon)}
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-foreground">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {memberships?.items && memberships.items.length > 0 ? (
        <section className="border-y border-border/50 bg-surface">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("membershipsKicker")}</p>
            <h2 className="text-3xl font-black tracking-tighter text-foreground mb-10">
              {memberships.title || t("membershipsTitle")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {memberships.items.map((item) => {
                const logo = resolveAsset(item.logo_url);
                const card = (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-border/60 bg-white/80 dark:bg-white/5 p-7 text-center transition-all hover:border-brand/40">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo}
                        alt={item.name}
                        className="h-14 w-auto max-w-30 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-2xl bg-brand/10 flex items-center justify-center">
                        <span className="text-brand font-black text-xl">✦</span>
                      </div>
                    )}
                    <h3 className="text-sm font-black tracking-tight text-foreground leading-snug">{item.name}</h3>
                    {item.description ? (
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    ) : null}
                  </div>
                );
                return item.website_url ? (
                  <a key={item.name} href={item.website_url} target="_blank" rel="noopener noreferrer">
                    {card}
                  </a>
                ) : (
                  <div key={item.name}>{card}</div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {(activityItems.length > 0 || references.length > 0) ? (
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-12">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("ecosystemKicker")}</p>
            <h2 className="text-4xl font-black tracking-tighter text-foreground mb-8">
              {about?.activities?.title || t("activitiesTitle")}
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {activityItems.map((item) => (
                <div key={item.title} className="rounded-[1.75rem] border border-border/60 p-6 bg-white/80 dark:bg-white/5">
                  <h3 className="text-lg font-black tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("referencesKicker")}</p>
            <h2 className="text-4xl font-black tracking-tighter text-foreground mb-8">{t("groupCompaniesTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {references.map((item) => {
                const image = resolveAsset(item.featured_image);
                return (
                  <Link
                    key={item.id}
                    href={toLocalizedPath(`${ROUTES.static.references}/${item.slug}`, locale)}
                    className="group overflow-hidden rounded-[1.75rem] border border-border/60 bg-white/80 dark:bg-white/5 transition-all hover:border-brand/40"
                  >
                    {image ? (
                      <div className="overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt={item.featured_image_alt || item.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    ) : null}
                    <div className="p-5">
                      <h3 className="text-lg font-black tracking-tight text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground line-clamp-3">
                        {item.summary || t("referenceFallback")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <ProductDiscoveryLinks
        locale={locale}
        eyebrow={t("discovery.eyebrow")}
        title={t("discovery.title")}
        subtitle={t("discovery.subtitle")}
        ctaLabel={t("discovery.cta")}
        items={discoveryItems}
      />

      {(timeline.length > 0 || knowledgeItems.length > 0) ? (
        <section className="border-t border-border/50 bg-surface-elevated/30">
          <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 xl:grid-cols-[1fr_0.9fr] gap-12">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("timelineKicker")}</p>
              <h2 className="text-4xl font-black tracking-tighter text-foreground mb-8">{t("timelineTitle")}</h2>
              <div className="space-y-5">
                {timeline.map((item) => (
                  <div key={`${item.year}-${item.title}`} className="grid grid-cols-[5rem_1fr] gap-5 rounded-[1.5rem] border border-border/60 bg-white/80 dark:bg-white/5 p-5">
                    <div className="text-brand text-sm font-black tracking-[0.2em] uppercase">{item.year}</div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-foreground">{item.title}</h3>
                      {item.description ? <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">{t("knowledgeKicker")}</p>
              <h2 className="text-4xl font-black tracking-tighter text-foreground mb-8">{t("knowledgeTitle")}</h2>
              <div className="space-y-5">
                {knowledgeItems.map((item) => (
                  <Link
                    key={item.id}
                    href={toLocalizedPath(item.type === "guide" ? `/ekim-rehberi/${item.slug}` : `/bilgi-bankasi/${item.slug}`, locale)}
                    className="block rounded-[1.5rem] border border-border/60 bg-white/80 dark:bg-white/5 p-6 hover:border-brand/40 transition-all"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand mb-3">
                      {item.type === "guide" ? t("guideBadge") : t("knowledgeBadge")}
                    </p>
                    <h3 className="text-xl font-black tracking-tight text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground line-clamp-3">
                      {item.summary || t("knowledgeFallback")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
