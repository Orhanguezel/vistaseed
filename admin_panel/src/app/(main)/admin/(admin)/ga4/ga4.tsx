// =============================================================
// FILE: src/app/(main)/admin/(admin)/ga4/ga4.tsx
// Google Analytics 4 — özet, zaman serisi, kanal/cihaz/sayfa, anahtar olaylar
// =============================================================

'use client';

import * as React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useGa4CreateKeyEventMutation,
  useGa4DeleteKeyEventMutation,
  useGa4KeyEventsQuery,
  useGa4OverviewQuery,
  useGa4StatusQuery,
} from '@/integrations/hooks';
import {
  GA4_COUNTING_LABELS,
  GA4_RANGES,
  GA4_RANGE_LABELS,
  adsLabel,
  formatGa4Date,
  formatGa4Number,
  getErrorMessage,
  type Ga4Range,
  type Ga4Row,
} from '@/integrations/shared';

function Bars({ rows, t }: { rows: Ga4Row[]; t: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <p className="text-muted-foreground text-sm">{t('empty')}</p>;
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li key={r.label} className="text-sm">
          <div className="flex justify-between gap-2">
            <span className="truncate" title={r.label}>{r.label || '—'}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{formatGa4Number(r.value)}</span>
          </div>
          <div className="mt-0.5 h-1.5 rounded bg-muted">
            <div className="h-1.5 rounded bg-primary" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Ga4Page() {
  const t = useAdminT('admin.ga4');
  const { data: status } = useGa4StatusQuery();
  const [range, setRange] = React.useState<Ga4Range>('LAST_28_DAYS');
  const { data: ov, isFetching } = useGa4OverviewQuery({ range });
  const { data: keyEvents } = useGa4KeyEventsQuery();
  const [createKe, { isLoading: creating }] = useGa4CreateKeyEventMutation();
  const [deleteKe] = useGa4DeleteKeyEventMutation();
  const [newEvent, setNewEvent] = React.useState('');

  const totals = ov?.totals;
  const cards = [
    { label: t('cards.users'), value: formatGa4Number(totals?.users ?? 0) },
    { label: t('cards.sessions'), value: formatGa4Number(totals?.sessions ?? 0) },
    { label: t('cards.views'), value: formatGa4Number(totals?.views ?? 0) },
    { label: t('cards.conversions'), value: formatGa4Number(totals?.conversions ?? 0) },
  ];
  const series = (ov?.byDate ?? []).map((d) => ({ ...d, label: formatGa4Date(d.date) }));

  const handleAdd = async () => {
    if (!newEvent.trim()) return;
    try {
      await createKe({ event_name: newEvent.trim() }).unwrap();
      toast.success(t('ke.added'));
      setNewEvent('');
    } catch (err) {
      toast.error(`${t('ke.failed')}: ${getErrorMessage(err)}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('ke.removeConfirm'))) return;
    try {
      await deleteKe({ id }).unwrap();
      toast.success(t('ke.removed'));
    } catch (err) {
      toast.error(`${t('ke.failed')}: ${getErrorMessage(err)}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">{t('title')}</CardTitle>
              <CardDescription>{t('description')}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={status?.connected ? 'default' : 'destructive'}>
                {status?.connected ? t('connected') : t('disconnected')}
              </Badge>
              {status?.property ? <Badge variant="outline">#{status.property}</Badge> : null}
            </div>
          </div>
          <Select value={range} onValueChange={(v) => setRange(v as Ga4Range)}>
            <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{GA4_RANGES.map((r) => <SelectItem key={r} value={r}>{GA4_RANGE_LABELS[r]}</SelectItem>)}</SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-md border border-border p-3">
                <div className="text-muted-foreground text-xs">{c.label}</div>
                <div className="font-semibold text-lg tabular-nums">{isFetching ? '…' : c.value}</div>
              </div>
            ))}
          </div>
          {series.length > 0 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ga4s" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <Tooltip />
                  <Area type="monotone" dataKey="sessions" stroke="var(--primary)" fill="url(#ga4s)" name={t('cards.sessions')} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">{t('channels')}</CardTitle></CardHeader><CardContent><Bars rows={ov?.channels ?? []} t={t} /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">{t('devices')}</CardTitle></CardHeader><CardContent><Bars rows={ov?.devices ?? []} t={t} /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">{t('pages')}</CardTitle></CardHeader><CardContent><Bars rows={(ov?.pages ?? []).slice(0, 8)} t={t} /></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('ke.title')}</CardTitle>
          <CardDescription>{t('ke.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input value={newEvent} onChange={(e) => setNewEvent(e.target.value)} placeholder={t('ke.placeholder')} className="h-8 w-64 text-sm" />
            <Button size="sm" onClick={handleAdd} disabled={creating || !newEvent.trim()}>
              <Plus className="mr-1 h-4 w-4" />{t('ke.add')}
            </Button>
          </div>
          <ul className="space-y-1 text-sm">
            {(keyEvents?.items ?? []).map((k) => (
              <li key={k.id} className="flex items-center justify-between gap-2 border-border/60 border-b py-1.5">
                <span className="flex items-center gap-2">
                  <span className="font-medium">{k.name}</span>
                  <Badge variant="outline">{adsLabel(GA4_COUNTING_LABELS, k.counting)}</Badge>
                  {k.custom ? <Badge variant="secondary">{t('ke.custom')}</Badge> : null}
                </span>
                <button type="button" onClick={() => handleDelete(k.id)} aria-label={t('ke.remove')}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                </button>
              </li>
            ))}
            {(keyEvents?.items ?? []).length === 0 ? <li className="py-2 text-muted-foreground">{t('ke.empty')}</li> : null}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
