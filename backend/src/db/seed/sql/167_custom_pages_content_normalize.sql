-- =============================================================
-- custom_pages_i18n.content — JSON wrapper normalizasyonu
-- Neden: Onceki seed'ler (117, 117c, 142, 153, 153b) icerigi
--   '{"html":"<html>..."}'
-- formatinda SQL literal'a yaziyordu. MySQL \" -> " cevirdigi icin
-- DB'ye GECERSIZ JSON dusuyor, frontend JSON.parse patliyor ve sayfa
-- `{"html":"..."}` olarak raw text gosteriyordu.
-- Bu seed wrapper'i sayfa kayidinda plain HTML'e donusturur.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1) Ara bosluklu varyanti normalize et: {"html": " -> {"html":"
UPDATE `custom_pages_i18n`
SET `content` = REPLACE(`content`, '{"html": "', '{"html":"')
WHERE `content` LIKE '{"html": "%';

-- 2) Wrapper'i soy: {"html":"<...>"} -> <...>
UPDATE `custom_pages_i18n`
SET `content` = SUBSTRING(`content`, 10, CHAR_LENGTH(`content`) - 11)
WHERE `content` LIKE '{"html":"%"}'
  AND LEFT(`content`, 9) = '{"html":"'
  AND RIGHT(`content`, 2) = '"}';
