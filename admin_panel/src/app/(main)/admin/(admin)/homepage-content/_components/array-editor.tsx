'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function moveItem<T>(arr: T[], idx: number, dir: -1 | 1): T[] {
  const next = [...arr];
  const target = idx + dir;
  if (target < 0 || target >= next.length) return next;
  [next[idx], next[target]] = [next[target], next[idx]];
  return next;
}

export interface ArrayEditorField<T> {
  key: keyof T;
  label: string;
  type?: 'input' | 'textarea';
}

export function ArrayEditor<T extends Record<string, string>>({
  items,
  onChange,
  fields,
  addLabel,
  emptyItem,
  saving,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  fields: ArrayEditorField<T>[];
  addLabel: string;
  emptyItem: T;
  saving: boolean;
}) {
  const t = useAdminT('admin.homepage-content');
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="border rounded-lg p-3 space-y-2 bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              #{idx + 1}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChange(moveItem(items, idx, -1))}
                disabled={saving || idx === 0}
                className="size-7 p-0"
              >
                <ArrowUp className="size-3.5" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChange(moveItem(items, idx, 1))}
                disabled={saving || idx === items.length - 1}
                className="size-7 p-0"
              >
                <ArrowDown className="size-3.5" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                disabled={saving}
                className="size-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {fields.map((f) => (
              <div key={String(f.key)} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {f.label}
                </Label>
                {f.type === 'textarea' ? (
                  <Textarea
                    value={(item[f.key] ?? '') as string}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], [f.key]: e.target.value };
                      onChange(next);
                    }}
                    rows={2}
                    className="mt-1 text-sm"
                    disabled={saving}
                  />
                ) : (
                  <Input
                    value={(item[f.key] ?? '') as string}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], [f.key]: e.target.value };
                      onChange(next);
                    }}
                    className="h-9 mt-1"
                    disabled={saving}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { ...emptyItem }])}
        disabled={saving}
      >
        <Plus className="size-3.5 mr-2" />
        {addLabel}
      </Button>
      {items.length === 0 && (
        <p className="text-[11px] text-muted-foreground">{t('messages.emptyArray')}</p>
      )}
    </div>
  );
}
