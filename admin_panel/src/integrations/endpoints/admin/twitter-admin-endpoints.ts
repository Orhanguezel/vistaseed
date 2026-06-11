// ===================================================================
// FILE: src/integrations/endpoints/admin/twitter-admin-endpoints.ts
// Twitter/X admin endpoints
// ===================================================================

import type { FetchArgs } from "@reduxjs/toolkit/query";

import { baseApi } from "@/integrations/base-api";
import type {
  TwitterAiDraftBody,
  TwitterAiDraftResp,
  TwitterLogListParams,
  TwitterLogListResp,
  TwitterSendBody,
  TwitterSendResp,
  TwitterSyncHistoryResp,
  TwitterStatusResp,
  TwitterTemplatePreviewResp,
  TwitterVerifyResp,
} from "@/integrations/shared";
import { TWITTER_ADMIN_BASE } from "@/integrations/shared";

export const twitterAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /** GET /admin/twitter/status */
    twitterStatus: b.query<TwitterStatusResp, void>({
      query: (): FetchArgs => ({ url: `${TWITTER_ADMIN_BASE}/status` }),
    }),

    /** GET /admin/twitter/templates */
    twitterTemplatePreviews: b.query<TwitterTemplatePreviewResp, void>({
      query: (): FetchArgs => ({ url: `${TWITTER_ADMIN_BASE}/templates` }),
    }),

    /** POST /admin/twitter/verify */
    twitterVerify: b.mutation<TwitterVerifyResp, void>({
      query: (): FetchArgs => ({
        url: `${TWITTER_ADMIN_BASE}/verify`,
        method: "POST",
        body: {},
      }),
    }),

    /** POST /admin/twitter/sync-history */
    twitterSyncHistory: b.mutation<TwitterSyncHistoryResp, void>({
      query: (): FetchArgs => ({
        url: `${TWITTER_ADMIN_BASE}/sync-history`,
        method: "POST",
        body: {},
      }),
    }),

    /** POST /admin/twitter/ai-draft */
    twitterAiDraft: b.mutation<TwitterAiDraftResp, TwitterAiDraftBody>({
      query: (body): FetchArgs => ({
        url: `${TWITTER_ADMIN_BASE}/ai-draft`,
        method: "POST",
        body,
      }),
    }),

    /** POST /admin/twitter/send */
    twitterSend: b.mutation<TwitterSendResp, TwitterSendBody>({
      query: (body): FetchArgs => ({
        url: `${TWITTER_ADMIN_BASE}/send`,
        method: "POST",
        body,
      }),
    }),

    /** GET /admin/twitter/tweets */
    twitterListTweets: b.query<TwitterLogListResp, TwitterLogListParams | undefined>({
      query: (params): FetchArgs => ({
        url: `${TWITTER_ADMIN_BASE}/tweets`,
        params: params ?? {},
      }),
    }),

    /** POST /admin/twitter/tweets/:id/cancel */
    twitterCancelTweet: b.mutation<{ ok: boolean }, string>({
      query: (id): FetchArgs => ({
        url: `${TWITTER_ADMIN_BASE}/tweets/${id}/cancel`,
        method: "POST",
        body: {},
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useTwitterStatusQuery,
  useTwitterTemplatePreviewsQuery,
  useTwitterVerifyMutation,
  useTwitterSyncHistoryMutation,
  useTwitterAiDraftMutation,
  useTwitterSendMutation,
  useTwitterListTweetsQuery,
  useLazyTwitterListTweetsQuery,
  useTwitterCancelTweetMutation,
} = twitterAdminApi;
