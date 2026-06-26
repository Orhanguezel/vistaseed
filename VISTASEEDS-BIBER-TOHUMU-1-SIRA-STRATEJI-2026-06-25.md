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
- [x] WhatsApp sipariş butonu + form kısaltma → ✅ canlı (commit `5921f5a` "WhatsApp ile siparis + 2 adimli form + aciliyet", `7d86f61` dönüşüm etiketi). Tepe stratejisi artık açılabilir.

### B · HIZLI — Search reklamı tepeye taşı (dönüşüm fix sonrası)
- [ ] **Teklif stratejisi → "Hedef Gösterim Payı: Sayfanın mutlak en üstü"**, hedef %60-80 (şu an mutlak-tepe %10). Bu doğrudan "1. reklam" demektir.
- [ ] **Bütçe artır** (bütçe-kayıp %31 → daha çok gösterim). Dönüşüm gelmeye başlayınca kademeli.
- [ ] **Kalite puanı (rank-kayıp %44'ün kökü):** ✅ final URL düzeltildi (redirect kalktı), ✅ negatif+odak yapıldı, ✅ jenerik kelime duraklatıldı. Kalan: landing/form (A maddesi) QS'i daha da yükseltir → CPC düşer, tepe ucuzlar.
- [x] **Kelime genişlet (biber):** ✅ change-set hazır → `VISTASEEDS-ADS-BIBER-KEYWORD-CHANGESET-2026-06-26.md` (çeşit ad group'ları + negatif liste + eşleme stratejisi + rakip kelime notu). Uygulama: sahip onayı sonrası Ads panelinden.
- **NOT:** Bu kanalda 1. olmak = en doğrudan ve hızlı yol. Saha reklamıyla da sinerji (marka bilinirliği → marka araması → daha ucuz dönüşüm).

### C · ORTA — SEO (kalıcı organik görünürlük, 1-3 ay)
> ✅ **Tam brief hazır → `CODEX-BRIEF-seo-biber-icerik.md`** (FIX C1-C5). Aşağıdaki maddeler o brief'te detaylandı.
> Mimari bulgu: dedike `/biber-tohumu` route'u YOK — kategori "Biber Çeşitleri" slug `biber-cesitleri` var ama `/urunler?category=` filtresi **noindex**. Brief yeni indexlenebilir landing açıyor: `/urunler/kategori/biber-cesitleri`.
- [x] **Kategori landing + içerik** → ✅ UYGULANDI (Claude): `/urunler/kategori/[slug]` indexlenebilir route + ~850 kelime içerik (customPages seed `194_*`, gerçek çeşit verisi). tsc+build temiz.
- [x] **ItemList/Breadcrumb JSON-LD** → ✅ UYGULANDI: landing'de ItemList+Breadcrumb; fiyatsız (Offer yok). Ürün detay zaten Product+Breadcrumb+FAQ üretiyor.
- [x] **Dahili linkleme (kısmi)** → ✅ ürün listesi→kategori landing + landing→/siparis-ver CTA + sitemap kategori landing'leri. Kalan: blog + ekim-rehberi→landing (içerik güncellemesi).
- [ ] **İçerik/blog:** "biber tohumu nasıl ekilir", "F1 vs ata biber tohumu", "en verimli biber çeşitleri" (SERP'te bu sorgular + video var).
- [ ] **GSC:** sitemap'te biber sayfaları, indexleme talebi; başlık/H1/meta = "Biber Tohumu Çeşitleri | F1 Hibrit | VistaSeeds".
- [ ] Backlink/otorite: sektör dizinleri, referanslar, GBP (Google Business Profile).

### D · İÇERİK / GEO (SERP'te video+görsel paketi var)
- [ ] **Video:** Instagram/YouTube'a biber tohumu ekim/çimlendirme/çeşit videoları (SERP'te Instagram/Facebook/YouTube videoları ilk sayfada). Sosyal medya yönetimi ile.
- [ ] **Görseller:** biber çeşit görselleri alt-metinli, dosya adı SEO'lu.
- [ ] **GEO/llms.txt** (mevcut llms.txt var) — AI aramalarda görünürlük.

### E · KARAR — Google Shopping (perakende?)
SERP'in en büyük alanı Shopping. Girmek için **perakende ürün + fiyat** gerekir.
- [x] **İş kararı (2026-06-26): TEKLİF modeli kalsın.** Perakende AÇILMAYACAK → Shopping/Merchant ATLANIR. Odak: **B (reklam tepe) + C (SEO içerik+schema) + D (video/GEO)**.
  - Retail yeteneği yine de flag-arkası hazırlanıyor (`CODEX-BRIEF-retail-faz1.md`, `retail_enabled=false` default) → ileride sahip "aç" derse tek flag ile açılır; bugün public değişmez.

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
- [ ] B: Hedef Gösterim Payı (mutlak tepe) + bütçe → **spend kararı, sahip onayı bekliyor** (change-set'e dahil değil).
- [x] B: biber kelime genişletme → ✅ `VISTASEEDS-ADS-BIBER-KEYWORD-CHANGESET-2026-06-26.md` (onay sonrası uygula).
- [x] C: schema/meta + içerik kod brief → ✅ `CODEX-BRIEF-seo-biber-icerik.md` (Codex implement edecek).
- [x] E kararı: teklif modeli → retail flag-arkası brief → ✅ `CODEX-BRIEF-retail-faz1.md` (default kapalı).
İlgili: `ekosistem-sosyal-medya/yapilacak-isler/vistaseeds/`.
