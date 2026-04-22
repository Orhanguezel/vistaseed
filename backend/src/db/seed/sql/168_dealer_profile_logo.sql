SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE dealer_profiles
  ADD COLUMN IF NOT EXISTS logo_url VARCHAR(1024) NULL AFTER company_name;
