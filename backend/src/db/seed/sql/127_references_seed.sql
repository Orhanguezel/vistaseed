SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `storage_assets`
  (`id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `url`,
   `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`)
VALUES
  ('00009400-ref0-4000-8000-000000000001', 'ref-uretim-kampusu.jpg',      'default', 'references/ref-uretim-kampusu.jpg',      'references', 'image/jpeg', 89118, '/uploads/references/ref-uretim-kampusu.jpg',      'local', 'references/ref-uretim-kampusu.jpg',      'image', 'jpg'),
  ('00009400-ref0-4000-8000-000000000002', 'ref-aksu-operasyon.jpg',      'default', 'references/ref-aksu-operasyon.jpg',      'references', 'image/jpeg', 76003, '/uploads/references/ref-aksu-operasyon.jpg',      'local', 'references/ref-aksu-operasyon.jpg',      'image', 'jpg'),
  ('00009400-ref0-4000-8000-000000000003', 'ref-asili-fide-programi.jpg', 'default', 'references/ref-asili-fide-programi.jpg', 'references', 'image/jpeg', 98686, '/uploads/references/ref-asili-fide-programi.jpg', 'local', 'references/ref-asili-fide-programi.jpg', 'image', 'jpg'),
  ('00009400-ref0-4000-8000-000000000004', 'ref-bayi-agi.jpg',            'default', 'references/ref-bayi-agi.jpg',            'references', 'image/jpeg', 89118, '/uploads/references/ref-bayi-agi.jpg',            'local', 'references/ref-bayi-agi.jpg',            'image', 'jpg'),
  ('00009400-ref0-4000-8000-000000000005', 'ref-toplu-satis.jpg',         'default', 'references/ref-toplu-satis.jpg',         'references', 'image/jpeg', 76003, '/uploads/references/ref-toplu-satis.jpg',         'local', 'references/ref-toplu-satis.jpg',         'image', 'jpg'),
  ('00009400-ref0-4000-8000-000000000006', 'ref-bilgi-bankasi.jpg',       'default', 'references/ref-bilgi-bankasi.jpg',       'references', 'image/jpeg', 98686, '/uploads/references/ref-bilgi-bankasi.jpg',       'local', 'references/ref-bilgi-bankasi.jpg',       'image', 'jpg')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `path` = VALUES(`path`),
  `folder` = VALUES(`folder`),
  `url` = VALUES(`url`),
  `size` = VALUES(`size`);

INSERT INTO `storage_assets`
  (`id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `url`,
   `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`)
VALUES
  ('00009400-refg-4000-8000-000000000001', 'uretim-kampusu-01.jpg',   'default', 'references/gallery/uretim-kampusu-01.jpg',   'references/gallery', 'image/jpeg', 89118, '/uploads/references/gallery/uretim-kampusu-01.jpg',   'local', 'references/gallery/uretim-kampusu-01.jpg',   'image', 'jpg'),
  ('00009400-refg-4000-8000-000000000002', 'uretim-kampusu-02.jpg',   'default', 'references/gallery/uretim-kampusu-02.jpg',   'references/gallery', 'image/jpeg', 76003, '/uploads/references/gallery/uretim-kampusu-02.jpg',   'local', 'references/gallery/uretim-kampusu-02.jpg',   'image', 'jpg'),
  ('00009400-refg-4000-8000-000000000003', 'aksu-operasyon-01.jpg',   'default', 'references/gallery/aksu-operasyon-01.jpg',   'references/gallery', 'image/jpeg', 76003, '/uploads/references/gallery/aksu-operasyon-01.jpg',   'local', 'references/gallery/aksu-operasyon-01.jpg',   'image', 'jpg'),
  ('00009400-refg-4000-8000-000000000004', 'asili-fide-01.jpg',       'default', 'references/gallery/asili-fide-01.jpg',       'references/gallery', 'image/jpeg', 98686, '/uploads/references/gallery/asili-fide-01.jpg',       'local', 'references/gallery/asili-fide-01.jpg',       'image', 'jpg'),
  ('00009400-refg-4000-8000-000000000005', 'bayi-agi-01.jpg',         'default', 'references/gallery/bayi-agi-01.jpg',         'references/gallery', 'image/jpeg', 89118, '/uploads/references/gallery/bayi-agi-01.jpg',         'local', 'references/gallery/bayi-agi-01.jpg',         'image', 'jpg'),
  ('00009400-refg-4000-8000-000000000006', 'toplu-satis-01.jpg',      'default', 'references/gallery/toplu-satis-01.jpg',      'references/gallery', 'image/jpeg', 76003, '/uploads/references/gallery/toplu-satis-01.jpg',      'local', 'references/gallery/toplu-satis-01.jpg',      'image', 'jpg'),
  ('00009400-refg-4000-8000-000000000007', 'toplu-satis-02.jpg',      'default', 'references/gallery/toplu-satis-02.jpg',      'references/gallery', 'image/jpeg', 98686, '/uploads/references/gallery/toplu-satis-02.jpg',      'local', 'references/gallery/toplu-satis-02.jpg',      'image', 'jpg'),
  ('00009400-refg-4000-8000-000000000008', 'bilgi-bankasi-01.jpg',    'default', 'references/gallery/bilgi-bankasi-01.jpg',    'references/gallery', 'image/jpeg', 89118, '/uploads/references/gallery/bilgi-bankasi-01.jpg',    'local', 'references/gallery/bilgi-bankasi-01.jpg',    'image', 'jpg')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `path` = VALUES(`path`),
  `folder` = VALUES(`folder`),
  `url` = VALUES(`url`),
  `size` = VALUES(`size`);

INSERT INTO `references`
  (`id`, `is_published`, `is_featured`, `display_order`, `featured_image`, `featured_image_asset_id`, `website_url`)
VALUES
  ('ref-0000-0000-0000-0000-000000000001', 1, 1, 1, '/uploads/references/ref-uretim-kampusu.jpg',      '00009400-ref0-4000-8000-000000000001', 'https://www.bereketfide.com.tr/tr'),
  ('ref-0000-0000-0000-0000-000000000002', 1, 1, 2, '/uploads/references/ref-aksu-operasyon.jpg',      '00009400-ref0-4000-8000-000000000002', 'https://www.bereketfide.com.tr/tr/iletisim'),
  ('ref-0000-0000-0000-0000-000000000003', 1, 0, 3, '/uploads/references/ref-asili-fide-programi.jpg', '00009400-ref0-4000-8000-000000000003', NULL),
  ('ref-0000-0000-0000-0000-000000000004', 1, 0, 4, '/uploads/references/ref-bayi-agi.jpg',            '00009400-ref0-4000-8000-000000000004', NULL),
  ('ref-0000-0000-0000-0000-000000000005', 1, 1, 5, '/uploads/references/ref-toplu-satis.jpg',         '00009400-ref0-4000-8000-000000000005', NULL),
  ('ref-0000-0000-0000-0000-000000000006', 1, 0, 6, '/uploads/references/ref-bilgi-bankasi.jpg',       '00009400-ref0-4000-8000-000000000006', NULL)
ON DUPLICATE KEY UPDATE
  `is_published` = VALUES(`is_published`),
  `is_featured` = VALUES(`is_featured`),
  `display_order` = VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `featured_image_asset_id` = VALUES(`featured_image_asset_id`),
  `website_url` = VALUES(`website_url`);

INSERT INTO `references_i18n`
  (`id`, `reference_id`, `locale`, `title`, `slug`, `summary`, `content`, `featured_image_alt`, `meta_title`, `meta_description`)
VALUES
  (
    'refi18n-tr-0000-0000-000000000001',
    'ref-0000-0000-0000-0000-000000000001',
    'tr',
    'Bereket Fide Üretim Kampüsü',
    'bereket-fide-uretim-kampusu',
    'VistaSeed anlatısının beslendiği üretim omurgasını, modern sera ve aşı odası kapasitesi üzerinden özetleyen vaka kaydı.',
    '<p>Bu kayıt, Bereket Fide''nin Antalya Aksu merkezli üretim omurgasını VistaSeed ekosistemi içinde nasıl konumlandırdığımızı gösterir. Modern sera altyapısı, aşı odası kapasitesi ve operasyonel ölçek; ürün, bayi ve teklif yüzeylerindeki güven sinyallerinin ana kaynağıdır.</p><p>Kurumsal içerikte kullanılan kapasite bilgileri, resmi kurumsal verilerle uyumlu olacak şekilde burada referans vaka olarak tutulur.</p>',
    'Bereket Fide üretim kampüsü görseli',
    'Bereket Fide Üretim Kampüsü | VistaSeed',
    'Bereket Fide üretim omurgasının VistaSeed ürün ve içerik akışına nasıl bağlandığını özetleyen vaka kaydı.'
  ),
  (
    'refi18n-en-0000-0000-000000000001',
    'ref-0000-0000-0000-0000-000000000001',
    'en',
    'Bereket Fide Production Campus',
    'bereket-fide-production-campus',
    'A case entry showing the production backbone behind the VistaSeed narrative through greenhouse and grafting-room capacity.',
    '<p>This record explains how Bereket Fide''s Antalya Aksu production backbone is positioned within the VistaSeed ecosystem. Greenhouse infrastructure, grafting-room capacity, and operational scale are the main trust signals behind product, dealer, and quotation surfaces.</p><p>Capacity figures used in the corporate narrative are kept here as a reference case aligned with official company information.</p>',
    'Bereket Fide production campus visual',
    'Bereket Fide Production Campus | VistaSeed',
    'A case entry summarizing how Bereket Fide production operations support VistaSeed content and product surfaces.'
  ),
  (
    'refi18n-tr-0000-0000-000000000002',
    'ref-0000-0000-0000-0000-000000000002',
    'tr',
    'Antalya Aksu Operasyon Merkezi',
    'antalya-aksu-operasyon-merkezi',
    'İletişim, ziyaret ve saha erişim bilgisini tek merkezde toplayan operasyon kaydı.',
    '<p>Antalya Aksu operasyon merkezi; ziyaret planlaması, saha erişimi, bayi yönlendirmesi ve kurumsal iletişim akışının birleştiği ana düğümdür.</p><p>İletişim sayfası, bayi ağı ve toplu satış modülleri bu merkez anlatımı etrafında birbirini tamamlar.</p>',
    'Antalya Aksu operasyon merkezi görseli',
    'Antalya Aksu Operasyon Merkezi | VistaSeed',
    'İletişim, bayi yönlendirmesi ve saha erişim akışını tek merkezde toplayan operasyon kaydı.'
  ),
  (
    'refi18n-en-0000-0000-000000000002',
    'ref-0000-0000-0000-0000-000000000002',
    'en',
    'Antalya Aksu Operations Center',
    'antalya-aksu-operations-center',
    'An operational entry that centralizes contact, visit planning, and field access information.',
    '<p>The Antalya Aksu operations center is the main node where visit planning, field access, dealer routing, and corporate communication flows come together.</p><p>Contact, dealer network, and bulk-sales modules reinforce each other around this operational narrative.</p>',
    'Antalya Aksu operations center visual',
    'Antalya Aksu Operations Center | VistaSeed',
    'An operational case that connects contact, dealer routing, and field-access messaging in one center.'
  ),
  (
    'refi18n-tr-0000-0000-000000000003',
    'ref-0000-0000-0000-0000-000000000003',
    'tr',
    'Aşılı Fide Kapasite Programı',
    'asili-fide-kapasite-programi',
    'Aşılı fide üretim bilgisinin ürün güveni ve teknik anlatı tarafına nasıl aktarıldığını özetler.',
    '<p>Aşılı fide kapasite programı; yüksek hacimli üretim bilgisinin teknik içerik, ürün karşılaştırma ve saha dili ile nasıl eşleştiğini gösteren iç vaka kaydıdır.</p><p>Bu yüzeyde amaç, kapasite verisini abartılı pazarlama dili yerine operasyonel netlik ile sunmaktır.</p>',
    'Aşılı fide kapasite programı görseli',
    'Aşılı Fide Kapasite Programı | VistaSeed',
    'Aşılı fide kapasitesinin ürün güveni ve teknik içerik anlatısına nasıl taşındığını anlatan vaka kaydı.'
  ),
  (
    'refi18n-en-0000-0000-000000000003',
    'ref-0000-0000-0000-0000-000000000003',
    'en',
    'Grafted Seedling Capacity Program',
    'grafted-seedling-capacity-program',
    'Explains how grafted-seedling capacity data is translated into product trust and technical messaging.',
    '<p>This internal case shows how high-volume grafted-seedling production data connects with technical content, product comparison, and field-facing language.</p><p>The goal is to present capacity information with operational clarity rather than exaggerated marketing claims.</p>',
    'Grafted seedling capacity program visual',
    'Grafted Seedling Capacity Program | VistaSeed',
    'An internal case showing how grafted-seedling capacity supports product trust and technical content.'
  ),
  (
    'refi18n-tr-0000-0000-000000000004',
    'ref-0000-0000-0000-0000-000000000004',
    'tr',
    'Bayi Ağı ve Bölgesel Dağıtım Modeli',
    'bayi-agi-ve-bolgesel-dagitim-modeli',
    'Bölgesel erişim mantığını, harita ve liste yapısı ile açıklayan dağıtım odaklı referans kaydı.',
    '<p>Bayi ağı modeli; saha erişimi, bölgesel kapsama ve yönlendirme mantığını sade bir arayüz ile görünür kılmak için tasarlanmıştır.</p><p>Bu kayıt, satış öncesi temas noktalarının dijital tarafta nasıl organize edildiğini belgeleyen referans örneğidir.</p>',
    'Bayi ağı görseli',
    'Bayi Ağı ve Bölgesel Dağıtım Modeli | VistaSeed',
    'Bölgesel kapsama ve saha yönlendirmesini dijital olarak görünür kılan bayi ağı referans kaydı.'
  ),
  (
    'refi18n-en-0000-0000-000000000004',
    'ref-0000-0000-0000-0000-000000000004',
    'en',
    'Dealer Network and Regional Distribution Model',
    'dealer-network-and-regional-distribution-model',
    'A distribution-focused reference entry describing regional access through map and list surfaces.',
    '<p>The dealer-network model is designed to make field access, regional coverage, and routing logic visible through a simple interface.</p><p>This record documents how pre-sales contact points are organized on the digital side.</p>',
    'Dealer network visual',
    'Dealer Network and Regional Distribution Model | VistaSeed',
    'A reference entry that makes regional coverage and field routing visible in digital form.'
  ),
  (
    'refi18n-tr-0000-0000-000000000005',
    'ref-0000-0000-0000-0000-000000000005',
    'tr',
    'Toplu Satış ve Kurumsal Tedarik Akışı',
    'toplu-satis-ve-kurumsal-tedarik-akisi',
    'Kooperatif, bayi ve kurumsal alımlar için teklif sürecini standartlaştıran akış kaydı.',
    '<p>Toplu satış yüzeyi; teklif toplama, ürün bağlama ve operasyon notlarını tek kayıt yapısında birleştirir.</p><p>Bu referans, kurumsal tedarik talebinin ürün ekranlarından teklif yönetimine nasıl aktarıldığını gösterir.</p>',
    'Toplu satış akışı görseli',
    'Toplu Satış ve Kurumsal Tedarik Akışı | VistaSeed',
    'Toplu satış ve kurumsal teklif sürecini ürün yüzeyi ile birleştiren operasyon kaydı.'
  ),
  (
    'refi18n-en-0000-0000-000000000005',
    'ref-0000-0000-0000-0000-000000000005',
    'en',
    'Bulk Sales and Corporate Supply Flow',
    'bulk-sales-and-corporate-supply-flow',
    'A reference entry that standardizes quotation flow for cooperatives, dealers, and corporate purchases.',
    '<p>The bulk-sales surface combines quotation intake, product linking, and operational notes in one record structure.</p><p>This reference shows how corporate demand moves from product surfaces into quotation management.</p>',
    'Bulk sales flow visual',
    'Bulk Sales and Corporate Supply Flow | VistaSeed',
    'An operational record connecting bulk-sales demand with product and quotation management.'
  ),
  (
    'refi18n-tr-0000-0000-000000000006',
    'ref-0000-0000-0000-0000-000000000006',
    'tr',
    'Teknik İçerik ve Bilgi Bankası Yayınları',
    'teknik-icerik-ve-bilgi-bankasi-yayinlari',
    'Bilgi bankası ile ekim rehberi içeriklerinin karar destek yüzeyi olarak nasıl kullanıldığını anlatır.',
    '<p>Bilgi bankası ve ekim rehberi yayınları; ürün kararını desteklemek, teknik dil birliğini korumak ve saha bilgisini dijital içerik haline getirmek için kullanılır.</p><p>Bu kayıt, blog ve teknik rehber akışlarının ürün detaylarıyla birlikte nasıl çalıştığını özetler.</p>',
    'Bilgi bankası içerik görseli',
    'Teknik İçerik ve Bilgi Bankası Yayınları | VistaSeed',
    'Bilgi bankası ve teknik rehber içeriklerinin ürün kararını nasıl desteklediğini özetleyen vaka kaydı.'
  ),
  (
    'refi18n-en-0000-0000-000000000006',
    'ref-0000-0000-0000-0000-000000000006',
    'en',
    'Technical Content and Knowledge-Base Publications',
    'technical-content-and-knowledge-base-publications',
    'Explains how knowledge-base and planting-guide content is used as a decision-support surface.',
    '<p>Knowledge-base and planting-guide publications are used to support product decisions, preserve technical language consistency, and convert field knowledge into digital content.</p><p>This record summarizes how blog and guide flows work together with product detail surfaces.</p>',
    'Knowledge-base content visual',
    'Technical Content and Knowledge-Base Publications | VistaSeed',
    'A case entry summarizing how knowledge-base and guide content supports product decisions.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `summary` = VALUES(`summary`),
  `content` = VALUES(`content`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

INSERT INTO `reference_images`
  (`id`, `reference_id`, `image_url`, `storage_asset_id`, `is_featured`, `display_order`, `is_published`)
VALUES
  ('refimg-0000-0000-0000-000000000001', 'ref-0000-0000-0000-0000-000000000001', '/uploads/references/gallery/uretim-kampusu-01.jpg', '00009400-refg-4000-8000-000000000001', 1, 0, 1),
  ('refimg-0000-0000-0000-000000000002', 'ref-0000-0000-0000-0000-000000000001', '/uploads/references/gallery/uretim-kampusu-02.jpg', '00009400-refg-4000-8000-000000000002', 0, 1, 1),
  ('refimg-0000-0000-0000-000000000003', 'ref-0000-0000-0000-0000-000000000002', '/uploads/references/gallery/aksu-operasyon-01.jpg', '00009400-refg-4000-8000-000000000003', 1, 0, 1),
  ('refimg-0000-0000-0000-000000000004', 'ref-0000-0000-0000-0000-000000000003', '/uploads/references/gallery/asili-fide-01.jpg', '00009400-refg-4000-8000-000000000004', 1, 0, 1),
  ('refimg-0000-0000-0000-000000000005', 'ref-0000-0000-0000-0000-000000000004', '/uploads/references/gallery/bayi-agi-01.jpg', '00009400-refg-4000-8000-000000000005', 1, 0, 1),
  ('refimg-0000-0000-0000-000000000006', 'ref-0000-0000-0000-0000-000000000005', '/uploads/references/gallery/toplu-satis-01.jpg', '00009400-refg-4000-8000-000000000006', 1, 0, 1),
  ('refimg-0000-0000-0000-000000000007', 'ref-0000-0000-0000-0000-000000000005', '/uploads/references/gallery/toplu-satis-02.jpg', '00009400-refg-4000-8000-000000000007', 0, 1, 1),
  ('refimg-0000-0000-0000-000000000008', 'ref-0000-0000-0000-0000-000000000006', '/uploads/references/gallery/bilgi-bankasi-01.jpg', '00009400-refg-4000-8000-000000000008', 1, 0, 1)
ON DUPLICATE KEY UPDATE
  `image_url` = VALUES(`image_url`),
  `storage_asset_id` = VALUES(`storage_asset_id`),
  `is_featured` = VALUES(`is_featured`),
  `display_order` = VALUES(`display_order`),
  `is_published` = VALUES(`is_published`);

INSERT INTO `reference_images_i18n`
  (`id`, `image_id`, `locale`, `title`, `alt`)
VALUES
  ('refimgi18n-tr-0000-000000000001', 'refimg-0000-0000-0000-000000000001', 'tr', 'Üretim kampüsü görünümü', 'Bereket Fide üretim kampüsü genel görünüm'),
  ('refimgi18n-en-0000-000000000001', 'refimg-0000-0000-0000-000000000001', 'en', 'Production campus overview', 'General view of the Bereket Fide production campus'),
  ('refimgi18n-tr-0000-000000000002', 'refimg-0000-0000-0000-000000000002', 'tr', 'Sera altyapısı detayı', 'Modern sera altyapısı detay görseli'),
  ('refimgi18n-en-0000-000000000002', 'refimg-0000-0000-0000-000000000002', 'en', 'Greenhouse infrastructure detail', 'Detail image of modern greenhouse infrastructure'),
  ('refimgi18n-tr-0000-000000000003', 'refimg-0000-0000-0000-000000000003', 'tr', 'Aksu operasyon sahası', 'Antalya Aksu operasyon merkezi sahası'),
  ('refimgi18n-en-0000-000000000003', 'refimg-0000-0000-0000-000000000003', 'en', 'Aksu operations site', 'Antalya Aksu operations center site'),
  ('refimgi18n-tr-0000-000000000004', 'refimg-0000-0000-0000-000000000004', 'tr', 'Aşılı fide hattı', 'Aşılı fide üretim hattı görseli'),
  ('refimgi18n-en-0000-000000000004', 'refimg-0000-0000-0000-000000000004', 'en', 'Grafted seedling line', 'Visual of the grafted seedling production line'),
  ('refimgi18n-tr-0000-000000000005', 'refimg-0000-0000-0000-000000000005', 'tr', 'Bayi ağı saha noktası', 'Bölgesel bayi ağı saha erişim görseli'),
  ('refimgi18n-en-0000-000000000005', 'refimg-0000-0000-0000-000000000005', 'en', 'Dealer network field point', 'Regional dealer-network field access image'),
  ('refimgi18n-tr-0000-000000000006', 'refimg-0000-0000-0000-000000000006', 'tr', 'Toplu satış planlama ekranı', 'Toplu satış operasyon planlama görseli'),
  ('refimgi18n-en-0000-000000000006', 'refimg-0000-0000-0000-000000000006', 'en', 'Bulk-sales planning screen', 'Bulk-sales operations planning visual'),
  ('refimgi18n-tr-0000-000000000007', 'refimg-0000-0000-0000-000000000007', 'tr', 'Kurumsal teklif akışı', 'Kurumsal tedarik ve teklif akışı görseli'),
  ('refimgi18n-en-0000-000000000007', 'refimg-0000-0000-0000-000000000007', 'en', 'Corporate quotation flow', 'Corporate supply and quotation-flow visual'),
  ('refimgi18n-tr-0000-000000000008', 'refimg-0000-0000-0000-000000000008', 'tr', 'Bilgi bankası yayını', 'Teknik içerik ve bilgi bankası yayın görseli'),
  ('refimgi18n-en-0000-000000000008', 'refimg-0000-0000-0000-000000000008', 'en', 'Knowledge-base publication', 'Technical content and knowledge-base publication image')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `alt` = VALUES(`alt`);
