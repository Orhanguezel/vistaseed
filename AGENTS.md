# AGENTS.md — vistaseeds

## 🔔 CODEX AKTİF GÖREV (2026-06-12)

> ✅ **Search Console genişletme** (canlı) — [`CODEX-GSC-MODULU-GENISLETME.md`](CODEX-GSC-MODULU-GENISLETME.md)
> ✅ **GA4 derinleştirme** (canlı) — [`CODEX-GA4-MODULU-DERINLESTIRME.md`](CODEX-GA4-MODULU-DERINLESTIRME.md)
>
> 🟢 **YENİ GÖREV → Rotasyon (Google Bağlantısı) modülünü tamamla:** [`CODEX-ROTASYON-MODULU-TAMAMLAMA.md`](CODEX-ROTASYON-MODULU-TAMAMLAMA.md)
> In-panel callback (manuel kod yapıştırmayı kaldır), token sağlığı + servis testi, bağlantıyı kes + revoke, client secret rotasyon akışı. Temel sürüm canlı; detaylar o dosyada.
>
> 🔴 **YENİ GÖREV → SEO/İndexleme düzeltmeleri (frontend):** [`CODEX-BRIEF-seo-indexleme.md`](CODEX-BRIEF-seo-indexleme.md)
> GSC derin tarama (2026-06-26): 14 indexlenmeyen. FIX 1 sitemap noindex/soft-404 temizliği (`app/sitemap.ts`), FIX 2 `/[locale]/urunler` Soft 404 → locale fallback (`urunler/page.tsx`), **FIX 4 `/tr/siparis-ver` "URL unknown to Google" → noindex değil + iç link (dönüşüm sayfası!)**. FIX 3 de/en içerik stratejisi (blog+ürün detay noindex) = sahip kararı bekliyor.
>
> **Sahiplik/çakışma:** Claude paralelde **Meta Pixel + CAPI** yazıyor. Codex SADECE `googleConnect` backend modülü + `/admin/google-connect` panel sayfası + google-connect locale'ine dokunur. Paylaşımlı barrel'lara (`integrations/shared.ts`, `hooks.ts`, `sidebar-items.ts`, `permissions.ts`, `admin-ui.ts`, `locale/tr/admin/index.ts`, `_shared/google-oauth.ts`) yalnızca KENDİ satırını ekler; başka modülün (Meta/GA4/GTM/GSC) satırlarına dokunmaz.

## Proje Özeti

vistaseeds, tohumculuk ve tarım odaklı kurumsal web sitesi projesidir. Kökte public site (`frontend/`), yönetim paneli (`admin_panel/`) ve Fastify backend (`backend/`) birlikte yer alır.

## Canlı Erişim Notu

Canlı servis `vps-vistainsaat` sunucusundadır. SSH erişimi key ile yapılır: `ssh vps-vistainsaat`.

## Workspace Haritası

```
vistaseeds/
├── frontend/         Next.js public site
├── admin_panel/      Next.js admin panel
├── backend/          Fastify v5 API
├── doc/              İçerik ve plan dokümanları
└── project.portfolio.json
```

## Çalışma Kuralları

1. Kod yazmadan önce `doc/` altındaki ilgili plan veya sayfa notunu oku.
2. Backend'de mevcut modül yapısını koru; yeni iş mantığı gerekiyorsa mevcut pattern içinde ilerle.
3. Public site değişikliklerinde `frontend/`, admin tarafı değişikliklerinde `admin_panel/` ownership sınırına dikkat et.
4. `project.portfolio.json` proje kimliği için referans dosyadır; teknik gerçekle uyumlu tutulur.
5. PaketJet veya başka önceki projelerden kalan kodu toplu silme; referanslarını anlayıp kontrollü budama yap.

## Komutlar

```bash
# Public site
cd frontend && bun install && bun run dev

# Admin panel
cd admin_panel && bun install && bun run dev

# Backend
cd backend && bun install && bun run dev
```

## Notlar

- `doc/` klasörü bu proje için fiili plan klasörüdür; `docs/` yoksa yeni dosyalar mevcut yapıyla uyumlu eklenmelidir.
- `admin_panel/package.json` ve kök dokümantasyonda proje adı `vistaseeds` olarak korunmalıdır.
- Mimari yeniden tasarım gerektiren büyük kararlar `CLAUDE.md` kapsamındadır.
