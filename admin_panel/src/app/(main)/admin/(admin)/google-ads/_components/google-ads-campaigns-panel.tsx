// =============================================================
// FILE: src/app/(main)/admin/(admin)/google-ads/_components/google-ads-campaigns-panel.tsx
// Kampanya raporu (salt okunur, tarih aralığı filtreli)
// =============================================================

'use client';

import * as React from 'react';
import { RefreshCw } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoogleAdsCampaignsQuery } from '@/integrations/hooks';
import {
  GOOGLE_ADS_DATE_RANGES,
  formatCtr,
  microsToUnit,
  type GoogleAdsDateRange,
} from '@/integrations/shared';

type Props = {
  hasCredentials: boolean;
};

export default function GoogleAdsCampaignsPanel({ hasCredentials }: Props) {
  const t = useAdminT('admin.googleAds');
  const [range, setRange] = React.useState<GoogleAdsDateRange>('LAST_30_DAYS');

  const { data, isLoading, isFetching, refetch } = useGoogleAdsCampaignsQuery(
    { range },
    { skip: !hasCredentials },
  );
  const items = data?.items ?? [];

  if (!hasCredentials) {
    return <p className="py-6 text-muted-foreground text-sm">{t('campaigns.needCredentials')}</p>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>{t('campaigns.title')}</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={(v) => setRange(v as GoogleAdsDateRange)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GOOGLE_ADS_DATE_RANGES.map((item) => (
                <SelectItem key={item} value={item}>
                  {t(`campaigns.ranges.${item}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('campaigns.refresh')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="py-6 text-muted-foreground text-sm">{t('campaigns.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-6 text-muted-foreground text-sm">{t('campaigns.empty')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border border-b text-left text-muted-foreground text-xs">
                  <th className="py-2 pr-3">{t('campaigns.columns.name')}</th>
                  <th className="py-2 pr-3">{t('campaigns.columns.status')}</th>
                  <th className="py-2 pr-3 text-right">{t('campaigns.columns.budget')}</th>
                  <th className="py-2 pr-3 text-right">{t('campaigns.columns.impressions')}</th>
                  <th className="py-2 pr-3 text-right">{t('campaigns.columns.clicks')}</th>
                  <th className="py-2 pr-3 text-right">{t('campaigns.columns.ctr')}</th>
                  <th className="py-2 pr-3 text-right">{t('campaigns.columns.avgCpc')}</th>
                  <th className="py-2 pr-3 text-right">{t('campaigns.columns.cost')}</th>
                  <th className="py-2 text-right">{t('campaigns.columns.conversions')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-border/60 border-b">
                    <td className="py-2 pr-3">
                      <div className="font-medium">{row.name}</div>
                      <div className="text-muted-foreground text-xs">{row.channel_type}</div>
                    </td>
                    <td className="py-2 pr-3">
                      <Badge variant={row.status === 'ENABLED' ? 'default' : 'secondary'}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-2 pr-3 text-right">{microsToUnit(row.budget_micros)}</td>
                    <td className="py-2 pr-3 text-right">{row.impressions.toLocaleString('tr-TR')}</td>
                    <td className="py-2 pr-3 text-right">{row.clicks.toLocaleString('tr-TR')}</td>
                    <td className="py-2 pr-3 text-right">{formatCtr(row.ctr)}</td>
                    <td className="py-2 pr-3 text-right">{microsToUnit(row.average_cpc_micros)}</td>
                    <td className="py-2 pr-3 text-right">{microsToUnit(row.cost_micros)}</td>
                    <td className="py-2 text-right">{row.conversions.toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
