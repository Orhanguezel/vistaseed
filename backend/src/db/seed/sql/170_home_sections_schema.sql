-- =============================================================
-- 170 — Anasayfa bölümleri (admin: sıra, aktif/pasif, component)
-- Public:  GET /api/v1/home/layout         → yalnızca is_active=1, order_index sırası
-- Admin:   /api/v1/admin/home/sections     → tam CRUD + reorder
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `home_sections` (
  `id`            CHAR(36)      NOT NULL,
  `slug`          VARCHAR(100)  NOT NULL,
  `label`         VARCHAR(255)  NOT NULL,
  `component_key` VARCHAR(100)  NOT NULL,
  `order_index`   INT UNSIGNED  NOT NULL DEFAULT 0,
  `is_active`     TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `config`        JSON          DEFAULT NULL,
  `created_at`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `home_sections_slug_uq` (`slug`),
  KEY `home_sections_order_idx` (`order_index`),
  KEY `home_sections_active_idx` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `home_sections`
  (`id`, `slug`, `label`, `component_key`, `order_index`, `is_active`, `config`)
VALUES
  ('b1000001-0000-4000-8000-000000000001', 'hero',                'Hero Slider',          'HeroSlider',             10, 1, NULL),
  ('b1000001-0000-4000-8000-000000000002', 'trust_bar',           'Güven Sinyalleri',     'TrustBar',               20, 1, NULL),
  ('b1000001-0000-4000-8000-000000000003', 'stats',               'İstatistikler',        'Stats',                  30, 1, NULL),
  ('b1000001-0000-4000-8000-000000000004', 'seasonal_picks',      'Mevsim Önerileri',     'SeasonalPicks',          40, 1, NULL),
  ('b1000001-0000-4000-8000-000000000005', 'values',              'Neden Biz / Değerler', 'Values',                 50, 1, NULL),
  ('b1000001-0000-4000-8000-000000000006', 'feature_panels',      'Özellik Panelleri',    'HomepageFeaturePanels',  60, 1, NULL),
  ('b1000001-0000-4000-8000-000000000007', 'planting_guide',      'Ekim Rehberi',         'PlantingGuide',          70, 1, NULL),
  ('b1000001-0000-4000-8000-000000000008', 'ecosystem_spotlight', 'Ekosistem İçeriği',    'EcosystemSpotlight',     80, 1, NULL),
  ('b1000001-0000-4000-8000-000000000009', 'product_discovery',   'Ürün Keşif Linkleri',  'ProductDiscoveryLinks',  90, 1, NULL),
  ('b1000001-0000-4000-8000-000000000010', 'products_preview',    'Öne Çıkan Ürünler',    'ProductsPreview',       100, 1, NULL),
  ('b1000001-0000-4000-8000-000000000011', 'timeline',            'Tarihçe',              'Timeline',              110, 1, NULL),
  ('b1000001-0000-4000-8000-000000000012', 'faq_preview',         'SSS Önizleme',         'FaqPreview',            120, 1, NULL),
  ('b1000001-0000-4000-8000-000000000013', 'newsletter',          'Bülten',               'Newsletter',            130, 1, NULL),
  ('b1000001-0000-4000-8000-000000000014', 'cta',                 'İletişim CTA',         'CtaSection',            140, 1, NULL)
ON DUPLICATE KEY UPDATE
  `label`         = VALUES(`label`),
  `component_key` = VALUES(`component_key`),
  `order_index`   = VALUES(`order_index`),
  `is_active`     = VALUES(`is_active`),
  `config`        = VALUES(`config`);
