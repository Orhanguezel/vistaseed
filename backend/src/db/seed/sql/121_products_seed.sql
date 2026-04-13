-- =============================================================
-- Products modulu: schema + seed verileri (Vista Seeds tohumlar)
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================
-- SCHEMA: products (base) + product_i18n + specs + faqs + reviews + options + stock + images
-- =============================================================

CREATE TABLE IF NOT EXISTS `products` (
  `id`                CHAR(36)        NOT NULL,
  `item_type`         ENUM('product','sparepart','bereketfide') NOT NULL DEFAULT 'product',
  `category_id`       CHAR(36)        NOT NULL,
  `sub_category_id`   CHAR(36)        DEFAULT NULL,
  `price`             DECIMAL(10,2)   NOT NULL DEFAULT '0.00',
  `image_url`         LONGTEXT        DEFAULT NULL,
  `storage_asset_id`  CHAR(36)        DEFAULT NULL,
  `images`            JSON            DEFAULT (JSON_ARRAY()),
  `storage_image_ids` JSON            DEFAULT (JSON_ARRAY()),
  `is_active`         TINYINT         NOT NULL DEFAULT 1,
  `is_featured`       TINYINT         NOT NULL DEFAULT 0,
  `order_num`         INT             NOT NULL DEFAULT 0,
  `product_code`      VARCHAR(64)     DEFAULT NULL,
  `stock_quantity`    INT             NOT NULL DEFAULT 0,
  `rating`            DECIMAL(3,2)    NOT NULL DEFAULT '5.00',
  `review_count`      INT             NOT NULL DEFAULT 0,
  `botanical_name`    VARCHAR(255)    DEFAULT NULL,
  `planting_seasons`  JSON            DEFAULT (JSON_ARRAY()),
  `harvest_days`      INT             DEFAULT NULL,
  `climate_zones`     JSON            DEFAULT (JSON_ARRAY()),
  `soil_types`        JSON            DEFAULT (JSON_ARRAY()),
  `water_need`        VARCHAR(16)     DEFAULT NULL,
  `sun_exposure`      VARCHAR(16)     DEFAULT NULL,
  `min_temp`          DECIMAL(5,2)    DEFAULT NULL,
  `max_temp`          DECIMAL(5,2)    DEFAULT NULL,
  `germination_days`  INT             DEFAULT NULL,
  `seed_depth_cm`     DECIMAL(5,2)    DEFAULT NULL,
  `row_spacing_cm`    INT             DEFAULT NULL,
  `plant_spacing_cm`  INT             DEFAULT NULL,
  `yield_per_sqm`     VARCHAR(50)     DEFAULT NULL,
  `created_at`        DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`        DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_code_uq` (`product_code`),
  KEY `products_item_type_idx` (`item_type`),
  KEY `products_category_id_idx` (`category_id`),
  KEY `products_sub_category_id_idx` (`sub_category_id`),
  KEY `products_active_idx` (`is_active`),
  KEY `products_asset_idx` (`storage_asset_id`),
  KEY `products_order_idx` (`order_num`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_i18n` (
  `product_id`       CHAR(36)      NOT NULL,
  `locale`           VARCHAR(8)    NOT NULL DEFAULT 'tr',
  `title`            VARCHAR(255)  NOT NULL,
  `slug`             VARCHAR(255)  NOT NULL,
  `description`      TEXT          DEFAULT NULL,
  `alt`              VARCHAR(255)  DEFAULT NULL,
  `tags`             JSON          DEFAULT (JSON_ARRAY()),
  `specifications`   JSON          DEFAULT NULL,
  `meta_title`       VARCHAR(255)  DEFAULT NULL,
  `meta_description` VARCHAR(500)  DEFAULT NULL,
  `created_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`product_id`, `locale`),
  UNIQUE KEY `product_i18n_locale_slug_uq` (`locale`, `slug`),
  KEY `product_i18n_locale_idx` (`locale`),
  CONSTRAINT `fk_product_i18n_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_specs` (
  `id`          CHAR(36)    NOT NULL,
  `product_id`  CHAR(36)    NOT NULL,
  `locale`      VARCHAR(8)  NOT NULL DEFAULT 'tr',
  `name`        VARCHAR(255) NOT NULL,
  `value`       TEXT        NOT NULL,
  `category`    ENUM('physical','material','service','custom') NOT NULL DEFAULT 'custom',
  `order_num`   INT         NOT NULL DEFAULT 0,
  `created_at`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `product_specs_product_id_idx` (`product_id`),
  KEY `product_specs_product_locale_idx` (`product_id`, `locale`),
  KEY `product_specs_locale_idx` (`locale`),
  CONSTRAINT `fk_product_specs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_faqs` (
  `id`             CHAR(36)      NOT NULL,
  `product_id`     CHAR(36)      NOT NULL,
  `locale`         VARCHAR(8)    NOT NULL DEFAULT 'tr',
  `question`       VARCHAR(500)  NOT NULL,
  `answer`         TEXT          NOT NULL,
  `display_order`  INT           NOT NULL DEFAULT 0,
  `is_active`      TINYINT       NOT NULL DEFAULT 1,
  `created_at`     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `product_faqs_product_id_idx` (`product_id`),
  KEY `product_faqs_order_idx` (`display_order`),
  KEY `product_faqs_product_locale_idx` (`product_id`, `locale`),
  KEY `product_faqs_locale_idx` (`locale`),
  CONSTRAINT `fk_product_faqs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id`             CHAR(36)      NOT NULL,
  `product_id`     CHAR(36)      NOT NULL,
  `user_id`        CHAR(36)      DEFAULT NULL,
  `rating`         INT           NOT NULL,
  `comment`        TEXT          DEFAULT NULL,
  `is_active`      TINYINT       NOT NULL DEFAULT 1,
  `customer_name`  VARCHAR(255)  DEFAULT NULL,
  `review_date`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_at`     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `product_reviews_product_id_idx` (`product_id`),
  KEY `product_reviews_approved_idx` (`product_id`, `is_active`),
  KEY `product_reviews_rating_idx` (`rating`),
  CONSTRAINT `fk_product_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_options` (
  `id`             CHAR(36)      NOT NULL,
  `product_id`     CHAR(36)      NOT NULL,
  `option_name`    VARCHAR(100)  NOT NULL,
  `option_values`  JSON          NOT NULL,
  `created_at`     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `product_options_product_id_idx` (`product_id`),
  CONSTRAINT `fk_product_options_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_stock` (
  `id`             CHAR(36)      NOT NULL,
  `product_id`     CHAR(36)      NOT NULL,
  `stock_content`  VARCHAR(255)  NOT NULL,
  `is_used`        TINYINT       NOT NULL DEFAULT 0,
  `used_at`        DATETIME(3)   DEFAULT NULL,
  `created_at`     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `order_item_id`  CHAR(36)      DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_stock_product_id_idx` (`product_id`),
  KEY `product_stock_is_used_idx` (`product_id`, `is_used`),
  KEY `product_stock_order_item_id_idx` (`order_item_id`),
  CONSTRAINT `fk_product_stock_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_images` (
  `id`              CHAR(36)      NOT NULL,
  `product_id`      CHAR(36)      NOT NULL,
  `locale`          VARCHAR(8)    NOT NULL DEFAULT 'tr',
  `image_url`       LONGTEXT      NOT NULL,
  `image_asset_id`  CHAR(36)      DEFAULT NULL,
  `title`           VARCHAR(255)  DEFAULT NULL,
  `alt`             VARCHAR(255)  DEFAULT NULL,
  `caption`         TEXT          DEFAULT NULL,
  `display_order`   INT           NOT NULL DEFAULT 0,
  `is_active`       TINYINT       NOT NULL DEFAULT 1,
  `created_at`      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_idx` (`product_id`),
  KEY `product_images_product_locale_idx` (`product_id`, `locale`),
  KEY `product_images_order_idx` (`product_id`, `display_order`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Kategorileri güncelle: ANAC ve BIBER
-- =============================================================

UPDATE `categories` SET `icon` = 'sprout', `display_order` = 1
  WHERE `id` = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1';
UPDATE `categories` SET `icon` = 'pepper', `display_order` = 2
  WHERE `id` = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2';

UPDATE `category_i18n` SET `name` = 'Anaç', `slug` = 'anac', `description` = 'Anaç (Rootstock) çeşitleri'
  WHERE `category_id` = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1' AND `locale` = 'tr';
UPDATE `category_i18n` SET `name` = 'Biber', `slug` = 'biber', `description` = 'F1 hibrit biber çeşitleri'
  WHERE `category_id` = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2' AND `locale` = 'tr';

-- Kullanılmayan kategorileri deaktif et
UPDATE `categories` SET `is_active` = 0 WHERE `id` IN (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4'
);

-- =============================================================
-- STORAGE ASSETS: ürün görselleri (gerçek fotoğraflar)
-- =============================================================

INSERT INTO `storage_assets`
  (`id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `url`, `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`)
VALUES
-- LUCKY F1 - Charliston (5 görsel)
('00009400-0000-4000-8000-000000000201','lucky-f1-charliston-01.jpeg','default','products/lucky-f1-charliston-01.jpeg','products','image/jpeg',146398,'/uploads/products/lucky-f1-charliston-01.jpeg','local','products/lucky-f1-charliston-01.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000202','lucky-f1-charliston-02.jpeg','default','products/lucky-f1-charliston-02.jpeg','products','image/jpeg',267360,'/uploads/products/lucky-f1-charliston-02.jpeg','local','products/lucky-f1-charliston-02.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000203','lucky-f1-charliston-03.jpeg','default','products/lucky-f1-charliston-03.jpeg','products','image/jpeg',205303,'/uploads/products/lucky-f1-charliston-03.jpeg','local','products/lucky-f1-charliston-03.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000204','lucky-f1-charliston-04.jpeg','default','products/lucky-f1-charliston-04.jpeg','products','image/jpeg',211174,'/uploads/products/lucky-f1-charliston-04.jpeg','local','products/lucky-f1-charliston-04.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000205','lucky-f1-charliston-05.jpeg','default','products/lucky-f1-charliston-05.jpeg','products','image/jpeg',196557,'/uploads/products/lucky-f1-charliston-05.jpeg','local','products/lucky-f1-charliston-05.jpeg','image','jpeg'),
-- BİRLİK F1 - Üçburun (1 görsel)
('00009400-0000-4000-8000-000000000206','birlik-f1-ucburun-01.jpeg','default','products/birlik-f1-ucburun-01.jpeg','products','image/jpeg',156745,'/uploads/products/birlik-f1-ucburun-01.jpeg','local','products/birlik-f1-ucburun-01.jpeg','image','jpeg'),
-- SARAY F1 - Dolma (5 görsel)
('00009400-0000-4000-8000-000000000207','saray-f1-dolma-01.jpeg','default','products/saray-f1-dolma-01.jpeg','products','image/jpeg',76003,'/uploads/products/saray-f1-dolma-01.jpeg','local','products/saray-f1-dolma-01.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000208','saray-f1-dolma-02.jpeg','default','products/saray-f1-dolma-02.jpeg','products','image/jpeg',243361,'/uploads/products/saray-f1-dolma-02.jpeg','local','products/saray-f1-dolma-02.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000209','saray-f1-dolma-03.jpeg','default','products/saray-f1-dolma-03.jpeg','products','image/jpeg',107384,'/uploads/products/saray-f1-dolma-03.jpeg','local','products/saray-f1-dolma-03.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000210','saray-f1-dolma-04.jpeg','default','products/saray-f1-dolma-04.jpeg','products','image/jpeg',246754,'/uploads/products/saray-f1-dolma-04.jpeg','local','products/saray-f1-dolma-04.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000211','saray-f1-dolma-05.jpeg','default','products/saray-f1-dolma-05.jpeg','products','image/jpeg',214651,'/uploads/products/saray-f1-dolma-05.jpeg','local','products/saray-f1-dolma-05.jpeg','image','jpeg'),
-- PRESTİJ F1 - Tatlı Kıl (2 görsel)
('00009400-0000-4000-8000-000000000212','prestij-f1-tatli-kil-01.jpeg','default','products/prestij-f1-tatli-kil-01.jpeg','products','image/jpeg',115344,'/uploads/products/prestij-f1-tatli-kil-01.jpeg','local','products/prestij-f1-tatli-kil-01.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000213','prestij-f1-tatli-kil-02.jpeg','default','products/prestij-f1-tatli-kil-02.jpeg','products','image/jpeg',185574,'/uploads/products/prestij-f1-tatli-kil-02.jpeg','local','products/prestij-f1-tatli-kil-02.jpeg','image','jpeg'),
-- KIZGIN F1 - Acı Kıl (3 görsel)
('00009400-0000-4000-8000-000000000214','kizgin-f1-aci-kil-01.jpeg','default','products/kizgin-f1-aci-kil-01.jpeg','products','image/jpeg',66271,'/uploads/products/kizgin-f1-aci-kil-01.jpeg','local','products/kizgin-f1-aci-kil-01.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000215','kizgin-f1-aci-kil-02.jpeg','default','products/kizgin-f1-aci-kil-02.jpeg','products','image/jpeg',66271,'/uploads/products/kizgin-f1-aci-kil-02.jpeg','local','products/kizgin-f1-aci-kil-02.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000216','kizgin-f1-aci-kil-03.jpeg','default','products/kizgin-f1-aci-kil-03.jpeg','products','image/jpeg',239905,'/uploads/products/kizgin-f1-aci-kil-03.jpeg','local','products/kizgin-f1-aci-kil-03.jpeg','image','jpeg'),
-- TIRPAN F1 - Kapya (4 görsel)
('00009400-0000-4000-8000-000000000217','tirpan-f1-kapya-01.jpeg','default','products/tirpan-f1-kapya-01.jpeg','products','image/jpeg',98686,'/uploads/products/tirpan-f1-kapya-01.jpeg','local','products/tirpan-f1-kapya-01.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000218','tirpan-f1-kapya-02.jpeg','default','products/tirpan-f1-kapya-02.jpeg','products','image/jpeg',128580,'/uploads/products/tirpan-f1-kapya-02.jpeg','local','products/tirpan-f1-kapya-02.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000219','tirpan-f1-kapya-03.jpeg','default','products/tirpan-f1-kapya-03.jpeg','products','image/jpeg',150639,'/uploads/products/tirpan-f1-kapya-03.jpeg','local','products/tirpan-f1-kapya-03.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000220','tirpan-f1-kapya-04.jpeg','default','products/tirpan-f1-kapya-04.jpeg','products','image/jpeg',150681,'/uploads/products/tirpan-f1-kapya-04.jpeg','local','products/tirpan-f1-kapya-04.jpeg','image','jpeg'),
-- CANKAN F1 - Kapya (3 görsel)
('00009400-0000-4000-8000-000000000221','cankan-f1-kapya-01.jpeg','default','products/cankan-f1-kapya-01.jpeg','products','image/jpeg',89118,'/uploads/products/cankan-f1-kapya-01.jpeg','local','products/cankan-f1-kapya-01.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000222','cankan-f1-kapya-02.jpeg','default','products/cankan-f1-kapya-02.jpeg','products','image/jpeg',194905,'/uploads/products/cankan-f1-kapya-02.jpeg','local','products/cankan-f1-kapya-02.jpeg','image','jpeg'),
('00009400-0000-4000-8000-000000000223','cankan-f1-kapya-03.jpeg','default','products/cankan-f1-kapya-03.jpeg','products','image/jpeg',174322,'/uploads/products/cankan-f1-kapya-03.jpeg','local','products/cankan-f1-kapya-03.jpeg','image','jpeg');

-- =============================================================
-- SEED: 8 ürün (1 ANAC + 7 BIBER)
-- =============================================================

-- Kategori ID referansları:
-- ANAC  = aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1
-- BIBER = aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2

INSERT INTO `products` (`id`, `item_type`, `category_id`, `price`, `image_url`, `storage_asset_id`, `images`, `storage_image_ids`, `is_active`, `is_featured`, `order_num`, `product_code`) VALUES
('pppppppp-0001-4000-8000-000000000001', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1250.00', NULL, NULL, '[]', '[]', 1, 1, 1, 'VS-ANAC-001'),
('pppppppp-0001-4000-8000-000000000002', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '850.00', '/uploads/products/lucky-f1-charliston-01.jpeg', '00009400-0000-4000-8000-000000000201', '["/uploads/products/lucky-f1-charliston-01.jpeg","/uploads/products/lucky-f1-charliston-02.jpeg","/uploads/products/lucky-f1-charliston-03.jpeg","/uploads/products/lucky-f1-charliston-04.jpeg","/uploads/products/lucky-f1-charliston-05.jpeg"]', '["00009400-0000-4000-8000-000000000201","00009400-0000-4000-8000-000000000202","00009400-0000-4000-8000-000000000203","00009400-0000-4000-8000-000000000204","00009400-0000-4000-8000-000000000205"]', 1, 1, 2, 'VS-BIB-001'),
('pppppppp-0001-4000-8000-000000000003', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '820.00', '/uploads/products/kizgin-f1-aci-kil-01.jpeg', '00009400-0000-4000-8000-000000000214', '["/uploads/products/kizgin-f1-aci-kil-01.jpeg","/uploads/products/kizgin-f1-aci-kil-02.jpeg","/uploads/products/kizgin-f1-aci-kil-03.jpeg"]', '["00009400-0000-4000-8000-000000000214","00009400-0000-4000-8000-000000000215","00009400-0000-4000-8000-000000000216"]', 1, 1, 3, 'VS-BIB-002'),
('pppppppp-0001-4000-8000-000000000004', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '840.00', '/uploads/products/prestij-f1-tatli-kil-01.jpeg', '00009400-0000-4000-8000-000000000212', '["/uploads/products/prestij-f1-tatli-kil-01.jpeg","/uploads/products/prestij-f1-tatli-kil-02.jpeg"]', '["00009400-0000-4000-8000-000000000212","00009400-0000-4000-8000-000000000213"]', 1, 1, 4, 'VS-BIB-003'),
('pppppppp-0001-4000-8000-000000000005', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '780.00', '/uploads/products/birlik-f1-ucburun-01.jpeg', '00009400-0000-4000-8000-000000000206', '["/uploads/products/birlik-f1-ucburun-01.jpeg"]', '["00009400-0000-4000-8000-000000000206"]', 1, 1, 5, 'VS-BIB-004'),
('pppppppp-0001-4000-8000-000000000006', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '860.00', '/uploads/products/cankan-f1-kapya-01.jpeg', '00009400-0000-4000-8000-000000000221', '["/uploads/products/cankan-f1-kapya-01.jpeg","/uploads/products/cankan-f1-kapya-02.jpeg","/uploads/products/cankan-f1-kapya-03.jpeg"]', '["00009400-0000-4000-8000-000000000221","00009400-0000-4000-8000-000000000222","00009400-0000-4000-8000-000000000223"]', 1, 1, 6, 'VS-BIB-005'),
('pppppppp-0001-4000-8000-000000000007', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '870.00', '/uploads/products/tirpan-f1-kapya-01.jpeg', '00009400-0000-4000-8000-000000000217', '["/uploads/products/tirpan-f1-kapya-01.jpeg","/uploads/products/tirpan-f1-kapya-02.jpeg","/uploads/products/tirpan-f1-kapya-03.jpeg","/uploads/products/tirpan-f1-kapya-04.jpeg"]', '["00009400-0000-4000-8000-000000000217","00009400-0000-4000-8000-000000000218","00009400-0000-4000-8000-000000000219","00009400-0000-4000-8000-000000000220"]', 1, 1, 7, 'VS-BIB-006'),
('pppppppp-0001-4000-8000-000000000008', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '800.00', '/uploads/products/saray-f1-dolma-01.jpeg', '00009400-0000-4000-8000-000000000207', '["/uploads/products/saray-f1-dolma-01.jpeg","/uploads/products/saray-f1-dolma-02.jpeg","/uploads/products/saray-f1-dolma-03.jpeg","/uploads/products/saray-f1-dolma-04.jpeg","/uploads/products/saray-f1-dolma-05.jpeg"]', '["00009400-0000-4000-8000-000000000207","00009400-0000-4000-8000-000000000208","00009400-0000-4000-8000-000000000209","00009400-0000-4000-8000-000000000210","00009400-0000-4000-8000-000000000211"]', 1, 1, 8, 'VS-BIB-007');

-- =============================================================
-- SEED: product_i18n (TR)
-- =============================================================

INSERT INTO `product_i18n` (`product_id`, `locale`, `title`, `slug`, `description`, `alt`, `tags`, `meta_title`, `meta_description`) VALUES
('pppppppp-0001-4000-8000-000000000001', 'tr', 'AVAR', 'avar',
 'AVAR anaç çeşidi, güçlü kök yapısı ve yüksek adaptasyon kabiliyeti ile öne çıkar. Farklı toprak ve iklim koşullarında üstün performans gösterir. Dayanıklı kök sistemi sayesinde aşılı bitkilere güçlü bir temel sağlar.',
 'AVAR anaç tohumu',
 '["anaç","rootstock","dayanıklı","adaptasyon"]',
 'AVAR Anaç Çeşidi | Vista Seeds',
 'AVAR anaç çeşidi - güçlü kök yapısı, yüksek adaptasyon, dayanıklı kök sistemi. Vista Seeds tescilli tohum.'),

('pppppppp-0001-4000-8000-000000000002', 'tr', 'LUCKY F1 Charliston Biber', 'lucky-f1',
 'Meyve uzunluğu 21-23 cm. Güz, tek ekim ve yayla yetiştiriciliğine uygundur. TSWV ve Tm:0-2''ye toleranslıdır. Meyve rengi parlak, koyu yeşil renkli charliston biberdir. Meyve eti orta kalın, yüzeyi pürüzsüzdür. Soğuk performansı yüksektir. Meyve kalitesi mükemmel, raf ömrü uzundur. Meyvesi %100 tatlıdır.',
 'LUCKY F1 charliston biber tohumu',
 '["biber","f1","hibrit","charliston","tatlı","sera","yayla","bahar","yaz"]',
 'LUCKY F1 Charliston Biber Tohumu | Vista Seeds',
 'LUCKY F1 charliston biber - 21-23 cm, parlak koyu yeşil, TSWV toleranslı, %100 tatlı, soğuk performansı yüksektir.'),

('pppppppp-0001-4000-8000-000000000003', 'tr', 'KIZGIN F1 Acı Kıl Biber', 'kizgin-f1',
 'Meyve uzunluğu 23-25 cm. Güz ve bahar yetiştiriciliğine uygundur. Sera ve açık tarla yetiştiriciliğine uygundur. TSWV''ye toleranslıdır. Bitki yapısı güçlü kıl biber formundadır. Meyveleri yeşil ve düz meyve yapısına sahiptir. Meyveleri acıdır.',
 'KIZGIN F1 acı kıl biber tohumu',
 '["biber","f1","hibrit","acı","kıl-biber","sera","açık-tarla","bahar","güz"]',
 'KIZGIN F1 Acı Kıl Biber Tohumu | Vista Seeds',
 'KIZGIN F1 acı kıl biber - 23-25 cm, TSWV toleranslı, güçlü bitki yapısı, sera ve açık tarla uyumlu.'),

('pppppppp-0001-4000-8000-000000000004', 'tr', 'PRESTİJ F1 Tatlı Kıl Biber', 'prestij-f1',
 'Meyve uzunluğu 22-24 cm. Güz ve tek ekim yetiştiriciliğine uygundur. Sera yetiştiriciliğine uygundur. TSWV''ye toleranslıdır. Bitki yapısı güçlü kıl biber formundadır. Meyveleri yeşil ve düz meyve şekline sahiptir. Soğuk performansı yüksektir. Meyveleri %100 tatlıdır.',
 'PRESTİJ F1 tatlı kıl biber tohumu',
 '["biber","f1","hibrit","tatlı","kıl-biber","sera","soğuk-performansı","bahar","kış"]',
 'PRESTİJ F1 Tatlı Kıl Biber Tohumu | Vista Seeds',
 'PRESTİJ F1 tatlı kıl biber - 22-24 cm, TSWV toleranslı, %100 tatlı, soğuk performansı yüksek.'),

('pppppppp-0001-4000-8000-000000000005', 'tr', 'BİRLİK F1 Üçburun Biber', 'birlik-f1',
 'Meyve uzunluğu 16-18 cm. Güz ve tek ekim yetiştiriciliğine uygundur. Sera yetiştiriciliğine uygundur. TSWV ve Tm: 0-2''ye toleranslıdır. Bitki yapısı güçlü Türk tipi kahvaltılık biber formundadır. Meyveleri parlak, yeşil renkli, ince kabuklu ve erkencidir. Soğuk performansı yüksektir.',
 'BİRLİK F1 üçburun biber tohumu',
 '["biber","f1","hibrit","üçburun","kahvaltılık","sera","erkenci","bahar"]',
 'BİRLİK F1 Üçburun Biber Tohumu | Vista Seeds',
 'BİRLİK F1 üçburun biber - 16-18 cm, Türk tipi kahvaltılık, TSWV toleranslı, ince kabuklu ve erkenci.'),

('pppppppp-0001-4000-8000-000000000006', 'tr', 'CANKAN F1 Kapya Biber', 'cankan-f1',
 'Meyve uzunluğu 18-20 cm. Güz ve bahar yetiştiriciliğine uygundur. Sera ve açık tarla yetiştiriciliğine uygundur. TSWV''ye toleranslıdır. Bitki yapısı güçlü kapya biber formundadır. Meyveleri koyu kırmızı renkli, düz ve konik şekillidir. Adaptasyon kabiliyeti yüksektir. Meyveleri %100 tatlıdır.',
 'CANKAN F1 kapya biber tohumu',
 '["biber","f1","hibrit","kapya","kırmızı","sera","açık-tarla"]',
 'CANKAN F1 Kapya Biber Tohumu | Vista Seeds',
 'CANKAN F1 kapya biber - 18-20 cm, koyu kırmızı, TSWV toleranslı, %100 tatlı, yüksek adaptasyon.'),

('pppppppp-0001-4000-8000-000000000007', 'tr', 'TIRPAN F1 Kapya Biber', 'tirpan-f1',
 'Meyve uzunluğu 19-21 cm. Güz ve bahar yetiştiriciliğine uygundur. Sera yetiştiriciliğine uygundur. TSWV''ye toleranslıdır. Bitki yapısı güçlü kapya biber formundadır. Meyveleri koyu kırmızı renkli, düz ve konik şekillidir. Sıcak tutumu çok iyi olup çatlama ve cracking yapmaz. Adaptasyon kabiliyeti yüksektir. Meyveleri %100 tatlıdır.',
 'TIRPAN F1 kapya biber tohumu',
 '["biber","f1","hibrit","kapya","kırmızı","sera","çatlama-yapmaz"]',
 'TIRPAN F1 Kapya Biber Tohumu | Vista Seeds',
 'TIRPAN F1 kapya biber - 19-21 cm, koyu kırmızı, TSWV toleranslı, %100 tatlı, çatlama yapmaz.'),

('pppppppp-0001-4000-8000-000000000008', 'tr', 'SARAY F1 Dolma Biber', 'saray-f1',
 'Güz ve bahar yetiştiriciliğine uygundur. Sera ve açık tarla yetiştiriciliğine uygundur. TSWV''ye toleranslıdır. Bitki yapısı orta güçlü dolma biber formundadır. Meyveleri koyu yeşil renkli ve kalın kabukludur. Meyveleri 3-4 lobludur.',
 'SARAY F1 dolma biber tohumu',
 '["biber","f1","hibrit","dolma","kalın-kabuk","sera","açık-tarla"]',
 'SARAY F1 Dolma Biber Tohumu | Vista Seeds',
 'SARAY F1 dolma biber - koyu yeşil, kalın kabuklu, 3-4 loblu, TSWV toleranslı, sera ve açık tarla uyumlu.');

-- =============================================================
-- SEED: product_i18n (EN)
-- =============================================================

INSERT INTO `product_i18n` (`product_id`, `locale`, `title`, `slug`, `description`, `alt`, `tags`, `meta_title`, `meta_description`) VALUES
('pppppppp-0001-4000-8000-000000000001', 'en', 'AVAR', 'avar',
 'AVAR rootstock variety stands out with its strong root structure and high adaptability. It shows superior performance in different soil and climate conditions. Thanks to its durable root system, it provides a strong foundation for grafted plants.',
 'AVAR rootstock seed',
 '["rootstock","durable","adaptation","grafting"]',
 'AVAR Rootstock Variety | Vista Seeds',
 'AVAR rootstock variety - strong root structure, high adaptation, durable root system.'),

('pppppppp-0001-4000-8000-000000000002', 'en', 'LUCKY F1 Charleston Pepper', 'lucky-f1',
 'Fruit length 21-23 cm. Suitable for autumn, single planting and highland cultivation. Tolerant to TSWV, Tm:0-2. Bright, dark green colored charleston pepper. Medium thick fruit flesh with smooth surface. High cold performance. Excellent fruit quality with long shelf life. 100% sweet fruits.',
 'LUCKY F1 charleston pepper seed',
 '["pepper","f1","hybrid","charleston","sweet","greenhouse","highland"]',
 'LUCKY F1 Charleston Pepper Seed | Vista Seeds',
 'LUCKY F1 charleston pepper - 21-23 cm, bright dark green, TSWV tolerant, 100% sweet, high cold performance.'),

('pppppppp-0001-4000-8000-000000000003', 'en', 'KIZGIN F1 Hot Thin Pepper', 'kizgin-f1',
 'Fruit length 23-25 cm. Suitable for autumn and spring cultivation. Suitable for greenhouse and open field cultivation. Tolerant to TSWV. Strong plant structure thin pepper. Fruits are green with straight fruit shape. Fruits are hot.',
 'KIZGIN F1 hot thin pepper seed',
 '["pepper","f1","hybrid","hot","thin-pepper","greenhouse","open-field"]',
 'KIZGIN F1 Hot Thin Pepper Seed | Vista Seeds',
 'KIZGIN F1 hot thin pepper - 23-25 cm, TSWV tolerant, strong plant structure, greenhouse and open field.'),

('pppppppp-0001-4000-8000-000000000004', 'en', 'PRESTIJ F1 Sweet Thin Pepper', 'prestij-f1',
 'Fruit length 22-24 cm. Suitable for autumn and single planting cultivation. Suitable for greenhouse cultivation. Tolerant to TSWV. Strong plant structure thin pepper. Fruits are green with straight fruit shape. High cold performance. 100% sweet fruits.',
 'PRESTIJ F1 sweet thin pepper seed',
 '["pepper","f1","hybrid","sweet","thin-pepper","greenhouse","cold-performance"]',
 'PRESTIJ F1 Sweet Thin Pepper Seed | Vista Seeds',
 'PRESTIJ F1 sweet thin pepper - 22-24 cm, TSWV tolerant, 100% sweet, high cold performance.'),

('pppppppp-0001-4000-8000-000000000005', 'en', 'BIRLIK F1 Turkish Breakfast Pepper', 'birlik-f1',
 'Fruit length 16-18 cm. Suitable for autumn and single planting cultivation. Suitable for greenhouse cultivation. Tolerant to TSWV, Tm: 0-2. Strong plant structure Turkish type breakfast pepper. Fruits are bright, green colored, thin-skinned and early maturing. High cold performance.',
 'BIRLIK F1 breakfast pepper seed',
 '["pepper","f1","hybrid","breakfast","turkish","greenhouse","early"]',
 'BIRLIK F1 Turkish Breakfast Pepper Seed | Vista Seeds',
 'BIRLIK F1 breakfast pepper - 16-18 cm, Turkish type, TSWV tolerant, thin-skinned, early maturing.'),

('pppppppp-0001-4000-8000-000000000006', 'en', 'CANKAN F1 Kapia Pepper', 'cankan-f1',
 'Fruit length 18-20 cm. Suitable for autumn and spring cultivation. Suitable for greenhouse and open field cultivation. Tolerant to TSWV. Strong plant structure kapia pepper. Fruits are dark red colored, straight and conical shaped. High adaptation capability. 100% sweet fruits.',
 'CANKAN F1 kapia pepper seed',
 '["pepper","f1","hybrid","kapia","red","greenhouse","open-field"]',
 'CANKAN F1 Kapia Pepper Seed | Vista Seeds',
 'CANKAN F1 kapia pepper - 18-20 cm, dark red, TSWV tolerant, 100% sweet, high adaptation.'),

('pppppppp-0001-4000-8000-000000000007', 'en', 'TIRPAN F1 Kapia Pepper', 'tirpan-f1',
 'Fruit length 19-21 cm. Suitable for autumn and spring cultivation. Suitable for greenhouse cultivation. Tolerant to TSWV. Strong plant structure kapia pepper. Fruits are dark red colored, straight and conical shaped. Excellent heat retention, no cracking. High adaptation capability. 100% sweet fruits.',
 'TIRPAN F1 kapia pepper seed',
 '["pepper","f1","hybrid","kapia","red","greenhouse","no-cracking"]',
 'TIRPAN F1 Kapia Pepper Seed | Vista Seeds',
 'TIRPAN F1 kapia pepper - 19-21 cm, dark red, TSWV tolerant, 100% sweet, no cracking.'),

('pppppppp-0001-4000-8000-000000000008', 'en', 'SARAY F1 Stuffing Pepper', 'saray-f1',
 'Suitable for autumn and spring cultivation. Suitable for greenhouse and open field cultivation. Tolerant to TSWV. Medium-strong plant structure stuffing pepper. Fruits are dark green colored with thick skin. Fruits have 3-4 lobes.',
 'SARAY F1 stuffing pepper seed',
 '["pepper","f1","hybrid","stuffing","thick-skin","greenhouse","open-field"]',
 'SARAY F1 Stuffing Pepper Seed | Vista Seeds',
 'SARAY F1 stuffing pepper - dark green, thick-skinned, 3-4 lobed, TSWV tolerant, greenhouse and open field.');

-- =============================================================
-- SEED: product_specs (TR) - her ürün için 3-4 spec
-- =============================================================

INSERT INTO `product_specs` (`id`, `product_id`, `locale`, `name`, `value`, `category`, `order_num`) VALUES
-- AVAR
('ssssssss-0001-4000-8000-000000000001', 'pppppppp-0001-4000-8000-000000000001', 'tr', 'Kök Gücü', 'Çok Yüksek', 'physical', 1),
('ssssssss-0001-4000-8000-000000000002', 'pppppppp-0001-4000-8000-000000000001', 'tr', 'Adaptasyon', 'Geniş iklim aralığı', 'physical', 2),
('ssssssss-0001-4000-8000-000000000003', 'pppppppp-0001-4000-8000-000000000001', 'tr', 'Kullanım Alanı', 'Aşı anaçlık', 'custom', 3),
-- LUCKY F1 Charliston
('ssssssss-0001-4000-8000-000000000004', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Meyve Tipi', 'Charliston', 'physical', 1),
('ssssssss-0001-4000-8000-000000000005', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Meyve Boyu', '21-23 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000006', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Yetiştirme', 'Güz, Tek ekim, Yayla', 'custom', 3),
('ssssssss-0001-4000-8000-000000000025', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Hastalıklara Tolerans', 'TSWV, Tm:0-2', 'material', 4),
('ssssssss-0001-4000-8000-000000000026', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Tat', '%100 Tatlı', 'physical', 5),
('ssssssss-0001-4000-8000-000000000027', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Soğuk Performansı', 'Yüksek', 'physical', 6),
-- KIZGIN F1 Acı Kıl
('ssssssss-0001-4000-8000-000000000007', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Meyve Tipi', 'Acı Kıl Biber', 'physical', 1),
('ssssssss-0001-4000-8000-000000000008', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Meyve Boyu', '23-25 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000009', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Hastalıklara Tolerans', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000028', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Yetiştirme', 'Güz, Bahar / Sera, Açık Tarla', 'custom', 4),
('ssssssss-0001-4000-8000-000000000029', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Tat', 'Acı', 'physical', 5),
-- PRESTİJ F1 Tatlı Kıl
('ssssssss-0001-4000-8000-000000000010', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Meyve Tipi', 'Tatlı Kıl Biber', 'physical', 1),
('ssssssss-0001-4000-8000-000000000011', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Meyve Boyu', '22-24 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000012', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Hastalıklara Tolerans', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000030', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Yetiştirme', 'Güz, Tek ekim / Sera', 'custom', 4),
('ssssssss-0001-4000-8000-000000000031', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Tat', '%100 Tatlı', 'physical', 5),
('ssssssss-0001-4000-8000-000000000032', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Soğuk Performansı', 'Yüksek', 'physical', 6),
-- BİRLİK F1 Üçburun
('ssssssss-0001-4000-8000-000000000013', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Meyve Tipi', 'Üçburun Biber (Kahvaltılık)', 'physical', 1),
('ssssssss-0001-4000-8000-000000000014', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Meyve Boyu', '16-18 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000015', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Hastalıklara Tolerans', 'TSWV, Tm:0-2', 'material', 3),
('ssssssss-0001-4000-8000-000000000033', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Yetiştirme', 'Güz, Tek ekim / Sera', 'custom', 4),
('ssssssss-0001-4000-8000-000000000034', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Kabuk', 'İnce kabuklu, erkenci', 'physical', 5),
('ssssssss-0001-4000-8000-000000000035', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Soğuk Performansı', 'Yüksek', 'physical', 6),
-- CANKAN F1 Kapya
('ssssssss-0001-4000-8000-000000000016', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Meyve Tipi', 'Kapya Biber', 'physical', 1),
('ssssssss-0001-4000-8000-000000000017', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Meyve Boyu', '18-20 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000018', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Hastalıklara Tolerans', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000036', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Yetiştirme', 'Güz, Bahar / Sera, Açık Tarla', 'custom', 4),
('ssssssss-0001-4000-8000-000000000037', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Tat', '%100 Tatlı', 'physical', 5),
('ssssssss-0001-4000-8000-000000000038', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Renk', 'Koyu kırmızı', 'physical', 6),
-- TIRPAN F1 Kapya
('ssssssss-0001-4000-8000-000000000019', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Meyve Tipi', 'Kapya Biber', 'physical', 1),
('ssssssss-0001-4000-8000-000000000020', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Meyve Boyu', '19-21 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000021', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Hastalıklara Tolerans', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000039', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Yetiştirme', 'Güz, Bahar / Sera', 'custom', 4),
('ssssssss-0001-4000-8000-000000000040', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Tat', '%100 Tatlı', 'physical', 5),
('ssssssss-0001-4000-8000-000000000041', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Renk', 'Koyu kırmızı', 'physical', 6),
('ssssssss-0001-4000-8000-000000000042', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Özellik', 'Çatlama ve cracking yapmaz', 'physical', 7),
-- SARAY F1 Dolma
('ssssssss-0001-4000-8000-000000000022', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Meyve Tipi', 'Dolma Biber', 'physical', 1),
('ssssssss-0001-4000-8000-000000000023', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Lob Sayısı', '3-4 loblu', 'physical', 2),
('ssssssss-0001-4000-8000-000000000024', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Hastalıklara Tolerans', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000043', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Yetiştirme', 'Güz, Bahar / Sera, Açık Tarla', 'custom', 4),
('ssssssss-0001-4000-8000-000000000044', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Kabuk', 'Kalın kabuklu', 'physical', 5),
('ssssssss-0001-4000-8000-000000000045', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Renk', 'Koyu yeşil', 'physical', 6);

-- =============================================================
-- SEED: product_specs (EN)
-- =============================================================

INSERT INTO `product_specs` (`id`, `product_id`, `locale`, `name`, `value`, `category`, `order_num`) VALUES
-- AVAR
('ssssssss-0001-4000-8000-000000000101', 'pppppppp-0001-4000-8000-000000000001', 'en', 'Root Strength', 'Very High', 'physical', 1),
('ssssssss-0001-4000-8000-000000000102', 'pppppppp-0001-4000-8000-000000000001', 'en', 'Adaptation', 'Wide climate range', 'physical', 2),
('ssssssss-0001-4000-8000-000000000103', 'pppppppp-0001-4000-8000-000000000001', 'en', 'Usage Area', 'Grafting rootstock', 'custom', 3),
-- LUCKY F1 Charleston
('ssssssss-0001-4000-8000-000000000104', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Fruit Type', 'Charleston', 'physical', 1),
('ssssssss-0001-4000-8000-000000000105', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Fruit Length', '21-23 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000106', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Cultivation', 'Autumn, Single planting, Highland', 'custom', 3),
('ssssssss-0001-4000-8000-000000000125', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Disease Tolerance', 'TSWV, Tm:0-2', 'material', 4),
('ssssssss-0001-4000-8000-000000000126', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Taste', '100% Sweet', 'physical', 5),
('ssssssss-0001-4000-8000-000000000127', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Cold Performance', 'High', 'physical', 6),
-- KIZGIN F1 Hot Thin
('ssssssss-0001-4000-8000-000000000107', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Fruit Type', 'Hot Thin Pepper', 'physical', 1),
('ssssssss-0001-4000-8000-000000000108', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Fruit Length', '23-25 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000109', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Disease Tolerance', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000128', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Cultivation', 'Autumn, Spring / Greenhouse, Open Field', 'custom', 4),
('ssssssss-0001-4000-8000-000000000129', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Taste', 'Hot', 'physical', 5),
-- PRESTIJ F1 Sweet Thin
('ssssssss-0001-4000-8000-000000000110', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Fruit Type', 'Sweet Thin Pepper', 'physical', 1),
('ssssssss-0001-4000-8000-000000000111', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Fruit Length', '22-24 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000112', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Disease Tolerance', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000130', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Cultivation', 'Autumn, Single planting / Greenhouse', 'custom', 4),
('ssssssss-0001-4000-8000-000000000131', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Taste', '100% Sweet', 'physical', 5),
('ssssssss-0001-4000-8000-000000000132', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Cold Performance', 'High', 'physical', 6),
-- BIRLIK F1 Breakfast
('ssssssss-0001-4000-8000-000000000113', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Fruit Type', 'Turkish Breakfast Pepper', 'physical', 1),
('ssssssss-0001-4000-8000-000000000114', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Fruit Length', '16-18 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000115', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Disease Tolerance', 'TSWV, Tm:0-2', 'material', 3),
('ssssssss-0001-4000-8000-000000000133', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Cultivation', 'Autumn, Single planting / Greenhouse', 'custom', 4),
('ssssssss-0001-4000-8000-000000000134', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Skin', 'Thin-skinned, early maturing', 'physical', 5),
('ssssssss-0001-4000-8000-000000000135', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Cold Performance', 'High', 'physical', 6),
-- CANKAN F1 Kapia
('ssssssss-0001-4000-8000-000000000116', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Fruit Type', 'Kapia Pepper', 'physical', 1),
('ssssssss-0001-4000-8000-000000000117', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Fruit Length', '18-20 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000118', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Disease Tolerance', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000136', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Cultivation', 'Autumn, Spring / Greenhouse, Open Field', 'custom', 4),
('ssssssss-0001-4000-8000-000000000137', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Taste', '100% Sweet', 'physical', 5),
('ssssssss-0001-4000-8000-000000000138', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Color', 'Dark red', 'physical', 6),
-- TIRPAN F1 Kapia
('ssssssss-0001-4000-8000-000000000119', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Fruit Type', 'Kapia Pepper', 'physical', 1),
('ssssssss-0001-4000-8000-000000000120', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Fruit Length', '19-21 cm', 'physical', 2),
('ssssssss-0001-4000-8000-000000000121', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Disease Tolerance', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000139', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Cultivation', 'Autumn, Spring / Greenhouse', 'custom', 4),
('ssssssss-0001-4000-8000-000000000140', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Taste', '100% Sweet', 'physical', 5),
('ssssssss-0001-4000-8000-000000000141', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Color', 'Dark red', 'physical', 6),
('ssssssss-0001-4000-8000-000000000142', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Feature', 'No cracking', 'physical', 7),
-- SARAY F1 Stuffing
('ssssssss-0001-4000-8000-000000000122', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Fruit Type', 'Stuffing Pepper', 'physical', 1),
('ssssssss-0001-4000-8000-000000000123', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Lobe Count', '3-4 lobes', 'physical', 2),
('ssssssss-0001-4000-8000-000000000124', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Disease Tolerance', 'TSWV', 'material', 3),
('ssssssss-0001-4000-8000-000000000143', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Cultivation', 'Autumn, Spring / Greenhouse, Open Field', 'custom', 4),
('ssssssss-0001-4000-8000-000000000144', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Skin', 'Thick-skinned', 'physical', 5),
('ssssssss-0001-4000-8000-000000000145', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Color', 'Dark green', 'physical', 6);

-- =============================================================
-- SEED: product_reviews — örnek yorumlar
-- Canlı ortamda gerekirse silinebilir.
-- =============================================================

INSERT INTO `product_reviews` (`id`, `product_id`, `user_id`, `rating`, `comment`, `is_active`, `customer_name`, `review_date`) VALUES
-- LUCKY F1 Charliston (4 yorum, ort. 4.75)
('rrrrrrrr-0001-4000-8000-000000000001', 'pppppppp-0001-4000-8000-000000000002', NULL, 5, 'Serada diktik, soğuk kışta bile meyve verimi düşmedi. Parlak koyu yeşil rengi müşteriden tam puan aldı.', 1, 'Mehmet Yılmaz', '2025-11-15 10:30:00.000'),
('rrrrrrrr-0001-4000-8000-000000000002', 'pppppppp-0001-4000-8000-000000000002', NULL, 5, 'Raf ömrü gerçekten uzun, 10 gün sonra bile taze görünüyor. Yayla ekimi için ideal.', 1, 'Fatma Demir', '2025-12-02 14:15:00.000'),
('rrrrrrrr-0001-4000-8000-000000000003', 'pppppppp-0001-4000-8000-000000000002', NULL, 4, 'Verim iyi, meyve yapısı düzgün. Sadece ilk hasatta biraz küçük geldi, sonrakiler mükemmeldi.', 1, 'Hüseyin Kara', '2026-01-18 09:00:00.000'),
('rrrrrrrr-0001-4000-8000-000000000004', 'pppppppp-0001-4000-8000-000000000002', NULL, 5, 'Tatlılığı ve pürüzsüz yüzeyi ile pazarda en çok talep gören çeşidimiz oldu.', 1, 'Zeynep Aksoy', '2026-02-10 16:45:00.000'),

-- BİRLİK F1 Üçburun (3 yorum, ort. 4.67)
('rrrrrrrr-0001-4000-8000-000000000005', 'pppppppp-0001-4000-8000-000000000005', NULL, 5, 'Kahvaltılık olarak harika, ince kabuğuyla kavurma için de birebir. Erkenci olması büyük avantaj.', 1, 'Ali Öztürk', '2025-10-20 08:30:00.000'),
('rrrrrrrr-0001-4000-8000-000000000006', 'pppppppp-0001-4000-8000-000000000005', NULL, 5, 'Sera koşullarında çok başarılı, soğukta bile meyve bağlama oranı yüksek.', 1, 'Ayşe Çelik', '2025-11-28 11:00:00.000'),
('rrrrrrrr-0001-4000-8000-000000000007', 'pppppppp-0001-4000-8000-000000000005', NULL, 4, 'Genel olarak memnunum. Meyve boyu 16-17 cm arasında, tutarlı bir çeşit.', 1, 'Mustafa Şahin', '2026-01-05 13:20:00.000'),

-- SARAY F1 Dolma (4 yorum, ort. 4.50)
('rrrrrrrr-0001-4000-8000-000000000008', 'pppppppp-0001-4000-8000-000000000008', NULL, 5, 'Dolmalık için mükemmel, 3-4 loblu yapısıyla içi rahat dolduruluyor. Kalın kabuğu pişirmede avantaj.', 1, 'Hatice Yıldız', '2025-09-12 12:00:00.000'),
('rrrrrrrr-0001-4000-8000-000000000009', 'pppppppp-0001-4000-8000-000000000008', NULL, 4, 'Koyu yeşil renk ve kalın kabuk güzel ama bitki yapısı biraz daha güçlü olabilirdi.', 1, 'Recep Aydın', '2025-10-30 15:30:00.000'),
('rrrrrrrr-0001-4000-8000-000000000010', 'pppppppp-0001-4000-8000-000000000008', NULL, 5, 'Açık tarlada da iyi sonuç aldık. TSWV toleransı gerçekten işe yarıyor.', 1, 'Emine Polat', '2025-12-15 10:00:00.000'),
('rrrrrrrr-0001-4000-8000-000000000011', 'pppppppp-0001-4000-8000-000000000008', NULL, 4, 'Pazarda dolmalık biber deyince ilk tercihimiz. Loblu yapısı müşterinin dikkatini çekiyor.', 1, 'Hasan Korkmaz', '2026-02-22 08:45:00.000'),

-- PRESTİJ F1 Tatlı Kıl (3 yorum, ort. 4.67)
('rrrrrrrr-0001-4000-8000-000000000012', 'pppppppp-0001-4000-8000-000000000004', NULL, 5, '%100 tatlı olması en büyük avantajı. Müşteriler acı olmasından korkmadan alıyor.', 1, 'Sevgi Doğan', '2025-11-08 09:15:00.000'),
('rrrrrrrr-0001-4000-8000-000000000013', 'pppppppp-0001-4000-8000-000000000004', NULL, 5, 'Düz meyve şekli ve yeşil rengiyle görüntüsü çok güzel. Soğukta bile verim düşmedi.', 1, 'İbrahim Taş', '2025-12-25 14:00:00.000'),
('rrrrrrrr-0001-4000-8000-000000000014', 'pppppppp-0001-4000-8000-000000000004', NULL, 4, 'Sera koşullarında başarılı. 22-24 cm boyu tutarlı geliyor. Tavsiye ederim.', 1, 'Gülten Arslan', '2026-01-30 11:30:00.000'),

-- KIZGIN F1 Acı Kıl (3 yorum, ort. 4.33)
('rrrrrrrr-0001-4000-8000-000000000015', 'pppppppp-0001-4000-8000-000000000003', NULL, 5, 'Acılığı tam kıvamında, ne az ne çok. Turşu için de salça için de ideal. Bitki yapısı güçlü.', 1, 'Kemal Erdoğan', '2025-10-05 10:00:00.000'),
('rrrrrrrr-0001-4000-8000-000000000016', 'pppppppp-0001-4000-8000-000000000003', NULL, 4, 'Açık tarlada da serada da ektik, ikisinde de iyi sonuç aldık. TSWV toleransı önemli artısı.', 1, 'Naciye Şimşek', '2025-11-20 16:30:00.000'),
('rrrrrrrr-0001-4000-8000-000000000017', 'pppppppp-0001-4000-8000-000000000003', NULL, 4, 'Meyve yapısı düzgün ve tutarlı. 23-25 cm arası geliyor, pazarda güzel görünüyor.', 1, 'Osman Kılıç', '2026-02-05 08:00:00.000'),

-- TIRPAN F1 Kapya (4 yorum, ort. 4.75)
('rrrrrrrr-0001-4000-8000-000000000018', 'pppppppp-0001-4000-8000-000000000007', NULL, 5, 'Koyu kırmızı renk ve konik şekil pazarda çok rağbet görüyor. Çatlama yapmaması en büyük artısı.', 1, 'Ramazan Yıldırım', '2025-09-28 12:30:00.000'),
('rrrrrrrr-0001-4000-8000-000000000019', 'pppppppp-0001-4000-8000-000000000007', NULL, 5, 'Sıcak tutumu mükemmel, yazın bile meyve kalitesi bozulmuyor. Adaptasyonu çok iyi.', 1, 'Fadime Özdemir', '2025-11-10 09:45:00.000'),
('rrrrrrrr-0001-4000-8000-000000000020', 'pppppppp-0001-4000-8000-000000000007', NULL, 4, 'Sera yetiştiriciliğinde verim yüksek. 19-21 cm boyu tutarlı. Tatlı olması da cabası.', 1, 'Süleyman Çetin', '2026-01-12 14:15:00.000'),
('rrrrrrrr-0001-4000-8000-000000000021', 'pppppppp-0001-4000-8000-000000000007', NULL, 5, 'İhracat kalitesinde kapya arıyorsanız Tirpan F1 tam size göre. Cracking yok, raf ömrü uzun.', 1, 'Nurcan Koç', '2026-02-28 11:00:00.000'),

-- CANKAN F1 Kapya (3 yorum, ort. 4.67)
('rrrrrrrr-0001-4000-8000-000000000022', 'pppppppp-0001-4000-8000-000000000006', NULL, 5, 'Açık tarlada ve serada denedik, ikisinde de harika sonuç. Adaptasyon kabiliyeti gerçekten yüksek.', 1, 'Ahmet Bulut', '2025-10-15 10:30:00.000'),
('rrrrrrrr-0001-4000-8000-000000000023', 'pppppppp-0001-4000-8000-000000000006', NULL, 5, 'Koyu kırmızı rengi ve konik şekliyle görüntüsü çok iyi. %100 tatlı olması müşteride güven oluşturuyor.', 1, 'Meryem Aslan', '2025-12-08 15:00:00.000'),
('rrrrrrrr-0001-4000-8000-000000000024', 'pppppppp-0001-4000-8000-000000000006', NULL, 4, '18-20 cm arası geliyor, düz ve tutarlı. TSWV toleransı sayesinde kayıp yaşanmadı.', 1, 'Cengiz Duman', '2026-01-25 09:30:00.000');

-- =============================================================
-- products rating/review_count güncelle (ortalama puanlar)
-- =============================================================

UPDATE `products` SET `rating` = 4.75, `review_count` = 4 WHERE `id` = 'pppppppp-0001-4000-8000-000000000002';
UPDATE `products` SET `rating` = 4.33, `review_count` = 3 WHERE `id` = 'pppppppp-0001-4000-8000-000000000003';
UPDATE `products` SET `rating` = 4.67, `review_count` = 3 WHERE `id` = 'pppppppp-0001-4000-8000-000000000004';
UPDATE `products` SET `rating` = 4.67, `review_count` = 3 WHERE `id` = 'pppppppp-0001-4000-8000-000000000005';
UPDATE `products` SET `rating` = 4.67, `review_count` = 3 WHERE `id` = 'pppppppp-0001-4000-8000-000000000006';
UPDATE `products` SET `rating` = 4.75, `review_count` = 4 WHERE `id` = 'pppppppp-0001-4000-8000-000000000007';
UPDATE `products` SET `rating` = 4.50, `review_count` = 4 WHERE `id` = 'pppppppp-0001-4000-8000-000000000008';
