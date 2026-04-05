# Anasayfa - VistaSeed

## Sayfa Yapısı

### 1. Header / Navigasyon
- Logo: VistaSeed (sol)
- Menü öğeleri:
  - Anasayfa
  - Hakkımızda
  - Ürünler
  - Bayi Ağı
  - Toplu Satış
  - Blog
  - İletişim
- Sticky header (scroll'da sabit)
- Mobil hamburger menü

### 2. Hero Section (Slider)
- Başlık ekseni: "Modern sera gücü VistaSeed ekosisteminde"
- Alt başlık: Bereket Fide'nin Antalya Aksu'daki üretim deneyimini, VistaSeed'in ürün/bayi/teklif yüzeyi ile birleştiren kurumsal anlatım
- CTA butonu: "Ürünleri Keşfet"
- Secondary CTA: "Toplu Satış Talebi"
- Arka plan: sera, fide ve tarımsal operasyon temalı görsel

### 3. İstatistikler Bandı
- 24 bin m² modern sera
- 3 bin m² aşı odası
- 16-17 milyon aşılı fide kapasitesi
- Haftalık 800 bin aşı kapasitesi

### 4. Temel Değerler (4 Kart)
1. **Modern Üretim Altyapısı** - Bilgisayar kontrollü sulama, ilaçlama, ısıtma ve nem yönetimi
2. **Saha Doğrulamalı Kalite** - Aşılı ve standart fide operasyonundan gelen güven sinyalleri
3. **Ekosistem Yaklaşımı** - Ürün, teklif, bayi ve bilgi bankası modüllerinin tek yapıda toplanması
4. **Sürekli Gelişim** - Güneş enerjisi, modernizasyon ve iş ortaklığı odaklı büyüme

### 5. Neden Bizi Seçmelisiniz?
- 4-5 ana avantaj maddesi
- Operasyonel netlik, teknik içerik ve teklif hızını birlikte vurgulayan anlatım

### 5.1 Kaynak Görsel Paneller
- `vistaseeds.com.tr` ana sayfasındaki görsel bloklar yerel storage ile taşınır
- Paneller:
  - Tohumun Bereketi
  - Yüksek Verimli Tohumlar
  - Sürdürülebilir Tarım Anlayışı
  - Kalite ve Güven
- Kapak görseli:
  - Neden Bizi Seçmelisiniz?

### 6. Ürünler Ön İzleme
- Ürün kartları grid görünümü
- Filtreleme sistemi
- Ürün kartı: görsel, isim, kategori, kısa tarımsal bilgi

### 7. Ekosistem Yapısı Ön İzleme
- 3 kart
- Bereket Fide: üretim omurgası
- VistaSeed: dijital katman
- Vista Seeds: resmî sitede görünen iş ortaklığı markası

### 8. Gelişim Çizgisi (Timeline)
- 2006: Bereket Fide'nin Aksu Çamköy'de üretime başlaması
- Bugün: 32 bin m² alan üzerinde 24 bin m² modern sera
- Kapasite: 3 bin m² aşı odası, 16-17 milyon aşılı fide, 18-20 milyon normal fide
- 2026: Özbekistan Tarım Bakanlığı heyeti ve Antalya kamu heyeti ziyaretleri

### 9. SSS / İçerik Ön İzleme
- Accordion formatında 5-7 soru/cevap
- Blog ve bilgi bankasına çıkan bağlantı
- Resmî ana sayfa SSS soruları öncelikli olarak kullanılır:
  - Sebze tohumları ne kadar süre saklanabilir?
  - Yeni ekilen tohumu ne sıklıkla sulamalıyım?
  - Tohumlar çimlendikten sonra ne yapmalıyım?
  - Tohumların çimlenme oranı nedir?
  - Tohumları ne zaman ekmeliyim?

### 10. Footer
- Şirket bilgileri: Fatih Mah. Isparta Yolu 07112 Aksu / Antalya
- Telefon: 0242 464 19 25
- E-posta: info@bereketfide.com.tr
- Hizli linkler
- Blog / bayi ağı / toplu satış bağlantıları

### 11. Sabit Butonlar
- Telefon butonu
- Scroll-to-top butonu

## İçerik Notları
- Bereket Fide resmî kurumsal içeriğinden doğrulanan veriler kullanılır: 2006 kuruluş, Aksu/Antalya adresi, 24 bin m² sera, 3 bin m² aşı odası, 16-17 milyon aşılı fide ve 18-20 milyon normal fide kapasitesi
- Vista Seeds ilişkisi resmî ana sayfadaki iş ortaklığı logosu üzerinden ele alınır; doğrulanmayan sahiplik iddiaları kullanılmaz
- `vistaseeds.com.tr` ana sayfa görselleri yerel `backend/uploads/homepage/vistaseeds/` klasörüne alınır ve `storage_assets` ile kaydedilir

## Teknik Notlar
- Schema.org yapılandırması: Organization, WebSite, FAQPage
- Responsive tasarım
- SEO meta tag'leri
