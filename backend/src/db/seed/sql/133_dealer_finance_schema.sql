SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dealer_profiles (
  id              CHAR(36)        NOT NULL,
  user_id         CHAR(36)        NOT NULL,
  company_name    VARCHAR(255)    DEFAULT NULL,
  logo_url        VARCHAR(1024)   DEFAULT NULL,
  city            VARCHAR(128)    DEFAULT NULL,
  region          VARCHAR(128)    DEFAULT NULL,
  latitude        DECIMAL(10, 7)  DEFAULT NULL,
  longitude       DECIMAL(10, 7)  DEFAULT NULL,
  tax_number      VARCHAR(50)     DEFAULT NULL,
  tax_office      VARCHAR(255)    DEFAULT NULL,
  credit_limit    DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  risk_limit      DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  current_balance DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  discount_rate   DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
  ecosystem_id    VARCHAR(128)    DEFAULT NULL,
  is_approved     TINYINT(1)      NOT NULL DEFAULT 0,
  list_public     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at      DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at      DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY dealer_profiles_user_id_unique (user_id),
  KEY dealer_profiles_is_approved_idx (is_approved),
  KEY dealer_profiles_city_idx (city),
  KEY dealer_profiles_region_idx (region),
  KEY dealer_profiles_list_public_idx (list_public),
  CONSTRAINT fk_dealer_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dealer_transactions (
  id             CHAR(36)       NOT NULL,
  dealer_id      CHAR(36)       NOT NULL,
  order_id       CHAR(36)       DEFAULT NULL,
  type           ENUM('order','payment','adjustment','refund') NOT NULL,
  amount         DECIMAL(12,2)  NOT NULL,
  balance_after  DECIMAL(12,2)  NOT NULL,
  description    VARCHAR(500)   DEFAULT NULL,
  due_date       DATETIME(3)    DEFAULT NULL,
  created_at     DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  created_by     CHAR(36)       DEFAULT NULL,
  PRIMARY KEY (id),
  KEY dealer_tx_dealer_id_idx (dealer_id),
  KEY dealer_tx_type_idx (type),
  KEY dealer_tx_created_at_idx (created_at),
  KEY dealer_tx_order_id_idx (order_id),
  KEY dealer_tx_due_date_idx (due_date),
  CONSTRAINT fk_dealer_tx_dealer FOREIGN KEY (dealer_id) REFERENCES dealer_profiles (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed: Test dealer profile for bayi@example.com
INSERT INTO dealer_profiles (id, user_id, company_name, city, region, latitude, longitude, tax_number, tax_office, credit_limit, current_balance, discount_rate, is_approved, list_public, created_at, updated_at)
SELECT UUID(), u.id, 'Test Bayi Ltd.', 'Ankara', 'Ic Anadolu', 39.9334000, 32.8597000, '1234567890', 'Ankara VD', 50000.00, 0.00, 10.00, 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM users u WHERE u.email = 'bayi@example.com'
ON DUPLICATE KEY UPDATE company_name = VALUES(company_name);
