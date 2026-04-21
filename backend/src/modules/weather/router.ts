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

async function fetchFrostData(lat?: number, lon?: number, name?: string): Promise<FrostResponse> {
  const targetLat = lat ?? env.WEATHER_LAT;
  const targetLon = lon ?? env.WEATHER_LON;
  const locationName = name ?? (lat ? 'Detected Location' : env.WEATHER_LOCATION_NAME);

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(targetLat));
  url.searchParams.set('longitude', String(targetLon));
  url.searchParams.set('current', 'temperature_2m');
  url.searchParams.set('daily', 'temperature_2m_min,temperature_2m_max,precipitation_sum');
  url.searchParams.set('timezone', env.WEATHER_TIMEZONE);
  url.searchParams.set('forecast_days', '4');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'vistaseeds-weather/1.0' },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status}`);
  }

  const data = (await res.json()) as any;

  const current_temp = data.current?.temperature_2m ?? null;
  const times = data.daily?.time ?? [];
  const mins = data.daily?.temperature_2m_min ?? [];
  const maxs = data.daily?.temperature_2m_max ?? [];
  const precips = data.daily?.precipitation_sum ?? [];

  const forecast: DayForecast[] = times.map((date: string, i: number) => {
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

async function frostHandler(req: FastifyRequest, reply: FastifyReply) {
  const query = req.query as { lat?: string; lon?: string };
  const lat = query.lat ? parseFloat(query.lat) : undefined;
  const lon = query.lon ? parseFloat(query.lon) : undefined;

  // Use global cache ONLY for the default location (Antalya)
  const isDefault = !lat && !lon;
  const now = Date.now();

  if (isDefault && cachedData && now < cacheExpiresAt) {
    return reply
      .header('Cache-Control', 'public, max-age=1800')
      .header('X-Cache', 'HIT')
      .send({ success: true, data: cachedData });
  }

  try {
    const data = await fetchFrostData(lat, lon);
    
    if (isDefault) {
      cachedData = data;
      cacheExpiresAt = now + CACHE_TTL_MS;
    }

    return reply
      .header('Cache-Control', 'public, max-age=1800')
      .header('X-Cache', 'MISS')
      .send({ success: true, data });
  } catch (err: any) {
    req.log.error(err);
    return reply.status(500).send({ success: false, error: 'Weather fetch failed' });
  }
}

// ──────────────────────────────────────────────
// Register
// ──────────────────────────────────────────────

export async function registerWeather(app: FastifyInstance) {
  app.get('/weather/frost', { config: { public: true } }, frostHandler);
}
