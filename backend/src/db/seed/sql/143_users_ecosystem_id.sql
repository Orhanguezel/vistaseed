-- 143: users.ecosystem_id — ekosistem genelinde ortak kullanıcı kimliği (SSO / çoklu platform)
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @has_eco := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'ecosystem_id'
);

SET @sql_eco := IF(
  @has_eco = 0,
  'ALTER TABLE `users` ADD COLUMN `ecosystem_id` CHAR(36) NULL DEFAULT NULL AFTER `id`',
  'SELECT 1'
);
PREPARE stmt_eco FROM @sql_eco;
EXECUTE stmt_eco;
DEALLOCATE PREPARE stmt_eco;

SET @has_idx := (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND INDEX_NAME = 'users_ecosystem_id_idx'
);

SET @sql_idx := IF(
  @has_idx = 0,
  'ALTER TABLE `users` ADD INDEX `users_ecosystem_id_idx` (`ecosystem_id`)',
  'SELECT 1'
);
PREPARE stmt_idx FROM @sql_idx;
EXECUTE stmt_idx;
DEALLOCATE PREPARE stmt_idx;
