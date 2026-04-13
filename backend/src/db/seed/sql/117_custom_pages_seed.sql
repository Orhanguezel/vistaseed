SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `custom_pages` (`id`, `module_key`, `is_published`, `display_order`)
VALUES
  ('55555555-5555-4555-8555-555555555551', 'kurumsal', 1, 1),
  ('55555555-5555-4555-8555-555555555552', 'yasal', 1, 2),
  ('55555555-5555-4555-8555-555555555553', 'yasal', 1, 3),
  ('55555555-5555-4555-8555-555555555554', 'yasal', 1, 4)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `display_order` = VALUES(`display_order`);

INSERT INTO `custom_pages_i18n`
  (`page_id`, `locale`, `title`, `slug`, `content`, `summary`, `meta_title`, `meta_description`)
VALUES
  (
    '55555555-5555-4555-8555-555555555551',
    'tr',
    'Hakkımızda',
    'hakkimizda',
    '{"html":"<p>Firmamız sektöründe uzun yıllara dayanan tecrübesiyle kaliteli ürün ve hizmet sunmaktadır.</p><p>Müşteri memnuniyetini ön planda tutarak profesyonel çözümler üretiyoruz.</p>"}',
    'Firmamız hakkında kurumsal bilgi.',
    'Hakkımızda | {{SITE_NAME}}',
    '{{SITE_NAME}} hakkında kurumsal bilgi ve marka yaklaşımı.'
  ),
  (
    '55555555-5555-4555-8555-555555555552',
    'tr',
    'Gizlilik Politikası',
    'gizlilik-politikasi',
    '{"html":"<p>Kişisel verileriniz, hizmet sunumu ve yasal yükümlülükler kapsamında işlenir.</p><p>Veri güvenliği için teknik ve idari tedbirler uygulanır.</p>"}',
    'Gizlilik ilkeleri ve veri işleme yaklaşımı.',
    'Gizlilik Politikası | {{SITE_NAME}}',
    '{{SITE_NAME}} gizlilik politikası ve veri koruma yaklaşımı.'
  ),
  (
    '55555555-5555-4555-8555-555555555553',
    'tr',
    'KVKK Aydınlatma Metni',
    'kvkk',
    '{"html":"<p>6698 sayılı KVKK kapsamında veri sorumlusu olarak kişisel verilerinizi açık rıza veya kanuni sebepler doğrultusunda işleriz.</p>"}',
    'KVKK kapsamında aydınlatma metni.',
    'KVKK | {{SITE_NAME}}',
    '{{SITE_NAME}} KVKK aydınlatma metni.'
  ),
  (
    '55555555-5555-4555-8555-555555555554',
    'tr',
    'Kullanım Koşulları',
    'kullanim-kosullari',
    '{"html":"<p>Web sitemizi kullanan tüm taraflar, belirtilen kurallara uymakla yükümlüdür.</p><p>İçeriklerimiz bilgi amaçlıdır ve izinsiz kopyalanamaz.</p>"}',
    'Platform kullanım koşulları.',
    'Kullanım Koşulları | {{SITE_NAME}}',
    '{{SITE_NAME}} hizmet kullanım koşulları.'
  ),
  (
    '55555555-5555-4555-8555-555555555551',
    'en',
    'About Us',
    'about-us',
    '{"html":"<p>vistaseeds delivers seed solutions backed by field experience, research, and sustainable production principles.</p><p>We focus on quality, reliability, and long-term grower partnerships.</p>"}',
    'Corporate overview of vistaseeds.',
    'About Us | {{SITE_NAME}}',
    'Learn more about vistaseeds, our background, and our production approach.'
  ),
  (
    '55555555-5555-4555-8555-555555555552',
    'en',
    'Privacy Policy',
    'privacy-policy',
    '{"html":"<p>Your personal data is processed within the scope of service delivery and legal obligations.</p><p>Technical and administrative safeguards are applied to protect data security.</p>"}',
    'Privacy principles and data processing approach.',
    'Privacy Policy | {{SITE_NAME}}',
    '{{SITE_NAME}} privacy policy and data protection approach.'
  ),
  (
    '55555555-5555-4555-8555-555555555553',
    'en',
    'KVKK Disclosure Notice',
    'kvkk-disclosure',
    '{"html":"<p>As a data controller under Law No. 6698, we process personal data based on explicit consent or legal grounds.</p>"}',
    'Disclosure notice within the scope of KVKK.',
    'KVKK Disclosure Notice | {{SITE_NAME}}',
    '{{SITE_NAME}} KVKK disclosure notice.'
  ),
  (
    '55555555-5555-4555-8555-555555555554',
    'en',
    'Terms of Use',
    'terms-of-use',
    '{"html":"<p>All parties using our website are expected to comply with the stated rules.</p><p>Our content is for informational purposes and may not be copied without permission.</p>"}',
    'Platform terms of use.',
    'Terms of Use | {{SITE_NAME}}',
    '{{SITE_NAME}} service terms of use.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `content` = VALUES(`content`),
  `summary` = VALUES(`summary`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);
