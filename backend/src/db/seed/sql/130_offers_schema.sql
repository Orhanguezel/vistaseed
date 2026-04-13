SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS `offers` (
  `id` CHAR(36) NOT NULL,
  `offer_no` VARCHAR(100) NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'new',
  `source` VARCHAR(64) NOT NULL DEFAULT 'vistaseeds',
  `locale` VARCHAR(10) NULL,
  `country_code` VARCHAR(80) NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `company_name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `subject` VARCHAR(255) NULL,
  `message` LONGTEXT NULL,
  `product_id` CHAR(36) NULL,
  `service_id` CHAR(36) NULL,
  `form_data` LONGTEXT NULL,
  `consent_marketing` TINYINT NOT NULL DEFAULT 0,
  `consent_terms` TINYINT NOT NULL DEFAULT 0,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'EUR',
  `net_total` DECIMAL(12,2) NULL,
  `vat_rate` DECIMAL(5,2) NULL,
  `vat_total` DECIMAL(12,2) NULL,
  `shipping_total` DECIMAL(12,2) NULL,
  `gross_total` DECIMAL(12,2) NULL,
  `valid_until` DATETIME(3) NULL,
  `admin_notes` LONGTEXT NULL,
  `pdf_url` VARCHAR(500) NULL,
  `pdf_asset_id` CHAR(36) NULL,
  `email_sent_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `offers_status_created_idx` (`status`, `created_at`),
  KEY `offers_email_idx` (`email`),
  KEY `offers_product_idx` (`product_id`),
  KEY `offers_offer_no_idx` (`offer_no`),
  KEY `offers_locale_idx` (`locale`),
  KEY `offers_country_idx` (`country_code`),
  KEY `offers_source_idx` (`source`),
  CONSTRAINT `fk_offers_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `offer_number_counters` (
  `year` INT NOT NULL,
  `last_seq` INT NOT NULL,
  `prefix` VARCHAR(20) NOT NULL DEFAULT 'VS',
  PRIMARY KEY (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
