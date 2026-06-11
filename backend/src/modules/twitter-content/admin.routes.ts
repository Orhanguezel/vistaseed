import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { eq, or } from 'drizzle-orm';

import { env } from '@/core/env';
import { db } from '@/db/client';
import {
  buildTwitterOAuth1Header,
  getTwitterSettings,
  hasTwitterCredentials,
  twitterGetMe,
  repoInsertTweet,
  tweets,
  type TwitterOAuth1Creds,
} from '@agro/shared-backend/modules/twitter';
import { findTwitterCalendarEvent, TWITTER_CALENDAR_EVENTS } from './calendar';
import { buildTweetFallback, composeTweetText, stripInlineHashtags, trimToTweet } from './fallbacks';
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
import { generateTweetCaption } from './ai';
import { buildTweetTopic, TWITTER_SLOTS, TwitterTemplate, type TwitterTemplateSlot, type TwitterTweetContext } from './templates';
import { twitterMediaForProduct, twitterMediaForSlot } from './media';

type TemplatePreview = {
  id: string;
  title: string;
  description: string;
  slot_label: string;
  template: TwitterTemplate;
  content: string;
  media_url: string | null;
};

type XTimelineTweet = {
  id: string;
  text: string;
  created_at?: string;
};

type XTimelineResponse = {
  data?: XTimelineTweet[];
};

type TwitterAiDraftBody = {
  topic?: unknown;
  template?: unknown;
  product_id?: unknown;
  current_text?: unknown;
};

const DAY_LABELS: Record<TwitterTemplateSlot['dayOfWeek'], string> = {
  3: 'Çarşamba',
  4: 'Perşembe',
  5: 'Cuma',
};

function siteUrl() {
  return env.FRONTEND_URL.replace(/\/$/, '');
}

function toCreds(settings: Awaited<ReturnType<typeof getTwitterSettings>>): TwitterOAuth1Creds {
  return {
    apiKey: settings.apiKey,
    apiSecret: settings.apiSecret,
    accessToken: settings.accessToken,
    accessTokenSecret: settings.accessTokenSecret,
  };
}

async function twitterGetUserTweets(creds: TwitterOAuth1Creds, userId: string, limit: number) {
  const url = new URL(`https://api.twitter.com/2/users/${encodeURIComponent(userId)}/tweets`);
  url.searchParams.set('max_results', String(Math.min(Math.max(limit, 5), 100)));
  url.searchParams.set('tweet.fields', 'created_at');
  url.searchParams.set('exclude', 'retweets,replies');

  const signatureUrl = `${url.origin}${url.pathname}`;
  const authHeader = buildTwitterOAuth1Header(
    'GET',
    signatureUrl,
    creds,
    Object.fromEntries(url.searchParams.entries()),
  );

  const res = await fetch(url, { headers: { Authorization: authHeader } });
  const data = (await res.json().catch(() => null)) as XTimelineResponse | { detail?: string; title?: string } | null;

  if (!res.ok) {
    const detail = data && 'detail' in data ? data.detail : null;
    const title = data && 'title' in data ? data.title : null;
    throw new Error(`X API ${res.status}: ${detail || title || res.statusText}`);
  }

  return (data as XTimelineResponse | null)?.data ?? [];
}

async function tweetExistsByXId(tweetId: string) {
  const sourceRef = `vistaseeds-x-import-${tweetId}`;
  const rows = await db
    .select({ id: tweets.id })
    .from(tweets)
    .where(or(eq(tweets.x_tweet_id, tweetId), eq(tweets.source_ref, sourceRef)))
    .limit(1);
  return rows.length > 0;
}

async function syncTwitterHistory(req: FastifyRequest, reply: FastifyReply) {
  try {
    const settings = await getTwitterSettings();
    if (!hasTwitterCredentials(settings)) {
      return reply.code(400).send({ ok: false, error: 'twitter_credentials_missing' });
    }

    const creds = toCreds(settings);
    const account = await twitterGetMe(creds);
    const remoteTweets = await twitterGetUserTweets(creds, account.id, 30);

    let imported = 0;
    let skipped = 0;
    for (const item of remoteTweets) {
      if (!item.id || !item.text?.trim()) continue;
      if (await tweetExistsByXId(item.id)) {
        skipped += 1;
        continue;
      }

      const postedAt = item.created_at ? new Date(item.created_at) : new Date();
      await repoInsertTweet({
        id: randomUUID(),
        content: item.text,
        status: 'sent',
        source: 'x_import',
        template: null,
        source_ref: `vistaseeds-x-import-${item.id}`,
        x_tweet_id: item.id,
        posted_at: postedAt,
        created_at: new Date(),
      });
      imported += 1;
    }

    return reply.code(200).send({ ok: true, account, imported, skipped, total: remoteTweets.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    req.log.error({ err: message }, 'twitter_history_sync_failed');
    return reply.code(500).send({ ok: false, error: 'twitter_history_sync_failed', message });
  }
}

function pickProduct(products: TwitterProduct[]): TwitterProduct | null {
  return products.find((product) => product.title.trim()) ?? null;
}

function pickPreferredProduct(products: TwitterProduct[], preferred?: string): TwitterProduct | null {
  if (!preferred) return pickProduct(products);
  const needle = preferred.toLocaleLowerCase('tr-TR');
  return products.find((product) => product.title.toLocaleLowerCase('tr-TR').includes(needle)) ?? pickProduct(products);
}

function normalizeTwitterTemplate(value: unknown): TwitterTemplate {
  const raw = String(value || '').trim();
  if (Object.values(TwitterTemplate).includes(raw as TwitterTemplate)) return raw as TwitterTemplate;
  return TwitterTemplate.LocalSeedValue;
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
  const mediaUrl = template === TwitterTemplate.VarietyPromo
    ? twitterMediaForProduct(ctx.product?.title, slot.preferredProduct) || ctx.product?.imageUrl || null
    : twitterMediaForSlot(slot.key);

  return {
    id: slot.key,
    template,
    title: `${slot.pillar} — ${slot.topic}`,
    description: slot.preferredProduct
      ? `Tercih edilen ürün: ${slot.preferredProduct}. Bulunamazsa katalogdan uygun ürün seçilir.`
      : 'Strateji dokümanındaki 30 günlük rotasyondan otomatik üretilir.',
    slot_label: `${DAY_LABELS[slot.dayOfWeek]} ${String(slot.hour).padStart(2, '0')}:${String(slot.minute).padStart(2, '0')} TR`,
    content: composeTweetText(caption, hashtags),
    media_url: mediaUrl,
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
        strategySlotKey: slot.key,
        strategyTopic: slot.topic,
      }, now);
    });

    return reply.code(200).send({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    req.log.error({ err: message }, 'twitter_template_previews_failed');
    return reply.code(500).send({ error: 'twitter_template_previews_failed', message });
  }
}

async function twitterAiDraft(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = (req.body ?? {}) as TwitterAiDraftBody;
    const template = normalizeTwitterTemplate(body.template);
    const topic = String(body.topic || '').trim().slice(0, 500);
    const currentText = String(body.current_text || '').trim().slice(0, 500);
    const productId = String(body.product_id || '').trim();
    const products = await repoGetTwitterProducts(50);
    const product = productId
      ? products.find((item) => item.id === productId) ?? null
      : template === TwitterTemplate.VarietyPromo || template === TwitterTemplate.AgronomyTip
        ? pickProduct(products)
        : null;
    const event = findTwitterCalendarEvent(new Date());
    const ctx = {
      product,
      event,
      linkUrl: product?.productUrl || siteUrl(),
      strategyTopic: topic || undefined,
    } satisfies TwitterTweetContext;
    const hashtags = hashtagsFor(template, ctx);
    const baseTopic = buildTweetTopic(template, ctx);
    const aiTopic = [
      baseTopic,
      '',
      'Manuel editor istegi:',
      topic || 'VistaSeeds icin bugune uygun, sade ve guvenilir bir X tweet taslagi hazirla.',
      currentText ? `Mevcut taslak varsa bunu gelistir: ${currentText}` : '',
      '',
      'Cikti kurallari:',
      '- Yalnizca tweet govdesini yaz; hashtag yazma.',
      '- 1-2 kisa paragraf yeterli.',
      '- Emojiyi az kullan; profesyonel ve uretici odakli kal.',
      '- Urun bilgisi katalogda yoksa iddia uydurma.',
    ].filter(Boolean).join('\n');

    let caption: string;
    let model = 'fallback';
    let source: 'ai' | 'fallback' = 'ai';
    try {
      const ai = await generateTweetCaption(aiTopic);
      caption = stripInlineHashtags(ai.caption);
      model = ai.model;
    } catch (err) {
      source = 'fallback';
      caption = buildTweetFallback(template, ctx, isoWeek(new Date()));
      req.log.warn({ err: err instanceof Error ? err.message : String(err) }, 'twitter_ai_draft_fallback');
    }

    const safeCaption = trimToTweet(caption, hashtags);
    const mediaUrl = template === TwitterTemplate.VarietyPromo
      ? twitterMediaForProduct(product?.title, undefined) || product?.imageUrl || null
      : null;

    return reply.code(200).send({
      ok: true,
      source,
      model,
      caption: safeCaption,
      hashtags,
      text: composeTweetText(safeCaption, hashtags),
      media_url: mediaUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    req.log.error({ err: message }, 'twitter_ai_draft_failed');
    return reply.code(500).send({ ok: false, error: 'twitter_ai_draft_failed', message });
  }
}

export async function registerTwitterContentAdmin(app: FastifyInstance) {
  app.get('/twitter/templates', twitterTemplatePreviews);
  app.post('/twitter/ai-draft', twitterAiDraft);
  app.post('/twitter/sync-history', syncTwitterHistory);
}
