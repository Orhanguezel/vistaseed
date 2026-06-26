# CODEX BRIEF — VistaSeeds Retail Faz 1 (FLAG-GATED, varsayılan KAPALI)

> Kaynak: `VISTASEEDS-RETAIL-AKTIVASYON-PLAN-2026-06-25.md` Faz 1.
> ⚠️ **İŞ MODELİ KARARI (2026-06-26): TEKLİF modeli kalsın.** Perakende canlıda AÇILMAYACAK.
> Bu brief retail **yeteneğini** koda hazırlar ama **`site_settings.retail_enabled=false` ile KAPALI** teslim eder.
> Amaç: ileride sahip "aç" dediğinde tek flag ile aktif olsun; bugün hiçbir public davranış değişmesin.

## Neden flag-gated, kapalı?
- Sahip teklif modelini seçti → bugün fiyat/sepet public'te görünmemeli (mevcut memory: "vistaseeds fiyat yok / teklif-al modeli").
- Ama altyapı ~%80 hazır (fiyatlı ürünler, order/iyzico şeması, Merchant feed üreteci var). Yeteneği şimdi flag arkasına kurmak, sonra "aç" kararını koddan ayırır.
- **Kural:** `retail_enabled=false` iken site BUGÜNKÜ teklif modeliyle bit-identik davranır. Flag açılmadan tek piksel değişmez.

---

## FIX R1 — `retail_enabled` flag (backend, küçük)
**Dosya:** `siteSettings` (ortak modül) + `publicProductJson`

- `site_settings` key: `retail_enabled` (boolean, default **`false`**) — seed'e ekle (`0XX_site_settings_seed.sql`, CREATE/INSERT; ALTER YOK).
- `publicProductJson` price strip mantığı: **`retail_enabled` true İSE** fiyat/stok/currency public'e eklenir; **false ise mevcut davranış** (price strip — fiyat gizli). Default false → bugün değişiklik yok.
- Hard-code YASAK; flag DB'den okunur (`repoGetSiteSetting('retail_enabled')`).

**Kabul:** Flag false (default) → `/api/v1/products` çıktısı bugünküyle birebir aynı (price yok). Flag true → price/availability döner.

## FIX R2 — Ürün vitrin: fiyat + "Sepete Ekle" (frontend, flag-gated)
**Dosya:** `frontend/src/app/[locale]/(public)/urunler/[slug]/page.tsx` + ürün kartı

- `retail_enabled` (server'da site-settings'ten oku) **true ise**: fiyat + "Sepete Ekle" butonu göster.
- **false ise**: mevcut teklif/WhatsApp akışı (hiç değişmez). "Sipariş Ver/Teklif" butonu HER İKİ modda da kalır (hibrit hedefi).
- Product JSON-LD: flag true ise `price`+`Offer` (schema-org.ts zaten `price>0` ile Offer ekliyor — otomatik uyumlu); false ise fiyatsız (mevcut).

**Kabul:** Flag false → ürün sayfası bugünküyle aynı (teklif). Flag true → fiyat+sepet görünür, Product schema'da geçerli Offer.

## FIX R3 — Sepet + checkout (frontend, flag-gated, iyzico)
**Dosya:** yeni sepet/checkout sayfaları + `modules/order` (iyzico, mevcut)

- Referans: bereketfide `urunler`/`bayi-odeme` akışı + vistaseeds `modules/order`.
- Route'lar `retail_enabled=false` iken **erişilemez/yönlendirir** (sepet linkleri görünmez). Açıkken aktif.
- iyzico `payment_attempts` + `132_orders_schema` mevcut — yeni şema gerekmez.

**Kabul:** Flag false → sepet/checkout route'ları gizli (link yok). Flag true → sepet → iyzico ödeme akışı çalışır.

---

## Kapsam dışı / dokunma
- Flag default **false** — PR teklif modelini canlıda DEĞİŞTİRMEZ. (Aksi = sahip kararına aykırı, RED.)
- Merchant Center / Shopping (Faz 3) — bu brief değil; retail açılırsa Claude (ekosistem) yapar.
- GA4 e-ticaret event (Faz 2) — ayrı brief; flag açılınca anlamlı.

## Doğrulama (teslim öncesi)
1. `bun run build` + `tsc --noEmit` temiz.
2. **`retail_enabled=false` (default) ile:** `/tr/urunler/[slug]` ve `/api/v1/products` çıktısı bu PR ÖNCESİYLE birebir aynı (regresyon yok). Fiyat görünmüyor, sepet linki yok.
3. `retail_enabled=true` ile (lokal test): fiyat+sepet+checkout+iyzico çalışır, Product schema geçerli Offer içerir.
4. Flag toggle public davranışı tam çeviriyor; başka hiçbir yan etki yok.

> **Sahip onayı:** Flag'i canlıda `true` yapma kararı ayrı bir spend/iş-modeli kararıdır. Bu PR sadece yeteneği KAPALI kurar.
