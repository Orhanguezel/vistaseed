'use client';

import { Save } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrayEditor } from './array-editor';
import { useSettingKey } from './setting-key-hooks';

type TrustBadge = { icon?: string; title?: string; description?: string };

export default function TrustBadgesEditor({ locale }: { locale: string }) {
  const t = useAdminT('admin.homepage-content');
  const { value, setValue, save, loading, saving } = useSettingKey<TrustBadge[]>(
    'trust_badges',
    locale,
    [],
  );

  const busy = loading || saving;
  const items = (Array.isArray(value) ? value : []).map((b) => ({
    icon: b.icon ?? '',
    title: b.title ?? '',
    description: b.description ?? '',
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t('sections.trustBar.title')}</CardTitle>
          <CardDescription>{t('sections.trustBar.description')}</CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => save(t('messages.saved'), t('messages.saveFailed'))}
          disabled={busy}
        >
          <Save className="size-3.5 mr-2" />
          {t('actions.save')}
        </Button>
      </CardHeader>
      <CardContent>
        <ArrayEditor
          items={items}
          onChange={setValue}
          fields={[
            { key: 'icon', label: t('fields.icon') },
            { key: 'title', label: t('fields.title') },
            { key: 'description', label: t('fields.description'), type: 'textarea' },
          ]}
          addLabel={t('actions.addBadge')}
          emptyItem={{ icon: 'shield', title: '', description: '' }}
          saving={busy}
        />
      </CardContent>
    </Card>
  );
}
