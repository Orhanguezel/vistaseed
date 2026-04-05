-- Vista Seeds homepage FAQ refresh from official source
-- Source: https://www.vistaseeds.com.tr/
SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO `support_faqs_i18n` (`faq_id`, `locale`, `question`, `answer`)
VALUES
  (
    '66666666-6666-4666-8666-666666666661',
    'tr',
    'Sebze tohumları ne kadar süre saklanabilir?',
    'Sebze tohumları uygun koşullarda, tohum paketi açılmadan saklandığında genellikle 1-2 yıl arasında çimlenme özelliğini korur. Serin, kuru ve güneş görmeyen bir ortamda saklanması önerilir. Tohum paketi açıldığında kullanılmalıdır.'
  ),
  (
    '66666666-6666-4666-8666-666666666662',
    'tr',
    'Yeni ekilen tohumu ne sıklıkla sulamalıyım?',
    'Çimlenme gerçekleşene kadar toprak yüzeyi her zaman nemli kalmalıdır. Toprağın tamamen kurumasına izin vermeyin. Ancak çamur olacak kadar aşırı su vermekten kaçının; bu durum tohumun çürümesine neden olabilir. Bir sprey yardımıyla toprağı nemlendirmek en güvenli yöntemdir.'
  ),
  (
    '66666666-6666-4666-8666-666666666663',
    'tr',
    'Tohumlar çimlendikten sonra ne yapmalıyım?',
    'Filizler toprak yüzeyinde görünmeye başladığında gün ışığı ihtiyacı artar. Kapalı alanda çimlendirme yaptıysanız fideleri ışık alan bir yere taşıyın. Fideler 3-4 yapraklı boya ulaştığında, aralarında mesafe bırakmak için gerekirse seyreltme yapabilir veya daha geniş saksılara ya da bahçeye aktarabilirsiniz.'
  ),
  (
    '66666666-6666-4666-8666-666666666664',
    'tr',
    'Tohumların çimlenme oranı nedir?',
    'Satışa sunulan tohumlar ultra yüksek çimlenme oranına sahiptir. Çoğu sebze tohumu için çimlenme oranı %95-99 aralığında değişmektedir.'
  ),
  (
    '66666666-6666-4666-8666-666666666665',
    'tr',
    'Tohumları ne zaman ekmeliyim?',
    'Her sebze türünün ve çeşidinin ekim zamanı farklıdır. Ürün sayfalarında yer alan ekim takvimine göre veya bizimle iletişime geçerek ürününüz için en doğru dönemi öğrenebilirsiniz.'
  ),
  (
    '66666666-6666-4666-8666-666666666661',
    'en',
    'How long can vegetable seeds be stored?',
    'Vegetable seeds generally retain germination performance for 1 to 2 years when stored unopened under suitable conditions. They should be kept in a cool, dry place away from direct sunlight. Once the package is opened, the seeds should be used.'
  ),
  (
    '66666666-6666-4666-8666-666666666662',
    'en',
    'How often should I water newly sown seeds?',
    'Until germination happens, the soil surface should remain consistently moist. Do not let the soil dry out completely. At the same time, avoid adding so much water that it turns muddy, because this can cause the seed to rot. Moistening the soil with a spray bottle is usually the safest method.'
  ),
  (
    '66666666-6666-4666-8666-666666666663',
    'en',
    'What should I do after the seeds germinate?',
    'Once sprouts appear above the soil, their need for light increases. If you started germination indoors, move the seedlings to a brighter place. When seedlings reach the stage of 3 to 4 leaves, you can thin them if needed or transfer them into larger pots or into the garden.'
  ),
  (
    '66666666-6666-4666-8666-666666666664',
    'en',
    'What is the germination rate of the seeds?',
    'The seeds offered for sale have an ultra-high germination rate. For most vegetable seeds, germination typically ranges between 95% and 99%.'
  ),
  (
    '66666666-6666-4666-8666-666666666665',
    'en',
    'When should I sow the seeds?',
    'Each vegetable species and variety has its own sowing period. You can follow the planting calendar on the product pages or contact us to identify the most suitable sowing window for your product.'
  ),
  (
    '66666666-6666-4666-8666-666666666661',
    'de',
    'Wie lange können Gemüsesamen gelagert werden?',
    'Gemüsesamen behalten ihre Keimfähigkeit in der Regel 1 bis 2 Jahre, wenn sie ungeöffnet und unter geeigneten Bedingungen gelagert werden. Empfohlen wird ein kühler, trockener und lichtgeschützter Ort. Nach dem Öffnen der Verpackung sollten die Samen zeitnah verwendet werden.'
  ),
  (
    '66666666-6666-4666-8666-666666666662',
    'de',
    'Wie oft sollte ich frisch ausgesäte Samen gießen?',
    'Bis zur Keimung sollte die Bodenoberfläche stets leicht feucht bleiben. Der Boden darf nicht vollständig austrocknen. Gleichzeitig sollte nicht so viel Wasser gegeben werden, dass Schlamm entsteht, da dies zum Verfaulen der Samen führen kann. Das Befeuchten mit einer Sprühflasche ist meist die sicherste Methode.'
  ),
  (
    '66666666-6666-4666-8666-666666666663',
    'de',
    'Was sollte ich tun, nachdem die Samen gekeimt sind?',
    'Sobald die Keimlinge an die Oberfläche kommen, steigt ihr Lichtbedarf. Wenn die Keimung in Innenräumen erfolgt ist, sollten die Jungpflanzen an einen helleren Ort gebracht werden. Wenn die Pflanzen 3 bis 4 Blätter entwickelt haben, können sie ausgedünnt oder in größere Töpfe beziehungsweise ins Freiland umgesetzt werden.'
  ),
  (
    '66666666-6666-4666-8666-666666666664',
    'de',
    'Wie hoch ist die Keimrate der Samen?',
    'Die angebotenen Samen verfügen über eine sehr hohe Keimrate. Bei den meisten Gemüsesamen liegt sie typischerweise zwischen 95 % und 99 %.'
  ),
  (
    '66666666-6666-4666-8666-666666666665',
    'de',
    'Wann sollte ich die Samen aussäen?',
    'Jede Gemüseart und jede Sorte hat ihren eigenen Aussaatzeitraum. Sie können sich am Aussaatkalender auf den Produktseiten orientieren oder uns kontaktieren, um den passendsten Zeitraum für Ihr Produkt zu bestimmen.'
  )
ON DUPLICATE KEY UPDATE
  `question` = VALUES(`question`),
  `answer` = VALUES(`answer`);
