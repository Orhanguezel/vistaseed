-- =============================================================
-- Legacy seed TR normalizasyonu
-- Eski seed dosyalarındaki Türkçe karakter ve içerik düzeltmelerini
-- mevcut yerel veritabanına yansıtır.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`) VALUES
(UUID(), 'site__seo_pages', 'tr',
'{
  "home":{"title":"{{SITE_NAME}}","description":"{{SITE_NAME}} kurumsal web sitesi.","keywords":"kurumsal, ürünler, hizmetler","robots":"index, follow","noIndex":false},
  "urunler":{"title":"Ürünler | {{SITE_NAME}}","description":"Ürün kataloğumuzu inceleyin.","keywords":"ürünler, katalog","robots":"index, follow","noIndex":false},
  "hakkimizda":{"title":"Hakkımızda | {{SITE_NAME}}","description":"{{SITE_NAME}} hakkında bilgi edinin.","keywords":"hakkımızda, kurumsal","robots":"index, follow","noIndex":false},
  "iletisim":{"title":"İletişim | {{SITE_NAME}}","description":"{{SITE_NAME}} ile iletişime geçin.","keywords":"iletişim","robots":"index, follow","noIndex":false},
  "sss":{"title":"S.S.S. | {{SITE_NAME}}","description":"Sıkça sorulan sorular.","keywords":"sss","robots":"index, follow","noIndex":false},
  "giris":{"title":"Giriş Yap | {{SITE_NAME}}","description":"Hesabınıza giriş yapın.","keywords":"","robots":"noindex, follow","noIndex":true},
  "uye-ol":{"title":"Üye Ol | {{SITE_NAME}}","description":"{{SITE_NAME}} üyesi olun.","keywords":"","robots":"noindex, follow","noIndex":true}
}'),
(UUID(), 'site_meta_default', 'tr',
'{"title":"{{SITE_NAME}}","description":"{{SITE_NAME}} kurumsal web sitesi.","keywords":"kurumsal, ürünler, hizmetler"}'),
(UUID(), 'homepage_hero', '*',
'{"title":"{{SITE_NAME}}","subtitle":"Profesyonel hizmet ve kaliteli ürünler.","bgImage":"/uploads/media/hero/hero-bg.jpg","bgImageDark":"/uploads/media/hero/hero-bg-dark.jpg","bgOverlayOpacity":0.6,"ctaLabel":"ÜRÜNLER","ctaPath":"/urunler","ctaSecondaryLabel":"İLETİŞİM","ctaSecondaryPath":"/iletisim"}'),
(UUID(), 'homepage_hero', 'tr',
'{
  "season":"spring",
  "title":"Tohumun Bereketi",
  "highlight":"Toprakla",
  "suffix":"Başlar",
  "description":"Vista Seeds, yüksek verimli ve güvenilir tohum çeşitleriyle tarımda sürdürülebilir başarı sunar.",
  "badge":"2026 Bahar Sezonu",
  "image_url":"/assets/hero/spring-field.jpg",
  "cta_label":"Ürünleri Keşfet",
  "cta_href":"/urunler",
  "secondary_label":"Ekim Rehberi",
  "secondary_href":"/sss"
}'),
(UUID(), 'trust_badges', 'tr',
'[
  {"icon":"shield-check","label":"Sertifikalı Tohum","description":"TUAB onaylı, tescilli çeşitler"},
  {"icon":"leaf","label":"Sürdürülebilir Üretim","description":"Çevre dostu tarım pratikleri"},
  {"icon":"flask-conical","label":"AR-GE Odaklı","description":"Kendi seleksiyonlarımız ve hibrit çeşitler"},
  {"icon":"sprout","label":"%95+ Çimlendirme","description":"Laboratuvar testli kalite garantisi"}
]'),
(UUID(), 'homepage_sections', 'tr',
'{
  "stats":[
    {"value":"137K+","label":"Müşteri"},
    {"value":"8+","label":"Çeşit"},
    {"value":"35+","label":"Yıllık Deneyim"},
    {"value":"%95","label":"Çimlendirme Oranı"}
  ],
  "values":[
    {"icon":"sun","title":"Yüksek Verim","description":"Vista Seeds, modern üretim teknikleriyle geliştirilen yüksek verimli tohumlar sunar."},
    {"icon":"shield","title":"Kalite ve Güven","description":"Tüm tohumlarımız kalite kontrol süreçlerinden geçirilir. Çiftçilerimizin güvenle ekebileceği, sağlıklı ve dayanıklı tohumlar üretiriz."},
    {"icon":"users","title":"Bölgesel Uyum","description":"Farklı iklim ve toprak koşullarına uygun çeşitler sayesinde her bölgede başarılı üretim imkanı sağlar."},
    {"icon":"beaker","title":"AR-GE ve İnovasyon","description":"Kendi araştırma tesislerimizde sürekli yeni çeşitler geliştirme, hibrit ıslah programları ve iyileştirme çalışmaları."}
  ],
  "timeline":[
    {"year":"1988","title":"Kuruluş","description":"Atakan Tohum olarak faaliyetlere başlandı."},
    {"year":"1995","title":"İlk Hibrit","description":"İlk F1 hibrit biber çeşidi geliştirildi."},
    {"year":"2005","title":"İhracat","description":"Uluslararası pazarlara açılış."},
    {"year":"2015","title":"AR-GE Merkezi","description":"Modern araştırma tesisi faaliyete geçti."},
    {"year":"2020","title":"Vista Seeds","description":"Yeni marka ve genişletilmiş ürün yelpazesi."},
    {"year":"2025","title":"Dijital Dönüşüm","description":"Teknoloji ile entegre çiftçi destek sistemi."}
  ],
  "seasonal_picks_title":"Bu Mevsim Önerilerimiz",
  "seasonal_picks_description":"Bahar ekimi için en uygun çeşitlerimizi inceleyin."
}'),
(UUID(), 'planting_guide', 'tr',
'{
  "title":"Ekim Rehberi",
  "description":"Mevsime göre ekim önerileri ve bakım ipuçları.",
  "seasons":[
    {
      "key":"spring",
      "label":"İlkbahar",
      "months":"Mart — Mayıs",
      "tips":["Toprak sıcaklığı en az 15°C olmalı","Fide hazırlığı Şubat sonunda başlatılmalı","İlk sulama hafif ve düzgün yapılmalı"],
      "recommended_tags":["bahar","fide"]
    },
    {
      "key":"summer",
      "label":"Yaz",
      "months":"Haziran — Ağustos",
      "tips":["Sıcak stresine karşı gölgeleme yapılmalı","Damla sulama ile verimlilik artırılmalı","Hasat zamanlarına dikkat edilmeli"],
      "recommended_tags":["yaz","sicaga-dayanikli"]
    },
    {
      "key":"autumn",
      "label":"Sonbahar",
      "months":"Eylül — Kasım",
      "tips":["Kış sebzeleri için ideal ekim dönemi","Toprak hazırlığı ve gübrelemesi kritik","Don riskine karşı önlem alınmalı"],
      "recommended_tags":["sonbahar","kis-sebzesi"]
    }
  ]
}'),
(UUID(), 'newsletter_config', 'tr',
'{"title":"Güncel Kalın","description":"Yeni çeşitler, ekim takvimleri ve özel kampanyalar için bültenimize abone olun.","button_label":"Abone Ol","placeholder":"E-posta adresinizi girin"}'),
(UUID(), 'footer_config', 'tr',
'{
  "help_title":"Size yardımcı olmaktan mutluluk duyarız",
  "help_description":"Sıkça sorulan sorularımıza göz atın veya bizimle iletişime geçin.",
  "follow_title":"Bizi Takip Edin",
  "columns":[
    {"title":"Kurumsal","links":[{"label":"Hakkımızda","href":"/hakkimizda"},{"label":"Tarihçe","href":"/hakkimizda#tarihce"},{"label":"Kariyer","href":"/insan-kaynaklari"},{"label":"İletişim","href":"/iletisim"}]},
    {"title":"Destek","links":[{"label":"S.S.S.","href":"/sss"},{"label":"Ekim Rehberi","href":"/sss"},{"label":"İletişim Formu","href":"/iletisim"}]},
    {"title":"Yasal","links":[{"label":"Gizlilik Politikası","href":"/gizlilik-politikasi"},{"label":"Kullanım Koşulları","href":"/kullanim-kosullari"},{"label":"KVKK","href":"/kvkk"}]},
    {"title":"Ürünler","links":[{"label":"Tüm Ürünler","href":"/urunler"},{"label":"Biber Çeşitleri","href":"/urunler?category=biber"},{"label":"Anaç Çeşitleri","href":"/urunler?category=anac"}]}
  ]
}'),
(UUID(), 'about_page', 'tr',
'{
  "hero":{"title":"Hakkımızda","description":"Tarımın geleceğini şekillendirmek amacıyla, köklü bir geçmişe sahip Atakan Tohum bünyesinde kurulan Vista Seeds, yüksek kaliteli ve yüksek verimli tohum çeşitleri geliştiren öncü bir markadır."},
  "intro":{"title":"Vista Seeds","subtitle":"Atakan Tohum İnşaat Mühendislik","content":"Vista Seeds, Atakan Tohum İnşaat Mühendislik şirketi bünyesinde kurulmuş bir tohum markasıdır. İnovasyon, kalite ve sürdürülebilirlik ilkeleriyle, doğaya saygılı bir üretim modeli benimsemekteyiz. Modern ıslah teknikleri ve Ar-Ge çalışmalarıyla hastalıklara dayanıklı, adaptasyon kabiliyeti yüksek hibrit tohumlar sunmaktayız."},
  "vision":{"title":"Vizyonumuz","content":"Yüksek genetik potansiyele sahip, tescilli ve dayanıklı tohum çeşitlerimizle üreticilerin verimliliğini maksimum seviyeye çıkarmak. Tarımsal üretimin her aşamasında güvenilir bir çözüm ortağı olmak."},
  "mission":{"title":"Misyonumuz","content":"Tarımda teknoloji ve doğayı buluşturan inovatif çözümlerle, global standartlarda bir marka haline gelmek. Yenilenebilir enerji ve modern mühendislik projelerine entegre büyüme gerçekleştirmek."},
  "values":[
    {"title":"Yüksek Verimli Tohumlar","description":"Modern ıslah teknikleriyle geliştirilen, yüksek genetik potansiyele sahip sertifikalı tohum çeşitleri.","icon":"sprout"},
    {"title":"Kalite ve Güven","description":"Her parti laboratuvar testlerinden geçirilen, çimlendirme oranı garanti edilen tohumlar. TUAB onaylı, tescilli çeşitler.","icon":"shield"},
    {"title":"Üretici Odaklılık","description":"Türkiye iklim koşullarına uygun, saha testlerinden geçmiş, çiftçinin ihtiyacını anlayan çözümler.","icon":"users"},
    {"title":"Araştırma ve Geliştirme","description":"Kendi araştırma tesislerimizde sürekli yeni çeşitler geliştirme, hibrit ıslah programları ve iyileştirme çalışmaları.","icon":"flask"}
  ],
  "stats":[
    {"value":"100+","label":"Uzman Kadro","description":"Ar-Ge ve kalite kontrol"},
    {"value":"250+","label":"Personel","description":"Üretim ve operasyon"},
    {"value":"137K+","label":"Müşteri","description":"Türkiye genelinde"},
    {"value":"8+","label":"Tohum Çeşidi","description":"Hibrit ve anaç"}
  ],
  "timeline":[
    {"year":"1988","title":"Tarım Sektörüne İlk Adım","description":"Aile olarak tarım sektörüne giriş, ilk tohum ticaret faaliyetleri."},
    {"year":"1990","title":"Şahin Ziraat Kuruluşu","description":"Organizasyonel yapı ile sektörde profesyonel faaliyet başlangıcı."},
    {"year":"2006","title":"Bereket Fide Kuruluşu","description":"Üretim zinciri desteği için fide üretim tesisi kuruldu."},
    {"year":"2017","title":"İnşaat Sektörüne Giriş","description":"Vista Lagoon ve Vista Prestige konut projeleri ile gayrimenkul yatırımları."},
    {"year":"2018","title":"Tolkan Mimarlık","description":"Grup bünyesinde mimarlık ve mühendislik firması kuruldu."},
    {"year":"2025","title":"Atakan Tohum ve Vista Seeds","description":"Modern marka kimliği ile tohum ıslahı ve üretiminde yeni dönem. Vista Seeds markası tescil edildi."}
  ],
  "activities":{"title":"Faaliyet Alanları","items":[
    {"title":"Tohum Islahı ve Üretimi","description":"Hibrit biber, anaç ve diğer sebze tohumlarının ıslahı, üretimi ve pazarlaması."},
    {"title":"Yenilenebilir Enerji","description":"Güneş enerjisi santralları işletimi ile sürdürülebilir enerji üretimi."},
    {"title":"İnşaat ve Gayrimenkul","description":"Vista Lagoon, Vista Prestige konut projeleri ve kentsel dönüşüm yatırımları."},
    {"title":"Fide Üretimi","description":"Bereket Fide markası ile profesyonel fide üretim tesisleri ve çiftçiye destek."}
  ]},
  "group_companies":[
    {"name":"Atakan Tohum İnşaat Mühendislik","role":"Ana şirket","description":"Grubun kurumsal çatısı ve yönetim merkezi."},
    {"name":"Vista Seeds","role":"Tohum markası","description":"Hibrit tohum ıslahı, üretim ve pazarlama."},
    {"name":"Bereket Fide","role":"Fide üretimi","description":"Profesyonel fide üretim tesisleri."},
    {"name":"Tolkan Mimarlık","role":"Mimarlık","description":"İnşaat ve mimarlık projeleri."}
  ]
}')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW(3);

UPDATE `contact_messages`
SET
  `name` = 'Ahmet Yılmaz',
  `subject` = 'Ürünler hakkında bilgi',
  `message` = 'Merhaba, ürün kataloğunuz hakkında detaylı bilgi almak istiyorum.'
WHERE `email` = 'ahmet@example.com';

UPDATE `contact_messages`
SET
  `name` = 'Ayşe Demir',
  `subject` = 'İşbirliği teklifi',
  `message` = 'Firmanızla işbirliği yapmak istiyoruz. Detayları görüşmek için bir toplantı ayarlayabilir miyiz?',
  `admin_note` = 'Müşteri ile iletişime geçildi.'
WHERE `email` = 'ayse@example.com';

UPDATE `contact_messages`
SET
  `message` = 'Web sitenizde bir sorun yaşıyorum. Yardımcı olabilir misiniz?',
  `admin_note` = 'Sorun giderildi, bildirim gönderildi.'
WHERE `email` = 'mehmet@example.com';

UPDATE `profiles`
SET `country` = 'Türkiye'
WHERE `country` = 'Turkiye';
