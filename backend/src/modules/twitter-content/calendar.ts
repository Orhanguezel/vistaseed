// src/modules/twitter-content/calendar.ts
// Milli gün + sektör fuarı takvimi (event slotu bu listeden beslenir)

import { berlinParts } from './time';

export interface TwitterCalendarEvent {
  key: string;
  title: string;
  kind: 'national_day' | 'industry_event';
  month: number;
  day: number;
  eventTag?: string;
  dayTag?: string;
  windowDays: number;
}

export const TWITTER_CALENDAR_EVENTS: TwitterCalendarEvent[] = [
  {
    key: '23-nisan',
    title: '23 Nisan Ulusal Egemenlik ve Cocuk Bayrami',
    kind: 'national_day',
    month: 4,
    day: 23,
    dayTag: '#23Nisan',
    windowDays: 0,
  },
  {
    key: '19-mayis',
    title: "19 Mayis Ataturk'u Anma, Genclik ve Spor Bayrami",
    kind: 'national_day',
    month: 5,
    day: 19,
    dayTag: '#19Mayis',
    windowDays: 0,
  },
  {
    key: '30-agustos',
    title: '30 Agustos Zafer Bayrami',
    kind: 'national_day',
    month: 8,
    day: 30,
    dayTag: '#30AgustosZaferBayrami',
    windowDays: 0,
  },
  {
    key: '29-ekim',
    title: '29 Ekim Cumhuriyet Bayrami',
    kind: 'national_day',
    month: 10,
    day: 29,
    dayTag: '#29EkimCumhuriyetBayrami',
    windowDays: 0,
  },
  {
    key: '14-mayis-ciftci',
    title: '14 Mayis Dunya Ciftciler Gunu',
    kind: 'national_day',
    month: 5,
    day: 14,
    dayTag: '#DünyaÇiftçilerGünü',
    windowDays: 0,
  },
  {
    key: 'fruitlogistica',
    title: 'Fruit Logistica',
    kind: 'industry_event',
    month: 2,
    day: 4,
    eventTag: '#FruitLogistica',
    windowDays: 5,
  },
  {
    key: 'isf-congress',
    title: 'ISF Dunya Tohum Kongresi',
    kind: 'industry_event',
    month: 5,
    day: 25,
    eventTag: '#ISF',
    windowDays: 5,
  },
  {
    key: 'growtech',
    title: 'Growtech Antalya Tarim Fuari',
    kind: 'industry_event',
    month: 11,
    day: 19,
    eventTag: '#Growtech',
    windowDays: 4,
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function utcDateOnly(year: number, month: number, day: number) {
  return Date.UTC(year, month - 1, day);
}

export function findTwitterCalendarEvent(date = new Date()): TwitterCalendarEvent | null {
  const parts = berlinParts(date);
  const today = utcDateOnly(parts.year, parts.month, parts.day);
  const matches = TWITTER_CALENDAR_EVENTS
    .map((event) => {
      const eventDay = utcDateOnly(parts.year, event.month, event.day);
      const diffDays = Math.round((today - eventDay) / DAY_MS);
      return { event, diffDays: Math.abs(diffDays) };
    })
    .filter(({ event, diffDays }) => diffDays <= event.windowDays)
    .sort((a, b) => a.diffDays - b.diffDays);
  return matches[0]?.event ?? null;
}
