SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id           CHAR(36)       NOT NULL,
  dealer_id    CHAR(36)       NOT NULL,
  status       ENUM('pending','confirmed','shipped','completed','cancelled') NOT NULL DEFAULT 'pending',
  total        DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
  notes        TEXT           DEFAULT NULL,
  created_at   DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at   DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY orders_dealer_id_idx (dealer_id),
  KEY orders_status_idx (status),
  KEY orders_created_at_idx (created_at),
  CONSTRAINT fk_orders_dealer FOREIGN KEY (dealer_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id           CHAR(36)       NOT NULL,
  order_id     CHAR(36)       NOT NULL,
  product_id   CHAR(36)       NOT NULL,
  quantity     INT            NOT NULL DEFAULT 1,
  unit_price   DECIMAL(10,2)  NOT NULL,
  total_price  DECIMAL(12,2)  NOT NULL,
  created_at   DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY order_items_order_id_idx (order_id),
  KEY order_items_product_id_idx (product_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
