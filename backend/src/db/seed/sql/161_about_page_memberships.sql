-- vistaseeds hakkimizda sayfasi — üyelikler bölümü
-- Logoların storage_assets kaydı: 007_storage_assets.sql (ID 105-108)
-- Logo dosyaları: backend/uploads/about/memberships/*.png (elle konulacak)
-- Admin panelden değiştirilebilir: site_settings.about_page.memberships
SET NAMES utf8mb4;

-- storage_assets kayitlarini guncelle (logo dosyasi yuklenince size guncellenir)
INSERT INTO `storage_assets`
  (`id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `url`,
   `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`)
VALUES
  ('00009400-0000-4000-8000-000000000105','atso.png','default','about/memberships/atso.png','about/memberships','image/png',0,'/uploads/about/memberships/atso.png','local','about/memberships/atso.png','image','png'),
  ('00009400-0000-4000-8000-000000000106','tarim-bakanligi.png','default','about/memberships/tarim-bakanligi.png','about/memberships','image/png',0,'/uploads/about/memberships/tarim-bakanligi.png','local','about/memberships/tarim-bakanligi.png','image','png'),
  ('00009400-0000-4000-8000-000000000107','turktob-dagiticilari.png','default','about/memberships/turktob-dagiticilari.png','about/memberships','image/png',0,'/uploads/about/memberships/turktob-dagiticilari.png','local','about/memberships/turktob-dagiticilari.png','image','png'),
  ('00009400-0000-4000-8000-000000000108','tsuab.png','default','about/memberships/tsuab.png','about/memberships','image/png',0,'/uploads/about/memberships/tsuab.png','local','about/memberships/tsuab.png','image','png')
ON DUPLICATE KEY UPDATE
  `name`    = VALUES(`name`),
  `path`    = VALUES(`path`),
  `folder`  = VALUES(`folder`),
  `mime`    = VALUES(`mime`),
  `url`     = VALUES(`url`),
  `provider`= VALUES(`provider`),
  `provider_public_id`     = VALUES(`provider_public_id`),
  `provider_resource_type` = VALUES(`provider_resource_type`),
  `provider_format`        = VALUES(`provider_format`);

-- about_page site_settings: memberships bolumu ekleniyor
-- logo_url degerleri 007_storage_assets.sql'deki url alanlariyla eslesiyor
-- MariaDB uyumlu: JSON_MERGE_PATCH JSON string'i dogrudan kabul eder, CAST gerekmez.
UPDATE `site_settings`
SET `value` = JSON_MERGE_PATCH(
  `value`,
  '{"memberships":{"title":"Üyesi Olduğumuz Kuruluşlar","items":[{"name":"Antalya Ticaret ve Sanayi Odası","logo_url":"/uploads/about/memberships/atso.png","website_url":"https://www.atso.org.tr","description":"ATSO üyesi"},{"name":"T.C. Tarım ve Orman Bakanlığı","logo_url":"/uploads/about/memberships/tarim-bakanligi.png","website_url":"https://www.tarimorman.gov.tr","description":"Ruhsatlı tohum üreticisi ve dağıtıcısı"},{"name":"Tohum Dağıtıcıları Alt Birliği","logo_url":"/uploads/about/memberships/turktob-dagiticilari.png","website_url":"https://www.turktob.org.tr","description":"TÜRKTOB bünyesinde üye"},{"name":"Tohum Sanayicileri ve Üreticileri Alt Birliği","logo_url":"/uploads/about/memberships/tsuab.png","website_url":"https://www.turktob.org.tr","description":"TSÜAB üyesi"}]}}'
)
WHERE `key` = 'about_page' AND `locale` = 'tr';
