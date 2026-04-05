-- =============================================================
-- email_templates tablosu + varsayılan şablonlar
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `email_templates` (
  `id`           CHAR(36)      NOT NULL,
  `template_key`  VARCHAR(100)  NOT NULL,
  `template_name` VARCHAR(255)  DEFAULT NULL,
  `subject`       VARCHAR(500)  DEFAULT NULL,
  `content_html`  LONGTEXT      DEFAULT NULL,
  `variables`     LONGTEXT      DEFAULT NULL,
  `is_active`    TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_templates_key_uq`    (`template_key`),
  KEY `email_templates_active_idx`       (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan e-posta şablonları
INSERT IGNORE INTO `email_templates` (`id`, `template_key`, `template_name`, `subject`, `variables`, `is_active`)
VALUES
  (UUID(), 'welcome',            '{{SITE_NAME}} - Hoş Geldiniz',  'Hesabınız başarıyla oluşturuldu',                 '["user_name","role"]', 1),
  (UUID(), 'password_reset',     'Şifre Sıfırlama',               'Şifrenizi sıfırlamak için bağlantıya tıklayın',   '["user_name","reset_link","expires_in"]', 1),
  (UUID(), 'contact_received',   'İletişim Formu Alındı',         'İletişim formunuz alındı',                        '["name","email","subject"]', 1),
  (UUID(), 'password_changed',   'Şifreniz Değiştirildi',         'Hesabınızın şifresi başarıyla değiştirildi',      '["user_name"]', 1);
