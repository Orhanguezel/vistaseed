// src/modules/twitter-content/planner.ts
// Günlük slot planlama: şablon seç → metni üret → shared twitter kuyruğuna ekle

import { queueTweet, repoExistsTweetBySourceRef } from '@agro/shared-backend/modules/twitter';

import { findTwitterCalendarEvent } from './calendar';
import { deriveTwitterHashtags } from './hashtags';
import {
  TWITTER_SLOTS,
  TwitterTemplate,
  buildTweetTopic,
  chooseTwitterTemplate,
  type TwitterTemplateSlot,
  type TwitterTweetContext,
} from './templates';
import { buildTweetFallback, composeTweetText, stripInlineHashtags, trimToTweet } from './fallbacks';
import { generateTweetCaption } from './ai';
import { repoGetTwitterProducts, type TwitterProduct } from './repository';
import { isoWeek, toBerlinSlotUtc, todayISO } from './time';

const LATE_GRACE_MINUTES = 30;

function varietySourceRef(product: TwitterProduct, now: Date) {
  return `vistaseeds-variety-${product.slug}-${isoWeek(now)}`;
}

/** Bu hafta henüz tweetlenmemiş ilk ürünü seçer (haftalık rotasyon). */
async function selectWeeklyProduct(now: Date) {
  const productList = await repoGetTwitterProducts(50);
  for (const product of productList) {
    if (!(await repoExistsTweetBySourceRef(varietySourceRef(product, now)))) {
      return product;
    }
  }
  return null;
}

function buildHashtags(template: TwitterTemplate, ctx: TwitterTweetContext): string {
  if (template === TwitterTemplate.VarietyPromo || template === TwitterTemplate.AgronomyTip) {
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
  try {
    const ai = await generateTweetCaption(buildTweetTopic(template, ctx));
    return stripInlineHashtags(ai.caption);
  } catch {
    return buildTweetFallback(template, ctx, isoWeek(now));
  }
}

async function planSlot(slot: TwitterTemplateSlot, siteUrl: string, now: Date): Promise<string | null> {
  const scheduledAt = toBerlinSlotUtc(slot.hour, slot.minute, now);
  if (now.getTime() - scheduledAt.getTime() > LATE_GRACE_MINUTES * 60_000) return null;

  const date = todayISO(now);
  const event = findTwitterCalendarEvent(now);
  let template = chooseTwitterTemplate(slot.templates);
  let product: TwitterProduct | null = null;
  let sourceRef = `vistaseeds-${template}-${date}-${slot.key}`;

  if (slot.key === 'event') {
    if (!event) return null;
    template = event.kind === 'national_day' ? TwitterTemplate.NationalDay : TwitterTemplate.IndustryEvent;
    sourceRef = `vistaseeds-calendar-${event.key}-${date}`;
  }

  if (template === TwitterTemplate.VarietyPromo || template === TwitterTemplate.AgronomyTip) {
    product = await selectWeeklyProduct(now);
    if (template === TwitterTemplate.VarietyPromo) {
      if (!product) return null; // haftalık rotasyon dolu
      sourceRef = varietySourceRef(product, now);
    }
  }

  if (await repoExistsTweetBySourceRef(sourceRef)) return null;

  const ctx: TwitterTweetContext = {
    product,
    event,
    linkUrl: template === TwitterTemplate.VarietyPromo && product ? product.productUrl : siteUrl,
  };
  const hashtags = buildHashtags(template, ctx);
  const caption = trimToTweet(await buildCaption(template, ctx, now), hashtags);
  const text = composeTweetText(caption, hashtags);

  const result = await queueTweet({ text, scheduledAt, source: 'auto', template, sourceRef });
  return result.ok ? `${slot.key}:${template}` : null;
}

/** Bugünün tüm slotlarını kuyruğa ekler. sourceRef dedup sayesinde idempotent. */
export async function buildTwitterQueueForToday(siteUrl: string, now = new Date()): Promise<string[]> {
  const queued: string[] = [];
  for (const slot of TWITTER_SLOTS) {
    try {
      const item = await planSlot(slot, siteUrl, now);
      if (item) queued.push(item);
    } catch (err) {
      console.error(`twitter_content_plan_failed slot=${slot.key}`, err);
    }
  }
  return queued;
}
