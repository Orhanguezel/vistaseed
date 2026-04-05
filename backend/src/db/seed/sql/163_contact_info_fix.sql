-- 163_contact_info_fix.sql
-- İletişim bilgilerini ve neden-biz özet metnini üretim değerleriyle günceller.
-- Direkt çalıştırma: mysql -h 127.0.0.1 -P 3306 -u app -papp vistaseed < 163_contact_info_fix.sql

-- ── KONTAKt BİLGİLERİ ────────────────────────────────────────────────────────
UPDATE `site_settings` SET `value` = '"info@vistaseed.com.tr"'  WHERE `key` = 'contact_email';
UPDATE `site_settings` SET `value` = '"info@vistaseed.com.tr"'  WHERE `key` = 'contact_to_email';
UPDATE `site_settings` SET `value` = '"+90 530 048 41 83"'      WHERE `key` = 'contact_phone';
UPDATE `site_settings` SET `value` = '"+90 530 048 41 83"'      WHERE `key` = 'contact_phone_display';
UPDATE `site_settings` SET `value` = '"05300484183"'             WHERE `key` = 'contact_phone_tel';
UPDATE `site_settings` SET `value` = '"info@vistaseed.com.tr"'  WHERE `key` = 'site__contact_email';
UPDATE `site_settings` SET `value` = '"+90 530 048 41 83"'      WHERE `key` = 'site__contact_phone';

-- ── SEO LOCAL BUSINESS JSON ───────────────────────────────────────────────────
UPDATE `site_settings`
SET `value` = JSON_SET(
  `value`,
  '$.email',     'info@vistaseed.com.tr',
  '$.telephone', '+90 530 048 41 83'
)
WHERE `key` = 'seo_local_business';

-- ── NEDEN-BİZ CUSTOM PAGE ÖZET ───────────────────────────────────────────────
UPDATE `custom_pages_i18n`
SET `summary` = 'Vista Seeds ile çalışmanın farkını ortaya koyan temel avantajlar ve öne çıkan değerler.'
WHERE `page_id` = 'neden-biz-uuid-001' AND `locale` = 'tr';
