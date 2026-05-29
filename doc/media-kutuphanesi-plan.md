# Medya Kütüphanesi (Grid) Yeniden Tasarım — Uygulama Planı

> Mimari: Claude Code. Implementasyon: Codex (müşterek). Görsel doğrulama: Antigravity.
> Referans tasarım: `/home/orhan/Documents/Projeler/wiribude/site/admin/media.php` (düz PHP+GD).
> Hedef: vistaseeds admin panelindeki storage sayfasını wiribu benzeri **grid medya kütüphanesine** çevirmek — mevcut storage backend + Cloudinary transform'larıyla.

## 1. Amaç & Kapsam

- **Frontend:** `admin_panel` storage sayfasını grid medya kütüphanesine çevir:
  sayaçlı başlık, dropzone upload + progress, thumbnail kart grid, detay modal, bulk seçim, pagination, arama + bucket filtresi.
- **Backend (shared-backend/modules/storage):** minimal, **geriye uyumlu** eklemeler:
  `adminListAssets` URL düzeltmesi, `thumb_url`/`total_size`, SEO slug isimlendirme, Cloudinary thumbnail transform helper.

## 2. Kısıtlar (KRİTİK)

- `packages/shared-backend/modules/storage` **paylaşımlıdır** (bereketfide vb. kullanır). Tüm backend değişiklikleri **geriye uyumlu** olmalı; değişiklik sonrası **bereketfide admin storage test edilir**.
- **Cloudinary-first:** wiribu'nun GD ile diske 4 kopya üretmesi **KOPYALANMAZ**. WebP/boyut Cloudinary URL transform'u ile (`f_auto,q_auto,w_300`). Local driver fallback: orijinali serve et.
- Proje altında `bun install` YASAK. Shared değişince **root'tan** `bun run build:shared`.
- API prefix `/api/v1`; admin guard `routes.ts`'te (bireysel admin.routes'ta tekrar guard yok).
- ALTER TABLE yok; yeni şema gerekmiyor (mevcut `storage_assets` yeterli).

## 3. Mevcut Durum (tespit edildi)

- Backend route'lar (`storage/admin.routes.ts`): `GET /admin/storage/assets` (list, paginated, `x-total-count`), `GET :id`, `POST` (upload), `PATCH :id`, `DELETE :id`, `POST :id`→`bulk-delete {ids:[]}`.
- `storageListQuerySchema`: `bucket, q, limit, offset, page, pageSize` destekli.
- **BUG:** `adminListAssets` ([admin.controller.ts:46]) rows'u `buildPublicUrl` çağırmadan döndürüyor → local kayıtlarda `url=/uploads/...` ham geliyor → kırık önizleme. (get/patch/create/serve hepsi `buildPublicUrl` kullanıyor.)
- Frontend client (`integrations/shared/storage.ts`): `storageApi.listAssets/uploadAsset/patchAsset/deleteAsset/bulkDeleteAssets` hazır; `listAssets` `x-total-count` okuyor.
- Sayfa bileşeni: `admin_panel/src/app/(main)/admin/(admin)/storage/_components/admin-storage-client.tsx` — `ViewMode='grid'|'list'`, `PAGE_SIZE=24` zaten var; önizlemeyi `resolveMediaUrl(item.url)` ile çiziyor.
- `cloudinary.ts`: `getCloudinaryConfig()` driver'ı site_settings→env'den çözer; `uploadBufferAuto` cloudinary/local.

## 4. Backend Görevleri (Codex)

### 4.1 `adminListAssets` URL düzeltmesi — `admin.controller.ts`
`adminGetAsset` ile aynı pattern: rows'u dönmeden önce `cfg = await getCloudinaryConfig()` al, her satırın `url`'sini `buildPublicUrl(row.bucket, row.path, row.url, cfg)` ile üret.
```ts
const cfg = await getCloudinaryConfig();
const out = rows.map((r) => ({
  ...r,
  url: buildPublicUrl(r.bucket, r.path, r.url, cfg ?? undefined),
  thumb_url: buildThumbUrl(r, cfg ?? undefined), // 4.2
}));
return reply.send(out);
```
> Geriye uyumlu: yalnızca `url` alanı düzelir + yeni `thumb_url` eklenir.

### 4.2 Thumbnail transform helper — `util.ts`
`buildThumbUrl(asset, cfg)`:
- provider=cloudinary ve url cloudinary ise: `/upload/` sonrasına `w_300,c_limit,f_auto,q_auto/` enjekte et.
- aksi halde: `buildPublicUrl(...)` (orijinal) döndür.
> Mantık tek yerde; frontend sadece `thumb_url` kullanır.

### 4.3 `x-total-size` header (MB göstergesi için) — `admin.controller.ts` + `repository.ts`
`repoListAndCount` zaten total döndürüyor; `SUM(size)` da döndür (ya da ayrı hafif sorgu). `adminListAssets`:
```ts
reply.header('x-total-size', String(totalSize));
reply.header('access-control-expose-headers', 'x-total-count, x-total-size, content-range');
```
> Opsiyonel; yoksa frontend sadece adet gösterir.

### 4.4 SEO slug isimlendirme — `helpers/admin.helpers.ts` (`sanitizeName`)
wiribu `makeSeoFilename` mantığı: TR harf çevirisi (ş→s, ı→i...), lowercase, `[^a-z0-9-]`→`-`, trim. Uzantı korunur. Yalnız **yeni upload**ları etkiler (geriye uyumlu). Uniqueness `repoIsDup` ile zaten var.

## 5. Frontend Görevleri (Codex)

Dosya: `admin-storage-client.tsx` (+ `storage.ts` tipine `thumb_url?: string` ekle).

1. **Başlık:** "Medya Kütüphanesi" + "Toplam N dosya (X MB)" (`x-total-count` / `x-total-size`). Sağda "Toplu İşlem" toggle.
2. **Dropzone:** tıkla + sürükle-bırak, `multiple`, `accept=image/*`; her dosya `storageApi.uploadAsset`; sayaç-bazlı progress bar (wiribu gibi); bitince listeyi tazele.
3. **Grid:** `grid-template-columns: repeat(auto-fill, minmax(180px,1fr))`, kart = kare thumbnail (`object-cover`, `thumb_url`), dosya adı (truncate), `WxH px`. Görsel değilse/eksikse fallback ikon.
4. **Detay modal:** karta tıkla → önizleme (`url`), dosya adı, boyut, **URL kopyala** alanı, **Sil**. (Resize opsiyonel: Cloudinary'de dosya üretmek yerine "şu genişlikte URL kopyala" preset'leri — `w_800` vb.)
5. **Bulk mode:** toggle → kartlarda checkbox → sabit alt bar → `storageApi.bulkDeleteAssets(ids)`.
6. **Pagination:** `PAGE_SIZE=24`, önceki/sonraki + numaralı (total'dan).
7. **Arama + bucket filtresi:** mevcut; korunur.
8. Göreli url'lerde `resolveMediaUrl` kullan.

## 6. Veri Kontratı Değişiklikleri
- List item: `+ thumb_url: string` (url tam kalır).
- List header: `+ x-total-size` (opsiyonel).
- Yeni upload adları: SEO slug.

## 7. Kabul Kriterleri
- Grid Cloudinary thumbnail'larını hızlı (WebP/`f_auto`) gösterir; geçerli cloudinary asset'lerde kırık görsel yok.
- Upload (sürükle/tıkla, çoklu) çalışır, yeni dosyalar görünür, SEO-slug isimli.
- Bulk seç + sil çalışır.
- Detay modal: önizleme, URL kopyala, sil.
- Pagination + arama + bucket filtresi.
- **bereketfide admin storage hâlâ çalışır** (backend geriye uyumlu).
- Proje altında `bun install` yok; root'tan `build:shared` koşuldu.

## 8. Sıralama (müşterek)
1. **Claude (mimar):** bu plan + backend diff'lerini shared-safety açısından review.
2. **Codex:** backend (4.1→4.4) → root `bun run build:shared` → bereketfide+vistaseeds smoke test.
3. **Codex:** frontend grid (bölüm 5).
4. **Antigravity:** sayfanın görsel doğrulaması.
5. **Claude:** tutarlılık review.

## 9. Kapsam Dışı
- wiribu'nun GD ile diske çoklu boyut üretimi (Cloudinary hallediyor).
- Yeni medya DB şeması.
- Local driver için on-the-fly resize (yalnız orijinal serve; Cloudinary asıl yol).

## 10. İlgili Not
- Bölüm 4.1 düzeltmesi, panelde **kırık önizleme** sorununu da kısmen iyileştirir; ancak local test dosyaları (proof/test/dbg...) zaten diskte yok → onlar ayrıca panelden silinmeli (gerçek içerik değiller).
