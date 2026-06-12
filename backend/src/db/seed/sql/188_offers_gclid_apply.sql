-- 188_offers_gclid_apply.sql
-- offers tablosuna Google Ads offline dönüşüm kolonlarını idempotent ekler.
-- Canlıda `mysql ... < 188_offers_gclid_apply.sql` ile uygulanır (DROP yok, veri korunur).
SET NAMES utf8mb4;

SET @col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'offers' AND COLUMN_NAME = 'gclid');
SET @sql := IF(@col = 0,
  'ALTER TABLE `offers` ADD COLUMN `gclid` VARCHAR(255) NULL AFTER `email_sent_at`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'offers' AND COLUMN_NAME = 'gclid_source');
SET @sql := IF(@col = 0,
  'ALTER TABLE `offers` ADD COLUMN `gclid_source` VARCHAR(20) NULL AFTER `gclid`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'offers' AND COLUMN_NAME = 'gads_uploaded_at');
SET @sql := IF(@col = 0,
  'ALTER TABLE `offers` ADD COLUMN `gads_uploaded_at` DATETIME(3) NULL AFTER `gclid_source`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'offers' AND INDEX_NAME = 'offers_gclid_pending_idx');
SET @sql := IF(@idx = 0,
  'ALTER TABLE `offers` ADD KEY `offers_gclid_pending_idx` (`gads_uploaded_at`, `gclid`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
