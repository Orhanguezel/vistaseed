# Frontend Planlama — Proje-Bagimsiz Kurumsal Site

## Amac

Frontend'i proje isimlerinden arındırmak, PaketJet kalıntıları temizlemek ve backend seed/siteSettings verileriyle çalışan, herhangi bir kurumsal site için kullanılabilir bir şablon haline getirmek.

---

## Tamamlanan Fazlar

### Faz 1: Temizlik — TAMAMLANDI

- [x] PaketJet sayfalarını sil (admin/, panel/, giriş/, uye-ol/, sifremi-unuttum/, sifre-sifirla/)
- [x] PaketJet modüllerini sil (ilan, booking, carrier-bank, wallet, withdrawal, subscription, rating, notification, dashboard, admin, auth)
- [x] PaketJet bileşenlerini sil (HeroSearch, IlanCard, PaymentModal, RouteMap, admin/)
- [x] Hardcoded proje isimlerini temizle (0 "vistaseeds" referansı)
- [x] config/routes.ts ve config/api-endpoints.ts güncelle
- [x] lib/api-client.ts storage key generikleştir ("app-auth")
- [x] next.config.ts image hostname generikleştir (Cloudinary)
- [x] Build doğrulama

### Faz 2: Yeni Modüller + Sayfalar — TAMAMLANDI

- [x] modules/product/ modülü oluştur (type, service, ProductCard, ProductGrid)
- [x] app/(public)/urunler/ sayfalarını product modülü ile entegre et
- [x] app/(public)/urunler/[id]/ ürün detay sayfasını yeniden yaz
- [x] app/(public)/insan-kaynaklari/page.tsx oluştur
- [x] app/(public)/sss/page.tsx oluştur (FAQPage schema markup ile)
- [x] lib/site-settings.ts oluştur (fetchSiteSettings + fetchHomepageSettings)
- [x] Header/Footer'i siteSettings'den besle (public layout'da fetch)
- [x] Build doğrulama

### Faz 3: Anasayfa Dönüşümü — TAMAMLANDI

- [x] components/sections/ altında modüler seksiyon bileşenleri oluştur:
  - HeroSection.tsx — Tam ekran hero, badge, CTA
  - StatsSection.tsx — İstatistik bandı
  - ValuesSection.tsx — Temel değerler kartlari
  - ProductsPreview.tsx — Öne çıkan urunler grid
  - TimelineSection.tsx — Tarihçe timeline
  - FaqPreview.tsx — SSS accordion önizleme
  - CtaSection.tsx — İletişim CTA blogu
- [x] Anasayfa'yi seksiyonlardan compose et
- [x] Seksiyonlara backend verisi bağla (homepage settings + products + faqs)
- [x] Build doğrulama

---

## Mevcut Yapı

```
frontend/src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx              — Header + Footer (siteSettings'den)
│   │   ├── page.tsx                — Anasayfa (7 seksiyon)
│   │   ├── hakkimizda/page.tsx     — Hakkımızda (customPage)
│   │   ├── urunler/
│   │   │   ├── page.tsx            — Ürün listesi (Server Component)
│   │   │   └── [id]/page.tsx       — Ürün detay (gorsel, specs, tags)
│   │   ├── insan-kaynaklari/page.tsx — İnsan Kaynakları
│   │   ├── sss/page.tsx            — SSS (FAQPage schema)
│   │   ├── iletisim/page.tsx       — İletişim
│   │   ├── destek/page.tsx         — Destek
│   │   ├── gizlilik-politikasi/    — Gizlilik (customPage)
│   │   ├── kullanim-kosullari/     — Kullanım (customPage)
│   │   └── kvkk/                   — KVKK (customPage)
│   ├── globals.css                 — Tailwind v4 @theme
│   ├── layout.tsx                  — Root layout (SEO, font, theme)
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                         — Button, Input, Badge, Skeleton, ThemeToggle
│   ├── sections/                   — 7 modüler seksiyon bileşeni
│   ├── Header.tsx                  — Dinamik (siteName, logoUrl props)
│   └── Footer.tsx                  — Dinamik (siteName prop)
├── modules/
│   ├── contact/                    — İletişim formu
│   ├── customPage/                 — CMS sayfaları
│   ├── product/                    — Ürün katalogu
│   │   ├── product.service.ts
│   │   ├── product.type.ts
│   │   └── components/
│   │       ├── ProductCard.tsx
│   │       └── ProductGrid.tsx
│   └── support/                    — SSS + destek
├── lib/
│   ├── api-client.ts               — HTTP client (generic, "app-auth")
│   ├── site-settings.ts            — SiteSettings + Homepage fetch
│   ├── seo.ts                      — SEO helper (backend-driven)
│   └── utils.ts
├── config/
│   ├── api-endpoints.ts            — products, siteSettings, contacts, customPages, support, home
│   └── routes.ts                   — products, static (about, hr, faq, contact, support, legal)
└── providers/
    └── theme-provider.tsx          — next-themes (data-theme attribute)
```

---

## Proje-Bağımsızlık Kuralları

1. **Hiçbir dosyada proje ismi hardcoded olmaz.** Tum isim/marka bilgileri:
   - `process.env.NEXT_PUBLIC_SITE_NAME` veya
   - Backend `/api/site_settings?key_in=site_name,...` endpoint'inden gelir

2. **localStorage key'leri generic:** `"app-auth"`

3. **URL fallback'leri env var'dan:** `process.env.NEXT_PUBLIC_SITE_URL`

4. **SEO metadata tamamen backend-driven.** `seo.ts` sadece formatlayıcı.

5. **Sayfa içerikleri backend seed dosyalarından gelir.** Frontend sadece gösterim katmanı.

6. **Section bileşenleri props ile beslenir.** Backend verisi yoksa fallback gosterilir.

---

## Veri Akışı

```
Backend siteSettings DB
  ↓
GET /api/site_settings?key_in=site_name,site_logo,...
  ↓
lib/site-settings.ts (fetchSiteSettings)
  ↓
(public)/layout.tsx
  ↓
Header(siteName, logoUrl) + Footer(siteName)

Backend siteSettings DB
  ↓
GET /api/site_settings/homepage
  ↓
lib/site-settings.ts (fetchHomepageSettings)
  ↓
(public)/page.tsx
  ↓
HeroSection + StatsSection + ValuesSection + ...

Backend products DB
  ↓
GET /api/products?is_featured=true
  ↓
ProductsPreview(products)

Backend support DB
  ↓
GET /api/support/faqs
  ↓
FaqPreview(faqs) + /sss page
```

---

## Faz 4: Kalite — TAMAMLANDI

- [x] Header mobile hamburger menu (açılır/kapanır, pathname ile otomatik kapanma, aktif sayfa vurgulama)
- [x] Header scroll davranışı (overlay modda scroll'da fixed + bg)
- [x] Dark mode kontrolü (hardcoded hex -> token: bg-navy, tum seksiyonlar token'li)
- [x] SEO schema markup (Organization + WebSite public layout'da, FAQPage /sss sayfasında)
- [x] Görsel optimizasyonu (sizes prop tum Image componentlerinde)
- [x] Framer Motion scroll reveal animasyonları (ScrollReveal wrapper + AnimatedSections)
- [x] Build doğrulama (type-check + next build temiz)

### Kalan Kalite Isleri (Opsiyonel)

- [ ] Lighthouse skor kontrolü (Core Web Vitals) — canlı ortamda test
- [ ] Farkli env ile reusability testi (site name + logo degistir)
- [ ] next/image blur placeholder (blurDataURL)
- [ ] Footer'a sosyal medya linkleri (siteSettings'den)
- [ ] Responsive ince ayar (canlı ortamda gorsel kontrol)

---

## Eksik Backend Entegrasyonlari

| Frontend Sayfasi | Backend Endpoint | Durum |
|-----------------|-----------------|-------|
| Anasayfa Hero | `site_settings/homepage` (homepage_hero key) | Seed gerekli |
| Anasayfa Stats | `site_settings/homepage` (homepage_sections.stats) | Seed gerekli |
| Anasayfa Values | `site_settings/homepage` (homepage_sections.values) | Seed gerekli |
| Anasayfa Timeline | `site_settings/homepage` (homepage_sections.timeline) | Seed gerekli |
| Ürünler | `/api/products` | Backend modülü hazır |
| SSS | `/api/support/faqs` | Backend modülü hazır |
| İletişim | `/api/contacts` | Backend modülü hazır |
| Hakkımızda | `/api/custom-pages/by-slug/hakkimizda` | Seed gerekli |
| Gizlilik | `/api/custom-pages/by-slug/gizlilik-politikasi` | Seed gerekli |
| Insan Kaynaklari | Statik + gelecekte `/api/jobs` | Backend modülü yok |
