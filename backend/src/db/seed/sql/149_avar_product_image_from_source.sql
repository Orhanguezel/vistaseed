SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `storage_assets`
  (`id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `url`, `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`)
VALUES
  (
    '14909400-0000-4000-8000-000000000001',
    'avar-rootstock-01.webp',
    'default',
    'products/avar-rootstock-01.webp',
    'products',
    'image/webp',
    262110,
    '/uploads/products/avar-rootstock-01.webp',
    'local',
    'products/avar-rootstock-01.webp',
    'image',
    'webp'
  )
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `path` = VALUES(`path`),
  `folder` = VALUES(`folder`),
  `mime` = VALUES(`mime`),
  `size` = VALUES(`size`),
  `url` = VALUES(`url`),
  `provider` = VALUES(`provider`),
  `provider_public_id` = VALUES(`provider_public_id`),
  `provider_resource_type` = VALUES(`provider_resource_type`),
  `provider_format` = VALUES(`provider_format`);

UPDATE `products`
SET
  `image_url` = '/uploads/products/avar-rootstock-01.webp',
  `storage_asset_id` = '14909400-0000-4000-8000-000000000001',
  `images` = JSON_ARRAY('/uploads/products/avar-rootstock-01.webp'),
  `storage_image_ids` = JSON_ARRAY('14909400-0000-4000-8000-000000000001'),
  `updated_at` = NOW(3)
WHERE `id` = 'pppppppp-0001-4000-8000-000000000001';

INSERT INTO `product_images`
  (`id`, `product_id`, `locale`, `image_url`, `image_asset_id`, `title`, `alt`, `caption`, `display_order`, `is_active`)
VALUES
  (
    '14909410-0000-4000-8000-000000000001',
    'pppppppp-0001-4000-8000-000000000001',
    'tr',
    '/uploads/products/avar-rootstock-01.webp',
    '14909400-0000-4000-8000-000000000001',
    'AVAR',
    'AVAR anaç ürünü',
    'Resmî Vista Seeds ürün sayfasından alınan AVAR görseli.',
    1,
    1
  ),
  (
    '14909410-0000-4000-8000-000000000002',
    'pppppppp-0001-4000-8000-000000000001',
    'en',
    '/uploads/products/avar-rootstock-01.webp',
    '14909400-0000-4000-8000-000000000001',
    'AVAR',
    'AVAR rootstock product image',
    'AVAR image sourced from the official Vista Seeds product page.',
    1,
    1
  ),
  (
    '14909410-0000-4000-8000-000000000003',
    'pppppppp-0001-4000-8000-000000000001',
    'de',
    '/uploads/products/avar-rootstock-01.webp',
    '14909400-0000-4000-8000-000000000001',
    'AVAR',
    'AVAR Unterlagenproduktbild',
    'AVAR-Bild von der offiziellen Vista-Seeds-Produktseite.',
    1,
    1
  )
ON DUPLICATE KEY UPDATE
  `image_url` = VALUES(`image_url`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `display_order` = VALUES(`display_order`),
  `is_active` = VALUES(`is_active`),
  `updated_at` = NOW(3);
