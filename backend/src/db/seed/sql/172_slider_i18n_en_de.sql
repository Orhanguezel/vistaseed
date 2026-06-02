-- Vista Seeds — slider_i18n EN/DE çevirileri (hero slider)
-- as-needed i18n geçişi: /en ve /de hero slaytları TR'ye düşüyordu.
SET NAMES utf8mb4;

INSERT INTO `slider_i18n` (`slider_id`, `locale`, `name`, `slug`, `description`, `alt`, `button_text`, `button_link`) VALUES
(1, 'en', 'The Bounty of the Seed Begins with the Soil', 'tohumun-bereketi', 'Vista Seeds delivers sustainable success in agriculture with high-yield, reliable seed varieties.', 'Green field landscape', 'Explore Products', '/urunler'),
(1, 'de', 'Der Reichtum des Saatguts beginnt mit dem Boden', 'tohumun-bereketi', 'Vista Seeds bietet mit ertragreichen und zuverlässigen Saatgutsorten nachhaltigen Erfolg in der Landwirtschaft.', 'Grüne Feldlandschaft', 'Produkte entdecken', '/urunler'),
(2, 'en', 'Seeds of the Future with R&D', 'arge-gelecek', 'We add value to Turkish agriculture with our own selections and hybrid varieties. We produce with science and grow with the farmer.', 'Corn field', 'About Us', '/hakkimizda'),
(2, 'de', 'Saatgut der Zukunft durch F&E', 'arge-gelecek', 'Wir schaffen Mehrwert für die türkische Landwirtschaft mit unseren eigenen Selektionen und Hybridsorten. Wir produzieren mit Wissenschaft und wachsen mit dem Landwirt.', 'Maisfeld', 'Über uns', '/hakkimizda'),
(3, 'en', 'Certified and Reliable', 'sertifikali-guvenilir', 'TÜAB-approved, lab-tested seeds. We offer a quality guarantee with a germination rate above 95%.', 'Seed and vegetable varieties', 'FAQ', '/sss'),
(3, 'de', 'Zertifiziert und Zuverlässig', 'sertifikali-guvenilir', 'TÜAB-zugelassene, laborgeprüfte Saatgüter. Wir bieten eine Qualitätsgarantie mit einer Keimrate über 95%.', 'Saatgut- und Gemüsesorten', 'FAQ', '/sss'),
(4, 'en', 'Sustainable Agriculture Vision', 'surdurulebilir-tarim', 'Environmentally friendly production practices and the protection of natural resources are our priority. We carry responsibility for future generations.', 'Agricultural field', 'Contact', '/iletisim'),
(4, 'de', 'Vision für nachhaltige Landwirtschaft', 'surdurulebilir-tarim', 'Umweltfreundliche Produktionspraktiken und der Schutz natürlicher Ressourcen sind unsere Priorität. Wir tragen Verantwortung für künftige Generationen.', 'Landwirtschaftliche Fläche', 'Kontakt', '/iletisim'),
(5, 'en', 'Leader in Modern Greenhouse Production', 'modern-sera-uretimi', 'High yield and quality guarantee with our greenhouse seeds specially developed for controlled-environment agriculture.', 'Modern greenhouse facility', 'Greenhouse Varieties', '/urunler?cultivation=greenhouse'),
(5, 'de', 'Marktführer in der modernen Gewächshausproduktion', 'modern-sera-uretimi', 'Hoher Ertrag und Qualitätsgarantie mit unserem speziell für den geschützten Anbau entwickelten Gewächshaussaatgut.', 'Moderne Gewächshausanlage', 'Gewächshaussorten', '/urunler?cultivation=greenhouse'),
(6, 'en', 'Integrated Solution from Seedling to Harvest', 'fide-hasat-cozum', 'With certified seedling production and expert support, we are by your side from seed to harvest.', 'Seedling production area', 'Seedlings', '/urunler?type=fide'),
(6, 'de', 'Integrierte Lösung von der Anzucht bis zur Ernte', 'fide-hasat-cozum', 'Mit zertifizierter Setzlingsproduktion und fachkundiger Unterstützung stehen wir Ihnen vom Samen bis zur Ernte zur Seite.', 'Setzlingsproduktionsbereich', 'Setzlinge', '/urunler?type=fide'),
(7, 'en', 'Hybrid Seed Variety', 'hibrit-tohum', 'Tomatoes, peppers, cucumbers and more — hundreds of hybrid varieties, special formulas for every climate and soil type.', 'Various seeds', 'All Seeds', '/urunler'),
(7, 'de', 'Hybridsaatgut-Vielfalt', 'hibrit-tohum', 'Tomaten, Paprika, Gurken und mehr — Hunderte von Hybridsorten, spezielle Formeln für jedes Klima und jeden Bodentyp.', 'Verschiedene Saatgüter', 'Alle Saatgüter', '/urunler'),
(8, 'en', 'Adapted to Anatolian Soils', 'anadolu-uyumlu', 'Hybrid and selection varieties adapted to the climate and soil diversity of Türkiye''s geography.', 'Anatolian agricultural landscape', 'Contact', '/iletisim'),
(8, 'de', 'An anatolische Böden angepasst', 'anadolu-uyumlu', 'Hybrid- und Selektionssorten, die an die Klima- und Bodenvielfalt der türkischen Geografie angepasst sind.', 'Anatolische Agrarlandschaft', 'Kontakt', '/iletisim')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `alt` = VALUES(`alt`),
  `button_text` = VALUES(`button_text`),
  `button_link` = VALUES(`button_link`);
