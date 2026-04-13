-- 162_production_content_fix.sql
-- Production-level copy fix: about_page JSON alanlarında kalan stale ifadelerin
-- düzeltilmesi. Homepage düzeltmeleri artık kaynak seed 147'de yapıldı.

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
