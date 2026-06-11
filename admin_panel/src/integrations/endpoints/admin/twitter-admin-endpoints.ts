// ===================================================================
// FILE: src/integrations/endpoints/admin/twitter-admin-endpoints.ts
// Twitter/X admin endpoints
// ===================================================================

import { baseApi } from '@/integrations/base-api';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import type {
  TwitterLogListParams,
  TwitterLogListResp,
  TwitterSendBody,
  TwitterSendResp,
  TwitterStatusResp,
  TwitterVerifyResp,
} from '@/integrations/shared';
import { TWITTER_ADMIN_BASE } from '@/integrations/shared';

export const twitterAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /** GET /admin/twitter/status */
    twitterStatus: b.query<TwitterStatusResp, void>({
      query: (): FetchArgs => ({ url: `${TWITTER_ADMIN_BASE}/status` }),
    }),

    /** POST /admin/twitter/verify */
    twitterVerify: b.mutation<TwitterVerifyResp, void>({
      query: (): FetchArgs => ({
        url: `${TWITTER_ADMIN_BASE}/verify`,
        method: 'POST',
        body: {},
      }),
    }),

    /** POST /admin/twitter/send */
    twitterSend: b.mutation<TwitterSendResp, TwitterSendBody>({
      query: (body): FetchArgs => ({
        url: `${TWITTER_ADMIN_BASE}/send`,
        method: 'POST',
        body,
      }),
    }),

    /** GET /admin/twitter/tweets */
    twitterListTweets: b.query<TwitterLogListResp, TwitterLogListParams | void>({
      query: (params): FetchArgs => ({
        url: `${TWITTER_ADMIN_BASE}/tweets`,
        params: params ?? {},
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useTwitterStatusQuery,
  useTwitterVerifyMutation,
  useTwitterSendMutation,
  useTwitterListTweetsQuery,
  useLazyTwitterListTweetsQuery,
} = twitterAdminApi;
