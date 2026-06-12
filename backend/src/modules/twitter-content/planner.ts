// src/modules/twitter-content/planner.ts
// Günlük plan: DB planından slotları al → platforma özgü metni üret → kuyruğa ekle

import {
  listEnabledQueuePlatforms,
  queueTweet,
  repoExistsTweetBySourceRef,
  type SocialPlatform,
} from '@agro/shared-backend/modules/twitter';

import { findTwitterCalendarEvent } from './calendar';
import { buildTwitterSlotHashtags } from './planner-hashtags';
import { TwitterTemplate, type TwitterTweetContext } from './templates';
import { buildTweetFallback, composeTweetText, trimToTweet } from './fallbacks';
import { formatSocialText } from './format';
import { loadTodaysSlots, type PlanSlot } from './plan-source';
import { socialMediaFallback, twitterMediaForProduct, twitterMediaForSlot } from './media';
import { repoGetTwitterProducts, type TwitterProduct } from './repository';
import { isoWeek, todayTurkeyISO, toTurkeySlotUtc } from './time';

const LATE_GRACE_MINUTES = 30;

const TEMPLATE_VALUES = new Set<string>(Object.values(TwitterTemplate));

function toTemplate(value: string): TwitterTemplate {
  if (!TEMPLATE_VALUES.has(value)) throw new Error(`bilinmeyen_sablon: ${value}`);
  return value as TwitterTemplate;
}

function varietySourceRef(platform: SocialPlatform, product: TwitterProduct, now: Date) {
  const suffix = platform === 'twitter' ? '' : `-${platform}`;
  return `vistaseeds-variety-${product.slug}-${isoWeek(now)}${suffix}`;
}

function productMatches(product: TwitterProduct, preferred?: string) {
  if (!preferred) return false;
  return product.title.toLocaleLowerCase('tr-TR').includes(preferred.toLocaleLowerCase('tr-TR'));
}

/** Öncelikli çeşit; yoksa bu hafta o platformda henüz paylaşılmamış ilk ürün. */
async function selectProduct(platform: SocialPlatform, now: Date, preferred?: string) {
  const productList = await repoGetTwitterProducts(50);
  const preferredProduct = productList.find((product) => productMatches(product, preferred));
  if (preferredProduct && !(await repoExistsTweetBySourceRef(varietySourceRef(platform, preferredProduct, now), platform))) {
    return preferredProduct;
  }
  for (const product of productList) {
    if (!(await repoExistsTweetBySourceRef(varietySourceRef(platform, product, now), platform))) {
      return product;
    }
  }
  return null;
}

function resolveMedia(slot: PlanSlot, product: TwitterProduct | null): string | null {
  const productMedia = product ? twitterMediaForProduct(product.title, slot.preferredProduct) : null;
  const slotMedia = twitterMediaForSlot(slot.key);
  const media = productMedia ?? slotMedia;
  if (media) return media;
  return slot.mediaRequired ? socialMediaFallback() : null;
}

async function planSlot(platform: SocialPlatform, slot: PlanSlot, siteUrl: string, now: Date): Promise<string | null> {
  const scheduledAt = toTurkeySlotUtc(slot.hour, slot.minute, now);
  if (now.getTime() - scheduledAt.getTime() > LATE_GRACE_MINUTES * 60_000) return null;

  const date = todayTurkeyISO(now);
  const event = findTwitterCalendarEvent(now);
  let template = toTemplate(slot.template);
  let product: TwitterProduct | null = null;
  let sourceRef = `vistaseeds-${platform}-${template}-${date}-${slot.key}`;

  // Takvim olayı (milli gün/fuar) X'in çarşamba slotunu ele geçirir
  if (platform === 'twitter' && event && slot.dayOfWeek === 3) {
    template = event.kind === 'national_day' ? TwitterTemplate.NationalDay : TwitterTemplate.IndustryEvent;
    sourceRef = `vistaseeds-calendar-${event.key}-${date}`;
  }

  if (template === TwitterTemplate.VarietyPromo || template === TwitterTemplate.AgronomyTip) {
    product = await selectProduct(platform, now, slot.preferredProduct);
    if (template === TwitterTemplate.VarietyPromo) {
      if (!product) return null; // haftalık rotasyon dolu
      sourceRef = `${varietySourceRef(platform, product, now)}-${slot.key}`;
    }
  }

  if (await repoExistsTweetBySourceRef(sourceRef, platform)) return null;

  const ctx: TwitterTweetContext = {
    product,
    event,
    linkUrl: template === TwitterTemplate.VarietyPromo && product ? product.productUrl : siteUrl,
    strategySlotKey: slot.key,
    strategyTopic: slot.topic,
  };
  const caption = buildTweetFallback(template, ctx, isoWeek(now));

  let text: string;
  if (platform === 'twitter') {
    const hashtags = buildTwitterSlotHashtags(template, ctx);
    text = composeTweetText(trimToTweet(caption, hashtags), hashtags);
  } else {
    text = formatSocialText(platform, {
      caption,
      hashtags: '',
      linkUrl: ctx.linkUrl,
      productTitle: product?.title,
      postFormat: slot.postFormat,
    });
  }

  const result = await queueTweet({
    text,
    platform,
    scheduledAt,
    source: 'auto',
    template,
    sourceRef,
    mediaUrl: resolveMedia(slot, product),
    postFormat: slot.postFormat,
  });
  return result.ok ? `${platform}:${slot.key}:${template}` : null;
}

/** Aktif platformların bugünkü planlarını kuyruğa ekler (sourceRef dedup ile idempotent). */
export async function buildSocialQueueForToday(siteUrl: string, now = new Date()): Promise<string[]> {
  const platforms = await listEnabledQueuePlatforms();
  const queued: string[] = [];

  for (const platform of platforms) {
    try {
      const slots = await loadTodaysSlots(platform, now);
      for (const slot of slots) {
        const item = await planSlot(platform, slot, siteUrl, now);
        if (item) queued.push(item);
      }
    } catch (err) {
      console.error(`social_content_plan_failed platform=${platform}`, err);
    }
  }
  return queued;
}

/** Geriye dönük isim. */
export const buildTwitterQueueForToday = buildSocialQueueForToday;
