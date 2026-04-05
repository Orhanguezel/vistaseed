-- =============================================================
-- Library Module Schema
-- Creates library, library_i18n, library_images, library_files
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1. Library Parent
CREATE TABLE IF NOT EXISTS `library` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `type` VARCHAR(32) NOT NULL DEFAULT 'other',
  `category_id` CHAR(36),
  `sub_category_id` CHAR(36),
  `featured` TINYINT NOT NULL DEFAULT 0,
  `is_published` TINYINT NOT NULL DEFAULT 0,
  `is_active` TINYINT NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `featured_image` VARCHAR(500),
  `image_url` VARCHAR(500),
  `image_asset_id` CHAR(36),
  `views` INT NOT NULL DEFAULT 0,
  `download_count` INT NOT NULL DEFAULT 0,
  `published_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `library_active_idx` (`is_active`),
  INDEX `library_published_idx` (`is_published`),
  INDEX `library_type_idx` (`type`),
  INDEX `library_featured_idx` (`featured`),
  INDEX `library_category_idx` (`category_id`),
  INDEX `library_order_idx` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Library I18n
CREATE TABLE IF NOT EXISTS `library_i18n` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `library_id` CHAR(36) NOT NULL,
  `locale` VARCHAR(10) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` LONGTEXT,
  `summary` LONGTEXT,
  `image_alt` VARCHAR(255),
  `tags` VARCHAR(255),
  `meta_title` VARCHAR(255),
  `meta_description` VARCHAR(500),
  `meta_keywords` VARCHAR(255),
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `ux_library_i18n_unique` (`library_id`, `locale`),
  UNIQUE INDEX `ux_library_locale_slug` (`locale`, `slug`),
  INDEX `library_i18n_name_idx` (`name`),
  CONSTRAINT `fk_library_i18n_parent` FOREIGN KEY (`library_id`) REFERENCES `library` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Library Images (Gallery)
CREATE TABLE IF NOT EXISTS `library_images` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `library_id` CHAR(36) NOT NULL,
  `image_asset_id` CHAR(36),
  `image_url` VARCHAR(500),
  `is_active` TINYINT NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_library_images_parent` FOREIGN KEY (`library_id`) REFERENCES `library` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Library Images I18n
CREATE TABLE IF NOT EXISTS `library_images_i18n` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `image_id` CHAR(36) NOT NULL,
  `locale` VARCHAR(10) NOT NULL,
  `title` VARCHAR(200) DEFAULT NULL,
  `alt` VARCHAR(255) DEFAULT NULL,
  `caption` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY `ux_library_images_i18n_parent_locale` (`image_id`, `locale`),
  INDEX `library_images_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_library_images_i18n_parent` FOREIGN KEY (`image_id`) REFERENCES `library_images` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Library Files (PDF, etc)
CREATE TABLE IF NOT EXISTS `library_files` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `library_id` CHAR(36) NOT NULL,
  `asset_id` CHAR(36),
  `file_url` VARCHAR(500),
  `name` VARCHAR(255) NOT NULL,
  `size_bytes` INT,
  `mime_type` VARCHAR(255),
  `tags_json` TEXT,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT NOT NULL DEFAULT 1,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_library_files_parent` FOREIGN KEY (`library_id`) REFERENCES `library` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
