import { extractArray, getErrorMessage, toStr, trimStr, type UnknownRow } from "@/integrations/shared/common";
import type { SettingValue, SiteSetting } from "@/integrations/shared/site-settings";

export const SITE_SETTINGS_API_KEYS = [
  "twitter_enabled",
  "twitter_api_key",
  "twitter_api_secret",
  "twitter_access_token",
  "twitter_access_token_secret",
  "facebook_enabled",
  "facebook_page_id",
  "facebook_page_access_token",
  "instagram_enabled",
  "instagram_business_account_id",
  "instagram_access_token",
  "linkedin_enabled",
  "linkedin_organization_urn",
  "linkedin_access_token",
  "youtube_enabled",
  "youtube_channel_id",
  "youtube_access_token",
  "google_client_id",
  "google_client_secret",
  "cloudinary_cloud_name",
  "cloudinary_api_key",
  "cloudinary_api_secret",
  "cloudinary_folder",
  "cloudinary_unsigned_preset",
  "gtm_container_id",
  "ga4_measurement_id",
  "ai_provider_order",
  "groq_api_key",
  "groq_model",
  "openai_api_key",
  "openai_model",
  "anthropic_api_key",
  "anthropic_model",
  "xai_api_key",
  "xai_model",
] as const;

export type SiteSettingsApiKey = (typeof SITE_SETTINGS_API_KEYS)[number];
export type SiteSettingsApiForm = Record<SiteSettingsApiKey, string>;

export type SiteSettingsApiFieldDef = {
  key: SiteSettingsApiKey;
  labelKey: string;
  type?: "password" | "text" | "switch";
  placeholderKey?: string;
};

export type SiteSettingsApiSectionDef = {
  titleKey: string;
  fields: SiteSettingsApiFieldDef[];
  testEndpoint?: string;
};

export type SiteSettingsApiTestResult = {
  ok: boolean;
  message: string;
};

export const EMPTY_SITE_SETTINGS_API_FORM: SiteSettingsApiForm = Object.fromEntries(
  SITE_SETTINGS_API_KEYS.map((key) => [key, ""]),
) as SiteSettingsApiForm;

export const SITE_SETTINGS_API_SECTIONS: SiteSettingsApiSectionDef[] = [
  {
    titleKey: "twitter",
    fields: [
      { key: "twitter_enabled", labelKey: "twitterEnabled", type: "switch" },
      { key: "twitter_api_key", labelKey: "twitterApiKey", type: "password" },
      { key: "twitter_api_secret", labelKey: "twitterApiSecret", type: "password" },
      { key: "twitter_access_token", labelKey: "twitterAccessToken", type: "password" },
      { key: "twitter_access_token_secret", labelKey: "twitterAccessTokenSecret", type: "password" },
    ],
  },
  {
    titleKey: "facebook",
    fields: [
      { key: "facebook_enabled", labelKey: "facebookEnabled", type: "switch" },
      { key: "facebook_page_id", labelKey: "facebookPageId" },
      { key: "facebook_page_access_token", labelKey: "facebookPageAccessToken", type: "password" },
    ],
  },
  {
    titleKey: "instagram",
    fields: [
      { key: "instagram_enabled", labelKey: "instagramEnabled", type: "switch" },
      { key: "instagram_business_account_id", labelKey: "instagramBusinessAccountId" },
      { key: "instagram_access_token", labelKey: "instagramAccessToken", type: "password" },
    ],
  },
  {
    titleKey: "linkedin",
    fields: [
      { key: "linkedin_enabled", labelKey: "linkedinEnabled", type: "switch" },
      { key: "linkedin_organization_urn", labelKey: "linkedinOrganizationUrn" },
      { key: "linkedin_access_token", labelKey: "linkedinAccessToken", type: "password" },
    ],
  },
  {
    titleKey: "youtube",
    fields: [
      { key: "youtube_enabled", labelKey: "youtubeEnabled", type: "switch" },
      { key: "youtube_channel_id", labelKey: "youtubeChannelId" },
      { key: "youtube_access_token", labelKey: "youtubeAccessToken", type: "password" },
    ],
  },
  {
    titleKey: "googleOAuth",
    testEndpoint: "/api/admin/site_settings/test/google",
    fields: [
      { key: "google_client_id", labelKey: "clientId", placeholderKey: "googleClientId" },
      { key: "google_client_secret", labelKey: "clientSecret", type: "password" },
    ],
  },
  {
    titleKey: "cloudinary",
    testEndpoint: "/api/admin/site_settings/test/cloudinary",
    fields: [
      { key: "cloudinary_cloud_name", labelKey: "cloudName" },
      { key: "cloudinary_api_key", labelKey: "apiKey" },
      { key: "cloudinary_api_secret", labelKey: "apiSecret", type: "password" },
      { key: "cloudinary_folder", labelKey: "folder", placeholderKey: "cloudinaryFolder" },
      { key: "cloudinary_unsigned_preset", labelKey: "unsignedPreset" },
    ],
  },
  {
    titleKey: "analytics",
    fields: [
      { key: "gtm_container_id", labelKey: "gtmContainerId", placeholderKey: "gtmContainerId" },
      { key: "ga4_measurement_id", labelKey: "ga4MeasurementId", placeholderKey: "ga4MeasurementId" },
    ],
  },
  {
    titleKey: "groq",
    testEndpoint: "/api/admin/site_settings/test/groq",
    fields: [
      { key: "groq_api_key", labelKey: "apiKey", type: "password" },
      { key: "groq_model", labelKey: "model", placeholderKey: "groqModel" },
    ],
  },
  {
    titleKey: "openai",
    testEndpoint: "/api/admin/site_settings/test/openai",
    fields: [
      { key: "openai_api_key", labelKey: "apiKey", type: "password" },
      { key: "openai_model", labelKey: "model", placeholderKey: "openaiModel" },
    ],
  },
  {
    titleKey: "anthropic",
    testEndpoint: "/api/admin/site_settings/test/anthropic",
    fields: [
      { key: "anthropic_api_key", labelKey: "apiKey", type: "password" },
      { key: "anthropic_model", labelKey: "model", placeholderKey: "anthropicModel" },
    ],
  },
  {
    titleKey: "grok",
    testEndpoint: "/api/admin/site_settings/test/grok",
    fields: [
      { key: "xai_api_key", labelKey: "apiKey", type: "password" },
      { key: "xai_model", labelKey: "model", placeholderKey: "grokModel" },
    ],
  },
];

export function createSiteSettingsApiForm(): SiteSettingsApiForm {
  return { ...EMPTY_SITE_SETTINGS_API_FORM };
}

export function mapSiteSettingsToApiForm(settings?: SiteSetting[] | unknown): SiteSettingsApiForm {
  const form = createSiteSettingsApiForm();

  for (const item of extractArray(settings)) {
    const row = item as UnknownRow;
    const key = toStr(row.key) as SiteSettingsApiKey;
    if (key in form) form[key] = toStr(row.value);
  }

  return form;
}

export function buildSiteSettingsApiUpdates(
  form: SiteSettingsApiForm,
): Array<{ key: SiteSettingsApiKey; value: SettingValue }> {
  return SITE_SETTINGS_API_KEYS.map((key) => ({
    key,
    value: key.endsWith("_enabled") ? (form[key] === "true" ? "true" : "false") : trimStr(form[key]),
  }));
}

export function getSiteSettingsApiErrorMessage(err: unknown, fallback: string): string {
  return getErrorMessage(err) || fallback;
}
