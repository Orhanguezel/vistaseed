-- P6: Mevcut kurulumlarda ekim rehberi kapaklari + AR-GE icerik zenginlestirme
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE `library`
SET `featured_image` = CASE `id`
  WHEN 'lib-ekim-001' THEN '/uploads/products/cankan-f1-kapya-01.jpeg'
  WHEN 'lib-ekim-002' THEN '/uploads/products/lucky-f1-charliston-01.jpeg'
  WHEN 'lib-ekim-003' THEN '/uploads/products/prestij-f1-tatli-kil-01.jpeg'
  WHEN 'lib-ekim-004' THEN '/uploads/products/cankan-f1-kapya-01.jpeg'
  ELSE `featured_image`
END
WHERE `id` IN ('lib-ekim-001', 'lib-ekim-002', 'lib-ekim-003', 'lib-ekim-004');

UPDATE `custom_pages_i18n`
SET
  `content` = '{"html":"<section class=\"space-y-6\"><h2>Geleceğin tohumlarını bugünden geliştiriyoruz</h2><p>Vista Seed Ar-Ge merkezi; ıslah, saha testleri ve laboratuvar analizlerini aynı operasyon çatısı altında yürütür. Bölgesel iklim ve toprak koşullarına uyum ile yüksek verim ve raf ömrü hedeflenir.</p><h3>Laboratuvar ve geliştirme</h3><ul><li>Çimlenme ve safiyet kontrolleri</li><li>Hastalık baskısı ve tolerans taramaları</li><li>Fenotip değerlendirme ve saha doğrulaması</li></ul><h3>Sürdürülebilir üretim</h3><p>Enerji verimli sera uygulamaları, su tasarrufu ve atık azaltımı üretim planlarımızın parçasıdır.</p></section>"}',
  `summary` = 'Islah, laboratuvar ve sürdürülebilir üretim odağında Vista Seed Ar-Ge yaklaşımı.',
  `meta_description` = 'Vista Seed Ar-Ge merkezi: ıslah, laboratuvar analizleri ve sürdürülebilir tarım uygulamaları.'
WHERE `page_id` = 'cp-uuid-arge-001' AND `locale` = 'tr';
