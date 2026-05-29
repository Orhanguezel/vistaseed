// =============================================================
// FILE: src/integrations/endpoints/admin/analytics-admin-endpoints.ts
// Admin Analytics (RTK Query) — generic web analytics from audit logs.
// =============================================================

import { baseApi } from '@/integrations/base-api';
import { ANALYTICS_ADMIN_BASE } from '@/integrations/shared';
import type {
  AnalyticsDeviceDailyResponseDto,
  AnalyticsHeatmapResponseDto,
  AnalyticsOverviewDto,
  AnalyticsRangeQueryParams,
} from '@/integrations/shared';

export const analyticsAdminApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    getAnalyticsOverviewAdmin: build.query<AnalyticsOverviewDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({
        url: `${ANALYTICS_ADMIN_BASE}/overview`,
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_OVERVIEW' }],
    }),

    getAnalyticsDeviceDailyAdmin: build.query<AnalyticsDeviceDailyResponseDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({
        url: `${ANALYTICS_ADMIN_BASE}/device-daily`,
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_DEVICE_DAILY' }],
    }),

    getAnalyticsHeatmapAdmin: build.query<AnalyticsHeatmapResponseDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({
        url: `${ANALYTICS_ADMIN_BASE}/heatmap`,
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_HEATMAP' }],
    }),
  }),
});

export const {
  useGetAnalyticsOverviewAdminQuery,
  useGetAnalyticsDeviceDailyAdminQuery,
  useGetAnalyticsHeatmapAdminQuery,
} = analyticsAdminApi;
