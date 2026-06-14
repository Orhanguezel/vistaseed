'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/audit/_components/admin-audit-client.tsx
// Admin Audit (Requests / Auth Events / Daily Metrics / Map)
// - i18n: useAdminT() ile tüm statikler dil kontrollü
// - Tabs: requests | auth | metrics | map
// - URL state: filters + pagination
// =============================================================

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Activity,
  ShieldCheck,
  UserCheck,
  RefreshCcw,
  Search,
  Calendar,
  Filter,
  Loader2,
  Globe,
  Trash2,
  BarChart3,
  Smartphone,
  MousePointerClick,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { AuditDailyChart } from './audit-daily-chart';
import { AuditGeoMap } from './audit-geo-map';
import { AuditTurkeyMap } from './audit-turkey-map';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

import type {
  AuditAuthEvent,
  AuditAuthEventDto,
  AuditRequestLogDto,
  AuditListResponse,
  AuditMetricsDailyResponseDto,
  AuditGeoStatsResponseDto,
  AnalyticsRange,
  AnalyticsOverviewDto,
  AnalyticsAdsAttributionResponseDto,
  AnalyticsAdsDailyResponseDto,
  AnalyticsFunnelResponseDto,
  AnalyticsRetentionResponseDto,
  AnalyticsDeviceDailyResponseDto,
  AnalyticsHeatmapResponseDto,
  AuditGeoTrafficKind,
  AuditGeoCitiesResponseDto,
} from '@/integrations/shared';
import {
  ADMIN_AUDIT_ALL_VALUE,
  AUDIT_AUTH_EVENTS,
  buildAdminAuditQueryString,
  formatAdminAuditWhen,
  getErrorMessage,
  getAdminAuditAuthEventVariant,
  getAdminAuditGeoLabel,
  getAdminAuditStatusVariant,
  normalizeAdminAuditBoolLike,
  normalizeAdminAuditTab,
  parseAdminAuditStatusCode,
  safeText,
  toNonNegativeInt,
  truncateNullable,
  type AdminAuditSortKey,
} from '@/integrations/shared';
import {
  useListAuditRequestLogsAdminQuery,
  useListAuditAuthEventsAdminQuery,
  useGetAuditMetricsDailyAdminQuery,
  useGetAuditGeoStatsAdminQuery,
  useGetAuditGeoCitiesAdminQuery,
  useClearAuditLogsAdminMutation,
  useGetAnalyticsOverviewAdminQuery,
  useGetAnalyticsAdsAttributionAdminQuery,
  useGetAnalyticsAdsDailyAdminQuery,
  useGetAnalyticsFunnelAdminQuery,
  useGetAnalyticsRetentionAdminQuery,
  useGetAnalyticsDeviceDailyAdminQuery,
  useGetAnalyticsHeatmapAdminQuery,
} from '@/integrations/hooks';

/* ----------------------------- component ----------------------------- */

export default function AdminAuditClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const t = useAdminT('admin.audit');

  // Tab geçişi anlık (client-side, history.replaceState) — RSC navigasyonu
  // yapmaz, takılma olmaz (hal-fiyatlari ile aynı model).
  const urlTab = normalizeAdminAuditTab(sp.get('tab'));
  const [tab, setTab] = React.useState(urlTab);
  React.useEffect(() => setTab(urlTab), [urlTab]);

  const q = sp.get('q') ?? '';
  const method = sp.get('method') ?? '';
  const status = sp.get('status') ?? '';
  const from = sp.get('from') ?? '';
  const to = sp.get('to') ?? '';
  const onlyAdmin = normalizeAdminAuditBoolLike(sp.get('only_admin'));
  const includeInternal = normalizeAdminAuditBoolLike(sp.get('include_internal'));
  const realOnlyParam = includeInternal ? 0 : 1;

  const reqUserId = sp.get('req_user_id') ?? '';
  const reqIp = sp.get('req_ip') ?? '';
  const sort = (sp.get('sort') ?? 'created_at') as AdminAuditSortKey;
  const orderDir = (sp.get('orderDir') ?? 'desc') as 'asc' | 'desc';

  const event = sp.get('event') ?? '';
  const email = sp.get('email') ?? '';
  const user_id = sp.get('user_id') ?? '';
  const ip = sp.get('ip') ?? '';

  const days = String(toNonNegativeInt(sp.get('days'), 14) || 14);
  const path_prefix = sp.get('path_prefix') ?? '';

  const range: AnalyticsRange = sp.get('range') === '30d' ? '30d' : '7d';
  const geoTraffic = (['human', 'bot'].includes(sp.get('traffic') ?? '')
    ? sp.get('traffic')
    : 'all') as AuditGeoTrafficKind;

  const limit = toNonNegativeInt(sp.get('limit'), 50) || 50;
  const offset = toNonNegativeInt(sp.get('offset'), 0);

  // local state for request filters
  const [qText, setQText] = React.useState(q);
  const [methodText, setMethodText] = React.useState(method);
  const [statusText, setStatusText] = React.useState(status);
  const [fromText, setFromText] = React.useState(from);
  const [toText, setToText] = React.useState(to);
  const [onlyAdminFlag, setOnlyAdminFlag] = React.useState(onlyAdmin);
  const [reqUserIdText, setReqUserIdText] = React.useState(reqUserId);
  const [reqIpText, setReqIpText] = React.useState(reqIp);
  const [sortText, setSortText] = React.useState<AdminAuditSortKey>(sort);
  const [orderDirText, setOrderDirText] = React.useState<'asc' | 'desc'>(orderDir);

  // local state for auth filters
  const [eventText, setEventText] = React.useState(event);
  const [emailText, setEmailText] = React.useState(email);
  const [userIdText, setUserIdText] = React.useState(user_id);
  const [ipText, setIpText] = React.useState(ip);

  // local state for metrics
  const [daysText, setDaysText] = React.useState(days);
  const [pathPrefixText, setPathPrefixText] = React.useState(path_prefix);

  React.useEffect(() => setQText(q), [q]);
  React.useEffect(() => setMethodText(method), [method]);
  React.useEffect(() => setStatusText(status), [status]);
  React.useEffect(() => setFromText(from), [from]);
  React.useEffect(() => setToText(to), [to]);
  React.useEffect(() => setOnlyAdminFlag(onlyAdmin), [onlyAdmin]);
  React.useEffect(() => setReqUserIdText(reqUserId), [reqUserId]);
  React.useEffect(() => setReqIpText(reqIp), [reqIp]);
  React.useEffect(() => setSortText(sort), [sort]);
  React.useEffect(() => setOrderDirText(orderDir), [orderDir]);

  React.useEffect(() => setEventText(event), [event]);
  React.useEffect(() => setEmailText(email), [email]);
  React.useEffect(() => setUserIdText(user_id), [user_id]);
  React.useEffect(() => setIpText(ip), [ip]);

  React.useEffect(() => setDaysText(days), [days]);
  React.useEffect(() => setPathPrefixText(path_prefix), [path_prefix]);

  // NOT: useMemo factory'leri (authParams) render sirasinda calisir; bu sabit
  // onlardan ONCE tanimlanmali, aksi halde TDZ -> "Cannot access 'ALL' before
  // initialization" ile tum sayfa cokar (tablar gezilemez).
  const ALL = ADMIN_AUDIT_ALL_VALUE;

  function buildAuditUrl(next: Partial<Record<string, any>>) {
    const merged = {
      tab,
      q,
      method,
      status,
      from,
      to,
      only_admin: onlyAdmin ? '1' : '',
      include_internal: includeInternal ? '1' : '',
      req_user_id: reqUserId,
      req_ip: reqIp,
      sort,
      orderDir,
      event,
      email,
      user_id,
      ip,
      days,
      path_prefix,
      range,
      traffic: geoTraffic,
      limit,
      offset,
      ...next,
    };

    if (next.offset == null) merged.offset = 0;

    const qs = buildAdminAuditQueryString({
      tab: merged.tab,
      q: merged.q || undefined,
      method: merged.method || undefined,
      status: merged.status || undefined,
      from: merged.from || undefined,
      to: merged.to || undefined,
      only_admin: merged.only_admin || undefined,
      include_internal: merged.include_internal || undefined,
      req_user_id: merged.req_user_id || undefined,
      req_ip: merged.req_ip || undefined,
      sort: merged.sort !== 'created_at' ? merged.sort : undefined,
      orderDir: merged.orderDir !== 'desc' ? merged.orderDir : undefined,
      range: merged.range !== '7d' ? merged.range : undefined,
      traffic: merged.traffic !== 'all' ? merged.traffic : undefined,
      event: merged.event && merged.event !== ALL ? merged.event : undefined,
      email: merged.email || undefined,
      user_id: merged.user_id || undefined,
      ip: merged.ip || undefined,
      days: merged.days || undefined,
      path_prefix: merged.path_prefix || undefined,
      limit: merged.limit || undefined,
      offset: merged.offset || undefined,
    });

    return `/admin/audit${qs}`;
  }

  function apply(next: Partial<Record<string, any>>) {
    router.push(buildAuditUrl(next));
  }

  // Tab geçişi: local state + history.replaceState → anlık, RSC navigasyonu yok.
  function onTabChange(next: string) {
    const nextTab = normalizeAdminAuditTab(next);
    setTab(nextTab);
    window.history.replaceState(window.history.state, '', buildAuditUrl({ tab: nextTab, offset: 0 }));
  }

  function onSubmitRequests(e: React.FormEvent) {
    e.preventDefault();
    apply({
      tab: 'requests',
      q: qText.trim(),
      method: methodText.trim().toUpperCase(),
      status: statusText.trim(),
      from: fromText.trim(),
      to: toText.trim(),
      only_admin: onlyAdminFlag ? '1' : '',
      req_user_id: reqUserIdText.trim(),
      req_ip: reqIpText.trim(),
      sort: sortText,
      orderDir: orderDirText,
      offset: 0,
    });
  }

  function onResetRequests() {
    setQText('');
    setMethodText('');
    setStatusText('');
    setFromText('');
    setToText('');
    setOnlyAdminFlag(false);
    setReqUserIdText('');
    setReqIpText('');
    setSortText('created_at');
    setOrderDirText('desc');
    apply({
      tab: 'requests',
      q: '',
      method: '',
      status: '',
      from: '',
      to: '',
      only_admin: '',
      req_user_id: '',
      req_ip: '',
      sort: 'created_at',
      orderDir: 'desc',
      offset: 0,
    });
  }

  function onSubmitAuth(e: React.FormEvent) {
    e.preventDefault();
    apply({
      tab: 'auth',
      event: eventText,
      email: emailText.trim(),
      user_id: userIdText.trim(),
      ip: ipText.trim(),
      from: fromText.trim(),
      to: toText.trim(),
      offset: 0,
    });
  }

  function onResetAuth() {
    setEventText('');
    setEmailText('');
    setUserIdText('');
    setIpText('');
    setFromText('');
    setToText('');
    apply({
      tab: 'auth',
      event: '',
      email: '',
      user_id: '',
      ip: '',
      from: '',
      to: '',
      offset: 0,
    });
  }

  function onSubmitMetrics(e: React.FormEvent) {
    e.preventDefault();
    const d = String(toNonNegativeInt(daysText, 14) || 14);
    setDaysText(d);
    apply({
      tab: 'metrics',
      days: d,
      path_prefix: pathPrefixText.trim(),
      only_admin: onlyAdminFlag ? '1' : '',
    });
  }

  function onResetMetrics() {
    setDaysText('14');
    setPathPrefixText('');
    setOnlyAdminFlag(false);
    apply({
      tab: 'metrics',
      days: '14',
      path_prefix: '',
      only_admin: '',
    });
  }

  /* ----------------------------- queries ----------------------------- */

  const reqParams = React.useMemo(() => {
    const code = parseAdminAuditStatusCode(status);
    return {
      q: q || undefined,
      method: method || undefined,
      status_code: code,
      user_id: reqUserId || undefined,
      ip: reqIp || undefined,
      only_admin: onlyAdmin ? 1 : undefined,
      real_only: realOnlyParam,
      created_from: from || undefined,
      created_to: to || undefined,
      sort: sort as 'created_at' | 'response_time_ms' | 'status_code',
      orderDir: orderDir as 'asc' | 'desc',
      limit,
      offset,
    };
  }, [q, method, status, reqUserId, reqIp, onlyAdmin, realOnlyParam, from, to, sort, orderDir, limit, offset]);

  const authParams = React.useMemo(() => {
    const ev = event && event !== ALL ? event : undefined;
    return {
      event: ev as AuditAuthEvent | undefined,
      email: email || undefined,
      user_id: user_id || undefined,
      ip: ip || undefined,
      created_from: from || undefined,
      created_to: to || undefined,
      real_only: realOnlyParam,
      sort: 'created_at' as const,
      orderDir: 'desc' as const,
      limit,
      offset,
    };
  }, [event, email, user_id, ip, from, to, realOnlyParam, limit, offset]);

  const metricsParams = React.useMemo(() => {
    const d = toNonNegativeInt(days, 14) || 14;
    return {
      days: d,
      only_admin: onlyAdmin ? 1 : undefined,
      real_only: realOnlyParam,
      path_prefix: path_prefix || undefined,
    };
  }, [days, onlyAdmin, realOnlyParam, path_prefix]);

  const reqQ = useListAuditRequestLogsAdminQuery(
    tab === 'requests' ? (reqParams as any) : (undefined as any),
    { skip: tab !== 'requests', refetchOnFocus: true } as any,
  ) as any;

  const authQ = useListAuditAuthEventsAdminQuery(
    tab === 'auth' ? (authParams as any) : (undefined as any),
    { skip: tab !== 'auth', refetchOnFocus: true } as any,
  ) as any;

  const metricsQ = useGetAuditMetricsDailyAdminQuery(
    tab === 'metrics' ? (metricsParams as any) : (undefined as any),
    { skip: tab !== 'metrics', refetchOnFocus: true } as any,
  ) as any;

  const geoParams = React.useMemo(() => {
    const d = toNonNegativeInt(days, 30) || 30;
    return {
      days: d,
      only_admin: onlyAdmin ? 1 : undefined,
      real_only: realOnlyParam,
      source: 'requests' as const,
    };
  }, [days, onlyAdmin, realOnlyParam]);

  const geoQ = useGetAuditGeoStatsAdminQuery(
    tab === 'map' ? (geoParams as any) : (undefined as any),
    { skip: tab !== 'map', refetchOnFocus: true } as any,
  ) as any;

  const geoCitiesQ = useGetAuditGeoCitiesAdminQuery(
    tab === 'map' ? ({ days: geoParams.days, traffic: geoTraffic, real_only: realOnlyParam } as any) : (undefined as any),
    { skip: tab !== 'map', refetchOnFocus: true } as any,
  ) as any;

  const overviewQ = useGetAnalyticsOverviewAdminQuery(
    tab === 'general' || tab === 'device' ? ({ range, real_only: realOnlyParam } as any) : (undefined as any),
    { skip: tab !== 'general' && tab !== 'device', refetchOnFocus: true } as any,
  ) as any;

  const retentionQ = useGetAnalyticsRetentionAdminQuery(
    tab === 'general' ? ({ range, real_only: realOnlyParam } as any) : (undefined as any),
    { skip: tab !== 'general', refetchOnFocus: true } as any,
  ) as any;

  const adsQ = useGetAnalyticsAdsAttributionAdminQuery(
    tab === 'ads' ? ({ range, real_only: realOnlyParam } as any) : (undefined as any),
    { skip: tab !== 'ads', refetchOnFocus: true } as any,
  ) as any;

  const adsDailyQ = useGetAnalyticsAdsDailyAdminQuery(
    tab === 'ads' ? ({ range, real_only: realOnlyParam } as any) : (undefined as any),
    { skip: tab !== 'ads', refetchOnFocus: true } as any,
  ) as any;

  const funnelQ = useGetAnalyticsFunnelAdminQuery(
    tab === 'ads' ? ({ range, real_only: realOnlyParam } as any) : (undefined as any),
    { skip: tab !== 'ads', refetchOnFocus: true } as any,
  ) as any;

  const deviceDailyQ = useGetAnalyticsDeviceDailyAdminQuery(
    tab === 'device' ? ({ range, real_only: realOnlyParam } as any) : (undefined as any),
    { skip: tab !== 'device', refetchOnFocus: true } as any,
  ) as any;

  const heatmapQ = useGetAnalyticsHeatmapAdminQuery(
    tab === 'device' ? ({ range, real_only: realOnlyParam } as any) : (undefined as any),
    { skip: tab !== 'device', refetchOnFocus: true } as any,
  ) as any;

  const reqData = (reqQ.data as AuditListResponse<AuditRequestLogDto> | undefined) ?? {
    items: [],
    total: 0,
  };
  const authData = (authQ.data as AuditListResponse<AuditAuthEventDto> | undefined) ?? {
    items: [],
    total: 0,
  };
  const metricsData = (metricsQ.data as AuditMetricsDailyResponseDto | undefined) ?? { days: [] };
  const geoData = (geoQ.data as AuditGeoStatsResponseDto | undefined) ?? { items: [] };
  const geoCitiesData = (geoCitiesQ.data as AuditGeoCitiesResponseDto | undefined)?.items ?? [];
  // LOCAL = sunucu-içi trafik (SSR fetch, health, ETL) — gerçek ziyaretçi değil,
  // analizden çıkarılır. Boş ülke de gösterilmez.
  const geoItemsVisible = (geoData.items ?? []).filter(
    (i) => i.country && i.country !== 'LOCAL',
  );
  const geoCitiesTR = geoCitiesData.filter((r) => r.country === 'TR');
  const overviewData = overviewQ.data as AnalyticsOverviewDto | undefined;
  const retentionData = retentionQ.data as AnalyticsRetentionResponseDto | undefined;
  const adsData = adsQ.data as AnalyticsAdsAttributionResponseDto | undefined;
  const adsDailyData = adsDailyQ.data as AnalyticsAdsDailyResponseDto | undefined;
  const funnelData = funnelQ.data as AnalyticsFunnelResponseDto | undefined;
  const deviceDailyData = deviceDailyQ.data as AnalyticsDeviceDailyResponseDto | undefined;
  const heatmapData = heatmapQ.data as AnalyticsHeatmapResponseDto | undefined;

  const reqLoading = reqQ.isLoading || reqQ.isFetching;
  const authLoading = authQ.isLoading || authQ.isFetching;
  const metricsLoading = metricsQ.isLoading || metricsQ.isFetching;
  const geoLoading =
    geoQ.isLoading || geoQ.isFetching || geoCitiesQ.isLoading || geoCitiesQ.isFetching;
  const overviewLoading =
    overviewQ.isLoading || overviewQ.isFetching || retentionQ.isLoading || retentionQ.isFetching;
  const adsLoading =
    adsQ.isLoading || adsQ.isFetching || adsDailyQ.isLoading || adsDailyQ.isFetching || funnelQ.isLoading || funnelQ.isFetching;
  const deviceLoading =
    overviewQ.isLoading ||
    overviewQ.isFetching ||
    deviceDailyQ.isLoading ||
    deviceDailyQ.isFetching ||
    heatmapQ.isLoading ||
    heatmapQ.isFetching;

  const reqTotal = reqData.total ?? 0;
  const authTotal = authData.total ?? 0;

  const canPrev = offset > 0;
  const canNextReq = offset + limit < reqTotal;
  const canNextAuth = offset + limit < authTotal;

  const [clearAuditLogs, { isLoading: isClearing }] = useClearAuditLogsAdminMutation();

  async function onRefresh() {
    try {
      if (tab === 'requests') await reqQ.refetch();
      if (tab === 'auth') await authQ.refetch();
      if (tab === 'metrics') await metricsQ.refetch();
      if (tab === 'map') {
        await geoQ.refetch();
        await geoCitiesQ.refetch();
      }
      if (tab === 'general') {
        await overviewQ.refetch();
        await retentionQ.refetch();
      }
      if (tab === 'ads') {
        await adsQ.refetch();
        await adsDailyQ.refetch();
        await funnelQ.refetch();
      }
      if (tab === 'device') {
        await overviewQ.refetch();
        await deviceDailyQ.refetch();
        await heatmapQ.refetch();
      }
      toast.success(t('refreshed'));
    } catch (err) {
      toast.error(getErrorMessage(err, t('error')));
    }
  }

  async function onClearLogs() {
    if (!window.confirm(t('clear.dialogDescription'))) return;
    const target = tab === 'requests' ? 'requests' : tab === 'auth' ? 'auth' : 'all';
    try {
      const data = await clearAuditLogs({ target }).unwrap();
      const total = (data.deletedRequests ?? 0) + (data.deletedAuth ?? 0);
      toast.success(t('clear.success', { count: String(total) }));
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('error'));
    }
  }

  const anyLoading =
    reqLoading || authLoading || metricsLoading || geoLoading || overviewLoading || adsLoading || deviceLoading || isClearing;

  const deviceLabel = (value: string): string => {
    if (value === 'mobile') return t('analytics.deviceMobile');
    if (value === 'tablet') return t('analytics.deviceTablet');
    return t('analytics.deviceDesktop');
  };

  const weekdayLabel = (value: number): string => t(`analytics.wd.${value}`, undefined, String(value));

  return (
    <div className="space-y-6">
      {/* ---- HEADER ---- */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('header.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('header.description')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border px-3 py-2">
            <Switch
              checked={includeInternal}
              onCheckedChange={(checked) => apply({ include_internal: checked ? '1' : '', offset: 0 })}
            />
            <span className="text-sm text-muted-foreground">{t('common.includeInternalTraffic')}</span>
          </div>
          <Button variant="outline" onClick={onRefresh} disabled={anyLoading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t('refresh')}
          </Button>
          <Button variant="destructive" onClick={onClearLogs} disabled={isClearing}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('clear.button')}
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="general">
            <BarChart3 className="mr-2 h-4 w-4" /> {t('tabs.general')}
          </TabsTrigger>
          <TabsTrigger value="requests">
            <Activity className="mr-2 h-4 w-4" /> {t('tabs.requests')}
          </TabsTrigger>
          <TabsTrigger value="auth">
            <UserCheck className="mr-2 h-4 w-4" /> {t('tabs.auth')}
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <ShieldCheck className="mr-2 h-4 w-4" /> {t('tabs.daily')}
          </TabsTrigger>
          <TabsTrigger value="ads">
            <MousePointerClick className="mr-2 h-4 w-4" /> {t('tabs.ads')}
          </TabsTrigger>
          <TabsTrigger value="device">
            <Smartphone className="mr-2 h-4 w-4" /> {t('tabs.device')}
          </TabsTrigger>
          <TabsTrigger value="map">
            <Globe className="mr-2 h-4 w-4" /> {t('tabs.map')}
          </TabsTrigger>
        </TabsList>

        {/* ==================== GENERAL TAB ==================== */}
        <TabsContent value="general" className="space-y-4">
          <RangeControls range={range} onChange={(next) => apply({ tab: 'general', range: next })} />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              title={t('analytics.humanTraffic')}
              value={fmtNumber(overviewData?.summary?.humanRequests)}
              sub={t('analytics.pageviewsSub', { count: fmtNumber(overviewData?.summary?.pageviews) })}
            />
            <MetricCard
              title={t('analytics.botTraffic')}
              value={fmtNumber(overviewData?.summary?.botRequests)}
              sub={t('analytics.totalRequestsSub', { count: fmtNumber(overviewData?.summary?.totalRequests) })}
            />
            <MetricCard
              title={t('analytics.adsUniqueIps')}
              value={fmtNumber(overviewData?.summary?.adsUniqueIps)}
              sub={t('analytics.adsPageviewsSub', { count: fmtNumber(overviewData?.summary?.adsPageviews) })}
            />
            <MetricCard
              title={t('analytics.directTraffic')}
              value={fmtPct(overviewData?.summary?.directTrafficPct)}
              sub={t('analytics.returningIpSub', { count: fmtNumber(overviewData?.summary?.returningIps) })}
            />
            <MetricCard
              title={t('analytics.b2bLikeIps')}
              value={fmtNumber(overviewData?.summary?.b2bLikeIps)}
              sub={t('analytics.b2bIntentSub', { count: fmtNumber(overviewData?.summary?.b2bIntentIps) })}
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <SimpleRowsCard
              title={t('analytics.topLandingPages')}
              rows={overviewData?.topLandingPages ?? []}
              loading={overviewLoading}
              emptyText={t('common.noRecords')}
            />
            <SimpleRowsCard
              title={t('analytics.topReferrers')}
              rows={overviewData?.topReferrers ?? []}
              loading={overviewLoading}
              emptyText={t('common.noRecords')}
            />
            <SimpleRowsCard
              title={t('analytics.deviceBreakdown')}
              rows={(overviewData?.devices ?? []).map((row) => ({ name: deviceLabel(row.device), count: row.count }))}
              loading={overviewLoading}
              emptyText={t('common.noRecords')}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('analytics.retentionTitle')}</CardTitle>
              <CardDescription>{t('analytics.retentionDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('analytics.firstDay')}</TableHead>
                    <TableHead className="text-right">{t('analytics.newIp')}</TableHead>
                    <TableHead className="text-right">D+1</TableHead>
                    <TableHead className="text-right">D+3</TableHead>
                    <TableHead className="text-right">D+7</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(retentionData?.cohorts ?? []).map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell className="text-right">{fmtNumber(row.visitors)}</TableCell>
                      <TableCell className="text-right">
                        {fmtNumber(row.d1)} <span className="text-muted-foreground">({fmtPct(row.d1Pct)})</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {fmtNumber(row.d3)} <span className="text-muted-foreground">({fmtPct(row.d3Pct)})</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {fmtNumber(row.d7)} <span className="text-muted-foreground">({fmtPct(row.d7Pct)})</span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!overviewLoading && (retentionData?.cohorts?.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>{t('common.noRecords')}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== REQUESTS TAB ==================== */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" /> {t('requests.filtersTitle')}
              </CardTitle>
              <CardDescription>{t('requests.filtersDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmitRequests} className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>{t('requests.search')}</Label>
                  <Input
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder={t('requests.placeholders.search')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('requests.method')}</Label>
                  <Input
                    value={methodText}
                    onChange={(e) => setMethodText(e.target.value)}
                    placeholder={t('requests.placeholders.method')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('requests.status')}</Label>
                  <Input
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    placeholder={t('requests.placeholders.status')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.from')}</Label>
                  <Input type="datetime-local" value={fromText} onChange={(e) => setFromText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.to')}</Label>
                  <Input type="datetime-local" value={toText} onChange={(e) => setToText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.userId')}</Label>
                  <Input value={reqUserIdText} onChange={(e) => setReqUserIdText(e.target.value)} placeholder={t('common.userId')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.ip')}</Label>
                  <Input
                    value={reqIpText}
                    onChange={(e) => setReqIpText(e.target.value)}
                    placeholder={t('requests.placeholders.ip')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('requests.sort')}</Label>
                  <div className="flex gap-2">
                    <Select value={sortText} onValueChange={(v) => setSortText(v as AdminAuditSortKey)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">{t('requests.sortDate')}</SelectItem>
                        <SelectItem value="response_time_ms">{t('requests.sortResponseTime')}</SelectItem>
                        <SelectItem value="status_code">{t('requests.sortStatusCode')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={orderDirText} onValueChange={(v) => setOrderDirText(v as 'asc' | 'desc')}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">{t('common.desc')}</SelectItem>
                        <SelectItem value="asc">{t('common.asc')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>{t('common.onlyAdmin')}</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Switch checked={onlyAdminFlag} onCheckedChange={setOnlyAdminFlag} />
                    <span className="text-sm text-muted-foreground">{t('common.adminRequests')}</span>
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                  <Button type="submit">
                    <Search className="mr-2 h-4 w-4" /> {t('common.apply')}
                  </Button>
                  <Button type="button" variant="secondary" onClick={onResetRequests}>
                    {t('common.reset')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{t('requests.logsTitle')}</CardTitle>
                  <CardDescription>
                    {t('common.totalRecords', { count: String(reqTotal) })}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {reqLoading ? t('common.loading') : t('common.recordCount', { count: String(reqData.items.length) })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {reqQ.error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  {getErrorMessage(reqQ.error, t('error'))}
                </div>
              )}

              <div className="mt-3 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('columns.date')}</TableHead>
                      <TableHead>{t('columns.request')}</TableHead>
                      <TableHead>{t('columns.status')}</TableHead>
                      <TableHead>{t('columns.ipUser')}</TableHead>
                      <TableHead>{t('columns.location')}</TableHead>
                      <TableHead className="hidden lg:table-cell">{t('columns.userAgent')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reqData.items.length === 0 && !reqLoading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                          {t('common.noRecords')}
                        </TableCell>
                      </TableRow>
                    )}

                    {reqData.items.map((r) => {
                      const code = Number(r.status_code ?? 0);
                      const geo = getAdminAuditGeoLabel(r.country, r.city);
                      return (
                        <TableRow key={String(r.id)}>
                          <TableCell className="whitespace-nowrap text-sm">
                            {formatAdminAuditWhen(r.created_at)}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="font-medium">{safeText(r.method)}</div>
                            <div className="text-muted-foreground">{safeText(r.path)}</div>
                            {r.referer && (
                              <div className="text-muted-foreground text-xs">ref: {truncateNullable(r.referer, 40)}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getAdminAuditStatusVariant(code)}>{code || '—'}</Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {Number(r.response_time_ms ?? 0)}ms
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="font-medium">{safeText(r.ip)}</div>
                            <div className="text-muted-foreground">
                              {r.user_id ? `uid:${r.user_id}` : t('common.anon')}
                              {r.is_admin ? ' · admin' : ''}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {geo || '—'}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[200px] truncate" title={r.user_agent ?? ''}>
                            {truncateNullable(r.user_agent, 50) || '—'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {reqTotal === 0 ? '0' : `${offset + 1}-${Math.min(offset + limit, reqTotal)}`}
                  {' / '} {reqTotal}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canPrev}
                    onClick={() => apply({ offset: Math.max(0, offset - limit) })}
                  >
                    {t('common.prev')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canNextReq}
                    onClick={() => apply({ offset: offset + limit })}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== AUTH TAB ==================== */}
        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" /> {t('auth.filtersTitle')}
              </CardTitle>
              <CardDescription>{t('auth.filtersDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmitAuth} className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>{t('auth.event')}</Label>
                  <Select value={eventText || ''} onValueChange={setEventText}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>{t('common.all')}</SelectItem>
                      {AUDIT_AUTH_EVENTS.map((ev) => (
                        <SelectItem key={ev} value={ev}>
                          {ev}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('auth.email')}</Label>
                  <Input value={emailText} onChange={(e) => setEmailText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.userId')}</Label>
                  <Input value={userIdText} onChange={(e) => setUserIdText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.ip')}</Label>
                  <Input value={ipText} onChange={(e) => setIpText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.from')}</Label>
                  <Input type="datetime-local" value={fromText} onChange={(e) => setFromText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.to')}</Label>
                  <Input type="datetime-local" value={toText} onChange={(e) => setToText(e.target.value)} />
                </div>

                <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                  <Button type="submit">
                    <Search className="mr-2 h-4 w-4" /> {t('common.apply')}
                  </Button>
                  <Button type="button" variant="secondary" onClick={onResetAuth}>
                    {t('common.reset')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{t('auth.eventsTitle')}</CardTitle>
                  <CardDescription>
                    {t('common.totalRecords', { count: String(authTotal) })}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {authLoading ? t('common.loading') : t('common.recordCount', { count: String(authData.items.length) })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {authQ.error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  {getErrorMessage(authQ.error, t('error'))}
                </div>
              )}

              <div className="mt-3 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('columns.date')}</TableHead>
                      <TableHead>{t('auth.event')}</TableHead>
                      <TableHead>{t('columns.user')}</TableHead>
                      <TableHead>{t('common.ip')}</TableHead>
                      <TableHead>{t('columns.location')}</TableHead>
                      <TableHead className="hidden lg:table-cell">{t('columns.userAgent')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {authData.items.length === 0 && !authLoading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                          {t('common.noRecords')}
                        </TableCell>
                      </TableRow>
                    )}

                    {authData.items.map((r) => {
                      const geo = getAdminAuditGeoLabel(r.country, r.city);
                      return (
                        <TableRow key={String(r.id)}>
                          <TableCell className="whitespace-nowrap text-sm">{formatAdminAuditWhen(r.created_at)}</TableCell>
                          <TableCell>
                            <Badge variant={getAdminAuditAuthEventVariant(r.event)}>{safeText(r.event)}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="font-medium">{safeText(r.email || r.user_id || '—')}</div>
                            <div className="text-muted-foreground">{r.user_id ? `uid:${r.user_id}` : ''}</div>
                          </TableCell>
                          <TableCell className="text-sm">{safeText(r.ip)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {geo || '—'}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[200px] truncate" title={r.user_agent ?? ''}>
                            {truncateNullable(r.user_agent, 50) || '—'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {authTotal === 0 ? '0' : `${offset + 1}-${Math.min(offset + limit, authTotal)}`}
                  {' / '} {authTotal}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canPrev}
                    onClick={() => apply({ offset: Math.max(0, offset - limit) })}
                  >
                    {t('common.prev')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canNextAuth}
                    onClick={() => apply({ offset: offset + limit })}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== METRICS TAB ==================== */}
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" /> {t('metrics.title')}
              </CardTitle>
              <CardDescription>{t('metrics.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmitMetrics} className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>{t('metrics.days')}</Label>
                  <Select value={daysText} onValueChange={setDaysText}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">{t('metrics.nDays', { n: '7' })}</SelectItem>
                      <SelectItem value="14">{t('metrics.nDays', { n: '14' })}</SelectItem>
                      <SelectItem value="30">{t('metrics.nDays', { n: '30' })}</SelectItem>
                      <SelectItem value="60">{t('metrics.nDays', { n: '60' })}</SelectItem>
                      <SelectItem value="90">{t('metrics.nDays', { n: '90' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('metrics.pathPrefix')}</Label>
                  <Input
                    value={pathPrefixText}
                    onChange={(e) => setPathPrefixText(e.target.value)}
                    placeholder={t('metrics.placeholders.pathPrefix')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.onlyAdmin')}</Label>
                  <div className="flex items-center gap-2">
                    <Switch checked={onlyAdminFlag} onCheckedChange={setOnlyAdminFlag} />
                    <span className="text-sm text-muted-foreground">{t('common.adminRequests')}</span>
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                  <Button type="submit">
                    <Filter className="mr-2 h-4 w-4" /> {t('common.apply')}
                  </Button>
                  <Button type="button" variant="secondary" onClick={onResetMetrics}>
                    {t('common.reset')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{t('metrics.chartTitle')}</CardTitle>
                  <CardDescription>{t('metrics.lastNDays', { n: String(metricsData.days?.length ?? 0) })}</CardDescription>
                </div>
                {metricsLoading && (
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> {t('common.loading')}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {metricsQ.error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  {getErrorMessage(metricsQ.error, t('error'))}
                </div>
              )}
              <AuditDailyChart rows={metricsData.days ?? []} loading={metricsLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== ADS TAB ==================== */}
        <TabsContent value="ads" className="space-y-4">
          <RangeControls range={range} onChange={(next) => apply({ tab: 'ads', range: next })} />
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('analytics.adsAttributionTitle')}</CardTitle>
                <CardDescription>{t('analytics.adsAttributionDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('analytics.campaign')}</TableHead>
                      <TableHead>{t('analytics.sourceMedium')}</TableHead>
                      <TableHead className="text-right">{t('analytics.pageview')}</TableHead>
                      <TableHead className="text-right">{t('analytics.uniqueIps')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(adsData?.items ?? []).map((row) => (
                      <TableRow key={`${row.campaign}-${row.source}-${row.medium}`}>
                        <TableCell className="font-medium">{row.campaign || '-'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {row.source || '-'} / {row.medium || '-'}
                        </TableCell>
                        <TableCell className="text-right">{fmtNumber(row.pageviews)}</TableCell>
                        <TableCell className="text-right">{fmtNumber(row.uniqueIps)}</TableCell>
                      </TableRow>
                    ))}
                    {!adsLoading && (adsData?.items?.length ?? 0) === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>{t('common.noRecords')}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <SimpleRowsCard
              title={t('analytics.funnelTitle')}
              rows={funnelData?.items ?? []}
              loading={adsLoading}
              emptyText={t('common.noRecords')}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('analytics.adsDailyTitle')}</CardTitle>
              <CardDescription>{t('analytics.adsDailyDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('analytics.date')}</TableHead>
                    <TableHead>{t('analytics.campaign')}</TableHead>
                    <TableHead>{t('analytics.sourceMedium')}</TableHead>
                    <TableHead className="text-right">{t('analytics.pageview')}</TableHead>
                    <TableHead className="text-right">{t('analytics.uniqueIps')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(adsDailyData?.items ?? []).map((row) => (
                    <TableRow key={`${row.date}-${row.campaign}-${row.source}-${row.medium}`}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell className="font-medium">{row.campaign || '-'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {row.source || '-'} / {row.medium || '-'}
                      </TableCell>
                      <TableCell className="text-right">{fmtNumber(row.pageviews)}</TableCell>
                      <TableCell className="text-right">{fmtNumber(row.uniqueIps)}</TableCell>
                    </TableRow>
                  ))}
                  {!adsLoading && (adsDailyData?.items?.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>{t('common.noRecords')}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== DEVICE TAB ==================== */}
        <TabsContent value="device" className="space-y-4">
          <RangeControls range={range} onChange={(next) => apply({ tab: 'device', range: next })} />
          <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
            <SimpleRowsCard
              title={t('analytics.deviceBreakdown')}
              rows={(overviewData?.devices ?? []).map((row) => ({ name: deviceLabel(row.device), count: row.count }))}
              loading={deviceLoading}
              emptyText={t('common.noRecords')}
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('analytics.heatmapTitle')}</CardTitle>
                <CardDescription>{t('analytics.heatmapDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('analytics.weekday')}</TableHead>
                      <TableHead>{t('analytics.hour')}</TableHead>
                      <TableHead className="text-right">{t('analytics.humans')}</TableHead>
                      <TableHead className="text-right">{t('analytics.uniqueIps')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(heatmapData?.items ?? []).slice(0, 24).map((row) => (
                      <TableRow key={`${row.weekday}-${row.hour}`}>
                        <TableCell>{weekdayLabel(row.weekday)}</TableCell>
                        <TableCell>{String(row.hour).padStart(2, '0')}:00</TableCell>
                        <TableCell className="text-right">{fmtNumber(row.humans)}</TableCell>
                        <TableCell className="text-right">{fmtNumber(row.uniqueIps)}</TableCell>
                      </TableRow>
                    ))}
                    {!deviceLoading && (heatmapData?.items?.length ?? 0) === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>{t('common.noRecords')}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('analytics.deviceDailyTitle')}</CardTitle>
              <CardDescription>{t('analytics.deviceDailyDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('analytics.date')}</TableHead>
                    <TableHead>{t('analytics.device')}</TableHead>
                    <TableHead className="text-right">{t('analytics.requests')}</TableHead>
                    <TableHead className="text-right">{t('analytics.uniqueIps')}</TableHead>
                    <TableHead className="text-right">{t('analytics.adsRequests')}</TableHead>
                    <TableHead className="text-right">{t('analytics.adsUniqueIps')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(deviceDailyData?.items ?? []).map((row) => (
                    <TableRow key={`${row.date}-${row.device}`}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{deviceLabel(row.device)}</TableCell>
                      <TableCell className="text-right">{fmtNumber(row.requests)}</TableCell>
                      <TableCell className="text-right">{fmtNumber(row.uniqueIps)}</TableCell>
                      <TableCell className="text-right">{fmtNumber(row.adsRequests)}</TableCell>
                      <TableCell className="text-right">{fmtNumber(row.adsUniqueIps)}</TableCell>
                    </TableRow>
                  ))}
                  {!deviceLoading && (deviceDailyData?.items?.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>{t('common.noRecords')}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== MAP TAB ==================== */}
        <TabsContent value="map" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-md border bg-muted/30 p-1">
              {([
                ['all', t('map.trafficAll')],
                ['human', t('map.trafficHuman')],
                ['bot', t('map.trafficBot')],
              ] as const).map(([value, label]) => (
                <Button
                  key={value}
                  size="sm"
                  variant={geoTraffic === value ? 'default' : 'ghost'}
                  onClick={() => apply({ tab: 'map', traffic: value })}
                  className="h-8"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="h-4 w-4" /> {t('map.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('map.description', { days: String(geoParams.days) })}
                  </CardDescription>
                </div>
                {geoLoading && (
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> {t('common.loading')}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {geoQ.error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  {getErrorMessage(geoQ.error, t('error'))}
                </div>
              )}
              <AuditGeoMap items={geoItemsVisible} loading={geoLoading} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" /> {t('map.turkeyTitle')}
              </CardTitle>
              <CardDescription>{t('map.turkeyDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTurkeyMap cities={geoCitiesTR} loading={geoLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ----------------------------- helpers ----------------------------- */

function fmtNumber(value: number | undefined): string {
  return new Intl.NumberFormat('tr-TR').format(value ?? 0);
}

function fmtPct(value: number | undefined): string {
  return `${(value ?? 0).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}%`;
}

function RangeControls({ range, onChange }: { range: AnalyticsRange; onChange: (range: AnalyticsRange) => void }) {
  const t = useAdminT('admin.audit');
  return (
    <div className="flex justify-end">
      <div className="flex rounded-md border bg-muted/30 p-1">
        {(['7d', '30d'] as const).map((item) => (
          <Button
            key={item}
            size="sm"
            variant={range === item ? 'default' : 'ghost'}
            onClick={() => onChange(item)}
            className="h-8"
          >
            {item === '7d' ? t('analytics.range7d') : t('analytics.range30d')}
          </Button>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
        {sub ? <div className="text-muted-foreground text-xs">{sub}</div> : null}
      </CardHeader>
    </Card>
  );
}

function SimpleRowsCard({
  title,
  rows,
  loading,
  emptyText,
}: {
  title: string;
  rows: Array<{ name: string; count: number }>;
  loading?: boolean;
  emptyText: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((row) => (
          <div key={row.name} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
            <span className="min-w-0 truncate">{row.name || '-'}</span>
            <Badge variant="outline">{fmtNumber(row.count)}</Badge>
          </div>
        ))}
        {!loading && rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">{emptyText}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
