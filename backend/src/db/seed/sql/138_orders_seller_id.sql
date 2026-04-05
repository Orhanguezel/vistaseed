-- P3.1 — Coklu satici hazirligi: siparis satıcı ataması (NULL = VistaSeed merkez)
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `orders`
  ADD COLUMN `seller_id` CHAR(36) NULL DEFAULT NULL AFTER `dealer_id`,
  ADD KEY `orders_seller_id_idx` (`seller_id`),
  ADD CONSTRAINT `fk_orders_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
