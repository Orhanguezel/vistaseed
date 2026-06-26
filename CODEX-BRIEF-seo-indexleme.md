# CODEX BRIEF — VistaSeeds SEO / İndexleme Düzeltmeleri

> Kaynak analiz: Search Console canlı (2026-06-26). `sc-domain:vistaseeds.com.tr`.
> Sorun: Türkçe site sağlıklı indexli (44 URL) ama **de/en sayfalar indexlenmiyor** ve sitemap kirli.
> Bu brief SADECE site-tarafı (frontend) düzeltmelerdir. Ads/GA4 ekosistem panelinden ayrıca halledildi.

## GSC bulguları (özet)
Derin tarama (2026-06-26, 71 URL): **14 indexlenmeyen**, 3 grup:
- 🟠 **noindex ile hariç (11):** `/de/blog/*` + `/en/blog/*` çevrilmemiş blog **VE** `/de/urunler/*` Almanca **ürün detay** sayfaları (birlik-f1, prestij-f1, kizgin-f1, lucky-f1 …). → noindex sadece blog'da değil, Almanca ürün detaylarında da.
- 🟠 **URL unknown to Google (2):** ⚠️ **`/tr/siparis-ver`** (Türkçe sipariş/dönüşüm sayfası — Google hiç keşfetmemiş!) + `/de/siparis-ver`. Bkz FIX 4.
- 🔴 **Soft 404 (1):** `/de/urunler` (Almanca ürün listesi boş render).
- Sitemap: ~75 URL submit, **2 uyarı**, çoğu submit-edilip-indexlenmiyor (noindex de/en).
- Arama görünürlüğü çok düşük (28g: 99 gösterim, 10 tık; neredeyse tamamı markasal "vista seeds").

---

## FIX 1 — Sitemap: sadece indexlenebilir locale varyantlarını yaz (YÜKSEK)
**Dosya:** `frontend/src/app/sitemap.ts`

Şu an `blogPages` ve `productPages` her ikisi de `flatMap((p) => appLocales.map(...))` ile **tüm diller** için URL üretiyor. Blog de/en noindex olduğundan, sitemap "indexle" derken sayfa "indexleme" diyor → 2 uyarı + "submitted, not indexed".

- **Blog:** Blog içeriği yalnız primary locale (tr) çevrildiği için blog URL'lerini **SADECE `appLocales[0]` (tr)** için yaz. de/en blog satırlarını sitemap'ten çıkar. (hreflang alternates da sadece mevcut/indexlenebilir dilleri listelesin — çevirisi olmayan dili alternate olarak verme.)
- **Ürünler:** FIX 2 ile /[locale]/urunler tüm dillerde içerik gösterecekse ürün URL'leri çok-dilli kalabilir. FIX 2 yapılmadan ürün detay de/en de ince/soft-404 riskliyse, ürünleri de geçici olarak tr-only yaz. (Tercih: FIX 2 + çok-dilli ürün.)
- Statik sayfalar (UI çevirili) çok-dilli kalsın — onlar sorun değil.

**Kabul:** `https://www.vistaseeds.com.tr/sitemap.xml` içinde noindex/soft-404 URL bulunmamalı; GSC sitemap uyarısı 0'a inmeli.

## FIX 2 — `/[locale]/urunler` Soft 404 (YÜKSEK)
**Dosya:** `frontend/src/app/[locale]/(public)/urunler/page.tsx` (`getProducts`, `getCategories`)

`getProducts(locale)` `?is_active=true&locale=de` çağrısı **boş dizi** dönüyor (Almanca çeviri yok) → sayfa 0 ürünle render → Soft 404. Ürünler dilden bağımsız var; sadece çeviri eksik.

- **Locale fallback ekle:** locale için ürün/kategori boş dönerse `appLocales[0]` (tr) verisine düş. Böylece /de/urunler ve /en/urunler her zaman ürünleri gösterir (UI dili çevirili, ürün adları gerekirse tr fallback).
- Aynı fallback'i ürün **detay** sayfasına (`/urunler/[slug]`) ve kategori fetch'ine de uygula (de/en ürün detay soft-404/ince olmasın).
- Alternatif (tercih edilmez): de/en ürün sayfalarını noindex'leyip sitemap'ten çıkar — ama ürün sayfaları indexlenmeye değer; fallback daha doğru.

**Kabul:** `/de/urunler` ve `/en/urunler` 200 + ürün listesi dolu; GSC URL Inspection'da "Soft 404" gitmeli, "Submitted and indexed" olmalı.

## FIX 3 — de/en içerik stratejisi kararı (SAHİP KARARI)
de/en blog **VE Almanca ürün detay** (`/de/urunler/<slug>`) sayfaları için (derin tarama: 11 noindex'in çoğu ürün detay):
- **Uluslararası SEO hedefi VARSA:** içerikleri (blog + ürün açıklamaları) çevir + noindex kaldır → de/en de indexlensin (sitemap'e geri ekle, hreflang ekle).
- **Hedef YOKSA:** noindex KALSIN, sadece sitemap'ten çıkar (FIX 1). Ek iş yok.
> ⚠️ Codex bunu kendisi karara bağlamasın; sahip "de/en SEO istiyor muyuz?" cevabına kadar FIX 1 + FIX 2 + FIX 4 yeterli.
> Not: FIX 2 (locale fallback) ürün LİSTE soft-404'ünü çözer; ürün DETAY de/en noindex'i bu FIX 3 kararına bağlı.

## FIX 4 — `/tr/siparis-ver` Google'a keşfettirilmiyor (YÜKSEK)
GSC: `/tr/siparis-ver` (+ `/de/siparis-ver`) **"URL is unknown to Google"** — yani **asıl sipariş/dönüşüm sayfası indexlenmemiş.** Reklamdan gelmeyen organik dönüşümü doğrudan vurur. Sayfa sitemap'te (`publicPages`'te `/siparis-ver` priority 0.8) ama Google keşfetmemiş → büyük olasılıkla **iç link eksik + sayfa yeni/zayıf sinyal**.

İş (`frontend`):
- [ ] `/tr/siparis-ver` sayfasının **noindex OLMADIĞINI** doğrula (`lib/seo.ts` / sayfa metadata → index:true).
- [ ] **İç link ver:** header/footer'da "Sipariş Ver" linki + ürün detay + ürün liste + ana sayfa CTA'larından `/siparis-ver`'e link (Google crawl edebilsin). Şu an muhtemelen sadece reklam landing'i olarak izole.
- [ ] Sitemap'te kaldığından emin ol (FIX 1 sonrası statik sayfalar çok-dilli kalıyor → tamam).
- [ ] (Deploy sonrası, Claude) GSC URL Inspection → "Request indexing" (manuel, API'de yok) + iç link sonrası yeniden tarama.

**Kabul:** `/tr/siparis-ver` GSC'de "Submitted and indexed"; en az 2-3 dahili linkten erişilebilir.

---

## Kapsam dışı / dokunma
- TR sayfaları indexli ve sağlıklı — bozma.
- Düşük gösterim (otorite/içerik) ayrı, uzun-vade SEO işi; bu brief'in konusu değil.
- robots.ts / canonical mantığı (`lib/seo.ts`) — noindex üretimi doğru çalışıyor; sadece sitemap'in noindex URL yazması yanlıştı (FIX 1).

## Doğrulama (teslim öncesi)
1. `bun run build` (frontend) temiz.
2. `/de/urunler`, `/en/urunler` → 200 + ürünler görünür.
3. Üretilen `sitemap.xml` içinde de/en blog URL'si YOK; noindex URL YOK.
4. `/tr/siparis-ver` noindex DEĞİL + header/footer/ürün sayfalarından iç link var.
5. (Deploy sonrası, Claude) GSC'de sitemap yeniden submit → uyarılar düşer; URL Inspection ile `/de/urunler` ve `/tr/siparis-ver` "indexed" doğrulanır.
