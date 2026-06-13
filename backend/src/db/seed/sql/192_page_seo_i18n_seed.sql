-- 192_page_seo_i18n_seed.sql
-- Ana içerik sayfaları için dile özel (en/de) page-seo; teklif-al için tr de.
-- Frontend getPageMetadata(<key>) + fetchPageSeo locale paramı bunları okur.
-- Idempotent: ilgili (key, locale) satırları silinip yeniden eklenir.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

DELETE FROM `site_settings` WHERE `key` IN (
  'seo_pages_about','seo_pages_faq','seo_pages_blog','seo_pages_iletisim',
  'seo_pages_toplu-satis','seo_pages_karsilastirma','seo_pages_bayi-agi',
  'seo_pages_referanslar','seo_pages_insan-kaynaklari','seo_pages_bilgi-bankasi',
  'seo_pages_ekim-rehberi'
) AND `locale` IN ('en','de');
DELETE FROM `site_settings` WHERE `key` = 'seo_pages_teklif-al' AND `locale` IN ('tr','en','de');

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
-- about
(UUID(),'seo_pages_about','en','{"title":"About Us — 35+ Years of Seed Expertise | Vista Seeds","description":"In the seed industry since 1990, Vista Seeds develops high-yield, reliable hybrid vegetable seeds for professional growers.","keywords":"about vista seeds, seed producer, hybrid vegetable seeds","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_about','de','{"title":"Über uns — 35+ Jahre Saatgut-Expertise | Vista Seeds","description":"Seit 1990 in der Saatgutbranche entwickelt Vista Seeds ertragreiches, zuverlässiges Hybrid-Gemüsesaatgut für professionelle Erzeuger.","keywords":"über vista seeds, saatgutproduzent, hybrid gemüsesaatgut","robots":"index, follow","noIndex":false}'),
-- faq
(UUID(),'seo_pages_faq','en','{"title":"FAQ — Seed Purchase & Growing Questions | Vista Seeds","description":"Frequently asked questions about Vista Seeds hybrid vegetable seeds: ordering, dealers, growing tips and technical support.","keywords":"vista seeds faq, seed questions, growing support","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_faq','de','{"title":"FAQ — Fragen zu Saatgutkauf & Anbau | Vista Seeds","description":"Häufige Fragen zu Vista Seeds Hybrid-Gemüsesaatgut: Bestellung, Händler, Anbautipps und technischer Support.","keywords":"vista seeds faq, saatgut fragen, anbau support","robots":"index, follow","noIndex":false}'),
-- blog
(UUID(),'seo_pages_blog','en','{"title":"Blog — Agriculture News & Seed Guides | Vista Seeds","description":"Agricultural insights, seed growing guides and sector news from Vista Seeds.","keywords":"agriculture blog, seed guides, farming news","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_blog','de','{"title":"Blog — Agrar-News & Saatgut-Ratgeber | Vista Seeds","description":"Landwirtschaftliche Einblicke, Anbauratgeber und Branchennews von Vista Seeds.","keywords":"agrar blog, saatgut ratgeber, landwirtschaft news","robots":"index, follow","noIndex":false}'),
-- iletisim
(UUID(),'seo_pages_iletisim','en','{"title":"Contact — Vista Seeds Seed Center","description":"Get in touch with Vista Seeds for seed orders, dealership applications and bulk supply requests.","keywords":"vista seeds contact, seed orders, dealership","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_iletisim','de','{"title":"Kontakt — Vista Seeds Saatgutzentrum","description":"Kontaktieren Sie Vista Seeds für Saatgutbestellungen, Händleranfragen und Großmengenlieferungen.","keywords":"vista seeds kontakt, saatgut bestellung, händler","robots":"index, follow","noIndex":false}'),
-- toplu-satis
(UUID(),'seo_pages_toplu-satis','en','{"title":"Bulk Sales — B2B Seed Supply | Vista Seeds","description":"Wholesale hybrid vegetable seed supply for greenhouses, cooperatives and large-scale growers. Request a volume quote from Vista Seeds.","keywords":"bulk seeds, b2b seed supply, wholesale vegetable seeds","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_toplu-satis','de','{"title":"Großhandel — B2B Saatgut-Lieferung | Vista Seeds","description":"Großhandel mit Hybrid-Gemüsesaatgut für Gewächshäuser, Genossenschaften und Großerzeuger. Mengenangebot von Vista Seeds anfordern.","keywords":"saatgut großhandel, b2b saatgut, gemüsesaatgut großmenge","robots":"index, follow","noIndex":false}'),
-- karsilastirma
(UUID(),'seo_pages_karsilastirma','en','{"title":"Product Comparison — Compare Seed Varieties | Vista Seeds","description":"Compare Vista Seeds hybrid vegetable seed varieties side by side by features, climate and growing season.","keywords":"seed comparison, compare varieties, vegetable seeds","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_karsilastirma','de','{"title":"Produktvergleich — Saatgutsorten vergleichen | Vista Seeds","description":"Vergleichen Sie Hybrid-Gemüsesaatgutsorten von Vista Seeds nach Eigenschaften, Klima und Anbausaison.","keywords":"saatgut vergleich, sorten vergleichen, gemüsesaatgut","robots":"index, follow","noIndex":false}'),
-- bayi-agi
(UUID(),'seo_pages_bayi-agi','en','{"title":"Dealer Network — Authorized Seed Dealers in Turkey | Vista Seeds","description":"Find authorized Vista Seeds dealers across Turkey. Reliable access to certified hybrid vegetable seeds near you.","keywords":"seed dealers, authorized dealers turkey, vista seeds network","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_bayi-agi','de','{"title":"Händlernetz — Autorisierte Saatguthändler in der Türkei | Vista Seeds","description":"Finden Sie autorisierte Vista Seeds Händler in der ganzen Türkei. Zuverlässiger Zugang zu zertifiziertem Hybrid-Gemüsesaatgut.","keywords":"saatguthändler, autorisierte händler türkei, vista seeds netzwerk","robots":"index, follow","noIndex":false}'),
-- referanslar
(UUID(),'seo_pages_referanslar','en','{"title":"References — Success Stories & Customer Reviews | Vista Seeds","description":"Success stories and grower testimonials achieved with Vista Seeds hybrid vegetable seeds.","keywords":"vista seeds references, success stories, customer reviews","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_referanslar','de','{"title":"Referenzen — Erfolgsgeschichten & Kundenstimmen | Vista Seeds","description":"Erfolgsgeschichten und Erzeugerstimmen mit Hybrid-Gemüsesaatgut von Vista Seeds.","keywords":"vista seeds referenzen, erfolgsgeschichten, kundenstimmen","robots":"index, follow","noIndex":false}'),
-- insan-kaynaklari
(UUID(),'seo_pages_insan-kaynaklari','en','{"title":"Careers — Job Opportunities | Vista Seeds","description":"Career opportunities at Vista Seeds. Join our team in the seed and agriculture industry.","keywords":"vista seeds careers, jobs, agriculture careers","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_insan-kaynaklari','de','{"title":"Karriere — Stellenangebote | Vista Seeds","description":"Karrieremöglichkeiten bei Vista Seeds. Werden Sie Teil unseres Teams in der Saatgut- und Agrarbranche.","keywords":"vista seeds karriere, stellenangebote, agrar jobs","robots":"index, follow","noIndex":false}'),
-- bilgi-bankasi
(UUID(),'seo_pages_bilgi-bankasi','en','{"title":"Knowledge Base — Agricultural Guides & Technical Info | Vista Seeds","description":"Agricultural knowledge base: planting guides, growing techniques and technical seed information from Vista Seeds.","keywords":"knowledge base, planting guides, seed techniques","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_bilgi-bankasi','de','{"title":"Wissensdatenbank — Agrar-Ratgeber & Technische Infos | Vista Seeds","description":"Landwirtschaftliche Wissensdatenbank: Anbauratgeber, Anbautechniken und technische Saatgut-Informationen von Vista Seeds.","keywords":"wissensdatenbank, anbauratgeber, saatgut technik","robots":"index, follow","noIndex":false}'),
-- ekim-rehberi
(UUID(),'seo_pages_ekim-rehberi','en','{"title":"Planting Guide — Regional Sowing Calendar & Depth Chart | Vista Seeds","description":"Vegetable and seed planting guide: regional sowing calendar, depth tables and growing tips from Vista Seeds.","keywords":"planting guide, sowing calendar, seed depth","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_ekim-rehberi','de','{"title":"Aussaat-Ratgeber — Regionaler Aussaatkalender & Tiefentabelle | Vista Seeds","description":"Gemüse- und Saatgut-Aussaatratgeber: regionaler Aussaatkalender, Tiefentabellen und Anbautipps von Vista Seeds.","keywords":"aussaat ratgeber, aussaatkalender, saattiefe","robots":"index, follow","noIndex":false}'),
-- teklif-al (tr + en + de)
(UUID(),'seo_pages_teklif-al','tr','{"title":"Teklif Al — Tohum Fiyat Teklifi | Vista Seeds","description":"Vista Seeds hibrit sebze tohumları için hızlıca teklif alın. Ürün, miktar ve teslimat bilgilerinizi paylaşın, size özel fiyat sunalım.","keywords":"teklif al, tohum fiyat teklifi, tohum siparişi","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_teklif-al','en','{"title":"Get a Quote — Seed Price Offer | Vista Seeds","description":"Request a fast quote for Vista Seeds hybrid vegetable seeds. Share your product, quantity and delivery details for a tailored price.","keywords":"get a quote, seed price, request offer","robots":"index, follow","noIndex":false}'),
(UUID(),'seo_pages_teklif-al','de','{"title":"Angebot anfordern — Saatgut-Preisangebot | Vista Seeds","description":"Fordern Sie schnell ein Angebot für Vista Seeds Hybrid-Gemüsesaatgut an. Teilen Sie Produkt, Menge und Lieferdetails für einen individuellen Preis.","keywords":"angebot anfordern, saatgut preis, preisangebot","robots":"index, follow","noIndex":false}');
