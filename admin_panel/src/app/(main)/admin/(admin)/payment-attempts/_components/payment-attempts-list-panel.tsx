'use client';

import * as React from 'react';
import { RefreshCw } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useListPaymentAttemptsAdminQuery } from '@/integrations/hooks';

const PAGE_SIZE = 20;

function formatCurrency(amount: number) {
  return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('tr-TR');
}

function badgeClass(status: string) {
  switch (status) {
    case 'succeeded':
      return 'bg-emerald-500/10 text-emerald-600';
    case 'failed':
      return 'bg-rose-500/10 text-rose-600';
    case 'expired':
      return 'bg-amber-500/10 text-amber-700';
    default:
      return 'bg-sky-500/10 text-sky-700';
  }
}

export default function PaymentAttemptsListPanel() {
  const t = useAdminT('admin.payment-attempts');
  const [q, setQ] = React.useState('');
  const [provider, setProvider] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [page, setPage] = React.useState(0);

  const query = React.useMemo(
    () => ({
      q: q.trim() || undefined,
      provider: provider.trim() || undefined,
      status: status.trim() || undefined,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    [page, provider, q, status],
  );

  const { data, isFetching, refetch } = useListPaymentAttemptsAdminQuery(query, {
    refetchOnMountOrArgChange: true,
  } as any);

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  React.useEffect(() => {
    setPage(0);
  }, [q, provider, status]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="min-w-[220px] flex-1">
            <Label htmlFor="payment-attempts-search">{t('filters.search')}</Label>
            <Input
              id="payment-attempts-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('filters.searchPlaceholder')}
            />
          </div>

          <div className="min-w-[160px]">
            <Label htmlFor="payment-attempts-provider">{t('filters.provider')}</Label>
            <Input
              id="payment-attempts-provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder={t('filters.providerPlaceholder')}
            />
          </div>

          <div className="min-w-[160px]">
            <Label htmlFor="payment-attempts-status">{t('filters.status')}</Label>
            <Input
              id="payment-attempts-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder={t('filters.statusPlaceholder')}
            />
          </div>

          <Button type="button" variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`mr-2 h-4 w-4${isFetching ? ' animate-spin' : ''}`} />
            {t('actions.refresh')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.createdAt')}</TableHead>
                <TableHead>{t('table.provider')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.order')}</TableHead>
                <TableHead>{t('table.orderPayment')}</TableHead>
                <TableHead>{t('table.amount')}</TableHead>
                <TableHead>{t('table.paymentRef')}</TableHead>
                <TableHead>{t('table.lastError')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                    {isFetching ? t('states.loading') : t('states.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm">{formatDate(item.created_at)}</TableCell>
                    <TableCell className="font-medium">{item.provider}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${badgeClass(item.status)}`}>
                        {t(`status.${item.status}`)}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <div>{item.order_id}</div>
                      <div className="text-muted-foreground">{item.order_status || '—'}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{item.order_payment_status || '—'}</div>
                      <div className="text-muted-foreground">{item.order_payment_method || '—'}</div>
                    </TableCell>
                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                    <TableCell className="font-mono text-xs">{item.payment_ref}</TableCell>
                    <TableCell className="max-w-[260px] truncate text-sm text-muted-foreground">
                      {item.last_error || '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-4 pb-4 text-sm text-muted-foreground">
            <span>{t('pagination.summary', { total })}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                {t('pagination.prev')}
              </Button>
              <span>{t('pagination.page', { current: page + 1, total: totalPages })}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                {t('pagination.next')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
