# VistaSeed — Ekosistem planı kontrol listesi

**Kaynak:** `EKOSISTEM-PLAN.md`  
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
| P1.1a | Backend: blog modülü veya `customPages` genişletme, RSS `GET /api/...` | ● | ○ |
| P1.1b | Admin: blog yönetim ekranı | ● | ● (liste/detay form UX) |
| P1.1c | Frontend: `/[locale]/blog`, `[slug]` | ● | ● (okuma deneyimi, tipografi) |

- [ ] P1.1 canlı (haftalık içerik takvimine hazır)

### P1.2 Ürün karşılaştırma

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P1.2a | `GET /api/v1/.../products/compare?ids=` | ● | ○ |
| P1.2b | Frontend `/karsilastirma` seçim + tablo/kart | ● | ● (karşılaştırma grid, mobil) |

- [ ] P1.2 MVP

### P1.3 Bayi ağı (public)

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P1.3a | `GET /api/.../dealers/public` (+ filtre) | ● | ○ |
| P1.3b | Frontend `/bayi-agi` harita + arama + kart | ● | ● (harita + liste denge) |

- [ ] P1.3 MVP

### P1.4 Toplu satış / kooperatif sayfası

| # | Görev | Codex | Antigravity |
|---|--------|:-----:|:-----------:|
| P1.4a | Offer modülü / form entegrasyonu | ● | ● (CTA ve güven metinleri) |
| P1.4b | Frontend `/toplu-satis` | ● | ● |

- [ ] P1.4 MVP

---

## P2 — Orta vade (Ay 2–3)

### P2.1 Bilgi bankası derinleştirme

- [ ] Ürün bazlı alt sayfalar, görseller, JSON-LD (Codex ağırlıklı; Antigravity içerik blokları ve görsel hiyerarşi)

### P2.2 Tarımsal ürün metadata (şema + shared-types)

- [ ] Migration, admin tab, frontend kartlar, `shared-types` hizası (Codex; Antigravity ürün detay bilgi kartı düzeni)

### P2.3 Content Federation API

- [ ] `/api/v1/ecosystem/content`, API key, rate limit (Codex)

### P2.4 Ortak auth hazırlığı (ecosystem_id, sso-verify)

- [ ] DB alanları, stub endpoint (Codex)

---

## P3 — Uzun vade (Ay 3–6)

- [ ] P3.1 Sipariş / çoklu satıcı hazırlığı  
- [ ] P3.2 Dealer finance genişletme  
- [ ] P3.3 Ortak paket geçişi (`shared-ui`, vb.)  
- [ ] P3.4 Docker Compose iyileştirme (`ecosystem-network`, health)

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
| i18n / SEO | Locale route akışı `[locale]` paramı ile statik korundu; sitemap alternates + canonical/hreflang üretimi doğrulandı. |
| Testler | Backend `src/test/*` suite yeşil. Frontend Vitest: `routing.test.ts` + `seo.test.ts` yeşil. |
| Sitemap | Ürün URL’leri için API çağrısı `/api/v1/products` olarak düzeltildi. |
| Vitest | `src/test/setup.ts` ve `src/i18n/routing.test.ts` ile `bun run test` yeşil. |
| CORS | `backend/.env.example`: `localhost:3030` admin dev için eklendi. |

---

*Bu dosya `EKOSISTEM-PLAN.md` ile birlikte güncellenir. Tamamlanan maddeler `[x]` yapılır.*
