// =============================================================
// FILE: src/integrations/endpoints/admin/analytics-admin-endpoints.ts
// Admin Analytics (RTK Query) — generic web analytics from audit logs.
// =============================================================

import { baseApi } from '@/integrations/base-api';
import { ANALYTICS_ADMIN_BASE } from '@/integrations/shared';
import type {
  AnalyticsAdsAttributionResponseDto,
  AnalyticsAdsDailyResponseDto,
  AnalyticsDeviceDailyResponseDto,
  AnalyticsFunnelResponseDto,
  AnalyticsHeatmapResponseDto,
  AnalyticsOverviewDto,
  AnalyticsRangeQueryParams,
  AnalyticsRetentionResponseDto,
} from '@/integrations/shared';

export const analyticsAdminApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    getAnalyticsOverviewAdmin: build.query<AnalyticsOverviewDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({ url: `${ANALYTICS_ADMIN_BASE}/overview`, method: 'GET', params: params ?? undefined }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_OVERVIEW' }],
    }),

    getAnalyticsAdsAttributionAdmin: build.query<AnalyticsAdsAttributionResponseDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({ url: `${ANALYTICS_ADMIN_BASE}/ads-attribution`, method: 'GET', params: params ?? undefined }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_ADS_ATTRIBUTION' }],
    }),

    getAnalyticsAdsDailyAdmin: build.query<AnalyticsAdsDailyResponseDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({ url: `${ANALYTICS_ADMIN_BASE}/ads-daily`, method: 'GET', params: params ?? undefined }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_ADS_DAILY' }],
    }),

    getAnalyticsDeviceDailyAdmin: build.query<AnalyticsDeviceDailyResponseDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({ url: `${ANALYTICS_ADMIN_BASE}/device-daily`, method: 'GET', params: params ?? undefined }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_DEVICE_DAILY' }],
    }),

    getAnalyticsFunnelAdmin: build.query<AnalyticsFunnelResponseDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({ url: `${ANALYTICS_ADMIN_BASE}/funnel`, method: 'GET', params: params ?? undefined }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_FUNNEL' }],
    }),

    getAnalyticsRetentionAdmin: build.query<AnalyticsRetentionResponseDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({ url: `${ANALYTICS_ADMIN_BASE}/retention`, method: 'GET', params: params ?? undefined }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_RETENTION' }],
    }),

    getAnalyticsHeatmapAdmin: build.query<AnalyticsHeatmapResponseDto, AnalyticsRangeQueryParams | void>({
      query: (params) => ({ url: `${ANALYTICS_ADMIN_BASE}/heatmap`, method: 'GET', params: params ?? undefined }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'ANALYTICS_HEATMAP' }],
    }),
  }),
});

export const {
  useGetAnalyticsOverviewAdminQuery,
  useGetAnalyticsAdsAttributionAdminQuery,
  useGetAnalyticsAdsDailyAdminQuery,
  useGetAnalyticsDeviceDailyAdminQuery,
  useGetAnalyticsFunnelAdminQuery,
  useGetAnalyticsRetentionAdminQuery,
  useGetAnalyticsHeatmapAdminQuery,
} = analyticsAdminApi;
