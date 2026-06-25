# CODEX BRIEF — Sipariş Formu: Admin satır-kalem editörü + önizle/gönder

> **Sen (Codex) admin panel tarafını uygulayacaksın.** Backend (PDF şablonu + e-posta template + PDF ek) **Claude tarafından TAMAMLANDI ve görsel doğrulandı** — ekteki SİPARİŞ FORMU birebir çıkıyor. Senin işin: admin panelde bu formu besleyecek **yapısal veri girişini** (müşteri/fatura alanları + çok satırlı ürün tablosu) eklemek, **önizle-sonra-gönder** akışını netleştirmek, ve **hardcoded localhost:8083** bug'ını düzeltmek.
> Tarih: 2026-06-24. Proje: `projects/vistaseeds/admin_panel`. **Admin panel kuralları KATI** → `admin_panel/CLAUDE.md` + `ADMIN_PANEL_RULES.md` oku (shared-first, barrel, locale, kebab-case, i18n hardcode YASAK).

## Backend kontratı (SABİT — Claude yaptı, sen buna yaz)

PDF + e-posta `offers.form_data` JSON içinden okuyor. Şema **kesin**:
```ts
form_data = {
  billing: {
    ticariAd, vergiDairesi, vergiNo, mersisNo,
    telFax, gsm, eposta, adres, sevkAdresi      // hepsi string, opsiyonel
  },
  items: [{
    urun, formulasyon, ambalaj, birim, odemeTarihi,  // string
    miktar, birimFiyat, toplam, vadeGun              // number | string
  }],
  aciklama: string,        // AÇIKLAMA kutusu
  siparisAlan: string      // imza satırı "SİPARİŞ ALAN" altındaki isim
}
```
- Fallback'ler backend'de var: `billing.ticariAd` boşsa `company_name`/`customer_name`, `telFax` boşsa `phone`, `eposta` boşsa `email`. Yani bu alanları boş bırakırsan üst seviye alanlardan dolar.
- **Satır toplamı:** `toplam` verilmezse backend `miktar * birimFiyat` hesaplar. **Sipariş toplamı** = satırların toplamı.
- Backend dosyaları (DOKUNMA, referans): `packages/shared-backend/modules/offers/template.ts` (`renderOfferDocumentHtml`, `renderOfferEmailHtml`, `computeOfferTotal`), `service.ts` (`sendOfferEmail` artık PDF'i **ek** olarak gönderiyor).

## ⛔ DOKUNMA
- `source` alanı, API path'leri (`/admin/offers/*`), enum anahtarları, RTK hook isimleri.
- `packages/` backend (Claude'un alanı). Sen sadece `admin_panel/`.

---

## Görevler

### G1 — shared/offers veri katmanı (`src/integrations/shared/offers/index.ts`)
> Bu dosya `form_data`'yı forma çeviriyor. Yapısal alanları **first-class** yap, `form_data_text` ham JSON'a güvenme.

- [ ] Tip ekle: `OfferBilling` (9 alan) ve `OfferLineItem` (9 alan) — yukarıdaki kontrata birebir.
- [ ] `OfferDetailFormState`'e ekle: `billing: OfferBilling`, `items: OfferLineItem[]`, `aciklama: string`, `siparisAlan: string`. (`form_data_text`'i KORU — "diğer/ekstra" keyler ve power-user için; ama billing/items/aciklama/siparisAlan artık yapısal alanlardan yönetilir.)
- [ ] `createEmptyOfferDetailForm`: `billing` boş obje, `items: []`, `aciklama:""`, `siparisAlan:""`. **`currency` default'unu `"TRY"` yap** (sipariş formu TL; şu an "EUR").
- [ ] `mapOfferToDetailForm`: `form_data.billing/items/aciklama/siparisAlan`'ı yapısal alanlara oku. `form_data_text`'i geri kalan (bu 4 anahtar HARİÇ) keylerden üret ya da tüm form_data'yı göster (advanced).
- [ ] `buildOfferPayload`: yapısal alanları `form_data`'ya **geri yaz** — mevcut `form_data_text` parse'ını koru ama üstüne `{ billing, items: temizlenmiş, aciklama, siparisAlan }` MERGE et (diğer keyler kaybolmasın). Boş item satırlarını (tüm alanları boş) ele.
- [ ] **`gross_total` otomatik:** items varsa `gross_total = Σ lineTotal(item)` (miktar×birimFiyat veya explicit toplam). Liste ekranındaki "Toplam" bundan beslenir. Helper'ı shared'e koy (`computeOfferItemsTotal`).
- [ ] Helper: `lineTotal(item)` (number|null), `recalcItemTotals(items)` — UI canlı toplam için.
- Barrel/explicit export kurallarına uy.

### G2 — Detay ekranı satır-kalem + fatura editörü (`offers/_components/offer-detail-client.tsx`)
- [ ] Yeni sekme **"Sipariş Formu"** (veya mevcut "Müşteri"/"Fiyatlama" sekmelerini yeniden düzenle). İçinde:
  - **Fatura/Müşteri bloğu:** ticariAd, vergiDairesi, vergiNo, mersisNo, telFax, gsm, eposta, adres (textarea), sevkAdresi (textarea). Mevcut UI primitive'leri (Input/Textarea) + locale label.
  - **Ürün tablosu editörü:** satır ekle/sil. Kolonlar: Ürün, Formülasyon, Ambalaj, Miktar, Birim, Birim Fiyat, **Toplam (otomatik, read-only)**, Vade (gün), Ödeme Tarihi. Miktar/Birim Fiyat değişince Toplam ve **SİPARİŞ TOPLAMI** canlı güncellensin.
  - **Açıklama** (textarea) + **Sipariş Alan** (input).
  - Alt satırda canlı **SİPARİŞ TOPLAMI ({currency})**.
- [ ] Mevcut "Fiyatlama" sekmesindeki net/kdv/kargo/gross alanları kalabilir (opsiyonel manuel override) ama `gross_total` items'tan otomatik geliyor — kullanıcı düzenlerse uyumu koru (basit tut: items varsa otomatik kazanır).
- [ ] Raw "JSON" sekmesi: KORU ama "ekstra/gelişmiş" olarak işaretle (yapısal alanlar artık ayrı). İstersen read-only önizleme yap.

### G3 — localhost:8083 hardcode FIX (kritik bug)
- [ ] `offer-detail-client.tsx:63` → `return \`http://localhost:8083${...}\`` **hardcoded**. Canlıda kırık (panel.vistaseeds.com.tr'de localhost'a gider).
  - PDF dosyaları backend `/uploads/...`'tan servis ediliyor. Önizleme base'i **config/env'den** gelmeli (örn. `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_FILE_BASE_URL`'in origin'i, ya da projede zaten varsa runtime-config helper'ı). Hardcode'u kaldır, shared bir helper'a taşı (`buildUploadUrl(path)`), env'den oku. Mevcut diğer modüller (storage/gallery) dosya URL'ini nasıl çözüyorsa onu kullan — **tutarlılık**.

### G4 — Önizle-sonra-gönder akışı
- [ ] Mevcut: "Doküman Üret" → iframe önizleme (Meta sekmesi), "E-posta Gönder", "Üret ve Gönder". Akışı netleştir:
  - Buton sırası mantıklı olsun: **Önizle (Üret)** → iframe'de gör → **Gönder** (artık PDF ek olarak gidiyor).
  - "Gönder"den önce PDF üretilmemişse uyarı/otomatik üret. (Backend `sendOfferEmail` zaten taze PDF üretiyor, ama UX'te kullanıcı önce önizlesin.)
- [ ] RTK mutation'ları aynı (`useGenerateOfferPdfAdminMutation`, `useSendOfferEmailAdminMutation`, `useSendOfferAdminMutation`). Yeni endpoint gerekmez.

### G5 — Locale (`src/locale/tr/admin/offers.json`)
- [ ] Yeni anahtarlar: fatura alan label'ları (ticariAd/vergiDairesi/vergiNo/mersisNo/telFax/gsm/adres/sevkAdresi), ürün tablo kolon başlıkları (urun/formulasyon/ambalaj/miktar/birim/birimFiyat/toplam/vadeGun/odemeTarihi), açıklama, siparisAlan, "Satır Ekle"/"Satır Sil", "Sipariş Toplamı", önizle/gönder metinleri. **Hardcode YASAK.**
- [ ] `bun run locales:generate` çalıştır.

### G6 — Doğrulama
```bash
cd projects/vistaseeds/admin_panel
bun run locales:generate
bun x tsc --noEmit --incremental false --pretty false   # stale .next/types olabilir → build sonrası tekrar al
bun run build
```
- [ ] Elle: yeni sipariş oluştur → fatura + 2-3 ürün satırı gir → SİPARİŞ TOPLAMI doğru → "Doküman Üret" → iframe'de ekteki forma benzeyen PDF → "Gönder" → mail PDF ekli gitti.

## Kabul kriterleri
- [ ] Satır ekle/sil çalışıyor; Toplam + Sipariş Toplamı canlı.
- [ ] Kaydet sonrası `form_data.items/billing/aciklama/siparisAlan` doğru yazılıyor; tekrar açınca doluyor (round-trip).
- [ ] `gross_total` items toplamına eşit; liste "Toplam" doğru.
- [ ] Hiçbir yerde `localhost:8083` hardcode kalmadı (`grep -rn "8083" src` boş).
- [ ] PDF ekteki SİPARİŞ FORMU gibi (Claude'un ürettiği örnekle kıyasla).
- [ ] tsc + build temiz, hardcoded metin yok, locale generate edildi.

## Çıktı (Claude'a dön)
- Değişen dosyalar + commit (vistaseed.git).
- `grep 8083` ve round-trip kanıtı, build/tsc sonuçları.
- G3'te dosya URL'ini hangi env/helper ile çözdüğün (tutarlılık için).
