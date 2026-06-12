-- =============================================================
-- FILE: src/db/seed/sql/184_instagram_content_plan_seed.sql
-- DESCRIPTION: Instagram içerik planı — görsel öncelikli 3 post + 1 story
-- (her gönderide görsel zorunlu; caption kısa + hashtag bloğu, link yok)
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO `social_content_plans`
  (`id`, `platform`, `slot_key`, `day_of_week`, `hour`, `minute`, `template`, `pillar`, `topic`, `preferred_product`, `post_format`, `media_required`, `is_active`, `order_index`, `created_at`, `updated_at`)
VALUES
  ('18409400-0000-4000-8000-000000000001','instagram','ig-01-variety-post',2,12,0,'variety_promo','Çeşit kartı','Haftanın çeşidi — ürün görseli + kısa metin',NULL,'post',1,1,1,NOW(),NOW()),
  ('18409400-0000-4000-8000-000000000002','instagram','ig-02-research-post',4,12,0,'human_research','İnsan/Ar-Ge','Islah ve laboratuvar perde arkası',NULL,'post',1,1,2,NOW(),NOW()),
  ('18409400-0000-4000-8000-000000000003','instagram','ig-03-variety-story',5,17,0,'variety_promo','Story','Haftanın çeşidi story (sadece görsel)',NULL,'story',1,1,3,NOW(),NOW()),
  ('18409400-0000-4000-8000-000000000004','instagram','ig-04-tip-post',6,11,0,'agronomy_tip','Agronomi','Hafta sonu yetiştiricilik ipucu',NULL,'post',1,1,4,NOW(),NOW());
