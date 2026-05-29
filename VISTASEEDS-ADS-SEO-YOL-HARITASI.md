# VistaSeeds Ads + SEO Yol Haritasi

Bu dokuman, Bereket Fide icin yapilan Google Ads, donusum izleme, Search Console ve teknik SEO kontrollerinin VistaSeeds icin ayni disiplinle uygulanmasi icin hazirlandi.

## 1. Amac

VistaSeeds kampanyasi Bereket Fide kampanyasindan ayrilacak.

- Bereket Fide odagi: fide, sebze fidesi, asili fide, fide uretimi
- VistaSeeds odagi: tohum, sebze tohumu, biber tohumu, domates tohumu, hibrit tohum

Iki marka ayni Google Ads hesabinda yonetilebilir, fakat kampanyalar, donusumler, anahtar kelimeler ve negatif kelimeler birbirine karistirilmamalidir.

## 2. Repo ve Canli Site Kontrolu

VistaSeeds reposuna gecince once teknik durum kontrol edilecek.

- Canli domain ve canonical URL dogru mu?
- `robots.txt` dogru mu?
- `sitemap.xml` var mi ve temel sayfalari iceriyor mu?
- Onemli sayfalarda `noindex` var mi?
- Eski URL'ler dogru 301 yonlendiriliyor mu?
- PDF ve upload dosyalari gereksiz sekilde indexleniyor mu?
- Search Console'da hangi URL'ler indexlenmemis veya hata veriyor?

Kontrol edilecek temel URL'ler:

```text
/
/tr
/tr/teklif
/tr/iletisim
/tr/urunler
/tr/hakkimizda
/sitemap.xml
/robots.txt
```

## 3. Donusum Altyapisi

VistaSeeds sitesinde teklif veya iletisim formu bulunacak ve form basarili gonderildiginde Google Ads donusumu tetiklenecek.

Kontrol listesi:

- Teklif formu hangi URL'de?
- Iletisim formu hangi URL'de?
- Form hangi API endpoint'ine gonderiliyor?
- Basarili form gonderiminden sonra Google Ads conversion event calisiyor mu?
- GA4, GTM veya Google Ads etiketi sitede yuklu mu?
- Canli `.env` dosyalarinda Ads ID ve conversion label var mi?

Onerilen donusum adi:

```text
VistaSeeds - Tohum Teklif Formu
```

Onerilen donusum kategorisi:

```text
Potansiyel musteri formu gonderimi
```

Olası hedef URL:

```text
https://www.vistaseeds.com.tr/tr/teklif
```

Repo incelendikten sonra gercek URL kesinlestirilecek.

## 4. Google Ads Kampanya Yapisi

Mevcut duraklatilmis tohum kampanyasi silinmemeli. VistaSeeds icin kullanilabilir.

Onerilen kampanya adi:

```text
VistaSeeds - Sebze Tohumu Teklifleri
```

Kampanya tipi:

```text
Arama Agi
```

Hedef:

```text
Potansiyel musteriler
```

Ana donusum:

```text
VistaSeeds - Tohum Teklif Formu
```

## 5. Bereket Fide ile Ayrim

VistaSeeds kampanyasinda fide kelimeleri kullanilmamalidir.

Bereket Fide kelime havuzu:

```text
fide
sebze fidesi
domates fidesi
biber fidesi
asili fide
fide uretimi
```

VistaSeeds kelime havuzu:

```text
tohum
sebze tohumu
biber tohumu
domates tohumu
hibrit tohum
profesyonel tohum
```

## 6. VistaSeeds Anahtar Kelimeleri

Ilk kampanya icin onerilen kelimeler:

```text
sebze tohumu
biber tohumu
domates tohumu
hiyar tohumu
salatalik tohumu
patlican tohumu
karpuz tohumu
kavun tohumu
hibrit tohum
profesyonel sebze tohumu
toptan tohum
tohum fiyatlari
Antalya tohum
tarim tohumu
sera tohumu
```

Kampanya yayina alindiktan sonra Arama Terimleri raporuna gore liste daraltilacak veya genisletilecek.

## 7. Negatif Anahtar Kelimeler

VistaSeeds kampanyasinda fide ile ilgili aramalar engellenmelidir.

Ilk negatif liste:

```text
fide
sebze fidesi
domates fidesi
biber fidesi
asili fide
ucretsiz
bedava
is ilani
maas
kariyer
evde
saksida
ders
odev
pdf
```

## 8. Reklam Metni Taslagi

Baslik onerileri:

```text
VistaSeeds
Sebze Tohumu
Biber Tohumu
Domates Tohumu
Hibrit Tohum Cesitleri
Profesyonel Tohum
Tohum Teklifi Alin
Toptan Tohum
Tarimsal Tohum Cesitleri
```

Aciklama onerileri:

```text
Profesyonel sebze tohumu cesitleri icin VistaSeeds ekibinden hizli teklif alin.
```

```text
Domates, biber, hiyar ve diger sebze tohumu cesitleri icin bilgi alin.
```

```text
Uretici ve bayiler icin kaliteli tohum cesitleri. Teklif formunu doldurun.
```

## 9. Konum Hedefleme

VistaSeeds tohum satisi bolgesel veya ulusal yapilabilir. Karar is modeline gore verilecek.

Eger tum Turkiye'ye satis varsa:

```text
Turkiye
```

Eger kontrollu baslamak istenirse:

```text
Antalya
Mersin
Adana
Konya
Bursa
Izmir
Manisa
Sanliurfa
Gaziantep
Hatay
```

Konum seceneklerinde tercih:

```text
Hedeflediginiz konumlarda bulunan veya duzenli olarak bulunan kullanicilar
```

## 10. Search Console Temizligi

VistaSeeds icin Search Console tarafinda su kontroller yapilacak:

- Sitemap gonderildi mi?
- Onemli sayfalar indexleniyor mu?
- Eski URL'ler 301 ile yeni URL'lere gidiyor mu?
- Gereksiz PDF dosyalari Google sonuclarinda cikiyor mu?
- Upload dosyalari icin gerekirse `X-Robots-Tag: noindex` eklendi mi?
- 404 veren eski URL'ler icin dogru redirect var mi?
- Dil URL'leri ve canonical yapisi dogru mu?

## 11. Ilk 14 Gun Yonetim Plani

Ilk gun:

- Kampanya yayina alinir.
- Donusum etiketi kontrol edilir.
- Konum, butce, negatif kelimeler kontrol edilir.

Ilk 48 saat:

- Gereksiz ayar degisikligi yapilmaz.
- Gosterim ve tiklama gelip gelmedigi kontrol edilir.

3-7. gun:

- Arama Terimleri raporu incelenir.
- Alakasiz terimler negatif eklenir.
- Tiklama alan ama ilgisiz kelimeler temizlenir.

7-14. gun:

- Donusum maliyeti incelenir.
- Iyi kelimelere butce ayrilir.
- Kotu kelimeler duraklatilir.
- Reklam metinleri gerekirse iyilestirilir.

## 12. Baslama Komutu

VistaSeeds reposuna gecildiginde calisma su mesajla baslatilabilir:

```text
VistaSeeds repo icin Bereket Fide'de yaptigimiz Ads + SEO + Search Console kontrollerini baslatalim.
```

