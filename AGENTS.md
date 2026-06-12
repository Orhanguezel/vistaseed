# AGENTS.md — vistaseeds

## 🔔 CODEX AKTİF GÖREV (2026-06-12)

> **Codex → Search Console modülünü genişlet:** [`CODEX-GSC-MODULU-GENISLETME.md`](CODEX-GSC-MODULU-GENISLETME.md)
> İndexleme analizi (hangi içerik indexli/değil + düzeltme önerileri), zaman serisi grafikler, cihaz/ülke kırılımı, sayfa→sorgu drill-down, sitemap gönder/sil. Detaylı checklist o dosyada.
>
> **Sahiplik/çakışma:** Claude paralelde GA4 / Meta CAPI / GTM / rotasyon modüllerini yazıyor. Codex SADECE `searchConsole` backend modülü + `/admin/search-console` panel sayfası + GSC locale dosyasına dokunur. Paylaşımlı barrel'lara (`integrations/shared.ts`, `hooks.ts`, `sidebar-items.ts`, `permissions.ts`, `_shared/google-oauth.ts`) yalnızca KENDİ satırını ekler, mevcut satırları değiştirmez/silmez.

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
