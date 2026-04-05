# VistaSeed Workspace

VistaSeed, tohumculuk odaklı kurumsal web deneyimi ve yönetim altyapısı için hazırlanan full-stack projedir. Kökte hem public site (`frontend/`) hem yönetim paneli (`admin_panel/`) hem de Fastify tabanlı API (`backend/`) bulunur.

## Klasör Yapısı

- `frontend/`: Next.js tabanlı public web sitesi
- `admin_panel/`: yönetim paneli, içerik ve veri yönetimi
- `backend/`: Fastify API, auth, site settings, ürün ve içerik modülleri
- `doc/`: sayfa içerikleri, modül planları ve backend geçiş notları
- `.claude/`: Claude agent ayarları

## Mevcut Durum

- Public site, ürünler, iletişim, SSS ve insan kaynakları gibi kurumsal sayfaları hedefler.
- Backend tarafında ortak altyapıya ek olarak geçmiş projelerden taşınmış modüller bulunur.
- Admin panel isimlendirmesinde ve bazı iç referanslarda eski proje kalıntıları vardır; bu turda kök standartları tamamlandı, alan temizliği ise kontrollü ikinci faz işidir.

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

## Proje Standartları

- Kök metadata dosyası olarak `project.portfolio.json` bulunur.
- Proje talimatları için `AGENTS.md`, mimari ve stratejik notlar için `CLAUDE.md` kullanılır.
- Uygulama plan notları şu an `doc/` altında tutulur; yeni dokümanlar eklenirken bu klasör referans alınmalıdır.
- `project.portfolio.json` dışında teknik kimlik bilgileri README ve alt README'lerde tutarlı şekilde güncellenmelidir.

## Öncelikli Temizlik Başlıkları

- `backend` içindeki PaketJet kalıntısı modülleri modül bazlı ayıklamak
- `admin_panel` içindeki eski proje isimlerini ve data-attribute kalıntılarını temizlemek
- `frontend` ve `admin_panel` için ortak marka ve API ayarlarını sabitlemek
- `doc/` altındaki planları uygulama durumuna göre güncellemek
