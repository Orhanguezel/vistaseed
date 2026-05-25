# Search Console + Admin Panel Fix Checklist — vistaseeds.com.tr

Tarih: 2026-05-25
Kaynak: `searchconsole/` GSC raporlari (Coverage, Breadcrumbs, Merchant listings, Product snippets)
Branch: `feat/vistaseed-weather-widget-proxy`

---

## Tespit Edilen Sorunlar (Ozet)

### Search Console (GSC)
- **18 sayfa 5xx**: `/sitemap_index.xml` ve `/sitemap-0.xml` (eski WordPress sitemap URL'leri Next.js'ten 500 doneuyor)
- **27 sayfa 404**: `/{lc}/urunler/kategori/:slug`, `/{lc}/kategori/:slug`, `/{lc}/blog/kategori/:slug`, `/{lc}/iletisim/bayilik`
- **23 sayfa "Kesfedildi - dizine eklenmedi"**: Soft 404 — `/tr/login`, `/tr/profile`, `/tr/sepet`, `/tr/checkout`, `/tr/siparis`, `/wp-admin` vb. 200 doneuyor ama gercek icerik yok
- **9 sayfa "Yonlendirmeli"**: Normal davranis (www / non-www)
- **11 sayfa "noindex"**: Beklenen (admin/auth sayfalari)

### Schema (JSON-LD)
- BreadcrumbList: **kodda dogru**, GSC raporu eski veri
- Product: **`offers` yok** (Vista Seeds katalog/B2B oldugu icin DOGRU — Merchant Listings ve Product Snippets uyarilari yok sayilabilir)

### Admin Panel
- **`/api/auth/token` 404**: Iki kademeli sorun:
  1. `resolveBaseUrl()` fallback'i `/api` doneuyor — env eksikse browser `/api/auth/token` cagiriyor (v1 yok)
  2. `next.config.mjs` rewrite `/api/v1` ile biten base URL'i strip etmiyor — hedef `/api/v1/api/auth/token` oluyor
- **`/uploads/media/logo/*.png` 404**: Ayni rewrite bug'i, hedef `/api/v1/uploads/...` oluyor

---

## Yapilan Degisiklikler (Bu PR / Bu Sohbette)

| Dosya | Degisiklik |
|---|---|
| [frontend/next.config.ts](frontend/next.config.ts#L80-L165) | 17 yeni 301 redirect (sitemap, kategori, soft 404 URL'leri) |
| [admin_panel/next.config.mjs](admin_panel/next.config.mjs#L59-L62) | API base stripping logic: `/api/v1`, `/api/v2`, `/api` suffix temizleme |
| [admin_panel/next.config.mjs](admin_panel/next.config.mjs#L64) | Rewrite default base `vistaseeds.com.tr` → `www.vistaseeds.com.tr` (redirect hop'u onle) |
| [admin_panel/src/integrations/shared/network.ts](admin_panel/src/integrations/shared/network.ts#L56) | `resolveBaseUrl()` prod fallback `/api` → `/api/v1` (ekosistem standardi) |
| [admin_panel/src/server/fetch-branding.ts](admin_panel/src/server/fetch-branding.ts#L10) | SSR branding fetch `/api` → `/api/v1` |
| [admin_panel/src/components/auth/auth-brand-logo.tsx](admin_panel/src/components/auth/auth-brand-logo.tsx#L6) | Auth logo fallback absolute `www` URL |
| VPS MySQL grant | `app@localhost` icin `users.last_sign_in_at/updated_at` UPDATE ve `refresh_tokens` INSERT/UPDATE |

---

## Yapilacaklar — Gorev Ayrimi

### Claude Code (Mimar / Stratejist)
Karar, dokumantasyon ve mimari kontrol.

- [x] GSC raporlarini analiz et, kok neden tespiti (rapor: bu dosya)
- [x] Frontend `next.config.ts` redirect listesi tasarla (5xx + 404 + soft 404)
- [x] Admin panel rewrite stripping logic fix
- [x] Bu checklist dosyasini yaz ve koke ekle
- [ ] Deploy sonrasi GSC "Dogrulamayi baslat" islemlerini takip et (manuel) - 7-14 gun
- [ ] 30 gun sonra GSC raporlarini tekrar al, delta olc (yeni `searchconsole/2026-06-25/` klasoru)
- [x] Production `.env`'in dogru olup olmadigini DevOps ile dogrula (asagidaki Codex maddesi ile birlikte)

### Codex (Implementor)
Kod uygulama, env senkronu, deploy verify.

#### Hemen yapilacaklar
- [x] `git status` ve `git diff frontend/next.config.ts admin_panel/next.config.mjs` ile degisiklikleri incele
- [x] Frontend `bun run build` lokal calistir, 17 yeni redirect kuralinin compile ettigini dogrula
- [x] Admin panel `bun run build` lokal calistir
- [x] Commit at: `fix: search console 5xx/404 + admin panel api/v1 base + rewrite`
  - 4 dosya: `frontend/next.config.ts`, `admin_panel/next.config.mjs`, `admin_panel/src/integrations/shared/network.ts`, `SEARCHCONSOLE_FIX_CHECKLIST.md`
- [x] **KRITIK**: Build ve deploy yapilmadan kullanici browser'inda hata DEVAM EDER (eski JS chunk cached). Deploy ZORUNLU.
- [x] Production `.env` (VPS uzerinde admin_panel/.env veya .env.production):
  - `PANEL_API_URL=https://www.vistaseeds.com.tr` (origin only, /api eki YOK)
  - `NEXT_PUBLIC_API_URL=https://www.vistaseeds.com.tr/api/v1`
  - `NEXT_PUBLIC_API_BASE_URL=https://www.vistaseeds.com.tr/api/v1`
  - **Dogrulama:** stripping logic'i artik /api/v1 olsa bile origin'e dusuruyor, ama temiz tutmak icin `PANEL_API_URL` mutlaka **origin-only** olmali
- [x] `deploy.sh` ile deploy
  - Not: VPS working tree'de cok sayida production-local degisiklik oldugu icin `git pull` adimi calistirilmadi; `deploy.sh` build/restart sirasi manuel olarak ayni sekilde calistirildi.
- [x] Deploy sonrasi smoke test (curl):
  ```bash
  # 5xx fix
  curl -sI https://www.vistaseeds.com.tr/sitemap_index.xml         # bekleniyor: 301
  curl -sI https://www.vistaseeds.com.tr/sitemap-0.xml             # bekleniyor: 301

  # 404 fix
  curl -sI https://www.vistaseeds.com.tr/tr/urunler/kategori/domates   # bekleniyor: 301
  curl -sI https://www.vistaseeds.com.tr/tr/kategori/domates           # bekleniyor: 301
  curl -sI https://www.vistaseeds.com.tr/tr/blog/kategori/tarim        # bekleniyor: 301
  curl -sI https://www.vistaseeds.com.tr/tr/iletisim/bayilik           # bekleniyor: 301

  # Soft 404 fix
  curl -sI https://www.vistaseeds.com.tr/tr/login          # bekleniyor: 301 → /tr/bayi-girisi
  curl -sI https://www.vistaseeds.com.tr/tr/sepet          # bekleniyor: 301 → /tr/teklif-al
  curl -sI https://www.vistaseeds.com.tr/wp-admin          # bekleniyor: 301 → /tr

  # Admin panel API
  curl -sI -X POST https://panel.vistaseeds.com.tr/api/v1/auth/token          # bekleniyor: 400 (gecerli rota, eksik body)
  curl -sI https://panel.vistaseeds.com.tr/api/v1/uploads/media/logo/vistaseed_logo.png  # bekleniyor: 200
  ```
- [x] Admin panele tarayicidan giris dene (orhanguzell@gmail.com ile)
  - Chrome/CDP smoke: `/auth/login` → `/admin`, token var, dashboard render edildi.
- [x] Console'da 404 logo + auth/token hatalarinin gectigini dogrula
  - Chrome/CDP smoke: `/api/v1/auth/token` 200, logo/favicons 200, console error yok.

#### Schema iyilestirmeleri (opsiyonel, bekleyebilir)
- [x] Product JSON-LD'ye `@type: ProductGroup` veya `offers: { availability: 'PreSale', priceCurrency: 'TRY', price: '0' }` gibi katalog tipi alanlar EKLENMEMELI (Vista Seeds B2B/katalog, Merchant Listings raporu zaten yok sayilabilir)
- [x] **Eger ileride iletisim/teklif uzerinden satis modeline gecilirse**: Product schema'ya `offers.priceSpecification`, `hasMerchantReturnPolicy`, `shippingDetails` eklenir (bu PR'da YAPMA)

### DevOps / Manuel
- [ ] **Google Search Console**'da (https://search.google.com/search-console):
  - Sayfalar > Sunucu hatasi (5xx) > **Dogrulamayi baslat**
  - Sayfalar > Bulunamadi (404) > **Dogrulamayi baslat**
  - Gelisitirmeler > Breadcrumbs > **Dogrulamayi baslat**
  - Gelistirmeler > Urun parcaciklari > **Dogrulamayi baslat** (Merchant Listings ve Product Snippets icin gerekirse "kapatma" istegi gonder)
- [ ] 7 gun sonra GSC URL Inspection ile ornek URL'leri test et (eski 404'lerden 1-2 ornek + eski 5xx'lerden 1-2 ornek)
- [ ] 14 gun sonra: GSC Coverage trend grafiginde "Dizine eklenmis" sayisinin artisa gectigini dogrula

---

## Bekleme Suresi ve Beklenen Sonuc

| Metrik | Suanki | Hedef (14-30 gun) |
|---|---|---|
| 5xx sayfa sayisi | 18 | 0 |
| 404 sayfa sayisi | 27 | < 5 |
| Soft 404 (kesfedildi-dizine eklenmedi) | 23 | < 10 |
| Dizine eklenen sayfa | 26 | > 50 |
| Breadcrumbs gecerli | 0 | 13+ |
| Merchant Listings | 0 (ignore) | N/A |
| Product Snippets | 0 (ignore) | N/A |

---

## Notlar

- **AGENTS.md** Codex'in bu checklist'i tarayabilmesi icin guncellenebilir (opsiyonel).
- **CLAUDE.md** kok dosyasi degismedi; bu fix proje-spesifik.
- Redirect kurallari Next.js `redirects()` icinde, **build sirasinda statik** olarak derlenir; runtime overhead yok.
- Admin panel rewrite stripping fix `/api`, `/api/v1`, `/api/v2`, ... her seyi cover ediyor; ileride v2'ye gecince koprulanma sorunu olmayacak.
- Vista Seeds katalog/B2B modeli sabit oldugu surece Merchant Listings ve Product Snippets raporlari kalici olarak ignore edilebilir.
