# vistaseeds Odeme Checklist

Bu dokuman, vistaseeds B2B siparis odeme akisinin kod uzerinden mevcut durumunu,
risklerini ve test senaryolarini takip etmek icin hazirlandi.

## Kapsam ve Calisma Siniri

- Bu checklist vistaseeds reposu icin tutulur; duzenleme ve uyarlama sadece bu repo icinde yapilir.
- Odeme altyapisinin ana sahipligi ortak paketlerdedir (`@agro/shared-backend` ve ilgili ortak moduller).
- Ortak paketteki odeme backend kodlari paketlerden cekilecektir; vistaseeds tarafinda sadece entegrasyon, env, route baglari, UI ve dokumantasyon uyarlari yapilmalidir.
- `packages/*` veya diger global ortak paketlere bu repo icinden mudahale edilmez.
- BereketFide tarafinda ortak paketler uzerinde Claude AI calistigi icin ortak paket degisikliklerinde oncelik oradadir; vistaseeds bekleyen/uyarlayan taraf olarak ele alinir.
- Bu dokumandaki `[x]` durumu, ilgili davranisin vistaseeds entegrasyonunda kullanima hazir oldugu anlamina gelir; uygulama kodunun dogrudan bu repoda bulunmasi zorunlu degildir.

Durum etiketleri:

- `[x]` Kodda var
- `[~]` Kismen var / riskli
- `[ ]` Eksik

## Desteklenen Odeme Saglayicilari

| Saglayici | Callback URL |
|---|---|
| Craftgate | `POST /api/v1/orders/payment/card/craftgate/callback` |
| Is Bankasi NestPay | `POST /api/v1/orders/payment/card/nestpay_isbank/ok` ve `/fail` |
| Halk Ode | `POST /api/v1/orders/payment/card/halkode/ok`, `/fail`, `/webhook` |
| ZiraatPay | `POST /api/v1/orders/payment/card/ziraatpay/ok` ve `/fail` |
| Iyzico | `POST /api/v1/orders/payment/iyzico/callback` |

## 1. Odeme Akisi

- `[x]` Siparis olusturulunca `orders.status = pending`, `orders.payment_status = unpaid` oluyor.
- `[x]` Kredi odemesinde basarili sonuc `payment_status = paid`, `status = confirmed` olarak isleniyor.
- `[x]` Iyzico ve kart callback'lerinde basarili sonuc `payment_status = paid`, `status = confirmed` olarak isleniyor.
- `[x]` Basarisiz callback sonucunda `payment_status = failed` oluyor.
- `[~]` Basarisiz odemede siparis status'u `pending` kalabiliyor; "payment_failed" gibi ayri bir siparis status'u yok.
- `[~]` Havale seceneginde sadece `payment_method = bank_transfer`, `payment_status = pending` isaretleniyor; manuel onay akisi yok.

## 2. Callback Dogrulama ve Guvenlik

- `[x]` Iyzico callback'inde `token + conversationId` ile Iyzico'dan tekrar sorgu cekiliyor (body'e kör güvenilmiyor).
- `[x]` Halk Ode callback/webhook akisinda hash dogrulamasi yapiliyor.
- `[x]` ZiraatPay callback'inde callback payload yerine server-side status sorgusu kullaniliyor.
- `[~]` Craftgate callback'inde dogrudan imza/hash kontrolu yok; checkout detayi Craftgate API'den tekrar okunuyor.
- `[x]` Fake callback gelirse ve `payment_ref` eslesmiyorsa siparis bulunmuyor, odeme confirm edilmiyor.
- `[x]` Halk Ode hash tutmazsa islem reddediliyor.
- `[x]` Gecerli hash ile gelen ama siparis eslesmeyen callback `order_not_found` olarak reddediliyor.
- `[~]` Callback endpoint'leri public; IP allowlist veya ayri audit kaydi yok.

## 3. Siparis - Odeme Eslesmesi

- `[x]` Her odeme baslatmada yeni bir `payment_ref` uretiliyor ve `orders.payment_ref` alanina yaziliyor.
- `[x]` Callback'ler siparisi `payment_ref` uzerinden buluyor.
- `[x]` Siparis id ile odeme referansi ayrik tutuluyor.
- `[~]` `orders.payment_ref` icin index var ama unique constraint yok.
- `[x]` "Ayni siparis 2 kere odensin" kontrolu `pending` durumunu da kapsiyor; ikinci init backend tarafinda reddediliyor.
- `[x]` DB seviyesinde tekil `payment_ref` garantisi `payment_attempts.payment_ref` UNIQUE KEY'de tutuluyor.

## 4. Hata Senaryolari

- `[~]` Kullanici 3D ekranini kapatirsa callback gelmeyebilir; siparis `pending` + `payment_status = pending` olarak takili kalabilir.
- `[~]` Banka timeout/init hatasinda bazi akislarda `payment_status = failed` yapiliyor, ama her senaryo icin retry/polling yok.
- `[x]` Callback hic gelmeyen dis odemeler icin timeout cleanup isi eklendi (shared-backend payment-timeout.service).
- `[x]` Yari kalan odemeleri `expired` olarak isaretleyen ve siparisi `failed` durumuna ceken job var.
- `[x]` Kullaniciya "odeme sureci yarim kaldi" icin siparis detayinda ayri bilgilendirme ve tekrar dene/durum yenile aksiyonu eklendi.

## 5. Loglama ve Izleme

- `[~]` Kritik callback hatalari ve dogrulama problemleri `req.log.warn/error` ile loglaniyor.
- `[x]` Dis odeme init request bilgileri, callback payload'lari ve hata notlari `payment_attempts` tablosunda tutuluyor.
- `[x]` Banka/odeme saglayicisi callback sonucuna dair temel audit trail `payment_attempts`'te kalici.
- `[x]` Odeme denemeleri icin ayri izleme paneli eklendi (vistaseeds admin `payment_attempts` listeleme ekrani).

## 6. Test Senaryolari Checklist

- `[x]` Backend smoke test eklendi ve calisti: korumali odeme route'lari (`card/initiate`, `iyzico/initiate`, `bank-transfer`, `credit`) ile admin `payment_attempts` liste endpoint'leri doğrulandi.

### 6.1 Basarili Odeme

- `[ ]` Siparis olustur.
- `[ ]` Kredi ile odeme yap. Beklenen: `status = confirmed`, `payment_status = paid`, `payment_method = dealer_credit`
- `[ ]` Iyzico ile odeme yap. Beklenen: callback sonrasi `status = confirmed`, `payment_status = paid`
- `[ ]` Halk Ode ile 3D odeme yap. Beklenen: callback sonrasi `status = confirmed`, `payment_status = paid`
- `[ ]` Diger aktif kart saglayicilari icin 3D odeme yap (craftgate, nestpay_isbank, ziraatpay).

### 6.2 Basarisiz Odeme

- `[ ]` Iyzico fail callback senaryosu test et.
- `[ ]` Halk Ode webhook'unda banka red senaryosu test et.
- `[ ]` Diger kart saglayicilarinda bankadan red al.
- `[ ]` Beklenen: `payment_status = failed`, siparis kaydi silinmiyor.

### 6.3 Iptal / Vazgecme

- `[ ]` Kullanici 3D sayfasini kapatin; callback gelmediginde siparisin ne kadar sure `pending` kalacagini belirleyin.
- `[ ]` Manuel iptal islemi sadece `status = pending` iken calisiyor mu kontrol et.
- `[ ]` Baslamis ama tamamlanmamis odeme varken siparis iptali politikasini netlestirin.

### 6.4 Iade

- `[ ]` Payment provider tarafinda refund endpoint'i var mi teyit et.
- `[ ]` Backend'de refund API/servisi ekle.
- `[ ]` Siparis, cari hareket ve stok etkisi tasarla.
- `[ ]` Iade test senaryosu yaz ve uygula.

### 6.5 Taksitli Odeme

- `[ ]` Iyzico `enabledInstallments` ile taksit secimi test et.
- `[ ]` NestPay/ZiraatPay icin taksit parametresi test et.
- `[ ]` Frontend'de taksit secim UI ekle.
- `[ ]` Taksitli odeme sonucu tutar/komisyon kaydi dogru mu kontrol et.

## 7. Onerilen Sirali Aksiyonlar

- `[ ]` `FEATURE_BANK_CARD_PAYMENT=1` ve `PAYMENT_CARD_PROVIDER` env'ini doldur.
- `[ ]` Sandbox ortaminda bir saglayici ile test senaryolarini tamamla.
- `[x]` `payment_attempts` admin listeleme UI'ini ekle.
- `[ ]` Refund ve taksit kapsam kararini netlestir.
- `[ ]` Canli ortam bilgilerini `banka-pos-entegrasyon.md`'ye doldur ve `.env`'e aktar.

## 8. vistaseeds Repo Notlari

- `[x]` vistaseeds backend route yapisi ortak paket sahipligine gore duzenlenmeli; ortak paketten gelen `orders` ve `dealerFinance` kayitlari proje katmaninda ikinci kez register edilmemeli.
- `[x]` Frontend ve admin panelde banka karti odeme akisini acacak feature flag ve temel ekran uyarlari eklendi.
- `[x]` `payment_attempts` icin vistaseeds admin panelde temel izleme ekrani eklendi.

## 9. Frontend ve Admin Tarama Bulgulari

### 9.1 Frontend

- `[x]` Siparis detay odeme bileseni banka karti feature flag ve provider-agnostic init akisini kullanacak sekilde guncellendi.
- `[x]` Bayi siparis olusturma ekranina ortak paket uyumlu kart odeme init/fallback davranisi eklendi.
- `[x]` `NEXT_PUBLIC_FEATURE_BANK_CARD_PAYMENT` env flag'i frontend kodunda kullaniliyor.
- `[x]` Frontend API endpoint haritasina banka karti odeme init endpoint'i eklendi.
- `[x]` Siparis detay ekranindaki odeme yontemi metinleri aktif kart saglayicilarini kapsayacak sekilde genisletildi.
- `[~]` "Odeme sureci yarim kaldi", "3D callback bekleniyor", "provider redirect devam ediyor" durumlari icin temel bilgilendirme eklendi; ayri recovery ekranlari halen yok.

### 9.2 Admin Panel

- `[x]` Admin panel navigation ve permission yapisina `payment_attempts` modulu eklendi.
- `[x]` `admin_panel/src` altinda `payment_attempts` listeleme ve filtreleme endpoint/entegrasyon dosyalari eklendi.
- `[x]` Admin dashboard locale dosyasindaki eski odeme/cuzdan kalintilari temizlendi; aktif odeme izleme anahtarlari guncel hale getirildi.
- `[~]` Odeme callback hatalari, basarisiz denemeler ve `expired` kayitlar icin temel admin UI var; refund/taksit izlemesi halen yok.
