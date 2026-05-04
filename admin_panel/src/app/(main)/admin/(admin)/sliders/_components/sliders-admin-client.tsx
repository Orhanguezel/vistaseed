'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  ImageIcon,
  Plus,
  RefreshCcw,
  Save,
  Star,
  Trash2,
} from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { AdminLocaleSelect } from '@/components/common/admin-locale-select';
import { useAdminLocales } from '@/components/common/use-admin-locales';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { resolveMediaUrl } from '@/lib/media-url';
import {
  useAdminCreateSlideMutation,
  useAdminDeleteSlideMutation,
  useAdminListSlidesQuery,
  useAdminReorderSlidesMutation,
  useAdminSetSlideStatusMutation,
  useAdminUpdateSlideMutation,
} from '@/integrations/hooks';
import type { SliderAdminView, SliderUpdatePayload } from '@/integrations/shared';

type RowProps = {
  row: SliderAdminView;
  expanded: boolean;
  onToggleExpand: () => void;
  onPatch: (patch: SliderUpdatePayload) => void;
  onDelete: () => void;
  onSetActive: (next: boolean) => void;
  saving: boolean;
  t: ReturnType<typeof useAdminT>;
};

function SortableRow({ row, expanded, onToggleExpand, onPatch, onDelete, onSetActive, saving, t }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const previewUrl = row.image_effective_url
    ? resolveMediaUrl(row.image_effective_url)
    : row.image_url
      ? resolveMediaUrl(row.image_url)
      : null;

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg bg-card overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
          aria-label="drag"
        >
          <GripVertical className="size-5" />
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          className="text-muted-foreground hover:text-foreground"
        >
          {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </button>

        <div className="relative size-12 rounded-md overflow-hidden border bg-muted shrink-0">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={row.alt ?? row.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              <ImageIcon className="size-5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium truncate">{row.name || `#${row.id}`}</span>
            <Badge variant="outline" className="text-[10px] uppercase">{row.locale}</Badge>
            {row.featured && (
              <Badge className="text-[10px] uppercase gap-1"><Star className="size-3" />{t('table.featured')}</Badge>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {t('table.order')}: {row.display_order} · slug: <code className="font-mono">{row.slug || '—'}</code>
          </div>
        </div>

        <Switch
          checked={row.is_active}
          onCheckedChange={onSetActive}
          disabled={saving}
        />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-10">
          {row.is_active ? t('table.active') : t('table.passive')}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={saving}
          className="text-destructive size-8 p-0"
          title={t('actions.delete')}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-2 border-t bg-muted/20">
          <SliderEditPanel row={row} onPatch={onPatch} saving={saving} t={t} />
        </div>
      )}
    </div>
  );
}

function SliderEditPanel({
  row,
  onPatch,
  saving,
  t,
}: {
  row: SliderAdminView;
  onPatch: (patch: SliderUpdatePayload) => void;
  saving: boolean;
  t: ReturnType<typeof useAdminT>;
}) {
  const [form, setForm] = React.useState({
    name: row.name ?? '',
    description: row.description ?? '',
    alt: row.alt ?? '',
    buttonText: row.buttonText ?? '',
    buttonLink: row.buttonLink ?? '',
    image_url: row.image_url ?? '',
    featured: row.featured,
  });

  React.useEffect(() => {
    setForm({
      name: row.name ?? '',
      description: row.description ?? '',
      alt: row.alt ?? '',
      buttonText: row.buttonText ?? '',
      buttonLink: row.buttonLink ?? '',
      image_url: row.image_url ?? '',
      featured: row.featured,
    });
  }, [row]);

  const handleSave = () => {
    onPatch({
      name: form.name,
      description: form.description || null,
      alt: form.alt || null,
      buttonText: form.buttonText || null,
      buttonLink: form.buttonLink || null,
      image_url: form.image_url || null,
      featured: form.featured,
    });
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t('form.name')}
          </Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={saving}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t('form.alt')}
          </Label>
          <Input
            value={form.alt}
            onChange={(e) => setForm({ ...form, alt: e.target.value })}
            placeholder={t('form.altPlaceholder')}
            disabled={saving}
            className="h-9"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {t('form.description')}
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          disabled={saving}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t('form.buttonText')}
          </Label>
          <Input
            value={form.buttonText}
            onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
            placeholder={t('form.buttonTextPlaceholder')}
            disabled={saving}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t('form.buttonLink')}
          </Label>
          <Input
            value={form.buttonLink}
            onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
            placeholder={t('form.buttonLinkPlaceholder')}
            disabled={saving}
            className="h-9"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {t('form.imageUrl')}
        </Label>
        <Input
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          placeholder={t('form.imageUrlPlaceholder')}
          disabled={saving}
          className="h-9 font-mono text-xs"
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <Switch
            checked={form.featured}
            onCheckedChange={(v) => setForm({ ...form, featured: v })}
            disabled={saving}
          />
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {t('form.featured')}
          </span>
        </label>

        <Button type="button" onClick={handleSave} disabled={saving} size="sm">
          <Save className="size-3.5 mr-2" />
          {t('actions.save')}
        </Button>
      </div>
    </div>
  );
}

export default function SlidersAdminClient() {
  const t = useAdminT('admin.slider');
  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();

  const [locale, setLocale] = React.useState('');
  React.useEffect(() => {
    setLocale((prev) => coerceLocale(prev, defaultLocaleFromDb || 'tr'));
  }, [coerceLocale, defaultLocaleFromDb]);

  const { data, isLoading, isFetching, refetch } = useAdminListSlidesQuery(
    locale ? { locale } : undefined,
  );
  const [updateSlide, { isLoading: isUpdating }] = useAdminUpdateSlideMutation();
  const [reorderSlides, { isLoading: isReordering }] = useAdminReorderSlidesMutation();
  const [deleteSlide, { isLoading: isDeleting }] = useAdminDeleteSlideMutation();
  const [createSlide, { isLoading: isCreating }] = useAdminCreateSlideMutation();
  const [setStatus] = useAdminSetSlideStatusMutation();

  const [items, setItems] = React.useState<SliderAdminView[]>([]);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [showNew, setShowNew] = React.useState(false);
  const [newRow, setNewRow] = React.useState({ name: '', image_url: '' });

  React.useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((s) => s.id === active.id);
    const newIdx = items.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(items, oldIdx, newIdx).map((s, i) => ({
      ...s,
      display_order: (i + 1) * 10,
    }));
    setItems(reordered);

    try {
      await reorderSlides({ ids: reordered.map((s) => Number(s.id)) }).unwrap();
      toast.success(t('messages.reorderSaved'));
    } catch {
      toast.error(t('messages.reorderFailed'));
      refetch();
    }
  };

  const patchRow = async (id: string, body: SliderUpdatePayload) => {
    try {
      await updateSlide({ id, body }).unwrap();
      toast.success(t('messages.saved'));
    } catch {
      toast.error(t('messages.saveFailed'));
    }
  };

  const setRowActive = async (id: string, next: boolean) => {
    try {
      await setStatus({ id, body: { is_active: next } }).unwrap();
      toast.success(t('messages.statusSaved'));
    } catch {
      toast.error(t('messages.statusFailed'));
    }
  };

  const deleteRow = async (id: string, name: string) => {
    if (!confirm(t('messages.deleteConfirm', { name: name || `#${id}` }))) return;
    try {
      await deleteSlide(id).unwrap();
      toast.success(t('messages.deleteSaved'));
    } catch {
      toast.error(t('messages.deleteFailed'));
    }
  };

  const handleCreate = async () => {
    if (!newRow.name) {
      toast.error(t('messages.nameRequired'));
      return;
    }
    try {
      const maxOrder = Math.max(0, ...items.map((s) => s.display_order));
      await createSlide({
        name: newRow.name,
        image_url: newRow.image_url || null,
        is_active: true,
        display_order: maxOrder + 10,
        locale: locale || 'tr',
      }).unwrap();
      toast.success(t('messages.createSaved'));
      setShowNew(false);
      setNewRow({ name: '', image_url: '' });
    } catch {
      toast.error(t('messages.createFailed'));
    }
  };

  const busy = isLoading || isFetching || isUpdating || isReordering || isDeleting || isCreating;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <AdminLocaleSelect
              value={locale}
              onChange={setLocale}
              options={localeOptions}
              className="w-32"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={busy}
            >
              <RefreshCcw className="size-3.5 mr-2" />
              {t('actions.refresh')}
            </Button>
            <Button type="button" size="sm" onClick={() => setShowNew((v) => !v)} disabled={busy}>
              <Plus className="size-3.5 mr-2" />
              {t('actions.create')}
            </Button>
          </div>
        </CardHeader>

        {showNew && (
          <div className="px-6 pb-4 border-b grid gap-3 md:grid-cols-3">
            <div className="md:col-span-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('form.name')}
              </Label>
              <Input
                value={newRow.name}
                onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
                placeholder={t('form.namePlaceholder')}
                className="h-9 mt-1"
              />
            </div>
            <div className="md:col-span-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('form.imageUrl')}
              </Label>
              <Input
                value={newRow.image_url}
                onChange={(e) => setNewRow({ ...newRow, image_url: e.target.value })}
                placeholder={t('form.imageUrlPlaceholder')}
                className="h-9 mt-1 font-mono text-xs"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleCreate}
                disabled={busy}
                className="w-full h-9"
              >
                <Save className="size-3.5 mr-2" />
                {t('actions.save')}
              </Button>
            </div>
          </div>
        )}

        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">{t('messages.loading')}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{t('messages.empty')}</div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map((s) => (
                    <SortableRow
                      key={s.id}
                      row={s}
                      expanded={expandedId === s.id}
                      onToggleExpand={() => setExpandedId(expandedId === s.id ? null : s.id)}
                      onPatch={(patch) => patchRow(s.id, patch)}
                      onSetActive={(next) => setRowActive(s.id, next)}
                      onDelete={() => deleteRow(s.id, s.name)}
                      saving={busy}
                      t={t}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
