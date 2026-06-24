# CODEX BRIEF — "Sipariş Ver" CTA + Teklif → Sipariş Yeniden Adlandırma (vistaseeds)

> **Sen (Codex) bu görevi uygulayacaksın.** Mimar (Claude) planı `TEKLIF-MODULU-PORT-CHECKLIST.md` **PART 2**'de hazırladı — tam ayrıntı orada. Bu dosya senin uygulama brifin: sıra, tam dosya yolları, tuzaklar ve kabul kriterleri.
> Tarih: 2026-06-24. Proje: `projects/vistaseeds`.

## Amaç (tek cümle)
Müşteriye görünen "Teklif" dilini **"Sipariş"** yap, `/teklif-al` URL'ini **`/siparis-ver`**'e taşı (301 ile), ve siteye **4 yerde "Sipariş Ver" CTA** ekle. Admin panelde de etiketleri "Sipariş" yap.

---

## ⛔ MUTLAK DOKUNMA (yaparsan analitik/backend kırılır)

Bunlar **teknik kimlik**, müşteriye görünmez — **değiştirme:**
- `source: "teklif-al"` (form payload, `offer-form.tsx` + `bulk-sales/submit-bulk-offer.ts` union tipi). GA4 `generate_lead` + gclid + Meta CAPI buna bağlı.
- API path'leri: `/api/v1/offers/public`, `/api/v1/admin/offers/*`.
- Backend modül klasörleri: `modules/offer`, `modules/offers`.
- DB tabloları/kolonları + `OFFER_STATUSES` **enum anahtarları** (`new`, `quoted`, `shipped`…). Sadece **label** değişir.
- RTK hook/endpoint isimleri (`useListOffersAdminQuery`, `B = "/admin/offers"` vb.).

> Kural: `offer/offers/teklif-al` string'i **kod kimliği** = sabit. `Sipariş/Sipariş Ver` = sadece UI metni.

---

## Repo dağılımı (commit'i doğru repoya at)
- Frontend + admin metin/CTA/slug değişiklikleri → **`vistaseed.git`** (`projects/vistaseeds`).
- Backend mail şablonu (sadece Görev 7 gerekirse) → **`shared-ecosystem-packages.git`** (`packages/`). **Paylaşımlı modül — dikkatli, bereketfide de kullanır.**
- **Deploy YAPMA.** Build + test et, commit/push'ı sahip/Claude yönetir.

---

## Sıralı Görevler

> Her görevi ayrı commit yap. Önce 1→2 (slug temeli), sonra 3 (metin), sonra 4 (CTA), sonra 5 (admin).

### GÖREV 1 — Slug rename `/teklif-al` → `/siparis-ver` ✅ TAMAMLANDI (Claude, 2026-06-24)
> **Bu görev BİTTİ — atla.** Claude yaptı, `bun test` yeşil (10/10). Yapılanlar:
> - `git mv .../teklif-al → .../siparis-ver` (rename temiz algılandı).
> - `routes.ts` `request_offer: "/siparis-ver"`, `sitemap.ts` `/siparis-ver`, 2 test dosyası güncel.
> - `siparis-ver/page.tsx:209` → `pathname: "/siparis-ver"` (canonical düzeltildi). **page-seo KEY'i (`"teklif-al"`, 1. arg) KASITLI korundu** — DB'deki mevcut SEO içeriğini kaybetmemek için. İstenirse sonra admin page-seo'da DB row ile koordineli rename edilir (Görev 5d ile birlikte).
> - Kalan `teklif-al` eşleşmeleri yalnız DOKUNULMAZ olanlar: `offer-form.tsx` + `submit-bulk-offer.ts` `source`, ve `urunler/[slug]/page.tsx:627` iç yorumu.
> - **Henüz commit edilmedi** (sahip/Claude commit edecek). Sen Görev 3'ten başla; bu dosyaları tekrar düzenleme.

Dosyalar (hepsi `frontend/`) — _referans:_
1. `git mv src/app/[locale]/(public)/teklif-al src/app/[locale]/(public)/siparis-ver`
2. `src/config/routes.ts:55` → `request_offer: "/teklif-al"` → `request_offer: "/siparis-ver"`
3. `src/app/sitemap.ts` → `/teklif-al` girişini `/siparis-ver` yap
4. `src/i18n/routing.test.ts` + `src/lib/seo.test.ts` → `/teklif-al` geçen assertion'ları `/siparis-ver` yap
- **Not:** `routing.ts` pathnames'e EKLEME gerekmez — `localePrefix:"always"` fallback'i çalışıyor (slug 3 dilde aynı).
- ✅ Doğrula: `grep -rn "teklif-al" src/` → **sadece** `offer-form.tsx`/`submit-bulk-offer.ts` içindeki `source: "teklif-al"` kalmalı (o DOKUNULMAZ). Başka eşleşme = eksik bıraktın.
- Commit: `refactor(offers): teklif-al rotasini siparis-ver'e tasi`

### GÖREV 2 — 301 redirect
- `/teklif-al → /siparis-ver` 301 redirect'i **redirects modülünden** kurulacak (admin `/admin/redirects` veya `proxy.ts`). **Bunu sahip/Claude canlıda yapacak** — sen sadece checklist'e not düş, kod gerekmez. (proxy.ts mantığını incelersen 3 dilli kayıt mı tek kural mı netleştir, brief'e yaz.)

### GÖREV 3 — Metin "Teklif → Sipariş" (frontend, 3 dil)
3a. `frontend/messages/{tr,en,de}.json` — şu anahtarların **değerlerini** güncelle (anahtar adı değişmez):
- `Offers.meta.title`, `Offers.meta.description`, `Offers.form.submit`, `Offers.payload.customerFallback`, `Offers.title`, `Offers.description`, `Offers.responseNote` ve içinde "teklif/quote/Angebot" geçen tüm `Offers.*` değerleri.
- `Products.detail.ctaPanel.title` ("Hemen teklif alın" → "Hemen sipariş verin"), `.subtitle` gerekiyorsa.
- TR=**Sipariş**, EN=**Order** ("Place order"), DE=**Bestellung** ("Bestellung aufgeben").

3b. `frontend/src/app/[locale]/(public)/siparis-ver/page.tsx` — `pageContent` objesi (satır ~14-203), TR/EN/DE inline metinlerde "Teklif/Request a quote/Angebot" → "Sipariş/Order/Bestellung". Hero, ürün grup kartları, süreç adımları, FAQ, footer CTA — hepsini tara.
- ✅ Doğrula: `grep -rni "teklif" frontend/messages/ frontend/src/app/.../siparis-ver/` → müşteri metninde "teklif" kalmamalı.
- Commit: `feat(offers): musteriye gorunen teklif metnini siparis yap (3 dil)`

### GÖREV 4 — "Sipariş Ver" CTA'ları (4 yer)
**Ortak kural:** link `toLocalizedPath(ROUTES.static.request_offer, locale)` ile üret (hardcode `/siparis-ver` YASAK). Etiket yeni i18n anahtarından.

4a. **i18n CTA anahtarı:** `frontend/messages/{tr,en,de}.json` → ekle:
`"Common.cta.placeOrder"`: TR "Sipariş Ver" / EN "Place Order" / DE "Bestellen".

4b. **(Önerilen) Ortak bileşen:** `frontend/src/modules/offers/order-cta-button.tsx`
- Props: `variant?`, `size?`, `className?`, `productSlug?` (opsiyonel prefill için).
- İçi: `next/link` + `useTranslations("Common.cta")` → `t("placeOrder")`, href `toLocalizedPath(ROUTES.static.request_offer, locale)` (+ `productSlug` varsa `?product=`).
- 200 satır altı, projenin Button/Link stiline uy.

4c. **Ürün detay** — `frontend/src/app/[locale]/(public)/urunler/[slug]/page.tsx` CTA paneli (satır ~840-861):
- Birincil butonu **"Sipariş Ver"** yap; hedef `/iletişim` DEĞİL → `toLocalizedPath(ROUTES.static.request_offer, currentLocale)` (istersen `?product=<slug>`).
- "Karşılaştır" butonu kalsın.

4d. **Ürün kartı** — `frontend/src/modules/product/components/ProductCard.tsx`:
- Küçük ikincil "Sipariş Ver" linki ekle (`OrderCtaButton size="sm" variant="ghost" productSlug={...}`). Kart yoğunluğunu bozma.

4e. **Header** — `frontend/src/components/Header.tsx`:
- `navItems` dizisine DEĞİL, sağ **aksiyon alanına** vurgulu "Sipariş Ver" butonu ekle (dil değiştirici / giriş butonları yanına). Mobil menüde de görünsün. Mevcut `ROUTES`+`toLocalizedPath`+`useTranslations` pattern'ini kullan.

4f. **Footer** — `frontend/src/components/Footer.tsx`:
- Mevcut `localize()` helper + link kolonu yapısına "Sipariş Ver" linki ekle (CTA bölümü ya da hızlı erişim).

4g. **Ana sayfa** — `frontend/src/components/sections/CtaSection.tsx` **zaten var** ([page.tsx:349] `CtaSection`). Yeni bölüm YARATMA → bu bileşeni "Sipariş Ver" + `/siparis-ver` hedefine güncelle (i18n etiketiyle).
- Commit: `feat(offers): Siparis Ver CTA'larini ekle (detay/kart/header/footer/home)`

### GÖREV 5 — Admin panel "Teklif → Sipariş" (TR locale)
> Sadece **görünen etiket**. Enum anahtarı/endpoint/hook DEĞİŞMEZ (bkz. DOKUNMA).

5a. `admin_panel/src/locale/tr/admin/offers.json` → tüm "Teklif/Teklifler" değerleri "Sipariş/Siparişler":
- `header.title/description`, `actions.create`, `filters.searchPlaceholder`, `table.offerNo`, `list.*`, `detail.newTitle/editTitle`, `messages.*`.
- `statuses.*`: anahtar sabit, label sipariş diline → `quoted` "Teklif Hazır" → **"Fiyat Verildi"**; diğerleri olduğu gibi uygun (Yeni/İncelemede/Gönderildi/Onaylandı/Üretimde/Sevke Hazır/Sevk Edildi/Teslim Edildi/Reddedildi/İptal).

5b. Menü etiketleri:
- `admin_panel/src/locale/tr/admin/sidebar.json` (~88) `items.offers` → "Siparişler"
- `admin_panel/src/navigation/sidebar/sidebar-items.ts` (~199) `FALLBACK_TITLES.offers` → "Siparişler"
- `admin_panel/src/locale/tr/admin/dashboard.json` (~30) `items.offers` → "Siparişler"

5c. Bileşen hardcoded metin:
- `admin_panel/src/app/(main)/admin/(admin)/offers/_components/offer-detail-client.tsx` → satır ~499 placeholder `"Teklif Talebiniz Hk."` → `"Siparişiniz Hk."`. (satır ~492 `Müşteriye E-posta Gönder` kalabilir.)

5d. (Opsiyonel) `admin_panel/src/locale/tr/admin/site-settings.json` (~500/698) `"teklif"`/`"offer"` SEO etiketi → frontend SEO sayfa adıyla uyumlu yap, page-seo anahtar uyumunu kontrol et.
- Commit: `feat(admin-offers): teklif etiketlerini siparis yap (TR)`

### GÖREV 6 — Build & test (sadece doğrulama, deploy yok)
```bash
# kök
cd /home/orhan/Documents/Projeler/tarim-dijital-ekosistem
bun run build:shared          # backend template'e dokunduysan
# frontend
cd projects/vistaseeds/frontend && bun test && bun run build
# admin
cd ../admin_panel && bun run build
```

### GÖREV 7 — Backend mail metni (SADECE gerekirse)
- `packages/shared-backend/modules/offers/template.ts` müşteriye giden TR mail metninde "teklif" varsa → "sipariş"e çevir.
- **TUZAK:** `offers` paylaşımlı; bereketfide de bu template'i kullanıyorsa metni site_settings/env'den al ya da vistaseeds'e özel override. **Toplu değiştirme**, önce kim kullanıyor kontrol et. Emin değilsen Claude'a sor, dokunma.

---

## Kabul Kriterleri (kendin doğrula, Claude/sahip deploy sonrası tekrar bakacak)
- [ ] `grep -rn "teklif-al" frontend/src` → yalnız `source:"teklif-al"` (2 dosya) kaldı.
- [ ] `grep -rni "teklif" frontend/messages` → müşteri metninde "teklif" yok.
- [ ] `bun run build` (frontend + admin) hatasız; `bun test` yeşil.
- [ ] `/siparis-ver` sayfası açılıyor, başlık/buton "Sipariş Ver".
- [ ] Header/Footer'da CTA görünür (desktop+mobil); ürün kartı + ürün detayda buton var, `/siparis-ver`'e gidiyor (detay artık `/iletişim`'e DEĞİL).
- [ ] Form payload `source` hâlâ `"teklif-al"`.
- [ ] Admin sidebar "Siparişler", liste/detay/status etiketleri sipariş dilinde.
- [ ] EN/DE'de açıkta kalan ham i18n anahtarı yok (eksik çeviri yok).

## Çıktı (Claude'a dönerken)
- Hangi commit'ler hangi repoya atıldı (hash + mesaj).
- `grep` doğrulama çıktıları (teklif-al / teklif kalmadı kanıtı).
- Build/test sonuçları.
- Görev 2 (redirect proxy.ts mantığı) ve Görev 7 (mail template paylaşımı) hakkında bulguların.
