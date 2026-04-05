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
  useListLibraryAdminQuery,
  useDeleteLibraryAdminMutation,
} from '@/integrations/hooks';
import {
  buildLibraryListQueryParams,
  buildLibraryToastMessage,
  LIBRARY_DEFAULT_LOCALE,
  type LibraryDto,
} from '@/integrations/shared';

export default function LibraryListPanel() {
  const t = useAdminT('admin.library');
  const router = useRouter();

  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();

  const [search, setSearch] = React.useState('');
  const [locale, setLocale] = React.useState('');
  const [showOnlyPublished, setShowOnlyPublished] = React.useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = React.useState(false);

  React.useEffect(() => {
    setLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || LIBRARY_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const queryParams = React.useMemo(
    () =>
      buildLibraryListQueryParams({
        search,
        locale,
        isPublished: showOnlyPublished,
        isFeatured: showOnlyFeatured,
      }),
    [search, locale, showOnlyPublished, showOnlyFeatured],
  );

  const { data: items = [], isFetching, refetch } = useListLibraryAdminQuery(
    queryParams,
    { refetchOnMountOrArgChange: true } as any,
  );

  const [deleteItem] = useDeleteLibraryAdminMutation();

  const handleRefresh = () => {
    toast.info(t('list.refreshing'));
    refetch();
  };

  const handleCreate = () => {
    router.push('/admin/library/new');
  };

  const handleEdit = (item: LibraryDto) => {
    router.push(`/admin/library/${item.id}`);
  };

  const handleDelete = async (item: LibraryDto) => {
    if (!confirm(t('messages.confirmDelete', { title: item.name }))) return;
    try {
      await deleteItem(item.id).unwrap();
      toast.success(buildLibraryToastMessage(item.name, t('messages.deleted')));
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
              id="only-published"
              checked={showOnlyPublished}
              onCheckedChange={setShowOnlyPublished}
            />
            <Label htmlFor="only-published" className="text-sm">
              {t('filters.onlyPublished')}
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
                <TableHead className="w-16">{t('table.image')}</TableHead>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.slug')}</TableHead>
                <TableHead>{t('table.type')}</TableHead>
                <TableHead>{t('table.category')}</TableHead>
                <TableHead className="w-20">{t('table.published')}</TableHead>
                <TableHead className="w-16">{t('table.views')}</TableHead>
                <TableHead className="w-20">{t('table.downloads')}</TableHead>
                <TableHead className="w-24">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    {isFetching ? '...' : t('list.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-muted-foreground">{item.display_order}</TableCell>
                    <TableCell>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.image_alt || item.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.slug}</TableCell>
                    <TableCell className="text-sm">{item.type || '-'}</TableCell>
                    <TableCell className="text-sm">{item.category?.name || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${item.is_published ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.views ?? 0}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.download_count ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          {t('actions.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(item)}
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
