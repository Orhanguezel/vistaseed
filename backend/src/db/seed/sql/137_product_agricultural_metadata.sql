-- =============================================================
-- Products: tarimsal metadata (P2.2) — locale bagimsiz teknik alanlar
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `products`
  ADD COLUMN `botanical_name` VARCHAR(255) NULL DEFAULT NULL AFTER `review_count`,
  ADD COLUMN `planting_seasons` JSON NULL DEFAULT (JSON_ARRAY()),
  ADD COLUMN `harvest_days` INT NULL DEFAULT NULL,
  ADD COLUMN `climate_zones` JSON NULL DEFAULT (JSON_ARRAY()),
  ADD COLUMN `soil_types` JSON NULL DEFAULT (JSON_ARRAY()),
  ADD COLUMN `water_need` VARCHAR(16) NULL DEFAULT NULL,
  ADD COLUMN `sun_exposure` VARCHAR(16) NULL DEFAULT NULL,
  ADD COLUMN `min_temp` DECIMAL(5,2) NULL DEFAULT NULL,
  ADD COLUMN `max_temp` DECIMAL(5,2) NULL DEFAULT NULL,
  ADD COLUMN `germination_days` INT NULL DEFAULT NULL,
  ADD COLUMN `seed_depth_cm` DECIMAL(5,2) NULL DEFAULT NULL,
  ADD COLUMN `row_spacing_cm` INT NULL DEFAULT NULL,
  ADD COLUMN `plant_spacing_cm` INT NULL DEFAULT NULL,
  ADD COLUMN `yield_per_sqm` VARCHAR(50) NULL DEFAULT NULL;
