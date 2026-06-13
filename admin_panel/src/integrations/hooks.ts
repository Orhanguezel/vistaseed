"use client";

// =============================================================
// FILE: src/integrations/hooks.ts
// Explicit barrel exports for RTK Query hooks (vistaseeds)
// =============================================================

// =========================
// Public / Shared endpoints
// =========================

export {
  useGetSiteSettingByKeyQuery,
  useLazyGetSiteSettingByKeyQuery,
  useLazyListSiteSettingsQuery,
  useListSiteSettingsQuery,
} from "@/integrations/endpoints/public/site-settings-public-endpoints";
export {
  useAuthLogoutMutation,
  useAuthMeQuery,
  useAuthPasswordResetConfirmMutation,
  useAuthPasswordResetRequestMutation,
  useAuthRefreshMutation,
  useAuthSignupMutation,
  useAuthStatusQuery,
  useAuthTokenMutation,
  useAuthUpdateMutation,
  useLogoutMutation,
  useStatusQuery,
} from "@/integrations/endpoints/users/auth-public-endpoints";
export {
  useGetMyProfileQuery,
  useGetProfileByIdQuery,
  useUpsertMyProfileMutation,
} from "@/integrations/endpoints/users/profiles-endpoints";
export {
  useCreateUserRoleMutation,
  useDeleteUserRoleMutation,
  useListUserRolesQuery,
} from "@/integrations/endpoints/users/user-roles-endpoints";

// ==============
// Admin endpoints
// ==============

export {
  useGetAnalyticsAdsAttributionAdminQuery,
  useGetAnalyticsAdsDailyAdminQuery,
  useGetAnalyticsDeviceDailyAdminQuery,
  useGetAnalyticsFunnelAdminQuery,
  useGetAnalyticsHeatmapAdminQuery,
  useGetAnalyticsOverviewAdminQuery,
  useGetAnalyticsRetentionAdminQuery,
} from "@/integrations/endpoints/admin/analytics-admin-endpoints";
export {
  useClearAuditLogsAdminMutation,
  useGetAuditGeoCitiesAdminQuery,
  useGetAuditGeoStatsAdminQuery,
  useGetAuditMetricsDailyAdminQuery,
  useListAuditAuthEventsAdminQuery,
  useListAuditRequestLogsAdminQuery,
} from "@/integrations/endpoints/admin/audit-admin-endpoints";
export {
  useCreateBlogPostAdminMutation,
  useDeleteBlogPostAdminMutation,
  useGetBlogPostAdminQuery,
  useImportBlogRssAdminMutation,
  useListBlogPostsAdminQuery,
  useUpdateBlogPostAdminMutation,
} from "@/integrations/endpoints/admin/blog-admin-endpoints";
export {
  useCreateCategoryAdminMutation,
  useDeleteCategoryAdminMutation,
  useGetCategoryAdminQuery,
  useLazyGetCategoryAdminQuery,
  useLazyListCategoriesAdminQuery,
  useListCategoriesAdminQuery,
  useReorderCategoriesAdminMutation,
  useSetCategoryImageAdminMutation,
  useToggleCategoryActiveAdminMutation,
  useToggleCategoryFeaturedAdminMutation,
  useToggleCategoryUnlimitedAdminMutation,
  useUpdateCategoryAdminMutation,
} from "@/integrations/endpoints/admin/categories-admin-endpoints";
export {
  useDeleteContactAdminMutation,
  useGetContactAdminQuery,
  useListContactsAdminQuery,
  useUpdateContactAdminMutation,
} from "@/integrations/endpoints/admin/contacts-admin-endpoints";
export {
  useCreateCustomPageAdminMutation,
  useDeleteCustomPageAdminMutation,
  useGetCustomPageAdminQuery,
  useListCustomPagesAdminQuery,
  useReorderCustomPagesAdminMutation,
  useUpdateCustomPageAdminMutation,
} from "@/integrations/endpoints/admin/custom-pages-admin-endpoints";
export { useGetDashboardSummaryAdminQuery } from "@/integrations/endpoints/admin/dashboard-admin-endpoints";
export {
  useBootstrapUiSettingsAdminMutation,
  useCreateDbSnapshotAdminMutation,
  useDeleteDbSnapshotAdminMutation,
  useImportDbFileAdminMutation,
  useImportDbTextAdminMutation,
  useImportDbUrlAdminMutation,
  useImportModuleAdminMutation,
  useLazyExportDbAdminQuery,
  useLazyExportModuleAdminQuery,
  useLazyExportUiSettingsAdminQuery,
  useLazyValidateModulesAdminQuery,
  useListDbSnapshotsAdminQuery,
  useRestoreDbSnapshotAdminMutation,
} from "@/integrations/endpoints/admin/db-admin-endpoints";
export {
  useCreateEmailTemplateAdminMutation,
  useDeleteEmailTemplateAdminMutation,
  useGetEmailTemplateAdminQuery,
  useListEmailTemplatesAdminQuery,
  useUpdateEmailTemplateAdminMutation,
} from "@/integrations/endpoints/admin/email-templates-admin-endpoints";
export {
  useAddGalleryImageAdminMutation,
  useCreateGalleryAdminMutation,
  useDeleteGalleryAdminMutation,
  useDeleteGalleryImageAdminMutation,
  useGetGalleryAdminQuery,
  useListGalleriesAdminQuery,
  useListGalleryImagesAdminQuery,
  useReorderGalleriesAdminMutation,
  useUpdateGalleryAdminMutation,
} from "@/integrations/endpoints/admin/gallery-admin-endpoints";
export {
  useCreateHomeSectionAdminMutation,
  useDeleteHomeSectionAdminMutation,
  useGetHomeSectionAdminQuery,
  useListHomeSectionsAdminQuery,
  useReorderHomeSectionsAdminMutation,
  useUpdateHomeSectionAdminMutation,
} from "@/integrations/endpoints/admin/home-sections-admin-endpoints";
export {
  useDeleteJobApplicationAdminMutation,
  useGetJobApplicationAdminQuery,
  useListJobApplicationsAdminQuery,
  useUpdateJobApplicationStatusAdminMutation,
} from "@/integrations/endpoints/admin/job-applications-admin-endpoints";
export {
  useCreateJobListingAdminMutation,
  useDeleteJobListingAdminMutation,
  useGetJobListingAdminQuery,
  useListJobListingsAdminQuery,
  useReorderJobListingsAdminMutation,
  useToggleJobListingActiveAdminMutation,
  useUpdateJobListingAdminMutation,
} from "@/integrations/endpoints/admin/job-listings-admin-endpoints";
export {
  useAddLibraryFileAdminMutation,
  useAddLibraryImageAdminMutation,
  useCreateLibraryAdminMutation,
  useDeleteLibraryAdminMutation,
  useDeleteLibraryFileAdminMutation,
  useDeleteLibraryImageAdminMutation,
  useGetLibraryAdminQuery,
  useListLibraryAdminQuery,
  useListLibraryFilesAdminQuery,
  useListLibraryImagesAdminQuery,
  useUpdateLibraryAdminMutation,
  useUpdateLibraryFileAdminMutation,
} from "@/integrations/endpoints/admin/library-admin-endpoints";
export {
  useCreateOfferAdminMutation,
  useDeleteOfferAdminMutation,
  useGenerateOfferPdfAdminMutation,
  useGetOfferAdminQuery,
  useListOffersAdminQuery,
  useSendOfferAdminMutation,
  useSendOfferEmailAdminMutation,
  useUpdateOfferAdminMutation,
} from "@/integrations/endpoints/admin/offers-admin-endpoints";
export { useListPaymentAttemptsAdminQuery } from "@/integrations/endpoints/admin/payment-attempts-admin-endpoints";
export {
  useCreatePopupAdminMutation,
  useDeletePopupAdminMutation,
  useGetPopupAdminQuery,
  useListPopupsAdminQuery,
  useReorderPopupsAdminMutation,
  useSetPopupStatusAdminMutation,
  useUpdatePopupAdminMutation,
} from "@/integrations/endpoints/admin/popups-admin-endpoints";
export {
  useAddProductImageAdminMutation,
  useCreateProductAdminMutation,
  useCreateProductFaqAdminMutation,
  useCreateProductReviewAdminMutation,
  useCreateProductSpecAdminMutation,
  useDeleteProductAdminMutation,
  useDeleteProductFaqAdminMutation,
  useDeleteProductImageAdminMutation,
  useDeleteProductReviewAdminMutation,
  useDeleteProductSpecAdminMutation,
  useGetProductAdminQuery,
  useListProductCategoriesAdminQuery,
  useListProductFaqsAdminQuery,
  useListProductImagesAdminQuery,
  useListProductReviewsAdminQuery,
  useListProductSpecsAdminQuery,
  useListProductSubcategoriesAdminQuery,
  useListProductsAdminQuery,
  useReorderProductsAdminMutation,
  useToggleProductReviewActiveAdminMutation,
  useUpdateProductAdminMutation,
  useUpdateProductFaqAdminMutation,
  useUpdateProductReviewAdminMutation,
  useUpdateProductSpecAdminMutation,
} from "@/integrations/endpoints/admin/products-admin-endpoints";
export {
  useAddReferenceImageAdminMutation,
  useCreateReferenceAdminMutation,
  useDeleteReferenceAdminMutation,
  useDeleteReferenceImageAdminMutation,
  useGetReferenceAdminQuery,
  useListReferenceImagesAdminQuery,
  useListReferencesAdminQuery,
  useUpdateReferenceAdminMutation,
} from "@/integrations/endpoints/admin/references-admin-endpoints";
export {
  useBulkUpsertSiteSettingsAdminMutation,
  useCreateSiteSettingAdminMutation,
  useDeleteManySiteSettingsAdminMutation,
  useDeleteSiteSettingAdminMutation,
  useGetAppLocalesAdminQuery,
  useGetDefaultLocaleAdminQuery,
  useGetSiteSettingAdminByKeyQuery,
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
} from "@/integrations/endpoints/admin/site-settings-admin-endpoints";
export {
  useAdminCreateSlideMutation,
  useAdminDeleteSlideMutation,
  useAdminGetSlideQuery,
  useAdminListSlidesQuery,
  useAdminReorderSlidesMutation,
  useAdminSetSlideImageMutation,
  useAdminSetSlideStatusMutation,
  useAdminUpdateSlideMutation,
} from "@/integrations/endpoints/admin/sliders-admin-endpoints";
export {
  useBulkCreateAssetsAdminMutation,
  useBulkDeleteAssetsAdminMutation,
  useCreateAssetAdminMutation,
  useDeleteAssetAdminMutation,
  useDiagCloudinaryAdminQuery,
  useGetAssetAdminQuery,
  useLazyDiagCloudinaryAdminQuery,
  useListAssetsAdminQuery,
  useListFoldersAdminQuery,
  usePatchAssetAdminMutation,
} from "@/integrations/endpoints/admin/storage-admin-endpoints";
export {
  useCreateSupportFaqAdminMutation,
  useDeleteSupportFaqAdminMutation,
  useDeleteSupportTicketAdminMutation,
  useGetSupportFaqAdminQuery,
  useGetSupportTicketAdminQuery,
  useListSupportFaqsAdminQuery,
  useListSupportTicketsAdminQuery,
  useReorderSupportFaqsAdminMutation,
  useUpdateSupportFaqAdminMutation,
  useUpdateSupportTicketAdminMutation,
} from "@/integrations/endpoints/admin/support-admin-endpoints";
export {
  useSendTelegramNotificationMutation,
  useTelegramEventMutation,
  useTelegramSendMutation,
  useTelegramSendTestMutation,
  useTelegramTestMutation,
} from "@/integrations/endpoints/admin/telegram-admin-endpoints";
export {
  useGetTelegramAutoReplyQuery,
  useListTelegramInboundQuery,
  useUpdateTelegramAutoReplyMutation,
} from "@/integrations/endpoints/admin/telegram-inbound-endpoints";
export { useTelegramWebhookSimulateMutation } from "@/integrations/endpoints/admin/telegram-webhook-endpoints";
export {
  useGetThemeAdminQuery,
  useResetThemeAdminMutation,
  useUpdateThemeAdminMutation,
} from "@/integrations/endpoints/admin/theme-admin-endpoints";
export {
  useLazyTwitterListTweetsQuery,
  useTwitterAiDraftMutation,
  useTwitterCancelTweetMutation,
  useTwitterPlansQuery,
  useTwitterListTweetsQuery,
  useTwitterSendMutation,
  useTwitterStatusQuery,
  useTwitterSyncHistoryMutation,
  useTwitterTemplatePreviewsQuery,
  useTwitterVerifyMutation,
} from "@/integrations/endpoints/admin/twitter-admin-endpoints";

export {
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
  useGoogleAdsAccountsQuery,
  useGoogleAdsProductsQuery,
  useGoogleAdsConversionHealthQuery,
  useGoogleAdsOfflineStatusQuery,
  useGoogleAdsOfflineUploadMutation,
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
} from "@/integrations/endpoints/admin/google-ads-admin-endpoints";
export {
  useGscStatusQuery,
  useGscSitesQuery,
  useGscOverviewQuery,
  useGscAnalyticsQuery,
  useGscPageQueriesQuery,
  useGscSitemapsQuery,
  useGscSubmitSitemapMutation,
  useGscDeleteSitemapMutation,
  useGscInspectMutation,
  useGscIndexQuery,
  useGscIndexRefreshMutation,
} from "@/integrations/endpoints/admin/search-console-admin-endpoints";
export {
  useGtmStatusQuery,
  useGtmOverviewQuery,
  useGtmPublishMutation,
} from "@/integrations/endpoints/admin/gtm-admin-endpoints";
export {
  useMetaStatusQuery,
  useMetaSaveMutation,
  useMetaTestMutation,
} from "@/integrations/endpoints/admin/meta-admin-endpoints";
export {
  useGoogleConnectStatusQuery,
  useGoogleConnectRedirectQuery,
  useLazyGoogleConnectAuthUrlQuery,
  useGoogleConnectExchangeMutation,
  useGoogleConnectDisconnectMutation,
  useGoogleConnectCredentialsMutation,
} from "@/integrations/endpoints/admin/google-connect-admin-endpoints";
export {
  useGa4StatusQuery,
  useGa4OverviewQuery,
  useGa4ReportQuery,
  useGa4RealtimeQuery,
  useGa4ConfigQuery,
  useGa4KeyEventsQuery,
  useGa4CreateKeyEventMutation,
  useGa4DeleteKeyEventMutation,
} from "@/integrations/endpoints/admin/ga4-admin-endpoints";
export {
  useAdminGetQuery,
  useAdminListQuery,
  useAdminRemoveUserMutation,
  useAdminSetActiveMutation,
  useAdminSetPasswordMutation,
  useAdminSetRolesMutation,
  useAdminUpdateUserMutation,
  useGetUserAdminQuery,
  useListUsersAdminQuery,
  useRemoveUserAdminMutation,
  useSetUserActiveAdminMutation,
  useSetUserPasswordAdminMutation,
  useSetUserRolesAdminMutation,
  useUpdateUserAdminMutation,
} from "@/integrations/endpoints/admin/users/auth-admin-endpoints";
