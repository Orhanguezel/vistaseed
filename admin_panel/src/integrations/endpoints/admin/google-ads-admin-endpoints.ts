// ===================================================================
// FILE: src/integrations/endpoints/admin/google-ads-admin-endpoints.ts
// Google Ads admin endpoints
// ===================================================================

import type { FetchArgs } from "@reduxjs/toolkit/query";

import { baseApi } from "@/integrations/base-api";
import type {
  GoogleAdsAssetGroupsResp,
  GoogleAdsAssetImagesResp,
  GoogleAdsAssetRemoveBody,
  GoogleAdsAssetRemoveResp,
  GoogleAdsAssetUploadArgs,
  GoogleAdsAssetUploadResp,
  GoogleAdsCampaignsResp,
  GoogleAdsDateRange,
  GoogleAdsInsightsResp,
  GoogleAdsKeywordStatusBody,
  GoogleAdsKeywordStatusResp,
  GoogleAdsSetBudgetBody,
  GoogleAdsSetBudgetResp,
  GoogleAdsSetStatusBody,
  GoogleAdsSetStatusResp,
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

    /** GET /admin/google-ads/insights?range=&campaign_id= */
    googleAdsInsights: b.query<GoogleAdsInsightsResp, { range?: GoogleAdsDateRange; campaign_id?: string } | void>({
      query: (params): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/insights`,
        params: params ?? {},
      }),
    }),

    /** POST /admin/google-ads/keywords/status */
    googleAdsKeywordStatus: b.mutation<GoogleAdsKeywordStatusResp, GoogleAdsKeywordStatusBody>({
      query: (body): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/keywords/status`,
        method: "POST",
        body,
      }),
    }),

    /** POST /admin/google-ads/campaigns/:id/status */
    googleAdsSetStatus: b.mutation<GoogleAdsSetStatusResp, GoogleAdsSetStatusBody>({
      query: ({ id, status }): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/campaigns/${id}/status`,
        method: "POST",
        body: { status },
      }),
    }),

    /** POST /admin/google-ads/campaigns/budget */
    googleAdsSetBudget: b.mutation<GoogleAdsSetBudgetResp, GoogleAdsSetBudgetBody>({
      query: (body): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/campaigns/budget`,
        method: "POST",
        body,
      }),
    }),

    /** GET /admin/google-ads/asset-groups */
    googleAdsAssetGroups: b.query<GoogleAdsAssetGroupsResp, void>({
      query: (): FetchArgs => ({ url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups` }),
    }),

    /** GET /admin/google-ads/asset-groups/:id/images */
    googleAdsAssetImages: b.query<GoogleAdsAssetImagesResp, { id: string }>({
      query: ({ id }): FetchArgs => ({ url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups/${id}/images` }),
    }),

    /** POST /admin/google-ads/asset-groups/:id/images (multipart) */
    googleAdsUploadAsset: b.mutation<GoogleAdsAssetUploadResp, GoogleAdsAssetUploadArgs>({
      query: ({ assetGroupId, fieldType, file }): FetchArgs => {
        const form = new FormData();
        form.append("file", file);
        return {
          url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups/${assetGroupId}/images`,
          method: "POST",
          params: { field_type: fieldType },
          body: form,
        };
      },
    }),

    /** POST /admin/google-ads/asset-groups/images/remove */
    googleAdsRemoveAsset: b.mutation<GoogleAdsAssetRemoveResp, GoogleAdsAssetRemoveBody>({
      query: (body): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups/images/remove`,
        method: "POST",
        body,
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
  useGoogleAdsSetStatusMutation,
  useGoogleAdsSetBudgetMutation,
  useGoogleAdsInsightsQuery,
  useGoogleAdsKeywordStatusMutation,
  useGoogleAdsAssetGroupsQuery,
  useGoogleAdsAssetImagesQuery,
  useGoogleAdsUploadAssetMutation,
  useGoogleAdsRemoveAssetMutation,
} = googleAdsAdminApi;
