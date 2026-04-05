-- =============================================================
-- VistaSeed içerik yenileme
-- Bereket Fide resmî kaynaklarından doğrulanan kurumsal/iletişim verileri
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================
-- BRAND / CONTACT / SEO
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site_name', '*', '"VistaSeed"'),
(UUID(), 'site_title', '*', '"VistaSeed"'),
(UUID(), 'site_description', 'tr', '"Antalya Aksu merkezli üretim ekosisteminden beslenen VistaSeed; tohum, fide, teknik içerik ve bayi ağı yönetimini tek çatı altında birleştiren dijital tarım markasıdır."'),
(UUID(), 'brand_display_name', '*', '"VistaSeed"'),
(UUID(), 'brand_subtitle', '*', '"Tohum ve Fide Ekosistemi"'),
(UUID(), 'brand_tagline', '*', '"Doğru çeşit, güçlü üretim, sürekli destek"'),
(UUID(), 'topbar_location', '*', '"Aksu / Antalya"'),
(UUID(), 'topbar_slogan', '*', '"Tohumdan fideliye uzanan üretim ekosistemi"'),
(UUID(), 'contact_phone', '*', '"+90 530 048 41 83"'),
(UUID(), 'contact_phone_display', '*', '"+90 530 048 41 83"'),
(UUID(), 'contact_phone_tel', '*', '"05300484183"'),
(UUID(), 'contact_email', '*', '"info@vistaseed.com.tr"'),
(UUID(), 'contact_to_email', '*', '"info@vistaseed.com.tr"'),
(UUID(), 'contact_address', '*', '"Fatih Mah. Isparta Yolu 07112 Aksu / Antalya"'),
(UUID(), 'contact_map_lat', '*', '""'),
(UUID(), 'contact_map_lng', '*', '""'),
(UUID(), 'contact_map_iframe', '*', '""'),
(UUID(), 'contact_whatsapp_link', '*', '""'),
(UUID(), 'company_brand', '*', '{"name":"VistaSeed","shortName":"VistaSeed"}'),
(UUID(), 'seo_local_business', '*', '{"@context":"https://schema.org","@type":"Organization","name":"VistaSeed","description":"Antalya Aksu merkezli tohum ve fide ekosistemi.","email":"info@vistaseed.com.tr","telephone":"+90 530 048 41 83","address":{"@type":"PostalAddress","streetAddress":"Fatih Mah. Isparta Yolu 07112","addressLocality":"Aksu","addressRegion":"Antalya","addressCountry":"TR"}}'),
(UUID(), 'site_meta_default', 'tr', '{"title":"VistaSeed","description":"Antalya Aksu merkezli modern sera altyapısı, aşılı ve standart fide üretim deneyimi, teknik içerik ve bayi ağı yönetimi VistaSeed ekosisteminde buluşuyor.","keywords":"vistaseed, bereket fide, tohum, fide, antalya aksu, sera üretimi"}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'seo_pages_home', '*', '{"title":"VistaSeed","description":"Bereket Fide üretim gücü ve saha deneyiminden beslenen VistaSeed ile tohum, fide, teknik içerik ve teklif süreçlerini tek ekosistemde yönetin.","keywords":"vistaseed, bereket fide, fide, tohum, antalya aksu","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),
(UUID(), 'seo_pages_about', '*', '{"title":"Hakkımızda | VistaSeed","description":"VistaSeed ekosisteminin arkasındaki üretim altyapısı, Bereket Fide deneyimi ve iş ortaklığı yapısını inceleyin.","keywords":"vistaseed hakkımızda, bereket fide, fide üretimi","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}'),
(UUID(), 'seo_pages_contact', '*', '{"title":"İletişim | VistaSeed","description":"Aksu / Antalya merkezli ekibimizle teklif, ürün ve bayi iş birlikleri için iletişime geçin.","keywords":"vistaseed iletişim, bereket fide iletişim, aksu antalya","ogImage":"/uploads/media/hero/og-default.jpg","robots":"index, follow","noIndex":false}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- HOMEPAGE CONTENT
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'homepage_hero', 'tr', '{
  "season": "spring",
  "title": "Modern sera gücü",
  "highlight": "VistaSeed",
  "suffix": "ekosisteminde",
  "description": "Bereket Fide''nin Antalya Aksu''daki üretim deneyiminden beslenen VistaSeed; tohum, fide, teknik bilgi ve bayi süreçlerini tek çatı altında toplar.",
  "badge": "Aksu / Antalya Üretim Ekosistemi",
  "image_url": "/assets/hero/spring-field.jpg",
  "cta_label": "Ürünleri Keşfet",
  "cta_href": "/urunler",
  "secondary_label": "Toplu Satış Talebi",
  "secondary_href": "/toplu-satis"
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'trust_badges', 'tr', '[
  {"icon": "building-2", "label": "24 bin m² modern sera", "description": "32 bin m² alan üzerinde normal ve aşılı fide üretim altyapısı"},
  {"icon": "shield-check", "label": "3 bin m² aşı odası", "description": "Yüksek hijyen standartlı, kontrollü aşı operasyon alanı"},
  {"icon": "sprout", "label": "16-17 milyon aşılı fide", "description": "Gerektiğinde ulaşılabilen yıllık kapasite"},
  {"icon": "leaf", "label": "Güneş enerjisi desteği", "description": "Yenilenebilir enerjiye uygun panel altyapısıyla sürdürülebilir üretim"}
]')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'homepage_sections', 'tr', '{
  "stats": [
    {"value": "24 bin m²", "label": "Modern Sera"},
    {"value": "3 bin m²", "label": "Aşı Odası"},
    {"value": "16-17 Mn", "label": "Aşılı Fide"},
    {"value": "800 bin", "label": "Haftalık Aşı Kapasitesi"}
  ],
  "values": [
    {"icon": "sun", "title": "Modern Üretim Altyapısı", "description": "Bilgisayar kontrollü sulama, ilaçlama, ısıtma, sıcaklık ve nem yönetimi ile tutarlı fide kalitesi."},
    {"icon": "shield", "title": "Saha Doğrulamalı Kalite", "description": "Teknik ekip, sürekli kontrol ve hijyen odaklı operasyon ile üreticinin kaybını azaltan planlı sevkiyat."},
    {"icon": "users", "title": "Ekosistem Yaklaşımı", "description": "VistaSeed; ürün kataloğu, bayi ağı, toplu satış ve bilgi bankası modüllerini aynı operasyon mantığında birleştirir."},
    {"icon": "beaker", "title": "İş Ortaklığı ve Gelişim", "description": "Resmî sitede de yer alan Vista Seeds dahil iş ortaklarıyla çeşit, tedarik ve üretim süreçlerini güçlendirir."}
  ],
  "timeline": [
    {"year": "2006", "title": "Bereket Fide üretime başladı", "description": "Resmî kurumsal bilgiye göre Antalya''nın Aksu Çamköy bölgesinde üretim başlangıcı yapıldı."},
    {"year": "Bugün", "title": "Aksu merkezli modern sera altyapısı", "description": "32 bin m² alan üzerinde 24 bin m² sera ve 3 bin m² aşı odası ile normal ve aşılı fide üretimi sürüyor."},
    {"year": "Kapasite", "title": "Yüksek hacimli aşı operasyonu", "description": "16-17 milyon aşılı fide, 18-20 milyon normal fide ve haftalık 800 bin aşı kapasitesine ulaşabilen yapı."},
    {"year": "2026", "title": "Uluslararası ve kurumsal ziyaretler", "description": "Özbekistan Tarım Bakanlığı heyeti ve Antalya kamu heyetlerinin ziyaret ettiği açık bir operasyon merkezi."}
  ],
  "seasonal_picks_title": "Ekosistemde Öne Çıkan Çeşitler",
  "seasonal_picks_description": "Tohum kataloğu, saha adaptasyonu ve yetiştirme detayları birlikte görünür."
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'newsletter_config', 'tr', '{
  "title": "Sezonu Kaçırmayın",
  "description": "Yeni çeşitler, ekim dönemleri, saha notları ve toplu satış duyuruları için bültene kaydolun.",
  "button_label": "Kaydol",
  "placeholder": "E-posta adresiniz"
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'footer_config', 'tr', '{
  "help_title": "Teklif, ürün ve bayi süreçlerinde yanınızdayız",
  "help_description": "İhtiyacınız ürün seçimi, toplu alım planı ya da teknik yönlendirme olsun; ekiple doğrudan bağlanın.",
  "follow_title": "VistaSeed Ekosistemi",
  "columns": [
    {
      "title": "Kurumsal",
      "links": [
        {"label": "Hakkımızda", "href": "/hakkimizda"},
        {"label": "Bayi Ağı", "href": "/bayi-agi"},
        {"label": "Toplu Satış", "href": "/toplu-satis"},
        {"label": "İletişim", "href": "/iletisim"}
      ]
    },
    {
      "title": "İçerik",
      "links": [
        {"label": "Blog", "href": "/blog"},
        {"label": "S.S.S.", "href": "/sss"},
        {"label": "Bilgi Bankası", "href": "/blog"}
      ]
    },
    {
      "title": "Ürünler",
      "links": [
        {"label": "Tüm Ürünler", "href": "/urunler"},
        {"label": "Karşılaştırma", "href": "/karsilastirma"},
        {"label": "Teklif Talebi", "href": "/toplu-satis"}
      ]
    },
    {
      "title": "İletişim",
      "links": [
        {"label": "Fatih Mah. Isparta Yolu", "href": "/iletisim"},
        {"label": "Aksu / Antalya", "href": "/iletisim"},
        {"label": "info@vistaseed.com.tr", "href": "mailto:info@vistaseed.com.tr"}
      ]
    }
  ]
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

-- =============================================================
-- ABOUT PAGE
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'about_page', 'tr', '{
  "hero": {
    "title": "Hakkımızda",
    "description": "VistaSeed, Antalya Aksu''daki modern sera ve aşı operasyon deneyimini dijital ürün kataloğu, bilgi bankası, teklif ve bayi yönetimiyle birleştiren tarım ekosistemidir."
  },
  "intro": {
    "title": "VistaSeed Ekosistemi",
    "subtitle": "Bereket Fide üretim deneyiminden beslenir",
    "content": "Resmî Bereket Fide kurumsal içeriğinde paylaşılan bilgiye göre üretim yapısı 2006 yılında Aksu Çamköy''de başlamış, bugün 32 bin m² alan üzerinde 24 bin m² modern sera ve 3 bin m² aşı odası kapasitesine ulaşmıştır. VistaSeed bu fiziksel gücü; tohum kataloğu, ürün karşılaştırma, toplu satış ve bayi operasyonu gibi dijital modüllerle daha erişilebilir hale getirir."
  },
  "vision": {
    "title": "Vizyonumuz",
    "content": "Üreticinin doğru çeşidi daha hızlı bulabildiği, teknik bilgiye tek kaynaktan eriştiği ve teklif süreçlerini operasyonel gecikme olmadan yönettiği bir tarım deneyimi kurmak."
  },
  "mission": {
    "title": "Misyonumuz",
    "content": "Sahadan gelen üretim bilgisi ile dijital ürün yönetimini aynı sistemde birleştirerek, tohum ve fide tedarik süreçlerinde daha net, hızlı ve ölçeklenebilir bir altyapı sunmak."
  },
  "values": [
    {
      "title": "Üretim Gerçekliği",
      "description": "Kurumsal anlatımımızı modern sera, aşı odası ve kapasite gibi doğrulanabilen saha verileri üzerine kurarız.",
      "icon": "sprout"
    },
    {
      "title": "Planlı Operasyon",
      "description": "Teklif, sevkiyat ve bayi süreçlerini dağınık içeriklerle değil; aynı veri mantığında yönetilen ekranlarla ilerletiriz.",
      "icon": "shield"
    },
    {
      "title": "Teknik İletişim",
      "description": "Blog, ürün detayları ve karşılaştırma yüzeyi; satış dili kadar teknik karar sürecine de hizmet eder.",
      "icon": "users"
    },
    {
      "title": "Sürekli Gelişim",
      "description": "Üretim altyapısı, güneş enerjisi kullanımı ve iş ortaklığı yapısını dijital tarafa da taşıyan iyileştirme anlayışını benimseriz.",
      "icon": "flask"
    }
  ],
  "stats": [
    {"value": "2006", "label": "Üretim Başlangıcı", "description": "Aksu Çamköy"},
    {"value": "24 bin m²", "label": "Modern Sera", "description": "Normal ve aşılı fide üretimi"},
    {"value": "3 bin m²", "label": "Aşı Odası", "description": "Yüksek hijyen altyapısı"},
    {"value": "800 bin", "label": "Haftalık Aşı", "description": "Resmî sitede paylaşılan kapasite"}
  ],
  "timeline": [
    {"year": "2006", "title": "Aksu Çamköy''de üretim", "description": "Bereket Fide, sera sebzeciliğinde artan hazır fide talebini karşılamak üzere üretime başladı."},
    {"year": "Altyapı", "title": "Bilgisayar kontrollü sera yönetimi", "description": "Sulama, ilaçlama, ısıtma, sıcaklık ve nem yönetimi otomasyon destekli altyapıyla ilerliyor."},
    {"year": "Kapasite", "title": "Aşılı ve standart fide büyüklüğü", "description": "24 bin m² sera, 3 bin m² aşı odası, 16-17 milyon aşılı fide ve 18-20 milyon normal fide kapasitesi."},
    {"year": "2026", "title": "Açık ve görünür kurum", "description": "Kamu kurumları ve uluslararası heyet ziyaretleriyle operasyonel görünürlüğü yüksek bir yapı."}
  ],
  "activities": {
    "title": "Odak Alanları",
    "items": [
      {"title": "Tohum Kataloğu", "description": "VistaSeed ürün modülü ile çeşitleri filtrelenebilir, karşılaştırılabilir ve metadata tabanlı şekilde sunar."},
      {"title": "Fide ve Üretim Desteği", "description": "Bereket Fide''nin normal ve aşılı fide operasyonuna uygun teklif ve bilgi akışlarını dijitalde destekler."},
      {"title": "Toplu Satış ve Bayi Yönetimi", "description": "Kooperatif, kurumsal alım ve bölgesel bayi süreçlerini tek akış içinde toplar."},
      {"title": "Bilgi Bankası", "description": "Toprak hazırlığı, sera modernizasyonu, güneş enerjisi ve yetiştirme ipuçlarını operasyonel içeriğe dönüştürür."}
    ]
  },
  "group_companies": [
    {"name": "Bereket Fide", "role": "Üretim Omurgası", "description": "Antalya Aksu merkezli modern sera ve aşı operasyon deneyimi."},
    {"name": "VistaSeed", "role": "Dijital Katman", "description": "Ürün kataloğu, bilgi bankası, teklif ve bayi modüllerini birleştiren public deneyim."},
    {"name": "Vista Seeds", "role": "İş Ortaklığı", "description": "Bereket Fide resmî ana sayfasındaki iş birliği yapan markalar arasında yer alan tohum odaklı partner."}
  ]
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);
