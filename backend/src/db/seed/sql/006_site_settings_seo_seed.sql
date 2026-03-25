/* 79_site_settings_seo_seed.sql — Site media + SEO defaults (vistaseed) */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

/* =============================================================
   SITE MEDIA (used by Site Settings > Logo & Favicon tab)
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'site_logo',             '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"vistaseed Logo"}'),
  (UUID(), 'site_logo_dark',        '*', '{"url":"/uploads/media/logo/logo2.jpeg","alt":"vistaseed Logo Dark"}'),
  (UUID(), 'site_logo_light',       '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"vistaseed Logo Light"}'),
  (UUID(), 'site_favicon',          '*', '{"url":"/uploads/media/logo/logo4.jpg","alt":"vistaseed Favicon"}'),
  (UUID(), 'site_apple_touch_icon', '*', '{"url":"/uploads/media/logo/logo3.jpg","alt":"vistaseed Apple Touch"}'),
  (UUID(), 'site_app_icon_512',     '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"vistaseed Icon 512"}'),
  (UUID(), 'site_og_default_image', '*', '{"url":"/uploads/media/hero/og-default.jpg","alt":"vistaseed - P2P Kargo Pazaryeri"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

/* =============================================================
   SEO CORE
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'public_base_url', '*', '"https://vistaseed.com"'),
  (UUID(), 'site_title',      '*', '"vistaseed"'),
  (UUID(), 'company_brand',   '*', '{"name":"vistaseed","shortName":"vistaseed"}'),
  (UUID(), 'socials',         '*', '{"instagram":"https://www.instagram.com/vistaseed","facebook":"https://www.facebook.com/vistaseed"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'seo_defaults', '*',
   '{"canonicalBase":"https://vistaseed.com","siteName":"vistaseed","description":"P2P kargo pazaryeri. Taşıyıcılar güzergah ilanı açar, müşteriler kargo alanı satın alır.","ogLocale":"tr_TR","author":"vistaseed","themeColor":"#F97316","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}'),
  (UUID(), 'seo_app_icons', '*',
   '{"appleTouchIcon":"/uploads/media/logo/logo3.jpg","favicon":"/uploads/media/logo/logo4.jpg","faviconSvg":"/uploads/media/logo/logo4.jpg"}'),
  (UUID(), 'seo_social_same_as', '*',
   '["https://www.instagram.com/vistaseed","https://www.facebook.com/vistaseed"]'),
  (UUID(), 'seo_amp_google_client_id_api', '*', '"googleanalytics"'),
  (UUID(), 'site_meta_default', 'tr',
   '{"title":"vistaseed","description":"P2P kargo pazaryeri — BlaBlaCar modeli, kargo için","keywords":"vistaseed, p2p kargo, kargo gönder, taşıyıcı"}'),
  (UUID(), 'site_seo', '*',
   '{"title_default":"vistaseed","title_template":"{{title}} | vistaseed","description":"P2P kargo pazaryeri — taşıyıcılar güzergah ilanı açar, müşteriler kargo alanı satın alır","robots":"index, follow"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

/* =============================================================
   HOMEPAGE HERO
   ============================================================= */
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'homepage_hero', '*',
   '{"title":"Kargo Göndermek Artık Çok Kolay","subtitle":"Taşıyıcı ilanlarına göz at, uygun güzergahı bul, kargo alanını hemen rezerve et.","bgImage":"/uploads/media/hero/hero-bg.jpg","bgImageDark":"/uploads/media/hero/hero-bg-dark.jpg","bgOverlayOpacity":0.6,"ctaLabel":"KARGO GÖNDER","ctaPath":"/ilan-ver","ctaSecondaryLabel":"İLANLARI GÖR","ctaSecondaryPath":"/ilanlar"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
