-- Blog (kurumsal içerik, RSS, çok dilli)

CREATE TABLE IF NOT EXISTS blog_posts (
  id CHAR(36) NOT NULL PRIMARY KEY,
  category VARCHAR(64) NOT NULL DEFAULT 'genel',
  author VARCHAR(128) NULL,
  image_url VARCHAR(512) NULL,
  rss_source_url VARCHAR(768) NULL DEFAULT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'draft',
  published_at DATETIME(3) NULL,
  is_active TINYINT NOT NULL DEFAULT 1,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY blog_posts_rss_source_url_uq (rss_source_url),
  INDEX blog_posts_category_idx (category),
  INDEX blog_posts_status_idx (status),
  INDEX blog_posts_published_idx (published_at),
  INDEX blog_posts_active_idx (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts_i18n (
  blog_post_id CHAR(36) NOT NULL,
  locale VARCHAR(8) NOT NULL DEFAULT 'tr',
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  excerpt TEXT NULL,
  content LONGTEXT NOT NULL,
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(500) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (blog_post_id, locale),
  UNIQUE KEY blog_posts_i18n_slug_locale_uq (slug, locale),
  INDEX blog_posts_i18n_locale_idx (locale),
  CONSTRAINT fk_blog_posts_i18n_post
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
