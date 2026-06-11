// ===================================================================
// FILE: src/integrations/shared/twitter.ts
// Twitter/X Admin API types + settings keys
// ===================================================================

export const TWITTER_ADMIN_BASE = "/admin/twitter";

export const TWEET_MAX_LENGTH = 280;

/** site_settings içindeki Twitter anahtarları (BE: modules/twitter/settings.ts) */
export const TWITTER_SETTINGS_KEYS = [
  "twitter_enabled",
  "twitter_api_key",
  "twitter_api_secret",
  "twitter_access_token",
  "twitter_access_token_secret",
] as const;

export type TwitterSettingsKey = (typeof TWITTER_SETTINGS_KEYS)[number];

export type TwitterSettingsModel = Record<TwitterSettingsKey, string>;

export const TWITTER_BOOLEAN_SETTINGS_KEYS = new Set<TwitterSettingsKey>(["twitter_enabled"]);

export function createTwitterSettingsDefaults(): TwitterSettingsModel {
  return {
    twitter_enabled: "false",
    twitter_api_key: "",
    twitter_api_secret: "",
    twitter_access_token: "",
    twitter_access_token_secret: "",
  };
}

export type TwitterCredentialFieldDef = {
  settingsKey: TwitterSettingsKey;
  i18nKey: string;
};

export const TWITTER_CREDENTIAL_FIELDS: TwitterCredentialFieldDef[] = [
  { settingsKey: "twitter_api_key", i18nKey: "apiKey" },
  { settingsKey: "twitter_api_secret", i18nKey: "apiSecret" },
  { settingsKey: "twitter_access_token", i18nKey: "accessToken" },
  { settingsKey: "twitter_access_token_secret", i18nKey: "accessTokenSecret" },
] as const;

/** GET /admin/twitter/status */
export type TwitterStatusResp = {
  enabled: boolean;
  has_credentials: boolean;
};

/** GET /admin/twitter/templates */
export type TwitterTemplatePreview = {
  id: string;
  title: string;
  description: string;
  slot_label: string;
  template: string;
  content: string;
  media_url: string | null;
};

export type TwitterTemplatePreviewResp = {
  items: TwitterTemplatePreview[];
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

export type TwitterSyncHistoryResp = {
  ok: boolean;
  imported: number;
  skipped: number;
  total: number;
  account?: {
    id: string;
    name: string;
    username: string;
  };
  error?: string;
  message?: string;
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
export type TweetStatus = "queued" | "posting" | "sent" | "failed" | "canceled";

export type TweetLogRow = {
  id: string;
  content: string;
  status: TweetStatus;
  source: string;
  template: string | null;
  source_ref: string | null;
  scheduled_at: string | null;
  posted_at: string | null;
  retry_count: number;
  x_tweet_id: string | null;
  error_message: string | null;
  created_at: string;
};

export type TwitterLogListParams = {
  status?: TweetStatus;
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
