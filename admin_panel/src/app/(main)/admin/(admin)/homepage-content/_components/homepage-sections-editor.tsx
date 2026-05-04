'use client';

import { Save } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { ArrayEditor } from './array-editor';
import { useSettingKey } from './setting-key-hooks';

type StatItem = { value: string; label: string };
type ValueItem = { icon: string; title: string; description: string };
type TimelineItem = { year: string; title: string; description: string };

interface HomepageSections {
  stats?: StatItem[];
  values?: ValueItem[];
  values_title?: string;
  values_subtitle?: string;
  timeline?: TimelineItem[];
  timeline_title?: string;
  timeline_subtitle?: string;
  seasonal_picks_title?: string;
  seasonal_picks_description?: string;
}

export default function HomepageSectionsEditor({ locale }: { locale: string }) {
  const t = useAdminT('admin.homepage-content');
  const { value, setValue, save, loading, saving } = useSettingKey<HomepageSections>(
    'homepage_sections',
    locale,
    {},
  );

  const busy = loading || saving;
  const stats = (value.stats ?? []).map((s) => ({ value: s.value ?? '', label: s.label ?? '' }));
  const values = (value.values ?? []).map((v) => ({
    icon: v.icon ?? '',
    title: v.title ?? '',
    description: v.description ?? '',
  }));
  const timeline = (value.timeline ?? []).map((it) => ({
    year: it.year ?? '',
    title: it.title ?? '',
    description: it.description ?? '',
  }));

  const update = <K extends keyof HomepageSections>(k: K, v: HomepageSections[K]) =>
    setValue((p) => ({ ...p, [k]: v }));

  const handleSave = () => save(t('messages.saved'), t('messages.saveFailed'));

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">{t('sections.stats.title')}</CardTitle>
            <CardDescription>{t('sections.stats.description')}</CardDescription>
          </div>
          <Button type="button" size="sm" onClick={handleSave} disabled={busy}>
            <Save className="size-3.5 mr-2" />
            {t('actions.save')}
          </Button>
        </CardHeader>
        <CardContent>
          <ArrayEditor
            items={stats}
            onChange={(next) => update('stats', next)}
            fields={[
              { key: 'value', label: t('fields.value') },
              { key: 'label', label: t('fields.label') },
            ]}
            addLabel={t('actions.addStat')}
            emptyItem={{ value: '', label: '' }}
            saving={busy}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">{t('sections.values.title')}</CardTitle>
            <CardDescription>{t('sections.values.description')}</CardDescription>
          </div>
          <Button type="button" size="sm" onClick={handleSave} disabled={busy}>
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
                value={value.values_title ?? ''}
                onChange={(e) => update('values_title', e.target.value)}
                className="h-9 mt-1"
                disabled={busy}
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('fields.sectionSubtitle')}
              </Label>
              <Input
                value={value.values_subtitle ?? ''}
                onChange={(e) => update('values_subtitle', e.target.value)}
                className="h-9 mt-1"
                disabled={busy}
              />
            </div>
          </div>
          <ArrayEditor
            items={values}
            onChange={(next) => update('values', next)}
            fields={[
              { key: 'icon', label: t('fields.icon') },
              { key: 'title', label: t('fields.title') },
              { key: 'description', label: t('fields.description'), type: 'textarea' },
            ]}
            addLabel={t('actions.addValue')}
            emptyItem={{ icon: 'star', title: '', description: '' }}
            saving={busy}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">{t('sections.timeline.title')}</CardTitle>
            <CardDescription>{t('sections.timeline.description')}</CardDescription>
          </div>
          <Button type="button" size="sm" onClick={handleSave} disabled={busy}>
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
                value={value.timeline_title ?? ''}
                onChange={(e) => update('timeline_title', e.target.value)}
                className="h-9 mt-1"
                disabled={busy}
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('fields.sectionSubtitle')}
              </Label>
              <Input
                value={value.timeline_subtitle ?? ''}
                onChange={(e) => update('timeline_subtitle', e.target.value)}
                className="h-9 mt-1"
                disabled={busy}
              />
            </div>
          </div>
          <ArrayEditor
            items={timeline}
            onChange={(next) => update('timeline', next)}
            fields={[
              { key: 'year', label: t('fields.year') },
              { key: 'title', label: t('fields.title') },
              { key: 'description', label: t('fields.description'), type: 'textarea' },
            ]}
            addLabel={t('actions.addTimeline')}
            emptyItem={{ year: '', title: '', description: '' }}
            saving={busy}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">{t('sections.seasonal.title')}</CardTitle>
            <CardDescription>{t('sections.seasonal.description')}</CardDescription>
          </div>
          <Button type="button" size="sm" onClick={handleSave} disabled={busy}>
            <Save className="size-3.5 mr-2" />
            {t('actions.save')}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t('fields.sectionTitle')}
            </Label>
            <Input
              value={value.seasonal_picks_title ?? ''}
              onChange={(e) => update('seasonal_picks_title', e.target.value)}
              className="h-9 mt-1"
              disabled={busy}
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t('fields.sectionDescription')}
            </Label>
            <Textarea
              value={value.seasonal_picks_description ?? ''}
              onChange={(e) => update('seasonal_picks_description', e.target.value)}
              rows={2}
              className="mt-1"
              disabled={busy}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
