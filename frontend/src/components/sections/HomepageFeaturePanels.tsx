interface HomepageFeaturePanelsProps {
  title?: string;
  subtitle?: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  items?: Array<{
    title: string;
    description?: string;
    image_url?: string;
    image_alt?: string;
  }>;
}

export default function HomepageFeaturePanels({
  title,
  subtitle,
  coverImageUrl,
  coverImageAlt,
  items,
}: HomepageFeaturePanelsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 bg-surface border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-10 items-start mb-12">
          <div className="space-y-6">
            {title ? <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">{title}</h2> : null}
            {subtitle ? <p className="text-lg leading-8 text-muted-foreground max-w-2xl">{subtitle}</p> : null}
          </div>

          {coverImageUrl ? (
            <div className="overflow-hidden rounded-[2rem] border border-border/60 shadow-2xl shadow-brand/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt={coverImageAlt || title || ""}
                className="w-full aspect-[16/9] object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-[2rem] border border-border/60 bg-white/80 dark:bg-white/5 shadow-xl shadow-brand/5"
            >
              {item.image_url ? (
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_url} alt={item.image_alt || item.title} className="w-full aspect-[4/3] object-cover" />
                </div>
              ) : null}
              <div className="p-6">
                <h3 className="text-xl font-black tracking-tight text-foreground">{item.title}</h3>
                {item.description ? <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
