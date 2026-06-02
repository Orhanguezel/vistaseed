-- Vista Seeds — storage temizliği + marka medyası panel kayıtları
-- 1) Diskte olmayan test upload kayıtlarını sil (admin storage'da 404 veren görseller)
-- 2) favicon/appletouch kayıtlarının eski metadata'sını güncelle (artık 512x512)
-- 3) Yeni marka dosyalarını (favicon-sq, appletouch-sq, x-profile, x-banner) panele ekle
SET NAMES utf8mb4;

DELETE FROM `storage_assets`
WHERE `path` IN (
    'products/vs_test_upload.png','products/clean_test.png','products/faz3_test.png',
    'products/faz3_v2.png','products/final_test.png','products/proof.png',
    'products/dbg.png','products/faz2_test.png'
  )
  AND `name` IN (
    'vs_test_upload.png','clean_test.png','faz3_test.png','faz3_v2.png',
    'final_test.png','proof.png','dbg.png','faz2_test.png'
  );

UPDATE `storage_assets` SET `size` = 132536, `width` = 512, `height` = 512, `updated_at` = NOW(3)
  WHERE `bucket` = 'default' AND `path` = 'media/logo/favicon.png';
UPDATE `storage_assets` SET `size` = 132536, `width` = 512, `height` = 512, `updated_at` = NOW(3)
  WHERE `bucket` = 'default' AND `path` = 'media/logo/appletouch.png';

INSERT INTO `storage_assets`
  (`id`,`name`,`bucket`,`path`,`folder`,`mime`,`size`,`width`,`height`,`url`,`provider`)
VALUES
  (UUID(),'favicon-sq.png','default','media/logo/favicon-sq.png','media/logo','image/png',132536,512,512,'/uploads/media/logo/favicon-sq.png','local'),
  (UUID(),'appletouch-sq.png','default','media/logo/appletouch-sq.png','media/logo','image/png',132536,512,512,'/uploads/media/logo/appletouch-sq.png','local'),
  (UUID(),'x-profile-400x400.png','default','media/logo/x-profile-400x400.png','media/logo','image/png',67055,400,400,'/uploads/media/logo/x-profile-400x400.png','local'),
  (UUID(),'x-banner-1500x500.png','default','media/logo/x-banner-1500x500.png','media/logo','image/png',135705,1500,500,'/uploads/media/logo/x-banner-1500x500.png','local')
ON DUPLICATE KEY UPDATE
  `name`=VALUES(`name`), `folder`=VALUES(`folder`), `mime`=VALUES(`mime`),
  `size`=VALUES(`size`), `width`=VALUES(`width`), `height`=VALUES(`height`),
  `url`=VALUES(`url`), `provider`=VALUES(`provider`), `updated_at`=NOW(3);
