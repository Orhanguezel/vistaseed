# Pageview Beacon Planı — Gerçek Ziyaretçi Yakalama

> Hazırlayan: Claude Code (Mimar) · Uygulayan: Codex
> Hedef: Public sitenin gerçek sayfa görüntülemelerini `audit_request_logs`'a yazmak ki mevcut audit/analytics tabları (Genel/Cihaz/Harita/Reklam/Günlük) gerçek ziyaretçiyle dolsun.

## Neden gerekli (kanıt)
Backend yalnızca `/api/...` trafiğini logluyor. 14 günlük canlı veride `/api` dışı tek kayıt `/admin/twitter/sync-history` (1 adet). Gerçek sayfa görüntülemeleri Next.js **frontend** süreci tarafından sunuluyor ve audit'e hiç düşmüyor → gerçek-ziyaretçi filtresi sonrası 0 pageview. Detay: [[vistaseeds_audit_only_captures_api]].

## Mimari karar
**Beacon, `audit_request_logs`'a pageview satırı yazar** (yeni tablo DEĞİL). Böylece overview/geo/device/ads/retention/heatmap sorguları **hiç değişmeden** çalışır. Satır şekli: `method='GET'`, `status_code=200`, `path=<sayfa yolu>` (asla `/api/` değil), gerçek IP + UA + referer + gclid/utm, `is_bot`/`is_internal` capture'da hesaplanır, `is_admin=0`.

## Akış
1. Public frontend her route değişiminde backend'e `navigator.sendBeacon` ile fire-and-forget POST atar.
2. Backend `POST /api/v1/audit/pageview` (public, auth YOK) bunu alır, gerçek IP'yi header'dan (`cf-connecting-ip`/`x-forwarded-for`, nginx zaten geçiriyor) çıkarır, satırı yazar.
3. Beacon endpoint'inin KENDİ isteği audit'e yazılmaz (çift sayım önlenir).

---

## Codex Checklist

### A. Backend — shared-backend audit modülü (`packages/shared-backend/modules/audit/`)
> Sahiplik: shared-backend Claude'a ait; Codex bu dosyalara dokunurken Claude paralel düzenleme yapmamalı [[shared_backend_tool_ownership]]. Modül 3 projede ortak (bereketfide/hal de kazanır).

- [ ] `validation.ts`: `pageviewBeaconSchema` (zod) ekle — `path: z.string().min(1).max(512).startsWith('/')`, `url?`, `referer?`, `title?`, hepsi opsiyonel/temiz. `/api/` veya `/uploads/` ile başlayan path REDDEDİLİR (400).
- [ ] `service.ts`: `normalizeClientIp`, `normalizeUserAgent`, `normalizeReferer`, `normalizeGeo` zaten var — bunları export et veya `recordPageview()` servis fonksiyonu yaz. gclid/utm'yi `url`/query'den parse et. `is_bot = isBotUserAgent(ua)`, `is_internal = isInternalIpValue(ip, country)` (filters.ts'ten). `is_admin=0`.
- [ ] `repository.ts`: `repoInsertRequestLog` yeniden kullanılabilir; gerekirse `repoInsertPageview` ince wrapper. `req_id='beacon'`, `response_time_ms=0`, `url=<reported url ya da path>`.
- [ ] `controller.ts`: `pageviewBeacon(req, reply)` — validate → recordPageview → `reply.code(204).send()`. try/catch + `handleRouteError`. Hatada bile 204 dön (beacon sessiz olmalı, client'ı bozma).
- [ ] `router.ts`: `app.post('/audit/pageview', pageviewBeacon)` PUBLIC grupta (auth guard YOK). `registerAudit` içine.
- [ ] `service.ts shouldSkipAuditLog`: `path === '/api/v1/audit/pageview'` (ve `/audit/pageview`) ATLA — beacon isteğinin kendisi loglanmasın.
- [ ] **Rate limit / abuse:** public yazma endpoint'i. IP başına basit throttle (örn. mevcut redis varsa 60/dk) veya en azından gövde boyutu + path format katı doğrulama. Bot UA'lar yazılabilir (is_bot=1 ile) ama path/host doğrulaması zorunlu. Geçersiz path → 204 (sessiz drop), DB'ye yazma.
- [ ] `helpers/index.ts` barrel: yeni export'lar (explicit, `export *` yok).

### B. Frontend — public site (`projects/vistaseeds/frontend/`)
- [ ] `PageviewBeacon` client component (örn. `src/app/[locale]/_components/pageview-beacon.tsx`): `usePathname()` + `useEffect` ile her path değişiminde 1 kez ateşle. `navigator.sendBeacon(`${API}/audit/pageview`, Blob(JSON))` kullan; sendBeacon yoksa `fetch(..., {keepalive:true})` fallback.
- [ ] Gövde: `{ path: pathname, url: location.href, referer: document.referrer || '' }`.
- [ ] Root layout'a ekle (`src/app/[locale]/layout.tsx`) — tüm sayfaları kapsasın. localePrefix=always olduğu için path `/tr/...` gelir; bu kabul (gerçek yol). [[vistaseeds_i18n_as_needed_and_dynamic_content]]
- [ ] Prefetch/çift ateşleme önle: yalnız gerçek navigasyonda (pathname değişince) gönder; `useRef` ile aynı path'i tekrar gönderme.
- [ ] `NEXT_PUBLIC_API_URL` (zaten `/api/v1`) kullan; hardcode yok.
- [ ] Admin panel'e EKLENMEZ — yalnız public frontend.

### C. nginx / altyapı
- [ ] `/api/v1/audit/pageview` public erişilebilir mi doğrula (auth yok). `x-forwarded-for`/`x-real-ip` backend'e geçiyor (DE/TR coğrafi çözümü çalıştığı için zaten geçiyor — teyit yeterli).

### D. Doğrulama
- [ ] Public sitede birkaç sayfa gez → `SELECT path,ip,country,is_bot,is_internal,is_admin FROM audit_request_logs WHERE path NOT LIKE '/api/%' ORDER BY id DESC LIMIT 10;` → kendi gezdiğin sayfalar, gerçek IP, is_admin=0 görünmeli.
- [ ] Panelde Genel/Cihaz/Harita tabları gerçek pageview göstermeli.
- [ ] Beacon endpoint'inin kendisi `/api/...` olarak loglanmamalı (shouldSkip).
- [ ] gclid'li bir URL ile gir (`?gclid=test`) → Reklam tabında görünmeli.

### E. Deploy
- [ ] **deploy.sh [1/7] DÜZELT:** `cd "$MONOREPO_ROOT" && git pull` → `cd "$MONOREPO_ROOT/packages" && git pull origin main` olmalı (shared-backend ayrı repo). Şu an bozuk; manuel deploy gerekiyor.
- [ ] Deploy sırası: packages pull → vistaseeds pull → backend build+restart → frontend build+restart (beacon frontend'de) → admin gerekmez. Host: `vps-vistainsaat`, path `/var/www/tarim-dijital-ekosistem`, pm2: `vistaseed-backend`/`vistaseed-frontend`. [[vistaseeds_prod_deploy_quirks]]

## Notlar / Riskler
- **Public yazma endpoint** = spam riski. Rate limit + katı path doğrulaması şart. İleride imzalı token/Origin kontrolü eklenebilir.
- **KVKK/Privacy:** IP saklıyoruz (audit zaten saklıyordu). GA ile aynı seviye; gerekiyorsa IP anonimleştirme (son okteti sıfırlama) eklenebilir.
- **Çift sayım:** SSR iç fetch'leri zaten is_internal (LOCAL) → filtreleniyor. Beacon kanonik pageview. Sorun yok.
- **Bereketfide/hal kazanır:** shared-backend'e eklenince onların frontend'lerine de beacon component'i eklenirse aynı analitik gelir.
