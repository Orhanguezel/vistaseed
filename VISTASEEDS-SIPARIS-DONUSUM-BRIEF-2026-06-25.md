# VistaSeeds — Sipariş Dönüşümü Hızlandırma Brief (Sezon)

> Tarih: 2026-06-25 · ⚡ SEZON ZİRVE — bu hafta hızlı sipariş hedefi
> Kaynak: ekosistem-sosyal-medya Google Ads analizi. Rapor: `ekosistem-sosyal-medya/raporlar/vistaseeds-ads-analiz-2026-06-25.pdf`

## Durum / neden bu iş?
Son 30g: **2.459 reklam tıklaması → 0 sipariş** (4.827 ₺ harcama). **Dönüşüm izlemesi DOĞRU çalışıyor** (Sipariş Ver formu → GA4 `generate_lead` + Ads "Fiyat teklifi" `AW-18007572524/UlZ9...`). Yani sorun reklamda değil — **tıklayan ziyaretçi formu doldurmuyor** (landing/form sürtünmesi).

Ads tarafında yapıldı (2026-06-25): final URL `/teklif-al`→`/siparis-ver` (redirect kalktı), biber-dışı + rakip negatifler, "sebze tohumu" jenerik kelime duraklatıldı. **Sıra site tarafında** — sipariş için en hızlı kaldıraç burada.

## Görevler (öncelik)

### 1 · WhatsApp ile Sipariş butonu — EN YÜKSEK ÖNCELİK
Soğuk reklam trafiğinin çoğu uzun form doldurmak istemiyor; WhatsApp ile direkt iletişim **dönüşümü ciddi artırır**.
- [x] `/siparis-ver` sayfasına (ve ürün sayfalarındaki "Sipariş Ver" CTA'larının yanına) belirgin **"WhatsApp ile Sipariş Ver"** butonu ekle. → `WhatsAppOrderButton` bileşeni: siparis-ver hero + form sol kolon + ürün detay action panel.
- [x] `wa.me/<numara>?text=...` — önceden doldurulmuş mesaj (örn. ürün adı/kategori sayfadan gelsin). Numara `site_settings.whatsapp_number` içinden gelir, hardcode değil; ürün adı/`?product=` bağlamı prefill'e işlenir.
- [x] **Dönüşüm bağla:** WhatsApp tıklamasında `fireAdsConversion('whatsapp')` çalışır → Ads'e ve GA4'e dönüşüm gider.
  - [x] `src/lib/ads-conversion.ts`: `fireAdsConversion` artık `'quote' | 'whatsapp'` kabul ediyor:
    - GA4 event: `gtag('event','whatsapp_click', { event_source:'order_cta', currency:'TRY' })`
    - Ads: `__adsConversions.whatsapp` (`site_settings.google_ads_conversion_whatsapp` etiketi — ayrı Ads conversion action gerekir; ekosistem tarafı oluşturacak)
  - [x] `src/components/seo/Analytics.tsx` + `layout.tsx`: `conversions` objesine `whatsapp` etiketi eklendi (quote gibi); `fetchAnalyticsConfig` `google_ads_conversion_whatsapp` çekiyor.
- **Ekosistem tarafı (Claude Code):** WhatsApp için Ads conversion action + `whatsapp_click` GA4 key event oluşturulacak. Buton canlıya çıkıp ilk tıklamalar gelince haber ver.

### 2 · Formu kısalt / 2 adıma böl — YÜKSEK
Mevcut alanlar: firma, email, telefon, kategori, miktar, lokasyon (+ fatura). Soğuk tıklayıcı için fazla.
- [x] **Adım 1 (zorunlu, minimum):** ad/firma + telefon + email + kategori. "Sipariş Talebini Gönder" → lead düşer (`fireAdsConversion('quote')` + Meta lead). 11 alandan 4 alana indi.
- [x] **Adım 2 (opsiyonel):** lokasyon, miktar, mesaj, fatura. "Detay ekle" ile açılır; atlanırsa satış ekibi tamamlar. Tek POST.
- [~] Alternatif (email opsiyonel): UYGULANMADI — backend `publicOfferCreateSchema.email` zorunlu + `offers.email` kolonu `NOT NULL` (paylaşımlı, bereketfide de kullanıyor). Email'i opsiyonel yapmak shared-backend şema + **canlı DB migration** gerektirir (riskli, kapsam dışı). Onun yerine email Adım 1'de tutuldu. Karar gerekirse ayrı ele alınır.
- **Amaç:** form tamamlama oranını yükseltmek. Şu an 2.459 tık → 0; küçük bir artış bile sezonda sipariş demek.

### 3 · Landing güven/aciliyet (opsiyonel, hızlı)
- [x] `/siparis-ver` hero'ya aciliyet rozeti eklendi ("Sezon stoğu sınırlı — hızlı dönüş için talebinizi bugün iletin", `Offers.urgency`).
- [x] Telefon numarası `tel:` ile tıklanabilir, hero'da WhatsApp butonunun yanında görünür (`site_settings.contact_phone`).

## Dosyalar
- Form: `frontend/src/modules/offers/offer-form.tsx`
- Sayfa: `frontend/src/app/[locale]/(public)/siparis-ver/page.tsx`
- Dönüşüm: `frontend/src/lib/ads-conversion.ts` (`fireAdsConversion`)
- Analytics: `frontend/src/components/seo/Analytics.tsx` + `src/app/layout.tsx` (`conversions` objesi)

## Deploy sonrası — ekosistem tarafı (Claude Code) ✅ TAMAMLANDI (2026-06-25)
- [x] **WhatsApp Ads conversion action** oluşturuldu: 702 hesabı, "WhatsApp Sipariş" (id **7661504359**, WEBPAGE/CONTACT, primary, ONE_PER_CLICK). gtag label: **`AW-18007572524/GXeHCOeOpcUcEKyA14pD`**.
- [x] `site_settings.google_ads_conversion_whatsapp` = `AW-18007572524/GXeHCOeOpcUcEKyA14pD` → seed `187_google_ads_conversion_settings.sql`'e eklendi + yerel DB yazıldı.
- [x] `whatsapp_click` → **GA4 key event** (property 538246354, ONCE_PER_SESSION).
- [x] **Çift sayım YOK doğrulandı:** quote (REQUEST_QUOTE, form) ve whatsapp (CONTACT, buton) ayrı action + ayrı label + ayrı tetikleyici.

> ⚠ **CANLI (VPS) DB'ye uygula** — site canlıda bu değeri okuyana kadar WhatsApp tıklaması Ads'e gitmez (GA4'e gider). whatsapp_number gibi VPS site_settings'e:
> ```sql
> INSERT INTO site_settings (id,`key`,locale,value,created_at,updated_at)
> SELECT UUID(),'google_ads_conversion_whatsapp','*','AW-18007572524/GXeHCOeOpcUcEKyA14pD',NOW(),NOW()
> WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE `key`='google_ads_conversion_whatsapp' AND locale='*');
> ```
> Script (ekosistem): `backend/scripts/vistaseeds-whatsapp-conv.ts`

İlgili: ekosistem `yapilacak-isler/vistaseeds/02-google-ads-kampanya.md`.
