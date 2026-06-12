-- =============================================================
-- FILE: src/db/seed/sql/183_facebook_content_plan_seed.sql
-- DESCRIPTION: Facebook içerik planı — haftalık sabit 3 slot
-- (uzun metin + link + görsel; üretici topluluğuna dönük ton)
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO `social_content_plans`
  (`id`, `platform`, `slot_key`, `day_of_week`, `hour`, `minute`, `template`, `pillar`, `topic`, `preferred_product`, `post_format`, `media_required`, `is_active`, `order_index`, `created_at`, `updated_at`)
VALUES
  ('18309400-0000-4000-8000-000000000001','facebook','fb-01-variety',1,10,0,'variety_promo','Çeşit tanıtımı','Haftanın çeşidi — uzun açıklama + ürün linki',NULL,'post',1,1,1,NOW(),NOW()),
  ('18309400-0000-4000-8000-000000000002','facebook','fb-02-value',3,14,0,'local_seed_value','Yerli tohum değeri','Yerli ıslah ve üretici güveni',NULL,'post',0,1,2,NOW(),NOW()),
  ('18309400-0000-4000-8000-000000000003','facebook','fb-03-tip',5,10,0,'agronomy_tip','Agronomi','Haftalık yetiştiricilik ipucu',NULL,'post',0,1,3,NOW(),NOW());
