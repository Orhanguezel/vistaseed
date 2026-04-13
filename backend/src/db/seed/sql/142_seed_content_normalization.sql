-- =============================================================
-- Seed içerik normalizasyonu
-- Not: Bu patch yerel kurulumda mevcut olan tablolara göre hazırlanmıştır.
-- library / popups / offers / references modülleri bu DB'de olmadığı için
-- onların içerik normalizasyonu ilgili modüller kurulduğunda ayrı patch ile
-- eklenmelidir.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'topbar_location', '*', '"Aksu / Antalya"'),
(UUID(), 'contact_phone_display', '*', '"+90 530 048 41 83"'),
(UUID(), 'contact_phone_tel', '*', '"05300484183"'),
(UUID(), 'contact_email', '*', '"info@vistaseeds.com.tr"'),
(UUID(), 'contact_to_email', '*', '"info@vistaseeds.com.tr"'),
(UUID(), 'contact_address', '*', '"Fatih Mah. Isparta Yolu 07112 Aksu / Antalya"'),
(UUID(), 'header_info_text', '*', '"Ürünlerimizi keşfedin"'),
(UUID(), 'footer_keywords', '*', '["vistaseeds","Tohum","Fide","Bayi Ağı","Toplu Satış"]'),
(UUID(), 'footer_services', '*', '["Ürünler","Bilgi Bankası","Teklif","Destek"]'),
(UUID(), 'footer_quick_links', '*', '[{"title":"Anasayfa","path":"/","pageKey":"home"},{"title":"Ürünler","path":"/urunler","pageKey":"products"},{"title":"Hakkımızda","path":"/hakkimizda","pageKey":"about"},{"title":"İletişim","path":"/iletisim","pageKey":"contact"}]'),
(UUID(), 'menu_kurumsal', '*', '[{"title":"HAKKIMIZDA","path":"/hakkimizda","pageKey":"about"},{"title":"BLOG","path":"/blog","pageKey":"blog"},{"title":"İLETİŞİM","path":"/iletisim","pageKey":"contact"}]'),
(UUID(), 'seo_defaults', '*', '{"canonicalBase":"http://localhost:3000","siteName":"{{SITE_NAME}}","description":"vistaseeds tohum, fide, bayi ağı ve teknik içerik ekosistemi.","ogLocale":"tr_TR","author":"{{SITE_NAME}}","themeColor":"#F97316","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}'),
(UUID(), 'seo_pages_home', '*', '{"title":"{{SITE_NAME}}","description":"vistaseeds tohum, fide, bayi ağı ve teknik içerik ekosistemi.","keywords":"vistaseeds, tohum, fide, bayi ağı, antalya","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),
(UUID(), 'seo_pages_products', '*', '{"title":"Ürünler | {{SITE_NAME}}","description":"vistaseeds ürün kataloğunu ve tarımsal metadata detaylarını inceleyin.","keywords":"ürünler, tohum, fide, katalog","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),
(UUID(), 'seo_pages_about', '*', '{"title":"Hakkımızda | {{SITE_NAME}}","description":"vistaseeds ekosistemi ve Bereket Fide üretim altyapısı hakkında bilgi edinin.","keywords":"hakkımızda, vistaseeds, bereket fide","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),
(UUID(), 'seo_pages_contact', '*', '{"title":"İletişim | {{SITE_NAME}}","description":"Ürün, bayi ve toplu satış talepleri için vistaseeds ile iletişime geçin.","keywords":"iletişim, teklif, bayi","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),
(UUID(), 'cta_post_listing_title', '*', '"Bizimle iletişime geçin"'),
(UUID(), 'cta_post_listing_subtitle', '*', '"Ürün, bayi ve teklif süreçleri için bize ulaşın"')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

UPDATE `custom_pages_i18n`
SET
  `title` = 'Hakkımızda',
  `content` = '{"html":"<p>vistaseeds, Bereket Fide üretim deneyiminden beslenen dijital tarım ekosistemidir.</p><p>Ürün kataloğu, bilgi bankası ve toplu satış akışlarını tek yapıda birleştirir.</p>"}',
  `summary` = 'vistaseeds ekosistemi hakkında kurumsal bilgi.',
  `meta_title` = 'Hakkımızda | {{SITE_NAME}}',
  `meta_description` = '{{SITE_NAME}} ekosistemi, üretim yaklaşımı ve kurumsal yapısı hakkında bilgi edinin.'
WHERE `page_id` = '55555555-5555-4555-8555-555555555551' AND `locale` = 'tr';

UPDATE `custom_pages_i18n`
SET
  `title` = 'Gizlilik Politikası',
  `content` = '{"html":"<p>Kişisel verileriniz, hizmet sunumu ve yasal yükümlülükler kapsamında işlenir.</p><p>Veri güvenliği için teknik ve idari tedbirler uygulanır.</p>"}',
  `summary` = 'Gizlilik ilkeleri ve veri işleme yaklaşımı.',
  `meta_title` = 'Gizlilik Politikası | {{SITE_NAME}}',
  `meta_description` = '{{SITE_NAME}} gizlilik politikası ve veri koruma yaklaşımı.'
WHERE `page_id` = '55555555-5555-4555-8555-555555555552' AND `locale` = 'tr';

UPDATE `custom_pages_i18n`
SET
  `title` = 'KVKK Aydınlatma Metni',
  `content` = '{"html":"<p>6698 sayılı KVKK kapsamında veri sorumlusu olarak kişisel verilerinizi açık rıza veya kanuni sebepler doğrultusunda işleriz.</p>"}',
  `summary` = 'KVKK kapsamında aydınlatma metni.',
  `meta_title` = 'KVKK | {{SITE_NAME}}',
  `meta_description` = '{{SITE_NAME}} KVKK aydınlatma metni.'
WHERE `page_id` = '55555555-5555-4555-8555-555555555553' AND `locale` = 'tr';

UPDATE `custom_pages_i18n`
SET
  `title` = 'Kullanım Koşulları',
  `content` = '{"html":"<p>Web sitemizi kullanan tüm taraflar, belirtilen kurallara uymakla yükümlüdür.</p><p>İçeriklerimiz bilgi amaçlıdır ve izinsiz kopyalanamaz.</p>"}',
  `summary` = 'Platform kullanım koşulları.',
  `meta_title` = 'Kullanım Koşulları | {{SITE_NAME}}',
  `meta_description` = '{{SITE_NAME}} hizmet kullanım koşulları.'
WHERE `page_id` = '55555555-5555-4555-8555-555555555554' AND `locale` = 'tr';

UPDATE `custom_pages_i18n`
SET
  `title` = 'Neden vistaseeds?',
  `content` = '[
    {"icon": "sun", "title": "Üretim Gerçekliği", "description": "Ürün ve içerik dilimizi doğrulanabilir üretim verileri üzerine kuruyoruz."},
    {"icon": "shield", "title": "Planlı Operasyon", "description": "Teklif ve ürün süreçlerini aynı veri mantığı içinde yönetiyoruz."},
    {"icon": "users", "title": "Teknik Yaklaşım", "description": "Sadece tanıtım değil, karar destek sağlayan yüzeyler sunuyoruz."},
    {"icon": "beaker", "title": "Sürekli Gelişim", "description": "Saha deneyimini dijital ürünlere ve içeriklere düzenli olarak taşıyoruz."}
  ]',
  `summary` = 'Tarımda sürdürülebilir başarı için neden vistaseeds tercih edilmelidir?'
WHERE `page_id` = 'neden-biz-uuid-001' AND `locale` = 'tr';

UPDATE `custom_pages_i18n`
SET
  `title` = 'AR-GE ve Üretim Altyapısı',
  `content` = '{"html":"<h2>Üretim bilgisini dijital akla dönüştürüyoruz</h2><p>vistaseeds, ürün metadata, içerik ve teklif süreçlerini saha gerçekleriyle hizalayacak şekilde kurgulanmıştır.</p><h3>Odaklarımız</h3><ul><li>Çeşit bilgisi ve teknik yapı</li><li>Ürün karşılaştırma ve karar desteği</li><li>Operasyonel içerik standardizasyonu</li></ul>"}',
  `summary` = 'vistaseeds ürün ve içerik altyapısının arkasındaki yaklaşım.',
  `meta_title` = 'AR-GE ve Üretim Altyapısı | vistaseeds',
  `meta_description` = 'vistaseeds ürün, metadata ve içerik altyapısı hakkında bilgi edinin.'
WHERE `page_id` = 'cp-uuid-arge-001' AND `locale` = 'tr';

UPDATE `custom_pages_i18n`
SET
  `title` = 'Ekim Rehberi',
  `content` = '{"html":"<h2>Başarılı sezon için doğru başlangıç</h2><p>Ekim öncesi toprak hazırlığı, sulama planı ve ürün bazlı teknik detaylar birlikte değerlendirilmelidir.</p><h3>Temel adımlar</h3><ul><li>Toprak yapısını doğrulayın</li><li>Ekim derinliğini ürün tipine göre belirleyin</li><li>İlk suyu kontrollü verin</li></ul>"}',
  `summary` = 'Ekim ve bakım kararları için kısa saha rehberi.',
  `meta_title` = 'Ekim Rehberi | vistaseeds',
  `meta_description` = 'Ekim öncesi hazırlık, sulama ve saha planlaması için vistaseeds rehberi.'
WHERE `page_id` = 'cp-uuid-ekim-001' AND `locale` = 'tr';

UPDATE `custom_pages_i18n`
SET
  `title` = 'Sürdürülebilirlik',
  `content` = '{"html":"<h2>Sürdürülebilirlik bizim için operasyon kalitesidir</h2><p>Enerji, kaynak kullanımı ve saha verimliliği birlikte ele alınmadan kalıcı büyüme mümkün değildir.</p><h3>Önceliklerimiz</h3><p>Verimli kaynak kullanımı, planlı üretim akışı ve sahaya uyumlu dijital süreçler.</p>"}',
  `summary` = 'Sürdürülebilir tarım ve operasyon yaklaşımımız.',
  `meta_title` = 'Sürdürülebilirlik | vistaseeds',
  `meta_description` = 'vistaseeds sürdürülebilirlik yaklaşımı ve operasyonel öncelikleri.'
WHERE `page_id` = 'cp-uuid-surdurul-001' AND `locale` = 'tr';

UPDATE `custom_pages_i18n`
SET
  `title` = 'Bayi Girişi',
  `content` = '{"html":"<h2>Bayi portalına hoş geldiniz</h2><p>Bayilerimiz için sipariş ve operasyon takibini tek noktada toplayan giriş alanı.</p><div class=\"bg-brand/10 p-8 rounded-2xl text-center my-12 font-bold\">Bayi giriş paneli yakında hizmetinizde...</div>"}',
  `summary` = 'Bayilere özel sipariş ve operasyon portalı.',
  `meta_title` = 'Bayi Girişi | vistaseeds',
  `meta_description` = 'vistaseeds bayilerine özel giriş ve işlem alanı.'
WHERE `page_id` = 'cp-uuid-bayi-001' AND `locale` = 'tr';

UPDATE `support_faqs_i18n`
SET `question` = 'vistaseeds ne sunuyor?',
    `answer` = 'vistaseeds; ürün kataloğu, bilgi bankası ve toplu satış süreçlerini tek yapıda toplayan dijital tarım ekosistemidir.'
WHERE `faq_id` = '66666666-6666-4666-8666-666666666661' AND `locale` = 'tr';

UPDATE `support_faqs_i18n`
SET `question` = 'Ürünlerinizi nasıl inceleyebilir veya talep oluşturabilirim?',
    `answer` = 'Ürün kataloğunu inceleyebilir, karşılaştırma sayfasını kullanabilir ve iletişim ya da toplu satış formları üzerinden talep oluşturabilirsiniz.'
WHERE `faq_id` = '66666666-6666-4666-8666-666666666662' AND `locale` = 'tr';

UPDATE `support_faqs_i18n`
SET `question` = 'İletişim bilgilerinize nasıl ulaşabilirim?',
    `answer` = 'İletişim sayfasında telefon, e-posta ve Aksu / Antalya adres bilgilerimize ulaşabilirsiniz.'
WHERE `faq_id` = '66666666-6666-4666-8666-666666666663' AND `locale` = 'tr';

UPDATE `support_faqs_i18n`
SET `question` = 'Hesabımı nasıl oluşturabilirim?',
    `answer` = 'Üye ol akışlarını kullanarak hesabınızı oluşturabilirsiniz.'
WHERE `faq_id` = '66666666-6666-4666-8666-666666666664' AND `locale` = 'tr';

UPDATE `support_faqs_i18n`
SET `question` = 'Teknik desteği nasıl alabilirim?',
    `answer` = 'İletişim formu veya destek alanı üzerinden ekibimize ulaşabilirsiniz.'
WHERE `faq_id` = '66666666-6666-4666-8666-666666666665' AND `locale` = 'tr';

UPDATE `job_listings`
SET `department` = 'Üretim', `location` = 'Antalya'
WHERE `id` = '77777777-7777-4777-8777-777777777771';

UPDATE `job_listings`
SET `department` = 'Satış', `location` = 'Antalya'
WHERE `id` = '77777777-7777-4777-8777-777777777772';

UPDATE `job_listings_i18n`
SET
  `title` = 'Üretim Mühendisi',
  `description` = 'Üretim planlama, saha operasyonu ve kalite akışlarını birlikte yönetecek ekip arkadaşı arıyoruz.',
  `requirements` = 'Ziraat veya ilgili mühendislik bölümlerinden mezun, üretim planlama ve kalite süreçlerinde deneyimli.',
  `meta_title` = 'Üretim Mühendisi İş İlanı',
  `meta_description` = 'Üretim operasyonları ve kalite süreçlerini yönetecek üretim mühendisi pozisyonu.'
WHERE `job_listing_id` = '77777777-7777-4777-8777-777777777771' AND `locale` = 'tr';

UPDATE `job_listings_i18n`
SET
  `title` = 'Satış Uzmanı',
  `description` = 'Bayi ağımızı ve kurumsal müşteri ilişkilerini yönetecek satış uzmanı arıyoruz.',
  `requirements` = 'Tarım veya FMCG satışında deneyimli, iletişim becerileri güçlü, saha ziyaretlerine açık.',
  `meta_title` = 'Satış Uzmanı İş İlanı',
  `meta_description` = 'Tohum ve tarım ürünleri satış süreçlerinde görev alacak satış uzmanı pozisyonu.'
WHERE `job_listing_id` = '77777777-7777-4777-8777-777777777772' AND `locale` = 'tr';

UPDATE `job_applications`
SET
  `full_name` = 'Ahmet Yılmaz',
  `cover_letter` = 'Üretim planlama, saha operasyonları ve kalite sistemleri alanında deneyimliyim. vistaseeds ekibine operasyonel disiplin ve süreç iyileştirme katkısı sunabileceğime inanıyorum.'
WHERE `id` = '88888888-8888-4888-8888-888888888881';

UPDATE `product_i18n`
SET
  `description` = 'AVAR anaç çeşidi, güçlü kök yapısı ve yüksek adaptasyon kabiliyeti ile öne çıkar. Farklı toprak ve iklim koşullarında üstün performans gösterir. Dayanıklı kök sistemi sayesinde aşılı bitkilere güçlü bir temel sağlar.',
  `alt` = 'AVAR anaç tohumu',
  `meta_description` = 'AVAR anaç çeşidi; güçlü kök yapısı, yüksek adaptasyon ve dayanıklı kök sistemiyle öne çıkar.'
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000001' AND `locale` = 'tr';

UPDATE `product_i18n`
SET
  `description` = 'Meyve uzunluğu 21-23 cm. Güz, tek ekim ve yayla yetiştiriciliğine uygundur. TSWV ve Tm:0-2 toleranslıdır. Meyve rengi parlak koyu yeşildir. Meyve eti orta kalın, yüzeyi pürüzsüzdür. Soğuk performansı yüksektir. Meyve kalitesi güçlü, raf ömrü uzundur. Meyveleri %100 tatlıdır.',
  `alt` = 'LUCKY F1 charliston biber tohumu',
  `tags` = '["biber","f1","hibrit","charliston","tatlı","sera","yayla","bahar","yaz"]',
  `meta_description` = 'LUCKY F1 charliston biber; 21-23 cm, parlak koyu yeşil, TSWV toleranslı, %100 tatlı ve soğuk performansı yüksektir.'
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000002' AND `locale` = 'tr';

UPDATE `product_i18n`
SET
  `description` = 'Meyve uzunluğu 23-25 cm. Güz ve bahar yetiştiriciliğine uygundur. Sera ve açık tarla yetiştiriciliğine uyumludur. TSWV''ye toleranslıdır. Bitki yapısı güçlüdür. Meyveleri yeşil, düz ve acıdır.',
  `alt` = 'KIZGIN F1 acı kıl biber tohumu',
  `tags` = '["biber","f1","hibrit","acı","kıl-biber","sera","açık-tarla","bahar","güz"]',
  `meta_description` = 'KIZGIN F1 acı kıl biber; 23-25 cm, TSWV toleranslı, güçlü bitki yapılı ve sera ile açık tarla için uygundur.'
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000003' AND `locale` = 'tr';

UPDATE `product_i18n`
SET
  `description` = 'Meyve uzunluğu 22-24 cm. Güz ve tek ekim yetiştiriciliğine uygundur. Sera yetiştiriciliği için uygundur. TSWV''ye toleranslıdır. Meyveleri yeşil, düz formda ve %100 tatlıdır. Soğuk performansı yüksektir.',
  `alt` = 'PRESTİJ F1 tatlı kıl biber tohumu',
  `tags` = '["biber","f1","hibrit","tatlı","kıl-biber","sera","soğuk-performansı","bahar","kış"]',
  `meta_description` = 'PRESTİJ F1 tatlı kıl biber; 22-24 cm, TSWV toleranslı, %100 tatlı ve soğuk performansı yüksektir.'
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000004' AND `locale` = 'tr';

UPDATE `product_i18n`
SET
  `description` = 'Meyve uzunluğu 16-18 cm. Güz ve tek ekim yetiştiriciliğine uygundur. Sera üretimine uyumludur. TSWV ve Tm:0-2 toleranslıdır. Türk tipi kahvaltılık biber formundadır. İnce kabuklu ve erkencidir.',
  `alt` = 'BİRLİK F1 üçburun biber tohumu',
  `tags` = '["biber","f1","hibrit","üçburun","kahvaltılık","sera","erkenci","bahar"]',
  `meta_description` = 'BİRLİK F1 üçburun biber; 16-18 cm, Türk tipi kahvaltılık, TSWV toleranslı, ince kabuklu ve erkencidir.'
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000005' AND `locale` = 'tr';

UPDATE `product_i18n`
SET
  `description` = 'Meyve uzunluğu 18-20 cm. Güz ve bahar yetiştiriciliğine uygundur. Sera ve açık tarla üretiminde kullanılabilir. TSWV''ye toleranslıdır. Koyu kırmızı, düz ve konik kapya formundadır. Adaptasyon kabiliyeti yüksektir.',
  `alt` = 'CANKAN F1 kapya biber tohumu',
  `tags` = '["biber","f1","hibrit","kapya","kırmızı","sera","açık-tarla"]',
  `meta_description` = 'CANKAN F1 kapya biber; 18-20 cm, koyu kırmızı, TSWV toleranslı ve yüksek adaptasyonlu bir çeşittir.'
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000006' AND `locale` = 'tr';

UPDATE `product_i18n`
SET
  `description` = 'Meyve uzunluğu 19-21 cm. Güz ve bahar yetiştiriciliğine uygundur. Sera üretimi için uygundur. TSWV''ye toleranslıdır. Koyu kırmızı, düz ve konik kapya formundadır. Sıcak tutumu çok iyidir, çatlama yapmaz.',
  `alt` = 'TIRPAN F1 kapya biber tohumu',
  `tags` = '["biber","f1","hibrit","kapya","kırmızı","sera","çatlama-yapmaz"]',
  `meta_description` = 'TIRPAN F1 kapya biber; 19-21 cm, koyu kırmızı, TSWV toleranslı, %100 tatlı ve çatlama yapmayan bir çeşittir.'
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000007' AND `locale` = 'tr';

UPDATE `product_i18n`
SET
  `description` = 'Güz ve bahar yetiştiriciliğine uygundur. Sera ve açık tarla üretiminde kullanılabilir. TSWV''ye toleranslıdır. Meyveleri koyu yeşil, kalın kabuklu ve 3-4 lobludur.',
  `alt` = 'SARAY F1 dolma biber tohumu',
  `tags` = '["biber","f1","hibrit","dolma","kalın-kabuk","sera","açık-tarla"]',
  `meta_description` = 'SARAY F1 dolma biber; koyu yeşil, kalın kabuklu, 3-4 loblu ve TSWV toleranslıdır.'
WHERE `product_id` = 'pppppppp-0001-4000-8000-000000000008' AND `locale` = 'tr';

UPDATE `product_specs`
SET `name` = 'Kök Gücü', `value` = 'Çok Yüksek'
WHERE `id` = 'ssssssss-0001-4000-8000-000000000001' AND `locale` = 'tr';

UPDATE `product_specs`
SET `name` = 'Kullanım Alanı', `value` = 'Aşı anaçlığı'
WHERE `id` = 'ssssssss-0001-4000-8000-000000000003' AND `locale` = 'tr';

UPDATE `product_specs`
SET `value` = 'Açık tarla ve sera'
WHERE `id` IN ('ssssssss-0001-4000-8000-000000000028','ssssssss-0001-4000-8000-000000000036','ssssssss-0001-4000-8000-000000000043') AND `locale` = 'tr';

UPDATE `product_specs`
SET `value` = 'Koyu kırmızı'
WHERE `id` IN ('ssssssss-0001-4000-8000-000000000038','ssssssss-0001-4000-8000-000000000041') AND `locale` = 'tr';

UPDATE `product_specs`
SET `value` = 'Koyu yeşil'
WHERE `id` = 'ssssssss-0001-4000-8000-000000000045' AND `locale` = 'tr';

UPDATE `product_reviews`
SET `comment` = 'Serada diktik, soğuk kışta bile meyve verimi düşmedi. Parlak koyu yeşil rengi müşteriden tam puan aldı.', `customer_name` = 'Mehmet Yılmaz'
WHERE `id` = 'rrrrrrrr-0001-4000-8000-000000000001';

UPDATE `product_reviews`
SET `comment` = 'Kahvaltılık olarak harika, ince kabuğuyla kavurma için de birebir. Erkenci olması büyük avantaj.', `customer_name` = 'Ali Öztürk'
WHERE `id` = 'rrrrrrrr-0001-4000-8000-000000000005';

UPDATE `product_reviews`
SET `comment` = 'Genel olarak memnunum. Meyve boyu 16-17 cm arasında, tutarlı bir çeşit.', `customer_name` = 'Mustafa Şahin'
WHERE `id` = 'rrrrrrrr-0001-4000-8000-000000000007';

UPDATE `product_reviews`
SET `comment` = '%100 tatlı olması en büyük avantajı. Müşteriler acı olmasından korkmadan alıyor.', `customer_name` = 'Sevgi Doğan'
WHERE `id` = 'rrrrrrrr-0001-4000-8000-000000000012';

UPDATE `product_reviews`
SET `comment` = 'Meyve yapısı düzgün ve tutarlı. 23-25 cm arası geliyor, pazarda güzel görünüyor.', `customer_name` = 'Osman Kılıç'
WHERE `id` = 'rrrrrrrr-0001-4000-8000-000000000017';

UPDATE `product_reviews`
SET `comment` = 'Koyu kırmızı renk ve konik şekil pazarda çok rağbet görüyor. Çatlama yapmaması en büyük artısı.', `customer_name` = 'Ramazan Yıldırım'
WHERE `id` = 'rrrrrrrr-0001-4000-8000-000000000018';

UPDATE `product_reviews`
SET `comment` = 'Sera yetiştiriciliğinde verim yüksek. 19-21 cm boyu tutarlı. Tatlı olması da cabası.', `customer_name` = 'Süleyman Çetin'
WHERE `id` = 'rrrrrrrr-0001-4000-8000-000000000020';

UPDATE `product_reviews`
SET `comment` = 'Koyu kırmızı rengi ve konik şekliyle görüntüsü çok iyi. %100 tatlı olması müşteride güven oluşturuyor.'
WHERE `id` = 'rrrrrrrr-0001-4000-8000-000000000023';
