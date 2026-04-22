import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/site-settings";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "vistaseeds";

export const revalidate = 3600;

interface Product {
  name: string;
  slug: string;
  description?: string;
  category_name?: string;
  sku?: string;
  botanical_name?: string;
  seed_type?: string;
  tags?: string[];
}

interface Faq {
  question: string;
  answer: string;
}

export async function GET() {
  const [products, faqs] = await Promise.all([fetchProducts(), fetchFaqs()]);

  const lines = [
    `# ${SITE_NAME} — Detayli Platform Bilgisi`,
    "",
    `> ${SITE_NAME}, 1990 yilindan bu yana Turkiye'nin lider tohum ve fide ureticisidir. TUAB onayli, sertifikali sebze tohumlari, hibrit cesitler, anac tohumlari ve tarimsal bilgi platformu sunar. %95+ cimlendirme orani garantisi ile profesyonel ciftcilere ve hobi bahceciligine hizmet verir.`,
    "",
    `## Sirket Bilgileri`,
    `- Kurulus: 1990`,
    `- Sektör: Tohumculuk, Fide Uretimi, Tarim Teknolojileri`,
    `- Merkez: Antalya, Turkiye`,
    `- Grup Sirketleri: vistaseeds (Tohum), Vista Prestige, Bereket Fide, GES Sistemleri, Karasah Business Center`,
    `- AR-GE Merkezi: 2020'den beri aktif`,
    `- Ihracat: 2010'dan beri uluslararasi pazarlarda`,
    "",
    `## Urun Katalogu (${products.length} urun)`,
    "",
    ...products.flatMap(formatProduct),
    "",
    `## Sikca Sorulan Sorular (${faqs.length} soru)`,
    "",
    ...faqs.flatMap(formatFaq),
    "",
    `## Teknik Bilgi`,
    `- Tum tohumlar TUAB (Turkiye Tohumcular Birligi) onayli`,
    `- Sertifikali uretim standartlari`,
    `- Her partide laboratuvar cimlendirme testi`,
    `- Soguk zincir lojistik`,
    "",
    `## API ve Veri Paylasimi`,
    `- Urun katalogu: ${SITE_URL}/api/v1/products`,
    `- SSS: ${SITE_URL}/api/v1/support/faqs`,
    `- RSS Feed: ${SITE_URL}/api/v1/feed/rss`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
    `## Sayfa Linkleri`,
    `- Anasayfa: ${SITE_URL}/tr`,
    `- Urunler: ${SITE_URL}/tr/urunler`,
    `- Bilgi Bankasi: ${SITE_URL}/tr/bilgi-bankasi`,
    `- Ekim Rehberi: ${SITE_URL}/tr/ekim-rehberi`,
    `- Bayi Agi: ${SITE_URL}/tr/bayi-agi`,
    `- Blog: ${SITE_URL}/tr/blog`,
    `- Hakkimizda: ${SITE_URL}/tr/hakkimizda`,
    `- Iletisim: ${SITE_URL}/tr/iletisim`,
    `- SSS: ${SITE_URL}/tr/sss`,
    "",
    `## Anahtar Kelimeler`,
    `Tohumculuk, Hibrit Tohum, Sertifikali Tohum, Sebze Tohumu, Biber Tohumu, Domates Tohumu, Anac Tohumu, Fide, Sera Tarimi, Acik Tarla, Ekim Takvimi, Zirai Mucadele, TUAB, B2B Tarim, Tarim Teknolojileri, Turkiye Tohumculuk`,
  ];

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${getApiUrl()}/api/v1/products?locale=tr&limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
  } catch { return []; }
}

async function fetchFaqs(): Promise<Faq[]> {
  try {
    const res = await fetch(`${getApiUrl()}/api/v1/support/faqs?locale=tr&is_published=true&limit=50`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
  } catch { return []; }
}

function formatProduct(p: Product): string[] {
  const lines = [`### ${p.name}${p.sku ? ` (${p.sku})` : ""}`];
  if (p.category_name) lines.push(`- Kategori: ${p.category_name}`);
  if (p.botanical_name) lines.push(`- Botanik Ad: ${p.botanical_name}`);
  if (p.seed_type) lines.push(`- Tohum Tipi: ${p.seed_type}`);
  if (p.description) lines.push(`- ${p.description.slice(0, 300)}`);
  lines.push(`- Detay: ${SITE_URL}/tr/urunler/${p.slug}`);
  lines.push("");
  return lines;
}

function formatFaq(f: Faq): string[] {
  const answer = f.answer.replace(/<[^>]*>/g, "").slice(0, 200);
  return [`**S:** ${f.question}`, `**C:** ${answer}`, ""];
}
