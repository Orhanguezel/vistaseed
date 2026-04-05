# Backend Planlama - Detayli Checklist

## Mevcut Durum

Backend PaketJet (P2P kargo pazaryeri) kod tabanindan fork edilmistir.
~~Yaklaşık %40'i lojistik/kargo spesifik modüldur ve kaldırılacaktir.~~
**Faz 1 tamamlandı** — 11 lojistik modül silindi, routes/seed/middleware/yan etkiler temizlendi.
Hedef: **projeye özgü isimlendirme olmadan**, başka projelerde de kullanılabilir **jenerik kurumsal site backend'i** oluşturmak.

---

## Faz 1: Temizlik (Kaldırılacak Modüller) — TAMAMLANDI

Bu modüller PaketJet lojistik/kargo pazaryerine aittir ve tamamen kaldırıldı:

| Modul | Neden | Iliskili Tablolar |
|-------|-------|-------------------|
| `bookings` | Kargo rezervasyon sistemi | `bookings` |
| `carriers` | Taşıyıcı profil yönetimi | `carriers` |
| `carrier-bank` | Taşıyıcı banka hesaplari | `carrier_bank_accounts` |
| `ilanlar` | Kargo ilan pazaryeri | `ilanlar`, `ilan_photos` |
| `ratings` | Taşıyıcı puanlama | `ratings` |
| `withdrawal` | Taşıyıcı odeme cekimi | `withdrawal_requests` |
| `subscription` | Plan bazlı ilan kotasi | `plans`, `user_subscriptions` |
| `offer` | B2B teklif sistemi (Bereket Fide) | `offers`, `offer_number_counters` |
| `wallet` | Kargo odeme cuzdan sistemi | `wallets`, `wallet_transactions` |
| `reports` | Lojistik KPI raporlari | - |
| `dashboard` | Kargo dashboard (carrier/customer) | - |

### 1.1 Modul Dizinleri Silme

- [x] `src/modules/bookings/` dizinini sil
- [x] `src/modules/carriers/` dizinini sil
- [x] `src/modules/carrier-bank/` dizinini sil
- [x] `src/modules/ilanlar/` dizinini sil
- [x] `src/modules/ratings/` dizinini sil
- [x] `src/modules/withdrawal/` dizinini sil
- [x] `src/modules/subscription/` dizinini sil
- [x] `src/modules/offer/` dizinini sil
- [x] `src/modules/wallet/` dizinini sil
- [x] `src/modules/reports/` dizinini sil
- [x] `src/modules/dashboard/` dizinini sil

### 1.2 routes.ts Temizliği

- [x] `registerIlanlar` / `registerIlanlarAdmin` import ve kullanim satirlarini kaldır
- [x] `registerBookings` / `registerBookingsAdmin` import ve kullanim satirlarini kaldır
- [x] `registerBookingPayments` import ve kullanim satirini kaldır
- [x] `registerWallet` / `registerWalletAdmin` import ve kullanim satirlarini kaldır
- [x] `registerDashboard` / `registerDashboardAdmin` import ve kullanim satirlarini kaldır
- [x] `registerRatings` import ve kullanim satirini kaldır
- [x] `registerSubscription` / `registerSubscriptionAdmin` import ve kullanim satirlarini kaldır
- [x] `registerCarriersAdmin` import ve kullanim satirini kaldır
- [x] `registerCarrierBank` import ve kullanim satirini kaldır
- [x] `registerWithdrawal` / `registerWithdrawalAdmin` import ve kullanim satirlarini kaldır
- [x] `registerReportsAdmin` import ve kullanim satirini kaldır

### 1.3 Seed SQL Dosyalari Temizliği

- [x] `003_carrier_seed.sql` — silindi
- [x] `010_wallet_schema.sql` — silindi
- [x] `012_ilanlar_schema.sql` — silindi
- [x] `013_bookings_schema.sql` — silindi
- [x] `014_ilanlar_seed.sql` — silindi
- [x] `015_ratings_schema.sql` — silindi
- [x] `021_subscription_schema.sql` — silindi
- [x] `023_bookings_payment_columns.sql` — silindi
- [x] `024_payment_settings_seed.sql` — silindi (kargo-spesifik)
- [x] `025_carrier_bank_accounts_schema.sql` — silindi
- [x] `026_tasima_kurallari_seed.sql` — silindi
- [x] `027_withdrawal_requests_schema.sql` — silindi
- [x] `002_customer_seed.sql` — kaliyor (jenerik user seed)
- [x] `028_users_rules_accepted_column.sql` — kaliyor (jenerik users tablosu)
- [x] Seed `index.ts` — carrier/iyzico referanslari kaldırıldı, editor/admin rolleri eklendi

### 1.4 DB Schema Dosyalari Temizliği

- [x] Lojistik tablo schema'lari zaten modül dizinlerinde — modüllerle birlikte silindi
- [x] `_shared/dashboard-admin-types.ts` silindi, barrel güncellendi

### 1.5 Middleware Temizliği

- [x] `src/common/middleware/roles.ts` — `requireCarrierOrAdmin` silindi
- [x] `AppRole` tipi: `'admin' | 'editor'` olarak güncellendi
- [x] `requireEditor` eklendi (admin + editor erisimi)

### 1.6 Yan Etki Temizliği (Diğer Modüllerde Kargo Referansları)

- [x] `mail/service.ts` — kargo mail fonksiyonları silindi (booking, carrier, wallet)
- [x] `mail/helpers/service.ts` — `buildBookingRouteLabel`, `buildCarrierPaymentSubject`, `formatMailPrice` silindi, SITE_NAME env'den okunuyor
- [x] `mail/validation.ts` — `BookingMailInput`, `WalletMailInput` silindi
- [x] `mail/index.ts` barrel güncellendi
- [x] `siteSettings/helpers/constants.ts` — offer event key'leri silindi
- [x] `telegram/validation.ts` — booking/ilan/wallet event'leri silindi, new_user/new_contact/new_ticket kaldı
- [x] `telegram/helpers/settings-helpers.ts` — kargo event type'lari silindi
- [x] `userRoles/service.ts` — `RoleName = "admin" | "editor"`, carrier/customer silindi
- [x] `userRoles/validation.ts` — `z.enum(["admin", "editor"])` olarak güncellendi
- [x] `userRoles/schema.ts` — `mysqlEnum` içine "editor" eklendi
- [x] `auth/helpers/core.ts` — `Role = 'admin' | 'editor'`
- [x] `auth/validation.ts` — signup role: `z.enum(['editor'])`
- [x] `auth/controller.ts` — default role: `'admin'` (signup için)
- [x] `auth/admin.validation.ts` — tüm enum'lar `['admin', 'editor']`
- [x] `support/validation.ts` — kategorilerden 'kargo' ve 'odeme' silindi, 'urunler' eklendi
- [x] `_shared/admin.helpers.ts` — `wallet_balance` referansi silindi
- [x] `_shared/cache.ts` — ilan/dashboard cache fonksiyonları silindi, jenerik `list`/`detail` kaldı
- [x] `_shared/index.ts` barrel güncellendi (dashboard-admin-types, ilan cache kaldırıldı)
- [x] `_shared/time.ts` — `RangeKey`/`TrendBucket` inline tanımlandı (dashboard-admin-types import silindi)
- [x] `core/env.ts` — Iyzico/PayTR kaldırıldı, `SITE_NAME` eklendi, `DB_NAME` default `"mydb"`
- [x] `plugins/swagger.ts` — API title env'den okunan `SITE_NAME` ile dinamik
- [x] `contact/controller.ts` — hardcoded `vistaseed Ekibi` → `SITE_NAME` ile dinamik
- [x] `mail/controller.ts` — test mail subject'ten vistaseed silindi
- [x] `ecosystem.config.cjs` — `kamanilan-backend` → `corporate-backend`
- [x] `package.json` — `name: "corporate-site-backend"`, iyzipay dependency silindi, lojistik test script'leri silindi
- [x] Tum TS dosyalarindaki `// vistaseed` yorumları `// corporate-backend` olarak güncellendi
- [x] Sync conflict dosyasi silindi
- [x] Lojistik test dosyaları silindi (booking, carrier, wallet, ilan, dashboard, rating, withdrawal)
- [x] auth.test.ts, api.test.ts — carrier referanslari editor ile degistirildi

### 1.7 Type-Check Sonucu

- [x] Temizlik kaynakli **sifir yeni type hatasi**
- [x] 14 önceden vâr olan hata (`products/` modülü — eksik `subcategories`, `storage/_util`, `toBoolDefault`/`toNum`) — Faz 4.1'de düzeltildi

---

## Faz 2: Jeneriklestime — TAMAMLANDI (SQL seed jeneriklestirildi)

### 2.1 Proje Ismi Hard-Code Temizliği

- [x] `package.json` — `"corporate-site-backend"` olarak degistirildi
- [ ] `.env.example` — `DB_NAME` placeholder yap
- [ ] `.env.example` — `MAIL_FROM`, `CLOUDINARY_FOLDER` placeholder yap
- [ ] `docker-compose.yml` — container/DB isimlerini jenerik yap (env'den okunsun)
- [x] `ecosystem.config.cjs` — env'den okunan jenerik isim
- [x] `core/env.ts` — `SITE_NAME` eklendi, DB_NAME default "mydb"
- [x] Tum src/ TS dosyalarinda proje ismi gecmiyor

### 2.2 Seed Dosya Yapisi Olusturma

- [ ] `src/db/seed/data/` dizinini oluştur
- [ ] `src/db/seed/data/site-settings.json` — site ayarları (isim, logo, iletisim, sosyal medya)
- [ ] `src/db/seed/data/categories.json` — urun kategorileri (i18n destekli)
- [ ] `src/db/seed/data/faq.json` — SSS içerikleri (i18n destekli)
- [ ] `src/db/seed/data/email-templates.json` — email sablonlari
- [ ] `src/db/seed/data/roles.json` — kullanici rolleri (admin, editor)
- [ ] `src/db/seed/data/admin-user.json` — varsayilan admin kullanici
- [ ] `src/db/seed/run-seed.ts` — JSON dosyalarindan DB'ye yazici (mevcut SQL seed yerine)
- [ ] Eski SQL seed dosyalarindan jenerik olanlari JSON formatina tasi

---

## Faz 3: Kalacak Modüllerde Temizlik — TAMAMLANDI

### 3.1 Modul Bazli Kontrol

| Modul | Durum | Yapilan |
|-------|-------|---------|
| `auth` | Tamamlandı | carrier/customer rolleri editor olarak güncellendi |
| `audit` | Temiz | Yorum baslik temizligi yapildi |
| `categories` | Temiz | - |
| `contact` | Tamamlandı | Hardcoded proje ismi SITE_NAME ile degistirildi |
| `customPages` | Temiz | - |
| `emailTemplates` | Tamamlandı | Kargo template seed'leri temizlendi |
| `health` | Temiz | - |
| `mail` | Tamamlandı | Kargo mail fonksiyonları silindi |
| `notifications` | Temiz | Kargo type referansi bulunamadi |
| `products` | Tamamlandı | Type hataları düzeltildi (subcategories, _shared exports, storage path) |
| `profiles` | Temiz | - |
| `siteSettings` | Tamamlandı | offer/kargo key'leri temizlendi |
| `storage` | Temiz | - |
| `support` | Tamamlandı | Kategori listesi güncellendi |
| `telegram` | Tamamlandı | Booking/ilan/wallet event'leri silindi |
| `theme` | Tamamlandı | Yorum temizlendi |
| `userRoles` | Tamamlandı | admin + editor rolleri, carrier/customer silindi |
| `_shared` | Tamamlandı | dashboard-admin-types, ilan cache, wallet helper silindi |

### 3.2 Modul Checklist

- [x] `auth` — carrier/customer rol referanslari temizlendi
- [x] `emailTemplates` — kargo sablonlari SQL seed'den cikarildi, jenerik sablonlar eklendi
- [x] `mail/service.ts` — kargo mail builder fonksiyonları silindi
- [x] `mail/helpers/` — kargo helper'lari silindi
- [x] `notifications` — kargo bildirim tipleri bulunamadi (temiz)
- [x] `siteSettings/helpers/constants.ts` — offer/kargo key'leri temizlendi
- [x] `telegram` — booking/ilan/wallet event ayarları temizlendi
- [x] `userRoles` — carrier/customer rolleri silindi, admin + editor birakti
- [x] `_shared` — lojistik modüllere ait type/helper export'lari kaldırıldı

### 3.3 Kod Kalitesi Kontrolu — TAMAMLANDI (Audit)

- [x] `any`/`as any` tarandı — tüm ihlaller `products/` modülünde (pre-existing, büyük refactor gerektirir)
- [x] 200 satir asimi tespit edildi — audit/repo(588), siteSettings/service(441), products/* (en büyük ihlaller)
- [x] Repository fonksiyonları `repo` prefix'i ile basliyor — dogrulandi
- [x] Router boyutlari kontrol edildi — `products/admin.routes.ts`(195) haric tumu uygun
- [x] Controller'larda DB sorgusu — `products/controller.ts` ve `notifications/controller.ts` ihlal ediyor

---

## Faz 4: Yeni Modüller

### 4.1 Products Modulu (Gelistirme) — TAMAMLANDI (Type Fix)

Mevcut `products` modülü var, type hataları düzeltildi:

- [x] Type hataları duzelt (subcategories import, storage/_util, toBoolDefault/toNum)
- [x] `subcategories/schema.ts` oluşturuldu (eksik modül)
- [x] `_shared/parse.ts` — `toBoolDefault` ve `toNum` fonksiyonları eklendi
- [x] `_shared/index.ts` barrel güncellendi
- [x] `products/admin.controller.ts` — storage import path düzeltildi
- [x] `products/helpers.categoryLists.ts` — `eq(tinyint, boolean)` → `eq(tinyint, number)` fix
- [x] `types/fastify-fixes.d.ts` — `FastifyContextConfig` public property eklendi
- [ ] Public routes: liste (filtreleme, pagination) — kontrol et, eksikse ekle
- [ ] Public routes: detay (slug bazlı) — kontrol et, eksikse ekle
- [ ] Admin routes: CRUD — kontrol et, eksikse tamamla
- [ ] Admin routes: görsel yönetimi — kontrol et
- [ ] i18n destegi — `product_i18n` tablosu var, calistigini dogrula
- [ ] Kategori iliskisi — calisiyor mu kontrol et
- [ ] Teknik özellikler — JSON field veya ayrı tablo (specs controller zaten var, kontrol et)
- [ ] Ekim takvimi bilgisi — gereksinim analizi yap, field ekle

### 4.2 FAQ Modulu

Mevcut `support` modülünde `support_faqs` tablosu var:

- [ ] Public route: SSS listesi (kategori filtreleme, i18n) — kontrol et
- [ ] Admin route: CRUD — zaten var, kontrol et
- [ ] Schema.org FAQPage markup için yapilandirilmis JSON cikti — kontrol et / ekle

### 4.3 Job Listings Modulu (Yeni) — TAMAMLANDI

- [x] `src/modules/jobListings/schema.ts` — `job_listings` + `job_listings_i18n` tablo tanımları
- [x] `src/modules/jobListings/validation.ts` — Zod şemaları
- [x] `src/modules/jobListings/repository.ts` — CRUD repository fonksiyonları
- [x] `src/modules/jobListings/controller.ts` — Public handler (aktif ilanları listele)
- [x] `src/modules/jobListings/admin.controller.ts` — Admin CRUD handler'ları
- [x] `src/modules/jobListings/router.ts` — Public route tanımları
- [x] `src/modules/jobListings/admin.routes.ts` — Admin route tanımları
- [x] `src/routes.ts` — register fonksiyonlarıni ekle
- [x] Seed: `src/db/seed/sql/119_job_listings_schema.sql` — schema + ornek veri

### 4.4 Job Applications Modulu (Yeni) — TAMAMLANDI

- [x] `src/modules/jobApplications/schema.ts` — `job_applications` tablo tanımı
- [x] `src/modules/jobApplications/validation.ts` — Zod şemaları (CV yükleme dahil)
- [x] `src/modules/jobApplications/repository.ts` — CRUD repository fonksiyonları
- [x] `src/modules/jobApplications/controller.ts` — Public handler (başvuru gönder)
- [x] `src/modules/jobApplications/admin.controller.ts` — Admin handler (listele, durum güncelle)
- [x] `src/modules/jobApplications/router.ts` — Public route tanımları
- [x] `src/modules/jobApplications/admin.routes.ts` — Admin route tanımları
- [x] `src/routes.ts` — register fonksiyonlarıni ekle
- [x] Seed: `src/db/seed/sql/120_job_applications_schema.sql` — schema

### 4.5 Timeline Modulu (Opsiyonel)

- [ ] Karar: Ayrı modül mu yoksa `site_settings` JSON olarak mi saklanacak?
- [ ] Eğer ayrı modül: `src/modules/timeline/` dizin yapısı oluştur
- [ ] `timeline_events` + `timeline_events_i18n` tablo tanımları
- [ ] Public route: timeline listesi
- [ ] Admin route: CRUD

---

## Veritabani Semalari (Hedef)

### Kalacak Tablolar

- [x] `users` — Kullanıcılar (carrier rolleri temizlenecek)
- [x] `user_roles` — Rol atamalari (admin, editor)
- [x] `refresh_tokens` — JWT refresh token'lari
- [x] `profiles` — Kullanıcı profilleri
- [x] `site_settings` — Anahtar-değer site ayarları (locale destekli)
- [x] `categories` + `category_i18n` — Kategoriler
- [x] `products` + `product_i18n` — Ürün katalogu
- [x] `email_templates` — Email sablonlari
- [x] `custom_pages` + `custom_pages_i18n` — CMS sayfaları
- [x] `notifications` — Bildirimler
- [x] `support_faqs` + `support_faqs_i18n` — SSS
- [x] `support_tickets` — Destek talepleri
- [x] `audit_request_logs` — HTTP log
- [x] `audit_auth_events` — Auth log
- [x] `telegram_inbound_messages` — Telegram log
- [x] `storage_assets` — Medya dosyaları

### Kaldırılacak Tablolar (Modul kodlari silindi, DB migration bekliyor)

- [x] `ilanlar`, `ilan_photos` — Modul kodu silindi
- [x] `bookings` — Modul kodu silindi
- [x] `carriers` — Modul kodu silindi
- [x] `carrier_bank_accounts` — Modul kodu silindi
- [x] `ratings` — Modul kodu silindi
- [x] `wallets`, `wallet_transactions` — Modul kodu silindi
- [x] `withdrawal_requests` — Modul kodu silindi
- [x] `plans`, `user_subscriptions` — Modul kodu silindi
- [x] `offers`, `offer_number_counters` — Modul kodu silindi
- [ ] DB'de tablolarin fiilen DROP edilmesi (seed calistirinca otomatik olacak)

### Eklenecek Tablolar

- [x] `job_listings` + `job_listings_i18n` — Is ilanları (Faz 4.3)
- [x] `job_applications` — Is basvurulari (Faz 4.4)

---

## Kullanıcı Rolleri (Hedef)

| Rol | Açıklama |
|-----|----------|
| `admin` | Tam yetki, admin panel erisimi |
| `editor` | içerik yönetimi (urunler, sayfalar, SSS) |

~~Kaldırılacak roller: `carrier`, `customer`~~ — Tamamlandı (kod seviyesinde silindi)

---

## API Endpoint Yapisi (Hedef)

### Public Routes (Auth gerektirmez)

```
GET    /health
GET    /api/products              — Ürün listesi (filtreleme, pagination)
GET    /api/products/:slug        — Ürün detay
GET    /api/categories            — Kategori listesi
GET    /api/faq                   — SSS listesi
GET    /api/jobs                  — Aktif is ilanları
GET    /api/pages/:slug           — CMS sayfa içeriği
GET    /api/site-settings/public  — Public site ayarları
POST   /api/contact               — İletişim formu
POST   /api/job-applications      — Is basvurusu
```

### Admin Routes (Auth + Admin rolu gerektirir)

```
/api/admin/products              — Ürün CRUD
/api/admin/categories            — Kategori CRUD
/api/admin/faq                   — SSS CRUD
/api/admin/jobs                  — Is ilanları CRUD
/api/admin/job-applications      — Başvuru yönetimi
/api/admin/pages                 — CMS sayfa CRUD
/api/admin/site-settings         — Site ayarları CRUD
/api/admin/contacts              — İletişim mesajlari
/api/admin/storage               — Dosya yönetimi
/api/admin/users                 — Kullanıcı yönetimi
/api/admin/email-templates       — Email sablonlari
/api/admin/theme                 — Tema ayarları
/api/admin/audit                 — Audit log
/api/admin/notifications         — Bildirim yönetimi
/api/admin/telegram              — Telegram ayarları
/api/admin/support-tickets       — Destek talepleri
```

---

## Dokümanlar ve Konfigurasyonlar

### Tamamlanan Dokümantasyon

- [x] `CLAUDE.md` — Jenerik kurumsal site backend kurallari (PaketJet referanslari temizlendi)
- [x] `.claude/agents/backend-architect.md` — v2.0 (PaketJet kaldırıldı)
- [x] `.claude/agents/frontend-architect.md` — v2.0 (PaketJet kaldırıldı)
- [x] `.claude/agents/devops-deployer.md` — v2.0 (PaketJet kaldırıldı)
- [x] `doc/00-modül-planlama.md` — Genel modül planlama (grup şirketleri kaldırıldı)
- [x] `doc/01-anasayfa.md` — Anasayfa içerik dokümantasyonu
- [x] `doc/02-hakkimizda.md` — Hakkımızda sayfa içeriği
- [x] `doc/03-urunler.md` — Ürünler sayfa içeriği (2 kategori, 8 urun)
- [x] `doc/05-insan-kaynaklari.md` — İnsan kaynakları sayfa içeriği
- [x] `doc/06-sss.md` — SSS içerikleri (7 soru-cevap)
- [x] `doc/07-iletisim.md` — İletişim sayfa içeriği
- [x] `doc/backend-planlama.md` — Bu dosya

### Yapilacak Konfigurasyonlar

- [ ] `.env.example` — jenerik placeholder'lar ile güncelle
- [ ] `docker-compose.yml` — jenerik isimler ile güncelle
- [x] `ecosystem.config.cjs` — jenerik isim ile güncellendi
- [x] `README.md` — proje kurulum rehberi yazildi (jenerik)
- [ ] `.gitignore` — backend için kontrol et

---

## Is Sirasi (Oncelik)

1. ~~**Faz 1:** Lojistik modülleri sil, routes.ts temizle, seed SQL'lerini kaldır, middleware temizle~~ — TAMAMLANDI
2. ~~**Faz 2:** Hard-code proje isimlerini kaldır, seed dosyalarını güncelle~~ — TAMAMLANDI (SQL seed'ler jenerikleştirildi, `{{SITE_NAME}}` placeholder sistemi eklendi). Seed JSON migrasyonu (2.2 alt kalemleri) opsiyonel kaldı.
3. ~~**Faz 3:** Kalan modüllerde kargo referanslarini temizle, kod kalitesi kontrolü~~ — TAMAMLANDI
4. ~~**Faz 4:** Yeni modüller (jobListings, jobApplications), products type fix~~ — TAMAMLANDI (4.1, 4.3, 4.4). FAQ kontrolü (4.2) ve timeline karari (4.5) kaldı.
5. **Test:** Tum endpoint'leri test et, `bun run dev` ile calistigini dogrula, type-check geçtiğini dogrula — `tsc --noEmit` 0 hata ile geciyor

### NOT: Bilinen Önceden Var Olan Sorunlar
- ~~`products/` modülü 14 type hatasi~~ — Faz 4.1'de düzeltildi (0 type error)
- `auth/schema.ts`'deki `wallet_balance` kolonu — schema'dan kaldırıldı, DB'de fiilen DROP gerekebilir
- `products/` modülü `any`/`as any` kullanimlari — büyük refactor gerektirir
- Bazi dosyalar 200 satir limitini asiyor: `audit/repository.ts`(588), `siteSettings/service.ts`(441)
- `products/controller.ts` ve `notifications/controller.ts` içinde DB sorgusu var (repository'ye taşınmalı)
