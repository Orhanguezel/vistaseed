-- =============================================================
-- vistaseeds blog içerik yenileme
-- blog modülü kuruluysa çalışır
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @has_blog_posts = (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE() AND table_name = 'blog_posts'
);

SET @has_blog_i18n = (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE() AND table_name = 'blog_posts_i18n'
);

SET @blog_posts_sql = IF(
  @has_blog_posts = 1,
  "INSERT INTO blog_posts (id, category, author, image_url, status, published_at, is_active, display_order) VALUES
    ('a1000001-0001-4001-8001-000000000001', 'uretim-altyapisi', 'vistaseeds Editorial', NULL, 'published', NOW(3), 1, 0),
    ('a1000001-0001-4001-8001-000000000002', 'yetistirme-rehberi', 'vistaseeds Editorial', NULL, 'published', NOW(3), 1, 1),
    ('a1000001-0001-4001-8001-000000000003', 'kurumsal-gelismeler', 'vistaseeds Editorial', NULL, 'published', NOW(3), 1, 2)
   ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    author = VALUES(author),
    status = VALUES(status),
    published_at = VALUES(published_at),
    is_active = VALUES(is_active),
    display_order = VALUES(display_order),
    updated_at = NOW(3)",
  "SELECT 1"
);
PREPARE stmt_blog_posts FROM @blog_posts_sql;
EXECUTE stmt_blog_posts;
DEALLOCATE PREPARE stmt_blog_posts;

SET @blog_i18n_sql = IF(
  @has_blog_posts = 1 AND @has_blog_i18n = 1,
  "INSERT INTO blog_posts_i18n (blog_post_id, locale, title, slug, excerpt, content, meta_title, meta_description) VALUES
    ('a1000001-0001-4001-8001-000000000001', 'tr', 'Modern seralarda güneş enerjisi ile sürdürülebilir üretim', 'modern-seralarda-gunes-enerjisi-ile-surdurulebilir-uretim', 'Bereket Fide resmî içeriğindeki modern sera, aşı odası ve güneş paneli altyapısını vistaseeds ekosistemi için yorumluyoruz.', '<p>Bereket Fide resmî kurumsal içeriğinde, Antalya Aksu merkezli tesislerde bilgisayar kontrollü sulama, ilaçlama, ısıtma, sıcaklık ve nem yönetimi ile normal ve aşılı fide üretimi yapıldığı aktarılıyor.</p><p>Aynı kaynakta 32 bin m² alan üzerinde 24 bin m² sera, 3 bin m² aşı odası ve haftalık 800 bin adet aşılama kapasitesi vurgulanıyor. vistaseeds tarafında bu üretim gücü; ürün kataloğu, toplu satış ve bayi akışları ile daha yönetilebilir hale geliyor.</p><p>Yenilenebilir enerjiye uygun güneş paneli kullanımı ise operasyonun yalnızca üretim kapasitesiyle değil, sürdürülebilirlik başlığıyla da okunmasını sağlıyor.</p>', 'Modern seralarda güneş enerjisi | vistaseeds', 'Bereket Fide''nin modern sera ve güneş enerjisi altyapısını baz alan vistaseeds blog yazısı.'),
    ('a1000001-0001-4001-8001-000000000002', 'tr', 'Fide dikim öncesi toprak hazırlığı: saha için kısa kontrol listesi', 'fide-dikim-oncesi-toprak-hazirligi-kisa-kontrol-listesi', 'Bereket Fide içeriğindeki toprak analizi, gübreleme ve havalandırma başlıklarını saha odaklı bir kontrol listesine çevirdik.', '<p>Bereket Fide ana sayfasında öne çıkarılan içeriklerden biri, fide dikim öncesi toprak hazırlığı. Mesaj net: daha başarılı dikim için toprak analizi, gübreleme ve havalandırma ihmal edilmemeli.</p><p>vistaseeds tarafında bu başlığı operasyonel hale getiriyoruz: ekim önce toprak yapısını doğrula, sulama planını ürün tipine göre netleştir, sıra üzeri ve sıra arası mesafeyi ürün teknik sayfasından kontrol et, teklif ve sevkiyat tarihini dikim penceresiyle eşleştir.</p><p>Özellikle biber ve benzeri hassas çeşitlerde ilk hafta nem dengesini korumak, ilk tutum ve kök gelişimi için kritik fark yaratır.</p>', 'Toprak hazırlığı kontrol listesi | vistaseeds', 'Fide dikim öncesi toprak hazırlığı için saha odaklı vistaseeds kontrol listesi.'),
    ('a1000001-0001-4001-8001-000000000003', 'tr', 'Aksu''daki üretim merkezinden 2026 notları', 'aksudaki-uretim-merkezinden-2026-notlari', '2026 yılında resmî sitede paylaşılan heyet ziyaretleri, merkezin görünürlüğü ve operasyonel olgunluğu hakkında sinyal veriyor.', '<p>Bereket Fide resmî haber akışında 21 Mart 2026 tarihli iki dikkat çekici gelişme yer alıyor: Özbekistan Tarım Bakanlığı heyetinin ziyareti ve Antalya Valiliği ile ilçe yönetiminin merkez ofis ziyareti.</p><p>Bu tür ziyaretler yalnızca kurumsal görünürlük değil, operasyonel altyapının sahada güven verdiğini de gösterir. vistaseeds için bu veriyi; uluslararası ticaret, bayi ağı ve kurumsal toplu satış sayfalarında daha net bir güven katmanına dönüştürüyoruz.</p><p>Kısacası 2026, yalnızca içerik üretimi değil; üretim merkezinin ekosistem içerisinde daha belirgin hale geldiği bir eşik olarak okunabilir.</p>', 'Aksu üretim merkezi 2026 | vistaseeds', '2026 heyet ziyaretleri ve üretim merkezinin görünürlüğü üzerine vistaseeds notları.'),
    ('a1000001-0001-4001-8001-000000000001', 'en', 'Sustainable production with solar energy in modern greenhouses', 'sustainable-production-with-solar-energy-in-modern-greenhouses', 'We adapt Bereket Fide''s official greenhouse, grafting-room and solar-backed production story for the vistaseeds ecosystem.', '<p>Bereket Fide''s official corporate content describes a production setup in Antalya Aksu supported by computer-controlled irrigation, spraying, heating, temperature and humidity management.</p><p>The same source highlights 24,000 m² of greenhouse area on a 32,000 m² campus, a 3,000 m² grafting room and weekly grafting capacity of 800,000 units. Within vistaseeds, that operational strength is translated into product catalog, bulk-sales and dealer workflows.</p><p>Solar-panel backed energy use also adds a sustainability layer to the production story instead of framing it only as a capacity message.</p>', 'Solar-powered greenhouse production | vistaseeds', 'vistaseeds article based on Bereket Fide''s modern greenhouse and solar-backed production data.'),
    ('a1000001-0001-4001-8001-000000000002', 'en', 'Pre-plant soil preparation: a short field checklist', 'pre-plant-soil-preparation-a-short-field-checklist', 'We turn Bereket Fide''s soil analysis, fertilization and aeration guidance into a short operational checklist.', '<p>One of the highlighted content blocks on Bereket Fide''s official homepage focuses on soil preparation before transplanting. The core message is straightforward: soil analysis, fertilization and aeration should not be skipped.</p><p>On the vistaseeds side, we translate that into an operational sequence: verify soil structure, align irrigation planning with crop type, confirm row spacing from the technical sheet and match delivery timing with the planting window.</p><p>For sensitive varieties such as pepper, preserving moisture balance during the first week can directly affect root development and stand establishment.</p>', 'Pre-plant soil preparation | vistaseeds', 'vistaseeds field checklist for soil preparation before transplanting.'),
    ('a1000001-0001-4001-8001-000000000003', 'en', 'Notes from the Aksu production center in 2026', 'notes-from-the-aksu-production-center-in-2026', 'Official 2026 visit announcements signal the operational visibility of the production center.', '<p>Bereket Fide''s official news feed includes two notable items dated March 21, 2026: a visit by a delegation from the Ministry of Agriculture of Uzbekistan and a visit by Antalya provincial officials to the central office.</p><p>These visits matter not only as public visibility moments but also as signals that the production center presents a reliable and inspectable operating structure. vistaseeds reflects this in dealer, institutional sales and ecosystem trust messaging.</p><p>For 2026, the Aksu center can be read as a more visible part of the overall operating ecosystem.</p>', 'Aksu production center 2026 | vistaseeds', 'vistaseeds notes on the visibility of the Aksu production center in 2026.')
   ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    slug = VALUES(slug),
    excerpt = VALUES(excerpt),
    content = VALUES(content),
    meta_title = VALUES(meta_title),
    meta_description = VALUES(meta_description),
    updated_at = NOW(3)",
  "SELECT 1"
);
PREPARE stmt_blog_i18n FROM @blog_i18n_sql;
EXECUTE stmt_blog_i18n;
DEALLOCATE PREPARE stmt_blog_i18n;
