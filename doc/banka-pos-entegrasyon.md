# Banka Sanal POS — Entegrasyon Bilgileri (vistaseeds)

Bu dosya, vistaseeds.com.tr icin banka sanal POS sozlesmesi sirasinda ve sonrasinda
bankadan/Craftgate'ten alinacak tum teknik bilgileri tutar.

Bilgiler tamamlandikca `backend/.env` dosyasina aktarilir, bu dosya sadece referans olarak saklanir.
**Bu dosyayi asla commit etmeyin. `.gitignore`'da oldugunden emin olun.**

---

## 1. Craftgate (Oncelikli — 15+ banka tek entegrasyonla)

Craftgate ile banka sozlesmesi beklenmeden sandbox test yapilabilir.
Canliya gecmek icin Craftgate uyeligi ve banka anlasmas (Craftgate uzerinden) gerekir.

- Uyelik / iletisim: https://craftgate.io/tr/iletisim/
- Sandbox panel: https://sandbox-merchant.craftgate.io
- Dokumantasyon: https://developer.craftgate.io/en/api/

| Alan | Deger | Nerede bulunur |
|---|---|---|
| `CRAFTGATE_API_KEY` | | Craftgate merchant panel → API Anahtarlari |
| `CRAFTGATE_SECRET_KEY` | | Craftgate merchant panel → API Anahtarlari |
| `CRAFTGATE_BASE_URL` | `https://sandbox-api.craftgate.io` | Sandbox. Canli: `https://api.craftgate.io` |

**Callback URL (bankaya/Craftgate'e bildirilecek):**
```
https://www.vistaseeds.com.tr/api/v1/orders/payment/card/craftgate/callback
```

---

## 2. Is Bankasi — NestPay (EstV3Pos)

Sanal POS turu: **Imece POS** (tarim urunleri isyeri icin faizsiz taksit avantaji)

- Basvuru: Sube veya IsCep → "Aninda POS Basvurusu"
- Sanal POS paneli (sozlesme sonrasi): https://sanalpos.isbank.com.tr
- Imece POS basvurusu ayrica yapilir — standart sanal POS sozlesmesinden farklidir.

| Alan | Deger | Nerede bulunur |
|---|---|---|
| `NESTPAY_ISBANK_MERCHANT_ID` | | Panel sag ust kose — Uye Isyeri No |
| `NESTPAY_ISBANK_API_USER` | | Panel → Yonetim → Yeni Kullanici Ekle |
| `NESTPAY_ISBANK_API_PASS` | | Panel → Yonetim → Yeni Kullanici Ekle |
| `NESTPAY_ISBANK_STORE_KEY` | | Panel → Yonetim → 3D Ayarlari → Guvenlik Anahtari |
| `NESTPAY_ISBANK_API_URL` | `https://sanalpos.isbank.com.tr/fim/api` | Sabit |
| `NESTPAY_ISBANK_3D_URL` | `https://sanalpos.isbank.com.tr/fim/est3Dgate` | Sabit |

**Zorunlu adimlar:**
- [ ] Sunucu IP adresini bankaya bildirin (IP whitelist zorunlu)
- [ ] Terminal ID'yi panel → Yonetim → Uye Isyeri Terminal Bilgisi'nden not alin
- [ ] Imece POS sozlesmesi icin ayrica basvurun (tarimsal faizsiz donem icin)

**Callback URL'leri (bankaya bildirilecek):**
```
OK:   https://www.vistaseeds.com.tr/api/v1/orders/payment/card/nestpay_isbank/ok
FAIL: https://www.vistaseeds.com.tr/api/v1/orders/payment/card/nestpay_isbank/fail
```

---

## 3. Halk Ode / CCPayment

- Canli sunucu ekrani: `https://app.halkode.com.tr/ccpayment`
- Backend `halkode` provider adini destekliyor.

| Alan | Deger | Nerede bulunur |
|---|---|---|
| `HALKODE_MERCHANT_ID` | | Panel → Uye Isyeri ID |
| `HALKODE_API_USER` | | Panel → Uygulama Anahtari |
| `HALKODE_API_PASS` | | Panel → Uygulama Parolasi |
| `HALKODE_STORE_KEY` | | Panel → Uyeisyeri Anahtari |
| `HALKODE_3D_URL` | `https://app.halkode.com.tr/ccpayment` | Panel → Canli Sunucu |

**Callback URL'leri (panelde tanimlanacak):**
```
OK:      https://www.vistaseeds.com.tr/api/v1/orders/payment/card/halkode/ok
FAIL:    https://www.vistaseeds.com.tr/api/v1/orders/payment/card/halkode/fail
WEBHOOK: https://www.vistaseeds.com.tr/api/v1/orders/payment/card/halkode/webhook
```

---

## 4. Ziraat Bankasi — ZiraatPay REST API v2

- Sanal POS (Basak POS): https://www.bankkartpos.com.tr
- ZiraatPay API dokumantasyonu: https://vpos.ziraatpay.com.tr/ziraatpay/api/v2/doc
- Developer portal: https://developers.ziraatbank.com.tr

| Alan | Deger | Nerede bulunur |
|---|---|---|
| `ZIRAATPAY_MERCHANT` | | Sozlesme sonrasi ZiraatPay panel → Merchant kodu |
| `ZIRAATPAY_MERCHANT_USER` | | ZiraatPay panel → API kullanici adi |
| `ZIRAATPAY_MERCHANT_PASSWORD` | | ZiraatPay panel → API sifresi |
| `ZIRAATPAY_BASE_URL` | `https://test.ziraatpay.com.tr/ziraatpay/api/v2` | Test. Canli: `https://vpos.ziraatpay.com.tr/ziraatpay/api/v2` |

**Test kartlari (gelistirme ortami icin):**
| Kart | No | Son Kullanma | CVV | 3D Sifre |
|---|---|---|---|---|
| Ziraat VISA | 4546711234567894 | 12/2026 | 000 | a |
| Ziraat MASTER | 5401341234567891 | 12/2026 | 000 | a |

**Callback URL'leri (bankaya bildirilecek):**
```
OK:   https://www.vistaseeds.com.tr/api/v1/orders/payment/card/ziraatpay/ok
FAIL: https://www.vistaseeds.com.tr/api/v1/orders/payment/card/ziraatpay/fail
```

---

## Aktivasyon Ozeti

Bilgiler doldurulunca `backend/.env`'e sunlari ekleyin:

```bash
FEATURE_BANK_CARD_PAYMENT=1
PAYMENT_CARD_PROVIDER=craftgate   # veya: nestpay_isbank | halkode | ziraatpay

HALKODE_MERCHANT_ID=
HALKODE_API_USER=
HALKODE_API_PASS=
HALKODE_STORE_KEY=
HALKODE_3D_URL=https://app.halkode.com.tr/ccpayment
```

Frontend icin `frontend/.env`:
```bash
NEXT_PUBLIC_FEATURE_BANK_CARD_PAYMENT=1
```
