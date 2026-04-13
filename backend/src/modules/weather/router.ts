import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { env } from '@/core/env';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

type FrostRisk = 'safe' | 'watch' | 'warning' | 'danger';

interface DayForecast {
  date: string;
  min_temp: number;
  max_temp: number;
  precipitation_mm: number;
  frost_risk: FrostRisk;
}

interface FrostResponse {
  location: string;
  current_temp: number | null;
  updated_at: string;
  forecast: DayForecast[];
  overall_risk: FrostRisk;
}

// ──────────────────────────────────────────────
// Cache (30 dk TTL)
// ──────────────────────────────────────────────

let cachedData: FrostResponse | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 30 * 60 * 1000;

// ──────────────────────────────────────────────
// Frost risk calculation
// ──────────────────────────────────────────────

function calcFrostRisk(minTemp: number): FrostRisk {
  if (minTemp < 0) return 'danger';
  if (minTemp < 2) return 'warning';
  if (minTemp < 5) return 'watch';
  return 'safe';
}

function worstRisk(risks: FrostRisk[]): FrostRisk {
  const order: FrostRisk[] = ['safe', 'watch', 'warning', 'danger'];
  return risks.reduce((worst, r) => {
    return order.indexOf(r) > order.indexOf(worst) ? r : worst;
  }, 'safe' as FrostRisk);
}

// ──────────────────────────────────────────────
// Open-Meteo fetch (ücretsiz, API key gerektirmez)
// ──────────────────────────────────────────────

async function fetchFrostData(): Promise<FrostResponse> {
  const lat = env.WEATHER_LAT;
  const lon = env.WEATHER_LON;
  const locationName = env.WEATHER_LOCATION_NAME;

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('current', 'temperature_2m');
  url.searchParams.set('daily', 'temperature_2m_min,temperature_2m_max,precipitation_sum');
  url.searchParams.set('timezone', env.WEATHER_TIMEZONE);
  url.searchParams.set('forecast_days', '4');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'vistaseeds-weather/1.0' },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status}`);
  }

  const data = (await res.json()) as {
    current?: { temperature_2m?: number };
    daily?: {
      time?: string[];
      temperature_2m_min?: number[];
      temperature_2m_max?: number[];
      precipitation_sum?: number[];
    };
  };

  const current_temp = data.current?.temperature_2m ?? null;
  const times = data.daily?.time ?? [];
  const mins = data.daily?.temperature_2m_min ?? [];
  const maxs = data.daily?.temperature_2m_max ?? [];
  const precips = data.daily?.precipitation_sum ?? [];

  const forecast: DayForecast[] = times.map((date, i) => {
    const min_temp = Math.round((mins[i] ?? 20) * 10) / 10;
    const max_temp = Math.round((maxs[i] ?? 25) * 10) / 10;
    const precipitation_mm = Math.round((precips[i] ?? 0) * 10) / 10;
    return { date, min_temp, max_temp, precipitation_mm, frost_risk: calcFrostRisk(min_temp) };
  });

  const overall_risk = worstRisk(forecast.slice(0, 3).map((d) => d.frost_risk));

  return {
    location: locationName,
    current_temp: current_temp !== null ? Math.round(current_temp * 10) / 10 : null,
    updated_at: new Date().toISOString(),
    forecast,
    overall_risk,
  };
}

// ──────────────────────────────────────────────
// Handler
// ──────────────────────────────────────────────

async function frostHandler(_req: FastifyRequest, reply: FastifyReply) {
  const now = Date.now();

  if (cachedData && now < cacheExpiresAt) {
    return reply
      .header('Cache-Control', 'public, max-age=1800')
      .header('X-Cache', 'HIT')
      .send({ success: true, data: cachedData });
  }

  const data = await fetchFrostData();
  cachedData = data;
  cacheExpiresAt = now + CACHE_TTL_MS;

  return reply
    .header('Cache-Control', 'public, max-age=1800')
    .header('X-Cache', 'MISS')
    .send({ success: true, data });
}

// ──────────────────────────────────────────────
// Register
// ──────────────────────────────────────────────

export async function registerWeather(app: FastifyInstance) {
  app.get('/weather/frost', { config: { public: true } }, frostHandler);
}
