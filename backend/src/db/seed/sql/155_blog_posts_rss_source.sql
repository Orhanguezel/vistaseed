-- RSS dis kaynak icerik deduplikasyonu (kaynak oge URL'si)
ALTER TABLE `blog_posts`
  ADD COLUMN `rss_source_url` VARCHAR(768) NULL DEFAULT NULL AFTER `image_url`;

CREATE UNIQUE INDEX `blog_posts_rss_source_url_uq` ON `blog_posts` (`rss_source_url`);
