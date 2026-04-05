-- =============================================================
-- Homepage dinamik içerik seed'leri
-- Mevsimsel hero, trust badges, ekim rehberi, newsletter, footer
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================
-- homepage_hero — Mevsimsel hero verisi
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'homepage_hero', 'tr', '{
  "season": "spring",
  "title": "Tohumun Bereketi",
  "highlight": "Toprakla",
  "suffix": "Başlar",
  "description": "Vista Seeds, yüksek verimli ve güvenilir tohum çeşitleriyle tarımda sürdürülebilir başarı sunar.",
  "badge": "2026 Bahar Sezonu",
  "image_url": "/assets/hero/spring-field.jpg",
  "cta_label": "Ürünleri Keşfet",
  "cta_href": "/urunler",
  "secondary_label": "Ekim Rehberi",
  "secondary_href": "/sss"
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- trust_badges — Güven sinyalleri
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'trust_badges', 'tr', '[
  {"icon": "shield-check", "label": "Sertifikalı Tohum", "description": "TUAB onaylı, tescilli çeşitler"},
  {"icon": "leaf", "label": "Sürdürülebilir Üretim", "description": "Çevre dostu tarım pratikleri"},
  {"icon": "flask-conical", "label": "AR-GE Odaklı", "description": "Kendi seleksiyonlarımız ve hibrit çeşitler"},
  {"icon": "sprout", "label": "%95+ Çimlendirme", "description": "Laboratuvar testli kalite garantisi"}
]')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- homepage_sections — Stats, Values, Timeline verileri
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'homepage_sections', 'tr', '{
  "stats": [
    {"value": "137K+", "label": "Müşteri"},
    {"value": "8+", "label": "Çeşit"},
    {"value": "35+", "label": "Yıllık Deneyim"},
    {"value": "%95", "label": "Çimlendirme Oranı"}
  ],
  "values": [
    {"icon": "sun", "title": "Yüksek Verim", "description": "Vista Seeds, modern üretim teknikleriyle geliştirilen yüksek verimli tohumlar sunar."},
    {"icon": "shield", "title": "Kalite ve Güven", "description": "Tüm tohumlarımız kalite kontrol süreçlerinden geçirilir. Çiftçilerimizin güvenle ekebileceği, sağlıklı ve dayanıklı tohumlar üretiriz."},
    {"icon": "users", "title": "Bölgesel Uyum", "description": "Farklı iklim ve toprak koşullarına uygun çeşitler sayesinde her bölgede başarılı üretim imkanı sağlar."},
    {"icon": "beaker", "title": "AR-GE ve İnovasyon", "description": "Kendi araştırma tesislerimizde sürekli yeni çeşitler geliştirme, hibrit ıslah programları ve iyileştirme çalışmaları."}
  ],
  "timeline": [
    {"year": "1988", "title": "Kuruluş", "description": "Atakan Tohum olarak faaliyetlere başlandı."},
    {"year": "1995", "title": "İlk Hibrit", "description": "İlk F1 hibrit biber çeşidi geliştirildi."},
    {"year": "2005", "title": "İhracat", "description": "Uluslararası pazarlara açılış."},
    {"year": "2015", "title": "AR-GE Merkezi", "description": "Modern araştırma tesisi faaliyete geçti."},
    {"year": "2020", "title": "Vista Seeds", "description": "Yeni marka ve genişletilmiş ürün yelpazesi."},
    {"year": "2025", "title": "Dijital Dönüşüm", "description": "Teknoloji ile entegre çiftçi destek sistemi."}
  ],
  "seasonal_picks_title": "Bu Mevsim Önerilerimiz",
  "seasonal_picks_description": "Bahar ekimi için en uygun çeşitlerimizi inceleyin."
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- planting_guide — Ekim rehberi mevsim verileri
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'planting_guide', 'tr', '{
  "title": "Ekim Rehberi",
  "description": "Mevsime göre ekim önerileri ve bakım ipuçları.",
  "seasons": [
    {
      "key": "spring",
      "label": "İlkbahar",
      "months": "Mart — Mayıs",
      "tips": [
        "Toprak sıcaklığı en az 15°C olmalı",
        "Fide hazırlığı Şubat sonunda başlatılmalı",
        "İlk sulama hafif ve düzgün yapılmalı"
      ],
      "recommended_tags": ["bahar", "fide"]
    },
    {
      "key": "summer",
      "label": "Yaz",
      "months": "Haziran — Ağustos",
      "tips": [
        "Sıcak stresine karşı gölgeleme yapılmalı",
        "Damla sulama ile verimlilik artırılmalı",
        "Hasat zamanlarına dikkat edilmeli"
      ],
      "recommended_tags": ["yaz", "sicaga-dayanikli"]
    },
    {
      "key": "autumn",
      "label": "Sonbahar",
      "months": "Eylül — Kasım",
      "tips": [
        "Kış sebzeleri için ideal ekim dönemi",
        "Toprak hazırlığı ve gübrelemesi kritik",
        "Don riskine karşı önlem alınmalı"
      ],
      "recommended_tags": ["sonbahar", "kis-sebzesi"]
    }
  ]
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- newsletter_config — Newsletter bandı ayarları
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'newsletter_config', 'tr', '{
  "title": "Güncel Kalın",
  "description": "Yeni çeşitler, ekim takvimleri ve özel kampanyalar için bültenimize abone olun.",
  "button_label": "Abone Ol",
  "placeholder": "E-posta adresinizi girin"
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- footer_config — Footer kolon linkleri
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'footer_config', 'tr', '{
  "help_title": "Size yardımcı olmaktan mutluluk duyarız",
  "help_description": "Sıkça sorulan sorularımıza göz atın veya bizimle iletişime geçin.",
  "follow_title": "Bizi Takip Edin",
  "columns": [
    {
      "title": "Kurumsal",
      "links": [
        {"label": "Hakkımızda", "href": "/hakkimizda"},
        {"label": "Tarihçe", "href": "/hakkimizda#tarihce"},
        {"label": "Kariyer", "href": "/insan-kaynaklari"},
        {"label": "İletişim", "href": "/iletisim"}
      ]
    },
    {
      "title": "Destek",
      "links": [
        {"label": "S.S.S.", "href": "/sss"},
        {"label": "Ekim Rehberi", "href": "/sss"},
        {"label": "İletişim Formu", "href": "/iletisim"}
      ]
    },
    {
      "title": "Yasal",
      "links": [
        {"label": "Gizlilik Politikası", "href": "/gizlilik-politikasi"},
        {"label": "Kullanım Koşulları", "href": "/kullanim-kosullari"},
        {"label": "KVKK", "href": "/kvkk"}
      ]
    },
    {
      "title": "Ürünler",
      "links": [
        {"label": "Tüm Ürünler", "href": "/urunler"},
        {"label": "Biber Çeşitleri", "href": "/urunler?category=biber"},
        {"label": "Anaç Çeşitleri", "href": "/urunler?category=anac"}
      ]
    }
  ]
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
