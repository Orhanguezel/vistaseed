-- =============================================================
-- FILE: src/db/seed/sql/177_twitter_schema.sql
-- DESCRIPTION: tweets tablosu (Twitter/X gönderi logu)
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tweets` (
  `id`            CHAR(36)     NOT NULL,
  `content`       TEXT         NOT NULL,
  `status`        VARCHAR(20)  NOT NULL DEFAULT 'sent',
  `source`        VARCHAR(32)  NOT NULL DEFAULT 'manual',
  `x_tweet_id`    VARCHAR(64)  DEFAULT NULL,
  `error_message` TEXT         DEFAULT NULL,
  `created_at`    DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tweets_x_tweet_id` (`x_tweet_id`),
  KEY `idx_tweets_status` (`status`),
  KEY `idx_tweets_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
