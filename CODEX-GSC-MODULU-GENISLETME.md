# CODEX GÖREVİ — Search Console Modülünü Genişlet (indexleme + analiz + grafikler)

> **Sahip: Codex.** Claude GSC'nin temel sürümünü kurdu (canlı). Bu dosyadaki maddeleri Codex tamamlar.
> Claude paralelde GA4 / Meta CAPI / GTM / rotasyon modüllerini yazıyor — **GSC dosyalarına Claude dokunmayacak.**

## Mevcut durum (Claude kurdu, CANLI)
- Backend: `packages/shared-backend/modules/searchConsole/` (service/validation/admin.controller/admin.routes/index)
- Ortak OAuth: `packages/shared-backend/modules/_shared/google-oauth.ts` (`getGoogleAccessToken`, `getGoogleSetting`) — **bunu kullan, yeni token mantığı yazma**
- Panel: `admin_panel/src/app/(main)/admin/(admin)/search-console/` + endpoints `integrations/endpoints/admin/search-console-admin-endpoints.ts` + shared `integrations/shared/search-console.ts` + locale `locale/tr/admin/search-console.json`
- Mevcut: siteler, özet (totals/sorgu/sayfa), sitemap listesi, tek URL inceleme
- Varsayılan site: `gsc_site_url` ayarı (yoksa `sc-domain:vistaseeds.com.tr`)

## YAPILACAKLAR

### A) Backend — yeni servis fonksiyonları (`service.ts`, gerekirse `indexing.service.ts`)
1. **Zaman serisi** (grafik için): `searchAnalytics` `dimensions:['date']` → günlük clicks/impressions/ctr/position dizisi.
2. **Cihaz kırılımı**: `dimensions:['device']` (MOBILE/DESKTOP/TABLET).
3. **Ülke kırılımı**: `dimensions:['country']`.
4. **Arama türü**: body `type` (web/image/video/news) parametresi — query'den al.
5. **Sayfa → sorgu drill-down**: bir `page` için `dimensionFilterGroups` ile filtreleyip `dimensions:['query']`.
6. **Dönem karşılaştırma**: mevcut dönem vs önceki eş-uzunluk dönem; delta (%).
7. **Sitemap gönder/sil**: `PUT /sites/{site}/sitemaps/{feedpath}` (gönder), `DELETE` (sil). Panelde form.
8. **TOPLU İNDEXLEME ANALİZİ (en önemli)**:
   - URL listesini topla: sitemap.xml'i fetch+parse ET **veya** DB içeriklerinden üret (products/custom_pages/blog slug'ları → tam URL).
   - Her URL için **URL Inspection API** (`POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`) çağır → `indexStatusResult.coverageState` + `verdict` + `lastCrawlTime`.
   - **Kota**: ~2000 sorgu/gün. Batch + DB cache ZORUNLU (yeni tablo: `gsc_url_index` { url, verdict, coverage_state, last_crawl, checked_at } — seed SQL ile, ALTER yasak). Günde bir kez/elle tetikle.
   - Kategorize et: **indexli** (PASS) / **indexsiz** (Crawled-currently-not-indexed, Discovered-not-indexed, Duplicate, Excluded-by-noindex, Soft-404, Redirect...) → her durum için TR etiket + **düzeltme önerisi**.
9. (Opsiyonel, ToS dikkat) **Indexing API** ile "request indexing" — resmi olarak yalnız JobPosting/BroadcastEvent destekli; genel URL için riskli. Tercihen panelde "GSC'de manuel iste" yönlendirmesi.

### B) Panel — `/admin/search-console` sekmeli yap
1. **Özet sekmesi**: mevcut kartlar + **zaman serisi grafik** (mevcut chart lib — `recharts` panelde var mı kontrol et; yoksa basit SVG/area). Cihaz + ülke kırılımı kartları. Arama türü + dönem karşılaştırma seçicisi (▲▼ delta).
2. **İndexleme sekmesi (yeni, kritik)**: tüm içerikler tablosu — URL | durum (TR etiket, renkli) | son tarama | **düzeltme önerisi**. Filtre: indexli / indexsiz / sorunlu. "Yeniden tara" butonu (toplu inspection tetikler). Özet: X indexli, Y indexsiz, Z sorunlu + dağılım grafiği.
3. **Sorgular/Sayfalar sekmesi**: mevcut + sayfa tıkla → drill-down sorgular.
4. **Sitemap sekmesi**: liste + gönder/sil formu.
5. Her indexleme durumu için "ne yapmalı" rehber metni (noindex kaldır / canonical düzelt / iç link ekle / içeriği güçlendir / 404 düzelt).

### C) Kurallar (ZORUNLU)
- i18n: tüm metinler `locale/tr/admin/search-console.json` + `locale/tr/admin/index.ts`'e ekli.
- Shared-first, dosya ≤200 satır, kebab-case, `any` yok.
- `_shared/google-oauth.ts` kullan; yeni OAuth/token kodu yazma.
- Backend yeni endpoint'leri `searchConsole/admin.routes.ts` + `index.ts` barrel + (gerekirse) `package.json` exports.
- DB tablosu gerekiyorsa **seed SQL** (`backend/src/db/seed/sql/`) — `ALTER` lokal YASAK; canlı için idempotent apply SQL (örnek: `188_offers_gclid_apply.sql`).
- Bitince: `bun run build:shared`, panel `bun run locales:generate` + `tsc --noEmit` + `bun run build` temiz olmalı.
- Deploy: `vps-vistainsaat`, manuel (deploy.sh [1/7] kırık) — packages pull + build:shared + backend `bun run build` (dist'ten çalışır, ŞART) + admin `rm -rf .next && build` + `pm2 restart`.

### D) Çakışma önleme
- Claude'un dokunduğu paylaşımlı dosyalar: `_shared/google-oauth.ts`, panel `integrations/shared.ts` + `hooks.ts` barrel'ları, `sidebar-items.ts`, `permissions.ts`. Bunlara EKLEME yaparken (silme/yeniden düzenleme YOK) dikkat; Claude GA4/Meta/GTM için de aynı barrel'lara ekliyor → sadece kendi satırını ekle, mevcut satırları değiştirme.
