-- 165_products_charliston_tr.sql
-- TR + DE: "Charliston" -> "Çarliston" (EN "Charleston" dokunulmaz). Idempotent. 2026-06-04.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE `product_i18n`
SET `title`            = REPLACE(REPLACE(`title`,'Charliston','Çarliston'),'charliston','çarliston'),
    `alt`              = REPLACE(REPLACE(`alt`,'Charliston','Çarliston'),'charliston','çarliston'),
    `meta_title`       = REPLACE(REPLACE(`meta_title`,'Charliston','Çarliston'),'charliston','çarliston'),
    `meta_description` = REPLACE(REPLACE(`meta_description`,'Charliston','Çarliston'),'charliston','çarliston'),
    `tags`             = REPLACE(REPLACE(`tags`,'Charliston','Çarliston'),'charliston','çarliston')
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000002' AND `locale` IN ('tr','de');

UPDATE `product_specs`
SET `value` = REPLACE(REPLACE(`value`,'Charliston','Çarliston'),'charliston','çarliston')
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000002' AND `locale` IN ('tr','de') AND `value` LIKE '%harliston%';
