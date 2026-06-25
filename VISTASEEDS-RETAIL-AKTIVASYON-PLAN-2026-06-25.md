# VistaSeeds — Perakende (Retail) Aktivasyon Planı

> Tarih: 2026-06-25 · Amaç: "biber tohumu" Shopping karuseline girmek + reklam tıklamasını siparişe çevirmek
> Strateji bağlamı: `VISTASEEDS-BIBER-TOHUMU-1-SIRA-STRATEJI-2026-06-25.md` (E maddesi = bu plan)

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

### FAZ 1 — Retail vitrin + sepet + ödeme (FRONTEND, Codex) ⚡ öncelik
- [ ] `publicProductJson` price strip'i kaldır VEYA retail flag (`site_settings.retail_enabled`) ile fiyatı public'e aç (backend, küçük).
- [ ] Ürün sayfasında **fiyat + "Sepete Ekle"** göster (quote formunun yanında ya da yerine). Mevcut `modules/order` (iyzico) sepet/checkout akışına bağla.
- [ ] Sepet + checkout sayfaları (bereketfide `urunler`/`bayi-odeme` + vistaseeds `modules/order` referans).
- [ ] "Sipariş Ver/Teklif" (B2B/toptan) butonu KALSIN — **hibrit**: perakende sepet + toptan teklif yan yana.
- **Sonuç:** "biber tohumu" reklamı → fiyatlı ürün + sepet → soğuk retail alıcı doğrudan satın alır (quote formu sürtünmesi biter).

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
1. Faz 1 için Codex brief'i yaz (publicProductJson + ürün vitrin fiyat/sepet + order akışı bağlama).
2. Faz 3 Merchant Center + Shopping kampanya planı (ekosistem tarafı, ben yaparım).
İlgili: `ekosistem-sosyal-medya/yapilacak-isler/vistaseeds/`.
