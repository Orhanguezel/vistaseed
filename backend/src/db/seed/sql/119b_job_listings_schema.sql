-- =============================================================
-- job_listings + job_listings_i18n tabloları
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_listings` (
  `id`              CHAR(36)      NOT NULL,
  `department`      VARCHAR(128)  DEFAULT NULL,
  `location`        VARCHAR(255)  DEFAULT NULL,
  `employment_type` VARCHAR(64)   DEFAULT 'full_time',
  `is_active`       TINYINT(1)    NOT NULL DEFAULT 1,
  `display_order`   INT           NOT NULL DEFAULT 0,
  `created_at`      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `job_listings_active_idx` (`is_active`),
  KEY `job_listings_order_idx` (`display_order`),
  KEY `job_listings_department_idx` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_listings_i18n` (
  `job_listing_id`   CHAR(36)      NOT NULL,
  `locale`           VARCHAR(8)    NOT NULL DEFAULT 'tr',
  `title`            VARCHAR(255)  NOT NULL,
  `slug`             VARCHAR(255)  NOT NULL,
  `description`      TEXT          DEFAULT NULL,
  `requirements`     TEXT          DEFAULT NULL,
  `meta_title`       VARCHAR(255)  DEFAULT NULL,
  `meta_description` VARCHAR(500)  DEFAULT NULL,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`job_listing_id`, `locale`),
  UNIQUE KEY `job_listings_i18n_slug_locale_uq` (`slug`, `locale`),
  KEY `job_listings_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_job_listings_i18n_job_listing`
    FOREIGN KEY (`job_listing_id`) REFERENCES `job_listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Örnek iş ilanları
INSERT IGNORE INTO `job_listings` (`id`, `department`, `location`, `employment_type`, `is_active`, `display_order`)
VALUES
  ('77777777-7777-4777-8777-777777777771', 'Üretim', 'Ankara', 'full_time', 1, 1),
  ('77777777-7777-4777-8777-777777777772', 'Satış', 'İstanbul', 'full_time', 1, 2);

INSERT IGNORE INTO `job_listings_i18n` (`job_listing_id`, `locale`, `title`, `slug`, `description`, `requirements`, `meta_title`, `meta_description`)
VALUES
  ('77777777-7777-4777-8777-777777777771', 'tr', 'Üretim Mühendisi', 'uretim-muhendisi', 'Tohum üretim süreçlerini planlayacak, saha operasyonları ile fabrika koordinasyonunu yönetecek ekip arkadaşı arıyoruz.', 'Ziraat veya ilgili mühendislik bölümlerinden mezun, üretim planlama ve kalite süreçlerinde deneyimli.', 'Üretim Mühendisi İş İlanı', 'Üretim operasyonları ve kalite süreçlerini yönetecek üretim mühendisi pozisyonu.'),
  ('77777777-7777-4777-8777-777777777772', 'tr', 'Satış Uzmanı', 'satis-uzmani', 'Bayi ağımızı ve kurumsal müşteri ilişkilerini yönetecek, sezon hedeflerine katkıda bulunacak satış uzmanı arıyoruz.', 'Tarım veya FMCG satışında deneyimli, iletişim becerileri güçlü, saha ziyaretlerine açık.', 'Satış Uzmanı İş İlanı', 'Tohum ve tarım ürünleri satış süreçlerinde görev alacak satış uzmanı pozisyonu.'),
  ('77777777-7777-4777-8777-777777777771', 'en', 'Production Engineer', 'production-engineer', 'We are looking for a teammate who will coordinate seed production operations, planning, and field-to-facility workflows.', 'Degree in agriculture or a related engineering field, with experience in production planning and quality processes.', 'Production Engineer Job Opening', 'Production engineer role responsible for seed production planning and operational quality.'),
  ('77777777-7777-4777-8777-777777777772', 'en', 'Sales Specialist', 'sales-specialist', 'We are hiring a sales specialist to manage dealer relationships, support corporate accounts, and contribute to seasonal growth targets.', 'Experience in agricultural or FMCG sales, strong communication skills, and willingness to travel for field visits.', 'Sales Specialist Job Opening', 'Sales specialist role focused on dealer network management and agricultural product sales.');
