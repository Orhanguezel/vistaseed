interface CustomPageViewProps {
  title: string;
  summary?: string | null;
  html?: string | null;
  eyebrow?: string;
  emptyHtml?: string;
}

export function CustomPageView({ title, summary, html, eyebrow = "Corporate", emptyHtml = "<p>Content not found.</p>" }: CustomPageViewProps) {
  // Handle JSON content if provided as {"html": "..."}
  let displayHtml = html ?? emptyHtml;
  if (html && html.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(html);
      if (parsed && typeof parsed.html === 'string') {
        displayHtml = parsed.html;
      }
    } catch (e) {
      console.error("Failed to parse CustomPage content JSON:", e);
    }
  }

  return (
    <div className="bg-background text-foreground">
      <section className="border-b border-border-soft bg-bg-alt">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight">{title}</h1>
          {summary ? <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{summary}</p> : null}
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-12 pb-24">
        <article
          className="prose prose-neutral max-w-none prose-headings:font-extrabold prose-a:text-brand"
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
      </section>
    </div>
  );
}
