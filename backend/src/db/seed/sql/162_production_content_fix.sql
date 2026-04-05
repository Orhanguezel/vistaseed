-- 162_production_content_fix.sql
-- Production-level copy fix: "kaynak", "katman", "yüzey", "taşındı" vb.
-- ifadeler kaldırıldı; tüm metinler ürün sayfasına uygun üretime hazır hale getirildi.
-- Direkt çalıştırma: mysql -h 127.0.0.1 -P 3306 -u app -papp vistaseed < 162_production_content_fix.sql

-- ── HOMEPAGE FEATURE PANELS ──────────────────────────────────────────────────
UPDATE `site_settings`
SET `value` = JSON_SET(
  `value`,
  '$.title',    'Üretimden Markaya',
  '$.subtitle', 'Vista Seeds\'in tohum kalitesi, sürdürülebilir tarım anlayışı ve kurumsal değerlerini yansıtan seçilmiş görseller.'
)
WHERE `key` = 'homepage_feature_panels' AND `locale` = 'tr';

-- ── HOMEPAGE SECTIONS (values + seasonal_picks_description) ──────────────────
UPDATE `site_settings`
SET `value` = JSON_SET(
  `value`,
  -- values[0]: "Tescilli ve Güvenilir Çeşitler" — "kaynak sitede" ifadesi kaldırıldı
  '$.values[0].description',
  'Yüksek kaliteli, tescilli ve güvenilir çeşit portföyü; ürün sayfalarında filtrelenebilir ve karşılaştırılabilir biçimde sunulur.',
  -- values[2]: "Güçlü Kurumsal Altyapı" — "görünür kılınır" yerine düz ifade
  '$.values[2].description',
  'Tarım, enerji ve mühendislik yatırımlarıyla desteklenen çok yönlü kurumsal yapı.',
  -- values[3]: "Tarımda Sürekli Gelişim" — "operasyon yüzeylerine taşınır" kaldırıldı
  '$.values[3].description',
  'İnovasyon, kalite ve sürdürülebilirlik odaklı büyüme; araştırma ve geliştirme süreçleriyle desteklenir.',
  -- values[4]: "Sürdürülebilir Gelecek Vizyonu" — "kurumsal anlatının kalıcı unsuru" kaldırıldı
  '$.values[4].description',
  'Yenilenebilir enerji ve çevreci üretim anlayışı, tohum üretimi ve çeşit geliştirmede yönlendirici ilkedir.',
  -- seasonal_picks_description — "resmî ana sayfa anlatısındaki" kaldırıldı
  '$.seasonal_picks_description',
  'Mevsime uygun, yüksek verimli ve sertifikalı çeşitlerden özenle seçilmiş ürünler.'
)
WHERE `key` = 'homepage_sections' AND `locale` = 'tr';

-- ── ABOUT PAGE ───────────────────────────────────────────────────────────────
UPDATE `site_settings`
SET `value` = JSON_SET(
  `value`,
  -- intro.subtitle: "kaynak içerik doğrudan alınmıştır" → kurumsal açıklama
  '$.intro.subtitle',
  'Tarım, enerji ve mühendislik yatırımlarını bir arada yürüten çok yönlü yapı.',
  -- values[0]: "Yüksek Genetik Potansiyel" — "kaynak sitede vurgulanan" kaldırıldı
  '$.values[0].description',
  'Tescilli, dayanıklı ve yüksek verimli çeşitler; üreticinin ihtiyacına göre filtrelenebilir ürün kataloğuyla sunulur.',
  -- values[1]: "Sürdürülebilir Üretim" — "içerik, teklif ve saha akışlarına yansıtır" kaldırıldı
  '$.values[1].description',
  'Bereket Fide ve yenilenebilir enerji yatırımlarıyla desteklenen çevreye duyarlı üretim anlayışı.',
  -- values[3]: "Dijital Erişilebilirlik" — "etkileşimli ekranlarla sunar" düzeltildi
  '$.values[3].description',
  'Referanslar, bilgi bankası ve bayi ağı; dijital araçlarla erişilebilir ve şeffaf biçimde sunulur.',
  -- stats[0]: "kaynak zaman çizgisi" → kurumsal açıklama
  '$.stats[0].description', 'Kuruluş hikayesinin başlangıç yılı',
  -- stats[2]: "ana sayfa kaynağı" → gerçek açıklama
  '$.stats[2].description', 'Tarım, AR-GE ve saha uzmanları',
  -- stats[3]: "ana sayfa kaynağı" → gerçek açıklama
  '$.stats[3].description', 'Türkiye genelinde aktif saha personeli',
  -- timeline[0]: "ana sayfadaki stratejik adımlar" kaldırıldı
  '$.timeline[0].description', 'Tarımsal girişimin ilk kurumsal adımı.',
  -- activities.title: "Ekosistem Modülleri" → "Faaliyet Alanları"
  '$.activities.title', 'Faaliyet Alanları',
  -- activities.items[1].title: "Referans ve Proje Yüzeyi" → anlaşılır başlık
  '$.activities.items[1].title', 'Referanslar ve Proje Galerisi',
  -- activities.items[1].description: "yerel storage destekli medya akışıyla" kaldırıldı
  '$.activities.items[1].description', 'Grup şirketleri ve proje galerilerini zengin medya içeriğiyle sunar.',
  -- activities.items[2].description: "karar destek yüzeyi haline getirir" → düz ifade
  '$.activities.items[2].description', 'Teknik içerik, ekim rehberi ve editoryal materyalleri üreticilere ulaştırır.'
)
WHERE `key` = 'about_page' AND `locale` = 'tr';
