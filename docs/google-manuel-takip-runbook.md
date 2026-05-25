# Google Manuel Takip Runbook — vistaseeds

Tarih: 2026-05-25
Kapsam: Search Console, Google Ads, Merchant Center ve ileri tarihli takip maddeleri.

Bu dokuman, teknik fix ve deploy tamamlandiktan sonra Google panellerinde manuel yapilacak islemler icindir. Kod/deploy tarafinda Faz 1 ve Faz 2 maddeleri uygulanmistir; asagidaki adimlar Google hesap erisimi gerektirir.

## 1. Search Console Dogrulamalari

Adres: https://search.google.com/search-console

Property olarak `https://www.vistaseeds.com.tr/` secilmeli.

Baslatilacak dogrulamalar:

1. Sayfalar > Sunucu hatasi (5xx) > Dogrulamayi baslat
2. Sayfalar > Bulunamadi (404) > Dogrulamayi baslat
3. Gelistirmeler > Breadcrumbs > Dogrulamayi baslat

Not:
- Merchant Listings ve Product Snippets uyarilari Vista Seeds'in katalog/B2B modeli nedeniyle beklenen uyarilar olabilir.
- Urunlerde fiyat/satis akisi yoksa Product schema icin `offers.price` eklenmemelidir.

## 2. URL Inspection Kontrolleri

P0 redirect deploy'undan 24 saat sonra URL Inspection ile test edilecek ornekler:

```text
https://www.vistaseeds.com.tr/tr/urun/saray-f1
https://www.vistaseeds.com.tr/tr/urun/avar
https://www.vistaseeds.com.tr/en/urun/cankan-f1
https://www.vistaseeds.com.tr/tr/grup-sirketlerimiz/vista-prestige
https://www.vistaseeds.com.tr/tr/grup-sirketlerimiz/vista-lagoon
```

Beklenen:
- Eski `/urun/:slug` URL'leri 308 ile `/{locale}/urunler/:slug` hedefine gider.
- Eski `/grup-sirketlerimiz/:slug` URL'leri 308 ile `/{locale}/hakkimizda` hedefine gider.

## 3. Google Ads UTM Ayari

Adres: https://ads.google.com

Aktif kampanyalarda Final URL suffix alanina su sablon eklenmeli:

```text
utm_source=google_ads&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}
```

Kampanya ID notlari `docs/google-ads-kampanyalar.md` dosyasinda tutulur. Google Ads arayuzunde kampanya adlari goruldukten sonra su ID'ler isim ve butce ile eslestirilmeli:

```text
23858139584
23862644545
23643860570
```

## 4. Merchant Center Karari

Adres: https://merchants.google.com

Kontrol edilecekler:

1. Vista Seeds property/site baglantisi Merchant Center'a bagli mi?
2. Urun listing uyarilari gercek satis akisi eksiginden mi kaynaklaniyor?
3. Site katalog/B2B kalacaksa Merchant Listings uyarilari kapatma istegi veya Merchant Center baglantisini kaldirma degerlendirilmeli.

Karar notu:
- Katalog modeli korunuyorsa fiyat, stok, iade ve kargo alanlarini sahte degerlerle doldurmak onerilmez.
- E-ticaret veya bayi teklif akisi satis modeline donerse Product schema yeniden ele alinmali.

## 5. Tarihli Takipler

2026-06-01:
- Faz 2 deploy sonrasi yeni 7 gunluk nginx log analizi uret.
- `/urun/:slug`, `/grup-sirketlerimiz/:slug`, saldiri probe 5xx, admin asset 404 ve auth/token 500 tekrar kontrol edilmeli.
- Google Ads UTM uygulandiysa loglarda `utm_campaign` gorunmeli.

2026-06-08:
- Search Console Coverage trendi kontrol edilmeli.
- 5xx ve 404 dogrulamalarinin durumu not edilmeli.

2026-06-25:
- Yeni Search Console export'u `searchconsole/2026-06-25/` altina alinmali.
- 2026-05-25 baseline ile delta raporu hazirlanmali.

