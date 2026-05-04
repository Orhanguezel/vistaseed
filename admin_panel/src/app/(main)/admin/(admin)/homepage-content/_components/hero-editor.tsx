'use client';

import * as React from 'react';
import { Save } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useSettingKey } from './setting-key-hooks';

interface HeroData {
  season?: string;
  title?: string;
  highlight?: string;
  suffix?: string;
  description?: string;
  badge?: string;
  image_url?: string;
  cta_label?: string;
  cta_href?: string;
  secondary_label?: string;
  secondary_href?: string;
}

export default function HeroEditor({ locale }: { locale: string }) {
  const t = useAdminT('admin.homepage-content');
  const { value, setValue, save, loading, saving } = useSettingKey<HeroData>(
    'homepage_hero',
    locale,
    {},
  );

  const update = <K extends keyof HeroData>(k: K, v: HeroData[K]) =>
    setValue((prev) => ({ ...prev, [k]: v }));

  const busy = loading || saving;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t('sections.hero.title')}</CardTitle>
          <CardDescription>{t('sections.hero.description')}</CardDescription>
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
        <div className="grid gap-3 md:grid-cols-3">
          <Field label={t('fields.heroTitle')} value={value.title} onChange={(v) => update('title', v)} disabled={busy} />
          <Field label={t('fields.heroHighlight')} value={value.highlight} onChange={(v) => update('highlight', v)} disabled={busy} />
          <Field label={t('fields.heroSuffix')} value={value.suffix} onChange={(v) => update('suffix', v)} disabled={busy} />
        </div>
        <Field label={t('fields.description')} value={value.description} onChange={(v) => update('description', v)} disabled={busy} textarea />
        <div className="grid gap-3 md:grid-cols-2">
          <Field label={t('fields.heroBadge')} value={value.badge} onChange={(v) => update('badge', v)} disabled={busy} />
          <Field label={t('fields.heroSeason')} value={value.season} onChange={(v) => update('season', v)} disabled={busy} />
        </div>
        <Field label={t('fields.imageUrl')} value={value.image_url} onChange={(v) => update('image_url', v)} disabled={busy} mono />
        <div className="grid gap-3 md:grid-cols-2">
          <Field label={t('fields.ctaLabel')} value={value.cta_label} onChange={(v) => update('cta_label', v)} disabled={busy} />
          <Field label={t('fields.ctaHref')} value={value.cta_href} onChange={(v) => update('cta_href', v)} disabled={busy} mono />
          <Field label={t('fields.secondaryLabel')} value={value.secondary_label} onChange={(v) => update('secondary_label', v)} disabled={busy} />
          <Field label={t('fields.secondaryHref')} value={value.secondary_href} onChange={(v) => update('secondary_href', v)} disabled={busy} mono />
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  textarea,
  mono,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  textarea?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      {textarea ? (
        <Textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="mt-1"
          disabled={disabled}
        />
      ) : (
        <Input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={`h-9 mt-1 ${mono ? 'font-mono text-xs' : ''}`}
          disabled={disabled}
        />
      )}
    </div>
  );
}
