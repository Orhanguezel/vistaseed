# CODEX GÖREVİ — GA4 Analytics Modülünü Derinleştir (detaylı raporlar + ayarlar)

> **Sahip: Codex.** Claude GA4 temel sürümünü kurdu (canlı). Bu dosyadaki maddeleri Codex tamamlar.
> Claude paralelde **GTM + Rotasyon** modüllerini yazıyor — Codex GA4 dışındaki dosyalara dokunmaz.

## Mevcut durum (Claude kurdu, CANLI)
- Backend: `packages/shared-backend/modules/ga4/` (service/validation/admin.controller/admin.routes/index)
- Ortak OAuth: `packages/shared-backend/modules/_shared/google-oauth.ts` (`getGoogleAccessToken`, `getGoogleSetting`) — **kullan, yeni token mantığı yazma**
- Panel: `admin_panel/src/app/(main)/admin/(admin)/ga4/` + endpoints `integrations/endpoints/admin/ga4-admin-endpoints.ts` + shared `integrations/shared/ga4.ts` + locale `locale/tr/admin/ga4.json`
- Mevcut: özet (users/sessions/views/conversions), zaman serisi (recharts), kanal/cihaz/sayfa kırılımı, key event listele/ekle/sil
- Property: `ga4_property_id` ayarı (varsayılan 538246354). Data API v1beta `:runReport`, Admin API v1beta.

## YAPILACAKLAR

### A) Backend — yeni servis fonksiyonları (`service.ts`, gerekirse `realtime.service.ts` / `admin-config.service.ts`)
1. **Gerçek zamanlı**: `properties/{id}:runRealtimeReport` → şu an aktif kullanıcı (dimension `unifiedScreenName`/`country`).
2. **Edinme detayı**: `sessionSource` / `sessionSourceMedium` / `firstUserDefaultChannelGroup` kırılımları; yeni vs dönen (`newVsReturning`).
3. **Coğrafya**: `country` + `city` kırılımı (harita/tablo).
4. **Etkileşim metrikleri**: `engagementRate`, `averageSessionDuration`, `userEngagementDuration`, `bounceRate`, `engagedSessions`.
5. **Olaylar**: `eventName` bazında `eventCount` (en çok tetiklenen olaylar).
6. **Dönem karşılaştırma**: `dateRanges` ikili (mevcut + önceki) → delta %.
7. **E-ticaret (varsa)**: `purchaseRevenue`, `transactions`, `itemName` (hesapta e-ticaret yoksa boş döner, sorun değil).
8. **Admin API config**:
   - Data streams: `properties/{id}/dataStreams` → measurement ID (G-...), enhanced measurement durumu.
   - Custom dimensions: `customDimensions` listele (+ opsiyonel oluştur).
   - Audiences: `audiences` listele.
   - **GA4 → Google Ads import**: `properties/{id}/googleAdsLinks` listele → hangi Ads hesabına bağlı + dönüşüm import durumu. Bağlı değilse panelde yönlendirme notu (link UI'dan/Ads'ten kurulur).
9. **Key event detayı**: oluştururken `countingMethod` (ONCE_PER_EVENT/ONCE_PER_SESSION) + `defaultValue`/`currencyCode` (value settings) seçilebilsin.

### B) Panel — `/admin/ga4` sekmeli yap
1. **Sekmeler**: Özet · Gerçek Zamanlı · Edinme · Etkileşim · Olaylar · Dönüşümler (key events) · Ayarlar.
2. **Özet**: mevcut + dönem karşılaştırma (▲▼ delta), kanal pasta/bar, cihaz, coğrafya tablosu.
3. **Gerçek Zamanlı**: aktif kullanıcı widget'ı (otomatik ~30sn yenile).
4. **Etkileşim**: engagement rate / ort. süre / bounce kartları + trend.
5. **Olaylar**: eventName × eventCount tablosu; bir olayın yanından "anahtar olay yap" kısayolu.
6. **Dönüşümler**: mevcut key event yönetimi + countingMethod/value seçimi.
7. **Ayarlar**: data stream (measurement ID), custom dimensions, **GA4↔Ads bağlantı durumu**.

### C) Kurallar (ZORUNLU)
- i18n: `locale/tr/admin/ga4.json` + `locale/tr/admin/index.ts`. Hardcoded metin yok.
- `_shared/google-oauth.ts` kullan; yeni OAuth/token kodu yazma.
- Shared-first, dosya ≤200 satır, kebab-case, `any` yok. recharts mevcut.
- Backend yeni endpoint'leri `ga4/admin.routes.ts` + `index.ts` barrel.
- Doğrulama: `bun run build:shared`; panel `bun run locales:generate` + `tsc --noEmit` + `bun run build`; backend `bun run build`.
- Deploy: `vps-vistainsaat` manuel (packages pull + build:shared + backend `bun run build` ŞART (dist) + admin `rm -rf .next && build` + `pm2 restart`).

### D) Çakışma önleme — KRİTİK
- Claude eşzamanlı **GTM + rotasyon** yazıyor; o da paylaşımlı barrel'lara (`integrations/shared.ts`, `hooks.ts`, `sidebar-items.ts`, `permissions.ts`, `admin-ui.ts`, `locale/tr/admin/index.ts`) ekleme yapıyor.
- Codex bu dosyalara YALNIZCA kendi GA4 satırını ekler/değiştirir; mevcut satırları (özellikle GTM/rotasyon/diğer modüller) SİLME/yeniden düzenleme YOK.
- GA4 modülü dışındaki backend modüllerine (gtm, googleAds, searchConsole, _shared) dokunma.
