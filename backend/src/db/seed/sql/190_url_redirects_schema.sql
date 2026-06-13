-- 190_url_redirects_schema.sql
-- Panelden yönetilen URL yönlendirmeleri (301) + kalıcı kaldırma (410).
-- Frontend middleware bu tabloyu okuyup legacy 404'leri SEO uyumlu kapatır.
-- DROP yok, canlıda güvenli uygulanır.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `url_redirects` (
  `id`          CHAR(36)     NOT NULL,
  `source_path` VARCHAR(191) NOT NULL,
  `type`        VARCHAR(8)   NOT NULL DEFAULT '301',
  `destination` VARCHAR(512) DEFAULT NULL,
  `is_active`   TINYINT      NOT NULL DEFAULT 1,
  `hits`        INT          NOT NULL DEFAULT 0,
  `note`        VARCHAR(255) DEFAULT NULL,
  `created_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `url_redirects_source_uq` (`source_path`),
  KEY `url_redirects_active_idx` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
