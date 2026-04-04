SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `storage_assets`
  (`id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `url`, `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`)
VALUES
  ('15009400-0000-4000-8000-000000000001', 'lucky-f1-source-01.webp', 'default', 'products/lucky-f1-source-01.webp', 'products', 'image/webp', 85338, '/uploads/products/lucky-f1-source-01.webp', 'local', 'products/lucky-f1-source-01.webp', 'image', 'webp'),
  ('15009400-0000-4000-8000-000000000002', 'kizgin-f1-source-01.webp', 'default', 'products/kizgin-f1-source-01.webp', 'products', 'image/webp', 140266, '/uploads/products/kizgin-f1-source-01.webp', 'local', 'products/kizgin-f1-source-01.webp', 'image', 'webp'),
  ('15009400-0000-4000-8000-000000000003', 'prestij-f1-source-01.webp', 'default', 'products/prestij-f1-source-01.webp', 'products', 'image/webp', 84064, '/uploads/products/prestij-f1-source-01.webp', 'local', 'products/prestij-f1-source-01.webp', 'image', 'webp'),
  ('15009400-0000-4000-8000-000000000004', 'birlik-f1-source-01.webp', 'default', 'products/birlik-f1-source-01.webp', 'products', 'image/webp', 244032, '/uploads/products/birlik-f1-source-01.webp', 'local', 'products/birlik-f1-source-01.webp', 'image', 'webp'),
  ('15009400-0000-4000-8000-000000000005', 'cankan-f1-source-01.webp', 'default', 'products/cankan-f1-source-01.webp', 'products', 'image/webp', 49440, '/uploads/products/cankan-f1-source-01.webp', 'local', 'products/cankan-f1-source-01.webp', 'image', 'webp'),
  ('15009400-0000-4000-8000-000000000006', 'tirpan-f1-source-01.webp', 'default', 'products/tirpan-f1-source-01.webp', 'products', 'image/webp', 55574, '/uploads/products/tirpan-f1-source-01.webp', 'local', 'products/tirpan-f1-source-01.webp', 'image', 'webp'),
  ('15009400-0000-4000-8000-000000000007', 'saray-f1-source-01.webp', 'default', 'products/saray-f1-source-01.webp', 'products', 'image/webp', 45884, '/uploads/products/saray-f1-source-01.webp', 'local', 'products/saray-f1-source-01.webp', 'image', 'webp')
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
  `image_url` = '/uploads/products/lucky-f1-source-01.webp',
  `storage_asset_id` = '15009400-0000-4000-8000-000000000001',
  `images` = JSON_ARRAY('/uploads/products/lucky-f1-source-01.webp'),
  `storage_image_ids` = JSON_ARRAY('15009400-0000-4000-8000-000000000001'),
  `updated_at` = NOW(3)
WHERE `id` = 'pppppppp-0001-4000-8000-000000000002';

UPDATE `products`
SET
  `image_url` = '/uploads/products/kizgin-f1-source-01.webp',
  `storage_asset_id` = '15009400-0000-4000-8000-000000000002',
  `images` = JSON_ARRAY('/uploads/products/kizgin-f1-source-01.webp'),
  `storage_image_ids` = JSON_ARRAY('15009400-0000-4000-8000-000000000002'),
  `updated_at` = NOW(3)
WHERE `id` = 'pppppppp-0001-4000-8000-000000000003';

UPDATE `products`
SET
  `image_url` = '/uploads/products/prestij-f1-source-01.webp',
  `storage_asset_id` = '15009400-0000-4000-8000-000000000003',
  `images` = JSON_ARRAY('/uploads/products/prestij-f1-source-01.webp'),
  `storage_image_ids` = JSON_ARRAY('15009400-0000-4000-8000-000000000003'),
  `updated_at` = NOW(3)
WHERE `id` = 'pppppppp-0001-4000-8000-000000000004';

UPDATE `products`
SET
  `image_url` = '/uploads/products/birlik-f1-source-01.webp',
  `storage_asset_id` = '15009400-0000-4000-8000-000000000004',
  `images` = JSON_ARRAY('/uploads/products/birlik-f1-source-01.webp'),
  `storage_image_ids` = JSON_ARRAY('15009400-0000-4000-8000-000000000004'),
  `updated_at` = NOW(3)
WHERE `id` = 'pppppppp-0001-4000-8000-000000000005';

UPDATE `products`
SET
  `image_url` = '/uploads/products/cankan-f1-source-01.webp',
  `storage_asset_id` = '15009400-0000-4000-8000-000000000005',
  `images` = JSON_ARRAY('/uploads/products/cankan-f1-source-01.webp'),
  `storage_image_ids` = JSON_ARRAY('15009400-0000-4000-8000-000000000005'),
  `updated_at` = NOW(3)
WHERE `id` = 'pppppppp-0001-4000-8000-000000000006';

UPDATE `products`
SET
  `image_url` = '/uploads/products/tirpan-f1-source-01.webp',
  `storage_asset_id` = '15009400-0000-4000-8000-000000000006',
  `images` = JSON_ARRAY('/uploads/products/tirpan-f1-source-01.webp'),
  `storage_image_ids` = JSON_ARRAY('15009400-0000-4000-8000-000000000006'),
  `updated_at` = NOW(3)
WHERE `id` = 'pppppppp-0001-4000-8000-000000000007';

UPDATE `products`
SET
  `image_url` = '/uploads/products/saray-f1-source-01.webp',
  `storage_asset_id` = '15009400-0000-4000-8000-000000000007',
  `images` = JSON_ARRAY('/uploads/products/saray-f1-source-01.webp'),
  `storage_image_ids` = JSON_ARRAY('15009400-0000-4000-8000-000000000007'),
  `updated_at` = NOW(3)
WHERE `id` = 'pppppppp-0001-4000-8000-000000000008';

INSERT INTO `product_images`
  (`id`, `product_id`, `locale`, `image_url`, `image_asset_id`, `title`, `alt`, `caption`, `display_order`, `is_active`)
VALUES
  ('15009410-0000-4000-8000-000000000001', 'pppppppp-0001-4000-8000-000000000002', 'tr', '/uploads/products/lucky-f1-source-01.webp', '15009400-0000-4000-8000-000000000001', 'LUCKY F1', 'LUCKY F1 ürün görseli', 'Resmî Vista Seeds ürün sayfasından alınan LUCKY F1 görseli.', 1, 1),
  ('15009410-0000-4000-8000-000000000002', 'pppppppp-0001-4000-8000-000000000002', 'en', '/uploads/products/lucky-f1-source-01.webp', '15009400-0000-4000-8000-000000000001', 'LUCKY F1', 'LUCKY F1 product image', 'LUCKY F1 image sourced from the official Vista Seeds product page.', 1, 1),
  ('15009410-0000-4000-8000-000000000003', 'pppppppp-0001-4000-8000-000000000002', 'de', '/uploads/products/lucky-f1-source-01.webp', '15009400-0000-4000-8000-000000000001', 'LUCKY F1', 'LUCKY F1 Produktbild', 'LUCKY-F1-Bild von der offiziellen Vista-Seeds-Produktseite.', 1, 1),
  ('15009410-0000-4000-8000-000000000004', 'pppppppp-0001-4000-8000-000000000003', 'tr', '/uploads/products/kizgin-f1-source-01.webp', '15009400-0000-4000-8000-000000000002', 'KIZGIN F1', 'KIZGIN F1 ürün görseli', 'Resmî Vista Seeds ürün sayfasından alınan KIZGIN F1 görseli.', 1, 1),
  ('15009410-0000-4000-8000-000000000005', 'pppppppp-0001-4000-8000-000000000003', 'en', '/uploads/products/kizgin-f1-source-01.webp', '15009400-0000-4000-8000-000000000002', 'KIZGIN F1', 'KIZGIN F1 product image', 'KIZGIN F1 image sourced from the official Vista Seeds product page.', 1, 1),
  ('15009410-0000-4000-8000-000000000006', 'pppppppp-0001-4000-8000-000000000003', 'de', '/uploads/products/kizgin-f1-source-01.webp', '15009400-0000-4000-8000-000000000002', 'KIZGIN F1', 'KIZGIN F1 Produktbild', 'KIZGIN-F1-Bild von der offiziellen Vista-Seeds-Produktseite.', 1, 1),
  ('15009410-0000-4000-8000-000000000007', 'pppppppp-0001-4000-8000-000000000004', 'tr', '/uploads/products/prestij-f1-source-01.webp', '15009400-0000-4000-8000-000000000003', 'PRESTİJ F1', 'PRESTİJ F1 ürün görseli', 'Resmî Vista Seeds ürün sayfasından alınan PRESTİJ F1 görseli.', 1, 1),
  ('15009410-0000-4000-8000-000000000008', 'pppppppp-0001-4000-8000-000000000004', 'en', '/uploads/products/prestij-f1-source-01.webp', '15009400-0000-4000-8000-000000000003', 'PRESTİJ F1', 'PRESTIJ F1 product image', 'PRESTIJ F1 image sourced from the official Vista Seeds product page.', 1, 1),
  ('15009410-0000-4000-8000-000000000009', 'pppppppp-0001-4000-8000-000000000004', 'de', '/uploads/products/prestij-f1-source-01.webp', '15009400-0000-4000-8000-000000000003', 'PRESTİJ F1', 'PRESTIJ F1 Produktbild', 'PRESTIJ-F1-Bild von der offiziellen Vista-Seeds-Produktseite.', 1, 1),
  ('15009410-0000-4000-8000-000000000010', 'pppppppp-0001-4000-8000-000000000005', 'tr', '/uploads/products/birlik-f1-source-01.webp', '15009400-0000-4000-8000-000000000004', 'BİRLİK F1', 'BİRLİK F1 ürün görseli', 'Resmî Vista Seeds ürün sayfasından alınan BİRLİK F1 görseli.', 1, 1),
  ('15009410-0000-4000-8000-000000000011', 'pppppppp-0001-4000-8000-000000000005', 'en', '/uploads/products/birlik-f1-source-01.webp', '15009400-0000-4000-8000-000000000004', 'BİRLİK F1', 'BIRLIK F1 product image', 'BIRLIK F1 image sourced from the official Vista Seeds product page.', 1, 1),
  ('15009410-0000-4000-8000-000000000012', 'pppppppp-0001-4000-8000-000000000005', 'de', '/uploads/products/birlik-f1-source-01.webp', '15009400-0000-4000-8000-000000000004', 'BİRLİK F1', 'BIRLIK F1 Produktbild', 'BIRLIK-F1-Bild von der offiziellen Vista-Seeds-Produktseite.', 1, 1),
  ('15009410-0000-4000-8000-000000000013', 'pppppppp-0001-4000-8000-000000000006', 'tr', '/uploads/products/cankan-f1-source-01.webp', '15009400-0000-4000-8000-000000000005', 'CANKAN F1', 'CANKAN F1 ürün görseli', 'Resmî Vista Seeds ürün sayfasından alınan CANKAN F1 görseli.', 1, 1),
  ('15009410-0000-4000-8000-000000000014', 'pppppppp-0001-4000-8000-000000000006', 'en', '/uploads/products/cankan-f1-source-01.webp', '15009400-0000-4000-8000-000000000005', 'CANKAN F1', 'CANKAN F1 product image', 'CANKAN F1 image sourced from the official Vista Seeds product page.', 1, 1),
  ('15009410-0000-4000-8000-000000000015', 'pppppppp-0001-4000-8000-000000000006', 'de', '/uploads/products/cankan-f1-source-01.webp', '15009400-0000-4000-8000-000000000005', 'CANKAN F1', 'CANKAN F1 Produktbild', 'CANKAN-F1-Bild von der offiziellen Vista-Seeds-Produktseite.', 1, 1),
  ('15009410-0000-4000-8000-000000000016', 'pppppppp-0001-4000-8000-000000000007', 'tr', '/uploads/products/tirpan-f1-source-01.webp', '15009400-0000-4000-8000-000000000006', 'TIRPAN F1', 'TIRPAN F1 ürün görseli', 'Resmî Vista Seeds ürün sayfasından alınan TIRPAN F1 görseli.', 1, 1),
  ('15009410-0000-4000-8000-000000000017', 'pppppppp-0001-4000-8000-000000000007', 'en', '/uploads/products/tirpan-f1-source-01.webp', '15009400-0000-4000-8000-000000000006', 'TIRPAN F1', 'TIRPAN F1 product image', 'TIRPAN F1 image sourced from the official Vista Seeds product page.', 1, 1),
  ('15009410-0000-4000-8000-000000000018', 'pppppppp-0001-4000-8000-000000000007', 'de', '/uploads/products/tirpan-f1-source-01.webp', '15009400-0000-4000-8000-000000000006', 'TIRPAN F1', 'TIRPAN F1 Produktbild', 'TIRPAN-F1-Bild von der offiziellen Vista-Seeds-Produktseite.', 1, 1),
  ('15009410-0000-4000-8000-000000000019', 'pppppppp-0001-4000-8000-000000000008', 'tr', '/uploads/products/saray-f1-source-01.webp', '15009400-0000-4000-8000-000000000007', 'SARAY F1', 'SARAY F1 ürün görseli', 'Resmî Vista Seeds ürün sayfasından alınan SARAY F1 görseli.', 1, 1),
  ('15009410-0000-4000-8000-000000000020', 'pppppppp-0001-4000-8000-000000000008', 'en', '/uploads/products/saray-f1-source-01.webp', '15009400-0000-4000-8000-000000000007', 'SARAY F1', 'SARAY F1 product image', 'SARAY F1 image sourced from the official Vista Seeds product page.', 1, 1),
  ('15009410-0000-4000-8000-000000000021', 'pppppppp-0001-4000-8000-000000000008', 'de', '/uploads/products/saray-f1-source-01.webp', '15009400-0000-4000-8000-000000000007', 'SARAY F1', 'SARAY F1 Produktbild', 'SARAY-F1-Bild von der offiziellen Vista-Seeds-Produktseite.', 1, 1)
ON DUPLICATE KEY UPDATE
  `image_url` = VALUES(`image_url`),
  `image_asset_id` = VALUES(`image_asset_id`),
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`),
  `caption` = VALUES(`caption`),
  `display_order` = VALUES(`display_order`),
  `is_active` = VALUES(`is_active`),
  `updated_at` = NOW(3);
