'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  Briefcase,
  FileText,
  Globe,
  Images,
  Layers,
  Newspaper,
  RefreshCcw,
  ShoppingBag,
  Trash2,
  Users,
} from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

async function revalidate(opts: { all?: boolean; path?: string }) {
  const res = await fetch('/api/revalidate-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Revalidation failed');
  return data;
}

type CacheActionId =
  | 'all'
  | 'home'
  | 'urunler'
  | 'hakkimizda'
  | 'bayi'
  | 'sss'
  | 'galeri'
  | 'blog'
  | 'iletisim';

type CacheAction = {
  id: CacheActionId;
  icon: React.ComponentType<{ className?: string }>;
  destructive?: boolean;
  paths?: string[];
};

const CACHE_ACTIONS: CacheAction[] = [
  { id: 'all', icon: Globe, destructive: true },
  { id: 'home', icon: Globe, paths: ['/tr'] },
  { id: 'urunler', icon: ShoppingBag, paths: ['/tr/urunler'] },
  { id: 'hakkimizda', icon: FileText, paths: ['/tr/hakkimizda'] },
  { id: 'bayi', icon: Users, paths: ['/tr/bayi-girisi', '/tr/insan-kaynaklari'] },
  { id: 'sss', icon: Layers, paths: ['/tr/sss'] },
  { id: 'galeri', icon: Images, paths: ['/tr/galeri'] },
  { id: 'blog', icon: Newspaper, paths: ['/tr/blog'] },
  { id: 'iletisim', icon: Briefcase, paths: ['/tr/iletisim'] },
];

export default function CacheManagementClient() {
  const t = useAdminT('admin.cache');
  const [loading, setLoading] = React.useState<string | null>(null);
  const [lastCleared, setLastCleared] = React.useState<Record<string, string>>({});

  async function handleClear(item: CacheAction) {
    setLoading(item.id);
    try {
      if (item.id === 'all') {
        await revalidate({ all: true });
      } else if (item.paths?.length) {
        for (const p of item.paths) {
          await revalidate({ path: p });
        }
      }
      const now = new Date().toLocaleTimeString('tr-TR');
      setLastCleared((prev) => ({ ...prev, [item.id]: now }));
      toast.success(item.id === 'all' ? t('messages.allCleared') : t('messages.cleared'));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('messages.clearFailed');
      toast.error(msg);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('quickClear.title')}</CardTitle>
          <CardDescription>{t('quickClear.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CACHE_ACTIONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.id}>
                {idx === 1 && <Separator />}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t(`actions.${item.id}.label`)}</span>
                        {lastCleared[item.id] && (
                          <Badge variant="secondary" className="text-[10px]">
                            {lastCleared[item.id]}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t(`actions.${item.id}.description`)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={item.destructive ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleClear(item)}
                    disabled={loading !== null}
                  >
                    {loading === item.id ? (
                      <RefreshCcw className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 size-4" />
                    )}
                    {t('actions.clear')}
                  </Button>
                </div>
              </React.Fragment>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('info.title')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{t('info.line1')}</p>
          <p>{t('info.line2')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
