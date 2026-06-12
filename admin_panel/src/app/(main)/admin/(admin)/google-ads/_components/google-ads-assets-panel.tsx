// =============================================================
// FILE: src/app/(main)/admin/(admin)/google-ads/_components/google-ads-assets-panel.tsx
// PMax öğe grubu görselleri: listele / yükle (otomatik kırpma) / sil
// =============================================================

'use client';

import * as React from 'react';
import { Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useGoogleAdsAssetGroupsQuery,
  useGoogleAdsAssetImagesQuery,
  useGoogleAdsRemoveAssetMutation,
  useGoogleAdsUploadAssetMutation,
} from '@/integrations/hooks';
import {
  ADS_IMAGE_FIELD_TYPE_LABELS,
  ADS_IMAGE_FIELD_TYPE_MIN,
  ADS_STRENGTH_LABELS,
  GOOGLE_ADS_IMAGE_FIELD_TYPES,
  adsLabel,
  getErrorMessage,
  type GoogleAdsImageFieldType,
} from '@/integrations/shared';

type Props = { hasCredentials: boolean };

const STRENGTH_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  EXCELLENT: 'default',
  GOOD: 'default',
  AVERAGE: 'secondary',
  POOR: 'destructive',
  PENDING: 'outline',
};

export default function GoogleAdsAssetsPanel({ hasCredentials }: Props) {
  const t = useAdminT('admin.googleAds');
  const { data: groups } = useGoogleAdsAssetGroupsQuery(undefined, { skip: !hasCredentials });
  const [groupId, setGroupId] = React.useState<string>('');

  const items = groups?.items ?? [];
  const activeId = groupId || items[0]?.id || '';
  const activeGroup = items.find((g) => g.id === activeId);

  const { data: imagesResp, refetch, isFetching } = useGoogleAdsAssetImagesQuery(
    { id: activeId },
    { skip: !hasCredentials || !activeId },
  );
  const images = imagesResp?.items ?? [];

  const [fieldType, setFieldType] = React.useState<GoogleAdsImageFieldType>('PORTRAIT_MARKETING_IMAGE');
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadAsset, { isLoading: uploading }] = useGoogleAdsUploadAssetMutation();
  const [removeAsset, { isLoading: removing }] = useGoogleAdsRemoveAssetMutation();

  const counts = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const img of images) map[img.field_type] = (map[img.field_type] ?? 0) + 1;
    return map;
  }, [images]);

  const handleUpload = async () => {
    if (!file || !activeId) return;
    try {
      await uploadAsset({ assetGroupId: activeId, fieldType, file }).unwrap();
      toast.success(t('assets.uploaded'));
      setFile(null);
      void refetch();
    } catch (err) {
      toast.error(`${t('assets.uploadFailed')}: ${getErrorMessage(err)}`);
    }
  };

  const handleRemove = async (resourceName: string) => {
    if (!window.confirm(t('assets.removeConfirm'))) return;
    try {
      await removeAsset({ resource_name: resourceName }).unwrap();
      toast.success(t('assets.removed'));
      void refetch();
    } catch (err) {
      toast.error(`${t('assets.removeFailed')}: ${getErrorMessage(err)}`);
    }
  };

  if (!hasCredentials) {
    return <Card><CardContent className="py-6 text-muted-foreground text-sm">{t('assets.noCredentials')}</CardContent></Card>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('assets.title')}</CardTitle>
          <CardDescription>{t('assets.description')}</CardDescription>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Select value={activeId} onValueChange={setGroupId}>
              <SelectTrigger className="w-72"><SelectValue placeholder={t('assets.selectGroup')} /></SelectTrigger>
              <SelectContent>
                {items.map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.campaign} — {g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeGroup ? (
              <Badge variant={STRENGTH_VARIANT[activeGroup.ad_strength] ?? 'outline'}>
                {t('assets.adStrength')}: {adsLabel(ADS_STRENGTH_LABELS, activeGroup.ad_strength)}
              </Badge>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {GOOGLE_ADS_IMAGE_FIELD_TYPES.map((ft) => {
              const n = counts[ft] ?? 0;
              const min = ADS_IMAGE_FIELD_TYPE_MIN[ft] ?? 0;
              return (
                <Badge key={ft} variant={n >= min ? 'default' : 'secondary'}>
                  {adsLabel(ADS_IMAGE_FIELD_TYPE_LABELS, ft)}: {n}/{min} {n >= min ? '✓' : '⚠'}
                </Badge>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-end gap-3 rounded-md border border-border p-3">
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">{t('assets.fieldType')}</label>
              <Select value={fieldType} onValueChange={(v) => setFieldType(v as GoogleAdsImageFieldType)}>
                <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GOOGLE_ADS_IMAGE_FIELD_TYPES.map((ft) => (
                    <SelectItem key={ft} value={ft}>{adsLabel(ADS_IMAGE_FIELD_TYPE_LABELS, ft)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm file:mr-3 file:rounded file:border file:border-border file:bg-muted file:px-3 file:py-1.5 file:text-sm"
            />
            <Button size="sm" onClick={handleUpload} disabled={!file || uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? t('assets.uploading') : t('assets.upload')}
            </Button>
            <p className="w-full text-muted-foreground text-xs">{t('assets.cropNote')}</p>
          </div>

          {isFetching ? (
            <p className="text-muted-foreground text-sm">{t('assets.loading')}</p>
          ) : images.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t('assets.empty')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <div key={img.resource_name} className="group relative overflow-hidden rounded-md border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt={img.name} className="aspect-square w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-2 py-1">
                    <span className="truncate text-[10px] text-white">
                      {adsLabel(ADS_IMAGE_FIELD_TYPE_LABELS, img.field_type)} · {img.width}×{img.height}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(img.resource_name)}
                      disabled={removing}
                      className="text-white/80 hover:text-red-400"
                      aria-label={t('assets.remove')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
