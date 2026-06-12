// src/modules/twitter-content/plan-source.ts
// İçerik planları DB'den (social_content_plans, seed: 182-185) okunur.
// Mod: satır sayısı > farklı gün sayısı → döngü (X stratejisi);
//      her satır ayrı günde → haftalık sabit takvim (FB/IG/LinkedIn).

import {
  repoListContentPlans,
  type ContentPlanRow,
  type SocialPlatform,
} from '@agro/shared-backend/modules/twitter';

import { todayTurkeyISO, turkeyDayOfWeek } from './time';

export type PlanSlot = {
  key: string;
  dayOfWeek: number;
  hour: number;
  minute: number;
  template: string;
  pillar: string;
  topic: string;
  preferredProduct?: string;
  postFormat: string;
  mediaRequired: boolean;
};

const CYCLE_ANCHOR_DATE = '2026-06-10'; // X stratejisinin 1. maddesi (Çarşamba)

function toSlot(row: ContentPlanRow): PlanSlot {
  return {
    key: row.slot_key,
    dayOfWeek: Number(row.day_of_week),
    hour: Number(row.hour),
    minute: Number(row.minute),
    template: row.template,
    pillar: row.pillar ?? '',
    topic: row.topic ?? '',
    preferredProduct: row.preferred_product ?? undefined,
    postFormat: row.post_format ?? 'post',
    mediaRequired: Number(row.media_required) === 1,
  };
}

function utcDateFromISO(dateISO: string) {
  const [year, month, day] = dateISO.split('-').map(Number);
  return new Date(Date.UTC(year || 1970, (month || 1) - 1, day || 1));
}

/** ISO 1-7 gün numarasını JS getUTCDay (0-6) ile eşler. */
function matchesIsoDay(jsUtcDay: number, isoDays: Set<number>): boolean {
  const iso = jsUtcDay === 0 ? 7 : jsUtcDay;
  return isoDays.has(iso);
}

function cycleSlotForToday(slots: PlanSlot[], now: Date): PlanSlot | null {
  const isoDays = new Set(slots.map((slot) => slot.dayOfWeek));
  if (!isoDays.has(turkeyDayOfWeek(now))) return null;

  const start = utcDateFromISO(CYCLE_ANCHOR_DATE);
  const end = utcDateFromISO(todayTurkeyISO(now));
  if (end.getTime() < start.getTime()) return null;

  let publishIndex = -1;
  for (let cursor = new Date(start); cursor.getTime() <= end.getTime(); cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    if (matchesIsoDay(cursor.getUTCDay(), isoDays)) publishIndex += 1;
  }
  if (publishIndex < 0) return null;
  return slots[publishIndex % slots.length] ?? null;
}

/** Platformun TÜM aktif plan slotları (önizleme/paneller için). */
export async function loadPlanSlots(platform: SocialPlatform): Promise<PlanSlot[]> {
  const rows = await repoListContentPlans(platform);
  return rows.map(toSlot);
}

/** Platformun bugün yayınlanacak slotları. */
export async function loadTodaysSlots(platform: SocialPlatform, now: Date): Promise<PlanSlot[]> {
  const rows = await repoListContentPlans(platform);
  if (!rows.length) return [];

  const slots = rows.map(toSlot);
  const distinctDays = new Set(slots.map((slot) => slot.dayOfWeek)).size;

  if (slots.length > distinctDays) {
    const slot = cycleSlotForToday(slots, now);
    return slot ? [slot] : [];
  }

  const today = turkeyDayOfWeek(now);
  return slots.filter((slot) => slot.dayOfWeek === today);
}
