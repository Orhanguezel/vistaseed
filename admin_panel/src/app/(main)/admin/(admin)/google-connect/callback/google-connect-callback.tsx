'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoogleConnectExchangeMutation, useGoogleConnectRedirectQuery } from '@/integrations/hooks';
import { getErrorMessage } from '@/integrations/shared';

function exchangeKey(code: string): string {
  return `gc_exchange_${code}`;
}

function wasExchangeStarted(code: string): boolean {
  try {
    return sessionStorage.getItem(exchangeKey(code)) === '1';
  } catch {
    return false;
  }
}

function markExchangeStarted(code: string): void {
  try {
    sessionStorage.setItem(exchangeKey(code), '1');
  } catch {
    // ignore
  }
}

export function GoogleConnectCallback() {
  const t = useAdminT('admin.googleConnect');
  const router = useRouter();
  const params = useSearchParams();
  const { data: redirect } = useGoogleConnectRedirectQuery();
  const [exchange] = useGoogleConnectExchangeMutation();
  const [state, setState] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState(t('callbackProcessing'));
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    if (startedRef.current) return;
    const code = params.get('code');
    const oauthState = params.get('state') ?? undefined;
    const error = params.get('error');
    if (error) {
      startedRef.current = true;
      setState('error');
      setMessage(error);
      return;
    }
    if (!code || !redirect?.callback_uri) return;
    if (wasExchangeStarted(code)) {
      startedRef.current = true;
      setState('error');
      setMessage(t('callbackAlreadyAttempted'));
      return;
    }
    startedRef.current = true;
    markExchangeStarted(code);
    exchange({ code, state: oauthState, redirect_uri: redirect.callback_uri }).unwrap()
      .then(() => {
        setState('success');
        setMessage(t('callbackSuccess'));
        window.setTimeout(() => router.replace('/admin/google-connect'), 1800);
      })
      .catch((err) => {
        setState('error');
        setMessage(getErrorMessage(err));
      });
  }, [exchange, params, redirect?.callback_uri, router, t]);

  const Icon = state === 'success' ? CheckCircle2 : state === 'error' ? XCircle : Loader2;
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-base">{t('callbackTitle')}</CardTitle>
          <CardDescription>{t('callbackDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-3">
            <Icon className={state === 'loading' ? 'h-5 w-5 animate-spin' : 'h-5 w-5'} />
            <span>{message}</span>
          </div>
          {state === 'error' ? (
            <Button type="button" variant="outline" onClick={() => router.replace('/admin/google-connect')}>
              {t('retryConnect')}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
