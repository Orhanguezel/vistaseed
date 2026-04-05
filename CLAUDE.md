# CLAUDE.md — VistaSeed (Kurumsal Site)

## Proje Özeti

VistaSeed kurumsal web sitesi. Fastify backend + Next.js frontend + Next.js admin panel.
İçerikler seed dosyaları ile yönetilir, backend proje ismine bağımlı değildir.

## @agro/shared-backend Entegrasyonu

Bu proje `@agro/shared-backend` workspace paketini kullanır. 22 ortak modül packages/'tan gelir.

```bash
# Çalışmaya başlamadan önce (root dizinde):
bun install && bun run build:shared

# Sonra proje backend'inde:
cd projects/vistaseed/backend && bun run dev
```

- Ortak modüller: `src/modules/<modul>/index.ts` -> re-export from `@agro/shared-backend`
- Proje-spesifik modüller: `src/modules/<modul>/` -> tam kod burada
- Detaylı rehber: `packages/KULLANIM.md`
- Ortak modül değiştiğinde: root'tan `bun run build:shared` çalıştır

### Proje-Spesifik Modüller (bu repoda, tam kod)
dashboard, db_admin, dealerFinance, jobApplications, jobListings, offers, orders, popups, review, slider, support, wallet

## Workspace Haritası

```
project-root/
├── backend/          Fastify v5, Bun, MySQL + Drizzle ORM, TypeScript strict
├── frontend/         Next.js 16 App Router, React 19, Tailwind CSS v4
├── admin_panel/      Next.js admin panel (bağımsız çalışır)
├── doc/              İçerik dokümanları, planlama, modül referansları
│   ├── 00-modul-planlama.md   Ana modül planı
│   ├── backend-planlama.md    Backend faz planı
│   └── 01-07-*.md             Sayfa içerik dokümanları
└── .claude/          Claude Code ayarları ve agent'lar
```

## Teknoloji Stack

### Backend
- **Runtime:** Bun
- **Framework:** Fastify v5
- **DB:** MySQL 8 + Drizzle ORM
- **Auth:** JWT (cookie: `access_token`) + argon2/bcrypt
- **Validation:** Zod
- **Modül pattern:** `router.ts`, `admin.routes.ts`, `controller.ts`, `schema.ts`, `validation.ts`, `service.ts`, `repository.ts`

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Dark mode:** `data-theme="dark"` attribute (next-themes)
- **Tailwind v4:** `@theme` direktifi `globals.css` icinde — `tailwind.config.ts` yok
- **State:** Zustand
- **Validation:** Zod

### Admin Panel
- **Framework:** Next.js (App Router)
- **UI:** React, Tailwind CSS, Shadcn UI
- **i18n desteği:** Çoklu dil

## Backend Kodlama Standartları

### Modül Dosya Yapısı
```
modules/{modul}/
  schema.ts            — Drizzle tablo tanımları + TypeScript tipler
  validation.ts        — Zod şemaları (input validation)
  repository.ts        — TUM DB sorguları (read + write), repo* prefix
  controller.ts        — Public route handler'lar
  admin.controller.ts  — Admin route handler'lar
  service.ts           — İş mantığı (opsiyonel, karmaşık iş akışlarında)
  router.ts            — Public route tanımları (SADECE route kayıtları)
  admin.routes.ts      — Admin route tanımları (SADECE route kayıtları)
  helpers/             — Modül-spesifik yardımcı fonksiyonlar
```

### Dosya Sorumluluklari

| Dosya | Icerik | Yasak |
|-------|--------|-------|
| `router.ts` | Route tanımları, path + handler eşleştirmesi | İş mantığı, DB sorgusu, validation |
| `admin.routes.ts` | Admin route tanımları | İş mantığı, DB sorgusu, validation |
| `controller.ts` | Public handler fonksiyonlari, input parse, repo/service cagrisi | DB sorgusu (SELECT/INSERT/UPDATE/DELETE) |
| `admin.controller.ts` | Admin handler fonksiyonlari | DB sorgusu |
| `repository.ts` | Drizzle/SQL sorguları (read + write), `repo*` prefix | İş mantığı, HTTP response |
| `service.ts` | Çoklu repo çağrısı, transaction yönetimi, harici servis | DB sorgusu, HTTP response |
| `schema.ts` | Drizzle tablo tanımları, `Insert`/`Select` type export | İş mantığı |
| `validation.ts` | Zod şemaları, inferred type export | İş mantığı |

### Ust Duzey Dosya Yapisi (backend/src/)
```
src/
  app.ts             — Plugin kayıtları (CORS, JWT, cookie, static, multipart)
  app.helpers.ts     — app.ts yardımcıları
  routes.ts          — TUM modül import'ları + registerAllRoutes
  index.ts           — Sunucu baslatma
  core/
    env.ts           — Environment degiskenleri (tek kaynak)
    error.ts         — Global 404 + error handler
    i18n.ts          — Locale normalize + runtime default
  common/
    middleware/       — Auth guard (requireAuth), rol guard (requireAdmin)
    events/bus.ts    — In-process event bus
  plugins/           — Fastify plugin'leri (authPlugin, mysql)
  db/                — Drizzle client + seed dosyalari
    seed/
      data/          — JSON seed verileri (içerikler burada)
      sql/           — SQL migration dosyalari
      run-seed.ts    — Seed çalıştırıcı
  modules/           — İş modülleri
    _shared/         — Ortak helper/type/util barrel
```

### Kesin Kurallar

1. **Router SADECE route tanımlar.** Handler router dosyasında OLMAZ. Router 30 satırı geçmez.
2. **Controller'da DB sorgusu yok.** Tum INSERT/SELECT/UPDATE/DELETE `repository.ts`'de.
3. **Repository'de HTTP yok.** `req`/`reply` objeleri repository'ye gecmez.
4. **Repository fonksiyonlari `repo` prefix ile baslar.** Orn: `repoGetProductById`, `repoCreateProduct`.
5. **Dosya boyutu limiti:** Hicbir dosya 200 satiri gecmez. Gecerse bolunur.
6. **Kod tekrarı yok.** Ortak helper/type/util `_shared/` içinde tanımlanır.
7. **`_shared/index.ts` barrel.** Yeni `_shared/` dosyasi eklenince barrel'a eklenir.
8. **`_shared/http.ts` zorunlu import.** Her controller: `getAuthUserId`, `handleRouteError`, `sendNotFound`, `parsePage`.
9. **try/catch her handler'da.** Naked throw yasak.
10. **UUID:** `import { randomUUID } from "crypto"` ile oluştur.
11. **Decimal:** DB'ye `String(number)` olarak yaz, okurken `parseFloat()`.
12. **Locale fallback:** Default locale `'tr'`. Hardcoded `'de'` veya `'en'` fallback YASAK.
13. **Hard-code proje ismi YASAK.** Backend kodunda proje ismi gecmez. Icerikler seed/env uzerinden gelir.

### Ornek Router (router.ts)
```typescript
import type { FastifyInstance } from 'fastify';
import { listProducts, getProductBySlug } from './controller';

export async function registerProducts(app: FastifyInstance) {
  const B = '/products';
  app.get(B, listProducts);
  app.get(`${B}/:slug`, getProductBySlug);
}
```

### Ornek Admin Routes (admin.routes.ts)
```typescript
import type { FastifyInstance } from 'fastify';
import { adminListProducts, adminGetProduct, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from './admin.controller';

export async function registerProductsAdmin(app: FastifyInstance) {
  const B = '/products';
  app.get(B, adminListProducts);
  app.get(`${B}/:id`, adminGetProduct);
  app.post(B, adminCreateProduct);
  app.put(`${B}/:id`, adminUpdateProduct);
  app.delete(`${B}/:id`, adminDeleteProduct);
}
```

## Backend Modülleri

### Aktif Modüller
| Modul | Amaç |
|-------|------|
| `auth` | Kimlik doğrulama, JWT, rol yönetimi |
| `audit` | HTTP/auth event loglama, analitik |
| `categories` | Kategori yönetimi (i18n) |
| `contact` | İletişim formu |
| `customPages` | CMS sayfaları (slug, i18n) |
| `emailTemplates` | Email şablon yönetimi |
| `health` | Health check |
| `mail` | Email gönderim (SMTP) |
| `notifications` | Bildirim sistemi |
| `products` | Ürün katalogu (i18n) |
| `profiles` | Kullanıcı profilleri |
| `siteSettings` | Site ayarları (key-value, locale) |
| `storage` | Dosya yükleme (Cloudinary/local) |
| `support` | SSS + destek ticket |
| `telegram` | Telegram bot entegrasyonu |
| `theme` | UI tema ayarları |
| `userRoles` | Rol yönetimi |

### Kaldırılması Gereken Modüller (PaketJet Kalıntıları)
- `bookings`, `carriers`, `carrier-bank`, `ilanlar`, `ratings`
- `withdrawal`, `subscription`, `offer`, `wallet`, `reports`, `dashboard`

### Eklenmesi Gereken Modüller
- `jobListings` — İş ilanları (i18n)
- `jobApplications` — İş başvuruları (CV yükleme)

## Çalışma Kuralları

- Yeni backend modülü eklenince `routes.ts`'e register edilir (app.ts'e değil)
- İçerikler seed dosyaları ile taşınır (`src/db/seed/data/*.json`)
- `.env.example` içinde proje ismi yerine placeholder kullanılır
- Admin route'lar `routes.ts`'de guard alir. Bireysel `admin.routes.ts`'de guard TEKRARLANMAZ
- Her modül bağımsız test edilebilir olmalı

## Detaylı Planlama Dokümanları

- `doc/backend-planlama.md` — Backend faz planı ve iş sırası
- `doc/00-modul-planlama.md` — Genel modül planlama
