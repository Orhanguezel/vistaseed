-- 158: dealer_profiles.ecosystem_id — Drizzle schema ile MySQL uyumu
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @has_eco := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'dealer_profiles'
    AND COLUMN_NAME = 'ecosystem_id'
);

SET @sql_eco := IF(
  @has_eco = 0,
  'ALTER TABLE `dealer_profiles` ADD COLUMN `ecosystem_id` VARCHAR(128) NULL DEFAULT NULL AFTER `discount_rate`',
  'SELECT 1'
);
PREPARE stmt_eco FROM @sql_eco;
EXECUTE stmt_eco;
DEALLOCATE PREPARE stmt_eco;
