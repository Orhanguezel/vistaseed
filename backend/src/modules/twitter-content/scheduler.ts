// src/modules/twitter-content/scheduler.ts
// 5 dakikalık tick: günlük kuyruk kurulumu + çok-platformlu dispatcher.
// İçerik kurulumu twitter_enabled'a bağlı; dispatch her aktif platformu işler.

import {
  getTwitterSettings,
  processSocialQueueOnce,
  repoGetTwitterSettingsMap,
  repoSetTwitterSetting,
} from '@agro/shared-backend/modules/twitter';

import { env } from '@/core/env';
import { buildTwitterQueueForToday } from './planner';
import { berlinParts, todayISO } from './time';

const TICK_MS = 5 * 60_000;
const BUILD_AFTER_HOUR = 6; // Berlin 06:00'dan önce günlük plan kurulmaz
const BUILT_FOR_KEY = 'twitter_queue_built_for';

let timer: ReturnType<typeof setInterval> | null = null;
let running = false;

async function buildIfNeeded(now: Date): Promise<void> {
  if (berlinParts(now).hour < BUILD_AFTER_HOUR) return;

  const today = todayISO(now);
  const map = await repoGetTwitterSettingsMap([BUILT_FOR_KEY]);
  if (map.get(BUILT_FOR_KEY) === today) return;

  const queued = await buildTwitterQueueForToday(env.FRONTEND_URL, now);
  await repoSetTwitterSetting(BUILT_FOR_KEY, today);
  if (queued.length) console.log(`[twitter-content] kuyruga eklendi: ${queued.join(', ')}`);
}

async function tick(): Promise<void> {
  if (running) return;
  running = true;
  try {
    const now = new Date();

    // İçerik motoru (X şablonları) twitter_enabled anahtarına bağlı
    const settings = await getTwitterSettings();
    if (settings.enabled) await buildIfNeeded(now);

    // Dispatcher tüm aktif platformların kuyruğunu işler (FB/IG/LinkedIn dahil)
    const result = await processSocialQueueOnce();
    if (result.processed) {
      console.log(`[twitter-content] dispatch platform=${result.platform} id=${result.id} status=${result.status}`);
    }
  } catch (err) {
    console.error('[twitter-content] tick hatasi', err);
  } finally {
    running = false;
  }
}

export function startTwitterContentScheduler(): void {
  if (timer) return;
  timer = setInterval(() => void tick(), TICK_MS);
  void tick();
  console.log('[twitter-content] scheduler basladi (5dk tick, Çar/Per/Cuma 17:00 TR strateji slotu)');
}

export function stopTwitterContentScheduler(): void {
  if (timer) clearInterval(timer);
  timer = null;
}
