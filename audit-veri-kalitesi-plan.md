# Audit / Analytics Veri Kalitesi İyileştirme Planı

> Hazırlayan: Claude Code (Mimar) · Uygulayan: Codex
> Hedef: `/admin/audit` ekranındaki tüm tab'lerde **gerçek ziyaretçi** verisini göstermek.
> Şu an veri kirli: kendi (admin) gezintilerimiz, local/dev istekleri ve botlar sayıma dahil.

---

## 1. Durum Tespiti (tab tab)

Ekran iki ayrı backend katmanından besleniyor. "Gerçek ziyaretçi" tanımı tab'ler arasında **tutarsız**.

| Tab | Kaynak modül | Endpoint | Bot filtre | Local/internal filtre | Admin/self filtre | Sorun |
|-----|--------------|----------|:---:|:---:|:---:|------|
| **Genel** | `analytics` | `/analytics/overview`, `/analytics/retention` | ✅ (`BOT_UA_SQL`) | ❌ | ❌ | Human sayısı kendi+ofis+dev trafiğini içeriyor |
| **İstekler** | `audit` | `/audit/request-logs` | ❌ | ⚠️ sadece `127.0.0.1` | ❌ (sadece "yalnız admin" göster) | Ham log; debug aracı, kabul edilebilir ama default temiz değil |
| **Kimlik Doğrulama** | `audit` | `/audit/auth-events` | — | ❌ (default) | — | **Local girişler** (dev login) listede |
| **Günlük** | `audit` | `/audit/metrics/daily` | ❌ | ❌ (default kapalı) | ❌ | Grafik ham; 13.06'daki 514.794 spike buradan geliyor |
| **Reklam** | `analytics` | `/analytics/ads-attribution`, `/ads-daily`, `/funnel` | ✅ pageview | ❌ | ❌ | gclid trafiği görece temiz; funnel intentPaths boş |
| **Cihaz** | `analytics` | `/analytics/device-daily`, `/heatmap` | ✅ | ❌ | ❌ | Cihaz kırılımı kendi trafiğimizi içeriyor |
| **Harita** | `audit` | `/audit/geo-stats`, `/audit/geo-cities` | kısmi (cities `traffic`) | ⚠️ FE'de `LOCAL` ülkesi atılıyor | ❌ | geo-stats'a `exclude_localhost` hiç gönderilmiyor; admin trafiği haritada |

### Kanıtlanan kök nedenler (kod)

1. **Capture (yazım) aşaması — `modules/audit/service.ts` `shouldSkipAuditLog`**
   Sadece `OPTIONS`, `/health`, `/uploads/`, `/audit/stream` ve env `AUDIT_EXCLUDE_IPS` atlanıyor. `AUDIT_EXCLUDE_IPS` **boş** (env.ts'te tanımlı bile değil). Yani admin panel API çağrıları, kendi authenticated gezintimiz, SSR iç fetch'leri, botlar — hepsi yazılıyor.

2. **Localhost filtresi tutarsız — `repository.ts` `excludeLocalhostCond`**
   Sadece `127.0.0.1`, `::1`, `::ffff:127.0.0.1` hariç tutuyor. Ama `service.ts` `normalizeGeo` private LAN'i (`192.168.*`, `10.*`) `country='LOCAL'` olarak etiketliyor → bu IP'ler `excludeLocalhostCond` ile **atılmıyor**.

3. **`exclude_localhost` opt-in ve default kapalı**
   `metrics`, `geo-stats`, analytics overview hiçbiri default'ta temiz değil. FE de bu bayrağı çoğu yerde göndermiyor.

4. **Admin/self hiçbir yerde dışlanmıyor**
   `is_admin=1` yazılıyor ama hiçbir analiz sorgusu default'ta dışlamıyor. "İstekler" tab'indeki `only_admin` tersine çalışıyor (sadece admini göster).

5. **İki ayrı "bot/pageview" tanımı**
   `analytics` modülünde `BOT_UA_SQL` + `path NOT LIKE '/api/%'` var; `audit` modülünde yok. Tek kaynak yok.

6. **vistaseeds analytics opsiyonsuz register ediliyor** — `routes/shared.ts:69` `registerAnalyticsAdmin` (parametresiz) → `intentPaths=[]`, funnel/b2b intent ölçülemiyor.

---

## 2. Çözüm Mimarisi — Tek Kanonik "Gerçek Ziyaretçi" Filtresi

İlke: "gerçek ziyaretçi" = **insan** (bot UA değil) + **harici IP** (localhost/LAN/ofis-admin IP değil) + **kamuya açık sayfa** (`/api/`, `/uploads/` değil) + **site sahibi/admin değil**.

Bu tanım **tek bir yerde** SQL helper olarak tanımlanmalı ve tüm tab'ler kullanmalı. İki katman:

- **A. Capture filtresi** (ucuz, yazımda at): bariz çöpü düşür → `shouldSkipAuditLog` + env IP listesi.
- **B. Query filtresi** (toggle'lı, "gerçek" görünüm için **default AÇIK**): bot + internal + admin/self + pageview kapsamı.

> **Ham log korunur.** "İstekler" tab'i debug aracıdır; satırları silmiyoruz. Sadece analiz/özet görünümleri default'ta temizliyoruz ve "ham göster / içeride olanı dahil et" toggle'ı ekliyoruz. Geçmiş kirli satırlar filtreyle zaten görünmez olur (silmeye gerek yok).

### Yeni merkezi env config (`packages/shared-backend/core/env.ts`)
- `AUDIT_EXCLUDE_IPS: string[]` — capture'da tamamen düşürülecek IP'ler (ofis/ev sabit IP). **Tanımla** (zaten service.ts okuyor ama env.ts'te yok).
- `ANALYTICS_INTERNAL_IP_PREFIXES: string[]` — query'de internal sayılacak prefiksler. Default: `['127.', '::1', '::ffff:127.', '10.', '192.168.', '172.16.','172.17.'...'172.31.']`.
- `ANALYTICS_OWNER_USER_IDS: string[]` — her zaman dışlanacak sahip/admin user id'leri.

### Kanonik SQL helper (`modules/audit/` içinde yeni `filters.ts`)
- `botUaSql()` → `analytics/sql.ts` `BOT_UA_SQL`'i tek kaynağa taşı / re-export et (kopya yok).
- `internalIpCond(table)` → prefix listesine göre `ip NOT LIKE` zinciri + `country <> 'LOCAL'`.
- `selfTrafficCond(table)` → `is_admin = 0 AND (user_id IS NULL OR user_id NOT IN (owner ids))`.
- `realVisitorConds(table, { includeInternal?, includeBots?, includeAdmin?, pageviewOnly? })` → yukarıdakileri birleştiren tek fonksiyon.

`analytics` modülü de bu helper'ı kullanmalı (şu an `humanPageviewWhere()` sadece bot+path; internal+self eklenecek).

---

## 3. Faz Planı

- ✅ **Faz 1 (öncelik, şema değişikliği YOK):** Query-time kanonik filtre. Tüm tab'ler default "gerçek ziyaretçi". FE'ye "İç trafiği dahil et" toggle. Env config. → Anında doğru veri.
- ✅ **Faz 2 (opsiyonel, performans):** `audit_request_logs`'a `is_bot TINYINT`, `is_internal TINYINT` kolonları + index + capture'da hesapla + tek seferlik backfill. Büyük tabloda regexp maliyetini kaldırır. (CLAUDE.md kuralı: local'de seed CREATE TABLE düzenle + `db:seed:*:fresh`; prod'da idempotent `ADD COLUMN IF NOT EXISTS` apply + backfill.)
- 🟡 **Faz 3 (operasyon):** 13.06 spike'ını araştır (top IP/path) ve gerekirse o aralığı purge et. Araştırıldı; purge SQL'i hazır, DELETE uygulanmadı.

---

## 4. Codex Checklist

### A. Backend — env & config
- [x] `core/env.ts`: `AUDIT_EXCLUDE_IPS`, `ANALYTICS_INTERNAL_IP_PREFIXES`, `ANALYTICS_OWNER_USER_IDS` ekle (CSV parse, default'larla). `.env.example` güncelle.
- [x] `routes/shared.ts:69`: `registerAnalyticsAdmin`'i opsiyonlu çağır → `registerAnalyticsAdmin(adminApi, { intentPaths: [...vistaseeds intent yolları] })` (örn. `/teklif-al`, sepet/iletişim). Intent yollarını mevcut site rotalarına göre eklendi.

### B. Backend — kanonik filtre helper'ı
- [x] `modules/audit/filters.ts` (yeni, <200 satır): `botUaSql`, `internalIpCond`, `selfTrafficCond`, `realVisitorConds`. Bot tanımı tek kaynak olarak audit filter helper'ında toplandı; analytics buradan re-export kullanıyor.
- [x] `helpers/index.ts` barrel'a ekle (explicit export, `export *` yok).

### C. Backend — audit sorgularını filtreye geçir
- [x] `repository.ts` `excludeLocalhostCond` → `internalIpCond` ile değiştir/genişlet (LAN + LOCAL country dahil). Geriye dönük uyum için eski adı koru ama içeriği genişlet.
- [x] `repository.ts repoGetAuditMetricsDaily`: `realOnly` (default true) param ekle → bot+internal+self dışla. `exclude_localhost` artık alt küme.
- [x] `repository.ts repoGetAuditGeoStats`: aynı `realOnly` default. (FE `LOCAL` filtresi yedek kalsın.)
- [x] `repository.ts repoListAuditRequestLogs` & `repoListAuditAuthEvents`: yeni `real_only` query bayrağı (auth events için default **true** → local girişler gizli; "İstekler" için default **false** çünkü debug aracı, ama UI'da toggle görünür).
- [x] `analytics.repository.ts` (top endpoints/ips/users, status/method dist, hourly, response-time, summary, monthly): hepsine `realVisitorConds` uygula, `realOnly` default true.

### D. Backend — analytics modülü hizalama
- [x] `analytics/sql.ts humanPageviewWhere()`: bot+path'e **internal IP + self** koşullarını ekle (env'den). `repo-overview.ts` ve `repo-extra.ts` (retention/heatmap/device/ads/funnel) bu güncel where'i kullansın.
- [x] `repo-overview.ts` summary: `humanRequests`/`pageviews`/`devices` artık internal+self hariç. `totalRequests`/`botRequests` ham kalabilir (karşılaştırma için), ama kart açıklamaları netleşsin.

### E. Backend — validation
- [x] `validation.ts`: `auditMetricsDailyQuerySchema`, `auditGeoStatsQuerySchema`, `auditRequestLogsListQuerySchema`, `auditAuthEventsListQuerySchema`, `analytics*Query`'lere `real_only: boolLike.optional()` (ve gerekiyorsa `include_internal`) ekle.

### F. Frontend (admin_panel) — `admin-audit-client.tsx`
- [x] "Günlük" ve "Harita" tab'lerinde default temiz veri (FE param göndermese de backend default true; ama net olması için `real_only=1` gönder).
- [x] Genel/İstekler/Günlük/Harita üstüne ortak **"İç trafiği dahil et"** (admin+local+bot) Switch'i ekle → `real_only=0`.
- [x] "İstekler" tab'indeki mevcut `only_admin` etiketini netleştir ("Yalnızca admin istekleri"); yeni toggle ile karışmasın.
- [x] geo-stats query'sine `real_only` paslama (`geoParams`).
- [x] i18n: yeni toggle/label'lar `src/locale/<lang>/admin/audit.json`'a (hardcoded metin yok).
- [x] `integrations/shared` ve `endpoints/admin/audit-admin-endpoints.ts` + `hooks.ts`: yeni query paramları tip + barrel'a ekle (alt-path import yok, explicit barrel). Endpoint/hook mevcut generic param geçişini kullanıyor.

### G. Faz 2 (opsiyonel — şema)
- [x] `db/seed/sql/016_audit_schema.sql` CREATE TABLE'a `is_bot TINYINT NOT NULL DEFAULT 0`, `is_internal TINYINT NOT NULL DEFAULT 0` + index ekle (**local'de ALTER yok**; dosyayı düzenle).
- [x] `service.ts writeRequestAuditLog`: yazımda `is_bot`/`is_internal` hesapla ve persist et.
- [x] Filtreleri kolon bazlı sorguya çevir (regexp yerine indexli kolon).
- [x] Prod: idempotent `ADD COLUMN IF NOT EXISTS` + tek seferlik backfill SQL'i hazırla (canlı DB için full seed YASAK). Canlı DB'ye idempotent migration uygulandı.
- [ ] Local: `bun run build && bun run db:seed:*:fresh`. Destructive fresh seed çalıştırılmadı; local DB'ye idempotent migration uygulandı.

### H. Operasyon
- [x] 13.06 spike araştır: `SELECT ip, path, count(*) ... WHERE DATE(created_at)='2026-06-13' GROUP BY ... ORDER BY 3 DESC` → ana kaynak `/api/v1/admin/google-connect/exchange` loop'u (`508.561` hit). Cleanup SQL'i hazırlandı; canlı DELETE uygulanmadı.
- [x] ~~Site sahibinin sabit ofis/ev IP'sini `AUDIT_EXCLUDE_IPS`'e ekle~~ → **Gerekmez (2026-06-14 kararı):** statik IP yok; authenticated admin trafiği zaten `is_admin` filtresiyle dışlanıyor. `AUDIT_EXCLUDE_IPS` env'i tanımlı ama boş kalır (ileride statik IP olursa eklenebilir).

---

## 5. Doğrulama
- [x] Backend: `bun run build:shared` (shared-backend değişti) + backend `tsc --noEmit`.
- [x] Admin panel: `bun run locales:generate` + `bun x tsc --noEmit` + `bun run build`.
- [x] Manuel/SQL: "Günlük" grafiğinde admin/local/bot olmadan sayılar belirgin düşmeli; canlı SQL doğrulaması 2026-06-13 için `514.794` ham isteği `1.263` gerçek isteğe düşürdü. Panel toggle kontrolü deploy sonrası yapılacak.
- [ ] "Kimlik Doğrulama" tab'inde local login satırları default gizli. Canlı DB'de auth event satırı yok; deploy sonrası panelde kontrol edilecek.
- [x] SQL: Harita'da `LOCAL` ve admin trafiği yok. Canlı SQL doğrulamasında gerçek public pageview filtresi `LOCAL` satırlarını dışlıyor; son 30 günde public pageview audit kaydı yok görünüyor.

## 6. Riskler / Notlar
- **`@agro/shared-backend` paylaşımlı** — `audit`/`analytics` modülleri bereketfide & hal-fiyatları tarafından da kullanılıyor. Değişiklik geriye uyumlu olmalı (`real_only` default'u davranışı değiştirir → diğer projelerde de "temiz" olur, bu istenir ama haber verilmeli). [[shared_backend_dist_vs_source]] — hal dist'e çözer, değişiklikten sonra `build:shared` şart.
- **Sahiplik:** `packages/shared-backend`'i Claude sahiplenir; eşzamanlı düzenlemede Codex çekilmeli. [[shared_backend_tool_ownership]] — bu işi Codex yapacaksa Claude paralel düzenleme yapmamalı.
- Bot tespiti UA-tabanlı; UA gizleyen botlar kaçar. IP reputation Faz 2+ kapsamı dışı.
- Cloudflare arkasında gerçek IP `cf-connecting-ip`'den geliyor (zaten doğru) — internal prefix listesi sunucunun kendi LAN'i için.
