// ===================================================================
// FILE: src/integrations/endpoints/admin/search-console-admin-endpoints.ts
// ===================================================================

import type { FetchArgs } from "@reduxjs/toolkit/query";

import { baseApi } from "@/integrations/base-api";
import type {
  GscInspectArgs,
  GscInspectResp,
  GscOverviewResp,
  GscRange,
  GscSitemapsResp,
  GscSitesResp,
  GscStatusResp,
} from "@/integrations/shared";
import { SEARCH_CONSOLE_ADMIN_BASE } from "@/integrations/shared";

export const searchConsoleAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    gscStatus: b.query<GscStatusResp, void>({
      query: (): FetchArgs => ({ url: `${SEARCH_CONSOLE_ADMIN_BASE}/status` }),
    }),
    gscSites: b.query<GscSitesResp, void>({
      query: (): FetchArgs => ({ url: `${SEARCH_CONSOLE_ADMIN_BASE}/sites` }),
    }),
    gscOverview: b.query<GscOverviewResp, { range?: GscRange; site_url?: string } | void>({
      query: (params): FetchArgs => ({ url: `${SEARCH_CONSOLE_ADMIN_BASE}/overview`, params: params ?? {} }),
    }),
    gscSitemaps: b.query<GscSitemapsResp, { site_url?: string } | void>({
      query: (params): FetchArgs => ({ url: `${SEARCH_CONSOLE_ADMIN_BASE}/sitemaps`, params: params ?? {} }),
    }),
    gscInspect: b.mutation<GscInspectResp, GscInspectArgs>({
      query: (body): FetchArgs => ({ url: `${SEARCH_CONSOLE_ADMIN_BASE}/inspect`, method: "POST", body }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGscStatusQuery,
  useGscSitesQuery,
  useGscOverviewQuery,
  useGscSitemapsQuery,
  useGscInspectMutation,
} = searchConsoleAdminApi;
