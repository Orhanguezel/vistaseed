SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `library`
  (`id`, `type`, `featured`, `is_published`, `is_active`, `display_order`, `featured_image`, `published_at`)
VALUES
  ('lib-ekim-001', 'guide', 1, 1, 1, 1, '/uploads/products/cankan-f1-kapya-01.jpeg', NOW(3)),
  ('lib-ekim-002', 'guide', 1, 1, 1, 2, '/uploads/products/lucky-f1-charliston-01.jpeg', NOW(3)),
  ('lib-ekim-003', 'guide', 0, 1, 1, 3, '/uploads/products/prestij-f1-tatli-kil-01.jpeg', NOW(3)),
  ('lib-ekim-004', 'guide', 0, 1, 1, 4, '/uploads/products/cankan-f1-kapya-01.jpeg', NOW(3))
ON DUPLICATE KEY UPDATE
  `type` = VALUES(`type`),
  `featured` = VALUES(`featured`),
  `is_published` = VALUES(`is_published`),
  `is_active` = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `published_at` = VALUES(`published_at`);

INSERT INTO `library_i18n`
  (`id`, `library_id`, `locale`, `slug`, `name`, `description`, `summary`, `meta_title`, `meta_description`)
VALUES
  (
    '12500000-0000-4000-8000-000000000011',
    'lib-ekim-001',
    'tr',
    'domates-fidesi-dikim-rehberi',
    'Domates Fidesi Dikim Rehberi',
    '<h2>Domates fidesinde güvenli başlangıç</h2><p>Sağlıklı gelişim için şaşırtma öncesi fide kök yapısı, sera sıcaklığı ve sulama planı birlikte değerlendirilmelidir.</p><h3>İlk hafta planı</h3><p>Dikimden sonra kontrollü can suyu verilir, hava sirkülasyonu korunur ve bitki stresi günlük olarak takip edilir.</p>',
    'Domates fidesinde dikim aralığı, ilk sulama, sera geçişi ve kök gelişimi için temel uygulama adımları.',
    'Domates Fidesi Dikim Rehberi | VistaSeed',
    'Domates fidesi için dikim öncesi hazırlık, sulama, sıra aralığı ve sera yönetimi notları.'
  ),
  (
    '12500000-0000-4000-8000-000000000012',
    'lib-ekim-001',
    'en',
    'tomato-seedling-transplant-guide',
    'Tomato Seedling Transplant Guide',
    '<h2>A controlled start for tomato seedlings</h2><p>Root health, greenhouse temperature, and irrigation planning should be reviewed together before transplanting.</p><h3>First-week routine</h3><p>Apply a balanced starter irrigation, maintain airflow, and monitor transplant stress every day.</p>',
    'Core guidance for transplant spacing, first irrigation, greenhouse transition, and root establishment in tomato seedlings.',
    'Tomato Seedling Transplant Guide | VistaSeed',
    'Practical notes for transplant preparation, irrigation, spacing, and greenhouse transition for tomato seedlings.'
  ),
  (
    '12500000-0000-4000-8000-000000000021',
    'lib-ekim-002',
    'tr',
    'biber-fidesi-sera-gecis-rehberi',
    'Biber Fidesi Sera Geçiş Rehberi',
    '<h2>Biberde dengeli büyüme için geçiş planı</h2><p>Fide kalitesi kadar sera içi nem, sıcaklık ve ışık yönetimi de ilk bağlama dönemini doğrudan etkiler.</p><h3>Dikim sonrası takip</h3><p>Gövde gelişimi zayıflamadan kök tutumunu desteklemek için ölçülü sulama ve kademeli besleme uygulanır.</p>',
    'Biber fidesinde sera geçişi, ilk sulama, besleme başlangıcı ve stres yönetimi için operasyon notları.',
    'Biber Fidesi Sera Geçiş Rehberi | VistaSeed',
    'Biber fidesinde sera koşullarına geçiş, ilk sulama planı ve dengeli gelişim için temel uygulamalar.'
  ),
  (
    '12500000-0000-4000-8000-000000000022',
    'lib-ekim-002',
    'en',
    'pepper-seedling-greenhouse-transition-guide',
    'Pepper Seedling Greenhouse Transition Guide',
    '<h2>A steady transition for pepper seedlings</h2><p>Early fruit set performance depends on humidity, temperature, and light balance as much as seedling quality.</p><h3>Post-transplant monitoring</h3><p>Use measured irrigation and staged nutrition to support root establishment without weakening stem growth.</p>',
    'Operational notes for greenhouse transition, first irrigation, starter feeding, and stress control in pepper seedlings.',
    'Pepper Seedling Greenhouse Transition Guide | VistaSeed',
    'Key greenhouse transition practices for pepper seedlings, including irrigation, nutrition, and stress management.'
  ),
  (
    '12500000-0000-4000-8000-000000000031',
    'lib-ekim-003',
    'tr',
    'salatalik-fidesi-ilk-gelisim-rehberi',
    'Salatalık Fidesi İlk Gelişim Rehberi',
    '<h2>Hızlı gelişen çeşitlerde ritim kaybetmeyin</h2><p>Salatalık fidesinde ilk dönem yönetimi, bitkinin vejetatif dengesini korumak için kritik önemdedir.</p><h3>İklim ve sulama dengesi</h3><p>Gece-gündüz sıcaklık farkı kontrollü tutulur, kök bölgesinde ani su yüklemesinden kaçınılır.</p>',
    'Salatalık fidesi için ilk gelişim döneminde iklim, sulama ve bitki dengesi odaklı uygulama özeti.',
    'Salatalık Fidesi İlk Gelişim Rehberi | VistaSeed',
    'Salatalık fidesinde ilk gelişim, sera iklimi, sulama dengesi ve bitki ritmi için pratik rehber.'
  ),
  (
    '12500000-0000-4000-8000-000000000032',
    'lib-ekim-003',
    'en',
    'cucumber-seedling-early-growth-guide',
    'Cucumber Seedling Early Growth Guide',
    '<h2>Protect growth rhythm in fast-developing varieties</h2><p>Early-stage management is critical to maintain vegetative balance in cucumber seedlings.</p><h3>Climate and irrigation balance</h3><p>Control day-night temperature differences and avoid sudden water loading around the root zone.</p>',
    'A practical overview of climate, irrigation, and growth balance during the early development stage of cucumber seedlings.',
    'Cucumber Seedling Early Growth Guide | VistaSeed',
    'Practical guidance for early growth, greenhouse climate, and irrigation balance in cucumber seedlings.'
  ),
  (
    '12500000-0000-4000-8000-000000000041',
    'lib-ekim-004',
    'tr',
    'karpuz-asilı-fide-sasirtma-rehberi',
    'Karpuz Aşılı Fide Şaşırtma Rehberi',
    '<h2>Aşılı karpuz fidesinde kök ve gövde uyumu</h2><p>Anaç ve kalem dengesinin korunması için şaşırtma sonrası ilk günlerde su ve sıcaklık yükü dikkatle yönetilmelidir.</p><h3>Risk noktaları</h3><p>Aşı noktasının hava akışı alması, aşırı nemden korunması ve dikim derinliğinin sabit tutulması gerekir.</p>',
    'Aşılı karpuz fidesinde şaşırtma, kök uyumu ve erken dönem stres yönetimi için teknik notlar.',
    'Karpuz Aşılı Fide Şaşırtma Rehberi | VistaSeed',
    'Aşılı karpuz fidesinde şaşırtma sonrası kök uyumu, sulama ve aşı noktası koruması için rehber.'
  ),
  (
    '12500000-0000-4000-8000-000000000042',
    'lib-ekim-004',
    'en',
    'grafted-watermelon-seedling-transplant-guide',
    'Grafted Watermelon Seedling Transplant Guide',
    '<h2>Protect root and stem balance in grafted watermelon seedlings</h2><p>Water load and temperature stress should be managed carefully during the first days after transplanting to protect rootstock-scion balance.</p><h3>Key risk points</h3><p>Keep the graft union ventilated, protect it from excess humidity, and maintain a stable planting depth.</p>',
    'Technical notes for transplanting grafted watermelon seedlings, with focus on root balance and early-stage stress control.',
    'Grafted Watermelon Seedling Transplant Guide | VistaSeed',
    'Guidance for post-transplant root balance, irrigation, and graft union protection in grafted watermelon seedlings.'
  )
ON DUPLICATE KEY UPDATE
  `slug` = VALUES(`slug`),
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `summary` = VALUES(`summary`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

INSERT INTO `library_files`
  (`id`, `library_id`, `file_url`, `name`, `display_order`, `is_active`)
VALUES
  ('12500000-0000-4000-8001-000000000001', 'lib-ekim-001', '/uploads/files/domates-fidesi-dikim-rehberi.pdf', 'domates-fidesi-dikim-rehberi.pdf', 1, 1),
  ('12500000-0000-4000-8001-000000000002', 'lib-ekim-002', '/uploads/files/biber-fidesi-sera-gecis-rehberi.pdf', 'biber-fidesi-sera-gecis-rehberi.pdf', 1, 1),
  ('12500000-0000-4000-8001-000000000003', 'lib-ekim-003', '/uploads/files/salatalik-fidesi-ilk-gelisim-rehberi.pdf', 'salatalik-fidesi-ilk-gelisim-rehberi.pdf', 1, 1),
  ('12500000-0000-4000-8001-000000000004', 'lib-ekim-004', '/uploads/files/karpuz-asili-fide-sasirtma-rehberi.pdf', 'karpuz-asili-fide-sasirtma-rehberi.pdf', 1, 1)
ON DUPLICATE KEY UPDATE
  `file_url` = VALUES(`file_url`),
  `name` = VALUES(`name`),
  `display_order` = VALUES(`display_order`),
  `is_active` = VALUES(`is_active`);
