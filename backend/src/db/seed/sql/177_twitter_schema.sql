-- =============================================================
-- FILE: src/db/seed/sql/177_twitter_schema.sql
-- DESCRIPTION: tweets tablosu (Twitter/X kuyruk + gönderi logu)
-- status: queued | posting | sent | failed | canceled
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tweets` (
  `id`            CHAR(36)     NOT NULL,
  `content`       TEXT         NOT NULL,
  `status`        VARCHAR(20)  NOT NULL DEFAULT 'sent',
  `source`        VARCHAR(32)  NOT NULL DEFAULT 'manual',
  `template`      VARCHAR(50)  DEFAULT NULL,
  `source_ref`    VARCHAR(190) DEFAULT NULL,
  `scheduled_at`  DATETIME     DEFAULT NULL,
  `posted_at`     DATETIME     DEFAULT NULL,
  `retry_count`   INT          NOT NULL DEFAULT 0,
  `locked_at`     DATETIME     DEFAULT NULL,
  `x_tweet_id`    VARCHAR(64)  DEFAULT NULL,
  `error_message` TEXT         DEFAULT NULL,
  `created_at`    DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tweets_x_tweet_id` (`x_tweet_id`),
  UNIQUE KEY `uq_tweets_source_ref` (`source_ref`),
  KEY `idx_tweets_status_sched` (`status`, `scheduled_at`),
  KEY `idx_tweets_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
