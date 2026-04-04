-- Bayi agi (public): sehir / koordinat / haritada listeleme

ALTER TABLE dealer_profiles
  ADD COLUMN city VARCHAR(128) NULL DEFAULT NULL AFTER company_name,
  ADD COLUMN region VARCHAR(128) NULL DEFAULT NULL AFTER city,
  ADD COLUMN latitude DECIMAL(10, 7) NULL DEFAULT NULL AFTER region,
  ADD COLUMN longitude DECIMAL(10, 7) NULL DEFAULT NULL AFTER latitude,
  ADD COLUMN list_public TINYINT(1) NOT NULL DEFAULT 1 AFTER is_approved;

ALTER TABLE dealer_profiles
  ADD KEY dealer_profiles_city_idx (city),
  ADD KEY dealer_profiles_region_idx (region),
  ADD KEY dealer_profiles_list_public_idx (list_public);

UPDATE dealer_profiles
SET
  city = 'Ankara',
  region = 'Ic Anadolu',
  latitude = 39.9334000,
  longitude = 32.8597000,
  list_public = 1
WHERE company_name = 'Test Bayi Ltd.';
