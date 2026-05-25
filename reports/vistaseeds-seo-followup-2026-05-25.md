# VistaSeeds SEO Follow-up Smoke

Tarih: 2026-05-25
Host: `vps-vistainsaat`

## HTTP Smoke

| Kontrol | URL | Beklenen | Sonuc |
|---|---|---|---|
| old product redirect | `https://www.vistaseeds.com.tr/tr/urun/saray-f1` | `308 -> /tr/urunler/saray-f1` | `308 https://www.vistaseeds.com.tr/tr/urunler/saray-f1` |
| old product redirect | `https://www.vistaseeds.com.tr/tr/urun/avar` | `308 -> /tr/urunler/avar` | `308 https://www.vistaseeds.com.tr/tr/urunler/avar` |
| old group redirect | `https://www.vistaseeds.com.tr/tr/grup-sirketlerimiz/vista-prestige` | `308 -> /tr/hakkimizda` | `308 https://www.vistaseeds.com.tr/tr/hakkimizda` |
| localized redirect | `https://www.vistaseeds.com.tr/en/contact` | `308 -> /en/iletisim` | `308 https://www.vistaseeds.com.tr/en/iletisim` |
| localized redirect | `https://www.vistaseeds.com.tr/de/produkte` | `308 -> /de/urunler` | `308 https://www.vistaseeds.com.tr/de/urunler` |
| apple touch precomposed | `https://www.vistaseeds.com.tr/apple-touch-icon-precomposed.png` | `200` | `200 ` |
| panel robots | `https://panel.vistaseeds.com.tr/robots.txt` | `200` | `200 ` |
| panel apple touch | `https://panel.vistaseeds.com.tr/apple-touch-icon.png` | `200` | `200 ` |
| probe block dotenv | `https://www.vistaseeds.com.tr/.env` | `000/444 connection close` | `000 ` |
| probe block wp-login | `https://www.vistaseeds.com.tr/wp-login.php` | `000/444 connection close` | `000 ` |
| auth token empty body | `https://panel.vistaseeds.com.tr/api/v1/auth/token` | `400` | `400` |
| auth token wrong login | `https://panel.vistaseeds.com.tr/api/v1/auth/token` | `401` | `401` |

## Log Summary

### Public status totals

```text
"-" 2
200 22296
201 1
204 25
206 2
304 210
307 1121
308 223
400 7
401 5
404 518
444 4
499 37
500 499
502 19
```

### Panel status totals

```text
200 496
304 1
307 24
308 2
400 6
401 3
404 259
500 2
```

### Faz 2 pattern counters

| Pattern | Public | Panel |
|---|---:|---:|
| `/tr/urun/[^ ]+` | 55 | 0 |
| `/tr/grup-sirketlerimiz/[^ ]+` | 31 | 0 |
| `apple-touch-icon-precomposed\.png` | 16 | 2 |
| `\.env|/\.git|wp-login|wp-admin|\.php|sitemap\.txt|atom\.xml` | 794 | 165 |
| `/api/v1/auth/token` | 20 | 12 |
| `utm_campaign=` | 0 | 0 |

### Recent 5xx samples

```text
35.243.45.25 - - [17/May/2026:13:12:39 +0000] "GET /.env.uat HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:12:40 +0000] "GET /.env.dist HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:12:41 +0000] "GET /.env.swp HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:12:42 +0000] "GET /.env~ HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:14:42 +0000] "GET /phpinfo.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:14:43 +0000] "GET /info.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:14:43 +0000] "GET /php.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:14:44 +0000] "GET /i.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:14:45 +0000] "GET /pi.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:14:46 +0000] "GET /pinfo.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:14:47 +0000] "GET /test.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:14:49 +0000] "GET /p.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:14:50 +0000] "GET /debug.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:15:01 +0000] "GET /php-info.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:15:02 +0000] "GET /phpversion.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:15:02 +0000] "GET /_phpinfo.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:15:03 +0000] "GET /old_phpinfo.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:15:04 +0000] "GET /server-info.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
35.243.45.25 - - [17/May/2026:13:15:05 +0000] "GET /server-status.php HTTP/1.1" 500 21 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
176.9.19.245 - - [17/May/2026:14:13:49 +0000] "GET /de/faq HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
176.9.19.245 - - [17/May/2026:16:09:38 +0000] "GET /en/faq HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
176.9.19.245 - - [17/May/2026:17:42:50 +0000] "GET /de/kontakt HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
176.9.19.245 - - [17/May/2026:19:36:12 +0000] "GET /en/contact HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
176.9.19.245 - - [16/May/2026:01:31:37 +0000] "GET /en/r-and-d-center HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
66.249.75.97 - - [16/May/2026:02:11:56 +0000] "GET /en/products HTTP/1.1" 500 32 "-" "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
176.9.19.245 - - [16/May/2026:03:07:12 +0000] "GET /en/sustainability HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
176.9.19.245 - - [16/May/2026:05:58:53 +0000] "GET /de/forschungszentrum HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
176.9.19.245 - - [16/May/2026:07:22:01 +0000] "GET /de/produkte?type=rootstock HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
176.9.19.245 - - [16/May/2026:09:04:15 +0000] "GET /en/products?type=rootstock HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
185.47.95.247 - - [16/May/2026:09:21:11 +0000] "GET /en/products HTTP/1.1" 500 32 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
213.201.243.104 - - [16/May/2026:09:21:17 +0000] "GET /en/careers HTTP/1.1" 500 32 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
191.96.87.167 - - [16/May/2026:09:21:21 +0000] "GET /en/privacy-policy HTTP/1.1" 500 32 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
45.145.215.27 - - [16/May/2026:09:21:29 +0000] "GET /en/about HTTP/1.1" 500 32 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
43.143.70.158 - - [16/May/2026:15:14:18 +0000] "GET /de/nachhaltigkeit HTTP/1.1" 500 32 "-" "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
176.9.19.245 - - [16/May/2026:20:52:31 +0000] "GET /de/produkte?type=kapia&taste=sweet HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
3.209.56.56 - - [16/May/2026:21:56:17 +0000] "GET /favicon.png HTTP/1.1" 500 21 "-" "okhttp/5.3.0"
176.9.19.245 - - [16/May/2026:22:15:28 +0000] "GET /en/products?type=kapia&taste=sweet HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
176.9.19.245 - - [16/May/2026:23:58:13 +0000] "GET /de/produkte?cultivation=openField&taste=sweet HTTP/1.1" 500 32 "-" "Mozilla/5.0 (compatible; SERankingBacklinksBot/1.0; +https://seranking.com/backlinks-crawler)"
47.65.177.60 - - [25/May/2026:14:34:43 +0000] "POST /api/v1/auth/token HTTP/1.1" 500 34 "-" "curl/8.5.0"
35.234.133.170 - - [17/May/2026:11:44:27 +0000] "POST / HTTP/1.1" 500 1873 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
```
