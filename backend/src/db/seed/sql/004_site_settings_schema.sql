/* site_settings_schema.sql — Generic corporate site */

SET NAMES utf8mb4;
SET time_zone = '+00:00';

DROP TABLE IF EXISTS `site_settings`;

CREATE TABLE `site_settings` (
  `id` CHAR(36) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `locale` VARCHAR(8) NOT NULL DEFAULT '*',
  `value` MEDIUMTEXT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_locale_uq` (`key`, `locale`),
  KEY `site_settings_key_idx` (`key`),
  KEY `site_settings_locale_idx` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- BRAND / UI
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'brand_name',         '*', '"{{SITE_NAME}}"'),
(UUID(), 'brand_display_name', '*', '"{{SITE_NAME}}"'),
(UUID(), 'brand_logo_text',    '*', '"{{SITE_NAME}}"'),
(UUID(), 'brand_subtitle',     '*', '"Kurumsal Web Sitesi"'),
(UUID(), 'brand_tagline',      '*', '"Kalite ve Güven"'),
(UUID(), 'topbar_location',    '*', '"Türkiye"'),
(UUID(), 'topbar_slogan',      '*', '"Profesyonel Hizmet Anlayışı"'),
(UUID(), 'ui_theme',           '*', '{"primaryHex":"#F97316","darkMode":"light","radius":"0.5rem"}'),
(UUID(), 'site_version',       '*', '"1.0.0"'),
(UUID(), 'admin_path',         '*', '"/admin"');

-- =============================================================
-- BRAND MEDIA (storage_assets URLs)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'brand_logo',                  '*', '"/uploads/media/logo/logo.jpeg"'),
(UUID(), 'brand_logo_dark',             '*', '"/uploads/media/logo/logo-dark.jpeg"'),
(UUID(), 'brand_logo_icon',             '*', '"/uploads/media/logo/logo-icon.jpg"'),
(UUID(), 'brand_logo_icon_transparent', '*', '"/uploads/media/logo/logo-icon.jpg"'),
(UUID(), 'brand_logo_icon_192',         '*', '"/uploads/media/logo/logo-192.jpg"'),
(UUID(), 'brand_logo_icon_512',         '*', '"/uploads/media/logo/logo-512.jpg"'),
(UUID(), 'brand_og_image',              '*', '"/uploads/media/logo/og-image.jpg"');

-- =============================================================
-- SITE MEDIA (Logo & Favicon)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'site_logo',             '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"{{SITE_NAME}} Logo"}'),
(UUID(), 'site_logo_dark',        '*', '{"url":"/uploads/media/logo/logo-dark.jpeg","alt":"{{SITE_NAME}} Logo Dark"}'),
(UUID(), 'site_logo_light',       '*', '{"url":"/uploads/media/logo/logo.jpeg","alt":"{{SITE_NAME}} Logo Light"}'),
(UUID(), 'site_favicon',          '*', '{"url":"/uploads/media/logo/favicon.jpg","alt":"{{SITE_NAME}} Favicon"}'),
(UUID(), 'site_apple_touch_icon', '*', '{"url":"/uploads/media/logo/apple-touch.jpg","alt":"{{SITE_NAME}} Apple Touch"}'),
(UUID(), 'site_app_icon_512',     '*', '{"url":"/uploads/media/logo/logo-512.jpg","alt":"{{SITE_NAME}} Icon 512"}'),
(UUID(), 'site_og_default_image', '*', '{"url":"/uploads/media/hero/og-default.jpg","alt":"{{SITE_NAME}}"}');

-- =============================================================
-- CONTACT
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'contact_phone_display',  '*', '"0312 000 00 00"'),
(UUID(), 'contact_phone_tel',      '*', '"03120000000"'),
(UUID(), 'contact_email',          '*', '"info@example.com"'),
(UUID(), 'contact_to_email',       '*', '"info@example.com"'),
(UUID(), 'contact_address',        '*', '"Türkiye"'),
(UUID(), 'contact_whatsapp_link',  '*', '""');

-- =============================================================
-- STORAGE / UPLOAD CONFIG
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'storage_driver',             '*', '"local"'),
(UUID(), 'storage_local_root',         '*', '"/app/uploads"'),
(UUID(), 'storage_local_base_url',     '*', '"/uploads"'),
(UUID(), 'storage_cdn_public_base',    '*', '""'),
(UUID(), 'storage_public_api_base',    '*', '"http://localhost:8083"'),
(UUID(), 'cloudinary_cloud_name',      '*', '""'),
(UUID(), 'cloudinary_api_key',         '*', '""'),
(UUID(), 'cloudinary_api_secret',      '*', '"__SET_IN_ENV__"'),
(UUID(), 'cloudinary_folder',          '*', '"uploads"'),
(UUID(), 'cloudinary_unsigned_preset', '*', '""');

-- =============================================================
-- SMTP / MAIL CONFIG
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'smtp_host',        '*', '"smtp.example.com"'),
(UUID(), 'smtp_port',        '*', '587'),
(UUID(), 'smtp_username',    '*', '"info@example.com"'),
(UUID(), 'smtp_password',    '*', '"__SET_IN_ENV__"'),
(UUID(), 'smtp_from_email',  '*', '"info@example.com"'),
(UUID(), 'smtp_from_name',   '*', '"{{SITE_NAME}}"'),
(UUID(), 'smtp_ssl',         '*', 'false');

-- =============================================================
-- HEADER
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'header_info_text',  '*', '"Ürünlerimizi keşfedin"'),
(UUID(), 'header_cta_label',  '*', '"İLETİŞİM"');

-- =============================================================
-- HEADER MENU
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(
  UUID(), 'header_menu', '*',
  '[
    {"title":"ANASAYFA","path":"/","pageKey":"home","type":"link"},
    {"title":"ÜRÜNLER","path":"/urunler","pageKey":"products","type":"link"},
    {"title":"HAKKIMIZDA","path":"/hakkimizda","pageKey":"about","type":"link"},
    {"title":"KURUMSAL","path":"#","pageKey":"kurumsal","type":"dropdown","itemsKey":"menu_kurumsal"},
    {"title":"İLETİŞİM","path":"/iletisim","pageKey":"contact","type":"link"}
  ]'
);

-- =============================================================
-- FOOTER
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'footer_keywords',    '*', '["Kurumsal","Ürünler","Hizmetler","Kalite"]'),
(UUID(), 'footer_services',    '*', '["Ürünler","Hizmetler","Destek"]'),
(UUID(), 'footer_quick_links', '*', '[{"title":"Anasayfa","path":"/","pageKey":"home"},{"title":"Ürünler","path":"/urunler","pageKey":"products"},{"title":"Hakkımızda","path":"/hakkimizda","pageKey":"about"},{"title":"İletişim","path":"/iletisim","pageKey":"contact"}]');

-- =============================================================
-- MENU (Header dropdown)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(
  UUID(), 'menu_kurumsal', '*',
  '[{"title":"HAKKIMIZDA","path":"/hakkimizda","pageKey":"about"},{"title":"S.S.S.","path":"/sss","pageKey":"faq"},{"title":"İLETİŞİM","path":"/iletisim","pageKey":"contact"}]'
);

-- =============================================================
-- SEO GLOBAL DEFAULTS
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'seo_defaults', '*',
 '{"canonicalBase":"http://localhost:3000","siteName":"{{SITE_NAME}}","description":"{{SITE_NAME}} kurumsal web sitesi.","ogLocale":"tr_TR","author":"{{SITE_NAME}}","themeColor":"#F97316","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}'),
(UUID(), 'public_base_url',  '*', '"http://localhost:3000"'),
(UUID(), 'site_title',       '*', '"{{SITE_NAME}}"'),
(UUID(), 'company_brand',    '*', '{"name":"{{SITE_NAME}}","shortName":"{{SITE_NAME}}"}'),
(UUID(), 'socials',          '*', '{"instagram":"","facebook":"","twitter":""}'),
(UUID(), 'social_facebook_url',  '*', '""'),
(UUID(), 'social_instagram_url', '*', '""'),
(UUID(), 'social_twitter_url',   '*', '""'),
(UUID(), 'seo_social_same_as',  '*', '[]'),
(UUID(), 'seo_app_icons', '*',
 '{"appleTouchIcon":"/uploads/media/logo/apple-touch.jpg","favicon":"/uploads/media/logo/favicon.jpg","faviconSvg":"/uploads/media/logo/favicon.svg","logoIcon192":"/uploads/media/logo/logo-192.jpg","logoIcon512":"/uploads/media/logo/logo-512.jpg"}'),
(UUID(), 'seo_amp_google_client_id_api', '*', '"googleanalytics"');

-- =============================================================
-- SEO SAYFA BAZLI
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES

(UUID(), 'seo_pages_home', '*',
 '{"title":"{{SITE_NAME}}","description":"{{SITE_NAME}} kurumsal web sitesi.","keywords":"kurumsal, ürünler, hizmetler","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

(UUID(), 'seo_pages_products', '*',
 '{"title":"Ürünler | {{SITE_NAME}}","description":"Ürün katalogumuzu inceleyin.","keywords":"ürünler, katalog","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

(UUID(), 'seo_pages_about', '*',
 '{"title":"Hakkımızda | {{SITE_NAME}}","description":"{{SITE_NAME}} hakkında bilgi edinin.","keywords":"hakkımızda, kurumsal","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

(UUID(), 'seo_pages_contact', '*',
 '{"title":"İletişim | {{SITE_NAME}}","description":"{{SITE_NAME}} ile iletişime geçin.","keywords":"iletişim, destek","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

(UUID(), 'seo_pages_faq', '*',
 '{"title":"S.S.S. | {{SITE_NAME}}","description":"Sıkça sorulan sorular ve cevapları.","keywords":"sss, sorular","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),

(UUID(), 'seo_pages_login', '*',
 '{"title":"Giriş Yap | {{SITE_NAME}}","description":"Hesabınıza giriş yapın.","keywords":"","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, follow","noIndex":true}'),

(UUID(), 'seo_pages_register', '*',
 '{"title":"Üye Ol | {{SITE_NAME}}","description":"{{SITE_NAME}} üyesi olun.","keywords":"","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, follow","noIndex":true}'),

(UUID(), 'seo_pages_password_reset', '*',
 '{"title":"Şifremi Unuttum | {{SITE_NAME}}","description":"Şifre sıfırlama sayfası.","keywords":"","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, nofollow","noIndex":true}'),

(UUID(), 'seo_pages_admin', '*',
 '{"title":"Admin Panel | {{SITE_NAME}}","description":"Yönetim paneli.","keywords":"","ogImage":"/uploads/media/hero/og-default.jpg","robots":"noindex, nofollow","noIndex":true}');

-- =============================================================
-- JSON-LD (Organization)
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'seo_local_business', '*',
 '{"@context":"https://schema.org","@type":"Organization","name":"{{SITE_NAME}}","description":"{{SITE_NAME}} kurumsal web sitesi.","url":"http://localhost:3000","sameAs":[]}');

-- =============================================================
-- HOMEPAGE SETTINGS
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'homepage_sections', '*',
 '[{"key":"hero","enabled":true,"order":1,"label":"Hero Bölümü"},{"key":"categories","enabled":true,"order":2,"label":"Kategoriler"},{"key":"featured","enabled":true,"order":3,"label":"Öne Çıkan Ürünler"},{"key":"recent","enabled":true,"order":4,"label":"Son Ürünler"}]'),

(UUID(), 'homepage_hero', '*',
 '{"title":"{{SITE_NAME}}","subtitle":"Profesyonel hizmet ve kaliteli ürünler.","bgImage":"/uploads/media/hero/hero-bg.jpg","bgImageDark":"/uploads/media/hero/hero-bg-dark.jpg","bgOverlayOpacity":0.6,"ctaLabel":"ÜRÜNLER","ctaPath":"/urunler","ctaSecondaryLabel":"İLETİŞİM","ctaSecondaryPath":"/iletisim"}'),

(UUID(), 'homepage_banners', '*',
 '[]');

-- =============================================================
-- CTA
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(UUID(), 'cta_post_listing_title',    '*', '"Bizimle İletişime Geçin"'),
(UUID(), 'cta_post_listing_subtitle', '*', '"Sorularınız için bize ulaşın"'),
(UUID(), 'cta_post_listing_path',     '*', '"/iletisim"');

-- =============================================================
-- ADMIN UI BRANDING
-- =============================================================
INSERT INTO `site_settings` (`id`,`key`,`locale`,`value`) VALUES
(
  UUID(), 'ui_admin_config', '*',
  '{
    "default_locale":"tr",
    "theme":{"mode":"light","preset":"soft-pop","font":"inter"},
    "layout":{"sidebar_variant":"inset","sidebar_collapsible":"icon","navbar_style":"sticky","content_layout":"full-width"},
    "branding":{
      "app_name":"{{SITE_NAME}} Admin",
      "app_copyright":"{{SITE_NAME}}",
      "html_lang":"tr",
      "theme_color":"#F97316",
      "favicon":"/uploads/media/logo/favicon.jpg",
      "favicon_svg":"/uploads/media/logo/favicon.svg",
      "apple_touch_icon":"/uploads/media/logo/apple-touch.jpg",
      "logo":"/uploads/media/logo/logo.jpeg",
      "logo_dark":"/uploads/media/logo/logo-dark.jpeg",
      "logo_icon":"/uploads/media/logo/logo-icon.jpg",
      "meta":{
        "title":"{{SITE_NAME}} Admin",
        "description":"{{SITE_NAME}} yönetim paneli.",
        "og_url":"http://localhost:3000/admin",
        "og_title":"{{SITE_NAME}} Admin",
        "og_description":"{{SITE_NAME}} yönetim paneli.",
        "og_image":"/uploads/media/logo/og-image.jpg",
        "twitter_card":"summary_large_image"
      }
    }
  }'
),
(
  UUID(), 'ui_admin', '*',
  '{
    "app_name":"{{SITE_NAME}} Admin",
    "app_version":"v1.0.0",
    "developer_branding":{"name":"{{SITE_NAME}}","url":"http://localhost:3000","full_name":"{{SITE_NAME}}"},
    "nav":{
      "labels":{
        "general":"Genel / Yönetim",
        "products":"Ürün Yönetimi",
        "users":"Kullanıcılar",
        "support":"Destek",
        "system":"Sistem & Ayarlar"
      },
      "items":{
        "categories":"Kategoriler",
        "products":"Ürünler",
        "gallery":"Galeri",
        "users":"Kullanıcılar",
        "contacts":"İletişim Mesajları",
        "email_templates":"E-posta Şablonları",
        "site_settings":"Site Ayarları",
        "storage":"Dosya Yöneticisi",
        "theme":"Tema",
        "telegram":"Telegram",
        "audit":"Denetim"
      }
    },
    "common":{
      "actions":{
        "create":"Oluştur",
        "edit":"Düzenle",
        "delete":"Sil",
        "save":"Kaydet",
        "cancel":"İptal",
        "refresh":"Yenile",
        "search":"Ara",
        "filter":"Filtrele",
        "close":"Kapat",
        "back":"Geri",
        "confirm":"Onayla"
      },
      "states":{
        "loading":"Yükleniyor...",
        "error":"İşlem başarısız.",
        "empty":"Veri bulunamadı.",
        "updating":"Güncelleniyor...",
        "saving":"Kaydediliyor..."
      }
    }
  }'
);
