# VistaSeeds — Perakende (Retail) Aktivasyon Planı

> Tarih: 2026-06-25 · Amaç: "biber tohumu" Shopping karuseline girmek + reklam tıklamasını siparişe çevirmek
> Strateji bağlamı: `VISTASEEDS-BIBER-TOHUMU-1-SIRA-STRATEJI-2026-06-25.md` (E maddesi = bu plan)
>
> ## ⚠️ KARAR (2026-06-26): Bu plan SÜPERSEDE edildi — perakende AYRI DOMENE taşındı
> **Perakende/B2C artık `agrodukkan.com`'da** (ayrı Next.js projesi, dropshipping, GA4 `G-V6M90WF480`, sepet+checkout).
> Dolayısıyla **vistaseeds.com.tr B2B/teklif modeli kalır** ve bu vistaseeds-retail planı **donduruldu**.
> - Google Shopping/Merchant + "biber tohumu Shopping karuseli" hedefi → **agrodukkan'ın işi** (bu doküman değil).
> - vistaseeds retail yeteneği flag-arkası brief'i (`CODEX-BRIEF-retail-faz1.md`, `retail_enabled=false`) **muhtemelen gereksiz** — perakende ihtiyacı agrodukkan'da karşılanıyor. İstenirse referans/yedek olarak kalır.
> - agrodukkan canlı açıkları (Shopping önkoşulu, tasarım WIP): ürün fiyatları ₺0, Product schema yok, OG yok. Bkz hafıza: `vistaseeds_retail_split_to_agrodukkan`.
>
> _(Aşağıdaki orijinal vistaseeds-retail fazları tarihsel referans olarak bırakıldı.)_

## ✅ Mevcut altyapı (sıfırdan kurmuyoruz — ~%80 hazır)
| Bileşen | Durum | Konum |
|---|---|---|
| Fiyatlı ürünler | VAR (24 biber ürünü dahil) | `backend/.../seed/sql/121_products_seed.sql`, `152_product_prices.sql` |
| Paylaşımlı products modülü | VAR (price/stock/currency) | `packages/shared-backend/modules/products` |
| Sipariş + ödeme şeması | VAR (iyzico) | `132_orders_schema.sql`, `payment_attempts`, `modules/order` |
| Google Merchant feed üreteci | VAR | `backend/.../modules/adsFeeds` → `getGoogleMerchantProductFeed` (products-feed.tsv) |
| Şablon (referans e-ticaret) | bereketfide (`urunler`, `bayi-odeme`) | `projects/bereketfide` |

## ❌ Retail için eksikler (aktivasyon işi)
1. **Public frontend teklif modunda** — fiyat gizli (`publicProductJson` price'ı strip ediyor), "Sepete Ekle" yok, sepet/checkout yok.
2. **Merchant Center hesabı + feed kaydı yok** (ekosistem tenant_settings'te merchant ayarı yok; canlı feed endpoint doğrulanmalı).
3. **GA4 e-ticaret event'leri yok** (view_item / add_to_cart / begin_checkout / purchase).
4. Shopping kampanyası yok.

---

## FAZLI PLAN

### FAZ 1 — Retail vitrin + sepet + ödeme (FRONTEND, Codex) — FLAG-GATED, default KAPALI
> ✅ **Brief hazır → `CODEX-BRIEF-retail-faz1.md`** (FIX R1-R3). Karar gereği `retail_enabled=false` teslim → teklif modeli canlıda korunur.
- [ ] (R1) `retail_enabled` flag → true ise `publicProductJson` fiyatı public'e açar; **false (default) ise mevcut price strip** (bugün değişmez).
- [ ] (R2) Ürün sayfasında flag true ise **fiyat + "Sepete Ekle"**; false ise mevcut teklif/WhatsApp akışı. "Sipariş Ver/Teklif" her iki modda KALIR (hibrit).
- [ ] (R3) Sepet + checkout (flag-gated, iyzico `modules/order`; bereketfide referans). Flag false → route'lar gizli.
- **Sonuç:** Yetenek koda hazır + KAPALI. Sahip "aç" derse: reklam → fiyatlı ürün + sepet. Bugün: teklif modeli aynen.

### FAZ 2 — GA4 e-ticaret ölçümü (FRONTEND + ekosistem)
- [ ] gtag/dataLayer ecommerce event'leri: `view_item`, `add_to_cart`, `begin_checkout`, `purchase` (value + items).
- [ ] Ekosistem: GA4 key event `purchase` zaten var; `add_to_cart` opsiyonel. Ads'e purchase import (REQUEST_QUOTE'un yanına).
- **Sonuç:** funnel ve gerçek satış ölçümü → değer-temelli teklif (tROAS) mümkün.

### FAZ 3 — Google Merchant + Shopping kampanyası (ekosistem, Claude Code) 🎯 SERP en büyük alan
- [ ] Merchant Center hesabı (vistaseeds.com.tr doğrula) + `products-feed.tsv` feed'i kaydet (feed üreteci hazır).
- [ ] Feed kalite: başlık ("Çarliston Biber Tohumu F1..."), görsel, fiyat, availability, GTIN/MPN (yoksa marka+MPN).
- [ ] **Shopping (veya PMax-retail) kampanyası** → "biber tohumu" Shopping karuseline gir (Farmer Life/Arzuman'ın olduğu yer).
- **Sonuç:** SERP'in en üstündeki en büyük görsel alanda görünürlük.

### FAZ 4 — SEO + içerik (paralel, orta vade)
- [ ] Retail ürün/kategori sayfalarına Product schema (fiyat+availability artık var) → zengin sonuç.
- [ ] `/tr/biber-tohumu` içerik + blog + dahili link (strateji dokümanı C maddesi).

---

## Bütçe / reklam (kullanıcı onayı VAR — 2026-06-25)
Bütçe artışı onaylandı. Dağıtım:
- **Şimdi (retail öncesi):** mevcut Search "Biber" — dönüşüm fix (WhatsApp) sonrası Hedef Gösterim Payı mutlak-tepe + bütçe.
- **Retail/Shopping sonrası:** asıl bütçe **Shopping kampanyasına** (en yüksek ROI'li görünürlük) + Search retail sayfalarına.
- **Sıra:** Faz 1-2 (retail vitrin+ölçüm) → Faz 3 (Shopping+bütçe) → tepe görünürlük.

## Roller (4 araç orkestrasyonu)
- **Claude Code (mimar):** bu plan + API kontratları + Merchant/Ads/GA4 wiring (Faz 3) + ekosistem dönüşüm.
- **Codex (implement):** Faz 1-2 frontend (vitrin/sepet/checkout/ecommerce event) — ayrı brief gerekli.
- **Antigravity:** vitrin/sepet UI görsel doğrulama.

## Sıradaki Claude Code aksiyonu
1. [x] Faz 1 Codex brief → ✅ `CODEX-BRIEF-retail-faz1.md` (flag-gated, default kapalı).
2. [ ] Faz 3 Merchant Center + Shopping → **BEKLEMEDE** (retail flag açılana kadar; karar gereği teklif modeli aktif).
İlgili: `ekosistem-sosyal-medya/yapilacak-isler/vistaseeds/`.
