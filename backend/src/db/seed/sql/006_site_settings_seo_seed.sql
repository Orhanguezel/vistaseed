/* site_settings_seo_seed.sql — Site media + SEO defaults */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

/* =============================================================
   SITE MEDIA (Logo & Favicon tab)
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'site_logo',             '*', '{"url":"/uploads/media/logo/vistaseeds_logo.png","alt":"{{SITE_NAME}} Logo"}'),
  (UUID(), 'site_logo_dark',        '*', '{"url":"/uploads/media/logo/vistaseeds_logo.png","alt":"{{SITE_NAME}} Logo Dark"}'),
  (UUID(), 'site_logo_light',       '*', '{"url":"/uploads/media/logo/vistaseeds_logo.png","alt":"{{SITE_NAME}} Logo Light"}'),
  (UUID(), 'site_favicon',          '*', '{"url":"/uploads/media/logo/favicon.jpg","alt":"{{SITE_NAME}} Favicon"}'),
  (UUID(), 'site_apple_touch_icon', '*', '{"url":"/uploads/media/logo/apple-touch.jpg","alt":"{{SITE_NAME}} Apple Touch"}'),
  (UUID(), 'site_app_icon_512',     '*', '{"url":"/uploads/media/logo/logo-512.jpg","alt":"{{SITE_NAME}} Icon 512"}'),
  (UUID(), 'site_og_default_image', '*', '{"url":"/uploads/media/hero/og-default.jpg","alt":"{{SITE_NAME}}"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

/* =============================================================
   SEO CORE
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'public_base_url', '*', '"http://localhost:3000"'),
  (UUID(), 'site_title',      '*', '"{{SITE_NAME}}"'),
  (UUID(), 'company_brand',   '*', '{"name":"{{SITE_NAME}}","shortName":"{{SITE_NAME}}"}'),
  (UUID(), 'socials',         '*', '{"instagram":"","facebook":""}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'seo_defaults', '*',
   '{"canonicalBase":"http://localhost:3000","siteName":"{{SITE_NAME}}","description":"{{SITE_NAME}} kurumsal web sitesi.","ogLocale":"tr_TR","author":"{{SITE_NAME}}","themeColor":"#F97316","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}'),
  (UUID(), 'seo_app_icons', '*',
   '{"appleTouchIcon":"/uploads/media/logo/apple-touch.jpg","favicon":"/uploads/media/logo/favicon.jpg","faviconSvg":"/uploads/media/logo/favicon.svg"}'),
  (UUID(), 'seo_social_same_as', '*', '[]'),
  (UUID(), 'seo_amp_google_client_id_api', '*', '"googleanalytics"'),
  (UUID(), 'site_meta_default', 'tr',
   '{"title":"{{SITE_NAME}}","description":"{{SITE_NAME}} kurumsal web sitesi.","keywords":"kurumsal, ürünler, hizmetler"}'),
  (UUID(), 'site_seo', '*',
   '{"title_default":"{{SITE_NAME}}","title_template":"{{title}} | {{SITE_NAME}}","description":"{{SITE_NAME}} kurumsal web sitesi.","robots":"index, follow"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

/* =============================================================
   HOMEPAGE HERO
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'homepage_hero', '*',
   '{"title":"{{SITE_NAME}}","subtitle":"Profesyonel hizmet ve kaliteli ürünler.","bgImage":"/uploads/media/hero/hero-bg.jpg","bgImageDark":"/uploads/media/hero/hero-bg-dark.jpg","bgOverlayOpacity":0.6,"ctaLabel":"ÜRÜNLER","ctaPath":"/urunler","ctaSecondaryLabel":"İLETİŞİM","ctaSecondaryPath":"/iletisim"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
