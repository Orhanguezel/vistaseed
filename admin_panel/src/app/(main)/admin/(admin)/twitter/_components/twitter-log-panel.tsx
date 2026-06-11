// =============================================================
// FILE: src/app/(main)/admin/(admin)/twitter/_components/twitter-log-panel.tsx
// Tweet log panel (sent/failed history)
// =============================================================

'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, RefreshCw } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useTwitterListTweetsQuery } from '@/integrations/hooks';
import { buildTweetUrl, type TweetLogRow } from '@/integrations/shared';

const PAGE_SIZE = 20;

export default function TwitterLogPanel() {
  const t = useAdminT('admin.twitter');
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isFetching, refetch } = useTwitterListTweetsQuery({
    page,
    limit: PAGE_SIZE,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (isLoading) {
    return <div className="py-8 text-sm text-muted-foreground">{t('log.loading')}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>
          {t('log.title')} ({total})
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('log.refresh')}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">{t('log.empty')}</p>
        ) : (
          <div className="space-y-3">
            {items.map((row: TweetLogRow) => (
              <div key={row.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={row.status === 'sent' ? 'default' : 'destructive'}>
                    {row.status === 'sent' ? t('log.statusSent') : t('log.statusFailed')}
                  </Badge>
                  <Badge variant="outline">{t(`log.source.${row.source}`)}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(row.created_at).toLocaleString()}
                  </span>
                  {row.x_tweet_id ? (
                    <a
                      href={buildTweetUrl(row.x_tweet_id)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t('log.viewOnX')}
                    </a>
                  ) : null}
                </div>

                <p className="whitespace-pre-wrap text-sm">{row.content}</p>

                {row.error_message ? (
                  <p className="text-xs text-destructive">{row.error_message}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {t('log.prev')}
            </Button>
            <span className="text-xs text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              {t('log.next')}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
