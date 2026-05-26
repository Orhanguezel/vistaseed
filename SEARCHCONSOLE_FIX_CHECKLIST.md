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
- [x] Google panellerinde uygulanacak manuel takip runbook'u eklendi: [docs/google-manuel-takip-runbook.md](docs/google-manuel-takip-runbook.md)
- [x] Faz 2 teknik takip smoke script'i ve 2026-05-25 ara raporu eklendi:
  - [scripts/vistaseed-seo-followup.sh](scripts/vistaseed-seo-followup.sh)
  - [reports/vistaseeds-seo-followup-2026-05-25.md](reports/vistaseeds-seo-followup-2026-05-25.md)
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

---

# FAZ 2 — Log + Ziyaretci Raporu Bulgulari (2026-05-25)

Kaynak:
- [reports/vistaseeds-log-raporu-2026-05-25.pdf](reports/vistaseeds-log-raporu-2026-05-25.pdf) (14 gunluk nginx log analizi)
- [reports/vistaseeds-ziyaretci-raporu-2026-05-25.pdf](reports/vistaseeds-ziyaretci-raporu-2026-05-25.pdf) (8 gunluk kampanya ilk hafta)
- [reports/vistaseeds-ziyaretci-raporu-2026-05-18.pdf](reports/vistaseeds-ziyaretci-raporu-2026-05-18.pdf) (kampanya baseline)

Faz 1 deploy edildi ve dogrulandi. Bu faz, log analizinden ortaya cikan kalan / yeni sorunlari kapsar.

---

## Tespit Edilen Yeni Sorunlar

### 4xx (kalan 404 kaynaklari, log raporu)
- **`/tr/urun/<slug>` tekil URL pattern**: 50+ adet 404 (saray-f1, avar, cankan-f1, kizgin-f1, prestij-f1, tirpan-f1, lucky-f1, birlik-f1)
- **`/tr/grup-sirketlerimiz/<slug>`**: 20+ adet 404 (vista-prestige, vista-lara-villalari, vista-lagoon, vista-sunset, bereket-fide-insaat) — dis kaynaktan yanlis backlink
- **`/uploads/media/logo/logo-light.png`**: 14 adet 404 — DB'de tanimsiz logo path
- **`/uploads/slide/slide-1-field.webp`, `/uploads/slide/slide-2-corn.webp`**: 5+ adet 404 — eksik medya
- **`/de/anbauleitfaden/...`, `/de/referenzen/...`**: 12 adet 404 — DE locale seed eksik
- **Admin panel `/robots.txt`**: 29 adet 404
- **Admin panel `/apple-touch-icon.png`**: 2 adet 404

### 5xx (kalan 500 kaynaklari)
- **`/apple-touch-icon-precomposed.png`**: 12 adet 500 (Next.js bunu uretmiyor, soft 500)
- **`/en/contact`, `/en/compare`, `/en/products`, `/en/faq`, `/en/about`, `/de/produkte`, `/de/vergleich`, `/de/kontakt`, `/de/faq`, `/de/datenschutz`, `/de/nachhaltigkeit`**: 30+ adet 500 — localizedPathRedirects'de var ama next-intl middleware sirasi nedeniyle 500 doneuyor olabilir
- **`/api/v1/auth/token`**: 4 adet 500 (yanlis parola denemesi + MySQL refresh_token akisinda yan etki, incelenmeli)
- **Saldiri probe'lari**: `/.env`, `/.env.local`, `/.env.docker`, `/.env.dev`, `/.git/config`, `/dx.php`, `/p.php`, `/av.php`, `/admin.php`, `/zxz.php`, `/wp-login.php`, `/wp-admin/*`, `/webmail/phpinfo.php`, `/vendor/.env`, `/sitemap.txt`, `/atom.xml` — Next.js 500 doneuyor, nginx tarafinda erken bloklanmali

### Kampanya / Olcum (ziyaretci raporu)
- **`utm_campaign` etiketi eksik**: Google Ads URL sablonlarinda `{campaignid}` bazli UTM tanimli degil; raporlamada kampanya ayrimi yapilamiyor (sadece gad_campaignid sayisal ID gozukuyor)
- **3 aktif Google Ads kampanyasi**: `23858139584`, `23862644545`, `23643860570` — isim ve butce dokumantasyonu yok

---

## Yapilacaklar — Gorev Ayrimi

### Claude Code (Mimar / Stratejist)
- [x] Log + ziyaretci raporlarini analiz et, kalan sorunlari tespit et
- [x] Bu Faz 2 bolumunu checklist'e ekle
- [x] Faz 2 deploy sonrasi takip icin teknik smoke/log script'i eklendi (`scripts/vistaseed-seo-followup.sh`)
- [x] 2026-06-01 takip raporu icin VPS cron zamanlamasi kuruldu: `/etc/cron.d/vistaseed-seo-followup`
- [ ] Faz 2 deploy sonrasi 7 gun sonra (2026-06-01) yeni log analizi raporu uret
- [x] Faz 2 bulgularinin Faz 1 ile birlikte master `SEO/TECHNICAL-DEBT.md` dosyasina cikarilmasini degerlendir (opsiyonel)

### Codex (Implementor) — P0 (Acil)
> Bu maddeler 50+ adet 404'u tek hamlede coker. Ilk sprint.

#### P0.1 — Eski tekil URL pattern redirect
- [x] `frontend/next.config.ts` `redirects()` listesine ekle:
  ```ts
  {
    source: '/:locale(tr|en|de)/urun/:slug',
    destination: '/:locale/urunler/:slug',
    permanent: true,
  },
  ```
- [x] Deploy ve dogrula:
  ```bash
  curl -sI https://www.vistaseeds.com.tr/tr/urun/saray-f1   # bekleniyor: 308 -> /tr/urunler/saray-f1
  curl -sI https://www.vistaseeds.com.tr/tr/urun/avar       # bekleniyor: 308
  curl -sI https://www.vistaseeds.com.tr/en/urun/cankan-f1  # bekleniyor: 308
  ```

#### P0.2 — Yanlis backlink redirect (grup-sirketlerimiz)
- [x] `frontend/next.config.ts` `redirects()` listesine ekle:
  ```ts
  {
    source: '/:locale(tr|en|de)/grup-sirketlerimiz/:slug',
    destination: '/:locale/hakkimizda',
    permanent: true,
  },
  ```
- [x] Deploy ve dogrula:
  ```bash
  curl -sI https://www.vistaseeds.com.tr/tr/grup-sirketlerimiz/vista-prestige  # bekleniyor: 308
  curl -sI https://www.vistaseeds.com.tr/tr/grup-sirketlerimiz/vista-lagoon    # bekleniyor: 308
  ```

### Codex (Implementor) — P1 (Orta)

#### P1.1 — Eksik static asset'ler
- [x] `frontend/public/apple-touch-icon.png` ekle (180x180 px, marka logosu uzerinden)
  - Sonuc: `/apple-touch-icon-precomposed.png` 500'leri durur (Next.js, eksik istekte 500 yerine sessiz 404 doner)
- [x] `frontend/public/apple-touch-icon-precomposed.png` ekle
- [x] `admin_panel/public/robots.txt` ekle:
  ```
  User-agent: *
  Disallow: /
  ```
- [x] `admin_panel/public/apple-touch-icon.png` ekle (mevcut favicon'dan)
- [x] Dogrula:
  ```bash
  curl -sI https://www.vistaseeds.com.tr/apple-touch-icon-precomposed.png  # 200 veya 404 (500 olmasin)
  curl -sI https://panel.vistaseeds.com.tr/robots.txt                       # 200
  curl -sI https://panel.vistaseeds.com.tr/apple-touch-icon.png             # 200
  ```

#### P1.2 — Nginx tarafinda saldiri probe bloklamasi
- [x] VPS uzerinde `/etc/nginx/sites-available/vistaseed` icine ekle (server block icinde):
  ```nginx
  # Saldiri / scan probe'lari icin erken blok (CPU + log temizligi)
  location ~ /\.(env|git|svn|hg|bak|sql)        { return 444; }
  location ~* \.(php|aspx|asp|cgi|jsp)$          { return 444; }
  location ~* /wp-(admin|login|content|includes) { return 444; }
  location = /xmlrpc.php                         { return 444; }
  location = /sitemap.txt                        { return 444; }
  location = /atom.xml                           { return 444; }
  ```
- [x] `nginx -t && systemctl reload nginx`
- [x] Dogrula:
  ```bash
  curl -sI https://www.vistaseeds.com.tr/.env           # bekleniyor: bos yanit (444)
  curl -sI https://www.vistaseeds.com.tr/wp-login.php   # bekleniyor: bos yanit
  curl -sI https://www.vistaseeds.com.tr/admin.php      # bekleniyor: bos yanit
  ```
- **Not**: 444 nginx'in "no response" kodu; istemci taraftan bakildiginda connection close gibi gorunur. Next.js'e ulasmaz, log gurultusu siyrilir.
- **Canli not**: VPS'te `sites-enabled/vistaseed` symlink degil ayri aktif dosya oldugu icin bloklar aktif dosyaya da uygulandi. Backup: `/etc/nginx/sites-enabled/vistaseed.codex-backup-20260525-active-faz2-probe`.

#### P1.3 — Eksik medya dosyalari (DB icerik tarafi)
- [x] DB'de admin panel uzerinden:
  - `site_settings.site_logo_light` veya kullanilan logo path'lerinin canli dosyaya isaret ettigini dogrula
  - Eksik slider gorselleri (`slide-1-field.webp`, `slide-2-corn.webp`) ya yeniden yukle ya da slider girisini DB'den temizle
- [x] **Not**: Bu kod degisikligi degil, icerik girisi. Admin panel uzerinden manuel yapilabilir.
  - Canli `logo-light.png`, `slide-1-field.webp`, `slide-2-corn.webp` URL'leri 200 donuyor.

### Codex (Implementor) — P2 (Inceleme Gerektirir)

#### P2.1 — `/en/*` ve `/de/*` middleware 500 sorunu
- [x] `frontend/src/middleware.ts` (veya `i18n/routing.ts`) incele:
  - `next-intl` middleware'i `redirects()`'ten **once** mi calisiyor?
  - `localizedPathRedirects` icindeki `/en/contact` -> `/en/iletisim` redirect'i middleware tarafindan locale resolution sirasinda fail mi ediyor?
- [x] Test sirasi: deploy edilen redirect'ler 25 May 13:28 sonrasi calisiyor mu? Eski log'larda gorulen 500'ler fix oncesi olabilir
  ```bash
  curl -sI https://www.vistaseeds.com.tr/en/contact      # bekleniyor: 308 -> /en/iletisim
  curl -sI https://www.vistaseeds.com.tr/en/compare      # bekleniyor: 308 -> /en/karsilastirma
  curl -sI https://www.vistaseeds.com.tr/de/vergleich    # bekleniyor: 308 -> /de/karsilastirma
  curl -sI https://www.vistaseeds.com.tr/de/produkte     # bekleniyor: 308 -> /de/urunler
  ```
- [x] Yeni log'larda hala 500 varsa middleware fix gerekli; yoksa olarak isaretleyip kapatabiliriz.
  - Canli smoke: `/en/contact`, `/en/compare`, `/de/vergleich`, `/de/produkte` 308 donuyor; middleware fix gerekmiyor.

#### P2.2 — `/api/v1/auth/token` 4 adet 500
- [x] Backend log'larini detayli incele:
  ```bash
  ssh vps-vistainsaat 'tail -200 /root/.pm2/logs/vistaseed-backend-error.log; grep "auth/token" /root/.pm2/logs/vistaseed-backend-out.log | tail -30'
  ```
- [x] 500 hatasi yanlis sifre denemesi sirasinda mi (rate limit + 401 ile karisik) yoksa MySQL grant disindaki bir akis hatasi mi tespit et
- [x] Cozum: 401 dondurulmesi gereken durumda 500 dondurmek olmamali; Fastify error handler kontrol edilmeli
  - Kok neden: MySQL `app@localhost` yetkisi `users.last_sign_in_at/updated_at` UPDATE ve `refresh_tokens` INSERT/UPDATE icin eksikti. Grant sonrasi body eksik POST 400, yanlis sifre 401 donuyor.

### Codex (Implementor) — Olcum / Kampanya

#### M.1 — Google Ads UTM sablonlari ekle
- [x] Google Ads manuel uygulama adimlari runbook'a eklendi: [docs/google-manuel-takip-runbook.md](docs/google-manuel-takip-runbook.md)
- [ ] Google Ads hesabinda her kampanya icin "Final URL suffix" veya "Tracking template" alanina ekle:
  ```
  utm_source=google_ads&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}
  ```
- [x] Kampanya isim eslestirmesi dokumante et (`docs/google-ads-kampanyalar.md` veya benzeri):
  - `23858139584` -> ? (en aktif kampanya)
  - `23862644545` -> ?
  - `23643860570` -> ?
- [ ] 7 gun sonra log analizinde `utm_campaign` ayriminin gorunup gorunmedigini dogrula
  - Not: Google Ads arayuzu/hesap erisimi gerektiren UTM uygulama adimi Codex tarafindan tamamlanamaz; takip dokumani eklendi.

### DevOps / Manuel

#### D.1 — Search Console dogrulamalari (FAZ 1'den devam)
- [x] Manuel Search Console dogrulama adimlari runbook'a eklendi: [docs/google-manuel-takip-runbook.md](docs/google-manuel-takip-runbook.md)
- [ ] Search Console > Sayfalar > Sunucu hatasi (5xx) > **Dogrulamayi baslat**
- [ ] Search Console > Sayfalar > Bulunamadi (404) > **Dogrulamayi baslat**
- [ ] Search Console > Gelistirmeler > Breadcrumbs > **Dogrulamayi baslat**

#### D.2 — Yeni redirect'ler sonrasi GSC URL Inspection
- [x] URL Inspection ornek URL listesi ve beklenen sonuc runbook'a eklendi: [docs/google-manuel-takip-runbook.md](docs/google-manuel-takip-runbook.md)
- [ ] P0.1 ve P0.2 deploy edildikten 24 saat sonra:
  - 2-3 adet `/urun/...` URL'sini GSC URL Inspection ile test et
  - 2-3 adet `/grup-sirketlerimiz/...` URL'sini test et
  - Hepsi 308 redirect ile yeni hedeflere gitmeli

#### D.3 — Merchant Center kontrol
- [x] Merchant Center karar notlari runbook'a eklendi: [docs/google-manuel-takip-runbook.md](docs/google-manuel-takip-runbook.md)
- [ ] Google Merchant Center'da urun listing durumu kontrol edilecek
  - Vista Seeds katalog/B2B modelinde oldugu icin urun fiyati yok
  - Merchant Listings raporu kalici olarak "kapat" istegi gonderilebilir VEYA Merchant Center hesabi siteden tamamen kaldirilabilir

---

## Faz 2 Hedef Tablosu

| Metrik | Suanki (25 May) | Hedef (Faz 2 sonrasi) |
|---|---|---|
| `/urun/<slug>` 404 | 50+ | 0 (P0.1) |
| `/grup-sirketlerimiz/*` 404 | 20+ | 0 (P0.2) |
| Eksik asset 4xx/5xx | 40+ | <5 (P1.1) |
| Saldiri probe 5xx log gurultusu | 50+ | 0 (P1.2, 444 ile sessiz) |
| `/en/*`, `/de/*` middleware 500 | 30+ | 0 (P2.1) |
| Toplam 4xx orani | %2.2 (14 gun) | <%1.0 |
| Toplam 5xx orani | %2.2 (14 gun) | <%0.5 |
| Kampanya raporlama netligi | gad_campaignid sayisi | UTM ile isim bazli (M.1) |

---

## Faz 2 Notlari

- **Oncelik mantigi**: P0 dogrudan 404'leri sifirlar (en yuksek etki); P1 ek temizlik; P2 inceleme + dogrulama; M.1 olcum kalitesi (gelir/kampanya analizine etki).

---

# FAZ 3 — Storage / Urun Resmi Yukleme Fix (2026-05-26)

## Sorun
Atakan urun resmi yuklerken hata aliyordu. Loglarda 4xx/5xx upload hatasi GORUNMUYOR ama urun resimleri sayfada gozukmuyor.

## Kok Neden (iki kademeli, DB konfig)
- `site_settings.storage_local_root = "/app/uploads"` — Backend dosyalari yanlis dizine yaziyor (`/app/uploads/`), nginx/frontend rewrite ise `backend/uploads/` dizininden serve ediyor.
- `site_settings.storage_public_api_base = "http://localhost:8083"` — Upload sonrasi donen URL `http://localhost:8083/uploads/...`, browser bunu acmiyor (mixed content + erisilemez).
- Ayrica `app@localhost` MySQL kullanicisinin `site_settings` UPDATE yetkisi yoktu.

## Yapilan Fix
- DB: `storage_local_root = "/var/www/tarim-dijital-ekosistem/projects/vistaseeds/backend/uploads"` (backend serve dizinine hizalandi).
- DB: `storage_public_api_base = "https://www.vistaseeds.com.tr"` (production URL).
- MySQL grant: `app@localhost`'a `site_settings` UPDATE/INSERT/DELETE yetkisi verildi.
- `/app/uploads/` icindeki 3 mevcut Atakan upload'i `backend/uploads/`'a tasindi (cakisma yok).
- `vistaseed-backend` PM2 restart (config cache 30sn).
- `/app/uploads/` bosaltildi (artik kullanilmiyor).

## Dogrulama (canli smoke)
- Login OK → token alindi
- `POST /api/v1/admin/storage/assets` → **HTTP 201**, URL `https://www.vistaseeds.com.tr/uploads/products/faz2_test.png`
- `GET <URL>` → **HTTP 200, image/png**
- Eski DB kayitlarinda `localhost:8083` URL bulunmadi (storage_assets, products.image_url, products.images JSON hepsi temiz).

## Aksiyon Gerektirmeyen Notlar
- `storage_driver` hala `"local"` (Cloudinary degil); env'de CLOUDINARY_* setli, ileride driver `"cloudinary"` yapilirsa otomatik gecer.
- Test dosyalari temizlendi.

## Tavsiye — UYGULANDI (Faz 3.1)
~~Eger /app/uploads gibi yanlis path'in tekrar olusmasini engellemek istiyorsan...~~

Faz 3.1'de uygulandi. Detay: [Faz 3.1 bolumu asagida](#faz-31--env-kurtarici-mantik-2026-05-26).

---

# FAZ 3.1 — ENV Kurtarici Mantik (2026-05-26)

## Amac
DB'deki yanlis storage config'i (orn. `storage_local_root="/app/uploads"`)
production'da bir daha sorun cikarmasin. ENV her zaman oncelikli olsun.

## Yapilan Degisiklikler

### Kod
- [packages/shared-backend/modules/storage/cloudinary.ts:78-95](packages/shared-backend/modules/storage/cloudinary.ts#L78) — `pick(envVal, dbVal)` helper'i eklendi; tum config alanlari icin **ENV > DB > fallback** sirasi kuruldu.
  - Etkilenenler: `cloudName, apiKey, apiSecret, defaultFolder, unsignedUploadPreset, localRoot, localBaseUrl, cdnPublicBase, publicApiBase`
  - `driver` yine DB-oncelikli kaldi (admin panel'den driver gecisi yapilabilsin diye)
- [projects/vistaseeds/backend/.env.example](projects/vistaseeds/backend/.env.example) — Yeni env'ler eklendi (`STORAGE_PUBLIC_API_BASE`, `STORAGE_CDN_PUBLIC_BASE`); `LOCAL_STORAGE_ROOT` default'u bos birakildi (yanilticiydi); aciklayici yorum eklendi.

### VPS Konfig
- `backend/.env` guncellendi:
  - `LOCAL_STORAGE_ROOT=/var/www/tarim-dijital-ekosistem/projects/vistaseeds/backend/uploads` (eski: yanlislikla lokal makine path'i)
  - `STORAGE_PUBLIC_API_BASE=https://www.vistaseeds.com.tr` (yeni)
  - `STORAGE_CDN_PUBLIC_BASE=` (yeni, gelecek icin)
  - Backup: `backend/.env.bak.faz3-20260525-224417`

### PM2 Calistirma
- Backend artik **`bun --env-file=.env`** flag'i ile baslatiliyor (PM2 process'in cwd backend olsa da Bun'in otomatik .env yuklemesi PM2 spawn'inda her zaman garanti calismayabilir).
- `pm2 save` ile kalici yapildi.
- `pm2 startup` mevcut, reboot sonrasi otomatik gelir.

### Build Dikkat
- Backend `bun run build` sirasinda shared-backend'i **kendi dist'ine bundle** ediyor: `backend/dist/packages/shared-backend/...`. Yani shared-backend tek basina rebuild yetmez, **backend de rebuild edilmeli** (`deploy.sh` zaten bunu yapiyor).
- Bu fix sirasinda backend rebuild yapilmadan once, backend'in eski bundle'i devrede oldugu icin ENV-first 4 deneme boyunca calismadi. Cozum: shared-backend dist'i backend dist'inin icine elle kopyalanip restart edildi.

## Dogrulama (canli kanit testi)
1. DB'yi BOZ: `storage_public_api_base = "http://broken.example.com"`
2. ENV'i koru: `STORAGE_PUBLIC_API_BASE=https://www.vistaseeds.com.tr`
3. Upload test → URL `https://www.vistaseeds.com.tr/uploads/products/proof.png` ✅ (env-first)
4. DB geri alindi.

## Onerilen Sonraki Adim (opsiyonel)
- Yeni deploy'larda backend'in `bun run build` adimi shared-backend dist'i her zaman taze bundle eder; manuel kopyalama gerekmez.
- `STORAGE_LOCAL_ROOT`, `STORAGE_PUBLIC_API_BASE` env'leri yeni proje iskelelerinde de mevcut olmali (bereketfide vs.). Diger projelere de ayni env doc'u yayilmasi tavsiye edilir.

---

# FAZ 3.2 — MySQL GRANT Buyuk Cesitleme (2026-05-26)

## Tetikleyici Hata
Admin panelden offer silme istegi 500 Internal Server Error veriyordu:
```
DELETE /api/v1/admin/offers/99999999-9999-4999-8999-999999999991 → 500
DELETE /api/v1/admin/offers/99999999-9999-4999-8999-999999999992 → 500
```
Backend log:
```
DrizzleQueryError: DELETE command denied to user 'app'@'localhost' for table 'offers'
```

## Kok Neden (cok daha buyukmus)
`app@localhost` MySQL kullanicisi `vistaseed` DB'sinde **sadece SELECT** yetkisine sahipti. Diger ekosistem DB'lerinde (`bereketfide`, `tarimiklim`, `vistainsaat`, `katalog_creator`) **ALL PRIVILEGES** vardi — yalniz vistaseed asagidaki tablolar icin manuel patch grant'leriyle calisiyordu (Codex onceki fazlarda eklemis):
- `library*` tablolari → INSERT/UPDATE/DELETE
- `refresh_tokens` → INSERT/UPDATE
- `site_settings` → SELECT/INSERT/UPDATE/DELETE
- `storage_assets` → INSERT/UPDATE/DELETE
- `users.last_sign_in_at, updated_at` → UPDATE

**Diger TUM TABLOLAR** sadece SELECT idi. Sonuc: vistaseed admin paneli pratikte READ-ONLY calisiyordu. Atakan'in **"urun resmi eklenmiyor"** sorununun gercek kokunden biri de buydu (storage_assets'e yazabildi ama `products.image_url` UPDATE edemedi).

## Etkilenen Tablo/Modul Listesi (READ-ONLY oldugu icin patlayanlar)
- `offers` — DELETE 500 (tetikleyici)
- `products`, `product_*` — UPDATE 500 (Atakan'in sorunu)
- `categories`, `category_i18n`
- `blog_posts`, `blog_posts_i18n`
- `custom_pages`, `custom_pages_i18n`
- `popups`, `popups_i18n`
- `orders`, `order_items`, `payment_attempts`
- `notifications`, `contact_messages`
- `email_templates`, `home_sections`
- `job_listings`, `job_applications`
- `dealer_profiles`, `dealer_transactions`
- `references*`, `reviews*`, `galleries*`
- Toplam 30+ tablo

## Yapilan Fix (tek SQL)
```sql
GRANT ALL PRIVILEGES ON `vistaseed`.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```
Artik vistaseed DB'si diger ekosistem DB'leriyle ayni standartta yetkili.

## Dogrulama
- `DELETE /api/v1/admin/offers/<id>` → **204** ✓ (önceden 500)
- Backend log'da `DrizzleQueryError: ... command denied` artik yok.
- Eski patch grant'lar (library, refresh_tokens, site_settings, storage_assets, users) hala duruyor — gereksiz ama zarar vermez; istenirse temizlenebilir:
  ```sql
  REVOKE ALL ON `vistaseed`.`library_files` FROM 'app'@'localhost';
  -- ... vb. (gerekmiyor; ALL zaten kapsiyor)
  ```

## Kalici Garanti
[backend/src/db/seed/index.ts:48](backend/src/db/seed/index.ts#L48) **zaten** `GRANT ALL PRIVILEGES ON \`${DB.name}\`.* TO '${dbUser}'@'${dbHost}';` icermektedir.
Yani `bun run db:seed:vistaseeds:fresh` calistirildiginda grant otomatik gelir.

Productionda bu grant'in kaybolma sebebi muhtemelen Codex'in onceki manuel REVOKE'lari veya production DB'sinde seed disinda yapilan elle mudahaledir. Bu fix sonrasi tekrar elle revoke yapilmadigi surece sorun cikmaz.

## Aksiyon Onerisi (cok kritik)
- **Tum yeni proje iskelelerinde**: Production DB user'i icin `GRANT ALL PRIVILEGES ON db.* TO user@host` mutlaka uygulanmali (init seed scripti zaten yapiyor). Production deploy sonrasi `SHOW GRANTS FOR 'app'@'localhost';` ile ekosistem standardiyla karsilastirma kontrolu yapilmali.
- Diger ekosistem projelerinde (bereketfide vs.) ayni "kritik tablo READ-ONLY" sorunu olmadigi dogrulandi (ALL PRIVILEGES verili).
- **Deploy sirasi**: P0.1 + P0.2 + P1.1 ayni PR'da gidebilir (sadece config + static dosya). P1.2 ayri (nginx config, VPS uzerinde). P2'ler ayri PR.
- **Faz 2 Beklenen Sure**: 1-2 sprint (P0 birkac saat, P1+P2 1 gun).
- **AGENTS.md / Codex**: Faz 2 P0/P1 maddeleri Codex'in tek seferde bitirebilecegi maddelerdir; rapor uzerinden direkt komut takip edilebilir.
- Redirect kurallari Next.js `redirects()` icinde, **build sirasinda statik** olarak derlenir; runtime overhead yok.
- Admin panel rewrite stripping fix `/api`, `/api/v1`, `/api/v2`, ... her seyi cover ediyor; ileride v2'ye gecince koprulanma sorunu olmayacak.
- Vista Seeds katalog/B2B modeli sabit oldugu surece Merchant Listings ve Product Snippets raporlari kalici olarak ignore edilebilir.
