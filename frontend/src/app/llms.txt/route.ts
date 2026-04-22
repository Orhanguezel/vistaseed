import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/site-settings";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "vistaseeds";

export const revalidate = 3600;

export async function GET() {
  let products: { name: string; slug: string; category_name?: string }[] = [];
  try {
    const res = await fetch(`${getApiUrl()}/api/v1/products?locale=tr&limit=100`);
    if (res.ok) {
      const data = await res.json();
      products = Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
    }
  } catch { /* non-critical */ }

  const lines = [
    `# ${SITE_NAME}`,
    `> ${SITE_NAME}, 1990'dan bu yana Turkiye'nin lider tohum ve fide ureticisidir. Sertifikali sebze tohumlari, hibrit cesitler ve tarimsal bilgi platformu sunar.`,
    "",
    `## Ana Sayfalar`,
    `- [Anasayfa](${SITE_URL}/tr)`,
    `- [Urun Katalogu](${SITE_URL}/tr/urunler): Tum tohum cesitleri`,
    `- [Bilgi Bankasi](${SITE_URL}/tr/bilgi-bankasi): Tarimsal rehberler`,
    `- [Ekim Rehberi](${SITE_URL}/tr/ekim-rehberi): Bolgesel ekim takvimi`,
    `- [Bayi Agi](${SITE_URL}/tr/bayi-agi): Turkiye geneli yetkili bayiler`,
    `- [SSS](${SITE_URL}/tr/sss): Sikca sorulan sorular`,
    `- [Blog](${SITE_URL}/tr/blog): Tarim haberleri ve makaleler`,
    `- [Hakkimizda](${SITE_URL}/tr/hakkimizda): Kurumsal bilgiler`,
    `- [Iletisim](${SITE_URL}/tr/iletisim): Iletisim formu ve adres`,
    "",
    `## Urun Katalogu`,
    ...products.map(p => `- [${p.name}](${SITE_URL}/tr/urunler/${p.slug})${p.category_name ? ` — ${p.category_name}` : ""}`),
    "",
    `## Dil Destegi`,
    `- Turkce: ${SITE_URL}/tr`,
    `- English: ${SITE_URL}/en`,
    `- Deutsch: ${SITE_URL}/de`,
    "",
    `## Ekosistem`,
    `- [Bereket Fide](https://www.bereketfide.com.tr): Kardes marka — fide uretimi`,
    "",
    `## Detayli Bilgi`,
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): Tam urun ve icerik detaylari`,
  ];

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
