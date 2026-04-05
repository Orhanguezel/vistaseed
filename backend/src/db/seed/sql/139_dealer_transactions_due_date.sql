-- P3.2: vade takibi (opsiyonel due_date)
-- Not: Sütun zaten varsa (ER_DUP_FIELDNAME) bu dosyayı atlayın veya tek seferlik çalıştırın.
ALTER TABLE `dealer_transactions`
  ADD COLUMN `due_date` DATETIME(3) NULL DEFAULT NULL AFTER `description`;

CREATE INDEX `dealer_tx_due_date_idx` ON `dealer_transactions` (`due_date`);
