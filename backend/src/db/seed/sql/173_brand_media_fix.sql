-- Vista Seeds — marka medyası düzeltmesi (favicon/apple/logo/og)
-- favicon.png & appletouch.png x-profile-400x400'den kare üretildi; og olarak x-banner.
-- site_settings medya anahtarları doğru dosyalara yönlendirilir (locale='*').
SET NAMES utf8mb4;

INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'site_favicon',          '*', '{"url": "/uploads/media/logo/favicon.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_apple_touch_icon', '*', '{"url": "/uploads/media/logo/appletouch.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_logo',             '*', '{"url": "/uploads/media/logo/vistaseed_logo_green.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_logo_dark',        '*', '{"url": "/uploads/media/logo/vistaseed_logo_white.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_logo_light',       '*', '{"url": "/uploads/media/logo/vistaseed_logo_white.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_og_default_image', '*', '{"url": "/uploads/media/logo/x-banner-1500x500.png", "alt": "Vista Seeds"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);
