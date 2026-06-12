-- =============================================================
-- FILE: src/db/seed/sql/185_linkedin_content_plan_seed.sql
-- DESCRIPTION: LinkedIn içerik planı — kurumsal ton, haftalık 2 slot
-- (profesyonel metin, az hashtag, sektör/vizyon ağırlıklı)
-- =============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO `social_content_plans`
  (`id`, `platform`, `slot_key`, `day_of_week`, `hour`, `minute`, `template`, `pillar`, `topic`, `preferred_product`, `post_format`, `media_required`, `is_active`, `order_index`, `created_at`, `updated_at`)
VALUES
  ('18509400-0000-4000-8000-000000000001','linkedin','li-01-vision',2,9,30,'export_vision','Kurumsal vizyon','Yerli ıslah ve ihracat hedefi',NULL,'post',0,1,1,NOW(),NOW()),
  ('18509400-0000-4000-8000-000000000002','linkedin','li-02-expertise',4,9,30,'human_research','Uzmanlık/Ar-Ge','Islah programı ve saha verisi',NULL,'post',0,1,2,NOW(),NOW());
