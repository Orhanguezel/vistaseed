import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@/core/env';
import { findTwitterCalendarEvent, TWITTER_CALENDAR_EVENTS } from './calendar';
import { buildTweetFallback, composeTweetText, trimToTweet } from './fallbacks';
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
import { repoGetTwitterProducts, type TwitterProduct } from './repository';
import { isoWeek } from './time';
import { TWITTER_SLOTS, TwitterTemplate, type TwitterTemplateSlot, type TwitterTweetContext } from './templates';

type TemplatePreview = {
  id: string;
  title: string;
  description: string;
  slot_label: string;
  template: TwitterTemplate;
  content: string;
  media_url: string | null;
};

const DAY_LABELS: Record<TwitterTemplateSlot['dayOfWeek'], string> = {
  3: 'Çarşamba',
  4: 'Perşembe',
  5: 'Cuma',
};

function siteUrl() {
  return env.FRONTEND_URL.replace(/\/$/, '');
}

function pickProduct(products: TwitterProduct[]): TwitterProduct | null {
  return products.find((product) => product.title.trim()) ?? null;
}

function pickPreferredProduct(products: TwitterProduct[], preferred?: string): TwitterProduct | null {
  if (!preferred) return pickProduct(products);
  const needle = preferred.toLocaleLowerCase('tr-TR');
  return products.find((product) => product.title.toLocaleLowerCase('tr-TR').includes(needle)) ?? pickProduct(products);
}

function hashtagsFor(template: TwitterTemplate, ctx: TwitterTweetContext): string {
  if (template === TwitterTemplate.InteractionPoll) {
    return `${TWITTER_BRAND_TAG} ${TWITTER_LOCAL_SEED_TAG}`;
  }
  if (template === TwitterTemplate.InteractionQuestion) {
    return `${TWITTER_BRAND_TAG} ${TWITTER_AGRICULTURE_TAG}`;
  }
  if (template === TwitterTemplate.VarietyPromo) {
    const crop = deriveTwitterHashtags({ productTitle: ctx.product?.title })
      .split(/\s+/)
      .find((tag) => tag !== TWITTER_SIGNATURE_TAG && tag !== TWITTER_BRAND_TAG);
    return [TWITTER_BRAND_TAG, TWITTER_LOCAL_SEED_TAG, TWITTER_VEGETABLE_SEED_TAG, crop]
      .filter(Boolean)
      .slice(0, 4)
      .join(' ');
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

function previewFor(slot: TwitterTemplateSlot, ctx: TwitterTweetContext, now: Date): TemplatePreview {
  const { template } = slot;
  const hashtags = hashtagsFor(template, ctx);
  const caption = trimToTweet(buildTweetFallback(template, ctx, isoWeek(now)), hashtags);
  const productImage = ctx.product?.imageUrl || null;

  return {
    id: slot.key,
    template,
    title: `${slot.pillar} — ${slot.topic}`,
    description: slot.preferredProduct
      ? `Tercih edilen ürün: ${slot.preferredProduct}. Bulunamazsa katalogdan uygun ürün seçilir.`
      : 'Strateji dokümanındaki 30 günlük rotasyondan otomatik üretilir.',
    slot_label: `${DAY_LABELS[slot.dayOfWeek]} ${String(slot.hour).padStart(2, '0')}:${String(slot.minute).padStart(2, '0')} TR`,
    content: composeTweetText(caption, hashtags),
    media_url: template === TwitterTemplate.VarietyPromo || template === TwitterTemplate.AgronomyTip
      ? productImage
      : null,
  };
}

async function twitterTemplatePreviews(req: FastifyRequest, reply: FastifyReply) {
  try {
    const now = new Date();
    const products = await repoGetTwitterProducts(12);
    const currentEvent = findTwitterCalendarEvent(now);
    const fallbackEvent = TWITTER_CALENDAR_EVENTS[0] ?? null;
    const baseCtx = {
      linkUrl: siteUrl(),
      product: null,
      event: null,
    } satisfies TwitterTweetContext;

    const items = TWITTER_SLOTS.map((slot) => {
      const product = pickPreferredProduct(products, slot.preferredProduct);
      const event = slot.template === TwitterTemplate.IndustryEvent
        ? currentEvent?.kind === 'industry_event' ? currentEvent : fallbackEvent
        : slot.template === TwitterTemplate.NationalDay
          ? currentEvent?.kind === 'national_day' ? currentEvent : fallbackEvent
          : null;
      return previewFor(slot, {
        ...baseCtx,
        product,
        event,
        linkUrl: product?.productUrl || siteUrl(),
      }, now);
    });

    return reply.code(200).send({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    req.log.error({ err: message }, 'twitter_template_previews_failed');
    return reply.code(500).send({ error: 'twitter_template_previews_failed', message });
  }
}

export async function registerTwitterContentAdmin(app: FastifyInstance) {
  app.get('/twitter/templates', twitterTemplatePreviews);
}
