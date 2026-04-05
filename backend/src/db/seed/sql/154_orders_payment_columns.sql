SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Siparis odeme (Shopo benzeri: Iyzico + havale / kredi genislemesi)
ALTER TABLE orders
  ADD COLUMN payment_method VARCHAR(32) NULL DEFAULT NULL COMMENT 'iyzico, bank_transfer, credit, ...' AFTER notes,
  ADD COLUMN payment_status ENUM('unpaid','pending','paid','failed') NOT NULL DEFAULT 'unpaid' AFTER payment_method,
  ADD COLUMN payment_ref CHAR(36) NULL DEFAULT NULL COMMENT 'Iyzico conversationId / harici referans' AFTER payment_status,
  ADD KEY orders_payment_ref_idx (payment_ref);
