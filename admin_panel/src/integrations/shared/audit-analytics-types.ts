// =============================================================
// FILE: src/integrations/shared/audit-analytics-types.ts
// Web-analytics DTOs (shared analytics module response shapes).
// =============================================================

import type { BoolLike } from '@/integrations/shared/common';

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
  adsPageviews: number;
  adsUniqueIps: number;
  newsletterTotal: number;
  newsletterNew: number;
  newsletterAdsCapturePct: number;
  b2bLikeIps: number;
  b2bIntentIps: number;
}

export interface AnalyticsDailyPointDto {
  date: string;
  requests: number;
  humans: number;
  bots: number;
  ads: number;
  uniqueIps: number;
  errors: number;
}

export interface AnalyticsNameCountDto {
  name: string;
  count: number;
}

export interface AnalyticsDeviceCountDto {
  device: string;
  count: number;
}

export interface AnalyticsIntentSignalDto {
  path: string;
  uniqueIps: number;
}

export interface AnalyticsOverviewDto {
  range: AnalyticsRange;
  summary: AnalyticsSummaryDto;
  daily: AnalyticsDailyPointDto[];
  topLandingPages: AnalyticsNameCountDto[];
  topReferrers: AnalyticsNameCountDto[];
  devices: AnalyticsDeviceCountDto[];
  intentSignals: AnalyticsIntentSignalDto[];
}

export interface AnalyticsAdsRowDto {
  campaign: string;
  source: string;
  medium: string;
  pageviews: number;
  uniqueIps: number;
}

export interface AnalyticsAdsAttributionResponseDto {
  range: AnalyticsRange;
  items: AnalyticsAdsRowDto[];
}

export interface AnalyticsAdsDailyItemDto extends AnalyticsAdsRowDto {
  date: string;
}

export interface AnalyticsAdsDailyResponseDto {
  range: AnalyticsRange;
  items: AnalyticsAdsDailyItemDto[];
}

export interface AnalyticsDeviceDailyRowDto {
  date: string;
  device: string;
  requests: number;
  uniqueIps: number;
  adsRequests: number;
  adsUniqueIps: number;
}

export interface AnalyticsDeviceDailyResponseDto {
  range: AnalyticsRange;
  items: AnalyticsDeviceDailyRowDto[];
}

export interface AnalyticsFunnelResponseDto {
  range: AnalyticsRange;
  items: AnalyticsNameCountDto[];
}

export interface AnalyticsRetentionCohortDto {
  date: string;
  visitors: number;
  d1: number;
  d1Pct: number;
  d3: number;
  d3Pct: number;
  d7: number;
  d7Pct: number;
}

export interface AnalyticsRetentionResponseDto {
  range: AnalyticsRange;
  cohorts: AnalyticsRetentionCohortDto[];
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
  real_only?: BoolLike;
};

export type AuditGeoTrafficKind = 'all' | 'human' | 'bot';

export interface AuditGeoCityDto {
  country: string;
  city: string;
  hits: number;
  uniqueIps: number;
  botHits: number;
}

export interface AuditGeoCitiesResponseDto {
  days: number;
  traffic: AuditGeoTrafficKind;
  items: AuditGeoCityDto[];
}

export type AuditGeoCitiesQueryParams = {
  days?: number;
  traffic?: AuditGeoTrafficKind;
  real_only?: BoolLike;
};
