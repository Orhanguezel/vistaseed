-- =============================================================
-- 122: Reviews (genel degerlendirme sistemi — coklu hedef)
-- =============================================================

CREATE TABLE IF NOT EXISTS `reviews` (
  `id`               CHAR(36) NOT NULL,
  `target_type`      VARCHAR(50) NOT NULL,
  `target_id`        CHAR(36) NOT NULL,
  `name`             VARCHAR(255) NOT NULL,
  `email`            VARCHAR(255) NOT NULL,
  `rating`           TINYINT NOT NULL,
  `is_active`        TINYINT NOT NULL DEFAULT 1,
  `is_approved`      TINYINT NOT NULL DEFAULT 0,
  `display_order`    INT NOT NULL DEFAULT 0,
  `likes_count`      INT NOT NULL DEFAULT 0,
  `dislikes_count`   INT NOT NULL DEFAULT 0,
  `helpful_count`    INT NOT NULL DEFAULT 0,
  `submitted_locale` VARCHAR(8) NOT NULL DEFAULT 'tr',
  `created_at`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `reviews_target_idx` (`target_type`, `target_id`),
  INDEX `reviews_rating_idx` (`rating`),
  INDEX `reviews_approved_active_idx` (`is_approved`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `review_i18n` (
  `id`            CHAR(36) NOT NULL,
  `review_id`     CHAR(36) NOT NULL,
  `locale`        VARCHAR(8) NOT NULL,
  `title`         VARCHAR(255) DEFAULT NULL,
  `comment`       TEXT NOT NULL,
  `admin_reply`   TEXT DEFAULT NULL,
  `created_at`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `review_i18n_review_locale_uniq` (`review_id`, `locale`),
  CONSTRAINT `fk_review_i18n_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
