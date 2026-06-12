-- =============================================================
-- FILE: src/db/seed/sql/187_google_ads_conversion_settings.sql
-- DESCRIPTION: Google Ads dönüşüm etiketi (frontend gtag — herkese açık değerler)
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'google_ads_tag_id', '*', 'AW-18007572524', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'google_ads_tag_id' AND `locale` = '*'
);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'google_ads_conversion_quote', '*', 'AW-18007572524/UlZ9CO7Glq8cEKyA14pD', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'google_ads_conversion_quote' AND `locale` = '*'
);
