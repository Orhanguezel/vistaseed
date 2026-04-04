# VistaSeed — Ekosistem planı kontrol listesi

**Kaynak:** `EKOSISTEM-PLAN.md`  
**İçerik backlog:** `yapilacaklar.md` (P6 özeti aşağıda)  
**Amaç:** Önceliklere göre ilerleme, araçlar arası görev paylaşımı ve ortak çalışma.

---

## Rol sözlüğü

| Rol | Kim / araç | Sorumluluk |
|-----|------------|------------|
| **Codex** | Kod asistanı (implementasyon) | Backend/frontend/admin kodu, API, şema, migration, test, build düzeltmeleri |
| **Antigravity** | UI/UX (Gemini) | Sayfa düzeni, bileşen hiyerarşisi, erişilebilirlik, görsel tutarlılık, responsive, kullanıcı akışı doğrulama |
| **Orkestrasyon** | Sen (ürün / mimari) | Öncelik sırası, PR birleştirme, plan ↔ kod uyumu |

**Çalışma kuralı:** Aynı feature için önce **UI iskeleti / wireframe notu (Antigravity)** veya mevcut tasarım sistemi, ardından **Codex ile API + sayfa bağlama**; veya tersine küçük iterasyonlar — çakışmayı önlemek için **branch + tek dosya sahipliği** tercih edilir.

---

## P0 — Acil (Hafta 1–2)

### P0.1 Next.js 16 ve build sağlığı

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P0.1a | Frontend: `next@16` + React 19 uyumu, `next.config` kontrolü | ● | ○ |
| P0.1b | Admin: Next 16 + RTK Query / Shadcn uyum, `bun run build` | ● | ● (kırılan ekran görsel kontrolü) |
| P0.1c | Tüm uygulamalarda prod build + kritik route smoke | ● | ● (404/flash layout) |
| P0.1d | Vitest / mevcut testler, kırılanları düzelt | ● | ○ |

- [x] P0.1 tamam (üç paket build; frontend `bun run test` — `routing.test.ts` + `src/test/setup.ts`)

### P0.2 Frontend i18n (TR / EN / DE)

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P0.2a | `next-intl`, `[locale]/` route taşıması, middleware | ● | ● (nav, dil seçici UX) |
| P0.2b | `public/locales` veya planlanan JSON yapısı, Faz 1 metin taşıma | ● | ● (uzun metin okunabilirlik) |
| P0.2c | hreflang, sitemap dil alternatifleri, 301 redirect kuralları | ● | ○ |

- [x] P0.2 Faz 1 (yapı: `[locale]/`, `next-intl`, `routing.ts` + sitemap `alternates`; çeviri kapsamı içerikle genişletilir)

### P0.3 Port ve ortam tutarlılığı (8083)

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P0.3a | `backend/.env.example`, ecosystem, Dockerfile, compose — tek port | ● | ○ |
| P0.3b | `frontend` / `admin_panel` `.env.example` API URL | ● | ○ |

- [x] P0.3 tamam (doküman: `CALISTIRMA.md` ile uyumlu)

### P0.4 llms.txt

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P0.4a | `frontend/public/llms.txt` içerik ve güncel URL’ler | ● | ● (bilgi mimarisi net mi?) |

- [x] P0.4 (`frontend/public/llms.txt`)

---

## P1 — Kısa vade (Hafta 2–4)

### P1.1 Blog

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P1.1a | Backend: blog modülü (`/api/v1/blog`, `/api/v1/feed/rss`) | ● | ○ |
| P1.1b | Admin: blog yönetim ekranı (`/admin/blog`) | ● | ● (liste/detay form UX) |
| P1.1c | Frontend: `/[locale]/blog`, `[slug]` | ● | ● (okuma deneyimi, tipografi) |

- [x] P1.1 canlı (haftalık içerik takvimine hazır — DB seed `134`/`135`, Antigravity okuma/typo doğrulaması önerilir)

### P1.2 Ürün karşılaştırma

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P1.2a | `GET /api/v1/products/compare?ids=` | ● | ○ |
| P1.2b | Frontend `/karsilastirma` seçim + tablo/kart | ● | ● (karşılaştırma grid, mobil) |

- [x] P1.2 MVP (`shared-backend` `compare.controller`, `karsilastirma` + `localStorage`, Antigravity mobil tablo kontrolü önerilir)

### P1.3 Bayi ağı (public)

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P1.3a | `GET /api/v1/dealers/public` (+ `q`, `city`, `region`, sayfalama) | ● | ○ |
| P1.3b | Frontend `/bayi-agi` harita + arama + kart | ● | ● (harita + liste denge) |

- [x] P1.3 MVP (`136_dealer_public_location.sql`, `list_public` + koordinat alanları; Antigravity mobil harita/liste doğrulaması önerilir)

### P1.4 Toplu satış / kooperatif sayfası

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P1.4a | Offer modülü / form entegrasyonu | ● | ● (CTA ve güven metinleri) |
| P1.4b | Frontend `/toplu-satis` | ● | ● |

- [x] P1.4 MVP (`/toplu-satis` locale metadata + hreflang hizalandi; public offer formundaki hardcode metinler `Offers` namespace'ine tasindi; `en/de` mesaj eksikleri kapatildi ve frontend build temiz dogrulandi`)

---

## P2 — Orta vade (Ay 2–3)

### P2.1 Bilgi bankası derinleştirme

- [x] MVP: kütüphane galerisi (`/images`), Article + BreadcrumbList JSON-LD (bilgi bankası + ekim rehberi detay); ürün detayda `FAQPage` JSON-LD + etiketle ilgili kütüphane önerileri (`LibraryKnowledgeLinks`). Ek olarak ürün detay sayfasına `Product` + `BreadcrumbList` JSON-LD eklendi ve detay yüzeyindeki hardcode metinler locale mesajlarına taşındı. HowTo / tam içerik modeli içerik operasyonu + Antigravity ile genişletilir.

### P2.2 Tarımsal ürün metadata (şema + shared-types)

- [x] `products` tablosuna tarımsal kolonlar (`@agro/shared-backend` şema + `137_product_agricultural_metadata.sql`), Zod + `normalizeProduct`, admin **Tarimsal** sekmesi, ürün detay hızlı kartlar + karşılaştırma satırları. `EcosystemProduct` (`packages/shared-types`) alanları zaten mevcut; API yanıtı `snake_case` ile uyumludur.

- [x] P2.3 tamam (`/api/v1/ecosystem/content`, `x-api-key` kontrolü, `products`/`blog`/`library`/`dealers` birleşik data).

### P2.4 Ortak auth hazırlığı (ecosystem_id, sso-verify)

- [x] P2.4 tamam (`POST /api/ecosystem/sso-verify` stub endpoint, ecosystem controller entegrasyonu). `ecosystem_id` alanları P3 DB migration fazında derinleştirilecek.

---

## P3 — Uzun vade (Ay 3–6)

- [x] P3.1 Sipariş / çoklu satıcı hazırlığı — `orders.seller_id` (`138_orders_seller_id.sql`, NULL = VistaSeed), listeler/detayda `seller_name`; admin `PATCH /v1/admin/orders/:id/seller` (atama yalnızca `dealer` rolü); public `GET /v1/sellers/:id` (dealer + aktif kullanıcı). Satıcı dashboard / komisyon / `seller` rolü ayrımı sonraki iterasyon.
- [x] P3.2 Dealer finance genişletme — `139_dealer_transactions_due_date.sql` (`due_date`); `GET /v1/dealer/finance/summary` + `GET /v1/admin/dealers/:id/finance/summary` (cari + `totals_by_type` + `overdue_count` + `warnings`); işlem listelerinde `due_from`/`due_to`; admin manuel işlemde `due_date`. PDF / Telegram sonraki iterasyon.  
- [x] P3.3 Ortak paket geçişi (`shared-ui` JsonLd migration done).
- [x] P3.4 Docker Compose iyileştirme (`ecosystem-network` and healthchecks done).

---

## P4 — Sonraki iterasyonlar (plan §2.13–2.15 tamamlayıcılar)

- [x] P4.1 Çoklu satıcı (MVP) — `GET /v1/seller/orders`, `GET /v1/seller/orders/:id`, `GET /v1/seller/orders/summary` (yalnızca `dealer` rolü); özet: durum bazlı adet + `platform_commission` oranına göre tahmini komisyon/satıcı payı. Stok (`product_stock`) ve ayrı `seller` rolü sonraki iterasyon.
- [x] P4.2 Dealer finance — `POST /v1/dealer/finance/send-alerts` (uyarı varken e-posta + Telegram `telegramNotify`; e-posta başarılıysa saatlik cooldown); `GET /v1/dealer/finance/statement.pdf` (pdfkit, son 500 hareket). Otomatik cron yok — sonraki iterasyon.
- [x] P4.3 Ortak paketler — `shared-config` (`tailwind-tokens` + `data-brand="vistaseed"`), `shared-types` bağımlılığı ve TS path’leri; `shared-ui` + `shared-backend` için aşamalı taşıma.

---

## P5 — Operasyon / otomasyon

- [x] P5.1 Admin toplu cari uyarısı — `POST /v1/admin/dealers/finance/run-alerts` (onaylı `dealer_profiles`; `sendDealerFinanceAlerts(..., { skipCooldown: true })`). Harici cron: günlük `curl` + admin JWT veya ayrı API anahtarı sonraki iterasyon.

---

## P6 — İçerik ve sayfa backlog (`yapilacaklar.md`)

**Kaynak (detay + checkbox’lar):** [`yapilacaklar.md`](./yapilacaklar.md)

Özet: VistaSeed’e özel blog, RSS (içe/dışa), referanslar sayfası onarımı, Ar-Ge ve ekim rehberi doldurma, bilgi bankası (Bereket Fide / ortak `library` hizası), `/urunler` kırık görseller, TR karakter kalitesi.

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P6.1 | Blog: VistaSeed içerik, RSS dışa, ekosistem RSS içe, haberler stratejisi | ● | ● (okuma, boş durum) |
| P6.2 | Referanslar: hata gider, grup şirket / harici site içerikleri | ● | ● (kart / logo grid) |
| P6.3 | Ar-Ge merkezi: premium metin + lab / sürdürülebilirlik görselleri | ● | ● |
| P6.4 | Ekim rehberi: liste + detay içerik | ● | ● |
| P6.5 | Bilgi bankası: içerik + ortak backend/frontend (`library`) | ● | ● |
| P6.6 | `/urunler` kırık ürün görselleri (URL, seed, API) | ● | ● (görsel oranları) |
| P6.7 | Frontend TR metinleri — doğru Türkçe karakterler | ● | ● (dil tutarlılığı) |

- [x] P6 tamam — `yapilacaklar.md`: ürün görseli önceliği, referans `by-slug` + galeri, `/api/v1/library`, ekim kapakları, Ar-Ge `153`, RSS `Cache-Control` + `CALISTIRMA.md` §8, TR örnek metinleri. RSS **içe** alma + ayrı haber modülü sonraki iterasyon.

---

## İçerik takvimi (operasyon — plan §3)

| Frekans | İçerik | Not |
|---------|--------|-----|
| Haftalık | Blog + bilgi bankası | Metin/SEO işi; uygulama P1.1 sonrası |
| Aylık | Hedef tablo (plan §3) | Ürün + rehber sayıları |

---

## Codex için görev şablonu (kopyala-yapıştır)

```
Bağlam: VistaSeed monorepo — projects/vistaseed (Fastify backend, Next frontend/admin).
Kaynak: EKOSISTEM-PLAN.md + EKOSISTEM-CHECKLIST.md.

Hedef sprint: [P0 / P1 / …] — [madde no, örn. P1.1a]

Kurallar:
- Backend: controller’da DB yok; repository `repo*`; router ince.
- Ortak kod: @agro/shared-backend; değişiklikten sonra kökte `bun run build:shared`.
- Bun kullan; npm değil.

Yapılacaklar:
1. …
2. …
3. Test: `bun run typecheck` / `bun run build` (ilgili paket)

Çıktı: PR açıklaması + dokunulan dosya listesi.
```

---

## Antigravity (UI/UX) için görev şablonu (kopyala-yapıştır)

```
Proje: VistaSeed public site — Next.js, Tailwind v4, mevcut tema token’ları.
Kaynak: EKOSISTEM-PLAN.md + EKOSISTEM-CHECKLIST.md.

Ekran / özellik: [örn. Blog liste, Bayi ağı harita, Karşılaştırma tablosu]

İstenen:
- Sayfa hiyerarşisi (H1–H3), boş durumlar, yükleme durumu
- Mobil / masaüstü kırılımlar, dokunma hedefleri
- Erişilebilirlik: kontrast, odak sırası, form hata mesajları
- Mevcut Shadcn / layout ile tutarlılık

Çıktı: Madde madde UX önerisi; mümkünse ekran bazlı kontrol listesi veya wireframe tarifi (metin).
Uygulama kodunu Codex’e bırak; sen sadece spesifikasyon ve doğrulama.
```

---

## Mevcut durum (manuel güncelle)

| Alan | Not |
|------|-----|
| Backend `dev` | Auth route şemaları `fromZodSchema` ile düzeltildi (shared-backend). |
| `build:shared` | Monorepo kökü veya `vistaseed/package.json` üzerinden. |
| Port | Backend 8083; frontend/admin `.env.example` API origin 8083 ile hizalı. Admin prod varsayılanı 3030 olarak dokümanla hizalandı. |
| Next 16 | Frontend ve admin `next@16.2.1`; production build doğrulandı. |
| Testler | Backend `src/test/*` suite yeşil. Frontend Vitest `src/i18n/routing.test.ts` + `src/lib/seo.test.ts` ile yeşil. |
| Sitemap | Ürün URL’leri için API çağrısı `/api/v1/products` olarak düzeltildi. |
| Vitest | `src/i18n/routing.test.ts` + `src/lib/seo.test.ts` ile `bun run test` yeşil. |
| CORS | `backend/.env.example`: `localhost:3030` admin dev için eklendi. |
| Blog | Public `GET /api/v1/blog`, `GET /api/v1/blog/:slug`, `GET /api/v1/feed/rss`; admin `/admin/blog`; frontend `/[locale]/blog` SSG, `[slug]` canonical/hreflang ile doğrulandı. |
| Ürün karşılaştırma | `GET /api/v1/products/compare?ids=` (2–5 UUID, `shared-backend`); frontend `/{locale}/karsilastirma`; ürün listesinde seçim barı + detayda listeye ekleme doğrulandı. |
| Bayi ağı | `GET /api/v1/dealers/public`; `dealer_profiles` + `136` konum alanları; `/{locale}/bayi-agi` filtre + kapsama paneli aktif. Tam inject testi için local DB’de `133` + `136` seedleri gerekli. |
| Bilgi bankası (P2.1) | Detay: galeri + Article/BreadcrumbList JSON-LD; ürün detay: FAQPage JSON-LD + `LibraryKnowledgeLinks` (etiket → `GET /api/library?q=`). |
| Ortak paketler (P4.3) | Frontend: `@agro/shared-config` + `@agro/shared-types`; `globals.css` `tailwind-tokens`; `layout.tsx` `data-brand="vistaseed"`. |
| Dealer finance (P4.2) | `POST /dealer/finance/send-alerts`, `GET /dealer/finance/statement.pdf`; `pdfkit` bağımlılığı. |
| Admin toplu uyarı (P5.1) | `POST /admin/dealers/finance/run-alerts` — onaylı bayiler. |

---

*Bu dosya `EKOSISTEM-PLAN.md` ile birlikte güncellenir. Tamamlanan maddeler `[x]` yapılır.*
