# VistaSeed — yapılacaklar

**Konum:** `projects/vistaseed/yapilacaklar.md`  
**Ekosistem özeti:** `EKOSISTEM-CHECKLIST.md` (P6 tamamlandıysa orada `[x]`).

Bu dosya aktif backlog’tur: **tamamlananlar** arşiv özetidir; **sıradakiler** üzerinde çalışılır.

---

## Tamamlananlar (P6 — içerik ve sayfa)

- **P6.1 Blog + RSS** — `GET /api/v1/feed/rss`, `Cache-Control`, `CALISTIRMA.md` notları.
- **P6.2 Referanslar** — `by-slug`, galeri → `images`, liste/detay akışı.
- **P6.3 / P6.4** — Ar-Ge ve ekim rehberi seed / içerik güncellemeleri (`153`, `125` vb.).
- **P6.5 Bilgi bankası** — Public istekler **`/api/v1/library`** (`API.library`); ürün detayında `LibraryKnowledgeLinks` aynı tabanı kullanır.
- **P6.6 Ürün listesi görselleri** — `image_url` / `images[0]`, `resolveImageUrl`.
- **P6.7** — `messages/tr.json` Türkçe karakter düzeltmeleri (örnekler).

*Ayrıntı ve dosya referansları için `EKOSISTEM-CHECKLIST.md` P6 satırlarına bak.*

---

## Tamamlananlar (bayi paneli)

- **Katalog API** — `repoCountDealerCatalog` sayımı `sql\`COUNT(*)\`` (`dealer-catalog.repository.ts`).
- **Panel sipariş** — Katalog (`#dealer-catalog`) + sipariş formu (`#dealer-order`), `POST /api/v1/orders`.
- **Ödeme (MVP)** — `POST /orders/:id/payment/iyzico/initiate`, havale `.../bank-transfer`, callback `.../payment/iyzico/callback`; `154_orders_payment_columns.sql`; `FRONTEND_DEFAULT_LOCALE` ile panel yönlendirmesi.
- **Tek katalog isteği** — `useDealerSharedCatalog` + `DealerOrdersBlock`; katalog araması (shared modda) istemci tarafı filtre; tek `fetchDealerCatalog` (`frontend/src/modules/dealer/use-dealer-shared-catalog.ts`).
- **“Yeni sipariş” / yönlendirmeler / bakiye** — Önceki maddeler (panel içi CTA, `bayi-dashboard/siparis` redirect, tekrarlayan `fetchBalance` kaldırıldı).
- **Kredi ile ödeme** — `POST /api/v1/orders/:id/payment/credit` (tek DB transaction: cari `order` satırı + bakiye + sipariş `paid`/`dealer_credit`); panel `DealerOrderForm` üçüncü ödeme seçeneği.
- **RSS içe alma (MVP)** — `POST /api/v1/admin/blog/rss/import`, `blog_posts.rss_source_url` + `155_blog_posts_rss_source.sql`, env `RSS_IMPORT_*`; admin Blog listesinde «RSS içe aktar».
- **Sepet kalıcılığı** — `dealer-order-draft-storage.ts` (`localStorage` `vistaseed-dealer-order-draft`), sipariş sonrası temizlenir.

---

## Sıradakiler

### 1) İçerik / ürün

| Durum | Konu | Not |
|--------|------|-----|
| Plan | **Haberler yüzeyi** | Ayrı modül mü blog kategorisi mü — `doc/` mimari notu. |

### 2) Konsol / API (referans)

| İstek | Sonuç | Açıklama |
|--------|--------|----------|
| `GET .../api/library` | 404 | Doğru yol **`/api/v1/library`**. |
| `GET .../dealer/balance` | 401 | Oturum yokken beklenir. |
| `GET .../dealer/products` | 500 | Sayım düzeltildi; devam ederse log. |

---

## Öncelik sırası (öneri)

1. Haberler yüzeyi / içerik stratejisi (isteğe bağlı).  
2. Konsol 500 logları (devam ederse).

---

*Son güncelleme: RSS içe alma (admin + env) ve bayi sepet taslagi (localStorage) eklendi.*

