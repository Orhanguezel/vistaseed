# Vista Seeds - Modul Planlama

## Proje Genel Bakis
Mevcut site: https://www.vistaseeds.com.tr/
Hedef: Yeni mimaride (Next.js 16 + Fastify + Drizzle ORM) tamamen yeniden yazmak.
Backend proje ismine bağımlı değildir, başka projelerde de kullanılabilir.

---

## Sayfa / Route Yapisi

| # | Sayfa | Route | Durum |
|---|-------|-------|-------|
| 1 | Anasayfa | `/` | Planlanadi |
| 2 | Hakkımızda | `/hakkimizda` | Planlanadi |
| 3 | Ürünler | `/urunler` | Planlanadi |
| 4 | Ürün Detay | `/urunler/[slug]` | Planlanadi |
| 5 | İnsan Kaynakları | `/insan-kaynaklari` | Planlandı |
| 6 | SSS | `/sss` | Planlanadi |
| 7 | İletişim | `/iletisim` | Planlanadi |

---

## Frontend Modülleri

### Ortak Komponentler
- [ ] Header (sticky, responsive, mobil menu)
- [ ] Footer (linkler, referans kuruluslari, sosyal medya)
- [ ] WhatsApp floating butonu
- [ ] Telefon floating butonu
- [ ] Scroll-to-top butonu
- [ ] Breadcrumb
- [ ] SEO Head (meta, schema.org)
- [ ] Page Hero Banner (her sayfanin baslik bolumu)

### Anasayfa Modülleri
- [ ] Hero Slider
- [ ] Istatistik Sayaclari (animasyonlu counter)
- [ ] Temel Değerler Kartları (4'lü grid)
- [ ] Neden Bizi Seçmelisiniz bolumu
- [ ] Ürün Ön İzleme Grid (filtrelemeli)
- [ ] Timeline / Tarihce
- [ ] SSS Accordion Ön İzleme

### Hakkımızda Modülleri
- [ ] Sirket Tanitim Blogu
- [ ] Vizyon & Misyon Kartlari
- [ ] Temel Değerler
- [ ] Istatistik Sayaclari
- [ ] Timeline Komponenti
- [ ] (Yeni) Ekip Tanitimi
- [ ] (Yeni) Sertifikalar/Belgeler

### Ürünler Modülleri
- [ ] Ürün Listesi Grid
- [ ] Kategori Filtreleme
- [ ] Ürün Karti Komponenti
- [ ] Ürün Detay Sayfasi
- [ ] (Yeni) Ürün Arama
- [ ] (Yeni) PDF Katalog Indirme
- [ ] (Yeni) Teknik Veri Sayfasi (Datasheet)

### İnsan Kaynakları Modülleri
- [ ] Sayfa Tanitim Metni
- [ ] Kadro Istatistikleri
- [ ] Calisma Avantajlari
- [ ] (Yeni) Açık Pozisyonlar Listesi (dinamik)
- [ ] (Yeni) Online Başvuru Formu (CV yükleme)

### SSS Modülleri
- [ ] Accordion Komponenti
- [ ] FAQPage Schema Markup
- [ ] (Yeni) Kategori Filtreleme
- [ ] (Yeni) Arama Fonksiyonu

### İletişim Modülleri
- [ ] İletişim Bilgileri Kartlari
- [ ] Google Maps Entegrasyonu
- [ ] WhatsApp / Telefon Linkleri
- [ ] (Yeni) İletişim Formu

---

## Backend Modülleri

### Kalacak (Jenerik)
| Modul | Amac |
|-------|------|
| `auth` | Kimlik doğrulama, JWT, rol yönetimi |
| `audit` | HTTP/auth event loglama |
| `categories` | Kategori yönetimi (i18n) |
| `contact` | İletişim formu |
| `customPages` | CMS sayfaları (slug, i18n) |
| `emailTemplates` | Email sablon yönetimi |
| `health` | Health check |
| `mail` | Email gonderim (SMTP) |
| `notifications` | Bildirim sistemi |
| `products` | Ürün katalogu (i18n) |
| `profiles` | Kullanici profilleri |
| `siteSettings` | Site ayarları (key-value) |
| `storage` | Dosya yükleme (Cloudinary/local) |
| `support` | SSS + destek ticket |
| `telegram` | Telegram bot (opsiyonel) |
| `theme` | UI tema ayarları |
| `userRoles` | Rol yönetimi |

### Kaldirilacak (PaketJet Kalintilari)
- `bookings`, `carriers`, `carrier-bank`, `ilanlar`, `ratings`
- `withdrawal`, `subscription`, `offer`, `wallet`, `reports`, `dashboard`

### Eklenecek (Yeni)
| Modul | Amac |
|-------|------|
| `jobListings` | Is ilanlari (i18n) |
| `jobApplications` | Is basvurulari (CV yükleme) |

### Public API Endpointleri
```
GET    /api/products              — Ürün listesi (filtreleme, pagination)
GET    /api/products/:slug        — Ürün detay
GET    /api/categories            — Kategori listesi
GET    /api/faq                   — SSS listesi
GET    /api/jobs                  — Aktif is ilanlari
GET    /api/pages/:slug           — CMS sayfa içeriği
GET    /api/site-settings/public  — Public site ayarları
POST   /api/contact               — İletişim formu
POST   /api/job-applications      — Is basvurusu
```

---

## Veritabani (Drizzle ORM)

### Kalacak Tablolar
- `users`, `user_roles`, `refresh_tokens`, `profiles`
- `site_settings`, `categories`, `category_i18n`
- `products`, `product_i18n`
- `email_templates`, `custom_pages`, `custom_pages_i18n`
- `notifications`, `support_faqs`, `support_faqs_i18n`, `support_tickets`
- `audit_request_logs`, `audit_auth_events`
- `telegram_inbound_messages`

### Eklenecek Tablolar
- `job_listings`, `job_listings_i18n`
- `job_applications`

---

## Teknik Mimari

```
Frontend:  Next.js 16 + React 19 + Tailwind v4 + Framer Motion
Backend:   Fastify v5 + Bun + Drizzle ORM + MySQL
Admin:     Mevcut admin_panel (Next.js)
Medya:     Cloudinary
Deploy:    Docker + Nginx + PM2 + VPS
Seed:      JSON seed dosyaları (src/db/seed/data/)
```

---

## Detayli Dokumantasyon
- [backend-planlama.md](./backend-planlama.md) — Backend faz plani
- [01-anasayfa.md](./01-anasayfa.md)
- [02-hakkimizda.md](./02-hakkimizda.md)
- [03-urunler.md](./03-urunler.md)
- [05-insan-kaynaklari.md](./05-insan-kaynaklari.md)
- [06-sss.md](./06-sss.md)
- [07-iletisim.md](./07-iletisim.md)
