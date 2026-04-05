# @agro/shared-backend — Kullanim Rehberi

## Hizli Baslangiç

```bash
# 1. Root'tan bun install (workspace linkleri kurulur)
cd tarim-dijital-ekosistem
bun install

# 2. shared-backend declaration dosyalarini olustur
bun run build:shared

# 3. Proje backend'ine gec ve calistir
cd projects/<proje>/backend
bun run dev
```

## Yeni Proje Ekleme (Sifirdan)

### Adim 1: Proje iskeletini olustur

```bash
mkdir -p projects/<proje-adi>/backend/src/{modules,db,core,plugins,types}
cd projects/<proje-adi>/backend
bun init
```

### Adim 2: package.json'a workspace dependency ekle

```json
{
  "name": "<proje-adi>-backend",
  "dependencies": {
    "@agro/shared-backend": "workspace:*",
    "@agro/shared-types": "workspace:*",
    "fastify": "^5",
    "drizzle-orm": "^0.44.0",
    "mysql2": "^3.15.0",
    "zod": "^3.23.0"
  }
}
```

### Adim 3: Root package.json'a workspace olarak ekle

```json
{
  "workspaces": [
    "packages/shared-backend",
    "packages/shared-types",
    "packages/shared-config",
    "projects/<proje-adi>/backend"
  ]
}
```

Sonra root'tan `bun install` calistir.

### Adim 4: tsconfig.json olustur

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@agro/shared-backend/*": ["../../../packages/shared-backend/dist/*"],
      "@agro/shared-types": ["../../../packages/shared-types/index.ts"],
      "@agro/shared-types/*": ["../../../packages/shared-types/*"]
    },
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "../../../packages/shared-backend/dist/types.d.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
```

### Adim 5: Ortak modulleri re-export ile bagla

Her ortak modul icin `src/modules/<modul>/index.ts` olustur:

```typescript
// src/modules/auth/index.ts
export * from '@agro/shared-backend/modules/auth';
```

Alt dosyalara da erisim gerekiyorsa (schema, router vs):

```typescript
// src/modules/auth/schema.ts
export * from '@agro/shared-backend/modules/auth/schema';
```

### Adim 6: Proje-spesifik modulleri yaz

```typescript
// src/modules/prices/schema.ts — PROJEYE OZEL, tam kod burada
import { mysqlTable, int, varchar, decimal, timestamp } from 'drizzle-orm/mysql-core';

export const prices = mysqlTable('prices', {
  id: int('id').autoincrement().primaryKey(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  market: varchar('market', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Adim 7: routes.ts'de ortak + ozel modulleri birlikte kaydet

```typescript
// src/routes.ts
import type { FastifyInstance } from 'fastify';

// Ortak moduller — @agro'dan geliyor
import { registerAuth } from '@/modules/auth';
import { registerStorage } from '@/modules/storage';
import { registerAudit } from '@/modules/audit';
import { registerContact } from '@/modules/contact';

// Proje-spesifik moduller — src/modules/ icinde
import { registerPrices } from './modules/prices/router';

export async function registerAllRoutes(app: FastifyInstance) {
  await app.register(registerAuth, { prefix: '/api' });
  await app.register(registerStorage, { prefix: '/api' });
  await app.register(registerAudit, { prefix: '/api' });
  await app.register(registerContact, { prefix: '/api' });
  await app.register(registerPrices, { prefix: '/api' });
}
```

## Mevcut Projeyi (Bereketfide/VistaSeed) Gecirme

### Strateji: kademeli, guvenli

```
1. tsconfig.json'a @agro/ path alias ekle
2. package.json'a @agro/shared-backend: "workspace:*" ekle
3. Root'tan bun install
4. bun run build:shared
5. Ortak modul dizinlerini tek satirlik re-export'a donustur
   (once 1 modul, test et, sonra digerlerini)
6. Alt dosya import'lari icin de re-export dosyalari olustur
7. typecheck -> 0 hata oldugunu dogrula
```

### Kural: Sprint basina en fazla 3 modul

Canli projelerde toplu degisiklik yapma. Her sprint'te 2-3 modul gecir, test et, deploy et.

## Gunluk Calisma Akisi

```bash
# Sabah — packages degisti mi kontrol et
bun run build:shared

# Proje gelistirme
cd projects/<proje>/backend
bun run dev

# Typecheck
bun run typecheck    # veya: npx tsc --noEmit
```

## packages/shared-backend Degisikligi Yaptiginda

```bash
# 1. packages icinde degisiklik yap
# 2. packages icinde typecheck
bun run check:shared

# 3. Declaration dosyalarini guncelle
bun run build:shared

# 4. Kullanan projelerde typecheck
cd projects/vistaseed/backend && npx tsc --noEmit
cd projects/bereketfide/backend && npx tsc --noEmit
```

## Ortak 22 Modul Listesi

| Modul | Import | Ne Yapar |
|-------|--------|----------|
| `_shared` | `@agro/shared-backend/modules/_shared` | Barrel: tum ortak util'ler |
| `auth` | `@agro/shared-backend/modules/auth` | JWT, RBAC, session |
| `products` | `@agro/shared-backend/modules/products` | Urun katalogu |
| `categories` | `@agro/shared-backend/modules/categories` | Kategori yonetimi |
| `subcategories` | `@agro/shared-backend/modules/subcategories` | Alt kategoriler |
| `gallery` | `@agro/shared-backend/modules/gallery` | Gorsel galeri |
| `library` | `@agro/shared-backend/modules/library` | Dijital kaynak |
| `references` | `@agro/shared-backend/modules/references` | Referanslar |
| `storage` | `@agro/shared-backend/modules/storage` | Dosya yukleme |
| `customPages` | `@agro/shared-backend/modules/customPages` | CMS sayfalari |
| `siteSettings` | `@agro/shared-backend/modules/siteSettings` | Site ayarlari |
| `contact` | `@agro/shared-backend/modules/contact` | Iletisim formu |
| `newsletter` | `@agro/shared-backend/modules/newsletter` | Abone yonetimi |
| `emailTemplates` | `@agro/shared-backend/modules/emailTemplates` | Email sablonlari |
| `notifications` | `@agro/shared-backend/modules/notifications` | Bildirimler |
| `telegram` | `@agro/shared-backend/modules/telegram` | Bot entegrasyonu |
| `theme` | `@agro/shared-backend/modules/theme` | UI tema |
| `audit` | `@agro/shared-backend/modules/audit` | Audit log |
| `ai` | `@agro/shared-backend/modules/ai` | AI icerik |
| `mail` | `@agro/shared-backend/modules/mail` | Email gonderim |
| `userRoles` | `@agro/shared-backend/modules/userRoles` | Rol yonetimi |
| `profiles` | `@agro/shared-backend/modules/profiles` | Kullanici profilleri |
| `health` | `@agro/shared-backend/modules/health` | Health check |

## Ortak Tipler

```typescript
import type { EcosystemProduct, EcosystemUser, Locale, Platform } from '@agro/shared-types';
```

## Kurallar

- Hard kod YASAK
- Kod tekrari YASAK
- 2+ projede kullanilan modul -> packages/'a tasinir
- Tek projeye ozel modul -> projenin src/modules/ icinde kalir
- `@/modules/_shared` barrel uzerinden import, alt dosyaya direkt erisim yok
- Dosya 200 satiri gecmez
- Gereksiz yorum yok
