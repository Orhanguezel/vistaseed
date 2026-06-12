// ===================================================================
// FILE: src/integrations/endpoints/admin/google-ads-admin-endpoints.ts
// Google Ads admin endpoints
// ===================================================================

import type { FetchArgs } from "@reduxjs/toolkit/query";

import { baseApi } from "@/integrations/base-api";
import type {
  GoogleAdsCampaignsResp,
  GoogleAdsDateRange,
  GoogleAdsStatusResp,
  GoogleAdsVerifyResp,
} from "@/integrations/shared";
import { GOOGLE_ADS_ADMIN_BASE } from "@/integrations/shared";

export const googleAdsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /** GET /admin/google-ads/status */
    googleAdsStatus: b.query<GoogleAdsStatusResp, void>({
      query: (): FetchArgs => ({ url: `${GOOGLE_ADS_ADMIN_BASE}/status` }),
    }),

    /** POST /admin/google-ads/verify */
    googleAdsVerify: b.mutation<GoogleAdsVerifyResp, void>({
      query: (): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/verify`,
        method: "POST",
        body: {},
      }),
    }),

    /** GET /admin/google-ads/campaigns?range= */
    googleAdsCampaigns: b.query<GoogleAdsCampaignsResp, { range?: GoogleAdsDateRange } | void>({
      query: (params): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/campaigns`,
        params: params ?? {},
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGoogleAdsStatusQuery,
  useGoogleAdsVerifyMutation,
  useGoogleAdsCampaignsQuery,
  useLazyGoogleAdsCampaignsQuery,
} = googleAdsAdminApi;
