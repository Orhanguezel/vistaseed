-- =============================================================
-- Resmi Firma Bilgileri (Sipariş Formu PDF header/footer için)
-- Boş anahtarlar oluşturulur; admin panelden doldurur.
-- Mevcut değer varsa KORUNUR (ON DUPLICATE KEY UPDATE id=id → no-op).
-- =============================================================

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'company_legal_name', '*', '""'),
(UUID(), 'company_tax_office', '*', '""'),
(UUID(), 'company_tax_no',     '*', '""'),
(UUID(), 'company_mersis_no',  '*', '""'),
(UUID(), 'company_web',        '*', '""'),
(UUID(), 'company_iban',       '*', '""'),
(UUID(), 'company_bank',       '*', '""'),
(UUID(), 'company_logo_url',   '*', '"/assets/logo/vistaseed_logo_green.png"')
ON DUPLICATE KEY UPDATE `id` = `id`;
