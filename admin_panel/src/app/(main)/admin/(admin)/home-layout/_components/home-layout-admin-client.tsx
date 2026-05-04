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
  Plus,
  RefreshCcw,
  Save,
  Trash2,
} from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateHomeSectionAdminMutation,
  useDeleteHomeSectionAdminMutation,
  useListHomeSectionsAdminQuery,
  useReorderHomeSectionsAdminMutation,
  useUpdateHomeSectionAdminMutation,
} from '@/integrations/hooks';
import {
  HOME_LAYOUT_COMPONENT_OPTIONS,
  type HomeSectionDto,
} from '@/integrations/shared';

interface RowProps {
  section: HomeSectionDto;
  expanded: boolean;
  onToggleExpand: () => void;
  onPatch: (patch: Partial<HomeSectionDto>) => void;
  onDelete: () => void;
  saving: boolean;
  t: ReturnType<typeof useAdminT>;
}

function SortableRow({ section, expanded, onToggleExpand, onPatch, onDelete, saving, t }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const [configText, setConfigText] = React.useState(() =>
    JSON.stringify(section.config ?? {}, null, 2),
  );
  const [configError, setConfigError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setConfigText(JSON.stringify(section.config ?? {}, null, 2));
  }, [section.config]);

  const handleConfigSave = () => {
    try {
      const parsed = configText.trim() ? JSON.parse(configText) : null;
      setConfigError(null);
      onPatch({ config: parsed });
    } catch {
      setConfigError(t('messages.invalidJson'));
    }
  };

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
          aria-label={expanded ? t('actions.collapse') : t('actions.expand')}
        >
          {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium truncate">{section.label}</span>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
              {section.component_key}
            </Badge>
            <code className="text-[10px] text-muted-foreground/70 font-mono">{section.slug}</code>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {t('table.order')}: {section.order_index}
          </div>
        </div>

        <Switch
          checked={!!section.is_active}
          onCheckedChange={(checked) => onPatch({ is_active: checked ? 1 : 0 })}
          disabled={saving}
        />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-10">
          {section.is_active ? t('table.active') : t('table.passive')}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={saving}
          className="text-destructive hover:text-destructive size-8 p-0"
          title={t('actions.delete')}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-2 border-t space-y-3 bg-muted/20">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('form.labelAdmin')}
              </Label>
              <Input
                defaultValue={section.label}
                onBlur={(e) => e.target.value !== section.label && onPatch({ label: e.target.value })}
                disabled={saving}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('form.component')}
              </Label>
              <select
                defaultValue={section.component_key}
                onBlur={(e) =>
                  e.target.value !== section.component_key &&
                  onPatch({ component_key: e.target.value })
                }
                disabled={saving}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                {HOME_LAYOUT_COMPONENT_OPTIONS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('form.configJson')}
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleConfigSave}
                disabled={saving}
                className="h-7 text-[10px] uppercase tracking-widest"
              >
                <Save className="size-3 mr-1" />
                {t('actions.configSave')}
              </Button>
            </div>
            <Textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              rows={5}
              className="font-mono text-xs"
              disabled={saving}
            />
            {configError && <p className="text-[11px] text-destructive">{configError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomeLayoutAdminClient() {
  const t = useAdminT('admin.home-layout');
  const { data, isLoading, isFetching, refetch } = useListHomeSectionsAdminQuery();
  const [updateSection, { isLoading: isUpdating }] = useUpdateHomeSectionAdminMutation();
  const [reorderSections, { isLoading: isReordering }] = useReorderHomeSectionsAdminMutation();
  const [deleteSection, { isLoading: isDeleting }] = useDeleteHomeSectionAdminMutation();
  const [createSection, { isLoading: isCreating }] = useCreateHomeSectionAdminMutation();

  const [items, setItems] = React.useState<HomeSectionDto[]>([]);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [showNew, setShowNew] = React.useState(false);
  const [newRow, setNewRow] = React.useState({
    slug: '',
    label: '',
    component_key: HOME_LAYOUT_COMPONENT_OPTIONS[0].key as string,
  });

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
      order_index: (i + 1) * 10,
    }));
    setItems(reordered);

    try {
      await reorderSections({
        items: reordered.map((s) => ({ id: s.id, order_index: s.order_index })),
      }).unwrap();
      toast.success(t('messages.reorderSaved'));
    } catch {
      toast.error(t('messages.reorderFailed'));
      refetch();
    }
  };

  const patchRow = async (id: string, patch: Partial<HomeSectionDto>) => {
    try {
      await updateSection({ id, patch }).unwrap();
      toast.success(t('messages.saved'));
    } catch {
      toast.error(t('messages.saveFailed'));
    }
  };

  const deleteRow = async (id: string, label: string) => {
    if (!confirm(t('messages.deleteConfirm', { label }))) return;
    try {
      await deleteSection(id).unwrap();
      toast.success(t('messages.deleteSaved'));
    } catch {
      toast.error(t('messages.deleteFailed'));
    }
  };

  const handleCreate = async () => {
    if (!newRow.slug || !newRow.label) {
      toast.error(t('messages.slugRequired'));
      return;
    }
    try {
      const maxOrder = Math.max(0, ...items.map((s) => s.order_index));
      await createSection({
        slug: newRow.slug,
        label: newRow.label,
        component_key: newRow.component_key,
        order_index: maxOrder + 10,
        is_active: 1,
        config: null,
      }).unwrap();
      toast.success(t('messages.createSaved'));
      setShowNew(false);
      setNewRow({ slug: '', label: '', component_key: HOME_LAYOUT_COMPONENT_OPTIONS[0].key });
    } catch (e) {
      const msg =
        (e as { data?: { message?: string } })?.data?.message === 'duplicate_slug'
          ? t('messages.duplicateSlug')
          : t('messages.createFailed');
      toast.error(msg);
    }
  };

  const busy = isLoading || isFetching || isUpdating || isReordering || isDeleting || isCreating;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
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
          <div className="px-6 pb-4 border-b grid gap-3 md:grid-cols-4">
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('form.slug')}
              </Label>
              <Input
                value={newRow.slug}
                onChange={(e) =>
                  setNewRow({
                    ...newRow,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                  })
                }
                placeholder={t('form.slugPlaceholder')}
                className="h-9 mt-1"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('table.label')}
              </Label>
              <Input
                value={newRow.label}
                onChange={(e) => setNewRow({ ...newRow, label: e.target.value })}
                placeholder={t('form.labelPlaceholder')}
                className="h-9 mt-1"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('form.component')}
              </Label>
              <select
                value={newRow.component_key}
                onChange={(e) => setNewRow({ ...newRow, component_key: e.target.value })}
                className="h-9 mt-1 w-full rounded-md border bg-background px-3 text-sm"
              >
                {HOME_LAYOUT_COMPONENT_OPTIONS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
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
                      section={s}
                      expanded={expandedId === s.id}
                      onToggleExpand={() => setExpandedId(expandedId === s.id ? null : s.id)}
                      onPatch={(patch) => patchRow(s.id, patch)}
                      onDelete={() => deleteRow(s.id, s.label)}
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
