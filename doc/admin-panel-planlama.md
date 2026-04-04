# Admin Panel Planlama

Bu doküman vistaseed admin panelinin mevcut durumunu analiz eder, PaketJet kalıntıları temizligi ve yeni modüllerin eklenmesi için faz plani sunar.

---

## 1. Mevcut Durum Analizi

### 1.1 Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15.1.x (App Router) |
| UI | React 19, Tailwind CSS v4, Shadcn/Radix UI |
| State | Redux Toolkit + RTK Query |
| Form | React Hook Form + Zod |
| Tablo | TanStack React Table v8 |
| i18n | Modul bazli JSON (`src/locale/tr/admin/`) |
| Lint | Biome 2.3 |
| DnD | dnd-kit |

### 1.2 Mevcut Admin Modülleri (Sidebar)

| Grup | Modul | Durum | Not |
|------|-------|-------|-----|
| general | dashboard | Aktif | Kalacak - içerik güncellenecek |
| listings | ilanlar | PaketJet | Kaldirilacak |
| listings | bookings | PaketJet | Kaldirilacak |
| listings | categories | Aktif | Kalacak |
| finance | users | Aktif | Kalacak |
| finance | carriers | PaketJet | Kaldirilacak |
| finance | wallets | PaketJet | Kaldirilacak |
| finance | reports | PaketJet | Kaldirilacak (coming-soon) |
| support | contacts | Aktif | Kalacak |
| support | email_templates | Aktif | Kalacak (coming-soon) |
| system | site_settings | Aktif | Kalacak |
| system | storage | Aktif | Kalacak |
| system | theme | Aktif | Kalacak |
| system | telegram | Aktif | Kalacak |
| system | audit | Aktif | Kalacak |

### 1.3 Backend'de Hazır Olan Ama Admin Panelde Olmayan Modüller

| Modul | Backend Endpoint | Admin Panel |
|-------|-----------------|-------------|
| Products | `/admin/products` (CRUD + images + faqs + specs + reviews) | YOK |
| Custom Pages | `/admin/custom-pages` (CMS, i18n) | YOK |
| Support/FAQ | `/admin/support/faqs` + `/admin/support/tickets` | YOK |
| Offers | `/admin/offers` (CRUD + PDF + email) | YOK |

### 1.4 Planlı Ama Henüz Backend'de Olmayan Modüller

| Modul | Amac |
|-------|------|
| jobListings | İş ilanları yönetimi (i18n) |
| jobApplications | İş başvuruları (CV yükleme) |

---

## 2. Kaldirilacak PaketJet Kalintilari

### 2.1 Silinecek Admin Sayfalari

```
src/app/(main)/admin/(admin)/bookings/
src/app/(main)/admin/(admin)/carriers/
src/app/(main)/admin/(admin)/ilanlar/
src/app/(main)/admin/(admin)/wallet/
```

### 2.2 Silinecek Endpoint Dosyalari

```
src/integrations/endpoints/admin/bookings-admin-endpoints.ts
src/integrations/endpoints/admin/carriers-admin-endpoints.ts
src/integrations/endpoints/admin/ilanlar-admin-endpoints.ts
src/integrations/endpoints/admin/wallet-admin-endpoints.ts
src/integrations/endpoints/admin/reports-admin-endpoints.ts
src/integrations/endpoints/admin/dashboard-admin-endpoints.ts  (PaketJet KPI'lari iceriyorsa)
```

### 2.3 Silinecek Shared Dosyalari

```
src/integrations/shared/bookings/
src/integrations/shared/carriers/
src/integrations/shared/ilanlar/
src/integrations/shared/wallet/
src/integrations/shared/reports/
src/integrations/shared/reports.ts
src/integrations/shared/notifications.ts  (PaketJet'e ozgu ise)
```

### 2.4 Silinecek Locale Dosyalari

```
src/locale/tr/admin/bookings.json
src/locale/tr/admin/carriers.json
src/locale/tr/admin/ilanlar.json
src/locale/tr/admin/wallet.json
src/locale/tr/admin/reports.json
src/locale/tr/admin/reviews.json     (urun review'lari için yeniden yazilacak)
src/locale/tr/admin/services.json    (PaketJet'e ozgu)
src/locale/tr/admin/availability.json (PaketJet'e ozgu)
```

### 2.5 Güncellenmesi Gereken Dosyalar

| Dosya | Degisiklik |
|-------|-----------|
| `src/navigation/permissions.ts` | PaketJet key'leri sil, yeni modül key'leri ekle |
| `src/navigation/sidebar/sidebar-items.ts` | PaketJet nav item'lari sil, yeni gruplama yap |
| `src/integrations/shared.ts` | Silinen modüllerin exportlarini kaldir |
| `src/integrations/hooks.ts` | Silinen hook exportlarini kaldir |
| `src/integrations/tags.ts` | Silinen cache tag'lerini kaldir |
| `src/locale/tr/admin/index.ts` | Silinen locale importlarini kaldir |
| `src/locale/tr/admin/sidebar.json` | PaketJet label'larini sil, yenilerini ekle |
| `src/locale/tr/admin/dashboard.json` | PaketJet dashboard metinlerini güncelle |

---

## 3. Yeni Sidebar Yapisi

### 3.1 Hedef Sidebar Gruplari

```
GENEL
  - Dashboard
  - Ürünler           (YENİ)

İÇERİK
  - Kategoriler
  - Sayfalar (CMS)     (YENİ)
  - SSS / Destek       (YENİ)

INSAN KAYNAKLARI
  - Is Ilanlari         (YENİ - Faz 3)
  - Başvurular          (YENİ - Faz 3)

İLETİŞİM
  - İletişim Mesajlari
  - E-posta Sablonlari
  - Teklifler           (YENİ)

KULLANICILAR
  - Kullanicilar

SİSTEM
  - Site Ayarlari
  - Depolama
  - Tema
  - Telegram
  - Denetim Kayitlari
```

### 3.2 Yeni Permission Key'leri

```typescript
export type AdminPermissionKey =
  | 'admin.dashboard'
  | 'admin.products'        // YENİ
  | 'admin.categories'
  | 'admin.custom_pages'    // YENİ
  | 'admin.support'         // YENİ (FAQ + ticket)
  | 'admin.job_listings'    // YENİ - Faz 3
  | 'admin.job_applications'// YENİ - Faz 3
  | 'admin.contacts'
  | 'admin.email_templates'
  | 'admin.offers'          // YENİ
  | 'admin.users'
  | 'admin.site_settings'
  | 'admin.storage'
  | 'admin.theme'
  | 'admin.telegram'
  | 'admin.audit';
```

### 3.3 Yeni NavKey'ler

```typescript
export type AdminNavKey =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'custom_pages'
  | 'support'
  | 'job_listings'
  | 'job_applications'
  | 'contacts'
  | 'email_templates'
  | 'offers'
  | 'users'
  | 'site_settings'
  | 'storage'
  | 'theme'
  | 'telegram'
  | 'audit';
```

---

## 4. Yeni Modüller - Detay

### 4.1 Products (Ürünler)

**Backend endpoint'leri hazır:** `/admin/products`

**Admin panel sayfa yapısı:**

```
src/app/(main)/admin/(admin)/products/
  page.tsx                              Liste sayfası
  products.tsx                          Sayfa composition
  [id]/
    page.tsx                            Detay/düzenleme sayfası
  _components/
    products-client.tsx                 Liste container
    products-columns.tsx                Tablo kolon tanımları
    product-detail-client.tsx           Detay container
    product-form.tsx                    Ürün formu (i18n + image)
    product-images-tab.tsx              Görsel yönetimi
    product-faqs-tab.tsx                SSS tab
    product-specs-tab.tsx               Ozellikler tab
    product-reviews-tab.tsx             Değerlendirmeler tab
```

**Ozellikler:**
- i18n destekli urun CRUD (baslik, aciklama, slug locale bazli)
- Çoklu görsel yükleme (product_images pool)
- Ürün SSS yönetimi
- Teknik özellikler (specs) yönetimi
- Değerlendirme/review yönetimi
- Kategori eslestirme
- Siralama (drag-and-drop reorder)
- Aktif/pasif durumu

**Shared dosyaları:**

```
src/integrations/shared/products/
  index.ts                              Barrel
  product-types.ts                      Type tanımları
  product-normalizers.ts                Response donusturme
  product-ui.ts                         UI helper (status badge, form defaults)
  product-config.ts                     Tablo/filter config
```

**Endpoint dosyası:**

```
src/integrations/endpoints/admin/products-admin-endpoints.ts
```

**Locale dosyası:**

```
src/locale/tr/admin/products.json
```

### 4.2 Custom Pages (CMS Sayfalari)

**Backend endpoint'leri hazır:** `/admin/custom-pages`

**Admin panel sayfa yapısı:**

```
src/app/(main)/admin/(admin)/custom-pages/
  page.tsx
  custom-pages.tsx
  [id]/
    page.tsx
  _components/
    custom-pages-client.tsx
    custom-pages-columns.tsx
    custom-page-detail-client.tsx
    custom-page-form.tsx
```

**Ozellikler:**
- i18n destekli sayfa CRUD
- Slug yönetimi
- Rich text editor ile içerik düzenleme
- Siralama (reorder)
- Yayinlama durumu (draft/published)

**Shared dosyaları:**

```
src/integrations/shared/custom-pages/
  index.ts
  custom-page-types.ts
  custom-page-normalizers.ts
  custom-page-ui.ts
```

### 4.3 Support (SSS + Destek Talepleri)

**Backend endpoint'leri hazır:** `/admin/support/faqs` + `/admin/support/tickets`

**Admin panel sayfa yapısı:**

```
src/app/(main)/admin/(admin)/support/
  page.tsx                              Tab layout: SSS | Talepler
  support.tsx
  _components/
    faqs-client.tsx                     SSS listesi
    faqs-columns.tsx
    faq-form-dialog.tsx                 SSS ekleme/düzenleme dialog
    tickets-client.tsx                  Talep listesi
    tickets-columns.tsx
    ticket-detail-dialog.tsx            Talep detay
```

**Ozellikler:**
- SSS CRUD + siralama (drag-and-drop reorder)
- i18n destekli soru/cevap
- Destek talepleri listeleme + durum güncelleme
- Tab bazli sayfa (SSS ve Talepler ayni sayfada)

### 4.4 Offers (Teklifler)

**Backend endpoint'leri hazır:** `/admin/offers`

**Admin panel sayfa yapısı:**

```
src/app/(main)/admin/(admin)/offers/
  page.tsx
  offers.tsx
  [id]/
    page.tsx
  _components/
    offers-client.tsx
    offers-columns.tsx
    offer-detail-client.tsx
    offer-form.tsx
    offer-pdf-preview.tsx
```

**Ozellikler:**
- Teklif CRUD
- PDF oluşturma ve onizleme
- E-posta ile teklif gonderimi
- Durum takibi (taslak, gonderildi, kabul, red)

---

## 5. Faz Plani

### Faz 1: PaketJet Temizligi

**Oncelik:** Yuksek
**Tahmini kapsam:** Silme + refactor

**Isler:**
1. PaketJet admin sayfalarını sil (bookings, carriers, ilanlar, wallet)
2. PaketJet endpoint dosyalarini sil
3. PaketJet shared dosyalarini sil
4. PaketJet locale dosyalarini sil
5. `shared.ts` barrel'dan silinen exportlari kaldir
6. `hooks.ts` barrel'dan silinen hook'lari kaldir
7. `tags.ts`'den silinen cache tag'lerini kaldir
8. `permissions.ts`'den PaketJet key'lerini sil
9. `sidebar-items.ts`'den PaketJet nav item'larini sil
10. `locale/tr/admin/index.ts` barrel'i güncelle
11. `sidebar.json` ve `dashboard.json` locale dosyalarını güncelle
12. Type-check + build dogrulama
13. Sidebar comment basliklarindaki "P2P Kargo Pazaryeri" referansini kaldir

**Cikti:** Temiz, PaketJet kalıntısız admin panel

---

### Faz 2: Yeni Modüller (Backend Hazır)

**Oncelik:** Yuksek
**Bağımlılık:** Faz 1

**Faz 2a: Products Modulu**

1. `src/integrations/shared/products/` shared dosyalarini oluştur
2. Lokal `index.ts` barrel ac
3. Kok barrel (`shared.ts`) exportlarini ekle
4. `products-admin-endpoints.ts` endpoint dosyasıni yaz
5. `hooks.ts` hook exportlarini ekle
6. `src/locale/tr/admin/products.json` locale dosyasıni oluştur
7. `permissions.ts`'e `admin.products` key'ini ekle
8. `sidebar-items.ts`'e products nav item'ini ekle
9. Admin sayfa yapısıni `categories` referansinda oluştur
10. Ürün listesi sayfası (tablo + filtre + arama)
11. Ürün detay/düzenleme sayfası (form + tab'lar)
12. Görsel yükleme entegrasyonu (storage modülü ile)
13. SSS, specs, reviews tab'larini ekle
14. Type-check + build dogrulama

**Faz 2b: Custom Pages Modulu**

1. Shared dosyaları + barrel
2. Endpoint + hook exportlari
3. Locale dosyası
4. Permission + sidebar entegrasyonu
5. Admin sayfa yapısı (liste + detay + form)
6. Rich text editor entegrasyonu
7. Type-check + build dogrulama

**Faz 2c: Support Modulu**

1. Shared dosyaları + barrel
2. Endpoint + hook exportlari
3. Locale dosyası (mevcut `faqs.json` güncellenebilir)
4. Permission + sidebar entegrasyonu
5. Admin sayfa yapısı (tab layout: SSS + Talepler)
6. SSS drag-and-drop siralama
7. Type-check + build dogrulama

**Faz 2d: Offers Modulu**

1. Shared dosyaları + barrel
2. Endpoint + hook exportlari
3. Locale dosyası
4. Permission + sidebar entegrasyonu
5. Admin sayfa yapısı (liste + detay + form)
6. PDF onizleme + indirme
7. E-posta gonderim entegrasyonu
8. Type-check + build dogrulama

---

### Faz 3: Yeni Modüller (Backend Gerekli)

**Oncelik:** Orta
**Bağımlılık:** Faz 2 + backend geliştirme

**Faz 3a: Job Listings (Is Ilanlari)**

Backend gereksinimleri:
- `jobListings` modülü: schema, repository, controller, admin.routes
- CRUD + i18n + aktif/pasif + siralama

Admin panel:
1. Shared dosyaları + barrel
2. Endpoint + hook exportlari
3. Locale dosyası
4. Permission + sidebar entegrasyonu
5. Admin sayfa yapısı (liste + detay + form)

**Faz 3b: Job Applications (İş Başvuruları)**

Backend gereksinimleri:
- `jobApplications` modülü: schema, repository, controller, admin.routes
- Başvuru listesi + durum yönetimi + CV görüntüleme

Admin panel:
1. Shared dosyaları + barrel
2. Endpoint + hook exportlari
3. Locale dosyası
4. Permission + sidebar entegrasyonu
5. Admin sayfa yapısı (liste + detay)
6. CV dosyası görüntüleme (storage entegrasyonu)

---

### Faz 4: Dashboard Yenileme

**Oncelik:** Dusuk
**Bağımlılık:** Faz 2

**Isler:**
1. Dashboard summary endpoint'ini VistaSeed'e uygun metriklere güncelle
2. Dashboard karti: Toplam urun sayisi
3. Dashboard karti: Toplam kategori sayisi
4. Dashboard karti: İletişim mesaj sayisi (okunmamis)
5. Dashboard karti: Destek talep sayisi (acik)
6. Dashboard karti: Is basvuru sayisi (yeni)
7. Dashboard grafik: Aylik ziyaretci/iletisim trendi (Recharts)
8. Hizli erisim linkleri (son eklenen urunler, son mesajlar)
9. Locale güncelleme
10. Type-check + build dogrulama

---

## 6. Dashboard Endpoint Guncellemesi

Mevcut dashboard endpoint'i PaketJet KPI'larını döndürür. VistaSeed için güncellenecek metrikler:

```typescript
// GET /admin/dashboard/summary
{
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  unreadContacts: number;
  openTickets: number;
  pendingApplications: number;  // Faz 3 sonrası
  recentProducts: Product[];
  recentContacts: Contact[];
}
```

---

## 7. Modul Ekleme Kontrol Listesi

Her yeni modül için aşağıdaki adımlar eksiksiz tamamlanmalidir:

- [ ] Shared type/helper/config dosyaları yazildi
- [ ] Lokal `index.ts` barrel acildi
- [ ] `src/integrations/shared.ts` barrel güncellendi
- [ ] Endpoint dosyası yazıldı (sadece endpoint tanımı)
- [ ] `src/integrations/hooks.ts` hook exportlari eklendi
- [ ] `src/integrations/tags.ts` cache tag'leri eklendi
- [ ] `src/locale/tr/admin/<modüle>.json` locale dosyası oluşturuldu
- [ ] `src/locale/tr/admin/index.ts` barrel güncellendi
- [ ] `src/locale/tr/admin/sidebar.json` sidebar label eklendi
- [ ] `src/navigation/permissions.ts` permission key eklendi
- [ ] `src/navigation/sidebar/sidebar-items.ts` nav item eklendi
- [ ] Admin sayfa yapısı `categories` referansinda oluşturuldu
- [ ] Hardcoded metin yok — tum text'ler locale key ile
- [ ] `any` / `as any` kullanilmadi
- [ ] `export *` kullanilmadi
- [ ] Dosya adlari `kebab-case`
- [ ] `bun run locales:generate` basarili
- [ ] `bun x tsc --noEmit` temiz
- [ ] `bun run build` basarili

---

## 8. Dosya Etkisi Ozeti

| Faz | Silinen Dosya | Eklenen Dosya | Duzenlenen Dosya |
|-----|--------------|---------------|------------------|
| Faz 1 | ~40-50 | 0 | ~10 |
| Faz 2a (Products) | 0 | ~15-18 | ~6 |
| Faz 2b (Custom Pages) | 0 | ~10-12 | ~6 |
| Faz 2c (Support) | 0 | ~10-12 | ~6 |
| Faz 2d (Offers) | 0 | ~12-15 | ~6 |
| Faz 3a (Job Listings) | 0 | ~10-12 | ~6 |
| Faz 3b (Job Applications) | 0 | ~10-12 | ~6 |
| Faz 4 (Dashboard) | 0 | ~3-5 | ~5 |

---

## 9. Risk ve Notlar

1. **Barrel kirlilik riski:** PaketJet modülleri silinirken `shared.ts` ve `hooks.ts` barrel'larinda orphan export kalmamali. Silme sonrası type-check zorunlu.

2. **Dashboard endpoint bağımlılığı:** Mevcut dashboard admin endpoint'i PaketJet metriklerine bağlı. Backend'de dashboard modülü VistaSeed için güncellenene kadar dashboard sayfası placeholder veya minimal görünümde kalabilir.

3. **Email templates coming-soon:** Mevcut durumda coming-soon sayfasına bağlanmış. Backend hazır olduğu için Faz 2 sonrası aktif edilebilir.

4. **Offers modülü backend notu:** Offers modülü backend'de var ama `admin.routes.ts` içinde guard tekrari var (global guard yerine explicit preHandler). Backend tarafinda duzeltilmesi gerekebilir.

5. **Products modülü backend notu:** Aynı sekilde products modülünde de explicit preHandler guard kullanilmis. Global guard yeterli oldugu için backend tarafinda temizlenmeli.

6. **Locale genişleme:** Turkce disinda dil eklenecekse tum yeni locale dosyaları ayni anda ikinci dil klasorune de yazilmali.
