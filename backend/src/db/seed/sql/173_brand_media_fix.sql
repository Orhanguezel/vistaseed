-- Vista Seeds — marka medyası düzeltmesi (favicon/apple/logo/og)
-- favicon-sq.png & appletouch-sq.png: x-profile-400x400'den kare (Cloudflare cache-bust için yeni ad).
-- og → x-banner-1500x500; site_seo.open_graph.images da x-banner'a güncellenir. Hepsi locale='*'.
SET NAMES utf8mb4;

INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
  (UUID(), 'site_favicon', '*', '{"url": "/uploads/media/logo/favicon-sq.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_apple_touch_icon', '*', '{"url": "/uploads/media/logo/appletouch-sq.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_logo', '*', '{"url": "/uploads/media/logo/vistaseed_logo_green.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_logo_dark', '*', '{"url": "/uploads/media/logo/vistaseed_logo_white.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_logo_light', '*', '{"url": "/uploads/media/logo/vistaseed_logo_white.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_og_default_image', '*', '{"url": "/uploads/media/logo/x-banner-1500x500.png", "alt": "Vista Seeds"}'),
  (UUID(), 'site_seo', '*', '{"title_default": "Vista Seeds — Sertifikalı Tohum Üreticisi", "title_template": "%s | Vista Seeds", "description": "1990''dan bu yana Türkiye''nin lider tohum üreticisi. TÜAB onaylı sertifikalı sebze tohumları.", "robots": "index, follow", "author": "Vista Seeds", "open_graph": {"images": ["/uploads/media/logo/x-banner-1500x500.png"]}, "twitter": {"card": "summary_large_image"}}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);
