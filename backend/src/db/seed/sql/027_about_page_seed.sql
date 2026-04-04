-- =============================================================
-- Hakkımızda sayfası zengin içerik seed'i
-- site_settings + custom_pages_i18n güncelleme
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================
-- site_settings: about_page — Hakkımızda sayfası seksiyonel veri
-- Frontend bu key'i okuyarak seksiyonları render eder
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'about_page', 'tr', '{
  "hero": {
    "title": "Hakkımızda",
    "description": "Tarımın geleceğini şekillendirmek amacıyla, köklü bir geçmişe sahip Atakan Tohum bünyesinde kurulan Vista Seeds, yüksek kaliteli ve yüksek verimli tohum çeşitleri geliştiren öncü bir markadır."
  },
  "intro": {
    "title": "Vista Seeds",
    "subtitle": "Atakan Tohum İnşaat Mühendislik",
    "content": "Vista Seeds, Atakan Tohum İnşaat Mühendislik şirketi bünyesinde kurulmuş bir tohum markasıdır. İnovasyon, kalite ve sürdürülebilirlik ilkeleriyle, doğaya saygılı bir üretim modeli benimsemekteyiz. Modern ıslah teknikleri ve Ar-Ge çalışmalarıyla hastalıklara dayanıklı, adaptasyon kabiliyeti yüksek hibrit tohumlar sunmaktayız."
  },
  "vision": {
    "title": "Vizyonumuz",
    "content": "Yüksek genetik potansiyele sahip, tescilli ve dayanıklı tohum çeşitlerimizle üreticilerin verimliliğini maksimum seviyeye çıkarmak. Tarımsal üretimin her aşamasında güvenilir bir çözüm ortağı olmak."
  },
  "mission": {
    "title": "Misyonumuz",
    "content": "Tarımda teknoloji ve doğayı buluşturan inovatif çözümlerle, global standartlarda bir marka haline gelmek. Yenilenebilir enerji ve modern mühendislik projelerine entegre büyüme gerçekleştirmek."
  },
  "values": [
    {
      "title": "Yüksek Verimli Tohumlar",
      "description": "Modern islah teknikleriyle geliştirilen, yüksek genetik potansiyele sahip sertifikalı tohum çeşitleri.",
      "icon": "sprout"
    },
    {
      "title": "Kalite ve Güven",
      "description": "Her parti laboratuvar testlerinden geçirilen, çimlendirme oranı garanti edilen tohumlar. TUAB onaylı, tescilli çeşitler.",
      "icon": "shield"
    },
    {
      "title": "Üretici Odaklılık",
      "description": "Türkiye iklim koşullarına uygun, saha testlerinden geçmiş, çiftçinin ihtiyacını anlayan çözümler.",
      "icon": "users"
    },
    {
      "title": "Araştırma ve Geliştirme",
      "description": "Kendi araştırma tesislerimizde sürekli yeni çeşitler geliştirme, hibrit ıslah programları ve iyileştirme çalışmaları.",
      "icon": "flask"
    }
  ],
  "stats": [
    {"value": "100+", "label": "Uzman Kadro", "description": "Ar-Ge ve kalite kontrol"},
    {"value": "250+", "label": "Personel", "description": "Üretim ve operasyon"},
    {"value": "137K+", "label": "Müşteri", "description": "Türkiye genelinde"},
    {"value": "8+", "label": "Tohum Çeşidi", "description": "Hibrit ve anaç"}
  ],
  "timeline": [
    {"year": "1988", "title": "Tarım Sektörüne İlk Adım", "description": "Aile olarak tarım sektörüne giriş, ilk tohum ticaret faaliyetleri."},
    {"year": "1990", "title": "Şahin Ziraat Kuruluşu", "description": "Organizasyonel yapı ile sektörde profesyonel faaliyet başlangıcı."},
    {"year": "2006", "title": "Bereket Fide Kuruluşu", "description": "Üretim zinciri desteği için fide üretim tesisi kuruldu."},
    {"year": "2017", "title": "İnşaat Sektörüne Giriş", "description": "Vista Lagoon ve Vista Prestige konut projeleri ile gayrimenkul yatırımları."},
    {"year": "2018", "title": "Tolkan Mimarlık", "description": "Grup bünyesinde mimarlık ve mühendislik firması kuruldu."},
    {"year": "2025", "title": "Atakan Tohum ve Vista Seeds", "description": "Modern marka kimliği ile tohum ıslahı ve üretiminde yeni dönem. Vista Seeds markası tescil edildi."}
  ],
  "activities": {
    "title": "Faaliyet Alanları",
    "items": [
      {"title": "Tohum Islahı ve Üretimi", "description": "Hibrit biber, anaç ve diğer sebze tohumlarının ıslahı, üretimi ve pazarlaması."},
      {"title": "Yenilenebilir Enerji", "description": "Güneş enerjisi santralları işletimi ile sürdürülebilir enerji üretimi."},
      {"title": "İnşaat ve Gayrimenkul", "description": "Vista Lagoon, Vista Prestige konut projeleri ve kentsel dönüşüm yatırımları."},
      {"title": "Fide Üretimi", "description": "Bereket Fide markası ile profesyonel fide üretim tesisleri ve çiftçiye destek."}
    ]
  },
  "group_companies": [
    {"name": "Atakan Tohum İnşaat Mühendislik", "role": "Ana şirket", "description": "Grubun kurumsal çatısı ve yönetim merkezi."},
    {"name": "Vista Seeds", "role": "Tohum markası", "description": "Hibrit tohum ıslahı, üretim ve pazarlama."},
    {"name": "Bereket Fide", "role": "Fide üretimi", "description": "Profesyonel fide üretim tesisleri."},
    {"name": "Tolkan Mimarlık", "role": "Mimarlık", "description": "İnşaat ve mimarlık projeleri."}
  ]
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- Hakkımızda sayfası artik site_settings.about_page key'inden okunuyor.
-- custom_pages_i18n'e bağımlılığı yok.
