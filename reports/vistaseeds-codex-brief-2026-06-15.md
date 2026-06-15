# Codex Brief — VistaSeeds OAuth Seli & Teknik Borç

**Görev sahibi:** Codex · **Tasarım:** Claude · **Tarih:** 15 Haziran 2026
**Tam checklist:** `projects/vistaseeds/reports/vistaseeds-aksiyon-plani-2026-06-15.md` ← her maddenin kök neden/dosya/kabul kriteri burada.

---

## Bağlam (1 paragraf)

15 Haziran ziyaretçi raporu (1-15 Haziran dönemi) iki kritik sorun ortaya çıkardı. **(1)** 13 Haziran 03:00'te `/api/v1/admin/google-connect/exchange` uç noktasına tek saatte ~522.000 istek / 507.828 HTTP 500 geldi — bir OAuth tekrar-deneme seli. **(2)** Site Cloudflare arkasına alınmış; backend bunu hesaba katmıyor. Kök neden incelemesi selin **üç kusurun birleşimi** olduğunu gösterdi; üçü de düzeltilecek. Asıl açık: backend nginx arkasında `req.ip`'i 127.0.0.1 görüyor ve rate-limit allowList'i tam da onu muaf tuttuğu için **rate-limit gerçek trafikte tamamen devre dışı.**

## Ne yapacaksın (sıra önemli)

1. **P0-2** (en kritik) — `projects/vistaseeds/backend/src/app.ts:66-77` + Fastify init. `trustProxy: true`, rate-limit `keyGenerator` = `CF-Connecting-IP` ?? `req.ip`, allowList'ten 127.0.0.1 blanket muafiyetini kaldır (iç build fetch'leri header sinyaliyle muaf tut).
2. **P0-1** — `packages/shared-backend/modules/_shared/http.ts:82` + `modules/googleConnect/service.ts`. OAuth istemci hataları (invalid_grant, state mismatch) **4xx** dönsün, 500 değil. Tercihen tipli hata (`GoogleConnectError { httpStatus }`).
3. **P0-3** — `modules/googleConnect/admin.routes.ts`. `exchange`/`disconnect`/`credentials` route'larına per-route `{ rateLimit: { max: 5, timeWindow: '5 minutes' } }`.
4. **P0-4** — `admin_panel/.../google-connect/callback/google-connect-callback.tsx`. `code` başına `sessionStorage` guard'ı; 5xx/hatada otomatik retry yok, manuel "Yeniden bağlan" butonu (locale key). `base-api.ts` retry sarmalının exchange'i tekrar tetiklemediğini doğrula.
5. **P1-1 / P1-2** — beacon veri akışı doğrula; gclid+UTM birlikte korunsun. (Detay checklist'te.)

## Sınırlar

- **OPS maddeleri (nginx real_ip, Cloudflare WAF probe bloklama, Google Ads UTM şablonu) SANA AİT DEĞİL** — repo dışı, VPS/Cloudflare/Ads panelinde. Onlara dokunma.
- **ALTER TABLE yasak** (lokal). Schema değişikliği gerekirse seed SQL'e ekle.
- **`bun install` SADECE monorepo root'tan.** Proje altında node_modules açma.
- `shared-backend` (`packages/`) değişikliğin backend'e yansıması için: `cd projects/vistaseeds/backend && bun run build` ŞART (prod dist'ten çalışır; sadece `build:shared` yetmez).
- Dosya 200 satırı geçmesin; hardcode yok; mevcut modül pattern'ine uy (router/controller/service/repository ayrımı).

## Doğrulama (bitirmeden önce)

- Backend: `cd projects/vistaseeds/backend && bun run build` temiz.
- Admin panel: `bun x tsc --noEmit && bun run build` temiz (locale değiştiysen önce `bun run locales:generate`).
- **Reprodüksiyon testleri R1-R4** (action plan'da, "Reprodüksiyon & Doğrulama" bölümü): R1 fix sonrası 429 üretmeli, R2 build'i kırmamalı, R3'te 500 yok + 400/429 var, R4'te tek exchange isteği. Dördü geçmeden P0 kapanmış sayılmaz.

## Çakışma önleme

- `packages/shared-backend/` Claude'un sahipliğinde — bu görevde `_shared/http.ts` ve `modules/googleConnect/*` üzerinde çalışacaksın; başka shared modüle dokunma. Eşzamanlı düzenleme yapma.
- İş bittiğinde değişen dosya listesini ve hangi reprodüksiyon testinin geçtiğini raporla.

---

**Tek satırlık başlatma:** "`vistaseeds-aksiyon-plani-2026-06-15.md` içindeki P0-1→P0-4'ü sırayla uygula, R1-R4 reprodüksiyon testlerini geçir, sonra P1'e geç."
