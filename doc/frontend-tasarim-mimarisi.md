# Frontend Tasarim Mimarisi — Tohum/Tarim Sektoru

## Referans Analizi

Burpee, Bayer Crop Science, Johnny's Selected Seeds gibi sektördeki premium firmaların ortak özellikleri:

| Ozellik | Uygulama |
|---------|----------|
| Hero görseller | Tam ekran tarla/ürün fotoğrafları, mevsime göre değişen |
| Akıllı filtreleme | Kategori, mevsim, bitki tipi, bölge — çok katmanli |
| Eğitim içeriği | Ekim rehberi, bakım bilgisi, mevsim takvimi |
| Mevsimsel içerik | Anasayfa sezona göre değişen dinamik hero + banner |
| Mobil öncelik | Buyuk butonlar, tek kolonlu grid, kolay filtreleme |
| Güven sinyalleri | Sertifika, non-GMO, organik badge'leri |

---

## Mimari Kararlar

### 1. Anasayfa Seksiyon Sırası (Yeni)

```
1. SeasonalHero      — Mevsime göre değişen tam ekran hero + overlay metin
2. TrustBar          — Güven sinyalleri bandı (sertifika, non-GMO, AR-GE)
3. StatsSection      — Rakamsal istatistikler (mevcut)
4. SeasonalPicks     — "Bu Mevsim Önerilerimiz" — backend'den mevsim filtreli ürünler
5. ValuesSection     — Temel değerler (mevcut)
6. PlantingGuide     — Ekim rehberi önizleme (mevsim takvimi + ipuçları)
7. ProductsPreview   — Öne çıkan ürünler (mevcut)
8. TimelineSection   — Tarihçe (mevcut)
9. FaqPreview        — SSS önizleme (mevcut)
10. Newsletter       — E-posta kayıt bandı (Burpee tarzı)
11. CtaSection       — İletişim CTA (mevcut)
```

### 2. Mevsimsel İçerik Sistemi

Backend `site_settings` tablosunda `homepage_hero` key'i mevsime göre farklı veri tutar:

```json
{
  "season": "spring",
  "title": "Bahar Ekimi Başlıyor",
  "highlight": "Tohumlariniz",
  "description": "Yuksek verimli cesitlerimizle baharin bereketini yasayin.",
  "badge": "Bahar Sezonu 2026",
  "image_url": "/assets/hero/spring-field.jpg",
  "cta_label": "Bahar Koleksiyonu"
}
```

Frontend, backend'den gelen `season` field'ina göre hero'yu render eder. Admin panelden sezon değişikliği yapilir.

### 3. Ürün Filtreleme Mimarisi

Mevcut `/ürünler` sayfası basit grid. Çok katmanli filtre eklenecek:

```
Filtre Paneli (sol sidebar desktop / modal mobile):
  - Kategori (ANAC, BIBER, vb.) — backend categories'den
  - Mevsim (Ilkbahar, Yaz, Sonbahar, Kis) — product tags'den
  - Tip (F1 Hibrit, Açık Tozlanan, Anac) — product tags'den
  - Arama (isim, kod)
```

Backend zaten `tags` field'i destekliyor. Mevsim ve tip bilgileri `tags` içinde tutulur:
- `["bahar", "yaz", "f1-hibrit", "biber"]`

Frontend `tags` query param'i ile filtreleme yapar:
- `GET /api/products?tags=bahar,f1-hibrit&category_id=xxx`

### 4. Güven Sinyalleri (Trust Badges)

Backend `site_settings` tablosunda `trust_badges` key'i:

```json
[
  { "icon": "shield", "label": "Sertifikali Tohum", "description": "TUAB onaylı" },
  { "icon": "leaf", "label": "Sürdürülebilir", "description": "Çevre dostu uretim" },
  { "icon": "flask", "label": "AR-GE Odakli", "description": "Kendi seleksiyonlarımız" },
  { "icon": "award", "label": "%95+ Çimlendirme", "description": "Kalite garantisi" }
]
```

### 5. Footer Mimarisi (Burpee Tarzi)

```
[Newsletter Bandi — yesil arka plan]
  "Güncel kalın" + email input + Abone Ol butonu

[Yardım Bandi — acik gri]
  Sol: "Size yardımcı olmaktan mutluluk duyarız" + SSS/İletişim linkleri
  Sag: "Bizi Takip Edin" + sosyal medya ikonları

[Link Kolonları — beyaz]
  Hakkımızda | Destek | Politikalar | Ürünler
  - Alt linkler

[Alt bar — copyright]
```

### 6. Ekim Rehberi Seksiyonu

Anasayfa'da mini ekim takvimi önizlemesi:

```
"Ekim Rehberi" baslik
[Mevsim tabları: Ilkbahar | Yaz | Sonbahar]
Her mevsimde:
  - 3-4 ürün oneri karti
  - Kısa ekim ipucu
  - "Detaylı Rehber" linki
```

Veri backend `site_settings` > `planting_guide` key'inden gelir.

---

## Yeni Component'ler

| Component | Konum | Amaç |
|-----------|-------|------|
| `SeasonalHero` | sections/ | Mevsime göre değişen tam ekran hero |
| `TrustBar` | sections/ | Güven sinyalleri bandı |
| `SeasonalPicks` | sections/ | Mevsim bazli ürün onerileri |
| `PlantingGuide` | sections/ | Ekim rehberi önizleme |
| `Newsletter` | sections/ | E-posta kayıt bandı |
| `ProductFilters` | modules/product/components/ | Çok katmanlı filtre paneli |
| `TrustBadge` | ui/ | Tekil badge bileşeni |
| `SeasonTabs` | ui/ | Mevsim sekme bileşeni |

---

## Backend Seed Gereksinimleri

| Key | Tablo | İçerik |
|-----|-------|--------|
| `homepage_hero` | site_settings | Mevsimsel hero verisi |
| `trust_badges` | site_settings | Güven sinyalleri dizisi |
| `planting_guide` | site_settings | Ekim rehberi mevsim verileri |
| `newsletter_config` | site_settings | Newsletter baslik/açıklama |
| `footer_links` | site_settings | Footer kolon linkleri |
| `social_links` | site_settings | Sosyal medya URL'leri |

---

## Uygulama Sırası

1. Backend seed — mevsimsel hero, trust badges, planting guide, footer verileri
2. Yeni section componentleri — SeasonalHero, TrustBar, SeasonalPicks, PlantingGuide, Newsletter
3. Footer yeniden yazımı — Burpee tarzı çok kolonlu
4. Ürünler sayfası — filtre sidebar + tag bazli filtreleme
5. Anasayfa recompose — yeni siralama ile
6. Mobile optimizasyon kontrolü
