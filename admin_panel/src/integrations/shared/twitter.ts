// ===================================================================
// FILE: src/integrations/shared/twitter.ts
// Twitter/X Admin API types + settings keys
// ===================================================================

export const TWITTER_ADMIN_BASE = '/admin/twitter';

export const TWEET_MAX_LENGTH = 280;

/** site_settings içindeki Twitter anahtarları (BE: modules/twitter/settings.ts) */
export const TWITTER_SETTINGS_KEYS = [
  'twitter_enabled',
  'twitter_api_key',
  'twitter_api_secret',
  'twitter_access_token',
  'twitter_access_token_secret',
] as const;

export type TwitterSettingsKey = (typeof TWITTER_SETTINGS_KEYS)[number];

export type TwitterSettingsModel = Record<TwitterSettingsKey, string>;

export const TWITTER_BOOLEAN_SETTINGS_KEYS = new Set<TwitterSettingsKey>(['twitter_enabled']);

export function createTwitterSettingsDefaults(): TwitterSettingsModel {
  return {
    twitter_enabled: 'false',
    twitter_api_key: '',
    twitter_api_secret: '',
    twitter_access_token: '',
    twitter_access_token_secret: '',
  };
}

export type TwitterCredentialFieldDef = {
  settingsKey: TwitterSettingsKey;
  i18nKey: string;
};

export const TWITTER_CREDENTIAL_FIELDS: TwitterCredentialFieldDef[] = [
  { settingsKey: 'twitter_api_key', i18nKey: 'apiKey' },
  { settingsKey: 'twitter_api_secret', i18nKey: 'apiSecret' },
  { settingsKey: 'twitter_access_token', i18nKey: 'accessToken' },
  { settingsKey: 'twitter_access_token_secret', i18nKey: 'accessTokenSecret' },
] as const;

/** GET /admin/twitter/status */
export type TwitterStatusResp = {
  enabled: boolean;
  has_credentials: boolean;
};

/** POST /admin/twitter/verify */
export type TwitterVerifyResp = {
  ok: boolean;
  account?: {
    id: string;
    name: string;
    username: string;
  };
};

/** POST /admin/twitter/send */
export type TwitterSendBody = {
  text: string;
};

export type TwitterSendResp = {
  ok: boolean;
  tweet_id: string;
};

/** GET /admin/twitter/tweets */
export type TweetLogRow = {
  id: string;
  content: string;
  status: 'sent' | 'failed';
  source: string;
  x_tweet_id: string | null;
  error_message: string | null;
  created_at: string;
};

export type TwitterLogListParams = {
  status?: 'sent' | 'failed';
  page?: number;
  limit?: number;
};

export type TwitterLogListResp = {
  items: TweetLogRow[];
  total: number;
  page: number;
  limit: number;
};

export function buildTweetUrl(xTweetId: string): string {
  return `https://x.com/i/web/status/${xTweetId}`;
}
