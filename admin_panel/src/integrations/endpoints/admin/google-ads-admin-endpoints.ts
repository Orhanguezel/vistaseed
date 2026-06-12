// ===================================================================
// FILE: src/integrations/endpoints/admin/google-ads-admin-endpoints.ts
// Google Ads admin endpoints
// ===================================================================

import type { FetchArgs } from "@reduxjs/toolkit/query";

import { baseApi } from "@/integrations/base-api";
import type {
  GoogleAdsAdGroupsResp,
  GoogleAdsBiddingArgs,
  GoogleAdsBiddingResp,
  GoogleAdsKeywordAddArgs,
  GoogleAdsKeywordMutationResp,
  GoogleAdsNegativeKeywordArgs,
  GoogleAdsReportResp,
  GoogleAdsAssetGroupsResp,
  GoogleAdsAssetsResp,
  GoogleAdsAssetMutationResp,
  GoogleAdsAssetRemoveBody,
  GoogleAdsAssetRemoveResp,
  GoogleAdsAssetUploadArgs,
  GoogleAdsAssetUrlArgs,
  GoogleAdsAssetTextArgs,
  GoogleAdsAssetVideoArgs,
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

    /** POST /admin/google-ads/campaigns/:id/bidding */
    googleAdsSetBidding: b.mutation<GoogleAdsBiddingResp, GoogleAdsBiddingArgs>({
      query: ({ id, ...body }): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/campaigns/${id}/bidding`,
        method: "POST",
        body,
      }),
    }),

    /** GET /admin/google-ads/report?range= */
    googleAdsReport: b.query<GoogleAdsReportResp, { range?: GoogleAdsDateRange } | void>({
      query: (params): FetchArgs => ({ url: `${GOOGLE_ADS_ADMIN_BASE}/report`, params: params ?? {} }),
    }),

    /** GET /admin/google-ads/campaigns/:id/ad-groups */
    googleAdsAdGroups: b.query<GoogleAdsAdGroupsResp, { id: string }>({
      query: ({ id }): FetchArgs => ({ url: `${GOOGLE_ADS_ADMIN_BASE}/campaigns/${id}/ad-groups` }),
    }),

    /** POST /admin/google-ads/keywords/negative */
    googleAdsAddNegativeKeyword: b.mutation<GoogleAdsKeywordMutationResp, GoogleAdsNegativeKeywordArgs>({
      query: (body): FetchArgs => ({ url: `${GOOGLE_ADS_ADMIN_BASE}/keywords/negative`, method: "POST", body }),
    }),

    /** POST /admin/google-ads/keywords/add */
    googleAdsAddKeyword: b.mutation<GoogleAdsKeywordMutationResp, GoogleAdsKeywordAddArgs>({
      query: (body): FetchArgs => ({ url: `${GOOGLE_ADS_ADMIN_BASE}/keywords/add`, method: "POST", body }),
    }),

    /** GET /admin/google-ads/asset-groups */
    googleAdsAssetGroups: b.query<GoogleAdsAssetGroupsResp, void>({
      query: (): FetchArgs => ({ url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups` }),
    }),

    /** GET /admin/google-ads/asset-groups/:id/assets */
    googleAdsAssetGroupAssets: b.query<GoogleAdsAssetsResp, { id: string }>({
      query: ({ id }): FetchArgs => ({ url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups/${id}/assets` }),
    }),

    /** POST /admin/google-ads/asset-groups/:id/images (multipart) */
    googleAdsUploadAsset: b.mutation<GoogleAdsAssetMutationResp, GoogleAdsAssetUploadArgs>({
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

    /** POST /admin/google-ads/asset-groups/:id/image-url (kütüphane/galeri URL'i) */
    googleAdsUploadAssetUrl: b.mutation<GoogleAdsAssetMutationResp, GoogleAdsAssetUrlArgs>({
      query: ({ assetGroupId, fieldType, url }): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups/${assetGroupId}/image-url`,
        method: "POST",
        body: { field_type: fieldType, url },
      }),
    }),

    /** POST /admin/google-ads/asset-groups/:id/text */
    googleAdsAddText: b.mutation<GoogleAdsAssetMutationResp, GoogleAdsAssetTextArgs>({
      query: ({ assetGroupId, fieldType, text }): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups/${assetGroupId}/text`,
        method: "POST",
        body: { field_type: fieldType, text },
      }),
    }),

    /** POST /admin/google-ads/asset-groups/:id/video */
    googleAdsAddVideo: b.mutation<GoogleAdsAssetMutationResp, GoogleAdsAssetVideoArgs>({
      query: ({ assetGroupId, youtube }): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups/${assetGroupId}/video`,
        method: "POST",
        body: { youtube },
      }),
    }),

    /** POST /admin/google-ads/asset-groups/assets/remove */
    googleAdsRemoveAsset: b.mutation<GoogleAdsAssetRemoveResp, GoogleAdsAssetRemoveBody>({
      query: (body): FetchArgs => ({
        url: `${GOOGLE_ADS_ADMIN_BASE}/asset-groups/assets/remove`,
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
  useGoogleAdsSetBiddingMutation,
  useGoogleAdsReportQuery,
  useLazyGoogleAdsAdGroupsQuery,
  useGoogleAdsAddNegativeKeywordMutation,
  useGoogleAdsAddKeywordMutation,
  useGoogleAdsAssetGroupsQuery,
  useGoogleAdsAssetGroupAssetsQuery,
  useGoogleAdsUploadAssetMutation,
  useGoogleAdsUploadAssetUrlMutation,
  useGoogleAdsAddTextMutation,
  useGoogleAdsAddVideoMutation,
  useGoogleAdsRemoveAssetMutation,
} = googleAdsAdminApi;
