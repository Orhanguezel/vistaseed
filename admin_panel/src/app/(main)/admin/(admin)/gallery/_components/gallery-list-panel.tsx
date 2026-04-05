'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { useAdminLocales } from '@/components/common/use-admin-locales';
import { AdminLocaleSelect } from '@/components/common/admin-locale-select';
import {
  useListGalleriesAdminQuery,
  useDeleteGalleryAdminMutation,
} from '@/integrations/hooks';
import {
  buildGalleryListQueryParams,
  buildGalleryToastMessage,
  GALLERY_DEFAULT_LOCALE,
  type GalleryDto,
} from '@/integrations/shared';

export default function GalleryListPanel() {
  const t = useAdminT('admin.gallery');
  const router = useRouter();

  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();

  const [search, setSearch] = React.useState('');
  const [locale, setLocale] = React.useState('');
  const [showOnlyActive, setShowOnlyActive] = React.useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = React.useState(false);

  React.useEffect(() => {
    setLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || GALLERY_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const queryParams = React.useMemo(
    () =>
      buildGalleryListQueryParams({
        search,
        locale,
        isActive: showOnlyActive,
        isFeatured: showOnlyFeatured,
      }),
    [search, locale, showOnlyActive, showOnlyFeatured],
  );

  const { data: galleries = [], isFetching, refetch } = useListGalleriesAdminQuery(
    queryParams,
    { refetchOnMountOrArgChange: true } as any,
  );

  const [deleteGallery] = useDeleteGalleryAdminMutation();

  const handleRefresh = () => {
    toast.info(t('list.refreshing'));
    refetch();
  };

  const handleCreate = () => {
    router.push('/admin/gallery/new');
  };

  const handleEdit = (item: GalleryDto) => {
    router.push(`/admin/gallery/${item.id}`);
  };

  const handleDelete = async (item: GalleryDto) => {
    if (!confirm(t('messages.confirmDelete', { title: item.title }))) return;
    try {
      await deleteGallery(item.id).unwrap();
      toast.success(buildGalleryToastMessage(item.title, t('messages.deleted')));
      refetch();
    } catch (error) {
      toast.error(`${t('messages.deleteError')}: ${error}`);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Input
            placeholder={t('filters.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />

          {localeOptions && localeOptions.length > 0 && (
            <AdminLocaleSelect
              value={locale}
              onChange={setLocale}
              options={localeOptions as any}
            />
          )}

          <div className="flex items-center gap-2">
            <Switch
              id="only-active"
              checked={showOnlyActive}
              onCheckedChange={setShowOnlyActive}
            />
            <Label htmlFor="only-active" className="text-sm">
              {t('filters.onlyActive')}
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="only-featured"
              checked={showOnlyFeatured}
              onCheckedChange={setShowOnlyFeatured}
            />
            <Label htmlFor="only-featured" className="text-sm">
              {t('filters.onlyFeatured')}
            </Label>
          </div>

          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isFetching}>
              <RefreshCw className="mr-1 h-4 w-4" />
              {t('actions.refresh')}
            </Button>
            <Button size="sm" onClick={handleCreate}>
              <Plus className="mr-1 h-4 w-4" />
              {t('actions.create')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t('table.order')}</TableHead>
                <TableHead>{t('table.title')}</TableHead>
                <TableHead>{t('table.slug')}</TableHead>
                <TableHead>{t('table.module')}</TableHead>
                <TableHead className="w-20">{t('table.active')}</TableHead>
                <TableHead className="w-24">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {isFetching ? '...' : t('list.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                galleries.map((gallery) => (
                  <TableRow key={gallery.id}>
                    <TableCell className="text-muted-foreground">{gallery.display_order}</TableCell>
                    <TableCell className="font-medium">{gallery.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{gallery.slug}</TableCell>
                    <TableCell className="text-sm">{gallery.module_key || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${gallery.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(gallery)}>
                          {t('actions.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(gallery)}
                        >
                          {t('actions.delete')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
