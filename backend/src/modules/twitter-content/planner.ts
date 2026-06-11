// src/modules/twitter-content/planner.ts
// Günlük slot planlama: şablon seç → metni üret → shared twitter kuyruğuna ekle

import { queueTweet, repoExistsTweetBySourceRef } from '@agro/shared-backend/modules/twitter';

import { findTwitterCalendarEvent } from './calendar';
import {
  TWITTER_AGRICULTURE_TAG,
  TWITTER_BRAND_TAG,
  TWITTER_EXPORT_TAGS,
  TWITTER_LOCAL_SEED_TAG,
  TWITTER_SEED_TAG,
  TWITTER_SIGNATURE_TAG,
  TWITTER_VEGETABLE_SEED_TAG,
  deriveTwitterHashtags,
} from './hashtags';
import {
  TWITTER_SLOTS,
  TwitterTemplate,
  type TwitterTemplateSlot,
  type TwitterTweetContext,
} from './templates';
import { buildTweetFallback, composeTweetText, trimToTweet } from './fallbacks';
import { twitterMediaForProduct, twitterMediaForSlot } from './media';
import { repoGetTwitterProducts, type TwitterProduct } from './repository';
import { isoWeek, todayTurkeyISO, toTurkeySlotUtc, turkeyDayOfWeek, turkeyParts } from './time';

const LATE_GRACE_MINUTES = 30;
const STRATEGY_ANCHOR_DATE = '2026-06-10'; // Çarşamba: 15'li döngünün 1. maddesi

function varietySourceRef(product: TwitterProduct, now: Date) {
  return `vistaseeds-variety-${product.slug}-${isoWeek(now)}`;
}

function utcDateFromISO(dateISO: string) {
  const [year, month, day] = dateISO.split('-').map(Number);
  return new Date(Date.UTC(year || 1970, (month || 1) - 1, day || 1));
}

function isPublishDay(day: number) {
  return day === 3 || day === 4 || day === 5;
}

function strategySlotForToday(now: Date): TwitterTemplateSlot | null {
  const today = todayTurkeyISO(now);
  const start = utcDateFromISO(STRATEGY_ANCHOR_DATE);
  const end = utcDateFromISO(today);
  if (end.getTime() < start.getTime()) return null;

  let publishIndex = -1;
  for (let cursor = new Date(start); cursor.getTime() <= end.getTime(); cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    if (isPublishDay(cursor.getUTCDay())) publishIndex += 1;
  }
  if (publishIndex < 0) return null;
  return TWITTER_SLOTS[publishIndex % TWITTER_SLOTS.length] ?? null;
}

function productMatches(product: TwitterProduct, preferred?: string) {
  if (!preferred) return false;
  return product.title.toLocaleLowerCase('tr-TR').includes(preferred.toLocaleLowerCase('tr-TR'));
}

/** Öncelikli çeşit bulunursa onu, yoksa bu hafta henüz tweetlenmemiş ilk ürünü seçer. */
async function selectStrategyProduct(now: Date, preferred?: string) {
  const productList = await repoGetTwitterProducts(50);
  const preferredProduct = productList.find((product) => productMatches(product, preferred));
  if (preferredProduct && !(await repoExistsTweetBySourceRef(varietySourceRef(preferredProduct, now)))) {
    return preferredProduct;
  }
  for (const product of productList) {
    if (!(await repoExistsTweetBySourceRef(varietySourceRef(product, now)))) {
      return product;
    }
  }
  return null;
}

function buildHashtags(template: TwitterTemplate, ctx: TwitterTweetContext): string {
  if (template === TwitterTemplate.InteractionPoll) {
    return `${TWITTER_BRAND_TAG} ${TWITTER_LOCAL_SEED_TAG}`;
  }
  if (template === TwitterTemplate.InteractionQuestion) {
    return `${TWITTER_BRAND_TAG} ${TWITTER_AGRICULTURE_TAG}`;
  }
  if (template === TwitterTemplate.VarietyPromo) {
    const crop = deriveTwitterHashtags({ productTitle: ctx.product?.title }).split(/\s+/).find((tag) => tag !== TWITTER_SIGNATURE_TAG && tag !== TWITTER_BRAND_TAG);
    return [TWITTER_BRAND_TAG, TWITTER_LOCAL_SEED_TAG, TWITTER_VEGETABLE_SEED_TAG, crop].filter(Boolean).slice(0, 4).join(' ');
  }
  if (template === TwitterTemplate.FieldProof) {
    return `${TWITTER_BRAND_TAG} ${TWITTER_LOCAL_SEED_TAG} ${TWITTER_SIGNATURE_TAG}`;
  }
  if (template === TwitterTemplate.HumanResearch) {
    return `${TWITTER_BRAND_TAG} ${TWITTER_SIGNATURE_TAG} #ArGe`;
  }
  if (template === TwitterTemplate.SeedMyth) {
    return `${TWITTER_BRAND_TAG} ${TWITTER_SEED_TAG}`;
  }
  if (template === TwitterTemplate.ExportVision) {
    return TWITTER_EXPORT_TAGS;
  }
  if (template === TwitterTemplate.AgronomyTip) {
    return deriveTwitterHashtags({ productTitle: ctx.product?.title });
  }
  if (template === TwitterTemplate.IndustryEvent) {
    return deriveTwitterHashtags({ eventTag: ctx.event?.eventTag });
  }
  if (template === TwitterTemplate.NationalDay) {
    return deriveTwitterHashtags({ dayTag: ctx.event?.dayTag });
  }
  return deriveTwitterHashtags({});
}

async function buildCaption(template: TwitterTemplate, ctx: TwitterTweetContext, now: Date) {
  return buildTweetFallback(template, ctx, isoWeek(now));
}

async function planSlot(slot: TwitterTemplateSlot, siteUrl: string, now: Date): Promise<string | null> {
  if (turkeyDayOfWeek(now) !== slot.dayOfWeek) return null;

  const scheduledAt = toTurkeySlotUtc(slot.hour, slot.minute, now);
  if (now.getTime() - scheduledAt.getTime() > LATE_GRACE_MINUTES * 60_000) return null;

  const date = todayTurkeyISO(now);
  const event = findTwitterCalendarEvent(now);
  let template = slot.template;
  let product: TwitterProduct | null = null;
  let sourceRef = `vistaseeds-${template}-${date}-${slot.key}`;

  if (event && slot.dayOfWeek === 3) {
    template = event.kind === 'national_day' ? TwitterTemplate.NationalDay : TwitterTemplate.IndustryEvent;
    sourceRef = `vistaseeds-calendar-${event.key}-${date}`;
  }

  if (template === TwitterTemplate.VarietyPromo || template === TwitterTemplate.AgronomyTip) {
    product = await selectStrategyProduct(now, slot.preferredProduct);
    if (template === TwitterTemplate.VarietyPromo) {
      if (!product) return null; // haftalık rotasyon dolu
      sourceRef = `${varietySourceRef(product, now)}-${slot.key}`;
    }
  }

  if (await repoExistsTweetBySourceRef(sourceRef)) return null;

  const ctx: TwitterTweetContext = {
    product,
    event,
    linkUrl: template === TwitterTemplate.VarietyPromo && product ? product.productUrl : siteUrl,
    strategySlotKey: slot.key,
    strategyTopic: slot.topic,
  };
  const hashtags = buildHashtags(template, ctx);
  const caption = trimToTweet(await buildCaption(template, ctx, now), hashtags);
  const text = composeTweetText(caption, hashtags);
  const mediaUrl = template === TwitterTemplate.VarietyPromo && product
    ? twitterMediaForProduct(product.title, slot.preferredProduct)
    : twitterMediaForSlot(slot.key);

  const result = await queueTweet({ text, scheduledAt, source: 'auto', template, sourceRef, mediaUrl });
  return result.ok ? `${slot.key}:${template}@17TR` : null;
}

/** Bugünün strateji slotunu kuyruğa ekler. sourceRef dedup sayesinde idempotent. */
export async function buildTwitterQueueForToday(siteUrl: string, now = new Date()): Promise<string[]> {
  const turkeyHour = turkeyParts(now).hour;
  if (turkeyHour < 6) return [];

  const slot = strategySlotForToday(now);
  if (!slot) return [];

  const queued: string[] = [];
  try {
    const item = await planSlot(slot, siteUrl, now);
    if (item) queued.push(item);
  } catch (err) {
    console.error(`twitter_content_plan_failed slot=${slot.key}`, err);
  }
  return queued;
}
