// =============================================================
// FILE: src/app/(main)/admin/(admin)/google-ads/_components/google-ads-insights-panel.tsx
// Verim analizi: dönüşüm aksiyonları, arama terimleri, kelimeler, cihazlar
// =============================================================

'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoogleAdsInsightsQuery } from '@/integrations/hooks';
import {
  ADS_DEVICE_LABELS,
  ADS_MATCH_TYPE_LABELS,
  ADS_STATUS_LABELS,
  adsLabel,
  formatCtr,
  microsToUnit,
  type GoogleAdsDateRange,
  type GoogleAdsTermRow,
} from '@/integrations/shared';

type Props = {
  hasCredentials: boolean;
  range: GoogleAdsDateRange;
};

function TermTable({ rows, showMatchType, t }: {
  rows: GoogleAdsTermRow[];
  showMatchType?: boolean;
  t: (key: string) => string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-border border-b text-left text-muted-foreground text-xs">
            <th className="py-1.5 pr-3">{t('insights.columns.term')}</th>
            {showMatchType ? <th className="py-1.5 pr-3">{t('insights.columns.matchType')}</th> : null}
            <th className="py-1.5 pr-3">{t('insights.columns.campaign')}</th>
            <th className="py-1.5 pr-3 text-right">{t('insights.columns.clicks')}</th>
            <th className="py-1.5 pr-3 text-right">{t('insights.columns.ctr')}</th>
            <th className="py-1.5 pr-3 text-right">{t('insights.columns.cost')}</th>
            <th className="py-1.5 text-right">{t('insights.columns.conversions')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row.term}-${idx}`} className="border-border/60 border-b">
              <td className="py-1.5 pr-3 font-medium">{row.term}</td>
              {showMatchType ? (
                <td className="py-1.5 pr-3">
                  <Badge variant="outline">{adsLabel(ADS_MATCH_TYPE_LABELS, row.match_type || '')}</Badge>
                </td>
              ) : null}
              <td className="py-1.5 pr-3 text-muted-foreground text-xs">{row.campaign}</td>
              <td className="py-1.5 pr-3 text-right">{row.clicks.toLocaleString('tr-TR')}</td>
              <td className="py-1.5 pr-3 text-right">{formatCtr(row.ctr)}</td>
              <td className="py-1.5 pr-3 text-right">{microsToUnit(row.cost_micros)}</td>
              <td className="py-1.5 text-right">{row.conversions.toLocaleString('tr-TR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GoogleAdsInsightsPanel({ hasCredentials, range }: Props) {
  const t = useAdminT('admin.googleAds');
  const { data, isLoading } = useGoogleAdsInsightsQuery({ range }, { skip: !hasCredentials });

  if (!hasCredentials) {
    return <p className="py-6 text-muted-foreground text-sm">{t('campaigns.needCredentials')}</p>;
  }
  if (isLoading) {
    return <p className="py-6 text-muted-foreground text-sm">{t('insights.loading')}</p>;
  }

  const totalConversions = (data?.search_terms ?? []).reduce((sum, row) => sum + row.conversions, 0)
    + (data?.devices ?? []).reduce((sum, row) => sum + row.conversions, 0);

  return (
    <div className="space-y-4">
      {totalConversions === 0 ? (
        <Card className="border-destructive/50">
          <CardHeader className="flex flex-row items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle className="text-sm">{t('insights.noConversionsTitle')}</CardTitle>
              <CardDescription>{t('insights.noConversionsDesc')}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{t('insights.conversionActions')}</CardTitle>
          <CardDescription>{t('insights.conversionActionsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(data?.conversion_actions ?? []).map((action, idx) => (
            <Badge key={idx} variant={action.status === 'ENABLED' ? 'default' : 'outline'}>
              {action.name} — {adsLabel(ADS_STATUS_LABELS, action.status)}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('insights.searchTerms')}</CardTitle>
          <CardDescription>{t('insights.searchTermsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <TermTable rows={data?.search_terms ?? []} t={t} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('insights.keywords')}</CardTitle>
          <CardDescription>{t('insights.keywordsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <TermTable rows={data?.keywords ?? []} showMatchType t={t} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('insights.devices')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border border-b text-left text-muted-foreground text-xs">
                  <th className="py-1.5 pr-3">{t('insights.columns.campaign')}</th>
                  <th className="py-1.5 pr-3">{t('insights.columns.device')}</th>
                  <th className="py-1.5 pr-3 text-right">{t('insights.columns.clicks')}</th>
                  <th className="py-1.5 pr-3 text-right">{t('insights.columns.cost')}</th>
                  <th className="py-1.5 text-right">{t('insights.columns.conversions')}</th>
                </tr>
              </thead>
              <tbody>
                {(data?.devices ?? []).map((row, idx) => (
                  <tr key={idx} className="border-border/60 border-b">
                    <td className="py-1.5 pr-3">{row.campaign}</td>
                    <td className="py-1.5 pr-3">{adsLabel(ADS_DEVICE_LABELS, row.device)}</td>
                    <td className="py-1.5 pr-3 text-right">{row.clicks.toLocaleString('tr-TR')}</td>
                    <td className="py-1.5 pr-3 text-right">{microsToUnit(row.cost_micros)}</td>
                    <td className="py-1.5 text-right">{row.conversions.toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
