// =============================================================
// FILE: src/app/(main)/admin/(admin)/google-ads/_components/google-ads-settings-panel.tsx
// Google Ads Settings Panel (site_settings bulk upsert)
// =============================================================

'use client';

import * as React from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  useListSiteSettingsAdminQuery,
  useBulkUpsertSiteSettingsAdminMutation,
} from '@/integrations/hooks';
import {
  GOOGLE_ADS_BOOLEAN_SETTINGS_KEYS,
  GOOGLE_ADS_CREDENTIAL_FIELDS,
  GOOGLE_ADS_SETTINGS_KEYS,
  createGoogleAdsSettingsDefaults,
  toBool,
  toDbBoolString,
  type GoogleAdsSettingsKey,
  type GoogleAdsSettingsModel,
  type SiteSettingRow,
  type UpsertSettingBody,
  type ValueType,
} from '@/integrations/shared';

export default function GoogleAdsSettingsPanel() {
  const t = useAdminT('admin.googleAds');
  const { data: rows, isLoading, isFetching } = useListSiteSettingsAdminQuery(undefined);
  const [bulkUpsert, { isLoading: saving }] = useBulkUpsertSiteSettingsAdminMutation();

  const [model, setModel] = React.useState<GoogleAdsSettingsModel>(createGoogleAdsSettingsDefaults);
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!rows || initialized) return;

    const m = createGoogleAdsSettingsDefaults();
    for (const item of rows as SiteSettingRow[]) {
      const k = String(item.key ?? '') as GoogleAdsSettingsKey;
      if (!GOOGLE_ADS_SETTINGS_KEYS.includes(k)) continue;
      m[k] = GOOGLE_ADS_BOOLEAN_SETTINGS_KEYS.has(k)
        ? toDbBoolString(toBool(item.value))
        : String(item.value ?? '').trim();
    }
    setModel(m);
    setInitialized(true);
  }, [rows, initialized]);

  const setStr = (key: GoogleAdsSettingsKey, v: string) => {
    setModel((prev) => ({ ...prev, [key]: v }));
  };

  const handleSave = async () => {
    try {
      const items: UpsertSettingBody[] = (
        Object.entries(model) as Array<[GoogleAdsSettingsKey, string]>
      ).map(([key, value]) => ({
        key,
        value: GOOGLE_ADS_BOOLEAN_SETTINGS_KEYS.has(key) ? toDbBoolString(toBool(value)) : value,
        value_type: 'string' as ValueType,
        group: null,
        description: null,
      }));
      await bulkUpsert({ items }).unwrap();
      toast.success(t('settings.saved'));
    } catch (e) {
      toast.error((e as { message?: string })?.message || t('settings.saveError'));
    }
  };

  if (!initialized && (isLoading || isFetching)) {
    return <div className="py-8 text-muted-foreground text-sm">{t('settings.loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <Label className="font-medium text-base">{t('settings.enable')}</Label>
                <p className="text-muted-foreground text-xs">{t('settings.enableDesc')}</p>
              </div>
              <Switch
                checked={toBool(model.google_ads_enabled)}
                onCheckedChange={(v: boolean) => setStr('google_ads_enabled', toDbBoolString(v))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="font-medium text-base">{t('settings.credentials.title')}</Label>
              <p className="text-muted-foreground text-xs">{t('settings.credentials.desc')}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {GOOGLE_ADS_CREDENTIAL_FIELDS.map((field) => (
                <div key={field.settingsKey} className="space-y-2">
                  <Label>{t(`settings.credentials.${field.i18nKey}`)}</Label>
                  <Input
                    type={field.settingsKey.includes('customer_id') ? 'text' : 'password'}
                    value={model[field.settingsKey]}
                    onChange={(e) => setStr(field.settingsKey, e.target.value)}
                    placeholder={t('settings.credentials.placeholder')}
                    autoComplete="new-password"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? t('settings.saving') : t('settings.save')}
        </Button>
      </div>
    </div>
  );
}
