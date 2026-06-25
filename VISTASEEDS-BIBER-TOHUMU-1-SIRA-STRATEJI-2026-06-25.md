# VistaSeeds — "Biber Tohumu" Google'da 1. Sıra Stratejisi

> Tarih: 2026-06-25 · ⚡ SEZON ZİRVE · Hedef: "biber tohumu" aramasında en üstte olmak

## SERP gerçeği (mevcut durum analizi)
"biber tohumu" araması incelendi. Sayfa şöyle diziliyor:
1. **Google Shopping karuseli (en tepe, en büyük alan):** Farmer Life/Arzuman (€1,70), Amazon. **Fiyatlı ürün listeleri.**
2. **Organik sonuçlar:** zengarden, e-fidancim, tohumcenneti, trendyol, şenköy/tohumtaş, asgen, intfarming, fidedeposu, amazon, mutbirlik, tohumbaba, tohumgelsin...
3. Video + görsel paketleri (Instagram/YouTube/Facebook).

**VistaSeeds hiçbir alanda yok.**

### Ölçülen durum (2026-06-25)
| Kanal | Durum |
|---|---|
| Organik (GSC) | **"biber tohumu"da SIFIR görünürlük** (28g'de tek biber/tohum sorgusu yok). Ürün sayfaları var (`/tr/biber-tohumu`) ama sıralanmıyor — yeni site, otorite yok. |
| Google Shopping | **YOK** (Merchant feed yok). Site **fiyatsız/teklif modeli** → Shopping'e doğrudan uygun değil. |
| Search Ads | Var ama zayıf: gösterim payı %25, **mutlak-tepe %10**, rank-kayıp %44. |

## DÜRÜST GERÇEK — "1. sıra" ne anlama gelir?
- **Organik 1. sıra bu sezon GERÇEKÇİ DEĞİL** (sıfır otorite, yerleşik rakipler — SEO 3-6 ay).
- **Google Shopping karuseli model uyumsuz** (perakende fiyat yok; teklif modeli). Shopping'e girmek = perakende ürün+fiyat eklemek (iş modeli kararı).
- **HIZLI ulaşılabilir "1. sıra" = 1. Google Search REKLAM pozisyonu** (en üst reklam slotu). Bu birkaç günde mümkün.

→ Strateji: **kısa vade reklamla tepe + orta vade SEO/Shopping ile kalıcı görünürlük.**

---

## STRATEJİ (önceliklendirilmiş)

### A · ÖNKOŞUL — Dönüşüm akışı (yoksa tepe = para yakmak)
2.459 reklam tıklaması → 0 sipariş. Tepeye çıkıp daha çok tık almak, dönüşüm olmadan **daha hızlı bütçe yakar**. ÖNCE:
- [ ] WhatsApp sipariş butonu + form kısaltma → bkz `VISTASEEDS-SIPARIS-DONUSUM-BRIEF-2026-06-25.md`
- **Bu olmadan tepe stratejisi açılmamalı.**

### B · HIZLI — Search reklamı tepeye taşı (dönüşüm fix sonrası)
- [ ] **Teklif stratejisi → "Hedef Gösterim Payı: Sayfanın mutlak en üstü"**, hedef %60-80 (şu an mutlak-tepe %10). Bu doğrudan "1. reklam" demektir.
- [ ] **Bütçe artır** (bütçe-kayıp %31 → daha çok gösterim). Dönüşüm gelmeye başlayınca kademeli.
- [ ] **Kalite puanı (rank-kayıp %44'ün kökü):** ✅ final URL düzeltildi (redirect kalktı), ✅ negatif+odak yapıldı, ✅ jenerik kelime duraklatıldı. Kalan: landing/form (A maddesi) QS'i daha da yükseltir → CPC düşer, tepe ucuzlar.
- [ ] **Kelime genişlet (biber):** kapya/çarliston/sivri/dolmalık/acı + "F1 biber tohumu", "hibrit biber tohumu", "[şehir] biber tohumu", yarış+marka ("arzuman biber tohumu" — dikkatli).
- **NOT:** Bu kanalda 1. olmak = en doğrudan ve hızlı yol. Saha reklamıyla da sinerji (marka bilinirliği → marka araması → daha ucuz dönüşüm).

### C · ORTA — SEO (kalıcı organik görünürlük, 1-3 ay)
Ürün sayfaları var ama sıralanmıyor. Kazanmak için:
- [ ] **`/tr/biber-tohumu` kategori sayfası içerik zenginleştir:** 800+ kelime özgün içerik (çeşitler, ekim, F1/hibrit, bölge/sezon, sık sorular). Rakipler (zengarden/e-fidancim) bunu yapıyor.
- [ ] **Product/ItemList JSON-LD schema** (her biber çeşidi için ad/açıklama/görsel; fiyat yoksa `offers` yerine `availability`/marka). `lib/schema-org.ts` mevcut — biber ürünlerine uygula.
- [ ] **Dahili linkleme:** anasayfa + blog + ekim-rehberi → /biber-tohumu. Biber çeşit sayfaları arası link.
- [ ] **İçerik/blog:** "biber tohumu nasıl ekilir", "F1 vs ata biber tohumu", "en verimli biber çeşitleri" (SERP'te bu sorgular + video var).
- [ ] **GSC:** sitemap'te biber sayfaları, indexleme talebi; başlık/H1/meta = "Biber Tohumu Çeşitleri | F1 Hibrit | VistaSeeds".
- [ ] Backlink/otorite: sektör dizinleri, referanslar, GBP (Google Business Profile).

### D · İÇERİK / GEO (SERP'te video+görsel paketi var)
- [ ] **Video:** Instagram/YouTube'a biber tohumu ekim/çimlendirme/çeşit videoları (SERP'te Instagram/Facebook/YouTube videoları ilk sayfada). Sosyal medya yönetimi ile.
- [ ] **Görseller:** biber çeşit görselleri alt-metinli, dosya adı SEO'lu.
- [ ] **GEO/llms.txt** (mevcut llms.txt var) — AI aramalarda görünürlük.

### E · KARAR — Google Shopping (perakende?)
SERP'in en büyük alanı Shopping. Girmek için **perakende ürün + fiyat** gerekir.
- [ ] **İş kararı:** VistaSeeds perakende paket (fiyatlı, sepetli) satacak mı? Evet ise → Merchant Center feed + Shopping kampanyası (en büyük görünürlük sıçraması). Hayır (sadece B2B/teklif) ise → Shopping atlanır, B+C+D'ye odaklanılır.

---

## ÖZET — gerçekçi yol haritası
| Vade | Aksiyon | Sonuç |
|---|---|---|
| **Bu hafta** | A (dönüşüm fix) + B (tepe reklam) | "1. reklam" pozisyonu + tıklayan sipariş veriyor |
| **2-4 hafta** | C (SEO içerik+schema) başlat | Organik tırmanış başlar |
| **1-3 ay** | C devam + D (video/içerik) | Organik ilk sayfa hedefi |
| **Karar** | E (Shopping) — perakende ise | Shopping karuselinde görünürlük |

**"Organik 1. sıra"yı tek başına bu hafta vaat etmek gerçekçi değil; ama reklam tepesi + dönüşüm fix ile bu hafta sayfanın en üstünde olabiliriz ve sipariş alabiliriz.**

## Ekosistem tarafı (Claude Code yapacak — onayla)
- [ ] B: Hedef Gösterim Payı (mutlak tepe) + bütçe (onay gerekir — spend kararı)
- [ ] B: biber kelime genişletme (change-set)
- [ ] C: schema/meta önerileri (kod brief)
İlgili: `ekosistem-sosyal-medya/yapilacak-isler/vistaseeds/`.
