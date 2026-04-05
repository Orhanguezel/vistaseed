-- =============================================================
-- Admin panel brand-prefix'li site_settings kayıtları
-- Admin panel key'leri site__ prefix'i ile sorgular.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================
-- site__site_logo  (Brand Media tab)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site__site_logo', '*',
 '{"url":"/uploads/media/logo/logo-light.png","alt":"{{SITE_NAME}} Logo","urlDark":"/uploads/media/logo/logo-dark.png","altDark":"{{SITE_NAME}} Logo Dark","favicon":"/uploads/media/logo/logo-light.png","faviconAlt":"{{SITE_NAME}} Favicon","appleTouchIcon":"/uploads/media/logo/logo-light.png","appleTouchIconAlt":"{{SITE_NAME}} Apple Touch","ogImage":"/uploads/media/logo/logo-light.png","ogImageAlt":"{{SITE_NAME}} OG Image"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- site__theme_config (Centralized theme tokens)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site__theme_config', '*',
 '{"fontSizeBase":"20px","fontSizeScale":1.125,"primaryColor":"#006838","secondaryColor":"#0A2B1E","borderRadius":"0.75rem"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- site__logo  (legacy fallback)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site__logo', '*', '"/uploads/media/logo/logo-light.png"')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- site__seo_pages  (SEO tab — sayfa bazlı SEO ayarları)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site__seo_pages', 'tr',
 '{
   "home":{"title":"{{SITE_NAME}}","description":"{{SITE_NAME}} kurumsal web sitesi.","keywords":"kurumsal, ürünler, hizmetler","robots":"index, follow","noIndex":false},
   "urunler":{"title":"Ürünler | {{SITE_NAME}}","description":"Ürün kataloğumuzu inceleyin.","keywords":"ürünler, katalog","robots":"index, follow","noIndex":false},
   "hakkimizda":{"title":"Hakkımızda | {{SITE_NAME}}","description":"{{SITE_NAME}} hakkında bilgi edinin.","keywords":"hakkımızda, kurumsal","robots":"index, follow","noIndex":false},
   "iletisim":{"title":"İletişim | {{SITE_NAME}}","description":"{{SITE_NAME}} ile iletişime geçin.","keywords":"iletişim","robots":"index, follow","noIndex":false},
   "sss":{"title":"S.S.S. | {{SITE_NAME}}","description":"Sıkça sorulan sorular.","keywords":"sss","robots":"index, follow","noIndex":false},
   "giris":{"title":"Giriş Yap | {{SITE_NAME}}","description":"Hesabınıza giriş yapın.","keywords":"","robots":"noindex, follow","noIndex":true},
   "uye-ol":{"title":"Üye Ol | {{SITE_NAME}}","description":"{{SITE_NAME}} üyesi olun.","keywords":"","robots":"noindex, follow","noIndex":true}
 }')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- site__app_locales  (Dil Ayarları tab)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site__app_locales', '*',
 '[{"code":"tr","label":"Türkçe","is_active":true,"is_default":true},{"code":"en","label":"English","is_active":true,"is_default":false}]')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
