# Vista Seeds - Modul Planlama

## Proje Genel Bakis
Mevcut site: https://www.vistaseeds.com.tr/
Hedef: Yeni mimaride (Next.js + Fastify + Drizzle ORM) tamamen yeniden yazmak.

---

## Sayfa / Route Yapisi

| # | Sayfa | Route | Durum |
|---|-------|-------|-------|
| 1 | Anasayfa | `/` | Planlanadi |
| 2 | Hakkimizda | `/hakkimizda` | Planlanadi |
| 3 | Urunler | `/urunler` | Planlanadi |
| 4 | Urun Detay | `/urunler/[slug]` | Planlanadi |
| 5 | Grup Sirketleri | `/grup-sirketlerimiz` | Planlanadi |
| 6 | Sirket Detay | `/grup-sirketlerimiz/[slug]` | Planlanadi |
| 7 | Insan Kaynaklari | `/insan-kaynaklari` | Planlanadi |
| 8 | SSS | `/sss` | Planlanadi |
| 9 | Iletisim | `/iletisim` | Planlanadi |

---

## Frontend Modulleri

### Ortak Komponentler
- [ ] Header (sticky, responsive, mobil menu)
- [ ] Footer (linkler, referans kuruluslari, sosyal medya)
- [ ] WhatsApp floating butonu
- [ ] Telefon floating butonu
- [ ] Scroll-to-top butonu
- [ ] Breadcrumb
- [ ] SEO Head (meta, schema.org)
- [ ] Page Hero Banner (her sayfanin baslik bolumu)

### Anasayfa Modulleri
- [ ] Hero Slider
- [ ] Istatistik Sayaclari (animasyonlu counter)
- [ ] Temel Degerler Kartlari (4'lu grid)
- [ ] Neden Bizi Secmelisiniz bolumu
- [ ] Urun On Izleme Grid (filtrelemeli)
- [ ] Grup Sirketleri On Izleme
- [ ] Timeline / Tarihce
- [ ] SSS Accordion On Izleme

### Hakkimizda Modulleri
- [ ] Sirket Tanitim Blogu
- [ ] Vizyon & Misyon Kartlari
- [ ] Temel Degerler
- [ ] Istatistik Sayaclari
- [ ] Timeline Komponenti
- [ ] (Yeni) Ekip Tanitimi
- [ ] (Yeni) Sertifikalar/Belgeler

### Urunler Modulleri
- [ ] Urun Listesi Grid
- [ ] Kategori Filtreleme (Isotope tarzda)
- [ ] Urun Karti Komponenti
- [ ] Urun Detay Sayfasi
- [ ] (Yeni) Urun Arama
- [ ] (Yeni) Urun Karsilastirma
- [ ] (Yeni) PDF Katalog Indirme
- [ ] (Yeni) Teknik Veri Sayfasi (Datasheet)

### Grup Sirketleri Modulleri
- [ ] Sirket Kartlari Grid
- [ ] Sirket Detay Sayfasi
- [ ] (Yeni) Gorsel Galeri
- [ ] (Yeni) Konum Haritasi

### Insan Kaynaklari Modulleri
- [ ] Sayfa Tanitim Metni
- [ ] Kadro Istatistikleri
- [ ] Calisma Avantajlari
- [ ] (Yeni) Acik Pozisyonlar Listesi (dinamik)
- [ ] (Yeni) Online Basvuru Formu (CV yukleme)

### SSS Modulleri
- [ ] Accordion Komponenti
- [ ] FAQPage Schema Markup
- [ ] (Yeni) Kategori Filtreleme
- [ ] (Yeni) Arama Fonksiyonu

### Iletisim Modulleri
- [ ] Iletisim Bilgileri Kartlari
- [ ] Google Maps Entegrasyonu
- [ ] WhatsApp / Telefon Linkleri
- [ ] (Yeni) Iletisim Formu

---

## Backend API Endpointleri

### Mevcut (Admin Panel'de var)
- `GET/POST /api/categories` - Urun kategorileri
- `GET/POST /api/carriers` - Tasiyicilar
- `GET/POST /api/contacts` - Iletisim mesajlari
- `GET/POST /api/ilanlar` - Is ilanlari
- `GET/POST /api/site-settings` - Site ayarlari
- `GET/POST /api/storage` - Dosya depolama
- `GET/POST /api/users` - Kullanici yonetimi

### Frontend Icin Gerekli Public API'ler
- [ ] `GET /api/public/products` - Urun listesi (filtreleme destekli)
- [ ] `GET /api/public/products/[slug]` - Urun detay
- [ ] `GET /api/public/categories` - Kategori listesi
- [ ] `GET /api/public/companies` - Grup sirketleri
- [ ] `GET /api/public/companies/[slug]` - Sirket detay
- [ ] `GET /api/public/faq` - SSS listesi
- [ ] `GET /api/public/jobs` - Acik is ilanlari
- [ ] `GET /api/public/site-settings` - Site ayarlari (public)
- [ ] `POST /api/public/contact` - Iletisim formu gonderimi
- [ ] `POST /api/public/job-application` - Is basvurusu

---

## Veritabani Tablolari (Drizzle ORM)

### Mevcut (Tahmini)
- `users` - Kullanicilar
- `categories` - Urun kategorileri
- `contacts` - Iletisim mesajlari
- `site_settings` - Site ayarlari
- `storage` - Medya dosyalari
- `ilanlar` - Is ilanlari

### Eklenmesi Gereken
- [ ] `products` - Urunler (slug, isim, aciklama, kategori, gorseller, teknik ozellikler)
- [ ] `companies` - Grup sirketleri (slug, isim, sektor, aciklama, gorseller)
- [ ] `faq` - Sikca sorulan sorular (soru, cevap, kategori, sira)
- [ ] `timeline_events` - Tarihce olaylari (yil, baslik, aciklama)
- [ ] `job_applications` - Is basvurulari (ad, email, telefon, cv, pozisyon)

---

## Mevcut Sitede Olmayip Eklenmesi Onerilen Moduller

1. **Iletisim Formu** - Mevcut sitede form yok, sadece telefon/whatsapp var
2. **Urun Detay Sayfasi** - Ayri sayfa olarak teknik ozellikler, ekim takvimi
3. **Online Is Basvuru Formu** - CV yukleme destekli
4. **Blog / Tarim Rehberi** - SEO icin faydali, tarim ipuclari
5. **Urun Katalogu PDF** - Indirilebilir dijital katalog
6. **Coklu Dil Destegi** - Ingilizce / Arapca (ihracat icin)
7. **Bayi/Distribitor Haritasi** - Satis noktalari gosterimi
8. **Newsletter** - E-bulten aboneligi
9. **Musteri Yorumlari / Referanslar** - Guven artirici

---

## Teknik Mimari Ozeti

```
Frontend:  Next.js 16 + React 19 + Tailwind v4 + Framer Motion
Backend:   Fastify + Drizzle ORM + MySQL
Admin:     Mevcut admin_panel (Next.js)
Medya:     Cloudinary
Deploy:    Docker + Nginx + PM2 + VPS
```

---

## Detayli Dokumantasyon Dosyalari
- [01-anasayfa.md](./01-anasayfa.md)
- [02-hakkimizda.md](./02-hakkimizda.md)
- [03-urunler.md](./03-urunler.md)
- [04-grup-sirketleri.md](./04-grup-sirketleri.md)
- [05-insan-kaynaklari.md](./05-insan-kaynaklari.md)
- [06-sss.md](./06-sss.md)
- [07-iletisim.md](./07-iletisim.md)
