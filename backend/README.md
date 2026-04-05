# Corporate Site Backend

Kurumsal web sitesi backend API katmani.

Gelistirme kurallari icin:

- [BACKEND_RULES.md](BACKEND_RULES.md)
- [CLAUDE.md](CLAUDE.md)

Temel yapi:

- Bun runtime
- Fastify v5
- MySQL / MariaDB + Drizzle ORM
- JWT tabanli auth
- Modul bazli yapi (auth, products, categories, contact, support, storage, vb.)

## Calistirma

### 1. Env dosyasini olustur

```bash
cp .env.example .env
```

### 2. Veritabanini hazirla

Lokal docker-compose kullanacaksan:

```bash
docker compose up -d vistaseed-db
```

Bu compose varsayilan olarak sunlari kullanir:

- `DB_NAME=mydb`
- `DB_USER=app`
- `DB_PASSWORD=app`
- Ag: `ecosystem-network`; DB servisi: `vistaseed-db`

API ve DB birlikte (imaj build):

```bash
docker compose up -d --build
```

Gelistirme override (`NODE_ENV=development`, DB health daha sik):

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### 3. Backend'i baslat

```bash
bun run dev
```

## Seed (Veritabani Olusturma)

```bash
bun run seed
```

Bu komut `src/db/seed/sql/` altindaki SQL dosyalarini sirasyla calistirir.
`{{SITE_NAME}}`, `{{ADMIN_EMAIL}}`, `{{EDITOR_EMAIL}}` gibi placeholder'lar `.env` degerlerinden enjekte edilir.

## Sik Gorülen Hata

### `Access denied for user 'app'@'localhost' to database 'mydb'`

Anlami:

- backend `.env` icinde `DB_USER=app`, `DB_PASSWORD=app`, `DB_NAME=mydb` ile acilmaya calisiyor
- ama MySQL tarafinda bu kullanicinin veritabanina yetkisi yok

Iki cozum yolu var.

### Cozum 1: Kullaniciya yetki ver

```sql
CREATE DATABASE IF NOT EXISTS mydb;
CREATE USER IF NOT EXISTS 'app'@'localhost' IDENTIFIED BY 'app';
GRANT ALL PRIVILEGES ON mydb.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```

### Cozum 2: `.env` icindeki DB kullanicisini mevcut kullaniciya gore degistir

Ornek:

```env
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mydb
```

## Env Notlari

Guncel beklenti:

- `src/core/env.ts` fallback olarak `DB_NAME=mydb` kullanir
- `.env.example` local gelistirme akisini referans alir
- `SITE_NAME` env degiskeni seed ve mail sablonlarinda kullanilir

Storage:

- `STORAGE_DRIVER=local` veya `cloudinary`
- local modda `LOCAL_STORAGE_ROOT` ve `LOCAL_STORAGE_BASE_URL` gerekir
- cloudinary modda `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` gerekir

## Gelistirme Notlari

- `.env` icine gercek secret koyuyorsan bu dosya commit edilmemeli
- prod ayarlari local defaultlarla karistirilmamali
- local backend ve admin panel ayni API base URL'e bakmali

## Dogrulama

Backend ayarlarini degistirdikten sonra su akis yeterlidir:

```bash
bun run dev
```

Beklenen:

- server DB'ye baglanir
- `localhost:8083` uzerinde ayaga kalkar
- auth ve admin endpoint'leri cevap vermeye baslar
