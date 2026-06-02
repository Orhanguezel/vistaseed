-- Vista Seeds — sayfa SEO og görselleri logo-light.png → x-banner-1500x500.png
-- Yalnızca seo_pages_* anahtarları (og bağlamı); logo anahtarlarına dokunmaz.
SET NAMES utf8mb4;

UPDATE `site_settings`
SET `value` = REPLACE(`value`, '/uploads/media/logo/logo-light.png', '/uploads/media/logo/x-banner-1500x500.png'),
    `updated_at` = NOW(3)
WHERE `key` LIKE 'seo_pages_%'
  AND `value` LIKE '%logo-light.png%';
