import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@/core/env';
import { findTwitterCalendarEvent, TWITTER_CALENDAR_EVENTS } from './calendar';
import { buildTweetFallback, composeTweetText, trimToTweet } from './fallbacks';
import { deriveTwitterHashtags } from './hashtags';
import { repoGetTwitterProducts, type TwitterProduct } from './repository';
import { isoWeek } from './time';
import { TwitterTemplate, type TwitterTweetContext } from './templates';

type TemplatePreview = {
  id: string;
  title: string;
  description: string;
  slot_label: string;
  template: TwitterTemplate;
  content: string;
  media_url: string | null;
};

const TEMPLATE_META: Record<TwitterTemplate, Omit<TemplatePreview, 'id' | 'template' | 'content' | 'media_url'>> = {
  [TwitterTemplate.VarietyPromo]: {
    title: 'Çeşit kartı',
    description: 'Aktif ürün kataloğundan çeşit tanıtımı, ürün linki ve kontrollü hashtag.',
    slot_label: '10:00',
  },
  [TwitterTemplate.IndustryEvent]: {
    title: 'Sektör / fuar',
    description: 'Tohumculuk gündemi ve fuar takvimi için marka konumlandırması.',
    slot_label: '11:00',
  },
  [TwitterTemplate.NationalDay]: {
    title: 'Milli gün',
    description: 'Özel günlerde sade, saygılı ve tarım emeğini öne çıkaran paylaşım.',
    slot_label: '11:00',
  },
  [TwitterTemplate.LocalSeedValue]: {
    title: 'Yerli tohum değeri',
    description: 'Yerli ıslah, üretici güveni ve marka duruşu odaklı metin.',
    slot_label: '16:00',
  },
  [TwitterTemplate.AgronomyTip]: {
    title: 'Agronomi ipucu',
    description: 'Üreticiye pratik, iddiasız ve uygulanabilir teknik not.',
    slot_label: '16:00',
  },
};

function siteUrl() {
  return env.FRONTEND_URL.replace(/\/$/, '');
}

function pickProduct(products: TwitterProduct[]): TwitterProduct | null {
  return products.find((product) => product.title.trim()) ?? null;
}

function hashtagsFor(template: TwitterTemplate, ctx: TwitterTweetContext): string {
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

function previewFor(template: TwitterTemplate, ctx: TwitterTweetContext, now: Date): TemplatePreview {
  const hashtags = hashtagsFor(template, ctx);
  const caption = trimToTweet(buildTweetFallback(template, ctx, isoWeek(now)), hashtags);
  const productImage = ctx.product?.imageUrl || null;

  return {
    id: template,
    template,
    ...TEMPLATE_META[template],
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
    const product = pickProduct(products);
    const currentEvent = findTwitterCalendarEvent(now);
    const fallbackEvent = TWITTER_CALENDAR_EVENTS[0] ?? null;
    const baseCtx = {
      linkUrl: siteUrl(),
      product: null,
      event: null,
    } satisfies TwitterTweetContext;

    const items = [
      previewFor(TwitterTemplate.VarietyPromo, {
        ...baseCtx,
        product,
        linkUrl: product?.productUrl || siteUrl(),
      }, now),
      previewFor(TwitterTemplate.IndustryEvent, {
        ...baseCtx,
        event: currentEvent?.kind === 'industry_event' ? currentEvent : fallbackEvent,
      }, now),
      previewFor(TwitterTemplate.NationalDay, {
        ...baseCtx,
        event: currentEvent?.kind === 'national_day' ? currentEvent : fallbackEvent,
      }, now),
      previewFor(TwitterTemplate.LocalSeedValue, baseCtx, now),
      previewFor(TwitterTemplate.AgronomyTip, { ...baseCtx, product }, now),
    ];

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
