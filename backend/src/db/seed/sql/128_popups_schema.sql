-- =============================================================
-- FILE: src/db/seed/sql/128_popups_schema.sql
-- DESCRIPTION: popups + popups_i18n schema
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `popups` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `type` varchar(30) NOT NULL DEFAULT 'topbar',
  `title` varchar(255) NOT NULL,
  `content` text NULL,
  `background_color` varchar(30) NULL,
  `text_color` varchar(30) NULL,
  `button_text` varchar(100) NULL,
  `button_color` varchar(30) NULL,
  `button_hover_color` varchar(30) NULL,
  `button_text_color` varchar(30) NULL,
  `link_url` varchar(500) NULL,
  `link_target` varchar(20) NOT NULL DEFAULT '_self',
  `target_paths` text NULL,
  `image_url` text NULL,
  `image_asset_id` char(36) NULL,
  `alt` varchar(255) NULL,
  `text_behavior` varchar(20) NOT NULL DEFAULT 'marquee',
  `scroll_speed` int unsigned NOT NULL DEFAULT 60,
  `closeable` tinyint unsigned NOT NULL DEFAULT 1,
  `delay_seconds` int unsigned NOT NULL DEFAULT 0,
  `display_frequency` varchar(20) NOT NULL DEFAULT 'always',
  `is_active` tinyint unsigned NOT NULL DEFAULT 1,
  `display_order` int unsigned NOT NULL DEFAULT 0,
  `start_at` datetime(3) NULL,
  `end_at` datetime(3) NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_popup_uuid` (`uuid`),
  KEY `idx_popup_type` (`type`),
  KEY `idx_popup_active` (`is_active`),
  KEY `idx_popup_order` (`display_order`),
  KEY `idx_popup_img_asset` (`image_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `popups_i18n` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `popup_id` int unsigned NOT NULL,
  `locale` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NULL,
  `button_text` varchar(100) NULL,
  `alt` varchar(255) NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_popup_i18n_popup_locale` (`popup_id`, `locale`),
  KEY `idx_popup_i18n_locale` (`locale`),
  KEY `idx_popup_i18n_title` (`title`),
  CONSTRAINT `fk_popup_i18n_popup`
    FOREIGN KEY (`popup_id`) REFERENCES `popups` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
