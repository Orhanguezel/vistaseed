# SEO Technical Debt — vistaseeds

Tarih: 2026-05-25

## Faz 1 — Search Console Fixleri

- Eski WordPress sitemap URL'leri `/sitemap_index.xml` ve `/sitemap-0.xml`, `/sitemap.xml` hedefli kalici redirect'e alindi.
- Eski kategori URL pattern'leri kalici redirect'e alindi:
  - `/{locale}/urunler/kategori/:slug` -> `/{locale}/urunler?category=:slug`
  - `/{locale}/kategori/:slug` -> `/{locale}/urunler?category=:slug`
  - `/{locale}/blog/kategori/:slug` -> `/{locale}/blog?category=:slug`
- Soft 404 ureten eski auth/e-ticaret URL'leri ilgili kurumsal hedeflere yonlendirildi.
- Admin panel API base rewrite ve `resolveBaseUrl()` fallback'i `/api/v1` standardina cekildi.
- Admin panel branding ve auth logo istekleri `/api/v1` ve `www` origin ile uyumlu hale getirildi.
- Canli MySQL `app@localhost` yetkileri auth token akisi icin tamamlandi:
  - `users.updated_at`, `users.last_sign_in_at` UPDATE
  - `refresh_tokens` INSERT/UPDATE

## Faz 2 — Log Raporu Fixleri

- Eski tekil urun URL'leri redirect'e alindi:
  - `/{locale}/urun/:slug` -> `/{locale}/urunler/:slug`
- Yanlis backlink kaynakli grup sirketleri URL'leri redirect'e alindi:
  - `/{locale}/grup-sirketlerimiz/:slug` -> `/{locale}/hakkimizda`
- Eksik static asset gürültüsü azaltildi:
  - Public site `apple-touch-icon-precomposed.png`
  - Admin panel `robots.txt`
  - Admin panel `apple-touch-icon.png`
- Nginx public site server block'una scan/probe bloklari eklendi:
  - dotfile/env/git probe'lari
  - PHP/ASP/JSP probe'lari
  - WordPress probe'lari
  - `xmlrpc.php`, `sitemap.txt`, `atom.xml`
- VPS'te `sites-enabled/vistaseed` symlink degil ayri aktif dosya oldugu icin scan/probe bloklari aktif dosyaya da uygulandi.
- Canli smoke testlerde localized redirect'ler 308 donuyor; next-intl middleware fix'i gerekmiyor.
- Auth token akisi yeniden dogrulandi:
  - Eksik body: 400
  - Yanlis sifre: 401
  - Dogru admin login: 200

## Manuel / Beklemeli Takip

- Google panellerinde uygulanacak adimlar ayrica [docs/google-manuel-takip-runbook.md](../docs/google-manuel-takip-runbook.md) dosyasinda siralandi.
- Google Search Console dogrulamalari baslatilmali:
  - Sayfalar > Sunucu hatasi (5xx)
  - Sayfalar > Bulunamadi (404)
  - Gelistirmeler > Breadcrumbs
- Faz 2 deploy'dan 24 saat sonra GSC URL Inspection ile eski `/urun/...` ve `/grup-sirketlerimiz/...` URL'leri test edilmeli.
- 2026-06-01 tarihinde yeni log raporu uretilmeli.
- 2026-06-25 tarihinde yeni Search Console export'u alinip 25 May baseline ile karsilastirilmali.
- Google Ads Final URL suffix / tracking template hesaba uygulanmali:
  - `utm_source=google_ads&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}`
- Merchant Center tarafinda katalog/B2B modeline gore urun listing uyarilarinin kapatilmasi ya da Merchant Center baglantisinin kaldirilmasi degerlendirilmeli.
