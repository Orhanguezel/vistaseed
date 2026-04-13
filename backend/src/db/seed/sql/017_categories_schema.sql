-- =============================================================
-- categories + category_i18n tablolari
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `id`               CHAR(36)      NOT NULL,
  `module_key`       VARCHAR(64)   NOT NULL DEFAULT 'general',
  `image_url`        LONGTEXT      DEFAULT NULL,
  `storage_asset_id` CHAR(36)      DEFAULT NULL,
  `alt`              VARCHAR(255)  DEFAULT NULL,
  `icon`             VARCHAR(255)  DEFAULT NULL,
  `is_active`        TINYINT(1)    NOT NULL DEFAULT 1,
  `is_featured`      TINYINT(1)    NOT NULL DEFAULT 0,
  `display_order`    INT           NOT NULL DEFAULT 0,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `categories_active_idx`        (`is_active`),
  KEY `categories_order_idx`         (`display_order`),
  KEY `categories_storage_asset_idx` (`storage_asset_id`),
  KEY `categories_module_idx`        (`module_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `category_i18n` (
  `category_id`      CHAR(36)      NOT NULL,
  `locale`           VARCHAR(8)    NOT NULL DEFAULT 'tr',
  `name`             VARCHAR(255)  NOT NULL,
  `slug`             VARCHAR(255)  NOT NULL,
  `description`      TEXT          DEFAULT NULL,
  `alt`              VARCHAR(255)  DEFAULT NULL,
  `meta_title`       VARCHAR(255)  DEFAULT NULL,
  `meta_description` VARCHAR(500)  DEFAULT NULL,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`category_id`, `locale`),
  UNIQUE KEY `category_i18n_slug_locale_uq` (`slug`, `locale`),
  KEY `category_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_category_i18n_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Genel kurumsal kategoriler (seed)
INSERT IGNORE INTO `categories` (`id`, `module_key`, `icon`, `is_active`, `is_featured`, `display_order`)
VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'product', 'package',  1, 1, 1),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'product', 'settings', 1, 1, 2),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'product', 'star',     1, 1, 3),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'product', 'layers',   1, 0, 4);

INSERT IGNORE INTO `category_i18n` (
  `category_id`,
  `locale`,
  `name`,
  `slug`,
  `description`,
  `alt`,
  `meta_title`,
  `meta_description`
)
VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'tr', 'Sebze Tohumları', 'sebze-tohumlari', 'vistaseeds sebze tohumu kategorileri.', 'Sebze tohumları kategori görseli', 'Sebze Tohumları | vistaseeds', 'vistaseeds sebze tohumu kategorilerini inceleyin.'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'tr', 'Biber Çeşitleri', 'biber-cesitleri', 'vistaseeds biber tohumu ve çeşit grupları.', 'Biber çeşitleri kategori görseli', 'Biber Çeşitleri | vistaseeds', 'vistaseeds biber çeşitleri ve tohum grupları.'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'tr', 'Öne Çıkan Tohumlar', 'one-cikan-tohumlar', 'Öne çıkan tohum çeşitleri ve sezonluk seçimler.', 'Öne çıkan tohumlar kategori görseli', 'Öne Çıkan Tohumlar | vistaseeds', 'vistaseeds öne çıkan tohum çeşitlerini keşfedin.'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'tr', 'Diğer Çeşitler', 'diger-cesitler', 'Diğer tohum ve ürün kategorileri.', 'Diğer çeşitler kategori görseli', 'Diğer Çeşitler | vistaseeds', 'vistaseeds diğer tohum ve ürün kategorileri.'),
  -- EN
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'en', 'Vegetable Seeds', 'vegetable-seeds', 'vistaseeds vegetable seed categories.', 'Vegetable seeds category image', 'Vegetable Seeds | vistaseeds', 'Explore vistaseeds vegetable seed categories.'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'en', 'Pepper Varieties', 'pepper-varieties', 'vistaseeds pepper seed and variety groups.', 'Pepper varieties category image', 'Pepper Varieties | vistaseeds', 'Discover vistaseeds pepper varieties and seed groups.'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'en', 'Featured Seeds', 'featured-seeds', 'Featured seed varieties and seasonal selections.', 'Featured seeds category image', 'Featured Seeds | vistaseeds', 'Browse vistaseeds featured seed varieties.'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'en', 'Other Varieties', 'other-varieties', 'Other seed and product categories.', 'Other varieties category image', 'Other Varieties | vistaseeds', 'Browse other seed and product categories from vistaseeds.');
