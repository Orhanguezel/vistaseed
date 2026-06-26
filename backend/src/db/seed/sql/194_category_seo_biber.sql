-- =============================================================
-- Biber kategori SEO landing icerigi (customPages, slug: kategori-biber-cesitleri)
-- Kaynak: VISTASEEDS-BIBER-KATEGORI-ICERIK-2026-06-26.md
-- Ortak categories semasini DEGISTIRMEZ; icerik customPages uzerinden servis edilir.
-- Idempotent (ON DUPLICATE KEY UPDATE) — canli apply guvenli.
-- =============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `custom_pages` (`id`, `module_key`, `is_published`, `display_order`)
VALUES
  ('cccccccc-cccc-4ccc-8ccc-cccategorybi1', 'kategori-seo', 1, 50)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `display_order` = VALUES(`display_order`);

INSERT INTO `custom_pages_i18n`
  (`page_id`, `locale`, `title`, `slug`, `content`, `summary`, `meta_title`, `meta_description`)
VALUES
  (
    'cccccccc-cccc-4ccc-8ccc-cccategorybi1',
    'tr',
    'Biber Tohumu Cesitleri',
    'kategori-biber-cesitleri',
    '{"html":"<p>Vista Seeds biber tohumu portfoyu; kapya, carliston, aci kil, dolma, kil ve kahvaltilik ucburun olmak uzere profesyonel ureticinin ihtiyac duydugu ana biber gruplarini kapsar. Tum cesitlerimiz <strong>F1 hibrit</strong> yapidadir; bu da tarlada tekduze meyve boyu, guclu bitki gelisimi ve yuksek ticari verim anlamina gelir. Sera ve acik tarla yetistiriciligine uygun cesitlerimiz, farkli iklim bolgelerinde guvenilir performans verecek sekilde secilmistir.</p><p>Biber, Turkiye sebze uretiminin temel kalemlerinden biridir ve dogru tohum secimi sezonun tamamini belirler. Cesit secerken yalnizca meyve tipine degil; hastalik toleransina, soguk performansina, erkencilik durumuna ve hedef pazara da bakmak gerekir.</p><h2>Kapya Biber Tohumu</h2><p>Kapya biber, kirmizi renkli, etli ve tatli yapisiyla hem taze tuketimde hem de salca ve kozleme sanayisinde aranan bir gruptur. <strong>CANKAN F1 Kapya</strong>, 18-20 cm meyve boyu, puruzsuz ve koyu kirmizi meyveleriyle dikkat ceker. TSWV (domates lekeli solgunluk virusu) toleransi, yuksek adaptasyon yetenegi ve yuzde 100 tatli lezzeti sayesinde farkli iklim kosullarinda istikrarli ticari sonuc verir. Sera ve acik tarla uretiminin her ikisine de uygundur.</p><h2>Carliston Biber Tohumu</h2><p>Carliston, ince-uzun, acik yesil ve tatli yapisiyla en yaygin taze tuketim biberlerindendir. <strong>LUCKY F1 Carliston</strong>, 21-23 cm meyve boyu ve yuzde 100 tatli yapisiyla one cikar. TSWV ve Tm: 0-2 toleransinin yani sira yuksek soguk performansi, erken ve gec sezonda dahi guvenli uretim imkani saglar.</p><h2>Aci Kil Biber Tohumu</h2><p>Acilik orani yuksek pazarlar icin <strong>KIZGIN F1 Aci Kil</strong> biber, 23-25 cm meyve boyu ve guclu bitki yapisiyla sera ve acik tarla uretimine uygundur. Ideal yesil rengi, puruzsuz duz sekli ve yuksek acilik orani ile ticari uretimde tekduze ve guvenilir sonuc verir.</p><h2>Kahvaltilik ve Ucburun Biber Tohumu</h2><p>Kahvaltilik biber grubunda <strong>BIRLIK F1 Ucburun</strong>, 16-18 cm meyve boyu, ince kabuklu ve parlak yesil meyveleriyle yuksek pazar degeri sunar. TSWV ve Tm: 0-2 toleransi, yuksek soguk performansi ve erkenci yapisi sayesinde uretim risklerini azaltirken erken hasatla kazanci destekler.</p><h2>Dolma ve Kil Biber Tohumu</h2><p>Dolmalik biber, kalin kabugu ve duzgun geometrisiyle hem taze tuketimde hem de islemeye uygundur; sera ve acik tarla uretiminde tercih edilir. Kil biber grubu ise tatli yapisi ve soguk performansiyla erken/gec donem uretimine esneklik katar.</p><h2>F1 Hibrit Biber Tohumu Neden Onemli?</h2><p>F1 hibrit tohumlar, iki saf hattin kontrollu melezlenmesiyle elde edilir ve ilk nesilde melez gucu (heterosis) gosterir: daha tekduze meyve, daha guclu bitki ve genellikle daha yuksek verim. Vista Seeds biber cesitlerinde one cikan TSWV toleransi, virus baskisinin yuksek oldugu bolgelerde uretim guvenligini artiran en onemli ozelliklerden biridir.</p><h2>Biber Ekim Zamani ve Bolge</h2><p>Biber sicak iklim sebzesidir. Fide uretimi genellikle ilkbahar oncesi seralarda baslatilir; toprak sicakligi yeterince yukseldiginde tarlaya sasirtilir. Sera uretiminde sezon cok daha genistir ve soguk performansi yuksek cesitler (LUCKY F1, BIRLIK F1) erken/gec donemde avantaj saglar. Bolge, sezon ve ortu tipi secimi dogrudan cesit tercihini etkiler.</p><h2>Sik Sorulan Sorular</h2><h3>Biber tohumu ne zaman ekilir?</h3><p>Biber sicak iklim sebzesidir; fide uretimi genellikle ilkbahar oncesi seralarda baslatilir, toprak ve hava yeterince isindiginda tarlaya sasirtilir. Sera uretiminde sezon daha genistir ve soguk performansi yuksek F1 cesitlerle erken/gec donem uretim mumkundur.</p><h3>F1 hibrit biber tohumu ile ata tohum arasindaki fark nedir?</h3><p>F1 hibrit tohum, iki saf hattin melezlenmesiyle elde edilir ve ilk nesilde tekduze meyve, guclu bitki ve yuksek verim saglar. Hibritte hasat tekduzeligi ve hastalik toleransi (ornegin TSWV) genellikle daha yuksektir.</p><h3>TSWV toleransi ne ise yarar?</h3><p>TSWV (domates lekeli solgunluk virusu), biberde onemli verim kayiplarina yol acar. Vista Seeds biber cesitlerinin TSWV toleransi, virus baskisinin yuksek oldugu bolgelerde bitki sagligini koruyarak uretim riskini azaltir.</p><h3>Hangi biber cesidi sera, hangisi acik tarla icin uygundur?</h3><p>Cesitlerimizin cogu (CANKAN F1 Kapya, KIZGIN F1 Aci Kil) hem sera hem acik tarlaya uygundur. Soguk performansi yuksek cesitler (LUCKY F1 Carliston, BIRLIK F1 Ucburun) ozellikle sera ve erken/gec donem uretiminde avantaj saglar.</p><h3>Vista Seeds biber tohumunu nasil satin alabilirim?</h3><p>Vista Seeds tohumlari teklif ve toptan satis modeliyle sunulur. Urun detay sayfasindan cesidi inceleyip teklif/siparis talebi olusturabilir veya satis ekibimizle iletisime gecebilirsiniz.</p>"}',
    'F1 hibrit biber tohumu cesitleri: kapya, carliston, aci kil, dolma ve kahvaltilik. TSWV toleransli, sera ve acik tarlaya uygun profesyonel tohumlar.',
    'Biber Tohumu Cesitleri | F1 Hibrit Kapya, Carliston, Aci | Vista Seeds',
    'F1 hibrit biber tohumu cesitleri: kapya, carliston, aci kil, dolma ve kahvaltilik. TSWV toleransli, sera ve acik tarlaya uygun profesyonel tohumlar. Vista Seeds.'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `content` = VALUES(`content`),
  `summary` = VALUES(`summary`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);
