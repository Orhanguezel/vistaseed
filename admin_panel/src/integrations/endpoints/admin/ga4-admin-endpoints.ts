// ===================================================================
// FILE: src/integrations/endpoints/admin/ga4-admin-endpoints.ts
// ===================================================================

import type { FetchArgs } from "@reduxjs/toolkit/query";

import { baseApi } from "@/integrations/base-api";
import type {
  Ga4KeyEventsResp,
  Ga4OverviewResp,
  Ga4Range,
  Ga4StatusResp,
} from "@/integrations/shared";
import { GA4_ADMIN_BASE } from "@/integrations/shared";

export const ga4AdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    ga4Status: b.query<Ga4StatusResp, void>({
      query: (): FetchArgs => ({ url: `${GA4_ADMIN_BASE}/status` }),
    }),
    ga4Overview: b.query<Ga4OverviewResp, { range?: Ga4Range } | void>({
      query: (params): FetchArgs => ({ url: `${GA4_ADMIN_BASE}/overview`, params: params ?? {} }),
    }),
    ga4KeyEvents: b.query<Ga4KeyEventsResp, void>({
      query: (): FetchArgs => ({ url: `${GA4_ADMIN_BASE}/key-events` }),
      providesTags: ["Settings"],
    }),
    ga4CreateKeyEvent: b.mutation<{ ok: true; event: string }, { event_name: string }>({
      query: (body): FetchArgs => ({ url: `${GA4_ADMIN_BASE}/key-events`, method: "POST", body }),
      invalidatesTags: ["Settings"],
    }),
    ga4DeleteKeyEvent: b.mutation<{ ok: true; id: string }, { id: string }>({
      query: ({ id }): FetchArgs => ({ url: `${GA4_ADMIN_BASE}/key-events/${id}`, method: "DELETE" }),
      invalidatesTags: ["Settings"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGa4StatusQuery,
  useGa4OverviewQuery,
  useGa4KeyEventsQuery,
  useGa4CreateKeyEventMutation,
  useGa4DeleteKeyEventMutation,
} = ga4AdminApi;
