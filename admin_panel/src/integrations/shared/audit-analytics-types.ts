// =============================================================
// FILE: src/integrations/shared/audit-analytics-types.ts
// Generic web-analytics DTOs (overview / device-daily / heatmap).
// =============================================================

export const ANALYTICS_ADMIN_BASE = 'admin/analytics';

export type AnalyticsRange = '7d' | '30d';

export interface AnalyticsSummaryDto {
  totalRequests: number;
  humanRequests: number;
  botRequests: number;
  uniqueIps: number;
  pageviews: number;
  pagesPerVisitor: number;
  directTrafficPct: number;
  returningIps: number;
}

export interface AnalyticsNameCountDto {
  name: string;
  count: number;
}

export interface AnalyticsDeviceCountDto {
  device: string;
  count: number;
}

export interface AnalyticsOverviewDto {
  range: AnalyticsRange;
  summary: AnalyticsSummaryDto;
  topLandingPages: AnalyticsNameCountDto[];
  topReferrers: AnalyticsNameCountDto[];
  devices: AnalyticsDeviceCountDto[];
}

export interface AnalyticsDeviceDailyRowDto {
  date: string;
  device: string;
  requests: number;
  uniqueIps: number;
}

export interface AnalyticsDeviceDailyResponseDto {
  range: AnalyticsRange;
  items: AnalyticsDeviceDailyRowDto[];
}

export interface AnalyticsHeatmapCellDto {
  weekday: number;
  hour: number;
  humans: number;
  uniqueIps: number;
}

export interface AnalyticsHeatmapResponseDto {
  range: AnalyticsRange;
  items: AnalyticsHeatmapCellDto[];
}

export type AnalyticsRangeQueryParams = {
  range?: AnalyticsRange;
};
