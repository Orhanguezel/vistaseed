// ===================================================================
// FILE: src/integrations/endpoints/admin/redirects-admin-endpoints.ts
// Admin URL yönlendirme (301/410) RTK endpoints
// ===================================================================

import { baseApi } from "@/integrations/base-api";
import type {
  RedirectCreatePayload,
  RedirectDto,
  RedirectListParams,
  RedirectUpdatePayload,
} from "@/integrations/shared";
import { cleanParams, REDIRECTS_ADMIN_BASE } from "@/integrations/shared";

export const redirectsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listRedirectsAdmin: build.query<RedirectDto[], RedirectListParams | void>({
      query: (params) => ({
        url: REDIRECTS_ADMIN_BASE,
        method: "GET",
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: ["Redirects"],
    }),
    createRedirectAdmin: build.mutation<RedirectDto, RedirectCreatePayload>({
      query: (body) => ({ url: REDIRECTS_ADMIN_BASE, method: "POST", body }),
      invalidatesTags: ["Redirects"],
    }),
    updateRedirectAdmin: build.mutation<RedirectDto, { id: string; patch: RedirectUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `${REDIRECTS_ADMIN_BASE}/${encodeURIComponent(id)}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Redirects"],
    }),
    deleteRedirectAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `${REDIRECTS_ADMIN_BASE}/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Redirects"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListRedirectsAdminQuery,
  useCreateRedirectAdminMutation,
  useUpdateRedirectAdminMutation,
  useDeleteRedirectAdminMutation,
} = redirectsAdminApi;
