SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `custom_pages` (`id`, `module_key`, `is_published`, `display_order`)
VALUES
  ('55555555-5555-4555-8555-555555555551', 'kurumsal', 1, 1),
  ('55555555-5555-4555-8555-555555555552', 'yasal', 1, 2),
  ('55555555-5555-4555-8555-555555555553', 'yasal', 1, 3),
  ('55555555-5555-4555-8555-555555555554', 'yasal', 1, 4),
  ('55555555-5555-4555-8555-555555555555', 'yasal', 1, 5)
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
    '{"html":"<p>vistaseed, şehirler arası taşıma kapasitesini dijital olarak erişilebilir hale getiren bir P2P kargo pazaryeridir.</p><p>Müşteriler uygun güzergahları keşfeder, taşıyıcılar ise boş kapasitelerini gelire dönüştürür.</p>"}',
    'vistaseed vizyonu, güvenli ve erişilebilir dijital kargo deneyimi sunmaktır.',
    'Hakkımızda | vistaseed',
    'vistaseed hakkında kurumsal bilgi ve marka yaklaşımı.'
  ),
  (
    '55555555-5555-4555-8555-555555555552',
    'tr',
    'Gizlilik Politikası',
    'gizlilik-politikasi',
    '{"html":"<p>Kişisel verileriniz, hizmet sunumu ve yasal yükümlülükler kapsamında işlenir.</p><p>Veri güvenliği için teknik ve idari tedbirler uygulanır.</p>"}',
    'vistaseed gizlilik ilkeleri ve veri işleme yaklaşımı.',
    'Gizlilik Politikası | vistaseed',
    'vistaseed gizlilik politikası ve veri koruma yaklaşımı.'
  ),
  (
    '55555555-5555-4555-8555-555555555553',
    'tr',
    'KVKK Aydınlatma Metni',
    'kvkk',
    '{"html":"<p>6698 sayılı KVKK kapsamında veri sorumlusu olarak vistaseed, kişisel verilerinizi açık rıza veya kanuni sebepler doğrultusunda işler.</p>"}',
    'KVKK kapsamında aydınlatma metni.',
    'KVKK | vistaseed',
    'vistaseed KVKK aydınlatma metni.'
  ),
  (
    '55555555-5555-4555-8555-555555555554',
    'tr',
    'Kullanım Koşulları',
    'kullanim-kosullari',
    '{"html":"<p>vistaseed platformunu kullanan tüm taraflar, ilan ve rezervasyon süreçlerinde dürüst ve güncel bilgi sağlamayı kabul eder.</p>"}',
    'vistaseed platform kullanım koşulları.',
    'Kullanım Koşulları | vistaseed',
    'vistaseed hizmet kullanım koşulları ve platform kuralları.'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'tr',
    'Taşıma Kuralları',
    'tasima-kurallari',
    '{"html":"<h2>Taşıma Kuralları</h2><p>vistaseed platformu üzerinden taşınacak kargolar için aşağıdaki kurallar geçerlidir:</p><ul><li>Tehlikeli maddeler, yanıcı ve patlayıcı içerikler kesinlikle yasaktır.</li><li>Yasadışı maddeler ve taşınması kanunen yasak olan ürünler kabul edilmez.</li><li>Canlı hayvan taşıması özel izne tabidir.</li><li>Kırılacak eşyaların paketlenmesi göndericinin sorumluluğundadır.</li></ul>"}',
    'vistaseed taşıma kuralları ve yasaklı maddeler listesi.',
    'Taşıma Kuralları | vistaseed',
    'vistaseed taşıma kuralları, yasaklı maddeler ve sorumluluklar.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `content` = VALUES(`content`),
  `summary` = VALUES(`summary`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);
