-- =============================================================
-- FILE: src/db/seed/sql/182_twitter_content_plan_seed.sql
-- DESCRIPTION: X/Twitter içerik planı — 15 maddelik strateji döngüsü
-- (Çar/Per/Cuma 17:00 TR; satır sayısı > gün sayısı = döngü modu)
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO `social_content_plans`
  (`id`, `platform`, `slot_key`, `day_of_week`, `hour`, `minute`, `template`, `pillar`, `topic`, `preferred_product`, `post_format`, `media_required`, `is_active`, `order_index`, `created_at`, `updated_at`)
VALUES
  ('18209400-0000-4000-8000-000000000001','twitter','01-export-manifesto',3,17,0,'export_vision','İhracat/yerli gurur','Açılış/manifesto',NULL,'post',0,1,1,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000002','twitter','02-kapya-charliston-poll',4,17,0,'interaction_poll','Etkileşim','Kapya mı charliston mu?',NULL,'post',0,1,2,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000003','twitter','03-cankan-f1',5,17,0,'variety_promo','Çeşit kartı','Cankan F1 kırmızı kapya','Cankan','post',1,1,3,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000004','twitter','04-lab-research',3,17,0,'human_research','İnsan/Ar-Ge','Lab ve ıslah perde arkası',NULL,'post',0,1,4,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000005','twitter','05-season-challenge-question',4,17,0,'interaction_question','Etkileşim','Bu sezon en çok hangi sorun zorladı?',NULL,'post',0,1,5,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000006','twitter','06-tirpan-f1',5,17,0,'variety_promo','Çeşit kartı','Tırpan F1 kapya','Tırpan','post',1,1,6,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000007','twitter','07-field-proof',3,17,0,'field_proof','Saha kanıtı','Tarlada güçlü çıkış',NULL,'post',0,1,7,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000008','twitter','08-certified-seed-myth',4,17,0,'seed_myth','Bilgi/efsane-yıkma','Sertifikalı tohum neden önemli?',NULL,'post',0,1,8,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000009','twitter','09-birlik-f1',5,17,0,'variety_promo','Çeşit kartı','Birlik F1 üçburun','Birlik','post',1,1,9,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000010','twitter','10-breeding-story',3,17,0,'human_research','İnsan/Ar-Ge','Bir çeşidin ıslah hikayesi',NULL,'post',0,1,10,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000011','twitter','11-tomato-poll',4,17,0,'interaction_poll','Etkileşim','Domateste tat mı raf ömrü mü?',NULL,'post',0,1,11,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000012','twitter','12-export-vision',5,17,0,'export_vision','İhracat/vizyon','Türk tohumunu dünyaya taşıma hedefi',NULL,'post',0,1,12,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000013','twitter','13-lucky-f1',3,17,0,'variety_promo','Çeşit kartı','Lucky F1 charliston','Lucky','post',1,1,13,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000014','twitter','14-grower-proof',4,17,0,'field_proof','Saha kanıtı','Üretici görüşü / kısa video',NULL,'post',0,1,14,NOW(),NOW()),
  ('18209400-0000-4000-8000-000000000015','twitter','15-saray-f1',5,17,0,'variety_promo','Çeşit kartı','Saray F1 dolmalık','Saray','post',1,1,15,NOW(),NOW());
