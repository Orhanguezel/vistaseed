'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useCreateRedirectAdminMutation,
  useDeleteRedirectAdminMutation,
  useListRedirectsAdminQuery,
  useUpdateRedirectAdminMutation,
} from '@/integrations/hooks';
import { getErrorMessage, type RedirectDto, type RedirectType } from '@/integrations/shared';

export default function RedirectsPage() {
  const t = useAdminT('admin.redirects');
  const [q, setQ] = React.useState('');
  const { data: rows = [] } = useListRedirectsAdminQuery(q ? { q } : undefined);
  const [createRedirect, { isLoading: creating }] = useCreateRedirectAdminMutation();
  const [updateRedirect] = useUpdateRedirectAdminMutation();
  const [deleteRedirect] = useDeleteRedirectAdminMutation();

  const [source, setSource] = React.useState('');
  const [type, setType] = React.useState<RedirectType>('301');
  const [destination, setDestination] = React.useState('');
  const [note, setNote] = React.useState('');

  const handleAdd = async () => {
    if (!source.trim()) return;
    if (type === '301' && !destination.trim()) {
      toast.error(t('destRequired'));
      return;
    }
    try {
      await createRedirect({
        source_path: source.trim(),
        type,
        destination: type === '410' ? null : destination.trim(),
        note: note.trim() || null,
      }).unwrap();
      toast.success(t('created'));
      setSource('');
      setDestination('');
      setNote('');
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg.includes('source_path_exists') ? t('sourceExists') : `${t('failed')}: ${msg}`);
    }
  };

  const toggleActive = async (r: RedirectDto) => {
    try {
      await updateRedirect({ id: r.id, patch: { is_active: !r.is_active } }).unwrap();
    } catch (err) {
      toast.error(`${t('failed')}: ${getErrorMessage(err)}`);
    }
  };

  const handleDelete = async (r: RedirectDto) => {
    if (!window.confirm(t('deleteConfirm'))) return;
    try {
      await deleteRedirect(r.id).unwrap();
      toast.success(t('deleted'));
    } catch (err) {
      toast.error(`${t('failed')}: ${getErrorMessage(err)}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
          <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
            <li>{t('intro301')}</li>
            <li>{t('intro410')}</li>
          </ul>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">{t('addTitle')}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-[1fr_110px_1fr_1fr_auto]">
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder={t('sourcePlaceholder')} className="h-9" />
            <Select value={type} onValueChange={(v) => setType(v as RedirectType)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="301">301</SelectItem>
                <SelectItem value="410">410</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t('destinationPlaceholder')}
              disabled={type === '410'}
              className="h-9"
            />
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('notePlaceholder')} className="h-9" />
            <Button size="sm" className="h-9" onClick={handleAdd} disabled={creating || !source.trim()}>
              <Plus className="mr-1 h-4 w-4" />{creating ? t('adding') : t('add')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} className="h-9 max-w-sm" />
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t('empty')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-border border-b text-left text-muted-foreground text-xs">
                    <th className="py-2 pr-3">{t('sourcePath')}</th>
                    <th className="py-2 pr-3">{t('type')}</th>
                    <th className="py-2 pr-3">{t('destination')}</th>
                    <th className="py-2 pr-3">{t('hits')}</th>
                    <th className="py-2 pr-3">{t('active')}</th>
                    <th className="py-2 text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-border/60 border-b">
                      <td className="py-2 pr-3 font-medium">{r.source_path}</td>
                      <td className="py-2 pr-3"><Badge variant={r.type === '410' ? 'destructive' : 'default'}>{r.type}</Badge></td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.destination ?? '—'}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.hits}</td>
                      <td className="py-2 pr-3"><Switch checked={r.is_active} onCheckedChange={() => toggleActive(r)} /></td>
                      <td className="py-2 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(r)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
