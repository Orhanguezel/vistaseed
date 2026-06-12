// =============================================================
// FILE: src/app/(main)/admin/(admin)/search-console/search-console.tsx
// Google Search Console — özet, sorgular, sayfalar, sitemap, URL inceleme
// =============================================================

'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useGscInspectMutation,
  useGscOverviewQuery,
  useGscSitemapsQuery,
  useGscSitesQuery,
  useGscStatusQuery,
} from '@/integrations/hooks';
import {
  GSC_RANGES,
  GSC_RANGE_LABELS,
  GSC_VERDICT_LABELS,
  adsLabel,
  formatGscCtr,
  formatGscNumber,
  formatGscPosition,
  getErrorMessage,
  type GscInspectResp,
  type GscRange,
  type GscRow,
} from '@/integrations/shared';

function RowTable({ rows, t, head }: { rows: GscRow[]; t: (k: string) => string; head: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-border border-b text-left text-muted-foreground text-xs">
            <th className="py-1.5 pr-3">{head}</th>
            <th className="py-1.5 pr-3 text-right">{t('cols.clicks')}</th>
            <th className="py-1.5 pr-3 text-right">{t('cols.impressions')}</th>
            <th className="py-1.5 pr-3 text-right">{t('cols.ctr')}</th>
            <th className="py-1.5 text-right">{t('cols.position')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.key}-${i}`} className="border-border/60 border-b">
              <td className="max-w-[420px] truncate py-1.5 pr-3 font-medium" title={r.key}>{r.key}</td>
              <td className="py-1.5 pr-3 text-right tabular-nums">{formatGscNumber(r.clicks)}</td>
              <td className="py-1.5 pr-3 text-right tabular-nums">{formatGscNumber(r.impressions)}</td>
              <td className="py-1.5 pr-3 text-right tabular-nums">{formatGscCtr(r.ctr)}</td>
              <td className="py-1.5 text-right tabular-nums">{formatGscPosition(r.position)}</td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr><td colSpan={5} className="py-3 text-muted-foreground text-sm">{t('empty')}</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default function SearchConsolePage() {
  const t = useAdminT('admin.searchConsole');
  const { data: status } = useGscStatusQuery();
  const { data: sites } = useGscSitesQuery();
  const [site, setSite] = React.useState<string>('');
  const [range, setRange] = React.useState<GscRange>('LAST_28_DAYS');
  const activeSite = site || status?.site || '';

  const params = { range, ...(activeSite ? { site_url: activeSite } : {}) };
  const { data: ov, isFetching } = useGscOverviewQuery(params);
  const { data: sm } = useGscSitemapsQuery(activeSite ? { site_url: activeSite } : undefined);

  const [inspectUrl, setInspectUrl] = React.useState('');
  const [inspect, { isLoading: inspecting }] = useGscInspectMutation();
  const [inspectRes, setInspectRes] = React.useState<GscInspectResp | null>(null);

  const handleInspect = async () => {
    if (!inspectUrl.trim()) return;
    try {
      const res = await inspect({ url: inspectUrl.trim(), site_url: activeSite || undefined }).unwrap();
      setInspectRes(res);
    } catch (err) {
      toast.error(`${t('inspect.failed')}: ${getErrorMessage(err)}`);
    }
  };

  const totals = ov?.totals;
  const cards = [
    { label: t('cards.clicks'), value: formatGscNumber(totals?.clicks ?? 0) },
    { label: t('cards.impressions'), value: formatGscNumber(totals?.impressions ?? 0) },
    { label: t('cards.ctr'), value: formatGscCtr(totals?.ctr ?? 0) },
    { label: t('cards.position'), value: formatGscPosition(totals?.position ?? 0) },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">{t('title')}</CardTitle>
              <CardDescription>{t('description')}</CardDescription>
            </div>
            <Badge variant={status?.connected ? 'default' : 'destructive'}>
              {status?.connected ? t('connected') : t('disconnected')}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Select value={activeSite} onValueChange={setSite}>
              <SelectTrigger className="h-8 w-72"><SelectValue placeholder={t('selectSite')} /></SelectTrigger>
              <SelectContent>
                {(sites?.items ?? []).map((s) => (
                  <SelectItem key={s.site_url} value={s.site_url}>{s.site_url}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={range} onValueChange={(v) => setRange(v as GscRange)}>
              <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GSC_RANGES.map((r) => <SelectItem key={r} value={r}>{GSC_RANGE_LABELS[r]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-md border border-border p-3">
                <div className="text-muted-foreground text-xs">{c.label}</div>
                <div className="font-semibold text-lg tabular-nums">{isFetching ? '…' : c.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">{t('queries')}</CardTitle></CardHeader>
        <CardContent><RowTable rows={ov?.queries ?? []} t={t} head={t('cols.query')} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">{t('pages')}</CardTitle></CardHeader>
        <CardContent><RowTable rows={ov?.pages ?? []} t={t} head={t('cols.page')} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('inspect.title')}</CardTitle>
          <CardDescription>{t('inspect.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input value={inspectUrl} onChange={(e) => setInspectUrl(e.target.value)} placeholder={t('inspect.placeholder')} className="h-9 text-sm" />
            <Button size="sm" onClick={handleInspect} disabled={inspecting || !inspectUrl.trim()}>
              <Search className="mr-2 h-4 w-4" />{inspecting ? t('inspect.checking') : t('inspect.check')}
            </Button>
          </div>
          {inspectRes ? (
            <div className="flex flex-wrap gap-2">
              <Badge variant={inspectRes.verdict === 'PASS' ? 'default' : 'secondary'}>
                {adsLabel(GSC_VERDICT_LABELS, inspectRes.verdict)}
              </Badge>
              <Badge variant="outline">{t('inspect.coverage')}: {inspectRes.coverage || '—'}</Badge>
              <Badge variant="outline">{t('inspect.lastCrawl')}: {inspectRes.last_crawl ? new Date(inspectRes.last_crawl).toLocaleDateString('tr-TR') : '—'}</Badge>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">{t('sitemaps')}</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {(sm?.items ?? []).map((s) => (
              <li key={s.path} className="flex items-center justify-between gap-2 border-border/60 border-b py-1.5">
                <span className="truncate" title={s.path}>{s.path}</span>
                <span className="flex shrink-0 gap-2">
                  {s.errors > 0 ? <Badge variant="destructive">{s.errors} {t('sm.errors')}</Badge> : null}
                  {s.warnings > 0 ? <Badge variant="secondary">{s.warnings} {t('sm.warnings')}</Badge> : null}
                  {s.errors === 0 && s.warnings === 0 ? <Badge variant="default">{t('sm.ok')}</Badge> : null}
                </span>
              </li>
            ))}
            {(sm?.items ?? []).length === 0 ? <li className="py-2 text-muted-foreground">{t('sm.empty')}</li> : null}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
