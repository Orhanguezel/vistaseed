# vistaseeds

vistaseeds, tohumculuk odaklı kurumsal web deneyimi ve yönetim altyapısı için hazırlanan full-stack projedir. Kökte hem public site (`frontend/`) hem yönetim paneli (`admin_panel/`) hem de Fastify tabanlı API (`backend/`) bulunur.

**Canlı:** [vistaseeds.com.tr](https://vistaseeds.com.tr)

---

## Ekran Görüntüleri

### Desktop — Lighthouse 96 / 100 / 100 / 100

![vistaseeds Desktop](Screenshot%20from%202026-04-05%2021-34-27.png)

### Mobile

![vistaseeds Mobile](Screenshot%20from%202026-04-05%2021-35-36.png)

---

## Lighthouse Skorları (Canlı)

| Metrik         | Skor |
| -------------- | ---- |
| Performance    | 96   |
| Accessibility  | 100  |
| Best Practices | 100  |
| SEO            | 100  |

---

## Klasör Yapısı

- `frontend/` — Next.js 16 App Router, React 19, Tailwind CSS v4, çok dilli (tr/en/de)
- `admin_panel/` — Next.js admin paneli, içerik ve veri yönetimi
- `backend/` — Fastify v5, MySQL + Drizzle ORM, JWT auth, modüler API
- `doc/` — Sayfa içerikleri, modül planları ve backend geçiş notları
- `.claude/` — Claude agent ayarları

---

## Geliştirme Akışı

### Frontend

```bash
cd frontend
cp .env.example .env.local
bun install
bun run dev
```

### Admin Panel

```bash
cd admin_panel
bun install
bun run dev
```

### Backend

```bash
cd backend
cp .env.example .env
bun install
bun run dev
```

---

## Proje Standartları

- Kök metadata dosyası olarak `project.portfolio.json` bulunur.
- Proje talimatları için `AGENTS.md`, mimari ve stratejik notlar için `CLAUDE.md` kullanılır.
- Uygulama plan notları `doc/` altında tutulur; yeni dokümanlar eklenirken bu klasör referans alınmalıdır.
- `project.portfolio.json` dışında teknik kimlik bilgileri README ve alt README'lerde tutarlı şekilde güncellenmelidir.
