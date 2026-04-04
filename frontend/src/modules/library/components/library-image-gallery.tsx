import type { LibraryImage } from "@/modules/library/library.type";

function resolveUrl(url: string, baseUrl: string) {
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return url;
  return `${baseUrl}${url}`;
}

export function LibraryImageGallery({
  images,
  baseUrl,
  excludeUrls,
  title,
}: {
  images: LibraryImage[];
  baseUrl: string;
  excludeUrls: Set<string>;
  title: string;
}) {
  const rows = images.filter((img) => {
    const u = img.image_url ? resolveUrl(img.image_url, baseUrl) : "";
    return u && !excludeUrls.has(u);
  });

  if (rows.length === 0) return null;

  return (
    <section className="mt-12" aria-label={title}>
      <h2 className="text-xl font-black text-foreground mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rows.map((img) => {
          const src = resolveUrl(img.image_url, baseUrl);
          const alt = img.alt || img.title || title;
          return (
            <figure key={img.id} className="rounded-2xl overflow-hidden border border-border/40 bg-surface-alt">
              <img src={src} alt={alt} className="w-full h-auto object-cover max-h-[420px]" loading="lazy" />
              {img.title && (
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">{img.title}</figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
