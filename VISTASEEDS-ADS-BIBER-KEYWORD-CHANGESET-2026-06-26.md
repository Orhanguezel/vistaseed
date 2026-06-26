# VistaSeeds — Ads "Biber" Kelime Genişletme Change-Set

> Tarih: 2026-06-26 · Kaynak: `VISTASEEDS-BIBER-TOHUMU-1-SIRA-STRATEJI-2026-06-25.md` B maddesi.
> Hesap: MCC 520-099-4833 → 702-033-4476 (3 marka ortak). Kampanya: VistaSeeds Search "Biber".
> İş modeli: TEKLİF (fiyatsız). Landing = ürün detay / yeni biber kategori landing (`/urunler/kategori/biber-cesitleri`).
> **Uygulama spend etkiler → sahip onayı sonrası ekosistem panelinden/Ads API ile uygulanır. Bu dosya hazır change-set.**

## Bağlam (ölçülen)
- "biber tohumu"da GSC görünürlüğü SIFIR; Search reklamı var ama mutlak-tepe %10, rank-kayıp %44.
- Dönüşüm fix (WhatsApp) ✅ canlı → tepe stratejisi açılabilir.
- Hedef: çeşit-bazlı (kapya/çarliston/sivri…) + nitelik (F1/hibrit) uzun-kuyruk → daha ucuz, daha alakalı, daha yüksek QS.

---

## 1 · Eklenecek kelimeler (ad group bazlı)

### Ad Group: Biber — Genel
| Keyword | Eşleme |
|---|---|
| biber tohumu | Phrase |
| biber tohumu fiyatları | Phrase |
| biber tohumu çeşitleri | Phrase |
| hibrit biber tohumu | Phrase |
| f1 biber tohumu | Phrase |
| tohumluk biber | Phrase |
| sertifikalı biber tohumu | Phrase |
| [biber tohumu] | Exact |
| [f1 biber tohumu] | Exact |

### Ad Group: Biber — Kapya
| Keyword | Eşleme |
|---|---|
| kapya biber tohumu | Phrase |
| f1 kapya biber tohumu | Phrase |
| kapia biber tohumu | Phrase |
| [kapya biber tohumu] | Exact |

### Ad Group: Biber — Çarliston / Sivri
| Keyword | Eşleme |
|---|---|
| çarliston biber tohumu | Phrase |
| charliston biber tohumu | Phrase |
| sivri biber tohumu | Phrase |
| acı sivri biber tohumu | Phrase |
| [çarliston biber tohumu] | Exact |

### Ad Group: Biber — Dolmalık / Acı
| Keyword | Eşleme |
|---|---|
| dolmalık biber tohumu | Phrase |
| dolma biberi tohumu | Phrase |
| acı biber tohumu | Phrase |
| sera biber tohumu | Phrase |
| [dolmalık biber tohumu] | Exact |

> Not: Her ad group, ilgili landing'e (çeşit kategori landing veya en yakın ürün detay) yönlendirilir. Final URL'de redirect OLMAYACAK (QS koruması — rank-kayıp kökü zaten düzeltildi).

## 2 · Negatif kelimeler (bütçe koruma)
Ekle (Campaign-level negatif liste "Biber - Genel Negatif"):
```
nasıl ekilir
ne zaman ekilir
yetiştirme
fidesi
fide fiyatları
çorba
yemek tarifi
turşu
kurutulmuş
salça
faydaları
kalori
oyun
resimleri
boyama
```
Gerekçe: "biber tohumu nasıl ekilir / yetiştirme" = bilgi amaçlı (organik blog hedefi, reklam değil); "fide/salça/turşu/tarif" = alakasız niyet. Bunlar bütçeyi yakıyor.

## 3 · Rakip/marka kelimeler (DİKKATLİ — opsiyonel, ayrı ad group)
| Keyword | Eşleme | Not |
|---|---|---|
| arzuman biber tohumu | Phrase | Rakip markası — yasal sınırda, reklam metninde rakip adı KULLANMA |
| yüksel tohum biber | Phrase | Rakip (`@yukseltohum`) — sadece keyword, metinde marka geçmez |

> Marka-rakip kelimelerde reklam **metninde** rakip markası geçemez (Google politika + marka hakkı). Sadece tetikleyici keyword. CPC yüksek olabilir → küçük bütçe + izle.

## 4 · Eşleme türü stratejisi
- **Broad KULLANMA** (yeni hesap, düşük QS, bütçe sızıntısı riski). Phrase + Exact yeterli.
- Exact = en yüksek niyet (çeşit + "tohumu"); Phrase = uzun-kuyruk yakalama.
- 2-4 hafta sonra arama terimleri raporundan: iyi performans → Exact'e terfi; alakasız → negatif.

## 5 · Reklam metni notu (QS yükseltir)
- Başlık çeşit-spesifik: "F1 Kapya Biber Tohumu", "Çarliston Biber Tohumu" (keyword ↔ başlık ↔ landing H1 uyumu = yüksek QS).
- Açıklama: hibrit/verim/sertifikalı + "Hemen teklif/sipariş" (WhatsApp CTA — dönüşüm fix ile uyumlu).
- Sitelink: çeşit kategori landing'leri.

---

## Uygulama sırası (onay sonrası)
1. Negatif liste (#2) — ÖNCE (anında bütçe koruması, risk yok).
2. Çeşit ad group'ları (#1) + çeşit-spesifik metin (#5).
3. Match type izleme (#4) — 2 hafta sonra arama terimi temizliği.
4. Rakip kelimeler (#3) — küçük bütçe, ayrı, opsiyonel, izlenerek.

> ⚠️ #1-#3 spend artırır. `VISTASEEDS-RETAIL-AKTIVASYON-PLAN-2026-06-25.md`'deki bütçe onayı (2026-06-25) kapsamında; çeşit genişletme + negatif liste **bütçeyi büyütmeden** alaka/QS yükseltir (CPC düşürücü). Hedef Gösterim Payı (mutlak tepe) ayrı spend kararı — bu change-set'e dahil değil.
