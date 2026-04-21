# Hava Durumu Widget Güncellemesi

Vista Seeds platformundaki hava durumu widget'ının artık kullanıcının tarayıcı konumuna (Geolocation) göre otomatik olarak yerel hava durumunu göstermesi gerekmektedir.

## Yapılan Geliştirme
Tarımİklim (Weather API) tarafında yapılan son güncelleme ile artık widget'lar koordinat bazlı çalışabilmektedir.

## Uygulama
- Widget iframe URL'sinde `location=auto` parametresi kullanılmalıdır (veya parametre boş bırakılmalıdır).
- Bu sayede siteye giren her kullanıcı, bulunduğu bölgenin anlık hava durumu ve don riskini görecektir.
- Manuel bir şehir gösterilmek istenirse `location=mersin` gibi slug parametresi gönderilmeye devam edilebilir.

## Önemli
Tarayıcı konum erişimi için kullanıcının onay vermesi gerekmektedir. Onay verilmediği durumlarda sistem güvenli bir varsayılan konuma (Antalya) geri döner.
