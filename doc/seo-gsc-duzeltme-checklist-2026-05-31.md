# VistaSeeds — GSC SEO Düzeltme Checklist (2026-05-31)

Kaynak: Google Search Console export'ları (`Coverage`, `Breadcrumbs`, `Merchant listings`, `Product snippets` — 2026-05-31).
Property: `https://www.vistaseeds.com.tr`

## Özet Durum

| Alan | Geçerli | Geçersiz / Sorun | Önem |
|------|---------|------------------|------|
| Dizine ekleme (Coverage) | 100 | **230 indexlenmedi** | 🔴 |
| Breadcrumbs | 10 | 3 geçersiz | 🟡 |
| Product snippets | 5 | 1 geçersiz | 🟡 |
| Merchant listings | düşük | shipping/return eksik | 🟢 |

---

## A. Coverage / Dizine Ekleme (EN KRİTİK)

230 sayfa indexlenmiyor. Sebepler GSC export'undan + koddan kök nedene bağlandı:

- [ ] **`noindex` ile hariç tutuldu — 98 sayfa** 🟢 **KASITLI — aksiyon yok**
  - Kök sebep (kod): `urunler/page.tsx` → filtre parametreli URL'lere (`?category=`, `?sort=` …) `robots:{ index:false }` veriyor. 3 locale × filtre kombinasyonları = ~98. Bu **doğru davranış**.
  - Filtre URL'leri sitemap'te değil (doğru). Aksiyon gerekmez; sadece teyit.

- [ ] **Yönlendirmeli sayfa (redirect) — 43 sayfa** 🟢 **BÜYÜK ÖLÇÜDE KASITLI**
  - Kök sebep (kod): `next.config` içindeki `redirects()` + `localizedPathRedirects` (40 adet en/de slug → tr-kanonik) + `RootPage` (`/` → `/tr`) + legacy redirect'ler (`/urun/:slug`, `/kategori/:slug`, `/login`, `/sepet`, `/checkout`, `/profile`…).
  - GSC redirect veren URL'i "indexlenmedi (redirect)" sayar — **normal**. Bunlar sitemap'te değil (doğru).
  - ⚠️ Alt madde D'deki redirect→404 istisnası hariç, aksiyon gerekmez.

- [ ] **Bulunamadı (404) — 42 sayfa** 🔴
  - Kök sebep adayları (koddan):
    1. **Redirect→404 (KESİN BUG):** `localizedPathRedirects`'te hedefi olmayan route'lar var →
       `/en/sustainability`,`/de/nachhaltigkeit` → **`/surdurulebilirlik` route YOK**
       `/en/r-and-d-center`,`/de/forschungszentrum` → **`/arge-merkezi` route YOK**
       (`[slug]` CMS catch-all karşılamıyorsa 404. CMS'te bu slug'lar var mı kontrol et; yoksa redirect'i sil veya `/hakkimizda`'ya yönlendir.)
    2. Pasife alınmış ürünler: sitemap sadece `is_active=true` listeliyor → pasif ürün eski linkten 404 (doğru cevap, normal).
    3. PaketJet kalıntısı eski route'lar (silindiyse 404 normaldir).
  - **Aksiyon:** Madde D'deki 4 redirect'i düzelt. Geri kalan 404'ler büyük olasılıkla doğru (silinmiş içerik).

- [ ] **Sunucu hatası (5xx) — 25 sayfa** 🔴 **(muhtemelen GEÇİCİ — kod bug'ı değil)**
  - Kod incelemesi: tüm fetch'ler savunmacı — `!res.ok` → `null/[]/defaults`, `catch` → fallback; detay sayfaları `notFound()` çağırıyor (404, 500 değil). `[locale]/layout` ve `app/layout` fetch'leri de try/catch + default'lu.
  - Yani sistematik 500 üreten bir kod yolu yok. 25 5xx büyük olasılıkla **crawl anında backend down / deploy / DB bağlantı kesintisi** kaynaklı geçici hatalar.
  - Tarih aralığı (≤2026-05-25) Cloudflare proxy'den (05-31) ÖNCE → proxy timeout'u tarihsel 5xx'in sebebi değil. Ama bundan sonra proxy 100sn timeout'una dikkat (yavaş SSR fetch → 524).
  - **Aksiyon:** Sunucu erişim/PM2 loglarında 5xx zaman damgalarına bak (deploy/restart penceresiyle örtüşüyor mu). Örtüşüyorsa kod değişikliği gerekmez → GSC'de "Doğrulamayı başlat" yeterli.

- [ ] **Keşfedildi / Tarandı – indexlenmedi — 18 sayfa** 🟡
  - İçerik zayıflığı / tarama bütçesi. İçerik zenginleştir + internal linking. Robots.txt'in proxy arkasında erişilebilir olduğunu teyit et.

- [ ] **Canonical / kopya — 3 sayfa** 🟢 — düşük öncelik; locale alternates doğru kuruluyor.

---

## B. Breadcrumbs (3 geçersiz) — ✅ KOD DÜZELTİLDİ

- [x] **Hata:** `"name" ya da "item.name" belirtilmelidir`.
- [x] **Kök sebep:** `buildBreadcrumbJsonLd` boş isimli item'ı (çevirisi gelmemiş key veya `product.category.name` boş) yine de schema'ya yazıyordu.
- [x] **Düzeltme:** `src/lib/schema-org.ts` → boş/whitespace isimli item'lar elendi, pozisyonlar yeniden numaralandı. Test eklendi.
- [ ] **Doğrulama:** Deploy sonrası GSC → Breadcrumbs → "Doğrulamayı başlat" + Rich Results Test ile 1 ürün sayfası kontrol.

---

## C. Product snippets (1 geçersiz) — ✅ KOD DÜZELTİLDİ

- [x] **Hata:** `"offers", "review" veya "aggregateRating" belirtilmelidir`.
- [x] **Kök sebep:** `buildProductJsonLd` hiç `offers` üretmiyordu; `aggregateRating` sadece yorumu olan ürüne ekleniyordu → yorumsuz ürün geçersiz.
- [x] **Düzeltme:** Her ürüne `offers` eklendi (fiyat varsa fiyatlı, yoksa `availability`+`url`'li teklif). `price`/`currency`/`inStock` product sayfasından geçiliyor. `NEXT_PUBLIC_DEFAULT_CURRENCY=TRY` eklendi.
- [x] **İş kararı NETLEŞTİ:** Ürünlerin herkese açık fiyatı YOK, sadece "teklif al" modeli → fiyatsız offer doğru çözüm. İleride yıldız (rich) isteniyorsa tek yol ürünlere **yorum (review)** toplamak.
- [ ] **Doğrulama:** Rich Results Test + GSC doğrulama.

---

## D. Merchant listings + Redirect→404

### D.1 Merchant listings (Google Shopping) — KAPSAM DIŞI
- Fiyat olmadığı için Google Shopping uygulanamaz. `shippingDetails` / `hasMerchantReturnPolicy` eklenmez. Aksiyon yok.

### D.2 Redirect → 404 (KESİN BUG)
- [ ] `next.config` `localizedPathRedirects` içinde hedefi olmayan 4 redirect:
  - `/en/sustainability`, `/de/nachhaltigkeit` → `/surdurulebilirlik` (route YOK)
  - `/en/r-and-d-center`, `/de/forschungszentrum` → `/arge-merkezi` (route YOK)
- **Karar gerek:** Bu sayfalar yapılacak mı?
  - Yapılacaksa → CMS custom page ekle (`[slug]` karşılar) veya route oluştur; redirect kalsın.
  - Yapılmayacaksa → bu 4 satırı `next.config`'ten sil (redirect→404 zincirini bitirir).

---

## E. Uygulama Sırası

1. **Deploy** (B + C kod düzeltmeleri) → frontend build & deploy.
2. GSC'den **örnek URL export'ları** al: 5xx, 404, redirect, noindex.
3. 5xx (en kritik) → origin/Cloudflare timeout + SSR fetch fallback kök sebep.
4. 404 → 301 redirect haritası.
5. redirect → sitemap URL'leri 200 mü teyit.
6. Tüm zengin sonuç raporlarında **"Doğrulamayı başlat"**.

## F. İlgili Dosyalar

- `frontend/src/lib/schema-org.ts` — JSON-LD üreticiler (düzeltildi)
- `frontend/src/lib/schema-org.test.ts` — testler (güncellendi)
- `frontend/src/app/[locale]/(public)/urunler/[slug]/page.tsx` — product schema caller (düzeltildi)
- `frontend/src/app/robots.ts`, `frontend/src/app/sitemap.ts` — tarama/sitemap
- `frontend/.env.example` — `NEXT_PUBLIC_DEFAULT_CURRENCY`
