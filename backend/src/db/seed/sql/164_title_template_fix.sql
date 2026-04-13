-- Fix title_template: {{title}} → %s, {{SITE_NAME}} → vistaseeds
-- Bu seed 006_site_settings_seo_seed.sql'deki eski format'ı düzeltir
-- 160_geo_seo_boost_seed.sql zaten %s kullanıyor ancak bazı locale kayıtları eski format'ta kalabilir

UPDATE site_settings
SET `value` = JSON_SET(
  `value`,
  '$.title_template',
  '%s | vistaseeds'
)
WHERE `key` = 'site_seo'
  AND JSON_UNQUOTE(JSON_EXTRACT(`value`, '$.title_template')) LIKE '%{{%';

-- site_meta_default için de aynı kontrol
UPDATE site_settings
SET `value` = JSON_SET(
  `value`,
  '$.title_template',
  '%s | vistaseeds'
)
WHERE `key` = 'site_meta_default'
  AND JSON_TYPE(`value`) = 'OBJECT'
  AND JSON_UNQUOTE(JSON_EXTRACT(`value`, '$.title_template')) LIKE '%{{%';
