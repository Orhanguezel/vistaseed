// src/modules/twitter-content/media.ts
// Twitter kuyruk görselleri: storage'a kaydedilen 1600x900 ürün kartları.

const TWITTER_MEDIA_BY_PRODUCT: Record<string, string> = {
  birlik: '/uploads/twitter/vistaseeds/birlik-f1-twitter.jpg',
  cankan: '/uploads/twitter/vistaseeds/cankan-f1-twitter.jpg',
  kizgin: '/uploads/twitter/vistaseeds/kizgin-f1-twitter.jpg',
  lucky: '/uploads/twitter/vistaseeds/lucky-f1-twitter.jpg',
  saray: '/uploads/twitter/vistaseeds/saray-f1-twitter.jpg',
  tirpan: '/uploads/twitter/vistaseeds/tirpan-f1-twitter.jpg',
};

const TWITTER_MEDIA_BY_SLOT: Record<string, string> = {
  '02-kapya-charliston-poll': TWITTER_MEDIA_BY_PRODUCT.cankan!,
};

function normalize(value: string) {
  return value.toLocaleLowerCase('tr-TR');
}

export function twitterMediaForProduct(title?: string | null, preferred?: string | null): string | null {
  const haystack = normalize(`${title || ''} ${preferred || ''}`);
  for (const [key, url] of Object.entries(TWITTER_MEDIA_BY_PRODUCT)) {
    if (haystack.includes(key)) return url;
  }
  return null;
}

export function twitterMediaForSlot(slotKey: string): string | null {
  return TWITTER_MEDIA_BY_SLOT[slotKey] ?? null;
}
