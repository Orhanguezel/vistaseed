// src/modules/twitter-content/format.ts
// Platforma özgü gönderi formatı — her platform kendi karakterinde yayınlar.

import type { SocialPlatform } from '@agro/shared-backend/modules/twitter';
import { composeTweetText, trimToTweet } from './fallbacks';
import { deriveInstagramHashtags, TWITTER_BRAND_TAG, TWITTER_LOCAL_SEED_TAG } from './hashtags';

export type SocialFormatInput = {
  caption: string;
  hashtags: string;
  linkUrl?: string | null;
  productTitle?: string | null;
  postFormat?: string;
};

const LINKEDIN_TAGS = '#VistaSeeds #tohum #tarım #ihracat';

/**
 * Platform karakterleri:
 *  - twitter : 280 sınırı, az hashtag (mevcut X davranışı)
 *  - instagram: link YOK (caption'da tıklanmaz) + genişletilmiş hashtag bloğu
 *  - facebook : uzun metin + görünür link + 2 etiket
 *  - linkedin : kurumsal ton, link + az/kurumsal etiket
 */
export function formatSocialText(platform: SocialPlatform, input: SocialFormatInput): string {
  const caption = input.caption.trim();
  const link = String(input.linkUrl || '').trim();

  if (platform === 'twitter') {
    return composeTweetText(trimToTweet(caption, input.hashtags), input.hashtags);
  }

  if (platform === 'instagram') {
    if (input.postFormat === 'story') {
      // Story'de caption gösterilmez; log için kısa kimlik metni yeterli
      return (input.productTitle || caption || 'Story').slice(0, 200);
    }
    const parts = [caption];
    if (link) parts.push('🔗 Detaylar için profilimizdeki bağlantıya göz atın.');
    parts.push(deriveInstagramHashtags(input.productTitle));
    return parts.filter(Boolean).join('\n\n').slice(0, 2200);
  }

  if (platform === 'facebook') {
    const parts = [caption];
    if (link) parts.push(`👉 ${link}`);
    parts.push(`${TWITTER_BRAND_TAG} ${TWITTER_LOCAL_SEED_TAG}`);
    return parts.filter(Boolean).join('\n\n');
  }

  // linkedin
  const parts = [caption];
  if (link) parts.push(`Detay: ${link}`);
  parts.push(LINKEDIN_TAGS);
  return parts.filter(Boolean).join('\n\n').slice(0, 3000);
}
