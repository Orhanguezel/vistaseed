-- 157: dealer_profiles.risk_limit — Drizzle schema ile MySQL uyumu (bayi finans)
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @has_risk := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'dealer_profiles'
    AND COLUMN_NAME = 'risk_limit'
);

SET @sql_risk := IF(
  @has_risk = 0,
  'ALTER TABLE `dealer_profiles` ADD COLUMN `risk_limit` DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER `credit_limit`',
  'SELECT 1'
);
PREPARE stmt_risk FROM @sql_risk;
EXECUTE stmt_risk;
DEALLOCATE PREPARE stmt_risk;
