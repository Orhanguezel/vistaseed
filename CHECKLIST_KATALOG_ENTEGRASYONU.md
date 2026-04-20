# VistaSeeds — KatalogAI Entegrasyon Checklist

**Bağlam.** KatalogAI artık `Yayınla` butonuyla bir kataloğu doğrudan
`vistaseed.library` tablosuna **TASLAK** olarak yazıyor:

- `library` (type=`catalog`, **is_published=0**, is_active=1)
- `library_i18n` (locale + slug + name + description)
- `library_files` (file_url = KatalogAI'nın ürettiği PDF, mime=`application/pdf`)

KatalogAI'nın `app@localhost` user'ına `vistaseed.library*` ve
`vistaseed.storage_assets` tabloları için **INSERT/UPDATE/DELETE** yetkisi
verildi (SELECT zaten vardı).

VistaSeeds tarafında yapılacak iş 3 katman: backend route, admin panel,
frontend katalog sayfası (BereketFide'de var, VistaSeeds'te yok).

---

## 1) Veritabanı

`library`, `library_i18n`, `library_files`, `library_images` tabloları
**zaten mevcut**. Migration gerekmez.

Doğrulama:
```bash
sudo mysql vistaseed -e "DESCRIBE library;"
sudo mysql vistaseed -e "SELECT id, type, is_published, is_active, image_url, created_at \
  FROM library WHERE type='catalog' ORDER BY created_at DESC LIMIT 10;"
```

---

## 2) Backend — Library modülü route'a register et

VistaSeeds backend'inin `routes/shared.ts` (veya `routes.ts`) dosyasında
register edilmiş olduğundan emin ol:

```ts
// backend/src/routes/shared.ts
import { registerLibrary, registerLibraryAdmin } from '@agro/shared-backend/modules/library';

export async function registerSharedPublic(api: FastifyInstance) {
  // ...
  await registerLibrary(api);
}

export async function registerSharedAdmin(adminApi: FastifyInstance) {
  // ...
  await registerLibraryAdmin(adminApi);
}
```

Doğrulama:
```bash
curl -s https://www.vistaseeds.com.tr/api/v1/library?type=catalog | jq .
```

---

## 3) Admin Panel — Library yönetim sayfası

KatalogAI'dan gelen taslak kataloğu görmek + onaylamak için:

- [ ] Sidebar'a "Kütüphane" / "Kataloglar" menü öğesi (admin/library)
- [ ] List sayfası: `useListLibraryAdminQuery({ type: 'catalog' })`
  - Kolonlar: kapak görseli, başlık (locale), durum (`is_published`), tarih
  - Action: "Yayına al" toggle (PATCH `library/:id` body: `{is_published: 1}`)
- [ ] Detay sayfası: i18n metinleri düzenleme + dosya listesi (PDF)
- [ ] Filter: `type=catalog` default

VistaSeeds admin panel'inde bu sayfa şu an yok — BereketFide ile aynı
paterni kullanır (categories admin sayfasını referans al).

---

## 4) Frontend — `/kataloglar` sayfası **(yeni — yok)**

VistaSeeds frontend'inde `/[locale]/kataloglar` sayfası **mevcut değil**.
BereketFide'den birebir kopyalayıp uyarla:

```bash
# Lokalde
cp -r projects/bereketfide/frontend/src/app/\[locale\]/kataloglar \
      projects/vistaseeds/frontend/src/app/\[locale\]/kataloglar
```

Sonra:
- [ ] `page.tsx` içindeki `API_BASE_URL` ve `absoluteAssetUrl` import'larını
  vistaseeds'in kendi `@/lib/utils`'inden gelecek şekilde uyarla (zaten
  aynı modül adı + signature)
- [ ] Locale metinlerini (varsa) çevir
- [ ] SEO meta'yı VistaSeeds için güncelle (`buildPageMetadata` fonksiyonu
  zaten projenin kendi `seo` modülünden geldiği için müdahale gerek olmaz)
- [ ] Sidebar/menu'ye link ekle (örn. ana sayfa header → "Kataloglar")

Detay sayfası (`/kataloglar/[slug]`) PDF download butonu için
`library/:id/files` endpoint'inden `file_url` al,
`<a href={file_url} target="_blank" download>` ile sun.

---

## 5) Smoke Test

1. KatalogAI editöründe bir katalog oluştur, "Yayınla" tıkla, VistaSeeds'i seç
2. VistaSeeds admin panelinde Kütüphane → Kataloglar → yeni taslak görünmeli
3. "Yayına al" tıkla → `is_published=1`
4. `https://www.vistaseeds.com.tr/tr/kataloglar` → katalog kartı görünür
5. Kart tıkla → detay → PDF link çalışır

---

## 6) Notlar

- KatalogAI **schema'ya dokunmaz**, sadece INSERT yapar (3 tablo:
  `library`, `library_i18n`, `library_files`)
- Aynı katalog tekrar "Yayınla" edilirse YENİ bir `library` kaydı oluşur
  (her sürümü ayrı taslak olarak görmek istiyoruz)
- PDF dosyası KatalogAI backend'inin `LOCAL_STORAGE_BASE_URL` üzerinden
  serve edilir (cross-domain yüklenir, CORS sorunu yok — direct download)
- KatalogAI publish sırasında oluşturulan `library_i18n.slug` benzersiz
  olmak için UUID suffix taşır (örn. `bereket-fide-katalogu-a1b2c3d4`),
  bu yüzden BereketFide ve VistaSeeds slug çakışması yaşamaz
