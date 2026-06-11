-- =============================================================
-- FILE: src/db/seed/sql/178_twitter_settings_seed.sql
-- DESCRIPTION: Twitter/X ayar anahtarları (site_settings)
-- NOTE: Kimlik bilgileri admin panelden girilir; seed boş bırakır.
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'twitter_enabled', '*', 'false', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'twitter_enabled' AND `locale` = '*'
);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'twitter_api_key', '*', '', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'twitter_api_key' AND `locale` = '*'
);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'twitter_api_secret', '*', '', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'twitter_api_secret' AND `locale` = '*'
);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'twitter_access_token', '*', '', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'twitter_access_token' AND `locale` = '*'
);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'twitter_access_token_secret', '*', '', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'twitter_access_token_secret' AND `locale` = '*'
);
