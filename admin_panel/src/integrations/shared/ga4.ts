// ===================================================================
// FILE: src/integrations/shared/ga4.ts
// Google Analytics 4 admin API tipleri + sabitler
// ===================================================================

export const GA4_ADMIN_BASE = '/admin/ga4';

export const GA4_RANGES = ['LAST_7_DAYS', 'LAST_28_DAYS', 'LAST_3_MONTHS'] as const;
export type Ga4Range = (typeof GA4_RANGES)[number];

export const GA4_RANGE_LABELS: Record<Ga4Range, string> = {
  LAST_7_DAYS: 'Son 7 gün',
  LAST_28_DAYS: 'Son 28 gün',
  LAST_3_MONTHS: 'Son 3 ay',
};

export type Ga4Totals = { users: number; sessions: number; views: number; conversions: number };
export type Ga4DatePoint = { date: string; sessions: number; users: number };
export type Ga4Row = { label: string; value: number };
export type Ga4KeyEvent = { id: string; name: string; counting: string; custom: boolean };

export type Ga4StatusResp = { connected: boolean; property: string };
export type Ga4OverviewResp = {
  property: string;
  range: Ga4Range;
  totals: Ga4Totals;
  byDate: Ga4DatePoint[];
  channels: Ga4Row[];
  pages: Ga4Row[];
  devices: Ga4Row[];
};
export type Ga4KeyEventsResp = { items: Ga4KeyEvent[] };

export function formatGa4Number(v: number): string {
  return v.toLocaleString('tr-TR');
}

/** "20260612" → "12 Haz" */
export function formatGa4Date(d: string): string {
  if (d.length !== 8) return d;
  const month = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return `${Number(d.slice(6, 8))} ${month[Number(d.slice(4, 6)) - 1] ?? ''}`;
}

export const GA4_COUNTING_LABELS: Record<string, string> = {
  ONCE_PER_EVENT: 'Olay başına 1',
  ONCE_PER_SESSION: 'Oturum başına 1',
};
