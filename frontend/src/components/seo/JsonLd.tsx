interface JsonLdProps {
  type:
    | "Organization"
    | "WebSite"
    | "LocalBusiness"
    | "Article"
    | "Product"
    | "BreadcrumbList"
    | "FAQPage";
  data: Record<string, unknown>;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
