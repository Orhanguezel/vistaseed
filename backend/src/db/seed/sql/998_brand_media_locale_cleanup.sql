-- =============================================================
-- 998_brand_media_locale_cleanup.sql
-- Brand asset key'leri (logo/favicon/apple-touch/og) locale-agnostic.
-- Sadece locale='*' kalir, tr/en gibi locale-bound varyantlar temizlenir.
--
-- Sebep: Admin Brand Media tab '*' locale ile yazar. Eger tr/en kayitlari
-- da varsa, public API fallback chain `tr -> *` sirasiyla `tr` kaydini bulur
-- ve admin'den degistirilen `*` kaydini gormez. Bu seed her run'da tr/en
-- kayitlarini siler, fallback chain `*`'a kadar duser → admin <-> public sync.
--
-- Idempotent: tr/en yoksa no-op. 999'dan once calisir (storage_assets'i etkilemez).
-- =============================================================

DELETE FROM `site_settings`
WHERE `key` IN (
  'site_logo',
  'site_logo_dark',
  'site_logo_light',
  'site_favicon',
  'site_apple_touch_icon',
  'site_app_icon_512',
  'site_og_default_image'
)
AND `locale` <> '*';
