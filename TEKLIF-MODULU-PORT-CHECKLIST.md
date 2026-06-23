# Teklif (Offer) Modülü — Bereketfide → Vistaseeds Port Checklist

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
