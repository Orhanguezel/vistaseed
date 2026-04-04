-- =============================================================
-- Yeni Kurumsal Sayfalar Seed (AR-GE, Ekim Rehberi, Sürdürülebilirlik)
-- =============================================================

INSERT INTO `custom_pages` (`id`, `module_key`, `is_published`, `display_order`) VALUES
('cp-uuid-arge-001', 'kurumsal', 1, 10),
('cp-uuid-ekim-001', 'destek', 1, 11),
('cp-uuid-surdurul-001', 'kurumsal', 1, 12),
('cp-uuid-bayi-001', 'bayi', 1, 13);

INSERT INTO `custom_pages_i18n` (`page_id`, `locale`, `title`, `slug`, `content`, `summary`, `meta_title`, `meta_description`) VALUES
(
  'cp-uuid-arge-001', 'tr', 'AR-GE Merkezi', 'arge-merkezi', 
  '{"html": "<h2>Geleceğin Tohumlarını Bugünden Geliştiriyoruz</h2><p>Vista Seed AR-GE Merkezi, en modern ıslah tekniklerini kullanarak bölgesel iklim koşullarına tam uyumlu ve yüksek verimli tohumlar geliştirmektedir.</p><h3>Islah Çalışmalarımız</h3><ul><li>Hibrit tohum geliştirme</li><li>Hastalıklara dayanıklılık testleri</li><li>Verim optimizasyonu</li></ul>"}',
  'Yenilikçi tarım teknolojileri ve modern ıslah çalışmalarımızla geleceği inşa ediyoruz.',
  'AR-GE Merkezi | Vista Seed',
  'Vista Seed AR-GE Merkezi ve modern tohum ıslah teknolojileri hakkında bilgi edinin.'
),
(
  'cp-uuid-ekim-001', 'tr', 'Ekim Rehberi', 'ekim-rehberi', 
  '{"html": "<h2>Başarılı Hasat İçin Ekim Rehberi</h2><p>Doğru ekim teknikleri, tohumun potansiyelini maksimize etmek için kritiktir.</p><h3>Temel İpuçları</h3><ul><li>Toprak Hazırlığı: Ekimden önce toprağın tavında olduğuna emin olun.</li><li>Ekim Derinliği: Tohum büyüklüğüne göre ideal derinliği ayarlayın.</li><li>Can Suyu: İlk can suyunu vermeyi unutmayın.</li></ul>"}',
  'Tohumlarınızdan en yüksek verimi almanız için uzman ekim tavsiyeleri.',
  'Ekim Rehberi | Vista Seed',
  'Tohum ekimi, bakımı ve hasat süreçleriyle ilgili pratik bilgiler ve rehberler.'
),
(
  'cp-uuid-surdurul-001', 'tr', 'Sürdürülebilirlik', 'surdurulebilirlik', 
  '{"html": "<h2>Gelecek Nesiller İçin Sürdürülebilir Tarım</h2><p>Vista Seed olarak, kaynakların verimli kullanıldığı ve doğanın korunduğu bir tarım modelini destekliyoruz.</p><h3>Vizyonumuz</h3><p>Su tasarrufu, toprak sağlığı ve karbon ayak izinin azaltılması temel önceliklerimiz arasındadır.</p>"}',
  'Daha yeşil bir dünya ve sürdürülebilir gıda güvenliği için attığımız adımlar.',
  'Sürdürülebilirlik | Vista Seed',
  'Vista Seed''in sürdürülebilir tarım politikaları ve çevresel taahhütleri.'
),
(
  'cp-uuid-bayi-001', 'tr', 'Bayi Girişi', 'bayi-girisi', 
  '{"html": "<h2>Bayi Portalına Hoş Geldiniz</h2><p>Bayilerimiz için özelleştirilmiş sipariş ve stok takip sistemine buradan erişebilirsiniz.</p><div class=\"bg-brand/10 p-8 rounded-2xl text-center my-12 font-bold\">Bayi Giriş Paneli Yakında Hizmetinizde...</div>"}',
  'Bayilerimize özel sipariş ve stok yönetim portali.',
  'Bayi Girişi | Vista Seed',
  'Vista Seed bayilerine özel giriş ve işlem portali.'
);
