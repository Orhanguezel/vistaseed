SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `support_ticket_messages` (
  `id` CHAR(36) NOT NULL,
  `ticket_id` CHAR(36) NOT NULL,
  `sender_type` VARCHAR(16) NOT NULL,
  `author_id` CHAR(36) DEFAULT NULL,
  `body` LONGTEXT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `support_ticket_messages_ticket_idx` (`ticket_id`),
  KEY `support_ticket_messages_created_idx` (`created_at`),
  KEY `support_ticket_messages_author_idx` (`author_id`),
  CONSTRAINT `fk_support_ticket_message_ticket`
    FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_support_ticket_message_author`
    FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `support_ticket_messages` (`id`, `ticket_id`, `sender_type`, `author_id`, `body`, `created_at`)
SELECT UUID(), `t`.`id`, 'user', NULL, `t`.`message`, `t`.`created_at`
FROM `support_tickets` `t`
WHERE NOT EXISTS (
  SELECT 1 FROM `support_ticket_messages` `m` WHERE `m`.`ticket_id` = `t`.`id` LIMIT 1
);
