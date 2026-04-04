"use client";
// =============================================================
// FILE: src/integrations/hooks.ts
// Explicit barrel exports for RTK Query hooks (vistaseed)
// =============================================================

// =========================
// Public / Shared endpoints
// =========================

export {
  useAuthSignupMutation,
  useAuthTokenMutation,
  useAuthRefreshMutation,
  useAuthMeQuery,
  useAuthStatusQuery,
  useAuthUpdateMutation,
  useAuthPasswordResetRequestMutation,
  useAuthPasswordResetConfirmMutation,
  useAuthLogoutMutation,
  useLogoutMutation,
  useStatusQuery,
} from "@/integrations/endpoints/users/auth-public-endpoints";

export {
  useGetMyProfileQuery,
  useUpsertMyProfileMutation,
  useGetProfileByIdQuery,
} from "@/integrations/endpoints/users/profiles-endpoints";

export {
  useListUserRolesQuery,
  useCreateUserRoleMutation,
  useDeleteUserRoleMutation,
} from "@/integrations/endpoints/users/user-roles-endpoints";

export {
  useListSiteSettingsQuery,
  useLazyListSiteSettingsQuery,
  useGetSiteSettingByKeyQuery,
  useLazyGetSiteSettingByKeyQuery,
} from "@/integrations/endpoints/public/site-settings-public-endpoints";

// ==============
// Admin endpoints
// ==============

export {
  useAdminListQuery,
  useAdminGetQuery,
  useAdminUpdateUserMutation,
  useAdminSetActiveMutation,
  useAdminSetRolesMutation,
  useAdminSetPasswordMutation,
  useAdminRemoveUserMutation,
  useListUsersAdminQuery,
  useGetUserAdminQuery,
  useUpdateUserAdminMutation,
  useSetUserActiveAdminMutation,
  useSetUserRolesAdminMutation,
  useSetUserPasswordAdminMutation,
  useRemoveUserAdminMutation,
} from "@/integrations/endpoints/admin/users/auth-admin-endpoints";

export { useGetDashboardSummaryAdminQuery } from "@/integrations/endpoints/admin/dashboard-admin-endpoints";

export {
  useListContactsAdminQuery,
  useGetContactAdminQuery,
  useUpdateContactAdminMutation,
  useDeleteContactAdminMutation,
} from "@/integrations/endpoints/admin/contacts-admin-endpoints";

export {
  useGetThemeAdminQuery,
  useUpdateThemeAdminMutation,
  useResetThemeAdminMutation,
} from "@/integrations/endpoints/admin/theme-admin-endpoints";

export {
  useListAuditRequestLogsAdminQuery,
  useListAuditAuthEventsAdminQuery,
  useGetAuditMetricsDailyAdminQuery,
  useGetAuditGeoStatsAdminQuery,
  useClearAuditLogsAdminMutation,
} from "@/integrations/endpoints/admin/audit-admin-endpoints";

export {
  useListSiteSettingsAdminQuery,
  useGetSiteSettingAdminByKeyQuery,
  useGetAppLocalesAdminQuery,
  useGetDefaultLocaleAdminQuery,
  useCreateSiteSettingAdminMutation,
  useUpdateSiteSettingAdminMutation,
  useDeleteSiteSettingAdminMutation,
  useBulkUpsertSiteSettingsAdminMutation,
  useDeleteManySiteSettingsAdminMutation,
} from "@/integrations/endpoints/admin/site-settings-admin-endpoints";

export {
  useListAssetsAdminQuery,
  useGetAssetAdminQuery,
  useCreateAssetAdminMutation,
  useBulkCreateAssetsAdminMutation,
  usePatchAssetAdminMutation,
  useDeleteAssetAdminMutation,
  useBulkDeleteAssetsAdminMutation,
  useListFoldersAdminQuery,
  useDiagCloudinaryAdminQuery,
  useLazyDiagCloudinaryAdminQuery,
} from "@/integrations/endpoints/admin/storage-admin-endpoints";

export {
  useListEmailTemplatesAdminQuery,
  useGetEmailTemplateAdminQuery,
  useCreateEmailTemplateAdminMutation,
  useUpdateEmailTemplateAdminMutation,
  useDeleteEmailTemplateAdminMutation,
} from "@/integrations/endpoints/admin/email-templates-admin-endpoints";

export {
  useListOffersAdminQuery,
  useGetOfferAdminQuery,
  useCreateOfferAdminMutation,
  useUpdateOfferAdminMutation,
  useDeleteOfferAdminMutation,
  useGenerateOfferPdfAdminMutation,
  useSendOfferEmailAdminMutation,
  useSendOfferAdminMutation,
} from "@/integrations/endpoints/admin/offers-admin-endpoints";

export {
  useListTelegramInboundQuery,
  useGetTelegramAutoReplyQuery,
  useUpdateTelegramAutoReplyMutation,
} from "@/integrations/endpoints/admin/telegram-inbound-endpoints";

export {
  useTelegramTestMutation,
  useTelegramSendMutation,
  useTelegramEventMutation,
  useTelegramSendTestMutation,
  useSendTelegramNotificationMutation,
} from "@/integrations/endpoints/admin/telegram-admin-endpoints";

export { useTelegramWebhookSimulateMutation } from "@/integrations/endpoints/admin/telegram-webhook-endpoints";

export {
  useListCategoriesAdminQuery,
  useLazyListCategoriesAdminQuery,
  useGetCategoryAdminQuery,
  useLazyGetCategoryAdminQuery,
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
  useDeleteCategoryAdminMutation,
  useReorderCategoriesAdminMutation,
  useToggleCategoryActiveAdminMutation,
  useToggleCategoryFeaturedAdminMutation,
  useToggleCategoryUnlimitedAdminMutation,
  useSetCategoryImageAdminMutation,
} from "@/integrations/endpoints/admin/categories-admin-endpoints";

export {
  useListProductsAdminQuery,
  useGetProductAdminQuery,
  useCreateProductAdminMutation,
  useUpdateProductAdminMutation,
  useDeleteProductAdminMutation,
  useReorderProductsAdminMutation,
  useListProductImagesAdminQuery,
  useAddProductImageAdminMutation,
  useDeleteProductImageAdminMutation,
  useListProductFaqsAdminQuery,
  useCreateProductFaqAdminMutation,
  useUpdateProductFaqAdminMutation,
  useDeleteProductFaqAdminMutation,
  useListProductSpecsAdminQuery,
  useCreateProductSpecAdminMutation,
  useUpdateProductSpecAdminMutation,
  useDeleteProductSpecAdminMutation,
  useListProductReviewsAdminQuery,
  useCreateProductReviewAdminMutation,
  useUpdateProductReviewAdminMutation,
  useToggleProductReviewActiveAdminMutation,
  useDeleteProductReviewAdminMutation,
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
} from "@/integrations/endpoints/admin/products-admin-endpoints";

export {
  useListCustomPagesAdminQuery,
  useGetCustomPageAdminQuery,
  useCreateCustomPageAdminMutation,
  useUpdateCustomPageAdminMutation,
  useDeleteCustomPageAdminMutation,
  useReorderCustomPagesAdminMutation,
} from "@/integrations/endpoints/admin/custom-pages-admin-endpoints";

export {
  useListJobListingsAdminQuery,
  useGetJobListingAdminQuery,
  useCreateJobListingAdminMutation,
  useUpdateJobListingAdminMutation,
  useDeleteJobListingAdminMutation,
  useToggleJobListingActiveAdminMutation,
  useReorderJobListingsAdminMutation,
} from "@/integrations/endpoints/admin/job-listings-admin-endpoints";

export {
  useListBlogPostsAdminQuery,
  useGetBlogPostAdminQuery,
  useCreateBlogPostAdminMutation,
  useUpdateBlogPostAdminMutation,
  useDeleteBlogPostAdminMutation,
  useImportBlogRssAdminMutation,
} from "@/integrations/endpoints/admin/blog-admin-endpoints";

export {
  useListJobApplicationsAdminQuery,
  useGetJobApplicationAdminQuery,
  useUpdateJobApplicationStatusAdminMutation,
  useDeleteJobApplicationAdminMutation,
} from "@/integrations/endpoints/admin/job-applications-admin-endpoints";

export {
  useListSupportFaqsAdminQuery,
  useGetSupportFaqAdminQuery,
  useCreateSupportFaqAdminMutation,
  useUpdateSupportFaqAdminMutation,
  useDeleteSupportFaqAdminMutation,
  useReorderSupportFaqsAdminMutation,
  useListSupportTicketsAdminQuery,
  useGetSupportTicketAdminQuery,
  useUpdateSupportTicketAdminMutation,
  useDeleteSupportTicketAdminMutation,
} from "@/integrations/endpoints/admin/support-admin-endpoints";

export {
  useListGalleriesAdminQuery,
  useGetGalleryAdminQuery,
  useCreateGalleryAdminMutation,
  useUpdateGalleryAdminMutation,
  useDeleteGalleryAdminMutation,
  useReorderGalleriesAdminMutation,
  useListGalleryImagesAdminQuery,
  useAddGalleryImageAdminMutation,
  useDeleteGalleryImageAdminMutation,
} from "@/integrations/endpoints/admin/gallery-admin-endpoints";

export {
  useListReferencesAdminQuery,
  useGetReferenceAdminQuery,
  useCreateReferenceAdminMutation,
  useUpdateReferenceAdminMutation,
  useDeleteReferenceAdminMutation,
  useListReferenceImagesAdminQuery,
  useAddReferenceImageAdminMutation,
  useDeleteReferenceImageAdminMutation,
} from "@/integrations/endpoints/admin/references-admin-endpoints";

export {
  useListLibraryAdminQuery,
  useGetLibraryAdminQuery,
  useCreateLibraryAdminMutation,
  useUpdateLibraryAdminMutation,
  useDeleteLibraryAdminMutation,
  useListLibraryImagesAdminQuery,
  useAddLibraryImageAdminMutation,
  useDeleteLibraryImageAdminMutation,
  useListLibraryFilesAdminQuery,
  useAddLibraryFileAdminMutation,
  useUpdateLibraryFileAdminMutation,
  useDeleteLibraryFileAdminMutation,
} from "@/integrations/endpoints/admin/library-admin-endpoints";

export {
  useLazyExportDbAdminQuery,
  useImportDbTextAdminMutation,
  useImportDbUrlAdminMutation,
  useImportDbFileAdminMutation,
  useListDbSnapshotsAdminQuery,
  useCreateDbSnapshotAdminMutation,
  useRestoreDbSnapshotAdminMutation,
  useDeleteDbSnapshotAdminMutation,
  useLazyExportModuleAdminQuery,
  useImportModuleAdminMutation,
  useLazyValidateModulesAdminQuery,
  useLazyExportUiSettingsAdminQuery,
  useBootstrapUiSettingsAdminMutation,
} from "@/integrations/endpoints/admin/db-admin-endpoints";

export {
  useListPopupsAdminQuery,
  useGetPopupAdminQuery,
  useCreatePopupAdminMutation,
  useUpdatePopupAdminMutation,
  useDeletePopupAdminMutation,
  useReorderPopupsAdminMutation,
  useSetPopupStatusAdminMutation,
} from "@/integrations/endpoints/admin/popups-admin-endpoints";
