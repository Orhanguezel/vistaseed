# VistaSeeds — Google Ads Düzeltme Checklist

**Tarih:** 16 Haziran 2026 · **Kaynak:** "Biber Tohumu kampanyası neden az yayınlanıyor" teşhisi (API)
**Hesap:** Vista Seeds — TRY · customer_id `702-033-4476` (`7020334476`) · MCC `520-099-4833` · tag `AW-18007572524`
**Yöntem:** Otomasyon (Ads REST API, creds site_settings'te) öncelikli; panel manuel yedek.

> Token akışı çalışıyor (refresh_token tırnak sorunu 15 Haz düzeltildi). API çağrıları `campaigns:mutate`, `adGroupCriteria:mutate`, `conversionActions` ile yapılır. Sadece VistaSeeds kampanyalarına dokun — BereketFide (`23862790960`) ve Haldefiyat (`23881927163`) başka marka, **ELLEME**.

## Mevcut durum (teşhis özeti)

| Kampanya | ID | Durum | Strateji | 30g | Sorun |
|---|---|---|---|---|---|
| VistaSeeds - Arama - Biber Tohumu | `23942372545` | ENABLED | **Maks. Dönüşüm** | 19 gösterim / 1 tık / **0 dönüşüm** | Yayın açlığı |
| VistaSeeds - Sebze Tohumu Teklifleri | `23638380618` | PAUSED | Maks. Performans (PMax) | — | Durdurulmuş |

Biber Tohumu IS: gösterim payı %32, kayıp %37 bütçe + %31 sıralama. Başlangıç 13 Haz (3 günlük). 12 keyword PHRASE, hepsi ELIGIBLE/onaylı, 10'u 0 gösterim. Reklamlar APPROVED. **Teknik arıza yok** — sorun strateji + 0 dönüşüm verisi + niş keyword.

---

## P0 — Biber Tohumu yayın açlığını çöz

### [ ] A) Teklif stratejisi: Maks. Dönüşüm → **Tıklamaları Artır** (+ TBM tavanı)
- **Neden:** Maximize Conversions, 0 dönüşüm verisiyle kendini kısıp yayınlamıyor. Çalışan BereketFide/Haldefiyat "Tıklamaları Artır" kullanıyor. Dönüşüm takibi sağlamlaşana kadar bu strateji doğru.
- **Yöntem — API (otomasyon):** `campaigns:mutate`, kampanya `23942372545`.
  - Standart Tıklamaları Artır = `TargetSpend`. Body:
    ```json
    {"operations":[{"updateMask":"targetSpend.cpcBidCeilingMicros","update":{
      "resourceName":"customers/7020334476/campaigns/23942372545",
      "targetSpend":{"cpcBidCeilingMicros":3500000}}}]}
    ```
    (Strateji türü Maks. Dönüşüm'den geliyorsa updateMask'e `targetSpend` ekleyip `maximizeConversions`'ı boşaltmak gerekebilir — INVALID_ARGUMENT dönerse `"targetSpend"` tam objesini gönder ve önce mevcut stratejiyi temizle.)
  - **TBM tavanı:** ~**3,5 TRY** = `3500000` micros (şu anki Ort. TBM 9,09 çok yüksek). Onay: kullanıcı tavan değerini netleştirsin.
- **Yöntem — Panel (yedek):** Kampanya → Ayarlar → Teklif verme → "Tıklamaları Artır" + maksimum TBM teklif limiti 3,5 TRY.
- **Kabul:** Strateji `TARGET_SPEND`/Tıklamaları Artır; 48 saat içinde günlük gösterim 19'dan belirgin artar (hedef >500/gün).

### [ ] B) Bütçeyi izle (şimdilik değiştirme)
- 150 TRY/gün strateji düzelince yeniden değerlendirilir. searchBudgetLostIS %37 büyük olasılıkla yüksek tekliften; tavan konunca düşmeli.
- **Kabul:** Strateji değişiminden 3 gün sonra searchBudgetLostImpressionShare < %15 ise bütçe yeterli.

### [ ] C) Keyword setini genişlet
- **Neden:** 12 PHRASE keyword aşırı niş (kapya/dolmalık/çarliston biber tohumu...), arama hacmi ~0.
- **Yapılacak:** Birkaç genel/baş terim ekle — ör. `biber fidesi`, `tohum`, `sebze tohumu` (broad veya phrase). Hacimsiz nişleri (0 gösterim) gözden çıkarma adayı olarak işaretle.
- **Yöntem — API:** `adGroupCriteria:mutate` (create). Panel: Anahtar Kelimeler → ekle.
- **Kabul:** En az 3 orta-hacimli terim eklendi; 7 gün sonra ad grubu başına ≥1 keyword gösterim alıyor.

### [ ] D) Öğrenme süresi
- A+C sonrası **3-7 gün** dokunma; smart sinyaller otursun.

---

## P0 — Dönüşüm takibi (TÜM hesabı etkiler, asıl kök neden)

> Hiçbir kampanyada dönüşüm yok (BereketFide 861 tık/0, Haldefiyat 2062 tık/0). Dönüşüm takibi kurulu değil/çalışmıyor. Bu çözülmeden hiçbir "Dönüşüm" tabanlı strateji çalışmaz ve ROAS/CPA ölçülemez.

### [ ] E) Dönüşüm action durumunu doğrula (API)
- site_settings: `google_ads_conversion_quote`, `google_ads_tag_id` (AW-180...) tanımlı. Gerçekten var mı / sayım yapıyor mu?
- **Yöntem:** `conversionActions` GAQL + mevcut `googleAds/conversion-health.service.ts` modülü (panelde "Analiz/Conversion Health" sekmesi).
- **Kabul:** Aktif bir conversion action listeleniyor, status ENABLED, son 30g sayımı raporlanıyor.

### [ ] F) `/teklif-al` form gönderimini dönüşüm olarak ateşle
- **Neden:** VistaSeeds'te satış yok; dönüşüm = teklif formu gönderimi (lead).
- **Yöntem — Kod (Codex):** Frontend teklif-al başarı durumunda gtag/GTM conversion event (AW tag) tetikle; VEYA backend'den **offline conversion import** (`googleAds/offline.service.ts` zaten var — gclid'i teklif kaydıyla eşleyip yükle). Beacon attribution (yeni eklenen gclid/utm kolonları) bu eşlemeyi besler.
- **Kabul:** Test teklifi sonrası dönüşüm Google Ads'te 24-48 saat içinde görünür.

### [ ] G) (F sonrası) Strateji geri dönüşü — opsiyonel
- Dönüşüm verisi birikince (≥15-30 dönüşüm/ay) Biber Tohumu'nu tekrar **Maks. Dönüşüm**'e alabiliriz. Önce P0-A ile trafik/veri toplansın.

---

## P1 — İzleme & raporlama

### [ ] H) 7 gün sonra yeniden ölç
- API ile: gösterim, tıklama, CTR, Ort. TBM, searchImpressionShare, search*LostIS. Hedef: IS > %60, gösterim >500/gün.
### [ ] I) UTM doğrula
- Biber Tohumu'na `finalUrlSuffix=utm_source=google&utm_medium=cpc&utm_campaign={campaignid}` 15 Haz eklendi. Yeni tıklamalarda nginx log + beacon'da `utm_campaign` düşüyor mu kontrol et (bir sonraki ziyaretçi raporu).

---

## Sahiplik özeti

| # | İş | Yöntem | Sahip |
|---|----|--------|-------|
| A | Strateji → Tıklamaları Artır + TBM tavanı | API / panel | Claude (API) veya Orhan (panel) |
| B | Bütçe izleme | — | izleme |
| C | Keyword genişletme | API / panel | Orhan/Claude |
| E | Dönüşüm action doğrulama | API | Claude |
| F | teklif-al → conversion event/offline import | Kod | Codex |
| G | Strateji geri dönüşü | API | sonra |
| H/I | İzleme | API | Claude |

**Hızlı başlangıç:** P0-A (strateji + TBM tavanı) en yüksek etkili ve hemen API'den uygulanabilir. Onay verilen TBM tavanı: ____ TRY (öneri 3,5).
