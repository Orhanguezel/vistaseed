// =============================================================
// FILE: src/app/(main)/admin/(admin)/google-ads/google-ads.tsx
// Admin Google Ads Page — kampanya raporu (ayarlar: Site Settings > API)
// =============================================================

'use client';

import * as React from 'react';
import { Settings, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoogleAdsStatusQuery, useGoogleAdsVerifyMutation } from '@/integrations/hooks';
import { getErrorMessage } from '@/integrations/shared';

import GoogleAdsCampaignsPanel from './_components/google-ads-campaigns-panel';
import GoogleAdsInsightsPanel from './_components/google-ads-insights-panel';

export default function GoogleAdsAdminPage() {
  const t = useAdminT('admin.googleAds');
  const { data: status, refetch: refetchStatus } = useGoogleAdsStatusQuery();
  const [adsVerify, { isLoading: verifying }] = useGoogleAdsVerifyMutation();

  const handleVerify = async () => {
    try {
      const res = await adsVerify().unwrap();
      if (res.ok) {
        toast.success(`${t('header.verified')} (${res.customers?.length ?? 0} ${t('header.accounts')})`);
      } else {
        toast.error(t('header.verifyFailed'));
      }
    } catch (err) {
      toast.error(`${t('header.verifyFailed')}: ${getErrorMessage(err)}`);
    } finally {
      void refetchStatus();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-base">{t('header.title')}</CardTitle>
            <CardDescription>{t('header.description')}</CardDescription>
            <div className="flex gap-2">
              <Badge variant={status?.has_credentials ? 'default' : 'destructive'}>
                {status?.has_credentials ? t('header.credentialsOk') : t('header.credentialsMissing')}
              </Badge>
              {status?.customer_id ? <Badge variant="outline">{status.customer_id}</Badge> : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVerify}
              disabled={verifying || !status?.has_credentials}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              {verifying ? t('header.verifying') : t('header.verify')}
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="/admin/site-settings?tab=api">
                <Settings className="mr-2 h-4 w-4" />
                {t('header.apiSettings')}
              </a>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList>
          <TabsTrigger value="campaigns">{t('tabs.campaigns')}</TabsTrigger>
          <TabsTrigger value="insights">{t('tabs.insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <GoogleAdsCampaignsPanel hasCredentials={Boolean(status?.has_credentials)} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <GoogleAdsInsightsPanel hasCredentials={Boolean(status?.has_credentials)} range="LAST_30_DAYS" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
