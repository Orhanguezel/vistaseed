-- =============================================================
-- Telegram notification settings + templates (VistaSeeds)
-- NOTE: Credentials set — admin panelden güncellenebilir (site_settings)
-- =============================================================

-- Autoreply defaults
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'telegram_autoreply_enabled', '*', 'false', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'telegram_autoreply_enabled' AND `locale` = '*'
);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'telegram_autoreply_mode', '*', 'simple', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'telegram_autoreply_mode' AND `locale` = '*'
);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'telegram_autoreply_template', '*', 'Mesajınız alındı. En kısa sürede size dönüş yapacağız.', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'telegram_autoreply_template' AND `locale` = '*'
);

-- Base switches
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
  (UUID(), 'telegram_notifications_enabled', '*', 'false', NOW(), NOW()),
  (UUID(), 'telegram_webhook_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_bot_token', '*', '', NOW(), NOW()),
  (UUID(), 'telegram_default_chat_id', '*', '', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW();

-- Event flags (VistaSeeds)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
  (UUID(), 'telegram_event_new_catalog_request_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_offer_request_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_contact_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_ticket_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_ticket_replied_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_newsletter_subscription_enabled', '*', 'true', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW();

-- Event templates (VistaSeeds)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
  (
    UUID(),
    'telegram_template_new_catalog_request',
    '*',
    '📚 *Yeni Katalog Talebi*\\n\\n👤 Ad Soyad: {{customer_name}}\\n📧 E-posta: {{customer_email}}\\n📱 Telefon: {{customer_phone}}\\n🏢 Firma: {{company_name}}\\n💬 Mesaj: {{message}}\\n📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_offer_request',
    '*',
    '💰 *Yeni Teklif Talebi*\\n\\n👤 Ad Soyad: {{customer_name}}\\n📧 E-posta: {{customer_email}}\\n📱 Telefon: {{customer_phone}}\\n🏢 Firma: {{company_name}}\\n🔧 Ürün/Hizmet: {{product_service}}\\n💬 Detay: {{message}}\\n📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_contact',
    '*',
    '📞 *Yeni İletişim Talebi*\\n\\n👤 Ad Soyad: {{customer_name}}\\n📧 E-posta: {{customer_email}}\\n📱 Telefon: {{customer_phone}}\\n🏢 Firma: {{company_name}}\\n📝 Konu: {{subject}}\\n💬 Mesaj: {{message}}\\n📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_ticket',
    '*',
    '🎫 *Yeni Destek Talebi*\\n\\n👤 Kullanıcı: {{user_name}}\\n📧 E-posta: {{user_email}}\\n📝 Konu: {{subject}}\\n⚠️ Öncelik: {{priority}}\\n💬 Mesaj: {{message}}\\n📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_ticket_replied',
    '*',
    '✅ *Destek Talebi Yanıtlandı*\\n\\n👤 Kullanıcı: {{user_name}}\\n📝 Konu: {{subject}}\\n⚠️ Öncelik: {{priority}}\\n💬 Yanıt: {{message}}\\n📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_newsletter_subscription',
    '*',
    '📬 *Yeni Bülten Aboneliği*\\n\\n📧 E-posta: {{email}}\\n👤 Ad: {{name}}\\n🌐 Dil: {{locale}}\\n📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  )
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW();
