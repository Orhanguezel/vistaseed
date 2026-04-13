SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payment_attempts` (
  `id`               CHAR(36)     NOT NULL,
  `order_id`         CHAR(36)     NOT NULL,
  `payment_ref`      CHAR(36)     NOT NULL,
  `provider`         VARCHAR(32)  NOT NULL,
  `status`           ENUM('pending','succeeded','failed','expired') NOT NULL DEFAULT 'pending',
  `amount`           DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `request_payload`  LONGTEXT     DEFAULT NULL,
  `response_payload` LONGTEXT     DEFAULT NULL,
  `callback_payload` LONGTEXT     DEFAULT NULL,
  `last_error`       VARCHAR(255) DEFAULT NULL,
  `created_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_attempts_payment_ref_uq` (`payment_ref`),
  KEY `payment_attempts_order_id_idx` (`order_id`),
  KEY `payment_attempts_status_idx` (`status`),
  KEY `payment_attempts_provider_idx` (`provider`),
  KEY `payment_attempts_created_at_idx` (`created_at`),
  CONSTRAINT `fk_payment_attempts_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
