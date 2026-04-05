-- =============================================================
-- Fake Bayi (Dealer) Test Hesapları
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1) Agripol Tarım A.Ş. (Antalya)
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  is_active, email_verified, created_at, updated_at
) VALUES (
  'deal-fake-ant-0000-000000000002',
  'antalya@fakebayi.com',
  '{{DEALER_PASSWORD_HASH}}',
  'Agripol Tarım A.Ş.',
  '02425550011',
  1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  updated_at = CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at, city, country)
VALUES (
  'deal-fake-ant-0000-000000000002',
  'Agripol Tarım A.Ş.',
  '02425550011',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3),
  'Antalya', 'Türkiye'
)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  updated_at = CURRENT_TIMESTAMP(3);

INSERT IGNORE INTO user_roles (id, user_id, role, created_at)
VALUES (UUID(), 'deal-fake-ant-0000-000000000002', 'dealer', CURRENT_TIMESTAMP(3));

INSERT INTO dealer_profiles (
  id, user_id, company_name, city, region, latitude, longitude, 
  tax_number, tax_office, is_approved, list_public, created_at, updated_at
) VALUES (
  'dpd-fake-ant-0000-000000000002', 'deal-fake-ant-0000-000000000002', 'Agripol Tarım A.Ş.', 'Antalya', 'Akdeniz', 36.8969, 30.7133,
  '1234567890', 'Muratpaşa V.D.', 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  company_name = VALUES(company_name),
  city = VALUES(city),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  is_approved = 1,
  list_public = 1,
  updated_at = CURRENT_TIMESTAMP(3);

-- 2) Güneş Tohumculuk (Adana)
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  is_active, email_verified, created_at, updated_at
) VALUES (
  'deal-fake-ada-0000-000000000003',
  'adana@fakebayi.com',
  '{{DEALER_PASSWORD_HASH}}',
  'Güneş Tohumculuk Ltd. Şti.',
  '03225550022',
  1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  updated_at = CURRENT_TIMESTAMP(3);

INSERT INTO profiles (id, full_name, phone, created_at, updated_at, city, country)
VALUES (
  'deal-fake-ada-0000-000000000003',
  'Güneş Tohumculuk Ltd. Şti.',
  '03225550022',
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3),
  'Adana', 'Türkiye'
)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  updated_at = CURRENT_TIMESTAMP(3);

INSERT IGNORE INTO user_roles (id, user_id, role, created_at)
VALUES (UUID(), 'deal-fake-ada-0000-000000000003', 'dealer', CURRENT_TIMESTAMP(3));

INSERT INTO dealer_profiles (
  id, user_id, company_name, city, region, latitude, longitude, 
  tax_number, tax_office, is_approved, list_public, created_at, updated_at
) VALUES (
  'dpd-fake-ada-0000-000000000003', 'deal-fake-ada-0000-000000000003', 'Güneş Tohumculuk Ltd. Şti.', 'Adana', 'Akdeniz', 37.0000, 35.3213,
  '9876543210', 'Seyhan V.D.', 1, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  company_name = VALUES(company_name),
  city = VALUES(city),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  is_approved = 1,
  list_public = 1,
  updated_at = CURRENT_TIMESTAMP(3);
