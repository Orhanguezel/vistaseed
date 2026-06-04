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
('14909400-0000-4000-8000-000000000001','avar-rootstock-01.webp','default','products/avar-rootstock-01.webp','products','image/webp',262110,'/uploads/products/avar-rootstock-01.webp','local','products/avar-rootstock-01.webp','image','webp'),
('15009400-0000-4000-8000-000000000001','lucky-f1-source-01.webp','default','products/lucky-f1-source-01.webp','products','image/webp',85338,'/uploads/products/lucky-f1-source-01.webp','local','products/lucky-f1-source-01.webp','image','webp'),
('15009400-0000-4000-8000-000000000002','kizgin-f1-source-01.webp','default','products/kizgin-f1-source-01.webp','products','image/webp',140266,'/uploads/products/kizgin-f1-source-01.webp','local','products/kizgin-f1-source-01.webp','image','webp'),
('15009400-0000-4000-8000-000000000003','prestij-f1-source-01.webp','default','products/prestij-f1-source-01.webp','products','image/webp',84064,'/uploads/products/prestij-f1-source-01.webp','local','products/prestij-f1-source-01.webp','image','webp'),
('15009400-0000-4000-8000-000000000004','birlik-f1-source-01.webp','default','products/birlik-f1-source-01.webp','products','image/webp',244032,'/uploads/products/birlik-f1-source-01.webp','local','products/birlik-f1-source-01.webp','image','webp'),
('15009400-0000-4000-8000-000000000005','cankan-f1-source-01.webp','default','products/cankan-f1-source-01.webp','products','image/webp',49440,'/uploads/products/cankan-f1-source-01.webp','local','products/cankan-f1-source-01.webp','image','webp'),
('15009400-0000-4000-8000-000000000006','tirpan-f1-source-01.webp','default','products/tirpan-f1-source-01.webp','products','image/webp',55574,'/uploads/products/tirpan-f1-source-01.webp','local','products/tirpan-f1-source-01.webp','image','webp'),
('15009400-0000-4000-8000-000000000007','saray-f1-source-01.webp','default','products/saray-f1-source-01.webp','products','image/webp',45884,'/uploads/products/saray-f1-source-01.webp','local','products/saray-f1-source-01.webp','image','webp');

-- =============================================================
-- SEED: 8 ürün (1 ANAC + 7 BIBER)
-- =============================================================

-- Kategori ID referansları:
-- ANAC  = aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1
-- BIBER = aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2

INSERT INTO `products` (`id`, `item_type`, `category_id`, `price`, `image_url`, `storage_asset_id`, `images`, `storage_image_ids`, `is_active`, `is_featured`, `order_num`, `product_code`, `botanical_name`, `planting_seasons`, `water_need`, `sun_exposure`) VALUES
('pppppppp-0001-4000-8000-000000000001', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '1250.00', '/uploads/products/avar-rootstock-01.webp', '14909400-0000-4000-8000-000000000001', '["/uploads/products/avar-rootstock-01.webp"]', '["14909400-0000-4000-8000-000000000001"]', 1, 1, 1, 'VS-ANAC-001', 'Cucurbita maxima × Cucurbita moschata', '[]', 'Orta', 'Tam güneş'),
('pppppppp-0001-4000-8000-000000000002', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '850.00', 'https://www.vistaseeds.com.tr/uploads/uploads/products/525C9BB8-18F9-4C2B-B5BD-0BD9E296E293.png', '15009400-0000-4000-8000-000000000001', '["https://www.vistaseeds.com.tr/uploads/uploads/products/525C9BB8-18F9-4C2B-B5BD-0BD9E296E293.png"]', '["15009400-0000-4000-8000-000000000001"]', 1, 1, 2, 'VS-BIB-001', 'Capsicum annuum', '["sonbahar"]', 'Orta', 'Tam güneş'),
('pppppppp-0001-4000-8000-000000000003', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '820.00', '/uploads/products/kizgin-f1-source-01.webp', '15009400-0000-4000-8000-000000000002', '["/uploads/products/kizgin-f1-source-01.webp"]', '["15009400-0000-4000-8000-000000000002"]', 1, 1, 3, 'VS-BIB-002', 'Capsicum annuum', '["ilkbahar", "sonbahar"]', 'Orta', 'Tam güneş'),
('pppppppp-0001-4000-8000-000000000004', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '840.00', 'https://www.vistaseeds.com.tr/uploads/uploads/products/07CF9486-7623-45AF-B851-C971E1FA5780.png', '15009400-0000-4000-8000-000000000003', '["https://www.vistaseeds.com.tr/uploads/uploads/products/07CF9486-7623-45AF-B851-C971E1FA5780.png"]', '["15009400-0000-4000-8000-000000000003"]', 1, 1, 4, 'VS-BIB-003', 'Capsicum annuum', '["sonbahar"]', 'Orta', 'Tam güneş'),
('pppppppp-0001-4000-8000-000000000005', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '780.00', '/uploads/products/birlik-f1-source-01.webp', '15009400-0000-4000-8000-000000000004', '["/uploads/products/birlik-f1-source-01.webp"]', '["15009400-0000-4000-8000-000000000004"]', 1, 1, 5, 'VS-BIB-004', 'Capsicum annuum', '["sonbahar"]', 'Orta', 'Tam güneş'),
('pppppppp-0001-4000-8000-000000000006', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '860.00', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.jpg', '15009400-0000-4000-8000-000000000005', '["https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.jpg"]', '["15009400-0000-4000-8000-000000000005"]', 1, 1, 6, 'VS-BIB-005', 'Capsicum annuum', '["ilkbahar", "sonbahar"]', 'Orta', 'Tam güneş'),
('pppppppp-0001-4000-8000-000000000007', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '870.00', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.png', '15009400-0000-4000-8000-000000000006', '["https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.png"]', '["15009400-0000-4000-8000-000000000006"]', 1, 1, 7, 'VS-BIB-006', 'Capsicum annuum', '["ilkbahar", "sonbahar"]', 'Orta', 'Tam güneş'),
('pppppppp-0001-4000-8000-000000000008', 'product', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '800.00', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Untitled_design.jpg', '15009400-0000-4000-8000-000000000007', '["https://www.vistaseeds.com.tr/uploads/uploads/products/Untitled_design.jpg"]', '["15009400-0000-4000-8000-000000000007"]', 1, 1, 8, 'VS-BIB-007', 'Capsicum annuum', '["ilkbahar", "sonbahar"]', 'Orta', 'Tam güneş');

-- =============================================================
-- SEED: product_i18n (TR)
-- =============================================================

INSERT INTO `product_i18n` (`product_id`, `locale`, `title`, `slug`, `description`, `alt`, `tags`, `meta_title`, `meta_description`) VALUES
('pppppppp-0001-4000-8000-000000000001', 'tr', 'AVAR', 'avar', 'AVAR; Cucurbita maxima × Cucurbita moschata hibriti bir anaç çeşididir. Özellikle karpuz, kavun ve hıyar yetiştiriciliğinde güçlü ve güvenilir bir kök anaç olarak kullanılır. Güçlü kök yapısı, yüksek dirençli kök sistemi ve Fon 0,1 toleransı sayesinde aşılı üretimde güvenilir performans sunar.', 'AVAR ürün görseli', '["anaç", "rootstock", "dayanıklı", "adaptasyon"]', 'AVAR Anaç Çeşidi | Vista Seeds', 'AVAR anaç; Cucurbita maxima × Cucurbita moschata hibriti, güçlü kök yapısı ve Fon 0,1 toleransı ile karpuz, kavun ve hıyar için uygundur.'),
('pppppppp-0001-4000-8000-000000000002', 'tr', 'LUCKY F1 Charliston Biber', 'lucky-f1', 'LUCKY F1; parlak koyu yeşil rengi, 21-23 cm uzunluğunda düzgün ve pürüzsüz meyve yapısı ile yüksek pazar kalitesi sunan profesyonel çarliston biber çeşididir. Güz, tek ekim ve yayla yetiştiriciliğine uygundur. TSWV ve Tm 0-2 toleransı, orta-kalın meyve eti, yüksek soğuk performansı, uzun raf ömrü ve %100 tatlı lezzeti ile ticari üretimde öne çıkar.', 'LUCKY F1 Charliston Biber ürün görseli', '["biber", "f1", "hibrit", "charliston", "tatlı", "sera", "yayla", "bahar", "yaz"]', 'LUCKY F1 Charliston Biber Tohumu | Vista Seeds', 'LUCKY F1 çarliston biber; 21-23 cm meyve boyu, TSWV ve Tm 0-2 toleransı, yüksek soğuk performansı ve %100 tatlı yapısıyla öne çıkar.'),
('pppppppp-0001-4000-8000-000000000003', 'tr', 'KIZGIN F1 Acı Kıl Biber', 'kizgin-f1', 'KIZGIN F1; sera ve açık tarla yetiştiriciliğine uygun, 23-25 cm meyve boyuna sahip profesyonel acı kıl biber çeşididir. Güçlü bitki yapısı, TSWV toleransı, ideal yeşil rengi, pürüzsüz düz şekli ve yüksek acılık oranı ile ticari üretimde güvenilir sonuç verir.', 'KIZGIN F1 Acı Kıl Biber ürün görseli', '["biber", "f1", "hibrit", "acı", "kıl-biber", "sera", "açık-tarla", "bahar", "güz"]', 'KIZGIN F1 Acı Kıl Biber Tohumu | Vista Seeds', 'KIZGIN F1 acı kıl biber; 23-25 cm meyve boyu, TSWV toleransı ve güçlü bitki yapısıyla sera ve açık tarla üretimine uygundur.'),
('pppppppp-0001-4000-8000-000000000004', 'tr', 'PRESTİJ F1 Tatlı Kıl Biber', 'prestij-f1', 'PRESTİJ F1; sera yetiştiriciliğine uygun, 22-24 cm meyve boyuna sahip güçlü yapıda profesyonel tatlı kıl biber çeşididir. Yüksek soğuk performansı ve TSWV toleransı ile zorlu koşullarda dahi verimliliğini korur. Düz, yeşil ve kılçıksız meyve yapısıyla pazar değeri yüksek çeşitler arasında yer alır.', 'PRESTİJ F1 Tatlı Kıl Biber ürün görseli', '["biber", "f1", "hibrit", "tatlı", "kıl-biber", "sera", "soğuk-performansı", "bahar", "kış"]', 'PRESTİJ F1 Tatlı Kıl Biber Tohumu | Vista Seeds', 'PRESTİJ F1 tatlı kıl biber; 22-24 cm meyve boyu, TSWV toleransı ve yüksek soğuk performansı ile sera yetiştiriciliği için uygundur.'),
('pppppppp-0001-4000-8000-000000000005', 'tr', 'BİRLİK F1 Üçburun Biber', 'birlik-f1', 'BİRLİK F1; sera yetiştiriciliğine uygun, güçlü bitki yapısına sahip profesyonel kahvaltılık biber çeşididir. 16-18 cm boyunda, ince kabuklu ve parlak yeşil meyveleriyle yüksek pazar değeri sunar. Soğuk performansı ve TSWV ile Tm: 0-2 toleransı sayesinde üretim risklerini azaltır; erkenci yapısı ile kazancı destekler.', 'BİRLİK F1 Üçburun Biber ürün görseli', '["biber", "f1", "hibrit", "üçburun", "kahvaltılık", "sera", "erkenci", "bahar"]', 'BİRLİK F1 Üçburun Biber Tohumu | Vista Seeds', 'BİRLİK F1 kahvaltılık biber; 16-18 cm meyve boyu, TSWV ve Tm: 0-2 toleransı, yüksek soğuk performansı ve erkenci yapısıyla öne çıkar.'),
('pppppppp-0001-4000-8000-000000000006', 'tr', 'CANKAN F1 Kapya Biber', 'cankan-f1', 'CANKAN F1; sera ve açık tarla üretimine uygun, güçlü bitki yapısına sahip profesyonel kapya biber çeşididir. 18-20 cm uzunluğundaki pürüzsüz ve koyu kırmızı meyveleriyle dikkat çeker. TSWV toleransı, yüksek uyum yeteneği ve %100 tatlı lezzeti sayesinde farklı iklim koşullarında güvenilir ticari performans sunar.', 'CANKAN F1 Kapya Biber ürün görseli', '["biber", "f1", "hibrit", "kapya", "kırmızı", "sera", "açık-tarla"]', 'CANKAN F1 Kapya Biber Tohumu | Vista Seeds', 'CANKAN F1 kapya biber; 18-20 cm meyve boyu, TSWV toleransı, yüksek adaptasyon ve %100 tatlı lezzetiyle öne çıkar.'),
('pppppppp-0001-4000-8000-000000000007', 'tr', 'TIRPAN F1 Kapya Biber', 'tirpan-f1', 'TIRPAN F1; sera yetiştiriciliğine uygun, 19-21 cm boyunda koyu kırmızı ve %100 tatlı meyvelere sahip profesyonel kapya biber çeşididir. Yüksek sıcaklıklarda dahi güçlü meyve tutumu sağlar. Çatlama ve cracking yapmayan pürüzsüz meyve yapısı, TSWV toleransı ve yüksek adaptasyonu ile ticari üretimde güven verir.', 'TIRPAN F1 Kapya Biber ürün görseli', '["biber", "f1", "hibrit", "kapya", "kırmızı", "sera", "çatlama-yapmaz"]', 'TIRPAN F1 Kapya Biber Tohumu | Vista Seeds', 'TIRPAN F1 kapya biber; 19-21 cm meyve boyu, TSWV toleransı, yüksek adaptasyon ve çatlama yapmayan kaliteli meyve yapısıyla öne çıkar.'),
('pppppppp-0001-4000-8000-000000000008', 'tr', 'SARAY F1 Dolma Biber', 'saray-f1', 'SARAY F1; sera ve açık tarla yetiştiriciliğine uygun, orta güçlü yapıda profesyonel dolma biber çeşididir. TSWV toleransı sayesinde hastalık baskısına karşı daha güvenlidir. 3-4 loblu, koyu yeşil ve kalın kabuklu meyveleri uzun raf ömrü ve yüksek nakliye dayanımı sağlayarak ticari değerini korur.', 'SARAY F1 Dolma Biber ürün görseli', '["biber", "f1", "hibrit", "dolma", "kalın-kabuk", "sera", "açık-tarla"]', 'SARAY F1 Dolma Biber Tohumu | Vista Seeds', 'SARAY F1 dolma biber; 3-4 loblu, koyu yeşil, kalın kabuklu meyve yapısı ve TSWV toleransı ile sera ve açık tarla üretimine uygundur.');

-- =============================================================
-- SEED: product_i18n (EN)
-- =============================================================

INSERT INTO `product_i18n` (`product_id`, `locale`, `title`, `slug`, `description`, `alt`, `tags`, `meta_title`, `meta_description`) VALUES
('pppppppp-0001-4000-8000-000000000001', 'en', 'AVAR', 'avar', 'AVAR is a Cucurbita maxima × Cucurbita moschata hybrid rootstock. It is used as a strong and reliable rootstock especially in watermelon, melon and cucumber cultivation. Its vigorous root system, highly resilient roots and Fusarium oxysporum f. sp. niveum race 0,1 tolerance provide dependable performance in grafted production.', 'AVAR product image', '["rootstock", "durable", "adaptation", "grafting"]', 'AVAR Rootstock Variety | Vista Seeds', 'AVAR rootstock is a Cucurbita maxima × Cucurbita moschata hybrid with strong roots and Fon 0,1 tolerance for watermelon, melon and cucumber.'),
('pppppppp-0001-4000-8000-000000000002', 'en', 'LUCKY F1 Charleston Pepper', 'lucky-f1', 'LUCKY F1 is a professional Charleston pepper variety with bright dark green color and a smooth, uniform fruit structure of 21-23 cm, offering high market quality. It is suitable for autumn, single-cycle and highland cultivation. TSWV and Tm 0-2 tolerance, medium-thick flesh, strong cold performance, long shelf life and 100% sweet taste make it a strong commercial choice.', 'LUCKY F1 Charleston Pepper product image', '["pepper", "f1", "hybrid", "charleston", "sweet", "greenhouse", "highland"]', 'LUCKY F1 Charleston Pepper Seed | Vista Seeds', 'LUCKY F1 Charleston pepper offers 21-23 cm fruits, TSWV and Tm 0-2 tolerance, strong cold performance and a 100% sweet profile.'),
('pppppppp-0001-4000-8000-000000000003', 'en', 'KIZGIN F1 Hot Thin Pepper', 'kizgin-f1', 'KIZGIN F1 is a professional hot thin pepper variety suitable for greenhouse and open-field cultivation, with a fruit length of 23-25 cm. Its strong plant structure, TSWV tolerance, ideal green color, smooth straight shape and high pungency deliver reliable commercial performance.', 'KIZGIN F1 Hot Thin Pepper product image', '["pepper", "f1", "hybrid", "hot", "thin-pepper", "greenhouse", "open-field"]', 'KIZGIN F1 Hot Thin Pepper Seed | Vista Seeds', 'KIZGIN F1 hot thin pepper offers 23-25 cm fruits, TSWV tolerance and strong plant vigor for greenhouse and open-field production.'),
('pppppppp-0001-4000-8000-000000000004', 'en', 'PRESTIJ F1 Sweet Thin Pepper', 'prestij-f1', 'PRESTIJ F1 is a professional sweet thin pepper variety with a strong plant structure and 22-24 cm fruits, suitable for greenhouse cultivation. Its high cold performance and TSWV tolerance help maintain productivity under challenging conditions. The straight, green and smooth fruit structure supports high market value.', 'PRESTIJ F1 Sweet Thin Pepper product image', '["pepper", "f1", "hybrid", "sweet", "thin-pepper", "greenhouse", "cold-performance"]', 'PRESTIJ F1 Sweet Thin Pepper Seed | Vista Seeds', 'PRESTIJ F1 sweet thin pepper offers 22-24 cm fruits, TSWV tolerance and strong cold performance for greenhouse cultivation.'),
('pppppppp-0001-4000-8000-000000000005', 'en', 'BIRLIK F1 Turkish Breakfast Pepper', 'birlik-f1', 'BIRLIK F1 is a professional breakfast pepper variety suitable for greenhouse cultivation with a strong plant structure. Its 16-18 cm fruits are thin-skinned, bright green and highly marketable. Strong cold performance together with TSWV and Tm: 0-2 tolerance reduces risk, while its early habit supports higher returns.', 'BIRLIK F1 Turkish Breakfast Pepper product image', '["pepper", "f1", "hybrid", "breakfast", "turkish", "greenhouse", "early"]', 'BIRLIK F1 Turkish Breakfast Pepper Seed | Vista Seeds', 'BIRLIK F1 breakfast pepper features 16-18 cm fruits, TSWV and Tm: 0-2 tolerance, strong cold performance and early maturity.'),
('pppppppp-0001-4000-8000-000000000006', 'en', 'CANKAN F1 Kapia Pepper', 'cankan-f1', 'CANKAN F1 is a professional kapia pepper variety with strong plant structure, suitable for greenhouse and open-field production. Its 18-20 cm fruits are smooth, dark red and highly attractive. TSWV tolerance, high adaptability and a 100% sweet taste provide reliable commercial performance across different climates.', 'CANKAN F1 Kapia Pepper product image', '["pepper", "f1", "hybrid", "kapia", "red", "greenhouse", "open-field"]', 'CANKAN F1 Kapia Pepper Seed | Vista Seeds', 'CANKAN F1 kapia pepper offers 18-20 cm fruits, TSWV tolerance, high adaptability and a 100% sweet taste.'),
('pppppppp-0001-4000-8000-000000000007', 'en', 'TIRPAN F1 Kapia Pepper', 'tirpan-f1', 'TIRPAN F1 is a professional kapia pepper variety for greenhouse cultivation with 19-21 cm dark red fruits and a 100% sweet taste. It maintains strong fruit set even at high temperatures. Its smooth fruit structure resists cracking, while TSWV tolerance and high adaptability deliver confidence in commercial production.', 'TIRPAN F1 Kapia Pepper product image', '["pepper", "f1", "hybrid", "kapia", "red", "greenhouse", "no-cracking"]', 'TIRPAN F1 Kapia Pepper Seed | Vista Seeds', 'TIRPAN F1 kapia pepper offers 19-21 cm fruits, TSWV tolerance, high adaptability and crack-resistant fruit quality.'),
('pppppppp-0001-4000-8000-000000000008', 'en', 'SARAY F1 Stuffing Pepper', 'saray-f1', 'SARAY F1 is a professional stuffing pepper variety with medium-strong plant structure, suitable for greenhouse and open-field cultivation. Its TSWV tolerance supports safer production under disease pressure. Dark green, thick-skinned fruits with 3-4 lobes offer long shelf life and strong transport durability for commercial trade.', 'SARAY F1 Stuffing Pepper product image', '["pepper", "f1", "hybrid", "stuffing", "thick-skin", "greenhouse", "open-field"]', 'SARAY F1 Stuffing Pepper Seed | Vista Seeds', 'SARAY F1 stuffing pepper offers 3-4 lobed dark green fruits, thick skin and TSWV tolerance for greenhouse and open-field production.');

-- =============================================================
-- SEED: product_i18n (DE)
-- =============================================================

INSERT INTO `product_i18n` (`product_id`, `locale`, `title`, `slug`, `description`, `alt`, `tags`, `meta_title`, `meta_description`) VALUES
('pppppppp-0001-4000-8000-000000000001', 'de', 'AVAR', 'avar', 'AVAR ist eine Veredelungsunterlage aus der Hybride Cucurbita maxima × Cucurbita moschata. Sie wird vor allem im Wassermelonen-, Melonen- und Gurkenanbau als starke und zuverlässige Unterlage eingesetzt. Das kräftige Wurzelsystem, die sehr widerstandsfähigen Wurzeln und die Toleranz gegen Fusarium oxysporum f. sp. niveum Rasse 0,1 sorgen für eine verlässliche Leistung in der Veredelungsproduktion.', 'AVAR Produktbild', '["Unterlage", "rootstock", "widerstandsfähig", "Anpassung", "Veredelung"]', 'AVAR Unterlage | Vista Seeds', 'AVAR Unterlage; Hybride Cucurbita maxima × Cucurbita moschata, kräftiges Wurzelsystem und Fon-0,1-Toleranz für Wassermelone, Melone und Gurke.'),
('pppppppp-0001-4000-8000-000000000002', 'de', 'LUCKY F1 Charliston-Paprika', 'lucky-f1', 'LUCKY F1 ist eine professionelle Charliston-Paprikasorte mit leuchtend dunkelgrüner Farbe und glatter, gleichmäßiger Fruchtstruktur von 21-23 cm und hoher Marktqualität. Sie eignet sich für den Herbst-, Einzelanbau und den Anbau im Hochland. TSWV- und Tm-0-2-Toleranz, mitteldickes Fruchtfleisch, hohe Kälteleistung, lange Haltbarkeit und ein zu 100% süßer Geschmack machen sie zur starken kommerziellen Wahl.', 'LUCKY F1 Charliston-Paprika Produktbild', '["Paprika", "f1", "Hybride", "Charliston", "süß", "Gewächshaus", "Hochland"]', 'LUCKY F1 Charliston-Paprika Samen | Vista Seeds', 'LUCKY F1 Charliston-Paprika; 21-23 cm, TSWV- und Tm-0-2-Toleranz, hohe Kälteleistung und zu 100% süßer Geschmack.'),
('pppppppp-0001-4000-8000-000000000003', 'de', 'KIZGIN F1 Scharfe Spitzpaprika', 'kizgin-f1', 'KIZGIN F1 ist eine professionelle scharfe Spitzpaprikasorte für den Anbau im Gewächshaus und Freiland mit einer Fruchtlänge von 23-25 cm. Die kräftige Pflanzenstruktur, die TSWV-Toleranz, die ideale grüne Farbe, die glatte gerade Form und die hohe Schärfe sorgen für eine zuverlässige kommerzielle Leistung.', 'KIZGIN F1 Scharfe Spitzpaprika Produktbild', '["Paprika", "f1", "Hybride", "scharf", "Spitzpaprika", "Gewächshaus", "Freiland"]', 'KIZGIN F1 Scharfe Spitzpaprika Samen | Vista Seeds', 'KIZGIN F1 scharfe Spitzpaprika; 23-25 cm, TSWV-Toleranz und kräftige Pflanzenstruktur für Gewächshaus und Freiland.'),
('pppppppp-0001-4000-8000-000000000004', 'de', 'PRESTIJ F1 Süße Spitzpaprika', 'prestij-f1', 'PRESTIJ F1 ist eine professionelle süße Spitzpaprikasorte mit kräftiger Pflanzenstruktur und 22-24 cm langen Früchten für den Gewächshausanbau. Die hohe Kälteleistung und die TSWV-Toleranz helfen, die Produktivität auch unter schwierigen Bedingungen zu erhalten. Die gerade, grüne und glatte Fruchtstruktur unterstützt einen hohen Marktwert.', 'PRESTIJ F1 Süße Spitzpaprika Produktbild', '["Paprika", "f1", "Hybride", "süß", "Spitzpaprika", "Gewächshaus", "Kälteleistung"]', 'PRESTIJ F1 Süße Spitzpaprika Samen | Vista Seeds', 'PRESTIJ F1 süße Spitzpaprika; 22-24 cm, TSWV-Toleranz und hohe Kälteleistung für den Gewächshausanbau.'),
('pppppppp-0001-4000-8000-000000000005', 'de', 'BIRLIK F1 Türkische Frühstückspaprika', 'birlik-f1', 'BIRLIK F1 ist eine professionelle türkische Frühstückspaprikasorte für den Gewächshausanbau mit kräftiger Pflanzenstruktur. Ihre 16-18 cm langen Früchte sind dünnschalig, leuchtend grün und sehr gut vermarktbar. Die hohe Kälteleistung zusammen mit der TSWV- und Tm-0-2-Toleranz senkt das Risiko, während die Frühreife höhere Erträge unterstützt.', 'BIRLIK F1 Türkische Frühstückspaprika Produktbild', '["Paprika", "f1", "Hybride", "Frühstückspaprika", "türkisch", "Gewächshaus", "frühreif"]', 'BIRLIK F1 Türkische Frühstückspaprika Samen | Vista Seeds', 'BIRLIK F1 türkische Frühstückspaprika; 16-18 cm, TSWV- und Tm-0-2-Toleranz, dünnschalig und frühreif.'),
('pppppppp-0001-4000-8000-000000000006', 'de', 'CANKAN F1 Kapia-Paprika', 'cankan-f1', 'CANKAN F1 ist eine professionelle Kapia-Paprikasorte mit kräftiger Pflanzenstruktur für die Produktion im Gewächshaus und Freiland. Ihre 18-20 cm langen Früchte sind glatt, dunkelrot und sehr attraktiv. TSWV-Toleranz, hohe Anpassungsfähigkeit und ein zu 100% süßer Geschmack sorgen für eine zuverlässige kommerzielle Leistung in unterschiedlichen Klimazonen.', 'CANKAN F1 Kapia-Paprika Produktbild', '["Paprika", "f1", "Hybride", "Kapia", "rot", "Gewächshaus", "Freiland"]', 'CANKAN F1 Kapia-Paprika Samen | Vista Seeds', 'CANKAN F1 Kapia-Paprika; 18-20 cm, TSWV-Toleranz, hohe Anpassungsfähigkeit und zu 100% süßer Geschmack.'),
('pppppppp-0001-4000-8000-000000000007', 'de', 'TIRPAN F1 Kapia-Paprika', 'tirpan-f1', 'TIRPAN F1 ist eine professionelle Kapia-Paprikasorte für den Gewächshausanbau mit 19-21 cm langen, dunkelroten Früchten und einem zu 100% süßen Geschmack. Sie sorgt auch bei hohen Temperaturen für einen starken Fruchtansatz. Die glatte Fruchtstruktur ist platzfest, während TSWV-Toleranz und hohe Anpassungsfähigkeit Sicherheit in der kommerziellen Produktion bieten.', 'TIRPAN F1 Kapia-Paprika Produktbild', '["Paprika", "f1", "Hybride", "Kapia", "rot", "Gewächshaus", "platzfest"]', 'TIRPAN F1 Kapia-Paprika Samen | Vista Seeds', 'TIRPAN F1 Kapia-Paprika; 19-21 cm, TSWV-Toleranz, hohe Anpassungsfähigkeit und platzfeste Fruchtqualität.'),
('pppppppp-0001-4000-8000-000000000008', 'de', 'SARAY F1 Blockpaprika', 'saray-f1', 'SARAY F1 ist eine professionelle Blockpaprikasorte (zum Füllen) mit mittelkräftiger Pflanzenstruktur für den Anbau im Gewächshaus und Freiland. Die TSWV-Toleranz unterstützt eine sicherere Produktion bei Krankheitsdruck. Dunkelgrüne, dickschalige Früchte mit 3-4 Lappen bieten eine lange Haltbarkeit und hohe Transportfestigkeit für den kommerziellen Handel.', 'SARAY F1 Blockpaprika Produktbild', '["Paprika", "f1", "Hybride", "Blockpaprika", "dickschalig", "Gewächshaus", "Freiland"]', 'SARAY F1 Blockpaprika Samen | Vista Seeds', 'SARAY F1 Blockpaprika; dunkelgrün, dickschalig, 3-4 Lappen, TSWV-Toleranz für Gewächshaus und Freiland.');


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
-- SEED: product_specs zenginleştirme (botanik adı + tip-genel kültür)
-- =============================================================

-- Zenginleştirme: botanik adı (kaynaklı) + tip-genel kültür bilgisi (Capsicum annuum / kabak anacı).
-- 'genel kültür' notu: çeşide özel değil, biber/anaç tipi için standart referans değerlerdir.
INSERT INTO `product_specs` (`id`, `product_id`, `locale`, `name`, `value`, `category`, `order_num`) VALUES
('ssssssss-0002-4000-8000-000000000001', 'pppppppp-0001-4000-8000-000000000001', 'tr', 'Botanik Adı', 'Cucurbita maxima × Cucurbita moschata', 'custom', 10),
('ssssssss-0002-4000-8000-000000000002', 'pppppppp-0001-4000-8000-000000000001', 'tr', 'Çıkış Süresi (genel kültür)', '5-10 gün (toprak 25-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000003', 'pppppppp-0001-4000-8000-000000000001', 'tr', 'Ekim Derinliği (genel kültür)', '1,5-2 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000004', 'pppppppp-0001-4000-8000-000000000001', 'tr', 'Işık İhtiyacı', 'Tam güneş', 'custom', 13),
('ssssssss-0002-4000-8000-000000000005', 'pppppppp-0001-4000-8000-000000000001', 'en', 'Botanical Name', 'Cucurbita maxima × Cucurbita moschata', 'custom', 10),
('ssssssss-0002-4000-8000-000000000006', 'pppppppp-0001-4000-8000-000000000001', 'en', 'Germination (general culture)', '5-10 days (soil 25-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000007', 'pppppppp-0001-4000-8000-000000000001', 'en', 'Sowing Depth (general culture)', '1.5-2 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000008', 'pppppppp-0001-4000-8000-000000000001', 'en', 'Light Requirement', 'Full sun', 'custom', 13),
('ssssssss-0002-4000-8000-000000000009', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Botanik Adı', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000010', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Çıkış Süresi (genel kültür)', '7-14 gün (toprak 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000011', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Ekim Derinliği (genel kültür)', '0,5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000012', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Dikim Aralığı (genel kültür)', 'Sıra arası 70-90 cm, sıra üzeri 40-50 cm', 'custom', 13),
('ssssssss-0002-4000-8000-000000000013', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'Işık İhtiyacı', 'Tam güneş', 'custom', 14),
('ssssssss-0002-4000-8000-000000000014', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Botanical Name', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000015', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Germination (general culture)', '7-14 days (soil 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000016', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Sowing Depth (general culture)', '0.5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000017', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Spacing (general culture)', '70-90 cm between rows, 40-50 cm in row', 'custom', 13),
('ssssssss-0002-4000-8000-000000000018', 'pppppppp-0001-4000-8000-000000000002', 'en', 'Light Requirement', 'Full sun', 'custom', 14),
('ssssssss-0002-4000-8000-000000000019', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Botanik Adı', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000020', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Çıkış Süresi (genel kültür)', '7-14 gün (toprak 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000021', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Ekim Derinliği (genel kültür)', '0,5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000022', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Dikim Aralığı (genel kültür)', 'Sıra arası 70-90 cm, sıra üzeri 40-50 cm', 'custom', 13),
('ssssssss-0002-4000-8000-000000000023', 'pppppppp-0001-4000-8000-000000000003', 'tr', 'Işık İhtiyacı', 'Tam güneş', 'custom', 14),
('ssssssss-0002-4000-8000-000000000024', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Botanical Name', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000025', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Germination (general culture)', '7-14 days (soil 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000026', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Sowing Depth (general culture)', '0.5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000027', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Spacing (general culture)', '70-90 cm between rows, 40-50 cm in row', 'custom', 13),
('ssssssss-0002-4000-8000-000000000028', 'pppppppp-0001-4000-8000-000000000003', 'en', 'Light Requirement', 'Full sun', 'custom', 14),
('ssssssss-0002-4000-8000-000000000029', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Botanik Adı', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000030', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Çıkış Süresi (genel kültür)', '7-14 gün (toprak 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000031', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Ekim Derinliği (genel kültür)', '0,5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000032', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Dikim Aralığı (genel kültür)', 'Sıra arası 70-90 cm, sıra üzeri 40-50 cm', 'custom', 13),
('ssssssss-0002-4000-8000-000000000033', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'Işık İhtiyacı', 'Tam güneş', 'custom', 14),
('ssssssss-0002-4000-8000-000000000034', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Botanical Name', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000035', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Germination (general culture)', '7-14 days (soil 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000036', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Sowing Depth (general culture)', '0.5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000037', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Spacing (general culture)', '70-90 cm between rows, 40-50 cm in row', 'custom', 13),
('ssssssss-0002-4000-8000-000000000038', 'pppppppp-0001-4000-8000-000000000004', 'en', 'Light Requirement', 'Full sun', 'custom', 14),
('ssssssss-0002-4000-8000-000000000039', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Botanik Adı', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000040', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Çıkış Süresi (genel kültür)', '7-14 gün (toprak 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000041', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Ekim Derinliği (genel kültür)', '0,5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000042', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Dikim Aralığı (genel kültür)', 'Sıra arası 70-90 cm, sıra üzeri 40-50 cm', 'custom', 13),
('ssssssss-0002-4000-8000-000000000043', 'pppppppp-0001-4000-8000-000000000005', 'tr', 'Işık İhtiyacı', 'Tam güneş', 'custom', 14),
('ssssssss-0002-4000-8000-000000000044', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Botanical Name', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000045', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Germination (general culture)', '7-14 days (soil 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000046', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Sowing Depth (general culture)', '0.5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000047', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Spacing (general culture)', '70-90 cm between rows, 40-50 cm in row', 'custom', 13),
('ssssssss-0002-4000-8000-000000000048', 'pppppppp-0001-4000-8000-000000000005', 'en', 'Light Requirement', 'Full sun', 'custom', 14),
('ssssssss-0002-4000-8000-000000000049', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Botanik Adı', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000050', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Çıkış Süresi (genel kültür)', '7-14 gün (toprak 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000051', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Ekim Derinliği (genel kültür)', '0,5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000052', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Dikim Aralığı (genel kültür)', 'Sıra arası 70-90 cm, sıra üzeri 40-50 cm', 'custom', 13),
('ssssssss-0002-4000-8000-000000000053', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'Işık İhtiyacı', 'Tam güneş', 'custom', 14),
('ssssssss-0002-4000-8000-000000000054', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Botanical Name', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000055', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Germination (general culture)', '7-14 days (soil 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000056', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Sowing Depth (general culture)', '0.5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000057', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Spacing (general culture)', '70-90 cm between rows, 40-50 cm in row', 'custom', 13),
('ssssssss-0002-4000-8000-000000000058', 'pppppppp-0001-4000-8000-000000000006', 'en', 'Light Requirement', 'Full sun', 'custom', 14),
('ssssssss-0002-4000-8000-000000000059', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Botanik Adı', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000060', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Çıkış Süresi (genel kültür)', '7-14 gün (toprak 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000061', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Ekim Derinliği (genel kültür)', '0,5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000062', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Dikim Aralığı (genel kültür)', 'Sıra arası 70-90 cm, sıra üzeri 40-50 cm', 'custom', 13),
('ssssssss-0002-4000-8000-000000000063', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'Işık İhtiyacı', 'Tam güneş', 'custom', 14),
('ssssssss-0002-4000-8000-000000000064', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Botanical Name', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000065', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Germination (general culture)', '7-14 days (soil 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000066', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Sowing Depth (general culture)', '0.5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000067', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Spacing (general culture)', '70-90 cm between rows, 40-50 cm in row', 'custom', 13),
('ssssssss-0002-4000-8000-000000000068', 'pppppppp-0001-4000-8000-000000000007', 'en', 'Light Requirement', 'Full sun', 'custom', 14),
('ssssssss-0002-4000-8000-000000000069', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Botanik Adı', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000070', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Çıkış Süresi (genel kültür)', '7-14 gün (toprak 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000071', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Ekim Derinliği (genel kültür)', '0,5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000072', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Dikim Aralığı (genel kültür)', 'Sıra arası 70-90 cm, sıra üzeri 40-50 cm', 'custom', 13),
('ssssssss-0002-4000-8000-000000000073', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'Işık İhtiyacı', 'Tam güneş', 'custom', 14),
('ssssssss-0002-4000-8000-000000000074', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Botanical Name', 'Capsicum annuum', 'custom', 10),
('ssssssss-0002-4000-8000-000000000075', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Germination (general culture)', '7-14 days (soil 24-30°C)', 'custom', 11),
('ssssssss-0002-4000-8000-000000000076', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Sowing Depth (general culture)', '0.5-1 cm', 'custom', 12),
('ssssssss-0002-4000-8000-000000000077', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Spacing (general culture)', '70-90 cm between rows, 40-50 cm in row', 'custom', 13),
('ssssssss-0002-4000-8000-000000000078', 'pppppppp-0001-4000-8000-000000000008', 'en', 'Light Requirement', 'Full sun', 'custom', 14);

-- =============================================================
-- SEED: product_specs (DE)
-- =============================================================

INSERT INTO `product_specs` (`id`, `product_id`, `locale`, `name`, `value`, `category`, `order_num`) VALUES
('ssssssss-00de-4000-8000-000000000001', 'pppppppp-0001-4000-8000-000000000001', 'de', 'Wurzelkraft', 'Sehr hoch', 'custom', 1),
('ssssssss-00de-4000-8000-000000000002', 'pppppppp-0001-4000-8000-000000000001', 'de', 'Anpassung', 'Breiter Klimabereich', 'custom', 2),
('ssssssss-00de-4000-8000-000000000003', 'pppppppp-0001-4000-8000-000000000001', 'de', 'Verwendung', 'Veredelungsunterlage', 'custom', 3),
('ssssssss-00de-4000-8000-000000000004', 'pppppppp-0001-4000-8000-000000000001', 'de', 'Botanischer Name', 'Cucurbita maxima × Cucurbita moschata', 'custom', 4),
('ssssssss-00de-4000-8000-000000000005', 'pppppppp-0001-4000-8000-000000000001', 'de', 'Keimdauer (allgemeine Kultur)', '5-10 Tage (Boden 25-30°C)', 'custom', 5),
('ssssssss-00de-4000-8000-000000000006', 'pppppppp-0001-4000-8000-000000000001', 'de', 'Saattiefe (allgemeine Kultur)', '1,5-2 cm', 'custom', 6),
('ssssssss-00de-4000-8000-000000000007', 'pppppppp-0001-4000-8000-000000000001', 'de', 'Lichtbedarf', 'Volle Sonne', 'custom', 7),
('ssssssss-00de-4000-8000-000000000008', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Fruchttyp', 'Charliston', 'custom', 1),
('ssssssss-00de-4000-8000-000000000009', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Fruchtlänge', '21-23 cm', 'custom', 2),
('ssssssss-00de-4000-8000-000000000010', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Anbau', 'Herbst, Einzelanbau, Hochland', 'custom', 3),
('ssssssss-00de-4000-8000-000000000011', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Krankheitstoleranz', 'TSWV, Tm:0-2', 'custom', 4),
('ssssssss-00de-4000-8000-000000000012', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Geschmack', '100% Süß', 'custom', 5),
('ssssssss-00de-4000-8000-000000000013', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Kälteleistung', 'Hoch', 'custom', 6),
('ssssssss-00de-4000-8000-000000000014', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Botanischer Name', 'Capsicum annuum', 'custom', 7),
('ssssssss-00de-4000-8000-000000000015', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Keimdauer (allgemeine Kultur)', '7-14 Tage (Boden 24-30°C)', 'custom', 8),
('ssssssss-00de-4000-8000-000000000016', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Saattiefe (allgemeine Kultur)', '0,5-1 cm', 'custom', 9),
('ssssssss-00de-4000-8000-000000000017', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Pflanzabstand (allgemeine Kultur)', 'Reihenabstand 70-90 cm, in der Reihe 40-50 cm', 'custom', 10),
('ssssssss-00de-4000-8000-000000000018', 'pppppppp-0001-4000-8000-000000000002', 'de', 'Lichtbedarf', 'Volle Sonne', 'custom', 11),
('ssssssss-00de-4000-8000-000000000019', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Fruchttyp', 'Scharfe Spitzpaprika', 'custom', 1),
('ssssssss-00de-4000-8000-000000000020', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Fruchtlänge', '23-25 cm', 'custom', 2),
('ssssssss-00de-4000-8000-000000000021', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Krankheitstoleranz', 'TSWV', 'custom', 3),
('ssssssss-00de-4000-8000-000000000022', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Anbau', 'Herbst, Frühjahr / Gewächshaus, Freiland', 'custom', 4),
('ssssssss-00de-4000-8000-000000000023', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Geschmack', 'Scharf', 'custom', 5),
('ssssssss-00de-4000-8000-000000000024', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Botanischer Name', 'Capsicum annuum', 'custom', 6),
('ssssssss-00de-4000-8000-000000000025', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Keimdauer (allgemeine Kultur)', '7-14 Tage (Boden 24-30°C)', 'custom', 7),
('ssssssss-00de-4000-8000-000000000026', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Saattiefe (allgemeine Kultur)', '0,5-1 cm', 'custom', 8),
('ssssssss-00de-4000-8000-000000000027', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Pflanzabstand (allgemeine Kultur)', 'Reihenabstand 70-90 cm, in der Reihe 40-50 cm', 'custom', 9),
('ssssssss-00de-4000-8000-000000000028', 'pppppppp-0001-4000-8000-000000000003', 'de', 'Lichtbedarf', 'Volle Sonne', 'custom', 10),
('ssssssss-00de-4000-8000-000000000029', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Fruchttyp', 'Süße Spitzpaprika', 'custom', 1),
('ssssssss-00de-4000-8000-000000000030', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Fruchtlänge', '22-24 cm', 'custom', 2),
('ssssssss-00de-4000-8000-000000000031', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Krankheitstoleranz', 'TSWV', 'custom', 3),
('ssssssss-00de-4000-8000-000000000032', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Anbau', 'Herbst, Einzelanbau / Gewächshaus', 'custom', 4),
('ssssssss-00de-4000-8000-000000000033', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Geschmack', '100% Süß', 'custom', 5),
('ssssssss-00de-4000-8000-000000000034', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Kälteleistung', 'Hoch', 'custom', 6),
('ssssssss-00de-4000-8000-000000000035', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Botanischer Name', 'Capsicum annuum', 'custom', 7),
('ssssssss-00de-4000-8000-000000000036', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Keimdauer (allgemeine Kultur)', '7-14 Tage (Boden 24-30°C)', 'custom', 8),
('ssssssss-00de-4000-8000-000000000037', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Saattiefe (allgemeine Kultur)', '0,5-1 cm', 'custom', 9),
('ssssssss-00de-4000-8000-000000000038', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Pflanzabstand (allgemeine Kultur)', 'Reihenabstand 70-90 cm, in der Reihe 40-50 cm', 'custom', 10),
('ssssssss-00de-4000-8000-000000000039', 'pppppppp-0001-4000-8000-000000000004', 'de', 'Lichtbedarf', 'Volle Sonne', 'custom', 11),
('ssssssss-00de-4000-8000-000000000040', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Fruchttyp', 'Türkische Frühstückspaprika', 'custom', 1),
('ssssssss-00de-4000-8000-000000000041', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Fruchtlänge', '16-18 cm', 'custom', 2),
('ssssssss-00de-4000-8000-000000000042', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Krankheitstoleranz', 'TSWV, Tm:0-2', 'custom', 3),
('ssssssss-00de-4000-8000-000000000043', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Anbau', 'Herbst, Einzelanbau / Gewächshaus', 'custom', 4),
('ssssssss-00de-4000-8000-000000000044', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Schale', 'Dünnschalig, frühreif', 'custom', 5),
('ssssssss-00de-4000-8000-000000000045', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Kälteleistung', 'Hoch', 'custom', 6),
('ssssssss-00de-4000-8000-000000000046', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Botanischer Name', 'Capsicum annuum', 'custom', 7),
('ssssssss-00de-4000-8000-000000000047', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Keimdauer (allgemeine Kultur)', '7-14 Tage (Boden 24-30°C)', 'custom', 8),
('ssssssss-00de-4000-8000-000000000048', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Saattiefe (allgemeine Kultur)', '0,5-1 cm', 'custom', 9),
('ssssssss-00de-4000-8000-000000000049', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Pflanzabstand (allgemeine Kultur)', 'Reihenabstand 70-90 cm, in der Reihe 40-50 cm', 'custom', 10),
('ssssssss-00de-4000-8000-000000000050', 'pppppppp-0001-4000-8000-000000000005', 'de', 'Lichtbedarf', 'Volle Sonne', 'custom', 11),
('ssssssss-00de-4000-8000-000000000051', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Fruchttyp', 'Kapia-Paprika', 'custom', 1),
('ssssssss-00de-4000-8000-000000000052', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Fruchtlänge', '18-20 cm', 'custom', 2),
('ssssssss-00de-4000-8000-000000000053', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Krankheitstoleranz', 'TSWV', 'custom', 3),
('ssssssss-00de-4000-8000-000000000054', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Anbau', 'Herbst, Frühjahr / Gewächshaus, Freiland', 'custom', 4),
('ssssssss-00de-4000-8000-000000000055', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Geschmack', '100% Süß', 'custom', 5),
('ssssssss-00de-4000-8000-000000000056', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Farbe', 'Dunkelrot', 'custom', 6),
('ssssssss-00de-4000-8000-000000000057', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Botanischer Name', 'Capsicum annuum', 'custom', 7),
('ssssssss-00de-4000-8000-000000000058', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Keimdauer (allgemeine Kultur)', '7-14 Tage (Boden 24-30°C)', 'custom', 8),
('ssssssss-00de-4000-8000-000000000059', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Saattiefe (allgemeine Kultur)', '0,5-1 cm', 'custom', 9),
('ssssssss-00de-4000-8000-000000000060', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Pflanzabstand (allgemeine Kultur)', 'Reihenabstand 70-90 cm, in der Reihe 40-50 cm', 'custom', 10),
('ssssssss-00de-4000-8000-000000000061', 'pppppppp-0001-4000-8000-000000000006', 'de', 'Lichtbedarf', 'Volle Sonne', 'custom', 11),
('ssssssss-00de-4000-8000-000000000062', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Fruchttyp', 'Kapia-Paprika', 'custom', 1),
('ssssssss-00de-4000-8000-000000000063', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Fruchtlänge', '19-21 cm', 'custom', 2),
('ssssssss-00de-4000-8000-000000000064', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Krankheitstoleranz', 'TSWV', 'custom', 3),
('ssssssss-00de-4000-8000-000000000065', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Anbau', 'Herbst, Frühjahr / Gewächshaus', 'custom', 4),
('ssssssss-00de-4000-8000-000000000066', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Geschmack', '100% Süß', 'custom', 5),
('ssssssss-00de-4000-8000-000000000067', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Farbe', 'Dunkelrot', 'custom', 6),
('ssssssss-00de-4000-8000-000000000068', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Eigenschaft', 'Platzt nicht (kein Cracking)', 'custom', 7),
('ssssssss-00de-4000-8000-000000000069', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Botanischer Name', 'Capsicum annuum', 'custom', 8),
('ssssssss-00de-4000-8000-000000000070', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Keimdauer (allgemeine Kultur)', '7-14 Tage (Boden 24-30°C)', 'custom', 9),
('ssssssss-00de-4000-8000-000000000071', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Saattiefe (allgemeine Kultur)', '0,5-1 cm', 'custom', 10),
('ssssssss-00de-4000-8000-000000000072', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Pflanzabstand (allgemeine Kultur)', 'Reihenabstand 70-90 cm, in der Reihe 40-50 cm', 'custom', 11),
('ssssssss-00de-4000-8000-000000000073', 'pppppppp-0001-4000-8000-000000000007', 'de', 'Lichtbedarf', 'Volle Sonne', 'custom', 12),
('ssssssss-00de-4000-8000-000000000074', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Fruchttyp', 'Blockpaprika (zum Füllen)', 'custom', 1),
('ssssssss-00de-4000-8000-000000000075', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Anzahl Lappen', '3-4 Lappen', 'custom', 2),
('ssssssss-00de-4000-8000-000000000076', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Krankheitstoleranz', 'TSWV', 'custom', 3),
('ssssssss-00de-4000-8000-000000000077', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Anbau', 'Herbst, Frühjahr / Gewächshaus, Freiland', 'custom', 4),
('ssssssss-00de-4000-8000-000000000078', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Schale', 'Dickschalig', 'custom', 5),
('ssssssss-00de-4000-8000-000000000079', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Farbe', 'Dunkelgrün', 'custom', 6),
('ssssssss-00de-4000-8000-000000000080', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Botanischer Name', 'Capsicum annuum', 'custom', 7),
('ssssssss-00de-4000-8000-000000000081', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Keimdauer (allgemeine Kultur)', '7-14 Tage (Boden 24-30°C)', 'custom', 8),
('ssssssss-00de-4000-8000-000000000082', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Saattiefe (allgemeine Kultur)', '0,5-1 cm', 'custom', 9),
('ssssssss-00de-4000-8000-000000000083', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Pflanzabstand (allgemeine Kultur)', 'Reihenabstand 70-90 cm, in der Reihe 40-50 cm', 'custom', 10),
('ssssssss-00de-4000-8000-000000000084', 'pppppppp-0001-4000-8000-000000000008', 'de', 'Lichtbedarf', 'Volle Sonne', 'custom', 11);


-- =============================================================
-- SEED: product_images (birincil görsel — canlı ile birebir)
-- =============================================================

INSERT INTO `product_images`
  (`id`, `product_id`, `locale`, `image_url`, `image_asset_id`, `title`, `alt`, `caption`, `display_order`, `is_active`)
VALUES
('16009410-0000-4000-8000-000000000001', 'pppppppp-0001-4000-8000-000000000001', 'tr', '/uploads/products/avar-rootstock-01.webp', '14909400-0000-4000-8000-000000000001', 'AVAR', 'AVAR ürün görseli', 'Resmî Vista Seeds ürün görseli.', 1, 1),
('16009410-0000-4000-8000-000000000002', 'pppppppp-0001-4000-8000-000000000001', 'en', '/uploads/products/avar-rootstock-01.webp', '14909400-0000-4000-8000-000000000001', 'AVAR', 'AVAR product image', 'Official Vista Seeds product image.', 1, 1),
('16009410-0000-4000-8000-000000000003', 'pppppppp-0001-4000-8000-000000000001', 'de', '/uploads/products/avar-rootstock-01.webp', '14909400-0000-4000-8000-000000000001', 'AVAR', 'AVAR Produktbild', 'Offizielles Vista-Seeds-Produktbild.', 1, 1),
('16009410-0000-4000-8000-000000000004', 'pppppppp-0001-4000-8000-000000000002', 'tr', 'https://www.vistaseeds.com.tr/uploads/uploads/products/525C9BB8-18F9-4C2B-B5BD-0BD9E296E293.png', '15009400-0000-4000-8000-000000000001', 'LUCKY F1', 'LUCKY F1 ürün görseli', 'Resmî Vista Seeds ürün görseli.', 1, 1),
('16009410-0000-4000-8000-000000000005', 'pppppppp-0001-4000-8000-000000000002', 'en', 'https://www.vistaseeds.com.tr/uploads/uploads/products/525C9BB8-18F9-4C2B-B5BD-0BD9E296E293.png', '15009400-0000-4000-8000-000000000001', 'LUCKY F1', 'LUCKY F1 product image', 'Official Vista Seeds product image.', 1, 1),
('16009410-0000-4000-8000-000000000006', 'pppppppp-0001-4000-8000-000000000002', 'de', 'https://www.vistaseeds.com.tr/uploads/uploads/products/525C9BB8-18F9-4C2B-B5BD-0BD9E296E293.png', '15009400-0000-4000-8000-000000000001', 'LUCKY F1', 'LUCKY F1 Produktbild', 'Offizielles Vista-Seeds-Produktbild.', 1, 1),
('16009410-0000-4000-8000-000000000007', 'pppppppp-0001-4000-8000-000000000003', 'tr', '/uploads/products/kizgin-f1-source-01.webp', '15009400-0000-4000-8000-000000000002', 'KIZGIN F1', 'KIZGIN F1 ürün görseli', 'Resmî Vista Seeds ürün görseli.', 1, 1),
('16009410-0000-4000-8000-000000000008', 'pppppppp-0001-4000-8000-000000000003', 'en', '/uploads/products/kizgin-f1-source-01.webp', '15009400-0000-4000-8000-000000000002', 'KIZGIN F1', 'KIZGIN F1 product image', 'Official Vista Seeds product image.', 1, 1),
('16009410-0000-4000-8000-000000000009', 'pppppppp-0001-4000-8000-000000000003', 'de', '/uploads/products/kizgin-f1-source-01.webp', '15009400-0000-4000-8000-000000000002', 'KIZGIN F1', 'KIZGIN F1 Produktbild', 'Offizielles Vista-Seeds-Produktbild.', 1, 1),
('16009410-0000-4000-8000-000000000010', 'pppppppp-0001-4000-8000-000000000004', 'tr', 'https://www.vistaseeds.com.tr/uploads/uploads/products/07CF9486-7623-45AF-B851-C971E1FA5780.png', '15009400-0000-4000-8000-000000000003', 'PRESTİJ F1', 'PRESTİJ F1 ürün görseli', 'Resmî Vista Seeds ürün görseli.', 1, 1),
('16009410-0000-4000-8000-000000000011', 'pppppppp-0001-4000-8000-000000000004', 'en', 'https://www.vistaseeds.com.tr/uploads/uploads/products/07CF9486-7623-45AF-B851-C971E1FA5780.png', '15009400-0000-4000-8000-000000000003', 'PRESTİJ F1', 'PRESTİJ F1 product image', 'Official Vista Seeds product image.', 1, 1),
('16009410-0000-4000-8000-000000000012', 'pppppppp-0001-4000-8000-000000000004', 'de', 'https://www.vistaseeds.com.tr/uploads/uploads/products/07CF9486-7623-45AF-B851-C971E1FA5780.png', '15009400-0000-4000-8000-000000000003', 'PRESTİJ F1', 'PRESTİJ F1 Produktbild', 'Offizielles Vista-Seeds-Produktbild.', 1, 1),
('16009410-0000-4000-8000-000000000013', 'pppppppp-0001-4000-8000-000000000005', 'tr', '/uploads/products/birlik-f1-source-01.webp', '15009400-0000-4000-8000-000000000004', 'BİRLİK F1', 'BİRLİK F1 ürün görseli', 'Resmî Vista Seeds ürün görseli.', 1, 1),
('16009410-0000-4000-8000-000000000014', 'pppppppp-0001-4000-8000-000000000005', 'en', '/uploads/products/birlik-f1-source-01.webp', '15009400-0000-4000-8000-000000000004', 'BİRLİK F1', 'BİRLİK F1 product image', 'Official Vista Seeds product image.', 1, 1),
('16009410-0000-4000-8000-000000000015', 'pppppppp-0001-4000-8000-000000000005', 'de', '/uploads/products/birlik-f1-source-01.webp', '15009400-0000-4000-8000-000000000004', 'BİRLİK F1', 'BİRLİK F1 Produktbild', 'Offizielles Vista-Seeds-Produktbild.', 1, 1),
('16009410-0000-4000-8000-000000000016', 'pppppppp-0001-4000-8000-000000000006', 'tr', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.jpg', '15009400-0000-4000-8000-000000000005', 'CANKAN F1', 'CANKAN F1 ürün görseli', 'Resmî Vista Seeds ürün görseli.', 1, 1),
('16009410-0000-4000-8000-000000000017', 'pppppppp-0001-4000-8000-000000000006', 'en', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.jpg', '15009400-0000-4000-8000-000000000005', 'CANKAN F1', 'CANKAN F1 product image', 'Official Vista Seeds product image.', 1, 1),
('16009410-0000-4000-8000-000000000018', 'pppppppp-0001-4000-8000-000000000006', 'de', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.jpg', '15009400-0000-4000-8000-000000000005', 'CANKAN F1', 'CANKAN F1 Produktbild', 'Offizielles Vista-Seeds-Produktbild.', 1, 1),
('16009410-0000-4000-8000-000000000019', 'pppppppp-0001-4000-8000-000000000007', 'tr', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.png', '15009400-0000-4000-8000-000000000006', 'TIRPAN F1', 'TIRPAN F1 ürün görseli', 'Resmî Vista Seeds ürün görseli.', 1, 1),
('16009410-0000-4000-8000-000000000020', 'pppppppp-0001-4000-8000-000000000007', 'en', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.png', '15009400-0000-4000-8000-000000000006', 'TIRPAN F1', 'TIRPAN F1 product image', 'Official Vista Seeds product image.', 1, 1),
('16009410-0000-4000-8000-000000000021', 'pppppppp-0001-4000-8000-000000000007', 'de', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Ads_z_tasar_m.png', '15009400-0000-4000-8000-000000000006', 'TIRPAN F1', 'TIRPAN F1 Produktbild', 'Offizielles Vista-Seeds-Produktbild.', 1, 1),
('16009410-0000-4000-8000-000000000022', 'pppppppp-0001-4000-8000-000000000008', 'tr', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Untitled_design.jpg', '15009400-0000-4000-8000-000000000007', 'SARAY F1', 'SARAY F1 ürün görseli', 'Resmî Vista Seeds ürün görseli.', 1, 1),
('16009410-0000-4000-8000-000000000023', 'pppppppp-0001-4000-8000-000000000008', 'en', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Untitled_design.jpg', '15009400-0000-4000-8000-000000000007', 'SARAY F1', 'SARAY F1 product image', 'Official Vista Seeds product image.', 1, 1),
('16009410-0000-4000-8000-000000000024', 'pppppppp-0001-4000-8000-000000000008', 'de', 'https://www.vistaseeds.com.tr/uploads/uploads/products/Untitled_design.jpg', '15009400-0000-4000-8000-000000000007', 'SARAY F1', 'SARAY F1 Produktbild', 'Offizielles Vista-Seeds-Produktbild.', 1, 1);


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
