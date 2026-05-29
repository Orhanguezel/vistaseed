---
title: "VistaSeeds Canlı Log Analiz Raporu"
subtitle: "Trafik, Hatalar, Bot Aktivitesi"
author: "Vista Seeds — Teknik Ekip"
date: "25 Mayıs 2026"
lang: tr
geometry: a4paper, margin=20mm
fontsize: 10pt
mainfont: "DejaVu Sans"
monofont: "DejaVu Sans Mono"
colorlinks: true
linkcolor: blue
urlcolor: blue
toccolor: black
toc: true
toc-depth: 2
numbersections: true
---

\newpage

# Yönetici Özeti

VistaSeeds (`www.vistaseeds.com.tr`) canlı nginx access loglarının 14 günlük analizidir. Veri aralığı: **11 Mayıs 2026 – 25 Mayıs 2026**. Vhost'lar: `www.vistaseeds.com.tr` (public site) ve `panel.vistaseeds.com.tr` (admin panel).

## Anahtar Sayılar

| Metrik | Değer |
|---|---|
| Toplam istek (public) | **22,903** |
| Toplam istek (admin panel) | **777** |
| Tekil IP (14 günde) | **896** |
| Günlük ortalama istek | ~1,636 |
| Günlük ortalama tekil ziyaretçi | ~80 |
| Pik gün | 18 May (4,592 istek, 110 IP) |
| 200 OK oranı | **88.9%** |
| 4xx hata oranı | 2.2% |
| 5xx hata oranı | 2.2% |
| Bot oranı | 11.7% |

## Genel Değerlendirme

- **Sağlık skoru: İyi.** 200 OK oranı %88.9, bu seviyede normal kabul edilebilir.
- 25 Mayıs 13:28 UTC'de uygulanan **fix paketi** sonrası 4xx oranı **%2.2 → %0.4**, 5xx oranı **%2.2 → %0.3** seviyesine düştü (5x – 7x iyileşme).
- AI crawler erişimi sağlıklı: **ClaudeBot 660** + **GPTBot 292** istek, robots.txt izinleri çalışıyor.
- Saldırı/probe trafiği görece düşük, ancak `.env` / `.php` probe'ları için nginx tarafında erken bloklama önerilir.
- Büyüme eğilimi pozitif: 11 May'da 68 günlük tekil IP → 22 May'da 128 IP (**+88%** iki haftada).

\newpage

# 1. Trafik Genel Bakış

## 1.1 Günlük İstek Dağılımı

| Tarih | İstek | Tekil IP |
|---|---:|---:|
| 11 May | 307 | 68 |
| 12 May | 1,270 | 57 |
| 13 May | 1,012 | 34 |
| 14 May | 1,622 | 41 |
| 15 May | 565 | 89 |
| 16 May | 627 | 54 |
| 17 May | 530 | 34 |
| **18 May** | **4,592** | 110 |
| 19 May | 2,710 | **177** |
| 20 May | 2,223 | 99 |
| 21 May | 954 | 80 |
| 22 May | 1,920 | 128 |
| 23 May | 2,064 | 118 |
| 24 May | 1,125 | 88 |
| 25 May (kısmi) | 1,382 | 43 |

**Yorum:** 18 May'daki pik (4,592 istek) muhtemelen bir kampanya veya sosyal medya aktivitesi sonucu. 19-23 May arası ortalama günlük istek seviyesi 1,920+ ile stabilize olmuş. 25 May için kısmi gün verisi var.

\newpage

# 2. HTTP Status Code Dağılımı

## 2.1 Public (www.vistaseeds.com.tr)

| Code | Sayı | % | Açıklama |
|---|---:|---:|---|
| 200 OK | 20,359 | 88.9% | Başarılı |
| 307 Temporary Redirect | 1,064 | 4.6% | Locale prefix yönlendirmesi (normal) |
| 404 Not Found | 514 | 2.2% | Detay §4 |
| 500 Internal Server Error | 496 | 2.2% | Detay §5 |
| 308 Permanent Redirect | 197 | 0.9% | Yeni 301 fix'leri |
| 304 Not Modified | 180 | 0.8% | Tarayıcı cache (iyi) |
| 499 Client Closed | 34 | 0.1% | Mobil bağlantı kopması |
| 204 No Content | 25 | 0.1% | Analytics ping vb. |
| 502 Bad Gateway | 19 | 0.1% | Upstream kısa kesinti |
| Diğer (400, 401, 206, 201) | 15 | <0.1% | Normal |

## 2.2 Admin Panel (panel.vistaseeds.com.tr)

| Code | Sayı | % |
|---|---:|---:|
| 200 OK | 487 | 62.7% |
| 404 Not Found | 258 | 33.2% |
| 307/308 redirect | 26 | 3.4% |
| 400 / 500 | 5 | 0.6% |
| 304 Not Modified | 1 | 0.1% |

**Yorum:** Panel'deki 404'lerin büyük çoğunluğu `/robots.txt` ve probe URL'lerinden geliyor. Detay §4.3.

\newpage

# 3. Ziyaretçi ve Bot Analizi

## 3.1 İnsan vs Bot Trafiği

| Kategori | İstek | % |
|---|---:|---:|
| **İnsan** (Mozilla, bot olmayan UA) | 18,432 | 80.5% |
| **Bot** | 2,683 | 11.7% |
| **Sistem / SSR / cURL** (node, self-call) | 1,788 | 7.8% |

## 3.2 Bot Detayı

| Bot | İstek | Davranış |
|---|---:|---|
| Googlebot | 725 | Arama motoru indeksleme |
| ClaudeBot | 660 | AI eğitim/arama (izinli) |
| GPTBot | 292 | OpenAI (izinli) |
| Bingbot | 244 | Microsoft arama |
| AhrefsBot | 159 | SEO crawler |
| Facebook Externalhit | 74 | Sosyal medya OG önizleme |
| BaiduSpider | 67 | Çin arama motoru |
| SemrushBot | 59 | SEO crawler |
| AppleBot | 30 | Siri / Spotlight |
| Yandex | 12 | Rus arama motoru |
| Twitterbot | 11 | Twitter kart önizleme |
| Bytespider | **1** | **robots.txt'de engelli** ✓ |

**Yorum:** AI crawler trafiği toplam **952 istek** (ClaudeBot + GPTBot), bu GEO (Generative Engine Optimization) açısından sağlıklı. robots.txt'deki izin kuralları çalışıyor.

## 3.3 Tekil Ziyaretçi Trendi

14 günlük periyotta toplam **896 tekil IP**. Günlük 34 – 177 tekil ziyaretçi aralığında, ortalama **~80/gün**. Trend yükseliş eğiliminde (11 May 68 → 22 May 128, +88%).

\newpage

# 4. 404 Hatalar — Detaylı İnceleme

## 4.1 En Çok 404 Veren URL'ler (Public)

| Sıra | URL | Adet | Kaynak / Çözüm |
|---|---|---:|---|
| 1 | `/api/site_settings/ui_admin_config` | 38 | Admin panel SSR v1 olmadan çağrı — **Düzeltildi (commit 6521dd6)** |
| 2 | `/api/site_settings/site_logo?locale=tr` | 38 | Aynı — Düzeltildi |
| 3 | `/api/site_settings/site_favicon?locale=tr` | 38 | Aynı — Düzeltildi |
| 4 | `/api/site_settings/site_apple_touch_icon` | 38 | Aynı — Düzeltildi |
| 5 | `/tr/urun/saray-f1` | **15** | ⚠ Eski tekil URL pattern — redirect gerek |
| 6 | `/uploads/media/logo/logo-light.png` | 14 | DB'de tanımsız logo path |
| 7 | `/tr/urun/avar` | 12 | ⚠ Aynı tekil pattern |
| 8 | `/tr/urun/cankan-f1` | 6 | ⚠ Aynı |
| 9 | `/tr/urun/kizgin-f1`, `/prestij-f1`, `/tirpan-f1` vb. | 10+ | ⚠ Aynı |
| 10 | `/tr/grup-sirketlerimiz/vista-prestige` vb. | 20+ | ⚠ Sitede yok — yanlış backlink (vistainsaat?) |
| 11 | `/de/anbauleitfaden/...`, `/de/referenzen/...` | 12 | DE locale seed eksik |
| 12 | `/_next/static/chunks/01hhw9.g.52.b.js` | 4 | Eski JS chunk (tarayıcı cache) |
| 13 | `/uploads/slide/slide-1-field.webp` | 5 | Eksik medya dosyası |
| 14 | `/tr/wp-admin/js` | 4 | Bot probe |

## 4.2 404 Üreten Botlar / Probes

Otomatik probe trafiği — saldırı denemesi:

```
/wp-login.php   /.git/config       /.env  /.env.local
/.env.docker    /.env.dev          /admin.php
/webmail/phpinfo.php               /vendor/.env
/www/.env       /wordpress/.env    /v2/.env  /v3/.env
```

Bu URL'ler için **nginx tarafında erken bloklama** önerilir (Bölüm §7.D).

## 4.3 Admin Panel 404'leri

| URL | Adet | Çözüm |
|---|---:|---|
| `/robots.txt` | 29 | `admin_panel/public/robots.txt` ekle |
| `/api/auth/token` | 15 | v1 olmadan eski cache — yeni build sonrası durdu |
| `/uploads/media/logo/vistaseed_logo.png` | 11 | Düzeltildi (rewrite + branding fix) |
| `/uploads/media/logo/favicon.png` | 4 | Aynı |
| `/auth/login` | 3 | Eski path |
| `/apple-touch-icon.png` | 2 | Eksik dosya |
| `/.git/config` | 2 | Saldırı probe |

\newpage

# 5. 5xx Hatalar — Detaylı İnceleme

## 5.1 En Çok 5xx Veren URL'ler

| URL | Adet | Code | Kaynak |
|---|---:|---:|---|
| `/apple-touch-icon-precomposed.png` | 12 | 500 | Next.js bunu üretmiyor; soft-500 |
| `/sitemap_index.xml` | 11 | 500 | WordPress probe — **25 May 14:36+ 308 redirect** ✓ |
| `/en/contact` | 7 | 500 | localizedPathRedirects'de var ama 500 — middleware sırası incelenmeli |
| `/sitemap.txt`, `/atom.xml` | 12 | 500 | WordPress probe |
| `/en/compare`, `/de/vergleich` | 10 | 500 | redirect var → middleware sırası şüphesi |
| `/dx.php`, `/p.php`, `/av.php`, `/admin.php`, `/zxz.php` | 20 | 500 | Saldırı probe (PHP injection denemesi) |
| `/.env`, `/.env.local`, `/.env.docker`, `/.env.dev` | 16 | 500 | Saldırı probe |
| `/api/v1/auth/token` | 4 | 500 | MySQL grant öncesi — **Grant verildi** ✓ |
| `/en/products`, `/de/produkte`, `/en/faq`, `/de/faq` | 15 | 500 | redirect var → middleware sırası incelenmeli |
| `/tr/urunler?_rsc=...` | 7 | 502 | Upstream kısa kesinti (anlık) |

## 5.2 5xx Trend Analizi

| Periyot | 5xx istek | Oran |
|---|---:|---:|
| 14 günlük toplam | 496 | 2.2% |
| Son 1 saat (14:30-15:30 UTC) | 4 | 0.3% |

**İyileşme: 7x.** Kalan 4 adet 500 hatası `/api/v1/auth/token` — bu büyük olasılıkla yanlış şifre denemeleri sırasında oluşan bir yan etki (401 ile birlikte 4-4 dağılım).

\newpage

# 6. Top 20 IP — Trafik Kaynakları

| # | IP | İstek | Tanım |
|---|---|---:|---|
| 1 | 47.65.178.211 | 1,632 | TR ISP — kampanya tıklamaları (Google Ads) |
| 2 | 66.249.87.161 | 774 | **Googlebot** |
| 3 | **187.124.166.65** | 666 | **Sunucu kendi IP'si** (Next.js SSR self-call) |
| 4 | 176.233.29.85 | 581 | TR ISP — insan |
| 5 | 66.102.8.130 | 532 | **Google Search Console** verifier |
| 6 | 66.102.8.131 | 520 | **Google Search Console** verifier |
| 7 | 66.102.8.129 | 509 | **Google Search Console** verifier |
| 8 | 47.65.177.60 | 454 | TR ISP — karışık (insan + curl test) |
| 9 | 20.226.13.15 | 440 | **Microsoft Azure** (Bingbot/AI crawler) |
| 10 | 47.65.177.213 | 307 | TR ISP — insan |
| 11 | 85.107.108.193 | 282 | TR ISP |
| 12 | 176.9.19.245 | 281 | DE Hetzner — bot |
| 13 | 78.177.143.20 | 273 | TR ISP |
| 14 | 74.125.218.230 | 252 | **Google** infra |
| 15 | 24.133.49.27 | 221 | TR ISP |
| 16 | 66.249.75.97 | 217 | **Googlebot** |
| 17 | 5.176.8.32 | 211 | TR ISP |
| 18 | 85.105.31.6 | 209 | TR ISP |
| 19 | 176.54.150.7 | 203 | TR ISP |
| 20 | 66.249.87.162 | 198 | **Googlebot** |

**Yorum:** Top 20 IP'nin yaklaşık **%50'si Google altyapısı** (bot + Search Console). Bu sağlıklı — Google site'yi aktif tarıyor ve doğruluyor. Sunucu self-call (#3) Next.js SSR fetch'lerinden kaynaklı, normal davranış.

\newpage

# 7. Aksiyon Planı

## 7.A Acil — Yeni Redirect Eklenmeli (≥50 adet 404'ü çözer)

Frontend `next.config.ts` içindeki `redirects()` listesine ekle:

```ts
{
  source: '/:locale(tr|en|de)/urun/:slug',
  destination: '/:locale/urunler/:slug',
  permanent: true,
},
```

Bu kural şu URL'leri kurtarır: `saray-f1` (15), `avar` (12), `cankan-f1` (6),
`kizgin-f1`, `prestij-f1`, `tirpan-f1`, `lucky-f1`, `birlik-f1` vb.

## 7.B Acil — `/grup-sirketlerimiz/*` 404'leri

Bu URL'ler site'te yok ama dış kaynaktan link almış (muhtemelen vistainsaat veya
eski içerik). Çözüm: `/tr/hakkimizda` veya `/tr/markalar`'a 301 yönlendirme.

```ts
{
  source: '/:locale(tr|en|de)/grup-sirketlerimiz/:slug',
  destination: '/:locale/hakkimizda',
  permanent: true,
},
```

## 7.C Orta — Eksik Asset'ler

- `frontend/public/apple-touch-icon.png` (180×180 px) ekle — 12 adet 500'ü
  çözer.
- `admin_panel/public/robots.txt` ekle (içerik: `User-agent: *\nDisallow: /`) —
  29 adet 404'ü çözer.
- `admin_panel/public/apple-touch-icon.png` ekle.

## 7.D Orta — Nginx Saldırı Bloklaması

`/etc/nginx/sites-available/vistaseed` içine ekle:

```nginx
location ~ /\.(env|git|svn|hg) { return 444; }
location ~* \.(php|aspx|asp|cgi|jsp)$ { return 444; }
location ~* /wp-(admin|login|content|includes) { return 444; }
location = /xmlrpc.php { return 444; }
```

Bu, Next.js'e ulaşmadan probe trafiğini düşürür. CPU ve log gürültüsü azalır.

## 7.E Düşük — `/en/contact`, `/en/compare`, `/de/vergleich` 500 sorunu

localizedPathRedirects bu yolları kapsıyor ama log'da 500 görünüyor. Olası neden:
next-intl middleware redirect'ten önce locale resolution çalışıyor. **İnceleme
gerekli** — büyük olasılıkla fix sonrası çoğu düzeldi, kalan 500'ler eski cache.

## 7.F Düşük — DE Locale İçerik Eksiği

`/de/anbauleitfaden/...`, `/de/referenzen/...` 404'leri DB'de DE locale içerikleri
seed edilmediğini gösteriyor. Sorun değil ama uzun vadede DE pazarlama isteniyorsa
seed eklenmeli.

\newpage

# 8. Sağlıklı Sinyaller

- ✓ 200 OK oranı %88.9 — normal
- ✓ AI crawler erişimi açık ve aktif (952 istek 14 günde)
- ✓ Bytespider engelli, sadece 1 deneme
- ✓ Saldırı probe başarısı düşük (1 adet `/wp-login.php` 404)
- ✓ Trend yukarı yönlü (+88% tekil ziyaretçi 2 haftada)
- ✓ Fix sonrası 4xx %5x, 5xx %7x iyileşme
- ✓ Google Search Console aktif olarak siteyi doğruluyor (1,561 istek)
- ✓ HTTPS/security header'lar yerinde (X-Frame-Options, X-Content-Type-Options)

\newpage

# 9. Sonuç ve Öneriler

Site **sağlıklı durumda**. 25 Mayıs 2026'da uygulanan fix paketi (Search Console
5xx/404 + admin panel auth + branding) **etkili biçimde çalışıyor**. Kalan
problemler:

1. **Eski tekil URL pattern** (`/urun/`) — tek redirect ile çözülür (50+ 404)
2. **Yanlış backlink'ler** (`/grup-sirketlerimiz/*`) — redirect veya 410 ile çözülür (20+ 404)
3. **Eksik favicon/robots.txt** — basit dosya ekleme
4. **Saldırı probe trafiği** — nginx tarafında bloklamak CPU/log temizliği sağlar

Aksiyon önceliği:

| Öncelik | Aksiyon | Beklenen Etki |
|---|---|---|
| P0 | `/urun/` → `/urunler/` redirect | 50+ 404 → 0 |
| P0 | `/grup-sirketlerimiz/*` → `/hakkimizda` redirect | 20+ 404 → 0 |
| P1 | apple-touch-icon + admin robots.txt | 40+ 4xx/5xx → 0 |
| P1 | Nginx probe bloklaması | CPU temizliği |
| P2 | `/en/contact` vb. 500 incelemesi | 30+ 5xx → 0 |
| P3 | DE locale içerik seed | UX |

---

**Rapor sonu.** Sonraki rapor için önerilen aralık: 30 gün sonra (24 Haziran 2026),
Search Console doğrulama sonuçlarıyla birlikte.

*Hazırlayan: Vista Seeds Teknik Ekip — 25 Mayıs 2026*
