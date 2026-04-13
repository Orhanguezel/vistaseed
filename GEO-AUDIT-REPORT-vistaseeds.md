# GEO-SEO Analiz Raporu: vistaseeds.com.tr

**Tarih:** 2026-04-04  
**Site:** https://www.vistaseeds.com.tr  
**Sektör:** Tarim / Tohum E-ticaret  
**Framework:** Next.js (SSR/SSG)  
**Diller:** Turkce, Ingilizce, Almanca  

---

## Genel GEO Skoru: 52/100

| Kategori | Agirlik | Skor | Detay |
|----------|---------|------|-------|
| AI Citability & Visibility | 25% | 35/100 | llms.txt yok, AI crawler ayarlari eksik |
| Brand Authority Signals | 20% | 40/100 | Sinirli external presence |
| Content Quality & E-E-A-T | 20% | 65/100 | Iyi icerik yapisi, eksik yazar/uzman bilgisi |
| Technical Foundations | 15% | 72/100 | Next.js SSR, iyi URL yapisi, eksik analytics |
| Structured Data | 10% | 45/100 | Sadece Organization + WebSite, Product schema yok |
| Platform Optimization | 10% | 38/100 | OG tags eksik, social profiller bos |

---

## 1. Teknik Altyapi

### 1.1 Olumlu Bulgular

| Alan | Durum | Not |
|------|-------|-----|
| Framework | Next.js (SSR/SSG) | AI crawlers icin mukemmel |
| Dil Etiketi | `<html lang="tr">` | Dogru ayarlanmis |
| Sitemap | 69 URL | Duzgun yapilandirilmis, 3 dil destegi |
| URL Yapisi | SEO-friendly | Temiz: `/tr/urunler/lucky-f1` |
| Heading Hiyerarsisi | Dogru | Tek H1, mantikli H2/H3 yapisi |
| Gorsel Alt Text | Mevcut | Urun gorselleri alt text iceriyor |
| WebP Format | Aktif | Modern gorsel formati kullaniliyor |
| Responsive | Evet | Viewport meta dogru ayarlanmis |
| UTF-8 | Evet | Karakter kodlamasi dogru |
| Cok Dilli | TR, EN, DE | Sitemap'te 3 dil destegi |

### 1.2 Sorunlar

| Sorun | Onem | Detay |
|-------|------|-------|
| Meta Description Eksik | Kritik | Ana sayfada meta description tanimli degil |
| Canonical URL Eksik | Yuksek | `<link rel="canonical">` etiketi yok |
| Google Analytics Yok | Kritik | Hicbir analytics veya tracking scripti tespit edilemedi |
| Favicon Eksik | Orta | Favicon tespit edilemedi |
| Hreflang Dogrulama | Orta | 3 dil destegi var ama hreflang etiketleri dogrulanmali |

---

## 2. Sitemap Analizi

| Metrik | Deger |
|--------|-------|
| Toplam URL | 69 |
| Diller | TR, EN, DE |
| Urun Sayfalari | 18 (6 urun x 3 dil) |
| Icerik Sayfalari | 48 |
| Ana Sayfa Onceligi | 1.0 |
| Urunler Sayfasi Onceligi | 0.9 |
| Urun Detay Onceligi | 0.8 |
| Guncelleme Sikligi | Ana sayfa: daily, Urunler: weekly |
| Son Guncelleme | 2026-04-04 |

### Sayfa Kategorileri

| Bolum | Oncelik | Sikligi | URL Sayisi |
|-------|---------|---------|------------|
| Ana Sayfa | 1.0 | daily | 3 |
| Urunler | 0.9 | weekly | 3 |
| Urun Detay | 0.8 | weekly | 18 |
| Hakkimizda | 0.7 | monthly | 3 |
| Blog | 0.65 | weekly | 3 |
| SSS | 0.6 | monthly | 3 |
| Insan Kaynaklari | 0.6 | monthly | 3 |
| Karsilastirma | 0.55 | monthly | 3 |
| Bayi Agi | 0.55 | monthly | 3 |
| Toplu Satis | 0.55 | monthly | 3 |
| Iletisim | 0.5 | monthly | 3 |
| Gizlilik Politikasi | 0.3 | yearly | 3 |
| Kullanim Kosullari | 0.3 | yearly | 3 |

---

## 3. Robots.txt Analizi

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /*?_rsc=
Sitemap: https://www.vistaseeds.com.tr/sitemap.xml
```

| Kontrol | Sonuc |
|---------|-------|
| Genel Erisim | Acik (Allow: /) |
| API Koruması | Var (Disallow: /api/) |
| Next.js Dosyalari | Korunuyor (Disallow: /_next/) |
| Sitemap Referansi | Var |
| GPTBot Kurali | Yok (varsayilan erisim) |
| ClaudeBot Kurali | Yok (varsayilan erisim) |
| PerplexityBot Kurali | Yok (varsayilan erisim) |
| Google-Extended Kurali | Yok (varsayilan erisim) |
| Bytespider Kurali | Yok (varsayilan erisim) |
| CCBot Kurali | Yok (varsayilan erisim) |

**Yorum:** AI crawlerlar icin ozel kural yok. Tum botlar varsayilan olarak erisiyor. Bu iyi bir baslangic ancak bilinçli bir strateji ile kontrol edilmeli.

---

## 4. Structured Data (Schema Markup)

### Mevcut Schema

**Organization:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "vistaseeds",
  "url": "https://www.vistaseeds.com.tr",
  "logo": "https://www.vistaseeds.com.tr/assets/logo/logo.jpeg",
  "sameAs": []
}
```

**WebSite:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "vistaseeds",
  "url": "https://www.vistaseeds.com.tr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.vistaseeds.com.tr/urunler?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### Eksik Schema

| Schema Tipi | Nerede Kullanilmali | Oncelik |
|-------------|---------------------|---------|
| Product | Her urun sayfasi (8 urun) | Kritik |
| AggregateRating | Urun sayfalarinda (rating verileri mevcut) | Kritik |
| FAQPage | SSS sayfasi | Yuksek |
| BreadcrumbList | Tum sayfalarda | Yuksek |
| LocalBusiness / Corporation | Ana sayfa | Yuksek |
| Article | Blog ve bilgi bankasi sayfalari | Orta |
| Review | Urun degerlendirmeleri | Orta |

---

## 5. AI Gorunurlugu (GEO Analizi)

### 5.1 llms.txt Durumu

| Kontrol | Sonuc |
|---------|-------|
| llms.txt Var mi? | Hayir |
| llms-full.txt Var mi? | Hayir |

**Etki:** AI arama motorlari (ChatGPT, Claude, Perplexity) siteyi anlamak icin llms.txt dosyasini kullanir. Bu dosyanin olmamasi AI gorünürlügünü olumsuz etkiler.

### 5.2 AI Crawler Erisimi

| Bot | Erisim Durumu |
|-----|---------------|
| GPTBot (OpenAI) | Acik (varsayilan) |
| ChatGPT-User | Acik (varsayilan) |
| ClaudeBot (Anthropic) | Acik (varsayilan) |
| PerplexityBot | Acik (varsayilan) |
| Google-Extended | Acik (varsayilan) |
| Bytespider (TikTok) | Acik (varsayilan) |
| CCBot (Common Crawl) | Acik (varsayilan) |

### 5.3 AI Citability Degerlendirmesi

| Kriter | Skor | Not |
|--------|------|-----|
| Yapilandirilmis Icerik | 6/10 | Baslik hiyerarsisi iyi, ama paragraf yapisi iyilestirilebilir |
| Cevap Bloklari | 4/10 | FAQ mevcut ama schema ile desteklenmemis |
| Benzersiz Veri | 5/10 | Urun spesifikasyonlari mevcut |
| Uzman Sinyalleri | 4/10 | Yazar bilgisi ve uzmanlik gostergeleri eksik |
| Kaynak Gosterilebilirlik | 3/10 | Istatistik ve referans eksik |

---

## 6. Icerik ve E-E-A-T Analizi

### 6.1 Icerik Yapisi

| Sayfa | Baslik (H1) | Durum |
|-------|-------------|-------|
| Ana Sayfa | "Tohumun Bereketi Toprakla Baslar" | Tek H1, uygun |
| Urunler | Mevcut | 8 urun listeleniyor |
| Hakkimizda | Mevcut | Sirket tarihi, misyon/vizyon |
| SSS | Mevcut | Sikca sorulan sorular |

### 6.2 E-E-A-T Sinyalleri

| Sinyal | Durum | Not |
|--------|-------|-----|
| Experience (Deneyim) | Orta | 1990'dan beri faaliyet, timeline mevcut |
| Expertise (Uzmanlik) | Orta | TUAB onayli tohumlar, AR-GE merkezi |
| Authoritativeness (Otorite) | Dusuk | Sinirli dis referanslar, bos sameAs |
| Trustworthiness (Guvenilirlik) | Orta | %95+ cimlendirme orani garantisi, sertifikalar |

### 6.3 Sirket Zaman Cizelgesi

| Yil | Olay |
|-----|------|
| 1990 | Kuruluş |
| 2000 | Genisleme |
| 2006 | Bereket Fide (Antalya) |
| 2010 | Uluslararasi ihracat |
| 2020 | AR-GE merkezi kurulumu |
| 2025 | Dijital donusum |

### 6.4 Grup Sirketleri

- vistaseeds (Tohum)
- Vista Prestige
- GES Sistemleri (Yenilenebilir enerji)
- Karasah Business Center
- Bereket Fide (Fide uretimi)

---

## 7. Urun Katalogu

| Urun | Kod | Kategori | Boy | Rating | Ozellik |
|------|-----|----------|-----|--------|---------|
| AVAR | VS-ANAC-001 | Anac | - | 5.0/5 | Karpuz, kavun, hiyar icin anac |
| LUCKY F1 | VS-BIB-001 | Biber | 21-23cm | 4.75/5 | Charliston, TSWV toleransi |
| KIZGIN F1 | VS-BIB-002 | Biber | 23-25cm | 4.33/5 | Aci kil biber, TSWV toleransi |
| PRESTIJ F1 | VS-BIB-003 | Biber | 22-24cm | 4.67/5 | Tatli kil biber, soguga dayanikli |
| BIRLIK F1 | VS-BIB-004 | Biber | 16-18cm | 4.67/5 | Ucburun, erken olgunlasan |
| CANKAN F1 | VS-BIB-005 | Biber | 18-20cm | 4.67/5 | Kapya, %100 tatli |
| TIRPAN F1 | VS-BIB-006 | Biber | 19-21cm | 4.75/5 | Kapya, catlama dayanimi |
| SARAY F1 | VS-BIB-007 | Biber | - | 4.5/5 | Dolma biber, kalin kabuk |

---

## 8. Sosyal Medya ve OG Tags

| Kontrol | Sonuc |
|---------|-------|
| Open Graph Tags | Eksik |
| Twitter Cards | Eksik |
| Facebook Pixel | Yok |
| Google Analytics | Yok |
| Sosyal Medya Profilleri (sameAs) | Bos dizi |

---

## 9. DNS ve E-posta Guvenligi

| Kayit | Durum | Risk |
|-------|-------|------|
| SPF | Yok | Kritik - E-posta spoofing mumkun |
| DMARC | Yok | Kritik - Domain savunmasiz |
| DKIM | Yok | Kritik - E-posta dogrulamasi eksik |
| **E-posta Guvenlik Skoru** | **0/100** | **Acil mudahale gerekli** |

---

## 10. Iletisim Bilgileri

| Alan | Deger |
|------|-------|
| E-posta | info@vistaseeds.com.tr |
| Telefon | +90 (850) 123 45 67 |
| Adres | Sertifikali Tohum Uretim Merkezi |
| Web Tasarim | Guezel Web Design |

---

## 11. Oncelikli Aksiyon Plani

### Acil (1-2 Gun)

| # | Aksiyon | Kategori | Etki |
|---|---------|----------|------|
| 1 | Tum sayfalara meta description ekleyin | SEO | Yuksek |
| 2 | OG tags + Twitter Cards ekleyin | Social/AI | Yuksek |
| 3 | Canonical URL ekleyin | SEO | Yuksek |
| 4 | Google Analytics 4 kurun | Analytics | Kritik |
| 5 | SPF + DMARC DNS kayitlari ekleyin | Guvenlik | Kritik |

### Kisa Vadeli (1-2 Hafta)

| # | Aksiyon | Kategori | Etki |
|---|---------|----------|------|
| 6 | Her urun sayfasina Product JSON-LD schema ekleyin | Schema | Yuksek |
| 7 | llms.txt dosyasi olusturup yayinlayin | GEO/AI | Yuksek |
| 8 | Organization schema'ya sosyal medya profilleri ekleyin | Schema | Orta |
| 9 | LocalBusiness veya Corporation schema ekleyin | Schema | Orta |
| 10 | Favicon ekleyin | UX | Dusuk |

### Orta Vadeli (1 Ay)

| # | Aksiyon | Kategori | Etki |
|---|---------|----------|------|
| 11 | FAQPage schema ekleyin (SSS sayfasi mevcut) | Schema | Orta |
| 12 | BreadcrumbList schema ekleyin | Schema | Orta |
| 13 | Blog icerikleri Article schema ile zenginlestirin | Schema | Orta |
| 14 | Hreflang etiketlerini dogrulayin | i18n | Orta |
| 15 | Ekim rehberi ile E-E-A-T sinyallerini guclendirin | Content | Yuksek |

### Stratejik (3 Ay)

| # | Aksiyon | Kategori | Etki |
|---|---------|----------|------|
| 16 | YouTube, LinkedIn'de marka varligi olusturun | Brand | Yuksek |
| 17 | AI platformlarinda brand mention stratejisi gelistirin | GEO | Yuksek |
| 18 | Ciftci hikayeleri/referanslarla Experience sinyali guclendirin | E-E-A-T | Orta |
| 19 | Wikipedia veya tarim wiki'lerinde entity olusturun | Authority | Yuksek |
| 20 | Perplexity/ChatGPT'de "tohum" sorgularinda gorunurluk test edin | GEO | Orta |

---

## 12. Sonuc

vistaseeds, Next.js altyapisi, temiz URL yapisi ve cok dilli destegi ile iyi bir teknik temele sahip. Ancak **AI gorunurlugu**, **structured data** ve **marka otoritesi** alanlarinda ciddi eksiklikler var. Oncelikli olarak meta description, OG tags, Product schema ve llms.txt eklemeleri yapilarak GEO skorunun 52'den 70+ seviyesine cikarilmasi hedeflenmelidir.

**E-posta guvenligi** acil mudahale gerektirmektedir (SPF/DMARC/DKIM kayitlari eklenmeli).

---

*Bu rapor GEO-SEO Analysis Tool tarafindan olusturulmustur.*  
*Rapor Tarihi: 2026-04-04*  
*Analiz Edilen URL: https://www.vistaseeds.com.tr*
