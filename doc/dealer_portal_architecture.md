# Bayi Portalı (Dealer Portal) Dinamik Mimari Planı

vistaseeds Bayi Portalı'nın sadece bir bilgilendirme ekranı olmaktan çıkıp tam fonksiyonel bir B2B (Business-to-Business) sipariş ve yönetim platformuna dönüşmesi için gereken modüller ve altyapı planı aşağıdadır.

## 1. Gerekli Modüller (Backend)

### A. Sipariş Yönetimi (`orders`)
- **Tablolar**: `orders` (id, dealer_id, status, total, notes), `order_items` (order_id, product_id, quantity, unit_price).
- **Fonksiyonlar**: Sipariş oluşturma, durum güncelleme (beklemede, onaylandı, kargolandı, tamamlandı).

### B. Bayi Finans Takibi (`dealer_finance`)
- **Tablolar**: `dealer_profiles` (ek alanlar: kredi_limiti, mevcut_bakiye), `dealer_transactions` (cari hareketler, ödemeler, borçlar).
- **Fonksiyonlar**: Kredi limiti kontrolü, bakiye sorgulama.

### C. Gelişmiş Ürün Arama ve Stok (`products_b2b`)
- **Fonksiyonlar**: Bayiye özel fiyatlandırma mantığı (iskonto oranları), stok durum kontrolü (kritik stok uyarıları).

### D. Bildirim Sistemi (`notifications`)
- **Fonksiyonlar**: Sipariş onaylandığında veya kargoya verildiğinde otomatik e-posta/Telegram mesajı.

## 2. Frontend İhtiyaçları (Dashboard)

- **Sipariş Sayfası**: Ürünleri kategorize edilmiş şekilde listeleyip hızlıca sepete ekleme ve toplu sipariş verme.
- **Siparişlerim**: Geçmiş siparişlerin takibi ve detay penceresi.
- **Cari Hesap**: Borç/alacak durumu ve ödeme geçmişi tablosu.

## 3. Uygulama Sırası

1. **Backend**: `orders` ve `order_items` tablolarının şeması ve API uçları.
2. **Frontend**: Ürün listesini çeken "Hızlı Sipariş" sayfası.
3. **Frontend**: Sipariş özeti ve onay ekranı.
4. **Backend**: Cari limit ve bakiye entegrasyonu.
