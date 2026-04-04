-- ============================================================================
-- Editor (normal user) test hesabi
-- Placeholder'lar seed runner tarafindan enjekte edilir:
--   {{EDITOR_ID}}, {{EDITOR_EMAIL}}, {{EDITOR_PASSWORD_HASH}}
-- ============================================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1) Kullanici kaydi
INSERT INTO users (
  id, email, password_hash, full_name, phone,
  is_active, email_verified, created_at, updated_at
) VALUES (
  '{{EDITOR_ID}}',
  '{{EDITOR_EMAIL}}',
  '{{EDITOR_PASSWORD_HASH}}',
  'Test Editor',
  NULL,
  1, 1,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  password_hash  = VALUES(password_hash),
  full_name      = VALUES(full_name),
  is_active      = 1,
  email_verified = 1,
  updated_at     = CURRENT_TIMESTAMP(3);

-- 2) Profil kaydi
INSERT INTO profiles (id, full_name, phone, created_at, updated_at)
VALUES (
  '{{EDITOR_ID}}',
  'Test Editor',
  NULL,
  CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  full_name  = VALUES(full_name),
  updated_at = CURRENT_TIMESTAMP(3);

-- 3) Editor rolu
INSERT IGNORE INTO user_roles (id, user_id, role, created_at)
SELECT UUID(), u.id, 'editor', CURRENT_TIMESTAMP(3)
FROM users u
WHERE u.email = '{{EDITOR_EMAIL}}'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = u.id AND ur.role = 'editor'
  );
