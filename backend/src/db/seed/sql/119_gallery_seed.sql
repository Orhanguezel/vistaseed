SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `galleries` (`id`, `module_key`, `source_id`, `source_type`, `is_active`, `is_featured`, `display_order`)
VALUES
  ('77777777-7777-4777-8777-777777777771', 'support', NULL, 'standalone', 1, 1, 1)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `source_type` = VALUES(`source_type`),
  `is_active` = VALUES(`is_active`),
  `is_featured` = VALUES(`is_featured`),
  `display_order` = VALUES(`display_order`);

INSERT INTO `gallery_i18n` (`gallery_id`, `locale`, `title`, `slug`, `description`, `meta_title`, `meta_description`)
VALUES
  (
    '77777777-7777-4777-8777-777777777771',
    'tr',
    'Destek Galerisi',
    'destek-galerisi',
    'Destek ve kurumsal iletisim icerikleri icin ortak kullanilan galeri albumu.',
    'Destek Galerisi',
    'Destek sayfalari ve galeri modulu icin kullanilan ortak gorsel albumu.'
  ),
  (
    '77777777-7777-4777-8777-777777777771',
    'en',
    'Support Gallery',
    'support-gallery',
    'Shared gallery album used for support and corporate communication content.',
    'Support Gallery',
    'Shared visual gallery used by the support section and gallery module.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

INSERT INTO `gallery_images` (`id`, `gallery_id`, `storage_asset_id`, `image_url`, `display_order`, `is_cover`)
VALUES
  ('77777777-7777-4777-8777-777777777781', '77777777-7777-4777-8777-777777777771', NULL, '/uploads/support/gallery/support-gallery-01.jpeg', 0, 1),
  ('77777777-7777-4777-8777-777777777782', '77777777-7777-4777-8777-777777777771', NULL, '/uploads/support/gallery/support-gallery-02.jpeg', 1, 0),
  ('77777777-7777-4777-8777-777777777783', '77777777-7777-4777-8777-777777777771', NULL, '/uploads/support/gallery/support-gallery-03.jpeg', 2, 0)
ON DUPLICATE KEY UPDATE
  `image_url` = VALUES(`image_url`),
  `display_order` = VALUES(`display_order`),
  `is_cover` = VALUES(`is_cover`);

INSERT INTO `gallery_image_i18n` (`image_id`, `locale`, `alt`, `caption`, `description`)
VALUES
  ('77777777-7777-4777-8777-777777777781', 'tr', 'Destek galerisi kapak gorseli', 'Destek ekibi ve urun tanitim alani', NULL),
  ('77777777-7777-4777-8777-777777777782', 'tr', 'Destek galerisi ikinci gorsel', 'Kurumsal iletisim ve saha tanitimi', NULL),
  ('77777777-7777-4777-8777-777777777783', 'tr', 'Destek galerisi ucuncu gorsel', 'Tohum ve urun gorsel arsivi', NULL),
  ('77777777-7777-4777-8777-777777777781', 'en', 'Support gallery cover image', 'Support team and product showcase area', NULL),
  ('77777777-7777-4777-8777-777777777782', 'en', 'Support gallery second image', 'Corporate communication and field presentation', NULL),
  ('77777777-7777-4777-8777-777777777783', 'en', 'Support gallery third image', 'Seed and product visual archive', NULL)
ON DUPLICATE KEY UPDATE
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`);
