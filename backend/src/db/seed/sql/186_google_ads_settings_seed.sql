-- =============================================================
-- FILE: src/db/seed/sql/186_google_ads_settings_seed.sql
-- DESCRIPTION: Google Ads ayar anahtarları (site_settings)
-- NOTE: Developer token + OAuth bilgileri panelden girilir; seed boş bırakır.
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), k.`key`, '*', IF(k.`key` = 'google_ads_enabled', 'false', ''), NOW(), NOW()
FROM (
  SELECT 'google_ads_enabled' AS `key`
  UNION ALL SELECT 'google_ads_developer_token'
  UNION ALL SELECT 'google_ads_client_id'
  UNION ALL SELECT 'google_ads_client_secret'
  UNION ALL SELECT 'google_ads_refresh_token'
  UNION ALL SELECT 'google_ads_customer_id'
  UNION ALL SELECT 'google_ads_login_customer_id'
) AS k
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` s WHERE s.`key` = k.`key` AND s.`locale` = '*'
);
