-- =============================================================
-- job_applications tablosu
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_applications` (
  `id`              CHAR(36)       NOT NULL,
  `job_listing_id`  CHAR(36)       NOT NULL,
  `full_name`       VARCHAR(255)   NOT NULL,
  `email`           VARCHAR(255)   NOT NULL,
  `phone`           VARCHAR(64)    DEFAULT NULL,
  `cover_letter`    TEXT           DEFAULT NULL,
  `cv_url`          VARCHAR(512)   DEFAULT NULL,
  `cv_asset_id`     CHAR(36)       DEFAULT NULL,
  `status`          VARCHAR(32)    NOT NULL DEFAULT 'pending',
  `admin_note`      VARCHAR(2000)  DEFAULT NULL,
  `created_at`      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `job_applications_listing_idx` (`job_listing_id`),
  KEY `job_applications_status_idx` (`status`),
  KEY `job_applications_email_idx` (`email`),
  KEY `job_applications_created_idx` (`created_at`),
  CONSTRAINT `fk_job_applications_job_listing`
    FOREIGN KEY (`job_listing_id`) REFERENCES `job_listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `job_applications` (
  `id`,
  `job_listing_id`,
  `full_name`,
  `email`,
  `phone`,
  `cover_letter`,
  `cv_url`,
  `status`,
  `admin_note`
)
VALUES
  (
    '88888888-8888-4888-8888-888888888881',
    '77777777-7777-4777-8777-777777777771',
    'Ahmet Yılmaz',
    'ahmet.yilmaz@example.com',
    '+90 555 111 2233',
    'Üretim planlama, saha operasyonları ve kalite sistemleri alanında deneyimliyim. VistaSeed ekibine operasyonel disiplin ve süreç iyileştirme katkısı sunabileceğime inanıyorum.',
    '/uploads/support/library/support-library-guide.txt',
    'pending',
    NULL
  ),
  (
    '88888888-8888-4888-8888-888888888882',
    '77777777-7777-4777-8777-777777777772',
    'Emily Carter',
    'emily.carter@example.com',
    '+1 202 555 0166',
    'I have managed regional dealer networks and seasonal campaign execution for agricultural products. I would like to contribute to your sales growth strategy.',
    '/uploads/support/library/support-library-guide.txt',
    'reviewed',
    'Initial screening completed, waiting for interview scheduling.'
  );
