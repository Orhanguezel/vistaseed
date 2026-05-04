'use client';

import { Save } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useSettingKey } from './setting-key-hooks';

interface PlantingGuideData {
  title?: string;
  description?: string;
  seasons?: Record<string, unknown>;
}

export default function PlantingGuideEditor({ locale }: { locale: string }) {
  const t = useAdminT('admin.homepage-content');
  const { value, setValue, save, loading, saving } = useSettingKey<PlantingGuideData>(
    'planting_guide',
    locale,
    {},
  );

  const busy = loading || saving;
  const seasonsJson = JSON.stringify(value.seasons ?? {}, null, 2);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t('sections.plantingGuide.title')}</CardTitle>
          <CardDescription>{t('sections.plantingGuide.description')}</CardDescription>
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
      <CardContent className="space-y-3">
        <div>
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t('fields.title')}
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
            {t('fields.description')}
          </Label>
          <Textarea
            value={value.description ?? ''}
            onChange={(e) => setValue((p) => ({ ...p, description: e.target.value }))}
            rows={2}
            className="mt-1"
            disabled={busy}
          />
        </div>
        <div>
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t('fields.seasonsJson')}
          </Label>
          <Textarea
            value={seasonsJson}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setValue((p) => ({ ...p, seasons: parsed }));
              } catch {
                /* invalid JSON, allow typing */
              }
            }}
            rows={10}
            className="mt-1 font-mono text-xs"
            disabled={busy}
          />
          <p className="text-[10px] text-muted-foreground mt-1">{t('messages.jsonHint')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
