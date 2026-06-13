# CODEX GÖREVİ — Google Bağlantısı (Rotasyon) Modülünü Tamamla

> **Sahip: Codex.** Claude rotasyon temel sürümünü kurdu (canlı). Bu dosyadaki maddeleri Codex tamamlar.
> Claude paralelde **Meta Pixel + CAPI** modülünü yazıyor — Codex Meta dosyalarına dokunmaz.

## Mevcut durum (Claude kurdu, CANLI)
- Backend: `packages/shared-backend/modules/googleConnect/` (service/validation/admin.controller/admin.routes/index)
- Panel: `admin_panel/src/app/(main)/admin/(admin)/google-connect/` + endpoints `integrations/endpoints/admin/google-connect-admin-endpoints.ts` + shared `integrations/shared/google-connect.ts` + locale `locale/tr/admin/google-connect.json`
- Mevcut akış: status (bağlı + scope + servis bayrakları) · auth-url (consent URL üretir, varsayılan redirect = OAuth Playground) · exchange (kod → refresh token → `site_settings.google_ads_refresh_token`'a `repoUpsertOne` ile yazar)
- Token, tüm Google modülleriyle (`_shared/google-oauth.ts`) paylaşılır.

## YAPILACAKLAR

### A) In-panel callback (manuel kod yapıştırmayı kaldır)
1. Panel callback sayfası: `/admin/google-connect/callback` (Next page). Google buraya `?code=...` ile döner; sayfa kodu OKUR, otomatik `exchange`e POST eder, sonucu gösterir, `/admin/google-connect`e döner.
2. `buildGoogleAuthUrl` varsayılan redirect'i bu callback URL'i yap (setting `google_oauth_redirect`, default `https://panel.vistaseeds.com.tr/admin/google-connect/callback`). **Ön koşul (panelde net göster):** bu URL OAuth client'ın "Authorized redirect URIs"ine eklenmeli (Cloud Console). Panelde "kayıtlı redirect URI: ... — Cloud Console'a ekleyin" notu + kopyala butonu.
3. CSRF: `state` parametresi üret (kısa ömürlü, session/cookie), callback'te doğrula.
4. Manuel-kod-yapıştır akışını **fallback** olarak koru (callback kaydı yapılmamışsa Playground ile çalışsın).

### B) Token sağlığı + servis testi
1. `status`'a: token gerçekten çalışıyor mu — her servise hafif bir ping (Ads listAccessibleCustomers, GA4 property get, GTM accounts, GSC sites) → servis bazında "çalışıyor/hata" + hata mesajı.
2. Son yenilenme/expiry bilgisi (access token `expires_in`; refresh token'ın ne zaman alındığını ayrı bir ayara yaz: `google_oauth_connected_at`).
3. Panelde her servis için yeşil/kırmızı + son kontrol zamanı.

### C) Bağlantıyı kes + client secret rotasyonu
1. **Disconnect**: `POST google-connect/disconnect` → `site_settings.google_ads_refresh_token`'ı temizle (+ Google revoke endpoint'i `https://oauth2.googleapis.com/revoke?token=...` çağır). Panelde "Bağlantıyı Kes" (onaylı).
2. **Client secret/developer token güncelleme**: panelden `google_ads_client_secret` / `google_ads_developer_token` güncelleme alanı (admin site-settings API tab zaten var; buraya kısayol + "secret reset sonrası yeniden bağlan" akışı). Bkz güvenlik notu (geçmiş ifşa rotasyonu).

### D) Kurallar (ZORUNLU)
- i18n: `locale/tr/admin/google-connect.json` + `locale/tr/admin/index.ts`. Hardcoded yok.
- Shared-first, dosya ≤200 satır, kebab-case, `any` yok.
- Backend yeni endpoint'leri `googleConnect/admin.routes.ts` + `index.ts`.
- Token yazımı yalnız `repoUpsertOne('...','*',value)`; düz SQL yok.
- Doğrulama: `bun run build:shared`; panel `locales:generate` + `tsc --noEmit` + `bun run build`; backend `bun run build`.
- Deploy: `vps-vistainsaat` manuel (packages pull + build:shared + backend `bun run build` ŞART + admin `rm -rf .next && build` + `pm2 restart`).

### E) Çakışma önleme — KRİTİK
- Claude eşzamanlı **Meta Pixel + CAPI** yazıyor (modules/meta + /admin/meta + meta locale + frontend pixel). Paylaşımlı barrel'lara (`integrations/shared.ts`, `hooks.ts`, `sidebar-items.ts`, `permissions.ts`, `admin-ui.ts`, `locale/tr/admin/index.ts`) ikimiz de ekleme yapıyoruz: **yalnız KENDİ satırını ekle/değiştir; diğer modülün (meta/ga4/gtm/gsc) satırlarına dokunma.**
- Codex yalnız `googleConnect` + `/admin/google-connect` + google-connect locale'ine dokunur.
