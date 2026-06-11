-- FILE: src/db/seed/sql/179_twitter_media_queue.sql
-- Twitter kuyruk görselleri: tweets.media_url + storage asset kayıtları.

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @twitter_media_col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tweets'
    AND COLUMN_NAME = 'media_url'
);
SET @twitter_media_sql := IF(
  @twitter_media_col_exists = 0,
  'ALTER TABLE `tweets` ADD COLUMN `media_url` TEXT NULL AFTER `template`',
  'SELECT 1'
);
PREPARE twitter_media_stmt FROM @twitter_media_sql;
EXECUTE twitter_media_stmt;
DEALLOCATE PREPARE twitter_media_stmt;

INSERT INTO `storage_assets`
  (`id`,`name`,`bucket`,`path`,`folder`,`mime`,`size`,`width`,`height`,`url`,`provider`,`provider_public_id`,`provider_resource_type`,`provider_format`)
VALUES
  ('17909400-0000-4000-8000-000000000001','birlik-f1-twitter.jpg','default','twitter/vistaseeds/birlik-f1-twitter.jpg','twitter/vistaseeds','image/jpeg',325547,1600,900,'/uploads/twitter/vistaseeds/birlik-f1-twitter.jpg','local','twitter/vistaseeds/birlik-f1-twitter.jpg','image','jpg'),
  ('17909400-0000-4000-8000-000000000002','cankan-f1-twitter.jpg','default','twitter/vistaseeds/cankan-f1-twitter.jpg','twitter/vistaseeds','image/jpeg',209418,1600,900,'/uploads/twitter/vistaseeds/cankan-f1-twitter.jpg','local','twitter/vistaseeds/cankan-f1-twitter.jpg','image','jpg'),
  ('17909400-0000-4000-8000-000000000003','kizgin-f1-twitter.jpg','default','twitter/vistaseeds/kizgin-f1-twitter.jpg','twitter/vistaseeds','image/jpeg',208165,1600,900,'/uploads/twitter/vistaseeds/kizgin-f1-twitter.jpg','local','twitter/vistaseeds/kizgin-f1-twitter.jpg','image','jpg'),
  ('17909400-0000-4000-8000-000000000004','lucky-f1-twitter.jpg','default','twitter/vistaseeds/lucky-f1-twitter.jpg','twitter/vistaseeds','image/jpeg',199009,1600,900,'/uploads/twitter/vistaseeds/lucky-f1-twitter.jpg','local','twitter/vistaseeds/lucky-f1-twitter.jpg','image','jpg'),
  ('17909400-0000-4000-8000-000000000005','saray-f1-twitter.jpg','default','twitter/vistaseeds/saray-f1-twitter.jpg','twitter/vistaseeds','image/jpeg',203268,1600,900,'/uploads/twitter/vistaseeds/saray-f1-twitter.jpg','local','twitter/vistaseeds/saray-f1-twitter.jpg','image','jpg'),
  ('17909400-0000-4000-8000-000000000006','tirpan-f1-twitter.jpg','default','twitter/vistaseeds/tirpan-f1-twitter.jpg','twitter/vistaseeds','image/jpeg',193671,1600,900,'/uploads/twitter/vistaseeds/tirpan-f1-twitter.jpg','local','twitter/vistaseeds/tirpan-f1-twitter.jpg','image','jpg')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `path` = VALUES(`path`),
  `folder` = VALUES(`folder`),
  `mime` = VALUES(`mime`),
  `size` = VALUES(`size`),
  `width` = VALUES(`width`),
  `height` = VALUES(`height`),
  `url` = VALUES(`url`),
  `provider` = VALUES(`provider`),
  `provider_public_id` = VALUES(`provider_public_id`),
  `provider_resource_type` = VALUES(`provider_resource_type`),
  `provider_format` = VALUES(`provider_format`);
