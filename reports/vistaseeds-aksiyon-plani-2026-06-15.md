# VistaSeeds — Aksiyon Planı (Codex Checklist)

**Kaynak:** `reports/vistaseeds-ziyaretci-raporu-2026-06-15.pdf` (1-15 Haziran 2026 dönem raporu)
**Hazırlayan:** Claude (mimari/strateji) · **Uygulayan:** Codex
**Tarih:** 15 Haziran 2026

> Bu checklist Codex içindir. Her madde: **kök neden → değişecek dosya → yapılacak → kabul kriteri**.
> ALTER TABLE yasak; schema değişikliği gerekirse seed SQL'e ekle. Dosya 200 satırı geçmesin. Hardcode yasak.
> Doğrulama: backend `cd projects/vistaseeds/backend && bun run build`; admin panel `bun x tsc --noEmit && bun run build`.

---

## P0 — 13 Haziran OAuth seli (kök neden, tekrarını önle)

Olay: `/api/v1/admin/google-connect/exchange` uç noktasına tek saatte ~522.000 istek / 507.828 HTTP 500.
Üç ayrı kusur birleşti; **üçü de düzeltilmeli** (defense-in-depth).

### [x] P0-1 — `exchange` hataları 5xx yerine 4xx dönsün (retry'ı kır)
- **Kök neden:** `packages/shared-backend/modules/_shared/http.ts:82` — `handleRouteError` Zod ve `"unauthorized"` dışındaki her hatayı `sendServerError` → **HTTP 500** yapıyor. `packages/shared-backend/modules/googleConnect/service.ts:83,104` `exchangeGoogleCode` `invalid_grant` / `google_oauth_state_mismatch` / `no_refresh_token` için düz `throw new Error(...)` atıyor → 500. 500 retry edilebilir bir koddur; istemci tekrar tekrar dener.
- **Yapılacak:**
  1. `_shared/http.ts` içine `sendClientError(reply, code, message)` (varsa `sendBadRequest`/`sendConflict`) helper'ı + `handleRouteError`'a **bilinen istemci-hataları → 4xx** eşlemesi ekle. Örn. mesajı `google_oauth_state_mismatch` veya `google_oauth: invalid_grant` ile başlayan hatalar → **400** (geçersiz/expired code, kullanıcı yeniden bağlanmalı), `google_oauth_client_missing` → **409** (sunucu config eksik).
  2. Tercihen `service.ts`'de tipli hata fırlat (ör. `class GoogleConnectError extends Error { httpStatus }`) ve `handleRouteError` bunu okusun — string matching kırılgan, tipli çözüm yeğ.
- **Kabul kriteri:** Geçersiz/expired `code` ile `POST /admin/google-connect/exchange` çağrısı **400** döner (500 değil). State mismatch → 400. Sunucu OAuth client config eksikse → 409. Hiçbir normal kullanıcı hatası 5xx üretmez.

### [x] P0-2 — Rate-limit kör noktasını kapat (en kritik)
- **Kök neden:** `projects/vistaseeds/backend/src/app.ts:66-77`. Backend nginx arkasında localhost'ta; `trustProxy` ayarlı değil → Fastify `req.ip` **tüm istekler için 127.0.0.1** (nginx proxy IP'si). `allowList` ise 127.0.0.1'i muaf tutuyor → **gerçek trafiğin tamamı rate-limit dışı**. 522k istek bu yüzden hiç sınırlanmadan geçti.
- **Yapılacak:**
  1. Fastify'ı `trustProxy: true` ile başlat (`Fastify({ trustProxy: true, ... })` — `app.ts` veya `index.ts` neredeyse). Böylece `req.ip` X-Forwarded-For'dan gerçek istemciyi türetir.
  2. Rate-limit `keyGenerator`'ı **`CF-Connecting-IP` header'ı varsa onu**, yoksa `req.ip`'i kullansın (site Cloudflare arkasında; gerçek ziyaretçi IP'si bu header'da gelir).
  3. `allowList`'ten `127.0.0.1` blanket muafiyetini **kaldır**. Build-time iç fetch'leri IP yerine güvenli bir sinyalle muaf tut: ör. yalnız `uploadsPrefix` + iç çağrılarda gönderilen bir header (`x-internal-build: <token>`). IP tabanlı muafiyet bırakma.
- **Kabul kriteri:** nginx üzerinden gelen istekte `req.ip` artık 127.0.0.1 değil, Cloudflare/gerçek IP. Aynı kaynaktan 1 dakikada 100'den fazla istek 429 alır. Build-time localhost fetch'leri hâlâ çalışır (rate-limit yemez).

### [x] P0-3 — `exchange` için sıkı per-route rate-limit
- **Kök neden:** Global limit (100/dk) OAuth exchange gibi nadir çağrılan, pahalı bir uç için fazla gevşek.
- **Değişecek dosya:** `packages/shared-backend/modules/googleConnect/admin.routes.ts` (`exchange` route'una `config.rateLimit`), gerekiyorsa `@fastify/rate-limit` per-route opsiyonu.
- **Yapılacak:** `POST /google-connect/exchange` (ve `disconnect`, `credentials`) route'larına `{ config: { rateLimit: { max: 5, timeWindow: '5 minutes' } } }` ekle. Aynı kaynaktan kısa sürede tekrarlanan exchange denemelerini erken 429'la.
- **Kabul kriteri:** Aynı IP/anahtar 5 dakikada 5'ten fazla exchange çağrısı yaparsa 429 alır. Normal tek-seferlik OAuth akışı etkilenmez.

### [x] P0-4 — Frontend callback: exchange tam olarak 1 kez, 5xx'te retry yok
- **Kök neden:** `projects/vistaseeds/admin_panel/src/app/(main)/admin/(admin)/google-connect/callback/google-connect-callback.tsx`. `startedRef` yalnız tek mount içinde korur; component remount olursa (router/StrictMode/yeniden render fırtınası) yeniden tetiklenir. ~145 istek/sn bunu işaret ediyor. Ayrıca `base-api.ts:89-130` "401 → refresh → retry" sarmalı var; exchange akışında istenmeyen tekrar tetiklemeye karşı kontrol edilmeli.
- **Yapılacak:**
  1. "Bu `code` için exchange denendi" bilgisini **`sessionStorage`**'a yaz (key: `gc_exchange_<code>`), `startedRef` yanına. Mount/remount fark etmeksizin aynı `code` ikinci kez exchange'e gitmesin.
  2. Hata durumunda (success/error) otomatik yeniden denemeyi engelle; kullanıcıya "Yeniden bağlan" butonu göster (manuel, locale key ile).
  3. `base-api.ts` retry sarmalının `google-connect/exchange` çağrısını 5xx/401'de **otomatik retry etmediğini** doğrula; gerekiyorsa bu endpoint'i retry'dan istisna tut.
- **Kabul kriteri:** OAuth callback sayfası kaç kez remount olursa olsun aynı `code` ile backend'e en fazla 1 exchange isteği gider. Hata olduğunda otomatik tekrar isteği YOK; yalnız manuel buton.

---

## Reprodüksiyon & Doğrulama (P0)

> Lokal backend'i çalıştır: `cd projects/vistaseeds/backend && bun run dev` (port `.env`'deki `PORT`, örnek default **8083**).
> Lokalde nginx yok; istekler doğrudan 127.0.0.1'den gelir. P0-2'nin kanıtı tam da budur: mevcut kodda 127.0.0.1 allowList'te olduğu için limit hiç tetiklenmez.

### R1 — P0-2: rate-limit kör noktası (fix ÖNCESİ açığı kanıtla, SONRASI kapandığını göster)
```bash
API="http://127.0.0.1:${PORT:-8083}"
# Cloudflare arkasındaki bir ziyaretçiyi taklit et (header'larla)
for i in $(seq 1 150); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -H "CF-Connecting-IP: 203.0.113.77" \
    -H "X-Forwarded-For: 203.0.113.77" \
    "$API/api/v1/site_settings/site_logo?locale=tr"
done | sort | uniq -c
```
- **FIX ÖNCESİ (mevcut bug):** 429 sayısı = **0**. Limit ölü (req.ip=127.0.0.1 → allowList muaf). ← açığın kanıtı.
- **FIX SONRASI (P0-2):** İlk ~100 istek 200/304/404, **sonraki ~50 istek 429** döner (anahtar = CF-Connecting-IP `203.0.113.77`).

### R2 — Build-time muafiyeti hâlâ çalışıyor mu (regresyon koruması)
```bash
# İç build fetch'i: CF-Connecting-IP YOK, sadece localhost.
for i in $(seq 1 150); do
  curl -s -o /dev/null -w "%{http_code}\n" "$API/api/v1/site_settings/site_logo?locale=tr"
done | sort | uniq -c
```
- **Beklenen (P0-2 sonrası):** Localhost iç fetch'leri rate-limit YEMEZ (429 = 0) — build kırılmamalı. (Muafiyet IP yerine iç-build sinyaliyle yapılmalı; bkz. P0-2 madde 3.)

### R3 — P0-1 + P0-3: exchange 4xx + per-route limit
```bash
TOKEN="<gecerli-admin-jwt>"   # /admin route'ları requireAuth+requireAdmin arkasında
for i in $(seq 1 10); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST "$API/api/v1/admin/google-connect/exchange" \
    -H "Content-Type: application/json" -H "Cookie: access_token=$TOKEN" \
    -H "CF-Connecting-IP: 203.0.113.88" \
    -d '{"code":"expired-or-invalid-code","redirect_uri":"https://www.vistaseeds.com.tr/admin/google-connect/callback"}'
done | sort | uniq -c
```
- **FIX SONRASI:** İlk ~5 istek **400** (invalid_grant → istemci hatası), kalanlar **429** (per-route limit 5/5dk). **HİÇBİRİ 500 değil.**
- Admin token yoksa: P0-1'i birim testle doğrula — `handleRouteError`'a `google_oauth: invalid_grant` mesajlı bir `Error` verildiğinde reply `code(400)`; `google_oauth_state_mismatch` → 400; `google_oauth_client_missing` → 409.

### R4 — P0-4: callback tek-sefer (frontend)
- Admin panelde Google bağla akışını başlat, callback sayfası açıkken **sayfayı 5 kez yenile / geri-ileri yap**. Backend access log'da (veya devtools Network) aynı `code` için **en fazla 1 adet** `exchange` POST görülmeli. Hatada otomatik tekrar isteği OLMAMALI.

**Bütünleşik kabul:** R1 fix sonrası 429 üretiyor, R2 build'i kırmıyor, R3'te 500 yok + 400/429 var, R4'te tek istek. Dördü de geçerse P0 kapandı.

---

## P1 — Tekrar eden / bekleyen teknik borç (kod tarafı)

### [x] P1-1 — Pageview beacon gerçekten veri basıyor mu? (ziyaretçi ölçümü)
- **Bağlam:** Rapor artık nginx IP'sine güvenemiyor (Cloudflare). Kalıcı çözüm beacon/GA4. Beacon eklendi: `projects/vistaseeds/frontend/src/components/PageviewBeacon.tsx`.
- **Yapılacak:** Beacon'un (a) layout'ta mount edildiğini, (b) hedef endpoint'e (audit/analytics) POST attığını, (c) backend tarafında bir tabloya düştüğünü doğrula. `is_bot` / `is_internal` ayrımı var mı kontrol et (memory: `vistaseeds_audit_only_captures_api`). Eksikse bağla.
- **Kabul kriteri:** Gerçek bir sayfa ziyareti beacon kaydı oluşturuyor; bot/internal işaretleniyor; admin panelde sayılabiliyor. Bir sonraki ziyaretçi raporu log yerine bu kaynaktan üretilebilir.
- **Codex notu (2026-06-15):** Beacon lokal doğrulamada `audit_request_logs` satırı oluşturdu ve analytics overview içinde pageview/top landing olarak sayıldı. Eski DB'lerde attribution kolonları yoksa temel pageview kaydı düşmeye devam eder; `193_audit_quality_columns_apply.sql` gclid/UTM kolonlarını idempotent ekler.

### [x] P1-2 — Google Ads `utm_campaign` etiketi (raporlama netliği)
- **Bağlam:** Loglarda `utm_campaign` hiç yok; yalnız gclid otomatik etiketleme. Kampanya ayrımı zor.
- **Not:** Bu **Google Ads paneli** işidir (kod değil). Codex repo'da çözemez. Orhan/Claude: Ads URL şablonuna `utm_campaign={campaignid}&utm_source=google&utm_medium=cpc` ekleyecek. Codex yalnız frontend'in bu UTM'leri kırmadan koruduğunu (gclid + utm aynı anda) doğrulasın.
- **Codex notu (2026-06-15):** Frontend beacon `window.location.href` gönderiyor; backend aynı URL'den `gclid` ve `utm_*` alanlarını birlikte parse ediyor; admin analytics Ads attribution sorguları kolonlar mevcutsa campaign/source/medium bazında raporluyor.

---

## OPS — Repo dışı (Codex değil; Orhan/Claude VPS+Cloudflare)

> Bu maddeler nginx/Cloudflare/Google Ads tarafındadır; repo kodunda değildir. Codex'e atanmaz, ayrı yapılır.

- [ ] **OPS-1 — nginx `real_ip` geri-çözümü.** `set_real_ip_from <Cloudflare IP blokları>` + `real_ip_header CF-Connecting-IP` ekle. Sonuç: nginx logu tekrar gerçek ziyaretçi IP'si yazar (P0-2 ile birlikte rate-limit de tam isabetli olur).
- [ ] **OPS-2 — Probe bloklama.** Cloudflare WAF veya nginx `return 444`: `/.env*`, `/.git`, `/*.php` (test/info/phpinfo/xmlrpc), `/wp-*`. Top 4xx'in çoğu bu probe'lar.
- [ ] **OPS-3 — Google Ads UTM şablonu** (P1-2 ops yarısı).

---

## Öncelik özeti

| # | Görev | Sahip | Etki |
|---|-------|-------|------|
| P0-1 | exchange 4xx | Codex | Retry zincirini kırar |
| P0-2 | trustProxy + rate-limit kör nokta | Codex | **Selin kök nedeni** |
| P0-3 | exchange per-route limit | Codex | Tekrarı erken keser |
| P0-4 | frontend tek-sefer exchange | Codex | İstemci kaynağını kapatır |
| P1-1 | beacon doğrulama | Codex | Gerçek ziyaretçi ölçümü |
| P1-2 | UTM koruma | Codex | Raporlama netliği |
| OPS-1/2/3 | nginx/CF/Ads | Orhan/Claude | IP + güvenlik + UTM |

**Test senaryosu (P0 bütünü):** Geçersiz `code` ile exchange'i 200 kez ardışık çağır → ilk birkaçı 400, sonrası 429; backend log'da 500 YOK; CPU/log patlaması YOK.
