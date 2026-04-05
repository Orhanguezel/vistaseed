SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @has_images := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'custom_pages'
    AND COLUMN_NAME = 'images'
);

SET @sql_images := IF(
  @has_images = 0,
  'ALTER TABLE `custom_pages` ADD COLUMN `images` JSON DEFAULT (JSON_ARRAY()) AFTER `storage_asset_id`',
  'SELECT 1'
);
PREPARE stmt_images FROM @sql_images;
EXECUTE stmt_images;
DEALLOCATE PREPARE stmt_images;

SET @has_storage_image_ids := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'custom_pages'
    AND COLUMN_NAME = 'storage_image_ids'
);

SET @sql_storage_image_ids := IF(
  @has_storage_image_ids = 0,
  'ALTER TABLE `custom_pages` ADD COLUMN `storage_image_ids` JSON DEFAULT (JSON_ARRAY()) AFTER `images`',
  'SELECT 1'
);
PREPARE stmt_storage_image_ids FROM @sql_storage_image_ids;
EXECUTE stmt_storage_image_ids;
DEALLOCATE PREPARE stmt_storage_image_ids;

UPDATE `custom_pages`
SET
  `images` = COALESCE(`images`, JSON_ARRAY()),
  `storage_image_ids` = COALESCE(`storage_image_ids`, JSON_ARRAY())
WHERE `images` IS NULL OR `storage_image_ids` IS NULL;
