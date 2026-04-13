SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `library`
  (`id`, `type`, `category_id`, `sub_category_id`, `featured`, `is_published`, `is_active`, `display_order`, `featured_image`, `image_url`, `image_asset_id`, `views`, `download_count`, `published_at`)
VALUES
  (
    '88888888-8888-4888-8888-888888888881',
    'support',
    NULL,
    NULL,
    1,
    1,
    1,
    1,
    '/uploads/support/library/support-library-01.jpeg',
    '/uploads/support/library/support-library-01.jpeg',
    NULL,
    12,
    3,
    CURRENT_TIMESTAMP(3)
  )
ON DUPLICATE KEY UPDATE
  `type` = VALUES(`type`),
  `featured` = VALUES(`featured`),
  `is_published` = VALUES(`is_published`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `image_url` = VALUES(`image_url`),
  `published_at` = VALUES(`published_at`);

INSERT INTO `library_i18n`
  (`id`, `library_id`, `locale`, `slug`, `name`, `description`, `image_alt`, `tags`, `meta_title`, `meta_description`, `meta_keywords`)
VALUES
  (
    '88888888-8888-4888-8888-888888888891',
    '88888888-8888-4888-8888-888888888881',
    'tr',
    'kurumsal-bilgi-akisi-rehberi',
    'Kurumsal Bilgi Akışı Rehberi',
    'vistaseeds ekosisteminde ürün, bayi, teklif ve teknik içerik akışını aynı çatı altında yöneten temel operasyon rehberi.',
    'Kurumsal bilgi akışı kapak görseli',
    'vistaseeds, bilgi bankası, operasyon, rehber',
    'Kurumsal Bilgi Akışı Rehberi | vistaseeds',
    'Ürün, bayi ağı, toplu satış ve bilgi bankası yüzeylerinin aynı içerik mantığında nasıl yönetildiğini özetleyen rehber.',
    'vistaseeds, bilgi bankası, operasyon, rehber'
  ),
  (
    '88888888-8888-4888-8888-888888888892',
    '88888888-8888-4888-8888-888888888881',
    'en',
    'corporate-content-flow-guide',
    'Corporate Content Flow Guide',
    'A practical operational guide for managing products, dealer network, quotation flows, and technical content inside the vistaseeds ecosystem.',
    'Corporate content flow cover image',
    'vistaseeds, knowledge base, operations, guide',
    'Corporate Content Flow Guide | vistaseeds',
    'An overview of how products, dealer network, bulk sales, and knowledge-base surfaces are managed within one editorial structure.',
    'vistaseeds, knowledge base, operations, guide'
  )
ON DUPLICATE KEY UPDATE
  `slug` = VALUES(`slug`),
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `image_alt` = VALUES(`image_alt`),
  `tags` = VALUES(`tags`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `meta_keywords` = VALUES(`meta_keywords`);

INSERT INTO `library_images`
  (`id`, `library_id`, `image_asset_id`, `image_url`, `is_active`, `display_order`)
VALUES
  ('88888888-8888-4888-8888-8888888888a1', '88888888-8888-4888-8888-888888888881', NULL, '/uploads/support/library/support-library-01.jpeg', 1, 0),
  ('88888888-8888-4888-8888-8888888888a2', '88888888-8888-4888-8888-888888888881', NULL, '/uploads/support/library/support-library-02.jpeg', 1, 1),
  ('88888888-8888-4888-8888-8888888888a3', '88888888-8888-4888-8888-888888888881', NULL, '/uploads/support/library/support-library-03.jpeg', 1, 2)
ON DUPLICATE KEY UPDATE
  `image_url` = VALUES(`image_url`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`);

INSERT INTO `library_images_i18n`
  (`id`, `image_id`, `locale`, `title`, `alt`, `caption`)
VALUES
  ('88888888-8888-4888-8888-8888888888b1', '88888888-8888-4888-8888-8888888888a1', 'tr', 'Operasyon akışı görseli 1', 'Kurumsal bilgi akışı birinci görsel', 'Ürün ve içerik akışını özetleyen kapak görseli'),
  ('88888888-8888-4888-8888-8888888888b2', '88888888-8888-4888-8888-8888888888a2', 'tr', 'Operasyon akışı görseli 2', 'Kurumsal bilgi akışı ikinci görsel', 'Bayi ağı ve teklif yönetimi sahnesi'),
  ('88888888-8888-4888-8888-8888888888b3', '88888888-8888-4888-8888-8888888888a3', 'tr', 'Operasyon akışı görseli 3', 'Kurumsal bilgi akışı üçüncü görsel', 'Teknik içerik ve saha arşivi'),
  ('88888888-8888-4888-8888-8888888888b4', '88888888-8888-4888-8888-8888888888a1', 'en', 'Operations flow image 1', 'First corporate content flow image', 'Cover image summarizing products and content flow'),
  ('88888888-8888-4888-8888-8888888888b5', '88888888-8888-4888-8888-8888888888a2', 'en', 'Operations flow image 2', 'Second corporate content flow image', 'Dealer network and quotation management scene'),
  ('88888888-8888-4888-8888-8888888888b6', '88888888-8888-4888-8888-8888888888a3', 'en', 'Operations flow image 3', 'Third corporate content flow image', 'Technical content and field archive')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`);

INSERT INTO `library_files`
  (`id`, `library_id`, `asset_id`, `file_url`, `name`, `size_bytes`, `mime_type`, `tags_json`, `display_order`, `is_active`)
VALUES
  (
    '88888888-8888-4888-8888-8888888888c1',
    '88888888-8888-4888-8888-888888888881',
    NULL,
    '/uploads/support/library/vistaseeds-kurumsal-bilgi-akisi-rehberi.pdf',
    'vistaseeds-kurumsal-bilgi-akisi-rehberi.pdf',
    512,
    'application/pdf',
    '["vistaseeds","knowledge-base","operations","guide"]',
    0,
    1
  )
ON DUPLICATE KEY UPDATE
  `file_url` = VALUES(`file_url`),
  `name` = VALUES(`name`),
  `size_bytes` = VALUES(`size_bytes`),
  `mime_type` = VALUES(`mime_type`),
  `tags_json` = VALUES(`tags_json`),
  `display_order` = VALUES(`display_order`),
  `is_active` = VALUES(`is_active`);
