-- =============================================================
-- Contact Settings Patch
-- Adres ve Harita bilgilerini gunceller.
-- =============================================================

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'contact_address', '*', '"Antalya Organize Sanayi Bolgesi, 2. Kisim, No:123, Dosemealti / Antalya"'),
(UUID(), 'contact_map_lat', '*', '"37.0784"'),
(UUID(), 'contact_map_lng', '*', '"30.6053"'),
(UUID(), 'contact_map_iframe', '*', '""')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
