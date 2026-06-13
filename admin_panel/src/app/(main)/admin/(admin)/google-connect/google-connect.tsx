// =============================================================
// FILE: src/app/(main)/admin/(admin)/google-connect/google-connect.tsx
// Panelden Google bağlan/yenile (in-panel OAuth rotasyonu)
// =============================================================

'use client';

import * as React from 'react';
import { Link2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useGoogleConnectExchangeMutation,
  useGoogleConnectStatusQuery,
  useLazyGoogleConnectAuthUrlQuery,
} from '@/integrations/hooks';
import { GOOGLE_SERVICE_LABELS, adsLabel, getErrorMessage } from '@/integrations/shared';

export default function GoogleConnectPage() {
  const t = useAdminT('admin.googleConnect');
  const { data: status, refetch } = useGoogleConnectStatusQuery();
  const [fetchAuthUrl, { isFetching: opening }] = useLazyGoogleConnectAuthUrlQuery();
  const [exchange, { isLoading: saving }] = useGoogleConnectExchangeMutation();
  const [code, setCode] = React.useState('');

  const handleReconnect = async () => {
    try {
      const res = await fetchAuthUrl().unwrap();
      window.open(res.url, '_blank', 'noopener');
    } catch (err) {
      toast.error(`${t('failed')}: ${getErrorMessage(err)}`);
    }
  };

  const handleSave = async () => {
    if (!code.trim()) return;
    try {
      await exchange({ code: code.trim() }).unwrap();
      toast.success(t('saved'));
      setCode('');
      void refetch();
    } catch (err) {
      toast.error(`${t('failed')}: ${getErrorMessage(err)}`);
    }
  };

  const services = status?.services ?? {};

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
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.keys(GOOGLE_SERVICE_LABELS).map((svc) => (
              <Badge key={svc} variant={services[svc] ? 'default' : 'secondary'}>
                {services[svc] ? '✓' : '×'} {adsLabel(GOOGLE_SERVICE_LABELS, svc)}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button size="sm" onClick={handleReconnect} disabled={opening}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            {opening ? t('opening') : t('reconnect')}
          </Button>
          <p className="text-muted-foreground text-xs">{t('note')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('scopes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-muted-foreground text-xs">
            {(status?.scopes ?? []).map((s) => <li key={s} className="truncate">{s}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('reconnect')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ol className="space-y-1 text-muted-foreground text-xs">
            <li>{t('step1')}</li>
            <li>{t('step2')}</li>
            <li>{t('step3')}</li>
          </ol>
          <div className="flex items-center gap-2 pt-1">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('codePlaceholder')} className="h-9 text-sm" />
            <Button size="sm" onClick={handleSave} disabled={saving || !code.trim()}>
              <Link2 className="mr-2 h-4 w-4" />
              {saving ? t('saving') : t('save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
