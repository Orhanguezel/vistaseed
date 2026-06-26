# CODEX BRIEF — VistaSeeds "Biber Tohumu" SEO İçerik + Schema (Strateji C)

> ✅ **DURUM 2026-06-26: BU BRIEF CLAUDE TARAFINDAN UYGULANDI. Codex bu dosyalara DOKUNMASIN (çakışma).**
> Uygulanan: FIX C1 (route `frontend/.../urunler/kategori/[slug]/page.tsx`), FIX C2 (ItemList+Breadcrumb JSON-LD), FIX C3 (içerik `backend/.../seed/sql/194_category_seo_biber.sql` — customPages, ortak şema değişmedi), FIX C4 (ürün listesi→kategori iç link + landing→/siparis-ver CTA), sitemap kategori landing'leri. tsc+build temiz.
> Kalan (kod değil): lokal `db:seed:*:fresh` ile landing'i gerçek ürünle doğrula + deploy + GSC submit. FIX C5 meta zaten seed'de.
> _(Aşağıdaki orijinal plan referans olarak bırakıldı.)_


> Kaynak: `VISTASEEDS-BIBER-TOHUMU-1-SIRA-STRATEJI-2026-06-25.md` C maddesi.
> İş modeli: **TEKLİF/B2B (fiyatsız)** — sahip kararı 2026-06-26. Perakende fiyat/sepet YOK.
> Schema'da fiyat değil **availability + marka** kullanılır (`schema-org.ts` zaten bunu destekliyor).
> Bu brief SADECE site-tarafı (frontend + seed içerik). Ads/GA4 ekosistem panelinde.

## Mevcut durum (doğrulandı)
- Kategori **"Biber Çeşitleri"** mevcut: i18n tablo, slug `biber-cesitleri` (tr/en/de satırları var; `meta_title`/`meta_description`/`description` alanları dolu).
- `/urunler` = query-filtreli liste; **aktif filtrede `robots: index:false`** (kategori filtresi noindex). → kategori sayfaları organik sıralanamıyor.
- `/urunler/[slug]` = ürün detay; **zaten** `buildProductJsonLd` + `buildBreadcrumbJsonLd` + `buildFaqPageJsonLd` üretiyor. Ürün-seviyesi schema TAMAM.
- **Eksik:** indexlenebilir, içerik-zengin kategori landing route'u + ItemList schema YOK.

---

## FIX C1 — Dedike kategori landing route'u (indexlenebilir) (YÜKSEK)
**Yeni route:** `frontend/src/app/[locale]/(public)/urunler/kategori/[slug]/page.tsx`

`/urunler?category=` noindex kalsın (filtre sayfası); SEO trafiği için ayrı, **indexlenebilir** kategori sayfası açılır.

- Path: `/urunler/kategori/biber-cesitleri` (pretty kanonik). Kategori slug i18n'den gelir — **hard-code slug YASAK**.
- `generateStaticParams`: aktif kategorilerin slug'larından üretilir (tüm kategoriler için çalışır, sadece biber değil).
- `generateMetadata`: kategori i18n `meta_title`/`meta_description` kullan; H1 = kategori adı. Locale fallback `defaultLocale` (tr) — boş gelirse tr (FIX 2 pattern, `getProducts` ile aynı).
- `robots: { index: true, follow: true }` (filtreli `/urunler` sayfasının aksine).
- Canonical = `/<locale>/urunler/kategori/<slug>`; hreflang alternates sadece içeriği olan diller.
- Sayfa içeriği:
  1. H1 + kategori açıklaması (i18n `description`)
  2. **800+ kelime özgün içerik bloğu** (FIX C3 — seed'den, hard-code değil)
  3. Bu kategorideki ürün kartları (mevcut `ProductFilters`/kart bileşeni yeniden kullan; `category_id` ile fetch)
  4. SSS bloğu (kategori-seviyesi FAQ, FIX C3)
  5. İç linkler (FIX C4)

**Kabul:** `/tr/urunler/kategori/biber-cesitleri` → 200, indexlenebilir, ürünler dolu, H1+meta kategori-spesifik.

## FIX C2 — Kategori landing schema: ItemList + Breadcrumb + FAQ (YÜKSEK)
**Dosya:** yeni route + mevcut `lib/schema-org.ts` (yeni fonksiyon GEREKMEZ, hepsi var)

- `buildItemListJsonLd(products.map(...))` → kategorideki ürünler (ad + `/urunler/[slug]` url + görsel). `schema-org.ts:67` hazır.
- `buildBreadcrumbJsonLd([{Ana Sayfa}, {Ürünler}, {Biber Çeşitleri}])` → `schema-org.ts:52` hazır.
- `buildFaqPageJsonLd(categoryFaqs)` → kategori SSS varsa. `schema-org.ts:79` hazır.
- `<JsonLd type="ItemList" .../>`, `type="BreadcrumbList"`, `type="FAQPage"` — `components/seo/JsonLd` mevcut.
- **Fiyat eklenmez** (teklif modeli). ItemList sadece ad/url/görsel; ürün detaydaki Product schema `availability` + `brand` taşır (zaten öyle).

**Kabul:** Rich Results Test → ItemList + BreadcrumbList + (varsa) FAQPage geçerli, hata yok. Hiçbir yerde fiyatsız `Offer` yok.

## FIX C3 — 800+ kelime özgün içerik + kategori SSS (seed-driven) (ORTA)
> ✅ **İçerik hazır → `VISTASEEDS-BIBER-KATEGORI-ICERIK-2026-06-26.md`** (meta + ~850 kelime long_content + 5 kategori SSS, gerçek çeşit verisiyle). Codex bu metni seed'e taşır; yeniden yazmaz.

**Dosya:** `backend/src/db/seed/sql/` — kategori i18n içerik alanları (CREATE TABLE'a kolon ekle, **ALTER YASAK**)

İçerik **hard-code edilmez**, seed/DB'den gelir (CLAUDE.md kuralı). Kategori i18n tablosuna uzun içerik + SSS için alan:
- `long_content` (MEDIUMTEXT / markdown) — 800+ kelime: biber çeşitleri (kapya, çarliston, sivri, dolmalık, acı), F1/hibrit farkı, ekim zamanı, bölge/sezon, verim, hastalık toleransı.
- Kategori SSS: ayrı `category_faqs` tablosu veya i18n JSON alanı (örn. "biber tohumu nasıl ekilir", "F1 vs ata tohum", "ne zaman ekilir").
- Schema değişikliği: ilgili `0XX_*_schema.sql` CREATE TABLE'a kolon ekle → `bun run build && bun run db:seed:*:fresh`. **ALTER kullanma.**
- İçerik metni TR yazılır; en/de için ayrı i18n satır (boşsa tr fallback render).

**Kabul:** `/tr/urunler/kategori/biber-cesitleri` ≥ 800 kelime özgün içerik render eder; metin seed'den gelir, JSX'te hard-code string yok.

## FIX C4 — İç linkleme (ORTA)
- Anasayfa → "Biber Çeşitleri" kategori landing linki (öne çıkan kategori bloğu).
- Blog yazıları (biber ekim/çeşit) → kategori landing + ilgili ürün detay linkleri.
- `library/ekim-rehberi` (mevcut seed `125_*`) → biber kategori landing.
- Ürün detay (`/urunler/[slug]`) breadcrumb'ı → kategori landing'e gitsin (şu an `/urunler`'e gidiyorsa kategori landing'e yönlendir).
- Kategori landing → çeşit/ürün detaylarına (zaten ürün kartları).

**Kabul:** Biber kategori landing'e en az 3 dahili kaynaktan (anasayfa, blog, rehber) link girer.

## FIX C5 — Meta/H1 standardı (DÜŞÜK)
- Title: `Biber Tohumu Çeşitleri | F1 Hibrit | Vista Seeds` (kategori i18n `meta_title` güncelle — seed).
- H1: `Biber Tohumu Çeşitleri` (kategori adı).
- Description: çeşit + F1/hibrit + sezon anahtarları (kategori i18n `meta_description`).

---

## Kapsam dışı / dokunma
- Fiyat/sepet/checkout AÇMA — teklif modeli korunuyor (ayrı Retail Faz 1 brief'i flag-KAPALI).
- `/urunler?category=` filtre sayfasının noindex'ini DEĞİŞTİRME (landing ayrı route).
- Ürün detay Product schema'sı doğru çalışıyor — bozma.

## Doğrulama (teslim öncesi)
1. `bun run build` (frontend) + `bun x tsc --noEmit` temiz.
2. `/tr/urunler/kategori/biber-cesitleri` → 200, indexlenebilir, ≥800 kelime, ürünler dolu.
3. Rich Results Test: ItemList + BreadcrumbList geçerli; fiyatsız Offer YOK.
4. `generateStaticParams` tüm aktif kategoriler için çalışıyor (genel, biber-spesifik değil).
5. (Deploy sonrası, Claude) GSC URL Inspection + sitemap'e kategori landing ekle.
