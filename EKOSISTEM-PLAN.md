# VistaSeed — Ekosistem Entegrasyon ve Geliştirme Planı

**Tarih:** 29 Mart 2026
**Bağlam:** Tarım Dijital Ekosistem kabul edildi. VistaSeed, ekosistemin iki merkez sitesinden biri olarak yeniden konumlandırılıyor.
**Mevcut Durum:** Canlıya hazırlanıyor (`vistaseeds.com.tr`), bayi/üye sistemi mevcut.

> Bu plan mevcut `doc/` altındaki planlama dokümanlarının **üstüne** inşa edilir. Modül planlama ve frontend/backend/admin planlaması devam ederken, ekosistem entegrasyonu paralel yürütülür.

---

## 1. VistaSeed'in Ekosistem İçerisindeki Rolü

```
EKOSISTEM
├── Bereketfide (kardes site)
│   ├── Fide odaklı kurumsal site
│   ├── İçerik hub'ı (blog -> haber portalı beslemesi)
│   └── Sera müşteri tabanı -> sera SaaS
├── VistaSeed (BU PROJE)
│   ├── Tohum odaklı kurumsal site
│   ├── Bayi/üye sistemi -> ekosistem auth temeli
│   ├── Sipariş sistemi -> B2B pazaryeri çekirdeği
│   ├── Bilgi bankası -> tarım ansiklopedisi çekirdeği
│   └── Ekim rehberi -> verim tahmini motoru verisi
└── Gelecek Platformlar
    ├── Ziraat Haber Portalı
    ├── Hal Fiyatları
    ├── Tarım Ansiklopedisi (VistaSeed bilgi bankası evrilir)
    ├── Sera SaaS
    └── B2B Pazaryeri (VistaSeed sipariş sistemi evrilir)
```

**VistaSeed'in stratejik avantajı:** Bayi dashboard, üye sistemi, sipariş yönetimi ve bilgi bankası zaten mevcut. Bu modüller ekosistem genelinde yeniden kullanımlı en değerli varlıklar.

---

## 2. Yapılacak İşler — Öncelik Sırasına Göre

### P0 — Acil (Hafta 1-2)

#### 2.1 Next.js 16 Yükseltme

VistaSeed Next.js 15.2'de, Bereketfide 16.1.6'da. Ekosistem tutarlılığı için eşitlenmeli.

- [ ] Frontend: `next@16` + `react@19.2` yukseltme
  - `next.config.ts` syntax degisiklikleri kontrol et
  - Turbopack uyumlulugunukonrol et
  - Mevcut middleware.ts uyumluluğunu dogrula
- [ ] Admin Panel: `next@16` yukseltme
  - RTK Query ve Redux Toolkit uyumluluk testi
  - Shadcn UI bileşenlerinde breaking change kontrolü
- [ ] Test: Tüm sayfaları build edip 404/500 kontrolü yap
- [ ] Vitest testlerini çalıştır, kırılanları düzelt

#### 2.2 Frontend i18n Ekleme (TR/EN/DE)

VistaSeed frontend'i sadece Turkce. Uluslararasi pazar icin ve Bereketfide ile tutarlilik icin i18n eklenmeli.

- [ ] `next-intl` paketini frontend'e ekle (Bereketfide referans)
- [ ] Route yapisini `[locale]/` altina tasi:
  ```
  Mevcut:  /urunler, /bilgi-bankasi, /ekim-rehberi
  Yeni:    /tr/urunler, /en/products, /de/produkte
  ```
- [ ] Cevirme onceligi (Faz 1 — sadece yapi):
  - [ ] `public/locales/tr.json` — Mevcut metinleri JSON'a tasi
  - [ ] `public/locales/en.json` — Ingilizce ceviriler
  - [ ] `public/locales/de.json` — Almanca ceviriler (Bereketfide'den referans)
- [ ] Hreflang meta tag'leri ekle
- [ ] Sitemap'e dil alternatifleri ekle
- [ ] 301 redirect'ler: eski `/urunler` -> `/tr/urunler` (SEO kaybi onleme)
- [ ] Referans: `bereketfide/frontend/src/i18n/` yapısı birebir kullanılabilir

#### 2.3 Backend Port Yapilandirma Duzeltme

Farklı config dosyalarında farklı portlar tanımlı (8078, 8083, 8085). Tek tutarlı port seçilmeli.

- [ ] Standart port: `8083` (Docker default)
- [ ] Guncelle: `backend/.env.example` -> `PORT=8083`
- [ ] Guncelle: `backend/ecosystem.config.cjs` -> port: 8083
- [ ] Guncelle: `backend/Dockerfile` -> EXPOSE 8083
- [ ] Guncelle: `backend/docker-compose.yml` -> ports: "8083:8083"
- [ ] Guncelle: `frontend/.env.example` -> `NEXT_PUBLIC_API_URL=http://localhost:8083`
- [ ] Guncelle: `admin_panel/.env.example` -> tutarli API URL

#### 2.4 llms.txt Olustur

Bereketfide'de var, VistaSeed'de yok. AI crawler'lar icin kritik.

- [ ] `frontend/public/llms.txt` dosyası oluştur:
  ```
  # VistaSeed - Turkiye Tohum ve Fide Dijital Platformu
  # https://www.vistaseeds.com.tr

  ## Ana Sayfalar
  - / : Anasayfa - VistaSeed tohum ve fide cesitleri
  - /urunler : Ürün kataloğu - tüm tohum çeşitleri
  - /bilgi-bankasi : Tarimsal bilgi bankasi ve rehberler
  - /ekim-rehberi : Bolgesel ekim rehberi ve takvim
  - /hakkimizda : Şirket hakkında bilgi
  - /iletisim : İletişim bilgileri

  ## Ekosistem Baglantilari
  - https://www.bereketfide.com.tr : Kardes marka - fide cesitleri
  - [gelecek] agroplatform.com.tr : Tarim dijital ekosistemi
  ```

---

### P1 — Kisa Vade (Hafta 2-4)

#### 2.5 Blog Bölümü Ekleme

VistaSeed'de blog yok. SEO trafiği ve ekosistem beslemesi için kritik.

- [ ] Frontend: `/blog` route oluştur (liste + detay)
  ```
  /[locale]/blog              — Blog listesi (kategori filtreli)
  /[locale]/blog/[slug]       — Blog detay
  ```
- [ ] Backend: Mevcut `customPages` modülü kullanılabilir veya ayrı `blog` modülü
  - Önerilen: ayrı `blog` modülü (daha temiz, RSS desteği için)
  - Schema: `id, title, slug, excerpt, content, category, author, image, locale, status, published_at`
- [ ] Admin panelde: Blog yönetimi sayfası
- [ ] Blog kategorileri:
  - `tohum-bilimi` — Tohum genetiği, çeşitleri, seçim rehberi
  - `ekim-teknikleri` — Ekim, sulama, gübreleme
  - `tarim-teknolojisi` — IoT, AI, sera otomasyonu
  - `piyasa-analizi` — Tohum piyasası, fiyat trendleri
  - `mevsimsel` — Aylık ekim/hasat önerileri
- [ ] RSS feed: `GET /api/feed/rss`
- [ ] İçerik hedefi: haftalık 2 makale

#### 2.6 Ürün Karşılaştırma Sayfası

- [ ] Frontend: `/karsilastirma` route oluştur
- [ ] Kullanıcı 2-4 tohum çeşidini seçip yan yana karşılaştırır
- [ ] Karşılaştırma kriterleri:
  - Ekim zamanı, hasat süresi, verim, sıcaklık aralığı, su ihtiyacı
  - Fiyat aralığı, ambalaj seçenekleri
- [ ] Backend: `GET /api/products/compare?ids=1,2,3` endpoint'i
- [ ] Bu sayfa gelecekte Tarımsal Girdi Karşılaştırma platformunun prototipi

#### 2.7 Bayi Ağı Public Sayfası

Mevcut bayi sistemi sadece login sonrası erişimli. Public görünüm eklenmeli.

- [ ] Frontend: `/bayi-agi` route oluştur
- [ ] Türkiye haritasında bayi konumları (Google Maps entegrasyonu mevcut)
- [ ] Şehir/ilçe bazlı bayi arama
- [ ] Bayi profil kartı: isim, adres, telefon, çalışma saatleri
- [ ] "Bayi Olmak İstiyorum" CTA -> mevcut bayi başvuru formuna link
- [ ] Backend: `GET /api/dealers/public` — aktif bayilerin public bilgileri
- [ ] Bu sayfa B2B Pazaryeri'nin satıcı profil sayfalarının prototipi

#### 2.8 Toplu Satış / Kooperatif Sayfası

- [ ] Frontend: `/toplu-satis` route oluştur
- [ ] Kooperatif ve büyük çiftlikler için özel fiyatlama bilgisi
- [ ] Minimum sipariş miktarları, hacim indirimleri
- [ ] Teklif talep formu (mevcut offer modülü kullanılabilir)
- [ ] Bu sayfa Toplu Alim Platformu'nun prototipi

---

### P2 — Orta Vade (Ay 2-3)

#### 2.9 Bilgi Bankası Derinleştirme

Mevcut bilgi bankası ve ekim rehberi güçlü bir temel. Ekosistem için zenginleştirilmeli.

- [ ] Her tohum çeşidi için ayrı bilgi bankası sayfası:
  - Örnek: `/bilgi-bankasi/cherry-domates-tohumu`
  - İçerik: tanım, ekim zamanı, toprak tipi, sulama, hastalıklar, hasat
- [ ] Görseller: ekim adım-adım fotolar, hastalık görüntüleri
- [ ] Video embed: YouTube içerikleri (eğitim platformu pilot)
- [ ] Cross-link: her bilgi bankası sayfasında ilgili VistaSeed ürünü + Bereketfide fidesi
- [ ] JSON-LD: `HowTo`, `Article`, `FAQPage` schema'lari
- [ ] Bu içerik tarım ansiklopedisinin çekirdeği olacak

#### 2.10 Ürün Verisi Zenginleştirme (Tarımsal Metadata)

Bereketfide ile ayni standart urun semasi kullanilmali.

- [ ] Backend `products` schema'ya tarimsal alanlar ekle:
  ```
  botanical_name      VARCHAR(255)   — Latince isim
  planting_seasons    JSON           — ["ilkbahar", "sonbahar"]
  harvest_days        INT            — Hasat suresi (gun)
  climate_zones       JSON           — ["akdeniz", "ege", "ic-anadolu"]
  soil_types          JSON           — ["kumlu", "killi", "humuslu"]
  water_need          ENUM           — low/medium/high
  sun_exposure        ENUM           — full/partial/shade
  min_temp            DECIMAL        — Minimum sicaklik dayanimi (C)
  max_temp            DECIMAL        — Maksimum sicaklik (C)
  germination_days    INT            — Cimleme suresi (gun)
  seed_depth_cm       DECIMAL        — Ekim derinligi (cm)
  row_spacing_cm      INT            — Sira arasi (cm)
  plant_spacing_cm    INT            — Bitki arasi (cm)
  yield_per_sqm       VARCHAR(50)    — m2 basina verim
  ```
- [ ] Admin panelde urun formuna "Tarimsal Bilgiler" tab'i
- [ ] Frontend urun detay sayfasinda tarimsal bilgi kartlari
- [ ] Karsilastirma sayfasi bu verileri kullanacak
- [ ] Bu sema Bereketfide ile ortaklastirilacak (`packages/shared-types/`)

#### 2.11 Content Federation API

VistaSeed icerigini diger ekosistem platformlarina acan API.

- [ ] Backend: `/api/v1/ecosystem/content` endpoint'i
  ```typescript
  // GET /api/v1/ecosystem/content
  // Query: source=vistaseed&type=knowledge&limit=10
  // Response: { items: [{ title, slug, excerpt, image, url, publishedAt }] }
  ```
- [ ] Desteklenen icerik tipleri:
  - `product` — Tohum katalogu
  - `knowledge` — Bilgi bankasi
  - `planting-guide` — Ekim rehberi
  - `blog` — Blog makaleleri (eklendikten sonra)
  - `dealer` — Public bayi listesi
- [ ] API key authentication
- [ ] Rate limiting + cache

#### 2.12 Ortak Auth Hazirlik

VistaSeed'in bayi/uye sistemi ekosistem SSO'sunun temelini olusturacak.

- [ ] Mevcut auth modulu incelemesi:
  - users tablosu alanlari: id, email, password_hash, role, full_name
  - Roller: user, dealer, seller, editor, admin
  - Session: JWT cookie (`access_token`)
- [ ] Ekosistem alanlari ekle:
  ```
  phone               VARCHAR(20)
  avatar_url          TEXT
  email_verified_at   TIMESTAMP NULL
  ecosystem_id        VARCHAR(36) NULL
  ```
- [ ] `ecosystem_id`: UUID, tum platformlarda ayni kullanici icin ayni ID
- [ ] SSO icin hazirlk: `/api/auth/sso-verify` endpoint'i (token ile kullanici dogrulama)
  ```typescript
  // POST /api/auth/sso-verify
  // Body: { token: "jwt-token", target_platform: "bereketfide" }
  // Response: { valid: true, user: { ecosystem_id, email, role, full_name } }
  ```
- [ ] Bu endpoint henuz production'da kullanilmayacak, sadece hazirlk

---

### P3 — Uzun Vade (Ay 3-6)

#### 2.13 Siparis Sistemi Genisletme (B2B Pazaryeri Hazirlik)

Mevcut siparis sistemi tek satici (VistaSeed) icin tasarlanmis. Coklu satici destegi eklenmeli.

- [x] orders tablosuna `seller_id` alani ekle (su an implicit VistaSeed)
- [x] Satici profil modulu: `/api/v1/sellers/:id` (public, dealer rolü)
- [x] Satici API (MVP): `GET /seller/orders`, `GET /seller/orders/:id`, `GET /seller/orders/summary` — `dealer` rolü; stok/analitik UI sonraki iterasyon
- [x] Komisyon tahmini (MVP): `platform_commission` site ayarlari + `wallet/commission` hesabi
- [ ] Bu yapilar B2B Tohum/Fide Pazaryeri'nin cekirdegi olacak (tam pazaryeri)

#### 2.14 Dealer Finance Genisletme

Mevcut `dealerFinance` modulu var. Ekosistem icin genisletilmeli.

- [x] Bayi cari hesap ozeti (borc/alacak) — `GET /dealer/finance/summary`, admin karsiligi
- [x] Odeme gecmisi ve vade takibi — `due_date`, liste filtreleri `due_from`/`due_to`
- [x] Bakiye uyarisi (MVP): `POST /dealer/finance/send-alerts` — e-posta + Telegram; saatlik limit
- [x] PDF ekstre (MVP): `GET /dealer/finance/statement.pdf` — son 500 hareket
- [x] Toplu uyarı (ops): `POST /admin/dealers/finance/run-alerts` — onaylı bayiler; cron ile tetiklenebilir
- [ ] Bu modul Maliyet ve Karlilik Analizi platformunun prototipi

#### 2.15 Ortak Paketlere Gecis

- [x] `packages/shared-types/` — frontend + admin + backend entegrasyonu (ornek: `ProductAgriculturalMetadata`)
- [x] `packages/shared-config/` — `tailwind-tokens.css` import + `data-brand="vistaseed"` (frontend); TS `extends` sonraki iterasyon
- [ ] `packages/shared-backend/` — Ilk aday: `storage` modulu (Cloudinary) — zaten workspace; proje ozel ince ayar
- [x] `packages/shared-ui` — Faz 1: `cn` + workspace bagimliligi; Shadcn tam tasima aşamali

#### 2.16 Docker Compose Iyilestirme

VistaSeed'de Docker Compose zaten var. Ekosistem yapisina uygun hale getirilmeli.

- [x] `docker-compose.yml` guncelle:
  - Service isimleri: `vistaseed-db`, `vistaseed-backend` (frontend imaji bu dosyada yok; public site ayri compose ile eklenebilir)
  - Network: `ecosystem-network` (gelecekte diger servisler katilacak)
  - Volume isimlendirme: `vistaseed-db-data`, `vistaseed-uploads`
- [x] Health check: backend `/api/health` + compose `healthcheck` (wget)
- [x] Dev ortam icin `docker-compose.dev.yml` override

---

## 3. Icerik Uretim Takvimi

### Haftalik Icerik Plani

| Gun | Icerik Tipi | Konu Ornegi |
|-----|-------------|-------------|
| Sali | Blog makalesi (teknik) | "Tohum Cimleme Oranini Artirmanin 7 Yolu" |
| Cuma | Bilgi Bankasi guncelleme | Yeni tohum cesidi sayfasi + ekim rehberi |

### Aylik Icerik Hedefleri

| Ay | Blog | Bilgi Bankasi | Ekim Rehberi | Urun Sayfasi |
|----|------|---------------|--------------|--------------|
| Ay 1 | 8 makale | 15 sayfa guncelleme | 2 bolge ekleme | 20 urun zenginlestirme |
| Ay 2 | 8 makale | 15 sayfa | 2 bolge | 20 urun |
| Ay 3 | 8 makale | 10 sayfa | 1 bolge | 10 urun |
| **3 Ay Toplam** | **24 makale** | **40 sayfa** | **5 bolge** | **50 urun** |

**Urun zenginlestirme:** Mevcut urun sayfalarina tarimsal metadata ekleme (ekim zamani, toprak tipi, verim bilgisi).

---

## 4. Bereketfide ile Entegrasyon Noktalari

| Alan | VistaSeed | Bereketfide | Entegrasyon |
|------|-----------|-------------|-------------|
| Urunler | Tohum cesitleri | Fide cesitleri | Cross-link: "Bu tohumun fidesi" |
| Bilgi Bankasi | Tohum/ekim odakli | Fide/sera odakli | Ortak ansiklopedi temeli |
| Blog | Tohum bilimi, piyasa | Sera yonetimi, fide bakimi | RSS cross-besleme |
| Auth | Bayi + uye sistemi (guclu) | Basit auth | SSO: VistaSeed auth referans |
| Siparis | Siparis sistemi var | Teklif formu var | B2B pazaryeri temeli |
| Dashboard | Bayi + uye dashboard | Yok | VistaSeed dashboard referans |

### Cross-Link Ornekleri

```
VistaSeed urun sayfasi: "Cherry Domates Tohumu"
  -> Bereketfide: "Cherry Domates Fidesi"
  -> VistaSeed Bilgi Bankasi: "Cherry Domates Yetistirme Rehberi"
  -> VistaSeed Ekim Rehberi: "Domates Ekim Takvimi"
  -> [Gelecek] Hal Fiyatlari: "Domates Fiyat Trendi"

VistaSeed Bilgi Bankasi: "Domates Cimleme Rehberi"
  -> VistaSeed: "Domates Tohumu Cesitleri"
  -> Bereketfide Blog: "Domates Fidesi Dikimi 5 Hata"
  -> [Gelecek] Ansiklopedi: "Solanum lycopersicum" (ayni icerik genisletilmis)
```

---

## 5. Teknik Notlar

### Mevcut Yapiyi Bozmamak Icin Kurallar

1. **Bayi/uye sistemi dokunulmaz.** Yeni ozellikler eklenir, mevcut akislar korunur.
2. **Siparis sistemi geriye uyumlu.** `seller_id` eklenmesi mevcut siparisleri etkilemez (NULL = VistaSeed).
3. **i18n eklerken** mevcut TR route'lar `/tr/` prefix ile calismaya devam etmeli. Redirect'ler zorunlu.
4. **DB migration'lari** yeni kolon ekleyebilir ama mevcut tablolari silmemeli/rename etmemeli.
5. **Admin panel degisiklikleri** sidebar'a yeni item ekleyebilir, mevcut navigasyonu bozmamali.
6. **Next.js 16 yukseltme** icin once ayri branch'te test, sonra merge.

### Port ve Endpoint Plani

| Servis | Mevcut | Hedef | Degisiklik |
|--------|--------|-------|------------|
| Frontend | 3000 | 3000 | Degisiklik yok |
| Backend | 8078/8083/8085 | 8083 | **Standartlastir** |
| Admin | 3022 | 3022 | Degisiklik yok |

### Yeni Backend Endpoint'ler

```
# Blog (yeni modul)
GET  /api/blog                       — Blog listesi (kategori, locale filtreli)
GET  /api/blog/:slug                 — Blog detay
GET  /api/feed/rss                   — RSS feed

# Urun karsilastirma
GET  /api/products/compare           — Karsilastirma (ids query param)

# Bayi public
GET  /api/dealers/public             — Public bayi listesi (sehir filtreli)
GET  /api/dealers/public/:id         — Bayi detay (public alanlar)

# Ekosistem (P2)
GET  /api/v1/ecosystem/content       — Content Federation API
POST /api/auth/sso-verify            — SSO dogrulama (P2)

# Bilgi Bankasi genisletme
GET  /api/bilgi-bankasi/by-product/:productId  — Urunle ilgili rehberler
```

### Dosya Yapisi Degisiklikleri

```
vistaseed/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/          <- YENI: i18n route wrapper
│   │   │   │   ├── (public)/      <- Mevcut public route'lar buraya tasinir
│   │   │   │   │   ├── blog/      <- YENI
│   │   │   │   │   ├── karsilastirma/ <- YENI
│   │   │   │   │   ├── bayi-agi/  <- YENI
│   │   │   │   │   └── toplu-satis/ <- YENI
│   │   │   │   └── (dashboard)/   <- Mevcut dashboard route'lar
│   │   ├── i18n/                  <- YENI: next-intl config
│   │   └── public/
│   │       ├── locales/           <- YENI: tr.json, en.json, de.json
│   │       └── llms.txt           <- YENI
├── backend/
│   └── src/
│       └── modules/
│           ├── blog/              <- YENI modul
│           │   ├── schema.ts
│           │   ├── validation.ts
│           │   ├── repository.ts
│           │   ├── controller.ts
│           │   ├── admin.controller.ts
│           │   ├── router.ts
│           │   └── admin.routes.ts
│           └── ecosystem/         <- YENI modul (P2)
│               ├── router.ts
│               └── controller.ts
└── EKOSISTEM-PLAN.md              <- BU DOSYA
```

---

## 6. Basari Metrikleri

| Metrik | Baslangic (Simdi) | 1 Ay | 3 Ay | 6 Ay |
|--------|-------------------|------|------|------|
| Blog makale sayisi | 0 | 8 | 24 | 48 |
| Bilgi bankasi derinlik (sayfa/urun) | ~10 | 25 | 50 | 80 |
| Urun sayfasi tarimsal metadata (%) | 0% | 30% | 70% | 95% |
| i18n kapsam (sayfa %) | 0% TR-only | 50% | 90% | 100% |
| Organik trafik (aylik) | Baz | +15% | +60% | +150% |
| Cross-platform link sayisi | 0 | 10 | 40 | 120 |
| Bayi agi public gorunum | Yok | Canli | + harita | + profil |
| Core Web Vitals (LCP < 2.5s) | ? | %90 | %95 | %95 |

---

*Bu plan, VistaSeed'in ekosistem icerisindeki stratejik rolunu tanimlar ve somut uygulama adimlari sunar. Mevcut doc/ altindaki modul/frontend/backend planlari bu planla celismez, paralel yurutulur.*
