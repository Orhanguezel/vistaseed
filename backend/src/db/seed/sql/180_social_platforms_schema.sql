-- =============================================================
-- FILE: src/db/seed/sql/180_social_platforms_schema.sql
-- DESCRIPTION: Twitter kuyrugunu coklu sosyal platform kaydina genisletir.
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @has_platform := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tweets'
    AND COLUMN_NAME = 'platform'
);
SET @sql := IF(
  @has_platform = 0,
  'ALTER TABLE `tweets` ADD COLUMN `platform` VARCHAR(24) NOT NULL DEFAULT ''twitter'' AFTER `id`',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_external_post_id := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tweets'
    AND COLUMN_NAME = 'external_post_id'
);
SET @sql := IF(
  @has_external_post_id = 0,
  'ALTER TABLE `tweets` ADD COLUMN `external_post_id` VARCHAR(128) NULL AFTER `x_tweet_id`',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_platform_idx := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tweets'
    AND INDEX_NAME = 'idx_tweets_platform_status_sched'
);
SET @sql := IF(
  @has_platform_idx = 0,
  'ALTER TABLE `tweets` ADD INDEX `idx_tweets_platform_status_sched` (`platform`, `status`, `scheduled_at`)',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE `tweets`
SET `platform` = 'twitter'
WHERE `platform` IS NULL OR `platform` = '';

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), k.`key`, '*', '', NOW(), NOW()
FROM (
  SELECT 'facebook_enabled' AS `key`
  UNION ALL SELECT 'facebook_page_id'
  UNION ALL SELECT 'facebook_page_access_token'
  UNION ALL SELECT 'instagram_enabled'
  UNION ALL SELECT 'instagram_business_account_id'
  UNION ALL SELECT 'instagram_access_token'
  UNION ALL SELECT 'linkedin_enabled'
  UNION ALL SELECT 'linkedin_organization_urn'
  UNION ALL SELECT 'linkedin_access_token'
  UNION ALL SELECT 'youtube_enabled'
  UNION ALL SELECT 'youtube_channel_id'
  UNION ALL SELECT 'youtube_access_token'
) k
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings`
  WHERE `key` = k.`key` AND `locale` = '*'
);
