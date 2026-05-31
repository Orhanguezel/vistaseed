-- =============================================================
-- Expansion sayfalari (AR-GE Merkezi, Surdurulebilirlik) — EN + DE i18n
-- Neden: 117c yalniz 'tr' satirini ekliyordu. next.config redirect'leri
--   /en/r-and-d-center -> /en/arge-merkezi, /en/sustainability -> /en/surdurulebilirlik
--   (ve DE karsiliklari) bu sayfalara yonlendiriyor; en/de i18n satiri
--   olmadigi icin [slug] catch-all notFound() donuyordu => redirect->404.
-- Bu seed eksik en/de satirlarini ekler. Icerik plain HTML (167 normalize ile uyumlu).
-- Parent custom_pages satirlari 117c'de tanimli (cp-uuid-arge-001, cp-uuid-surdurul-001).
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `custom_pages_i18n`
  (`page_id`, `locale`, `title`, `slug`, `content`, `summary`, `meta_title`, `meta_description`)
VALUES
(
  'cp-uuid-arge-001', 'en', 'R&D Center', 'arge-merkezi',
  '<h2>Developing Tomorrow''s Seeds Today</h2><p>The {{SITE_NAME}} R&D Center develops high-yield seeds, fully adapted to regional climate conditions, using the most advanced breeding techniques.</p><h3>Our Breeding Work</h3><ul><li>Hybrid seed development</li><li>Disease resistance testing</li><li>Yield optimization</li></ul>',
  'We are building the future with innovative agricultural technologies and modern breeding programs.',
  'R&D Center | {{SITE_NAME}}',
  'Learn about the {{SITE_NAME}} R&D Center and our modern seed breeding technologies.'
),
(
  'cp-uuid-arge-001', 'de', 'F&E-Zentrum', 'arge-merkezi',
  '<h2>Die Samen von morgen schon heute entwickeln</h2><p>Das {{SITE_NAME}} F&E-Zentrum entwickelt mit modernsten Zuchtungstechniken ertragreiche Samen, die optimal an die regionalen Klimabedingungen angepasst sind.</p><h3>Unsere Zuchtungsarbeit</h3><ul><li>Entwicklung von Hybridsaatgut</li><li>Tests auf Krankheitsresistenz</li><li>Ertragsoptimierung</li></ul>',
  'Mit innovativen Agrartechnologien und modernen Zuchtprogrammen gestalten wir die Zukunft.',
  'F&E-Zentrum | {{SITE_NAME}}',
  'Erfahren Sie mehr uber das {{SITE_NAME}} F&E-Zentrum und unsere modernen Saatgut-Zuchtungstechnologien.'
),
(
  'cp-uuid-surdurul-001', 'en', 'Sustainability', 'surdurulebilirlik',
  '<h2>Sustainable Agriculture for Future Generations</h2><p>At {{SITE_NAME}}, we support a farming model in which resources are used efficiently and nature is protected.</p><h3>Our Vision</h3><p>Water conservation, soil health and reducing our carbon footprint are among our core priorities.</p>',
  'The steps we take toward a greener world and sustainable food security.',
  'Sustainability | {{SITE_NAME}}',
  'Discover the sustainable agriculture policies and environmental commitments of {{SITE_NAME}}.'
),
(
  'cp-uuid-surdurul-001', 'de', 'Nachhaltigkeit', 'surdurulebilirlik',
  '<h2>Nachhaltige Landwirtschaft fur kunftige Generationen</h2><p>Bei {{SITE_NAME}} unterstutzen wir ein Landwirtschaftsmodell, in dem Ressourcen effizient genutzt und die Natur geschutzt wird.</p><h3>Unsere Vision</h3><p>Wassereinsparung, Bodengesundheit und die Reduzierung unseres CO2-Fussabdrucks gehoren zu unseren wichtigsten Prioritaten.</p>',
  'Die Schritte, die wir fur eine grunere Welt und nachhaltige Ernahrungssicherheit unternehmen.',
  'Nachhaltigkeit | {{SITE_NAME}}',
  'Entdecken Sie die nachhaltigen Agrarpolitiken und Umweltverpflichtungen von {{SITE_NAME}}.'
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `content` = VALUES(`content`),
  `summary` = VALUES(`summary`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);
