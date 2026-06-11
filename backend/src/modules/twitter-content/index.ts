// src/modules/twitter-content/index.ts
// External module surface for twitter-content. Keep explicit; no export *.

export { startTwitterContentScheduler, stopTwitterContentScheduler } from './scheduler';
export { buildTwitterQueueForToday } from './planner';

export {
  TWITTER_SLOTS,
  TwitterTemplate,
  buildTweetTopic,
  chooseTwitterTemplate,
  compactDescription,
} from './templates';
export type { TwitterTemplateSlot, TwitterTweetContext } from './templates';

export {
  buildTweetFallback,
  composeTweetText,
  stripInlineHashtags,
  trimToTweet,
} from './fallbacks';

export { deriveTwitterHashtags, cropTagFromTitle, toTag } from './hashtags';
export { TWITTER_CALENDAR_EVENTS, findTwitterCalendarEvent } from './calendar';
export type { TwitterCalendarEvent } from './calendar';

export { repoGetTwitterProducts, buildProductUrl } from './repository';
export type { TwitterProduct } from './repository';

export { generateTweetCaption } from './ai';
export { berlinParts, todayISO, toBerlinSlotUtc, isoWeek } from './time';
