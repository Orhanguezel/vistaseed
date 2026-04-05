/* =============================================================
   160_geo_seo_boost_seed.sql
   GEO/SEO skoru yükseltme — meta description, keywords, OG,
   social links, analytics, iletişim bilgileri
   ============================================================= */

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

/* =============================================================
   1. SAYFA BAZLI SEO — Türkçe (seo_pages_ prefix)
   Her sayfa için: title, description, keywords, robots, open_graph
   ============================================================= */

-- Home
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_home', 'tr',
 '{"title":"VistaSeed — Türkiye''nin Lider Tohum Üreticisi | Sertifikalı Sebze Tohumları","description":"VistaSeed, 1990''dan bu yana TÜAB onaylı hibrit sebze tohumları üretir. %95+ çimlendirme garantisi, AR-GE merkezi ve 35+ yıllık deneyim ile profesyonel çiftçilere hizmet verir.","keywords":"tohum, hibrit tohum, sebze tohumu, sertifikalı tohum, VistaSeed, biber tohumu, domates tohumu, sera tohumu, Antalya tohumculuk","robots":"index, follow, max-image-preview:large, max-snippet:-1","open_graph":{"type":"website","images":["/uploads/media/logo/logo-light.png"]}}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- Ürünler
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_urunler', 'tr',
 '{"title":"Tohum Kataloğu — Hibrit Sebze Tohumları | VistaSeed","description":"VistaSeed tohum kataloğu: Biber, domates, hıyar, kavun ve anaç tohumları. TÜAB onaylı, %95+ çimlendirme oranı. Sera ve açık tarla çeşitleri.","keywords":"tohum kataloğu, biber tohumu, domates tohumu, anaç tohumu, hibrit tohum, sera tohumu, açık tarla tohumu","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- Hakkımızda
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_hakkimizda', 'tr',
 '{"title":"Hakkımızda — 35+ Yıllık Tohumculuk Deneyimi | VistaSeed","description":"1990''dan bu yana tohum sektöründe. VistaSeed grubu: tohum üretimi, fide yetiştiriciliği, AR-GE merkezi ve uluslararası ihracat. Vista Prestige, Bereket Fide, GES Sistemleri.","keywords":"VistaSeed hakkında, tohum üreticisi, AR-GE merkezi, Bereket Fide, tohumculuk tarihi, Antalya","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- SSS
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_sss', 'tr',
 '{"title":"Sıkça Sorulan Sorular — Tohum Alımı ve Yetiştirme | VistaSeed","description":"VistaSeed tohumları hakkında merak edilenler: Sipariş, teslimat, ekim önerileri, çimlendirme, iade ve bayi başvuru süreçleri.","keywords":"tohum SSS, ekim soruları, çimlendirme, tohum sipariş, bayi başvuru, VistaSeed destek","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- İletişim
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_iletisim', 'tr',
 '{"title":"İletişim — VistaSeed Tohum Merkezi","description":"VistaSeed ile iletişime geçin. Tohum siparişi, bayi başvurusu, teknik destek ve kurumsal talepler için merkez ofis bilgilerimiz.","keywords":"VistaSeed iletişim, tohum sipariş, bayi başvuru, Antalya tohum merkezi","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- Blog
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_blog', 'tr',
 '{"title":"Blog — Tarım Haberleri ve Tohum Rehberleri | VistaSeed","description":"Tarımsal bilgiler, tohum yetiştirme rehberleri, sera teknolojileri ve sektör haberleri. VistaSeed uzmanlarından güncel içerikler.","keywords":"tarım blog, tohum rehberi, sera teknolojisi, ekim tavsiyeleri, tarım haberleri","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- Bayi Ağı
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_bayi-agi', 'tr',
 '{"title":"Bayi Ağı — Türkiye Geneli Yetkili Tohum Bayileri | VistaSeed","description":"VistaSeed yetkili bayi haritası. Türkiye genelinde sertifikalı tohum satış noktaları, iletişim bilgileri ve bölgesel dağıtım ağı.","keywords":"tohum bayi, yetkili bayi, VistaSeed bayi, tohum satış noktası, Türkiye tohum dağıtım","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- Ekim Rehberi
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_ekim-rehberi', 'tr',
 '{"title":"Ekim Rehberi — Bölgesel Ekim Takvimi ve Derinlik Tablosu | VistaSeed","description":"Sebze ve tohum ekim rehberi: Bölgeye göre ekim zamanı, derinlik, sıra arası mesafe ve sulama önerileri. Akdeniz, Ege, İç Anadolu ve Karadeniz bölgeleri.","keywords":"ekim takvimi, ekim rehberi, sebze ekim zamanı, tohum ekim derinliği, bölgesel ekim, sera ekim takvimi","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- Bilgi Bankası
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_bilgi-bankasi', 'tr',
 '{"title":"Bilgi Bankası — Tarımsal Rehberler ve Teknik Bilgiler | VistaSeed","description":"Tarımsal bilgi bankası: Hastalıklarla mücadele, bakım rehberleri, gübreleme programları ve bitki besleme. VistaSeed AR-GE ekibinden teknik bilgiler.","keywords":"tarım bilgi bankası, bitki hastalıkları, zirai mücadele, gübreleme, sera bakım rehberi","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- İnsan Kaynakları
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_insan-kaynaklari', 'tr',
 '{"title":"İnsan Kaynakları — Kariyer Fırsatları | VistaSeed","description":"VistaSeed''de kariyer fırsatları. Tohumculuk, AR-GE, satış ve lojistik alanlarında açık pozisyonlar. Tarım sektöründe büyüyen bir ekibin parçası olun.","keywords":"VistaSeed kariyer, tarım iş ilanları, tohumculuk kariyer, AR-GE pozisyon","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- Toplu Satış
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_toplu-satis', 'tr',
 '{"title":"Toplu Satış — B2B Tohum Tedarik | VistaSeed","description":"VistaSeed toplu tohum satışı: Sera işletmeleri, tarım kooperatifleri ve bayiler için özel fiyatlandırma. Hacim indirimi ve teslimat garantisi.","keywords":"toplu tohum satışı, B2B tohum, tohum tedarik, sera tohumu toptan, bayi fiyat","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- Karşılaştırma
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_karsilastirma', 'tr',
 '{"title":"Ürün Karşılaştırma — Tohum Çeşitlerini Kıyasla | VistaSeed","description":"VistaSeed tohum çeşitlerini yan yana karşılaştırın. Meyve boyu, verim, tolerans, iklim uyumu ve fiyat bazında detaylı kıyaslama.","keywords":"tohum karşılaştırma, biber çeşitleri kıyasla, tohum seçim, hibrit tohum farkları","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

-- Referanslar
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_referanslar', 'tr',
 '{"title":"Referanslar — Başarı Hikayeleri ve Müşteri Görüşleri | VistaSeed","description":"VistaSeed tohumları ile elde edilen sonuçlar. Çiftçi deneyimleri, verim raporları ve sera başarı hikayeleri.","keywords":"VistaSeed referanslar, çiftçi deneyimi, tohum verim, sera başarı hikayesi","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

/* =============================================================
   2. SAYFA BAZLI SEO — English
   ============================================================= */

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_home', 'en',
 '{"title":"VistaSeed — Turkey''s Leading Seed Producer | Certified Vegetable Seeds","description":"VistaSeed produces TUAB-certified hybrid vegetable seeds since 1990. 95%+ germination guarantee, R&D center and 35+ years of expertise serving professional growers.","keywords":"seeds, hybrid seeds, vegetable seeds, certified seeds, VistaSeed, pepper seeds, tomato seeds, Turkish seeds","robots":"index, follow","open_graph":{"type":"website","images":["/uploads/media/logo/logo-light.png"]}}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_urunler', 'en',
 '{"title":"Seed Catalog — Hybrid Vegetable Seeds | VistaSeed","description":"VistaSeed seed catalog: Pepper, tomato, cucumber, melon and rootstock seeds. TUAB certified, 95%+ germination rate. Greenhouse and open field varieties.","keywords":"seed catalog, pepper seeds, tomato seeds, rootstock seeds, hybrid seeds, greenhouse seeds","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_hakkimizda', 'en',
 '{"title":"About Us — 35+ Years of Seed Expertise | VistaSeed","description":"In the seed industry since 1990. VistaSeed group: seed production, seedling cultivation, R&D center and international export.","keywords":"about VistaSeed, seed producer, R&D center, Turkish seeds, seed industry history","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

/* =============================================================
   3. SAYFA BAZLI SEO — Deutsch
   ============================================================= */

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_home', 'de',
 '{"title":"VistaSeed — Führender Saatgutproduzent der Türkei | Zertifiziertes Gemüsesaatgut","description":"VistaSeed produziert seit 1990 TÜAB-zertifiziertes Hybrid-Gemüsesaatgut. 95%+ Keimgarantie, F&E-Zentrum und über 35 Jahre Erfahrung.","keywords":"Saatgut, Hybridsaatgut, Gemüsesaatgut, zertifiziertes Saatgut, VistaSeed, Paprikasamen, Tomatensamen","robots":"index, follow","open_graph":{"type":"website","images":["/uploads/media/logo/logo-light.png"]}}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_urunler', 'de',
 '{"title":"Saatgutkatalog — Hybrides Gemüsesaatgut | VistaSeed","description":"VistaSeed Saatgutkatalog: Paprika, Tomaten, Gurken, Melonen und Unterlagensaatgut. TÜAB-zertifiziert, 95%+ Keimrate.","keywords":"Saatgutkatalog, Paprikasamen, Tomatensamen, Unterlagensaatgut, Hybridsaatgut","robots":"index, follow"}'
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

/* =============================================================
   4. GLOBAL SEO DEFAULTS GÜNCELLE
   ============================================================= */

UPDATE `site_settings`
SET `value` = '{"canonicalBase":"https://www.vistaseeds.com.tr","siteName":"VistaSeed","description":"VistaSeed — Türkiye''nin lider tohum üreticisi. TÜAB onaylı sertifikalı sebze tohumları.","ogLocale":"tr_TR","author":"VistaSeed","themeColor":"#006838","twitterCard":"summary_large_image","robots":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1","googlebot":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}',
    `updated_at` = NOW(3)
WHERE `key` = 'seo_defaults' AND `locale` = '*';

/* =============================================================
   5. DEFAULT META GÜNCELLE (fallback title/description)
   ============================================================= */

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site_meta_default', 'tr',
 '{"title":"VistaSeed — Sertifikalı Tohum Üreticisi","description":"1990''dan bu yana Türkiye''nin lider tohum üreticisi. Hibrit sebze tohumları, anaç tohumları ve tarımsal bilgi platformu.","keywords":"tohum, hibrit tohum, sebze tohumu, sertifikalı tohum, VistaSeed, Antalya tohumculuk, sera tohumu, biber tohumu, domates tohumu"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site_meta_default', 'en',
 '{"title":"VistaSeed — Certified Seed Producer","description":"Turkey''s leading seed producer since 1990. Hybrid vegetable seeds, rootstock seeds and agricultural knowledge platform.","keywords":"seeds, hybrid seeds, vegetable seeds, certified seeds, VistaSeed, Turkish seeds, pepper seeds, tomato seeds"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site_meta_default', 'de',
 '{"title":"VistaSeed — Zertifizierter Saatgutproduzent","description":"Führender Saatgutproduzent der Türkei seit 1990. Hybrides Gemüsesaatgut, Unterlagensaatgut und landwirtschaftliche Wissensplattform.","keywords":"Saatgut, Hybridsaatgut, Gemüsesaatgut, zertifiziertes Saatgut, VistaSeed, türkisches Saatgut"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

/* =============================================================
   6. SOSYAL MEDYA LİNKLERİ (sameAs için)
   ============================================================= */

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site__social_facebook',  '*', '"https://www.facebook.com/vistaseeds"'),
(UUID(), 'site__social_instagram', '*', '"https://www.instagram.com/vistaseeds"'),
(UUID(), 'site__social_linkedin',  '*', '"https://www.linkedin.com/company/vistaseeds"'),
(UUID(), 'site__social_youtube',   '*', '"https://www.youtube.com/@vistaseeds"'),
(UUID(), 'site__social_twitter',   '*', '""')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

/* =============================================================
   7. İLETİŞİM BİLGİLERİ (LocalBusiness schema)
   ============================================================= */

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site__contact_email',      '*', '"info@vistaseed.com.tr"'),
(UUID(), 'site__contact_phone',      '*', '"+90 530 048 41 83"'),
(UUID(), 'site__contact_address',    '*', '"Sertifikalı Tohum Üretim Merkezi, Antalya, Türkiye"'),
(UUID(), 'site__contact_map_lat',    '*', '"36.8841"'),
(UUID(), 'site__contact_map_lng',    '*', '"30.7056"')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = NOW(3);

/* =============================================================
   8. SITE SEO (global title template)
   ============================================================= */

UPDATE `site_settings`
SET `value` = '{"title_default":"VistaSeed — Sertifikalı Tohum Üreticisi","title_template":"%s | VistaSeed","description":"1990''dan bu yana Türkiye''nin lider tohum üreticisi. TÜAB onaylı sertifikalı sebze tohumları.","robots":"index, follow","author":"VistaSeed","open_graph":{"images":["/uploads/media/logo/logo-light.png"]},"twitter":{"card":"summary_large_image"}}',
    `updated_at` = NOW(3)
WHERE `key` = 'site_seo' AND `locale` = '*';
