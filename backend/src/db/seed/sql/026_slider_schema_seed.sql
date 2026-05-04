-- =============================================================
-- Slider modülü: schema + seed verileri
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================
-- SCHEMA: slider parent + i18n
-- =============================================================

CREATE TABLE IF NOT EXISTS `slider` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`            CHAR(36) NOT NULL,
  `image_url`       TEXT DEFAULT NULL,
  `image_asset_id`  CHAR(36) DEFAULT NULL,
  `site_id`         CHAR(36) DEFAULT NULL,
  `featured`        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `is_active`       TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `display_order`   INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_slider_uuid` (`uuid`),
  KEY `idx_slider_active` (`is_active`),
  KEY `idx_slider_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `slider_i18n` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slider_id`   INT UNSIGNED NOT NULL,
  `locale`      VARCHAR(8) NOT NULL,
  `name`        VARCHAR(255) NOT NULL,
  `slug`        VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `alt`         VARCHAR(255) DEFAULT NULL,
  `button_text` VARCHAR(100) DEFAULT NULL,
  `button_link` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_slider_i18n_slider_locale` (`slider_id`, `locale`),
  UNIQUE KEY `uniq_slider_i18n_slug_locale` (`slug`, `locale`),
  KEY `idx_slider_i18n_locale` (`locale`),
  CONSTRAINT `fk_slider_i18n_slider` FOREIGN KEY (`slider_id`) REFERENCES `slider` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- SEED: 4 slider + i18n (TR)
-- Görseller: uploads/slide/ altında, storage_assets ile ilişkilendirildi
-- =============================================================

INSERT INTO `slider` (`id`, `uuid`, `image_url`, `image_asset_id`, `featured`, `is_active`, `display_order`) VALUES
(1, '11110001-0001-4000-8000-000000000001', '/uploads/slide/slide-1-field.webp',       '00009400-0000-4000-8000-000000000101', 1, 1, 1),
(2, '11110001-0001-4000-8000-000000000002', '/uploads/slide/slide-2-corn.webp',        '00009400-0000-4000-8000-000000000102', 0, 1, 2),
(3, '11110001-0001-4000-8000-000000000003', '/uploads/slide/slide-3-hero.webp',        '00009400-0000-4000-8000-000000000103', 0, 1, 3),
(4, '11110001-0001-4000-8000-000000000004', '/uploads/slide/slide-4-agriculture.webp', '00009400-0000-4000-8000-000000000104', 0, 1, 4),
(5, '11110001-0001-4000-8000-000000000005', '/uploads/slide/slide-5-greenhouse.webp',  '00009400-0000-4000-8000-0000000001a5', 0, 0, 5),
(6, '11110001-0001-4000-8000-000000000006', '/uploads/slide/slide-6-seedlings.webp',   '00009400-0000-4000-8000-0000000001a6', 0, 0, 6),
(7, '11110001-0001-4000-8000-000000000007', '/uploads/slide/slide-7-seeds.webp',       '00009400-0000-4000-8000-0000000001a7', 0, 0, 7),
(8, '11110001-0001-4000-8000-000000000008', '/uploads/slide/slide-8-landscape.webp',   '00009400-0000-4000-8000-0000000001a8', 0, 0, 8)
ON DUPLICATE KEY UPDATE
  `image_url` = VALUES(`image_url`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `display_order` = VALUES(`display_order`),
  `is_active` = VALUES(`is_active`),
  `updated_at` = NOW(3);

INSERT INTO `slider_i18n` (`slider_id`, `locale`, `name`, `slug`, `description`, `alt`, `button_text`, `button_link`) VALUES
(1, 'tr', 'Tohumun Bereketi Toprakla Başlar',
    'tohumun-bereketi',
    'Vista Seeds, yüksek verimli ve güvenilir tohum çeşitleriyle tarımda sürdürülebilir başarı sunar.',
    'Yeşil tarla manzarası',
    'Ürünleri Keşfet', '/urunler'),

(2, 'tr', 'AR-GE ile Geleceğin Tohumları',
    'arge-gelecek',
    'Kendi seleksiyon ve hibrit çeşitlerimizle Türkiye tarımına değer katıyoruz. Bilimle üretiyor, çiftçiyle büyüyoruz.',
    'Mısır tarlası',
    'Hakkımızda', '/hakkimizda'),

(3, 'tr', 'Sertifikalı ve Güvenilir',
    'sertifikali-guvenilir',
    'TUAB onaylı, laboratuvar testli tohumlar. %95 üzerinde çimlendirme oranı ile kalite garantisi sunuyoruz.',
    'Tohum ve sebze çeşitleri',
    'SSS', '/sss'),

(4, 'tr', 'Sürdürülebilir Tarım Vizyonu',
    'surdurulebilir-tarim',
    'Çevre dostu üretim pratikleri ve doğal kaynakların korunması önceliğimizdir. Gelecek nesiller için sorumluluk taşıyoruz.',
    'Tarım alanı',
    'İletişim', '/iletisim'),

(5, 'tr', 'Modern Sera Üretiminde Lider',
    'modern-sera-uretimi',
    'Kontrollü ortam tarımı için özel geliştirilen sera tohumlarımızla yüksek verim ve kalite garantisi.',
    'Modern sera tesisi',
    'Sera Çeşitleri', '/urunler?cultivation=greenhouse'),

(6, 'tr', 'Fideden Hasada Bütünleşik Çözüm',
    'fide-hasat-cozum',
    'Sertifikalı fide üretimi ve uzman destek ile tohumdan hasada kadar yanınızdayız.',
    'Fide üretim alanı',
    'Fideler', '/urunler?type=fide'),

(7, 'tr', 'Hibrit Tohum Çeşitliliği',
    'hibrit-tohum',
    'Domates, biber, hıyar ve daha fazlası — yüzlerce hibrit çeşit, her iklim ve toprak tipi için özel formüller.',
    'Çeşitli tohumlar',
    'Tüm Tohumlar', '/urunler'),

(8, 'tr', 'Anadolu Topraklarına Uyumlu',
    'anadolu-uyumlu',
    'Türkiye coğrafyasının iklim ve toprak çeşitliliğine adapte hibrit ve seleksiyon çeşitleri.',
    'Anadolu tarım manzarası',
    'İletişim', '/iletisim')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `alt` = VALUES(`alt`),
  `button_text` = VALUES(`button_text`),
  `button_link` = VALUES(`button_link`);
