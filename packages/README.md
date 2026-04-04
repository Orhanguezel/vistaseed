# Ekosistem Ortak Paketler

Bu dizin, Tarim Dijital Ekosistem projelerinin paylasimli kodlarini icerir. Bereketfide ve VistaSeed backend'lerinde **20 modul neredeyse birebir ayni** — bu paketler kod tekrarini %60-70 oraninda azaltir.

## Paket Yapisi

```
packages/
├── shared-backend/          # Fastify backend ortak kodlari
│   ├── core/                # env, error, i18n temel altyapi
│   ├── modules/             # Ortak is modulleri (auth, products, gallery...)
│   ├── plugins/             # Fastify plugin'leri (mysql, auth, redis, sentry)
│   ├── middleware/           # Auth guard, role guard, locale
│   └── utils/               # http helpers, validation, parsing, time
├── shared-types/            # Ortak TypeScript tip tanimlari
├── shared-config/           # ESLint, Tailwind base tokens, TS config
└── shared-ui/               # Ortak React bilesenleri
    ├── admin/               # Admin panel ortak (data-table, form-builder, sidebar)
    └── public/              # Public site ortak (header, footer, seo)
```

## Ortaklastirma Matrisi

### Tamamen Ayni (Hemen cikarilabilir)
| Modul | Bereketfide | VistaSeed | Durum |
|-------|-------------|-----------|-------|
| gallery | 7 dosya | 7 dosya | Birebir ayni |
| library | 7 dosya | 7 dosya | Birebir ayni |
| references | 7 dosya | 7 dosya | Birebir ayni |
| newsletter | 3 dosya | 3 dosya | Birebir ayni |
| products | 12 dosya | 12 dosya | Birebir ayni |
| ai | 1 dosya | 1 dosya | Birebir ayni |

### Cok Benzer (%90-95 ortak)
| Modul | Fark | Aksiyon |
|-------|------|---------|
| audit | VistaSeed'de index.ts barrel | VistaSeed versiyonu baz |
| auth | VistaSeed'de admin.validation + repository | VistaSeed versiyonu baz |
| categories | Farkli helper/repository yapisi | Birlestir |
| storage | VistaSeed'de bulk.ts ekstra | VistaSeed versiyonu baz |
| siteSettings | VistaSeed admin split | VistaSeed versiyonu baz |
| theme | VistaSeed'de repository.ts | VistaSeed versiyonu baz |
| notifications | VistaSeed'de repository.ts | VistaSeed versiyonu baz |
| customPages | VistaSeed'de repository.ts | VistaSeed versiyonu baz |
| contact | Benzer yapi | Birlestir |
| emailTemplates | VistaSeed'de repository.ts | VistaSeed versiyonu baz |

### Utils Karsilastirma
| Dosya | Bereketfide | VistaSeed | Karar |
|-------|-------------|-----------|-------|
| http.ts | YOK | VAR | VistaSeed'den al (KRITIK) |
| repo-helpers.ts | YOK | VAR | VistaSeed'den al |
| admin.helpers.ts | YOK | VAR | VistaSeed'den al |
| cache.ts | YOK | VAR | VistaSeed'den al |
| dto.ts | YOK | VAR | VistaSeed'den al |
| parse.ts | YOK | VAR | VistaSeed'den al |
| schemas.ts | YOK | VAR | VistaSeed'den al |
| contentRange.ts | VAR | VAR | Birlestir |
| flags.ts | VAR | VAR | Birlestir |
| json.ts | VAR | VAR | Birlestir |
| locale.ts | VAR | VAR | Bereketfide baz (daha olgun) |
| longtext.ts | VAR | VAR | Birlestir |
| time.ts | VAR | VAR | Birlestir |
| validation.ts | VAR | VAR | Birlestir |
| queryParser.ts | VAR | YOK | Bereketfide'den al |

### Plugin Karsilastirma
| Plugin | Bereketfide | VistaSeed | Karar |
|--------|-------------|-----------|-------|
| authPlugin.ts | VAR | VAR | Birlestir |
| mysql.ts | VAR | VAR | Birlestir |
| redis.ts | YOK | VAR | VistaSeed'den al, Bereketfide'ye ekle |
| sentry.ts | YOK | VAR | VistaSeed'den al, Bereketfide'ye ekle |
| swagger.ts | YOK | VAR | VistaSeed'den al |
| i18n-locale.ts | VAR | YOK | Bereketfide'den al |
| staticUploads.ts | VAR | YOK | Bereketfide'den al |

## Uygulama Stratejisi

### Faz 1: Sadece Tip ve Config (Hafta 1-2, RISK YOK)
- `shared-types/` — Ortak TypeScript interface'leri (EcosystemProduct, EcosystemUser)
- `shared-config/` — TSConfig base, Tailwind base tokens, ESLint config
- Projeler import ederek kullanir, mevcut koda dokunmaz

### Faz 2: Utils Cikartma (Hafta 2-3, DUSUK RISK)
- `shared-backend/utils/` — VistaSeed _shared/ dosyalarini ortak pakete tasi
- Bereketfide bu utils'leri import etmeye baslar (mevcut _shared/ korunur, kademeli gecis)

### Faz 3: Plugin Birlestirme (Hafta 3-4, ORTA RISK)
- `shared-backend/plugins/` — authPlugin, mysql, redis, sentry
- Projeler plugin'leri ortak paketten import eder

### Faz 4: Modul Cikartma (Ay 2-3, YUKSEK DEGER)
- `shared-backend/modules/` — gallery, library, references, newsletter (en kolay olanlar once)
- Sonra: auth, products, audit, storage, siteSettings

### Faz 5: UI Bilesenleri (Ay 3+)
- `shared-ui/admin/` — data-table, form-builder, json-editor, sidebar
- `shared-ui/public/` — SEO components, footer, analytics

## Kural: Proje-Spesifik Moduller Tasinmaz

Su moduller projelere ozgu kalir:
- **Bereketfide:** offer (fide teklif), services, menuItems, comments
- **VistaSeed:** orders, wallet, dealerFinance, jobListings, jobApplications, review, support, popups, slider, userRoles, db_admin

## Teknik Detaylar

### Import Yontemi
```typescript
// Proje backend'inde kullanim ornegi:
import { authPlugin } from '@eco/shared-backend/plugins';
import { galleryModule } from '@eco/shared-backend/modules/gallery';
import { getAuthUserId, handleRouteError } from '@eco/shared-backend/utils';
import type { EcosystemProduct } from '@eco/shared-types';
```

### Package.json Workspace
```json
// Kok package.json
{
  "workspaces": [
    "packages/*",
    "projects/bereketfide/*",
    "projects/vistaseed/*"
  ]
}
```

### Temel Prensip
VistaSeed'in kodlama kaliplari daha olgun (barrel export, repository pattern, admin split). Ortaklastirmada **VistaSeed kaliplari referans alinir**, Bereketfide'nin olgun i18n ve tema token sistemi korunur.
