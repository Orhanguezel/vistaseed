# Google Ads Kampanya Takip Notu — vistaseeds

Tarih: 2026-05-25
Kaynak: `reports/vistaseeds-ziyaretci-raporu-2026-05-25.pdf`

## Final URL Suffix

Google Ads hesabinda her aktif kampanya icin Final URL suffix alanina su sablon eklenmelidir:

```text
utm_source=google_ads&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}
```

Alternatif olarak hesap seviyesinde Tracking template kullaniliyorsa ayni parametreler korunmalidir.

## Kampanya ID Eslesmesi

| Campaign ID | Kampanya Adi | Not |
|---|---|---|
| `23858139584` | Manuel doldurulacak | Ziyaretci raporunda en aktif kampanya olarak gorundu |
| `23862644545` | Manuel doldurulacak | Google Ads arayuzunden ad/butce ile eslestirilecek |
| `23643860570` | Manuel doldurulacak | Google Ads arayuzunden ad/butce ile eslestirilecek |

## 7 Gun Sonra Kontrol

Yeni log analizinde `utm_campaign` parametresi campaign id bazinda gorunmeli. Kampanya adlari bu dosyaya islendikten sonra raporda id yerine ad bazli ozet uretilebilir.
