'use client';

import { Save } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ArrayEditor } from './array-editor';
import { useSettingKey } from './setting-key-hooks';

interface PanelItem {
  title?: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
}

interface FeaturePanelsData {
  title?: string;
  subtitle?: string;
  cover_image_url?: string;
  cover_image_alt?: string;
  items?: PanelItem[];
}

export default function FeaturePanelsEditor({ locale }: { locale: string }) {
  const t = useAdminT('admin.homepage-content');
  const { value, setValue, save, loading, saving } = useSettingKey<FeaturePanelsData>(
    'homepage_feature_panels',
    locale,
    {},
  );

  const busy = loading || saving;
  const items = (value.items ?? []).map((it) => ({
    title: it.title ?? '',
    description: it.description ?? '',
    image_url: it.image_url ?? '',
    image_alt: it.image_alt ?? '',
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t('sections.featurePanels.title')}</CardTitle>
          <CardDescription>{t('sections.featurePanels.description')}</CardDescription>
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
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t('fields.sectionTitle')}
            </Label>
            <Input
              value={value.title ?? ''}
              onChange={(e) => setValue((p) => ({ ...p, title: e.target.value }))}
              className="h-9 mt-1"
              disabled={busy}
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t('fields.sectionSubtitle')}
            </Label>
            <Input
              value={value.subtitle ?? ''}
              onChange={(e) => setValue((p) => ({ ...p, subtitle: e.target.value }))}
              className="h-9 mt-1"
              disabled={busy}
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t('fields.coverImageUrl')}
            </Label>
            <Input
              value={value.cover_image_url ?? ''}
              onChange={(e) => setValue((p) => ({ ...p, cover_image_url: e.target.value }))}
              className="h-9 mt-1 font-mono text-xs"
              disabled={busy}
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t('fields.coverImageAlt')}
            </Label>
            <Input
              value={value.cover_image_alt ?? ''}
              onChange={(e) => setValue((p) => ({ ...p, cover_image_alt: e.target.value }))}
              className="h-9 mt-1"
              disabled={busy}
            />
          </div>
        </div>
        <ArrayEditor
          items={items}
          onChange={(next) => setValue((p) => ({ ...p, items: next }))}
          fields={[
            { key: 'title', label: t('fields.title') },
            { key: 'description', label: t('fields.description'), type: 'textarea' },
            { key: 'image_url', label: t('fields.imageUrl') },
            { key: 'image_alt', label: t('fields.imageAlt') },
          ]}
          addLabel={t('actions.addPanel')}
          emptyItem={{ title: '', description: '', image_url: '', image_alt: '' }}
          saving={busy}
        />
      </CardContent>
    </Card>
  );
}
