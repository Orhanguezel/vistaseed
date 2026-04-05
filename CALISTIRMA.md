# VistaSeed — Projeyi çalıştırma

Bu dosya `projects/vistaseed` kökü içindir. VistaSeed, **Tarım Dijital Ekosistem** monoreposunda `@agro/shared-backend` ile bağlıdır; ilk kurulumda ortak paket derlemesi gerekir.

## Önkoşullar

- **Bun** (tercih edilen runtime / paket yöneticisi)
- **MariaDB veya MySQL 8** (yerel veya Docker)
- İsteğe bağlı: **Redis** (önbellek; geliştirmede boş bırakılabilir)

## 1. Monorepo kökünden ortak paket

Bu repoda backend, `packages/shared-backend` altında derlenmiş kodu kullanır. `build:shared` script’i **yalnızca ekosistem kökünde** (`tarim-dijital-ekosistem/package.json`) tanımlıdır; `backend/` veya `frontend/` içinden çalışmaz.

**A — Ekosistem köküne giderek** (örnek mutlak yol):

```bash
cd ~/Documents/Projeler/tarim-dijital-ekosistem
bun install
bun run build:shared
```

**B — VistaSeed kökünden** (`projects/vistaseed`; bu dosyanın bulunduğu klasör):

```bash
cd ~/Documents/Projeler/tarim-dijital-ekosistem/projects/vistaseed
bun run build:shared
```

Bu komut içerde `../..` ile ekosistem köküne çıkıp aynı `build:shared` işlemini çalıştırır.

**C — Elle** (kökte `package.json` yoksa):

```bash
cd ~/Documents/Projeler/tarim-dijital-ekosistem/packages/shared-backend
bun x tsc -p tsconfig.build.json
```

`build:shared` başarısız olursa önce ekosistem kökünde `bun install` alındığından emin olun.

## 2. Veritabanı

**Seçenek A — Docker (backend klasörü):**

```bash
cd projects/vistaseed/backend
cp .env.example .env
# .env içinde DB_* değerleri docker-compose ile uyumlu olsun (varsayılan: mydb / app / app)
docker compose up -d vistaseed-db
```

**Seçenek B — Yerel MariaDB:** `.env` içinde `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` değerlerini kendi sunucunuza göre ayarlayın.

## 3. Backend API

```bash
cd projects/vistaseed/backend
cp .env.example .env
# JWT_SECRET, COOKIE_SECRET, DB_* alanlarını doldurun
bun install
bun run db:seed
bun run dev
```

- API varsayılan adres: `http://localhost:8083`
- Sağlık kontrolü: `GET http://localhost:8083/api/health`
- REST kökü: `/api/v1/...`

Üretim derlemesi: `bun run build` → `bun run start` veya `bun run start:bun`.

## 4. Public site (frontend)

```bash
cd projects/vistaseed/frontend
cp .env.example .env.local
```

`.env.local` içinde en az:

- `NEXT_PUBLIC_API_URL=http://localhost:8083` (sadece origin; istemci `/api/v1` yolunu kullanır)

```bash
bun install
bun run dev
```

Varsayılan: `http://localhost:3000` (Next.js).

### Bayi girişi (geliştirme kısayolu)

| | |
|--|--|
| **URL (TR)** | `http://localhost:3000/tr/bayi-girisi` |
| **URL (EN)** | `http://localhost:3000/en/dealer-login` |
| **E-posta** | `bayi@example.com` |
| **Şifre** | `admin123` (seed varsayılanı; `backend/.env` içinde `DEALER_PASSWORD` ile değiştirilebilir) |

Form geliştirme modunda bu alanlar önceden doldurulur; şifre hash’i seed sırasında `DEALER_PASSWORD` üzerinden üretilir (admin şifresinden bağımsız). İlk kurulumdan sonra veya bayi şifresini güncellediğinizde: `cd backend && bun run db:seed:nodrop` (veya `--only=010a` ile ilgili dosyayı çalıştırın).

## 5. Admin panel

```bash
cd projects/vistaseed/admin_panel
cp .env.example .env
```

`.env` içinde API adresleri backend ile aynı origin olmalı (örnek):

- `NEXT_PUBLIC_API_URL=http://localhost:8083`
- `PANEL_API_URL=http://localhost:8083`
- `NEXT_PUBLIC_PANEL_API_URL=http://localhost:8083`

```bash
bun install
bun run dev
```

Varsayılan panel portu: **3030** (`http://localhost:3030`).

`predev` / `prebuild` sırasında locale manifest üretilir; sorun olursa: `bun run locales:generate`.

## 6. Port özeti (geliştirme)

| Bileşen   | Port  |
|----------|-------|
| Backend  | 8083  |
| Frontend | 3000  |
| Admin    | 3030  |
| MariaDB  | 3306  |

Backend `.env` içinde `CORS_ORIGIN`, tarayıcıdan gelen adresleri içermelidir (örnek: `http://localhost:3000,http://localhost:3030`).

## 7. Sık kontroller

- `bun run build:shared` monorepo kökünde çalıştırıldı mı?
- Backend `.env` içinde `DB_*` canlı mı ve seed alındı mı?
- Frontend / admin `.env` içinde `NEXT_PUBLIC_API_URL` backend origin ile aynı mı?

## 8. Blog RSS (ekosistem besleme)

- **URL:** `GET {BACKEND}/api/v1/feed/rss` — isteğe bağlı `?locale=tr&limit=20`
- **Yanıt:** `application/rss+xml; charset=utf-8`, `Cache-Control: public, max-age=300`
- **Önkoşul:** Backend `.env` içinde `FRONTEND_URL` (kanal linkleri için tam site kökü) tanımlı olmalıdır.

Harici sitelerden içe RSS almak için ayrı yapılandırma (kaynak URL listesi) ileride `site_settings` veya env ile eklenecek; şu an VistaSeed blogu dışa RSS verir.

## İlgili dosyalar

- `README.md` — genel bakış
- `AGENTS.md`, `CLAUDE.md` — geliştirme kuralları
- `backend/.env.example`, `frontend/.env.example`, `admin_panel/.env.example`
