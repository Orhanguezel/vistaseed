'use client';

import { Save } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useSettingKey } from './setting-key-hooks';

interface NewsletterData {
  title?: string;
  description?: string;
  button_label?: string;
  placeholder?: string;
}

export default function NewsletterEditor({ locale }: { locale: string }) {
  const t = useAdminT('admin.homepage-content');
  const { value, setValue, save, loading, saving } = useSettingKey<NewsletterData>(
    'newsletter_config',
    locale,
    {},
  );

  const busy = loading || saving;
  const update = <K extends keyof NewsletterData>(k: K, v: NewsletterData[K]) =>
    setValue((prev) => ({ ...prev, [k]: v }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t('sections.newsletter.title')}</CardTitle>
          <CardDescription>{t('sections.newsletter.description')}</CardDescription>
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
            onChange={(e) => update('title', e.target.value)}
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
            onChange={(e) => update('description', e.target.value)}
            rows={2}
            className="mt-1"
            disabled={busy}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t('fields.buttonLabel')}
            </Label>
            <Input
              value={value.button_label ?? ''}
              onChange={(e) => update('button_label', e.target.value)}
              className="h-9 mt-1"
              disabled={busy}
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t('fields.placeholder')}
            </Label>
            <Input
              value={value.placeholder ?? ''}
              onChange={(e) => update('placeholder', e.target.value)}
              className="h-9 mt-1"
              disabled={busy}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
