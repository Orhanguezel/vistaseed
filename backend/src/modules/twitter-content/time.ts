// src/modules/twitter-content/time.ts
// Berlin saat dilimi yardımcıları (slot zamanlama sosyal platformla birebir)

const TIME_ZONE = 'Europe/Berlin';

export function berlinParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour === '24' ? 0 : values.hour),
    minute: Number(values.minute),
  };
}

export function todayISO(date = new Date()) {
  const p = berlinParts(date);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

function getTimeZoneOffsetMinutes(date: Date) {
  const value =
    new Intl.DateTimeFormat('en', { timeZone: TIME_ZONE, timeZoneName: 'shortOffset' })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value || 'GMT+0';
  const match = value.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] || 0));
}

/** Bugünün Berlin HH:MM anını UTC Date olarak döner. */
export function toBerlinSlotUtc(hour: number, minute: number, now = new Date()) {
  const parts = berlinParts(now);
  const guess = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, hour, minute, 0));
  const offset = getTimeZoneOffsetMinutes(guess);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, hour, minute, 0) - offset * 60_000);
}

export function isoWeek(date = new Date()) {
  const p = berlinParts(date);
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
