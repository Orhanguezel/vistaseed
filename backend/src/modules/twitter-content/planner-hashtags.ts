// src/modules/twitter-content/planner-hashtags.ts
// X slotlarına özel hashtag seçimi (şablon bazlı)

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
import { TwitterTemplate, type TwitterTweetContext } from './templates';

export function buildTwitterSlotHashtags(template: TwitterTemplate, ctx: TwitterTweetContext): string {
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
