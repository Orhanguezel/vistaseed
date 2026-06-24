# Teklif (Offer) Modülü — Bereketfide → Vistaseeds Port Checklist

> ## ✅ TAMAMLANDI (2026-06-23) — CANLIDA
> Tüm görevler uygulandı, build edildi ve deploy edildi.
> - Commit'ler: packages `2e2d071`, vistaseed `3587829`.
> - Backend ucu doğrulandı: `POST /api/v1/admin/offers/:id/direct-email` → **401** (kayıtlı), health 200.
> - 4 yeni durum enum'da (backend+admin), status select otomatik gösteriyor, tr etiketleri eklendi.
> - Admin'de "Doğrudan E-posta" butonu (RTK mutation) + gönderilen yanıtlar `admin_notes`'ta görünür.
> - **Önemli fark:** vistaseeds backend shared'i build-time'da derler (bereketfide gibi runtime-dist değil)
>   → deploy'da `cd projects/vistaseeds/backend && bun run build` + `pm2 restart vistaseed-backend` ŞART.
> - i18n borcu: "Doğrudan E-posta" modal metinleri hardcoded TR (admin-only). İstenirse t() anahtarına çevrilebilir.
> - Tüm `vistaseed-backend/frontend/admin-panel` online.
>
> _Aşağıdaki adımlar referans/denetim içindir._

---

Amaç: Bereketfide'de eklenen **teklif yanıt yetenekleri**ni Vistaseeds'e taşımak.
Yeni yetenekler: müşteriye **serbest metin "Doğrudan E-posta"** (PDF gerektirmez), gönderilen
yanıtın `admin_notes`'a otomatik loglanması, **4 ek sipariş/sevk durumu**, ve admin panelde
"Doğrudan E-posta" butonu + yanıt görünürlüğü.

> Hazırlayan: Claude (mimar). Görevleri buradan Codex/Antigravity ile yürütebilirsin.
> Tarih: 2026-06-23.

---

## 0) Önemli Bağlam — KARIŞTIRMA

- İki **AYRI** teklif modülü var (kopya değil, paralel implementasyon):
  - `packages/shared-backend/modules/offer` (**tekil**) → **bereketfide** kullanır (kaynak, kopyalanacak).
  - `packages/shared-backend/modules/offers` (**çoğul**) → **vistaseeds** kullanır (**hedef, düzenlenecek**).
- Bu bir **feature port**'tur, blind copy-paste DEĞİL. Vistaseeds `offers` modülünün kendi
  konvansiyonlarına uydur (ayrı `public.controller.ts`, `conversions.service.ts`, `template.ts`).
- **Vistaseeds'e özel `conversions.service.ts` / gclid (Google Ads dönüşüm) kodlarına DOKUNMA.**
- Repo dağılımı (bereketfide ile aynı):
  - Backend değişiklikleri → `packages/` reposu (`shared-ecosystem-packages.git`).
  - Admin/Frontend değişiklikleri → `projects/vistaseeds` reposu (`vistaseed.git`).
- Kaynak commit'ler (bereketfide tarafında referans diff):
  - packages: `780bc08` (direct-email ucu), `9979906` (4 durum + admin_notes log).
  - bereketfide admin: `5574dd6` (DirectEmailButton), `53eaf71` (notlar alanı).

## Zaten HAZIR olanlar (tekrar yapma)

- [x] `offers` tablosunda `admin_notes` LONGTEXT ve `status` VARCHAR(32) **var** —
  `projects/vistaseeds/backend/src/db/seed/sql/130_offers_schema.sql`. **DB/schema değişikliği GEREKMİYOR**
  (ALTER yok, fresh seed yok). 4 yeni durum bu VARCHAR(32)'ye sığar.
- [x] Drizzle schema'da `admin_notes` kolonu var — `packages/shared-backend/modules/offers/schema.ts`.
- [x] Admin detayda `status` select (7 değer) ve `admin_notes` textarea **var**.
- [x] Public "Teklif Al" formu var — `projects/vistaseeds/frontend/src/app/[locale]/(public)/teklif-al/page.tsx`.

---

## 1) BACKEND — `packages/shared-backend/modules/offers/` (çoğul)

### 1.1 Durum enum'una 4 değer ekle
- [ ] `validation.ts` → `OFFER_STATUSES` dizisine ekle (sıra önemli, UI ile aynı tut):
  `... 'accepted', 'in_production', 'ready_for_shipping', 'shipped', 'delivered', 'rejected', 'cancelled'`
  - Referans: `modules/offer/validation.ts` (bereketfide), satır ~20-32.

### 1.2 Direct-email body şeması
- [ ] `validation.ts` → ekle:
  ```ts
  export const offerDirectEmailBodySchema = z.object({
    subject: z.string().max(255).trim().optional().nullable(),
    message: z.string().trim().min(1).max(20000),
  });
  export type OfferDirectEmailBody = z.infer<typeof offerDirectEmailBodySchema>;
  ```

### 1.3 Service: `sendOfferDirectMail` (mail + admin_notes log + bildirim)
- [ ] `service.ts` → bereketfide'deki `sendOfferDirectMail`'i port et (`modules/offer/service.ts` ~672-729).
  Yaptıkları: serbest metin müşteri maili gönder → `admin_notes`'a zaman damgalı yanıt ekle (`updateOffer`) →
  admin notification + telegram bildirimi.
- [ ] **IMPORT FARKINA DİKKAT** (bereketfide ile aynı değil):
  - Vistaseeds `offers/service.ts` `sendMailRaw`'ı `'../mail-api/service'`'ten alıyor.
  - `wrapMailBody` / `escapeMailHtml` `mail-api/service`'te **YOK**; bunlar `modules/mail/index.ts`'te.
  - Çözüm: `import { wrapMailBody, escapeMailHtml } from '../mail';` ekle (sendMailRaw mevcut import'tan kalsın),
    veya basit `escape`/`wrap`'i fonksiyon içinde inline yaz. Hangi yol seçilirse derlemeyi doğrula.
- [ ] `updateOffer` ve `createNotificationForAdmins`/telegram helper'ların vistaseeds `offers` modülünde
  mevcut adlarını kullan (bereketfide'deki isimlerle birebir aynı olmayabilir — service.ts'i kontrol et).

### 1.4 Admin controller handler
- [ ] `admin.controller.ts` → `sendOfferDirectEmailAdmin` handler'ını ekle (`modules/offer/admin.controller.ts` ~507-548).
  - Param: `offerIdParamsSchema`; Body: `offerDirectEmailBodySchema`.
  - `getOfferById` → `sendOfferDirectMail` → başarılıysa `{ ok: true, message: 'E-posta gönderildi' }` döndür.
  - Hata: 404 not_found / 502 mail_failed / 500.
- [ ] `validation`'dan `offerDirectEmailBodySchema`, `service`'ten `sendOfferDirectMail` import et.

### 1.5 Route kaydı
- [ ] `admin.routes.ts` → mevcut `/offers/:id/email` kaydının yanına ekle:
  ```ts
  app.post(`${BASE}/:id/direct-email`, { preHandler: adminGuard }, sendOfferDirectEmailAdmin);
  ```
  - Controller import listesine `sendOfferDirectEmailAdmin` ekle.
  - Tam yol prod'da: `/api/v1/admin/offers/:id/direct-email`.

---

## 2) ADMIN PANEL — `projects/vistaseeds/admin_panel/`

### 2.1 Durum enum (admin tarafı — İKİNCİ tanım yeri!)
- [ ] `src/integrations/shared/offers/index.ts` → `OFFER_STATUSES`'a 4 değeri ekle (backend ile aynı sıra).
- [ ] Locale etiketleri: `src/locale/tr/admin/offers.json` (ve varsa `en`, `de`) → 4 yeni durumun çevirilerini ekle
  (Üretimde / Sevke Hazır / Sevk Edildi / Teslim Edildi).

### 2.2 Status select (detay ekranı)
- [ ] `src/app/(main)/admin/(admin)/offers/_components/offer-detail-client.tsx` → status `<Select>`'e 4 yeni
  `<SelectItem>` ekle (Radix: `value=""` KULLANMA). 7 → 11 seçenek.

### 2.3 RTK mutation — direct-email
- [ ] `src/integrations/endpoints/admin/offers-admin-endpoints.ts` → yeni mutation ekle:
  ```ts
  sendOfferDirectEmailAdmin: b.mutation<{ ok: boolean; message?: string }, { id: string; body: { subject?: string; message: string } }>({
    query: ({ id, body }) => ({ url: `${BASE}/${encodeURIComponent(id)}/direct-email`, method: 'POST', body }),
    invalidatesTags: (_r,_e,a) => [{ type: 'Offer', id: a.id }, { type: 'Offers', id: 'LIST' }],
  }),
  ```
  - `BASE`'i dosyadaki mevcut offer endpoint'leriyle aynı yap (RTK baseUrl `/api/v1`'i zaten ekler).
  - Hook'u export et: `useSendOfferDirectEmailAdminMutation`.
  - **DİKKAT (bereketfide'de yapılan hata):** bereketfide butonu raw `fetch('/api/v1/admin/...')` kullandı ve
    ilk sürümde `/v1` unutulup 404 oldu. Vistaseeds'te **RTK mutation** kullan — baseUrl'i RTK yönetir, bu hata olmaz.

### 2.4 "Doğrudan E-posta" butonu + modal
- [ ] `offer-detail-client.tsx` → aksiyon butonları arasına bir buton + modal ekle (konu opsiyonel, mesaj zorunlu).
  - Referans UI: bereketfide `admin-offer-detail-client.tsx` içindeki `DirectEmailButton` (commit `5574dd6`).
  - Vistaseeds'in kendi UI komponentlerini (Button/Textarea/Input, toast) kullan; bereketfide'nin raw fetch'ini
    2.3'teki RTK hook ile değiştir.
- [ ] `admin_notes` textarea'yı (varsa rows küçükse) büyüt ve "Dahili Notlar / Gönderilen Yanıtlar" etiketi ver
  (gönderilen yanıtlar artık buraya otomatik düşecek). Referans: bereketfide commit `53eaf71`.

---

## 3) DB — DEĞİŞİKLİK GEREKMİYOR
- [ ] (Doğrula) `offers` tablosu `admin_notes` LONGTEXT + `status` VARCHAR(32) içeriyor → **ALTER YOK, fresh seed YOK**.
  4 yeni durum sadece validation katmanı (enum) işi.

---

## 4) BUILD & DEPLOY (VPS: `vps-vistainsaat`, aynı sunucu)

- [ ] Lokalde commit + push:
  - `packages/` (shared offers) → `shared-ecosystem-packages.git`.
  - `projects/vistaseeds` (admin) → `vistaseed.git`.
- [ ] Lokal doğrulama: kökten `bun run build:shared` (tip hatası kontrolü). Gerekirse vistaseeds backend `bun run build`.
- [ ] VPS'te (env KORU — pull öncesi `frontend/.env.production` + `admin_panel/.env.production` yedekle, pull sonrası geri yaz):
  - `cd /var/www/tarim-dijital-ekosistem/packages && git pull --ff-only`
  - `cd /var/www/tarim-dijital-ekosistem/projects/vistaseeds && git pull --ff-only`
  - Kökte `bun run build:shared` (dist'i üretir — `dist` gitignore, hep VPS'te build edilir).
  - Backend, shared'i **runtime'da** `dist`'ten yükler → `pm2 restart vistaseed-backend` yeni ucu alır
    (backend `bun run build` VPS'te Drizzle çoklu-instance tip hatası verebilir ama runtime'ı etkilemez).
  - Admin: `cd admin_panel && rm -rf .next && bun run build && pm2 restart vistaseed-admin-panel`.
- PM2 isimleri: `vistaseed-backend`, `vistaseed-admin-panel`, `vistaseed-frontend`.
- > Deploy akışı detayları bereketfide ile birebir aynıdır.

---

## 5) DOĞRULAMA (deploy sonrası)

- [ ] Backend uç kayıtlı mı: `curl -s -o /dev/null -w "%{http_code}" -X POST http://127.0.0.1:<VS_BACKEND_PORT>/api/v1/admin/offers/<bir-id>/direct-email -H "Content-Type: application/json" -d '{"message":"x"}'` → **401** (404 DEĞİL).
- [ ] Durum PATCH: yeni 4 durumun (`in_production` vb.) validation'dan geçtiğini doğrula (panelden kaydet veya schema test).
- [ ] Panelden bir test teklifine "Doğrudan E-posta" gönder → müşteri maili gitti mi + `admin_notes`'a yanıt loglandı mı.
- [ ] Status select'te 11 seçenek görünüyor ve kaydediliyor mu.

---

## 6) Notlar / Riskler
- `offers` modülü paylaşımlı; ama bu değişiklikler **additive** (yeni uç + yeni enum değerleri) → bereketfide'yi etkilemez.
- Hardcode yok: status etiketleri locale'den, API path RTK baseUrl'den gelsin.
- Mail gönderen adres ekosistem ortak SMTP'sidir (vistaseeds kendi `mail-api` ayarını kullanır) — gönderen/reply-to'yu kontrol et.
- İş bittiğinde bu dosya silinebilir veya `docs/` altına arşivlenebilir.

---
---

# PART 2 — "Sipariş Ver" CTA + Teklif → Sipariş Yeniden Adlandırma

> ## ✅ TAMAMLANDI & CANLIDA (2026-06-24)
> - Kod: G1–G5 uygulandı (commit'ler `ab27155`, `c860d8b`, `ecbeab2`, `b66e212`), push edildi.
> - Deploy: `vps-vistainsaat` → pull + frontend/admin `bun run build` + `pm2 restart`. Backend dokunulmadı (restart yok).
> - **G2 — 301 redirect:** `url_redirects` tablosuna 4 kural eklendi (`/tr|/en|/de/teklif-al` + bare → `/siparis-ver`). Origin + Cloudflare'da **301** doğrulandı (cf-cache-status: DYNAMIC).
> - Doğrulama: `/XX/siparis-ver` 200; eski `/XX/teklif-al` 301; sitemap 12× siparis-ver (teklif-al yok); home'da "Sipariş Ver" CTA render. `bun test` 13/13.
> - G7 (backend mail) gereksiz çıktı (template'te "teklif" yok). page-seo key `"teklif-al"` kasıtlı korundu (DB SEO içeriği).
>
> _Aşağısı referans/denetim içindir._

---

> Hazırlayan: Claude (mimar). Tarih: 2026-06-24.
> Part 1 (yukarısı) tamamlanmış backend feature port'udur. Part 2 ayrı bir iştir:
> müşteriye görünen dili **"Teklif" → "Sipariş"** yapmak ve siteye **"Sipariş Ver" CTA**'ları eklemek.

## 0) Alınan Kararlar (sahip onayladı — 2026-06-24)

| Konu | Karar |
|------|-------|
| **URL/Slug** | `/teklif-al` → **`/siparis-ver`** olacak + `/teklif-al`'dan **301 redirect**. |
| **Admin paneli** | Admin'de de **"Teklif" → "Sipariş"** olacak (TR locale, dahili araç ama tutarlılık için). |
| **CTA yerleri** | **Ürün detay sayfası + Ürün kartı (liste) + Header/Footer + Ana sayfa bölümü** — 4 yere de. |

## 0.1) DOKUNMA — Değişmeyecekler (kritik)

Bu isimler **kod/altyapı** seviyesindedir, müşteriye görünmez. Değiştirmek analitik/backend kırar:

- [ ] `source: "teklif-al"` (form payload) → **AYNEN KALIR**. gclid + GA4 `generate_lead` + Meta CAPI bu değere bağlı. Değiştirirsen dönüşüm takibi kopar. (`offer-form.tsx`, `submit-bulk-offer.ts` union tipi.)
- [ ] API path'leri `/api/v1/offers/public`, `/api/v1/admin/offers/*` → **AYNEN KALIR**.
- [ ] Backend modül klasörleri `modules/offer`, `modules/offers` → **AYNEN KALIR**.
- [ ] DB tabloları/kolonları (`offers`, `status`, `admin_notes`) ve `OFFER_STATUSES` **enum anahtarları** (`new`, `quoted`, …) → **AYNEN KALIR**. Sadece **görünen etiketler** (label) değişir.
- [ ] RTK hook/endpoint isimleri (`useListOffersAdminQuery` vb.) → **AYNEN KALIR**.

> Kural: "offer/offers/teklif-al" = teknik kimlik (sabit). "Sipariş/Sipariş Ver" = sadece UI metni.

---

## 1) FRONTEND — Slug rename `/teklif-al` → `/siparis-ver` ✅ TAMAMLANDI (Claude, 2026-06-24, `bun test` 10/10 yeşil; commit bekliyor)

### 1.1 Sayfa klasörünü taşı
- [x] Klasörü yeniden adlandır:
  `frontend/src/app/[locale]/(public)/teklif-al/` → `.../siparis-ver/` (`git mv`, rename temiz algılandı)
  - `localePrefix: "always"` ve slug diller arası aynı olduğu için `routing.ts` pathnames'e EKLEMEK ŞART DEĞİL (fallback `${prefix}${pathname}` zaten çalışır). Eklenmedi.

### 1.2 Route sabitini güncelle
- [x] `frontend/src/config/routes.ts` satır 55: `request_offer: "/siparis-ver"`.

### 1.3 Sitemap
- [x] `frontend/src/app/sitemap.ts` → `/siparis-ver`.

### 1.4 Testler
- [x] `routing.test.ts` + `seo.test.ts` → `/siparis-ver`'e güncellendi, `bun test` yeşil.

### 1.5 (ek) Canonical pathname
- [x] `siparis-ver/page.tsx:209` → `pathname: "/siparis-ver"`. page-seo **key**'i (`"teklif-al"`) kasıtlı korundu (DB SEO içeriği kaybolmasın). Sonra admin page-seo DB row ile koordineli rename edilebilir.

### 1.5 301 Redirect (eski URL'i kaybetme — SEO)
- [ ] **Redirects modülünden** (`/admin/redirects`, [[vistaseeds_redirects_module]]) 3 kayıt ekle, hepsi **301**:
  - `/tr/teklif-al` → `/tr/siparis-ver`
  - `/en/teklif-al` → `/en/siparis-ver`
  - `/de/teklif-al` → `/de/siparis-ver`
  - (Locale-agnostic tek kural destekliyse `/teklif-al` → `/siparis-ver` tek satır da olur — proxy.ts mantığını kontrol et.)
- [ ] Deploy sonrası `curl -I https://vistaseeds.com.tr/tr/teklif-al` → **301** + `Location: /tr/siparis-ver` doğrula.

---

## 2) FRONTEND — Metin: "Teklif" → "Sipariş"

> TR=Sipariş, EN=Order, DE=Bestellung. Form alanları i18n'den geldiği için JSON güncellemesi otomatik yayılır.

### 2.1 i18n message dosyaları (3 dil)
- [ ] `frontend/messages/{tr,en,de}.json` → şu anahtarları güncelle:
  - `Offers.meta.title` — "Teklif Al - Toplu Satış" → "Sipariş Ver - Toplu Satış" (EN "Place an order…", DE "Bestellung aufgeben…")
  - `Offers.meta.description` — "teklif" → "sipariş" diline çevir
  - `Offers.form.submit` — "Teklif Talebi Gönder" → "Sipariş Talebi Gönder"
  - `Offers.payload.customerFallback` — "Teklif talebi" → "Sipariş talebi"
  - `Offers.title` / `Offers.description` / `Offers.responseNote` vb. içinde "teklif" geçen tüm değerler
  - `Products.detail.ctaPanel.title` — "Hemen teklif alın" → "Hemen sipariş verin" (EN/DE karşılığı)
  - `Products.detail.ctaPanel.subtitle` — gerekiyorsa güncelle
- [ ] **Not:** `Offers.*` anahtar **adları** değişmez, sadece **değerleri**. (Anahtar = teknik kimlik.)

### 2.2 Sayfa içi hardcoded metinler
- [ ] `frontend/src/app/[locale]/(public)/siparis-ver/page.tsx` → `pageContent` objesi (satır ~14-203) TR/EN/DE inline metinlerinde "Teklif/Teklif Al/Request a quote/Angebot" → "Sipariş/Sipariş Ver/Order/Bestellung".
  - Hero başlık, ürün grup kartları, süreç adımları, FAQ, footer CTA — hepsini tara.
  - **İdeal:** bu inline `pageContent`'i de i18n'e taşımak (hardcode yasağı), ama kapsam büyürse ayrı task'a bırak — minimum: metinleri "Sipariş" yap.

---

## 3) FRONTEND — "Sipariş Ver" CTA'ları (4 yer)

> Ortak: link her zaman `toLocalizedPath(ROUTES.static.request_offer, locale)` ile üretilsin (hardcode `/siparis-ver` YASAK). Buton etiketi yeni i18n anahtarından gelsin.

### 3.0 Ortak CTA etiketi (i18n)
- [ ] `frontend/messages/{tr,en,de}.json` → yeni anahtar ekle, örn:
  `"Common.cta.placeOrder"`: TR "Sipariş Ver" / EN "Place Order" / DE "Bestellen".
- [ ] (Opsiyonel) Tekrarı önlemek için küçük bir `OrderCtaButton` bileşeni: `frontend/src/modules/offers/order-cta-button.tsx` — props: `variant`, `size`, opsiyonel `productSlug`. İçinde `Link` + i18n etiketi. 4 yerde de bunu kullan.

### 3.1 Ürün detay sayfası (şu an /iletişim'e gidiyor — düzelt)
- [ ] `frontend/src/app/[locale]/(public)/urunler/[slug]/page.tsx` CTA paneli (satır ~840-861):
  - Birincil butonu **"Sipariş Ver"** yap, hedefi `/iletişim` yerine `toLocalizedPath(ROUTES.static.request_offer, currentLocale)`.
  - (Opsiyonel/önerilen) Forma ürün bağlamını taşı: `?product=<slug>` ekle → 3.5'te form prefill.
  - "Karşılaştır" butonu kalsın.

### 3.2 Ürün kartı (liste)
- [ ] `frontend/src/modules/product/components/ProductCard.tsx` → küçük ikincil "Sipariş Ver" butonu/linki ekle (mevcut "detay linki + Karşılaştır" yanına). `OrderCtaButton size="sm"`.
  - Kart yoğunluğu artmasın diye `variant="ghost"`/küçük boy tercih et.

### 3.3 Header / Footer (global)
- [ ] Global Header bileşenini bul (muhtemelen `frontend/src/components/` veya `frontend/src/modules/layout/` altında) → ana nav'a/sağ aksiyona kalıcı **"Sipariş Ver"** vurgulu buton ekle.
- [ ] Footer bileşeni → hızlı erişim/CTA bölümüne "Sipariş Ver" linki ekle.
- [ ] Mobil menüde de görünür olsun.

### 3.4 Ana sayfa bölümü
- [ ] Home sayfasına (`frontend/src/app/[locale]/(public)/page.tsx` veya home modül bileşenleri) "Sipariş Ver" çağrısı içeren bir CTA banner/section ekle. Mevcut bölüm dilini bozmadan, marka tonuna uygun.

### 3.5 (Opsiyonel) Ürün bağlamlı prefill
- [ ] `siparis-ver/page.tsx` + `offer-form.tsx` → `?product=<slug>` query'sini oku, mesaj alanına/gizli alana ürün adını ön-doldur. Müşteri hangi ürün için sipariş verdiğini yazmak zorunda kalmaz. `source` yine `"teklif-al"` kalır.

---

## 4) ADMIN PANEL — "Teklif" → "Sipariş" (TR locale)

> Karar: admin'de de Sipariş. Sadece **görünen etiketler**; enum anahtarları/endpoint/hook isimleri değişmez (bkz. 0.1).

### 4.1 Offers locale dosyası
- [ ] `admin_panel/src/locale/tr/admin/offers.json` → tüm "Teklif/Teklifler" değerlerini "Sipariş/Siparişler" yap:
  - `header.title` "Teklifler" → "Siparişler"; `header.description` "teklif kayıtları" → "sipariş kayıtları"
  - `actions.create` "Yeni Teklif" → "Yeni Sipariş"
  - `filters.searchPlaceholder` "Teklif no…" → "Sipariş no…"
  - `table.offerNo` "Teklif No" → "Sipariş No"
  - `list.loading/empty`, `detail.newTitle/editTitle`, `messages.*` (created/updated/deleted/pdfGenerated/emailSent/confirmDelete) → hepsinde "teklif" → "sipariş"
- [ ] **Status etiketleri** (`statuses.*`) — anahtarlar sabit, label sipariş diline uyarlanır:
  - `quoted` "Teklif Hazır" → **"Fiyat Verildi"** (veya "Onay Bekliyor") — sipariş bağlamına uygun yap
  - diğerleri uygun: new=Yeni, in_review=İncelemede, sent=Gönderildi, accepted=Onaylandı, in_production=Üretimde, ready_for_shipping=Sevke Hazır, shipped=Sevk Edildi, delivered=Teslim Edildi, rejected=Reddedildi, cancelled=İptal

### 4.2 Sidebar / Dashboard / Menü
- [ ] `admin_panel/src/locale/tr/admin/sidebar.json` (satır ~88) → `items.offers` "Teklifler" → "Siparişler"
- [ ] `admin_panel/src/navigation/sidebar/sidebar-items.ts` (satır ~199) → `FALLBACK_TITLES.offers` "Teklifler" → "Siparişler"
- [ ] `admin_panel/src/locale/tr/admin/dashboard.json` (satır ~30) → `items.offers` "Teklifler" → "Siparişler"

### 4.3 Bileşen içi hardcoded metinler
- [ ] `offers/_components/offer-detail-client.tsx`:
  - satır ~492 `<h3>Müşteriye E-posta Gönder</h3>` → bağlama göre kalabilir (sipariş müşterisine mail)
  - satır ~499 placeholder `"Teklif Talebiniz Hk."` → `"Siparişiniz Hk."`
  - "Doğrudan E-posta" modal metinleri (Part 1'de hardcoded TR bırakılmıştı) → "teklif" geçen yer varsa "sipariş" yap.

### 4.4 (Opsiyonel) site-settings SEO etiketleri
- [ ] `admin_panel/src/locale/tr/admin/site-settings.json` satır ~500/698 `"teklif": "Teklif"` / `"offer": "Teklif"` → frontend SEO sayfa adı `siparis-ver` olduysa etiketi "Sipariş" yap ve **page-seo anahtar** uyumunu kontrol et ([[vistaseeds_page_seo_keys]]).

---

## 5) BACKEND — Değişiklik var mı?

- [ ] **Hayır, zorunlu değil.** Public mail şablonları/`template.ts` müşteriye "teklif" kelimesi yazıyorsa (`offers/template.ts`, `customerFallback`, mail gövdesi) → müşteri deneyimi için "sipariş"e çevrilmeli. Kontrol et:
  - `packages/shared-backend/modules/offers/template.ts` ve mail metinleri → müşteriye giden TR metinlerde "teklif" → "sipariş".
  - **Dikkat:** `offers` modülü paylaşımlı (bereketfide de kullanıyor olabilir). Mail metni hardcode ise ve bereketfide "teklif" demek istiyorsa → metni site_settings/env'den al ya da vistaseeds'e özel override. **Toplu değişiklik yapma**, önce kim kullanıyor kontrol et.

---

## 6) BUILD & DEPLOY

> Part 1 ile aynı altyapı. Bu turda backend değişmezse `build:shared`/backend restart gerekmeyebilir.

- [ ] Lokal: `bun run build:shared` (backend template'e dokunulduysa), frontend + admin `bun run build` tip kontrolü.
- [ ] Commit/push:
  - Frontend + admin değişiklikleri → `vistaseed.git`.
  - (Varsa) `offers/template.ts` → `shared-ecosystem-packages.git`.
- [ ] VPS (`vps-vistainsaat`, env KORU — pull öncesi `.env.production` yedekle/geri yaz, [[vistaseeds_prod_deploy_quirks]]):
  - `frontend`: `rm -rf .next && bun run build && pm2 restart vistaseed-frontend`
  - `admin_panel`: `rm -rf .next && bun run build && pm2 restart vistaseed-admin-panel`
  - (backend dokunulduysa) kökte `bun run build:shared` + `cd backend && bun run build` + `pm2 restart vistaseed-backend`
- [ ] Next fetch-cache temizliği gerekebilir ([[vistaseeds_i18n_as_needed_and_dynamic_content]]).

---

## 7) DOĞRULAMA (deploy sonrası)

- [ ] `curl -I https://vistaseeds.com.tr/tr/teklif-al` → **301** → `/tr/siparis-ver` (en/de de).
- [ ] `https://vistaseeds.com.tr/tr/siparis-ver` 200 açılıyor, başlık/buton "Sipariş Ver".
- [ ] Header/Footer'da "Sipariş Ver" CTA görünür (desktop + mobil); ürün kartı ve ürün detayında buton var, doğru URL'e gidiyor.
- [ ] Ürün detay CTA artık `/iletişim`'e DEĞİL `/siparis-ver`'e gidiyor.
- [ ] Form gönderiminde payload `source` hâlâ `"teklif-al"` (DevTools Network) → analitik kopmadı.
- [ ] GA4'te `generate_lead` event'i hâlâ düşüyor (form submit sonrası).
- [ ] Admin: sidebar "Siparişler", liste/detay başlıkları ve status etiketleri "Sipariş" diline uygun; status kaydetme çalışıyor.
- [ ] EN/DE sayfalarda "Order"/"Bestellung" metinleri doğru, eksik çeviri (anahtar açıkta) yok.

---

## 8) Riskler / Notlar

- **SEO:** slug değişimi var → 301 ZORUNLU, sitemap güncel, eski URL'in iç linkleri kalmasın. Soft-404 izle ([[vistaseeds_redirects_module]]).
- **Analitik:** `source`/endpoint/enum anahtarları sabit kaldığı için Google Ads dönüşümü ve audit etkilenmez. Tek dikkat: dönüşüm sayfası URL'i Ads'te `/teklif-al` ile tanımlıysa Ads tarafında URL kuralını güncelle.
- **Paylaşımlı modül:** `offers` shared; admin/frontend metin değişiklikleri vistaseeds reposunda → bereketfide etkilenmez. Sadece `template.ts`/shared mail metni bereketfide ile çakışabilir — orada dikkatli ol.
- **Dil:** Sadece TR admin locale var; FR/EN/DE admin yok. Frontend 3 dil tam çevrilmeli.
- **i18n borcu:** `siparis-ver/page.tsx` inline `pageContent`'i hâlâ hardcode (3 dil). Bu turda metni "Sipariş" yapmak yeterli; tamamen i18n'e taşımak ayrı iyileştirme task'ı.
