-- =============================================================
-- Bayi (Dealer) ve Üye (Customer) Test Hesapları
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Role ENUM güncelleme (güvenlik için)
ALTER TABLE user_roles MODIFY COLUMN role ENUM('admin','editor','carrier','customer','dealer') NOT NULL DEFAULT 'customer';

-- 1) BAYİ KAYDI — şifre: DEALER_PASSWORD (varsayılan admin123), bkz. CALISTIRMA.md
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  is_active, email_verified, created_at, updated_at
) VALUES (
  'deal-0000-0000-0000-000000000001',
  'bayi@example.com',
  '{{DEALER_PASSWORD_HASH}}',
  'Vista Tarım Bayisi',
  '05551112233',
  1, 1,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  password_hash  = VALUES(password_hash),
  full_name      = VALUES(full_name),
  updated_at     = CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at, city, country)
VALUES (
  'deal-0000-0000-0000-000000000001',
  'Vista Tarım Bayisi',
  '05551112233',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3),
  'Konya', 'Türkiye'
)
ON DUPLICATE KEY UPDATE
  full_name  = VALUES(full_name),
  updated_at = CURRENT_TIMESTAMP(3);

INSERT IGNORE INTO user_roles (id, user_id, role, created_at)
VALUES (UUID(), 'deal-0000-0000-0000-000000000001', 'dealer', CURRENT_TIMESTAMP(3));


-- 2) ÜYE KAYDI (uye@example.com / editor123)
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  is_active, email_verified, created_at, updated_at
) VALUES (
  'user-0000-0000-0000-000000000001',
  'uye@example.com',
  '{{EDITOR_PASSWORD_HASH}}',
  'Ahmet Çiftçi',
  '05559998877',
  1, 1,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  password_hash  = VALUES(password_hash),
  full_name      = VALUES(full_name),
  updated_at     = CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at, city, country)
VALUES (
  'user-0000-0000-0000-000000000001',
  'Ahmet Çiftçi',
  '05559998877',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3),
  'Aksaray', 'Türkiye'
)
ON DUPLICATE KEY UPDATE
  full_name  = VALUES(full_name),
  updated_at = CURRENT_TIMESTAMP(3);

INSERT IGNORE INTO user_roles (id, user_id, role, created_at)
VALUES (UUID(), 'user-0000-0000-0000-000000000001', 'customer', CURRENT_TIMESTAMP(3));
