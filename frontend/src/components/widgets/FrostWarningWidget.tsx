'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Snowflake, Thermometer, ChevronUp, ChevronDown, MapPin, Droplets } from 'lucide-react';

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

interface FrostData {
  location: string;
  current_temp: number | null;
  updated_at: string;
  forecast: DayForecast[];
  overall_risk: FrostRisk;
}

// ──────────────────────────────────────────────
// Risk styling (theme tokens only — no hardcoded colors)
// ──────────────────────────────────────────────

const RISK_STYLES: Record<FrostRisk, { bg: string; text: string; border: string; dot: string }> = {
  safe:    { bg: 'bg-emerald-600/90',   text: 'text-white', border: 'border-emerald-500/50', dot: 'bg-emerald-400' },
  watch:   { bg: 'bg-amber-500/90',     text: 'text-white', border: 'border-amber-400/50',   dot: 'bg-amber-300'   },
  warning: { bg: 'bg-orange-600/90',    text: 'text-white', border: 'border-orange-500/50',  dot: 'bg-orange-300'  },
  danger:  { bg: 'bg-blue-900/95',      text: 'text-white', border: 'border-blue-400/50',    dot: 'bg-blue-300'    },
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function dayLabel(date: string, index: number, t: ReturnType<typeof useTranslations>): string {
  if (index === 0) return t('today');
  if (index === 1) return t('tomorrow');
  if (index === 2) return t('dayAfter');
  return date;
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8083').replace(/\/$/, '');
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

export function FrostWarningWidget() {
  const t = useTranslations('Frost');
  const [data, setData] = useState<FrostData | null>(null);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Get browser location for more accurate frost warning
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.warn('Geolocation failed:', err.message),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
      );
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      let url = `${BASE_URL}/api/v1/weather/frost`;
      if (coords) {
        url += `?lat=${coords.lat}&lon=${coords.lon}`;
      }
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const json = (await res.json()) as { success: boolean; data: FrostData };
      if (json.success && json.data) {
        setData(json.data);
        setError(false);
      }
    } catch {
      setError(true);
    }
  }, [coords]);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchData]);

  if (error || !data) return null;

  const risk = data.overall_risk;
  const styles = RISK_STYLES[risk];
  const todayForecast = data.forecast[0];

  return (
    <div className="fixed bottom-6 left-4 z-[8900] flex flex-col items-start">
      {/* ── Expanded panel ── */}
      {expanded && (
        <div
          className={`mb-2 w-[280px] rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${styles.bg} ${styles.border}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/15">
            <div className="flex items-center gap-2">
              <Snowflake size={16} className="opacity-80" />
              <span className={`text-sm font-bold uppercase tracking-wider ${styles.text}`}>
                {t('widgetTitle')}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full animate-pulse ${styles.dot}`} />
              <span className={`text-xs font-semibold ${styles.text}`}>{t(risk)}</span>
            </div>
          </div>

          {/* Risk description */}
          <div className={`px-4 py-2.5 text-xs leading-relaxed opacity-90 ${styles.text}`}>
            {t(`${risk}Desc`)}
          </div>

          {/* Current temp + location */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 opacity-75">
              <MapPin size={12} />
              <span className={`text-xs ${styles.text}`}>{data.location}</span>
            </div>
            {data.current_temp !== null && (
              <div className={`flex items-center gap-1 text-sm font-bold ${styles.text}`}>
                <Thermometer size={14} className="opacity-70" />
                {data.current_temp}°C
              </div>
            )}
          </div>

          {/* 3-day forecast */}
          <div className="border-t border-white/10 px-4 py-3 space-y-2">
            {data.forecast.slice(0, 3).map((day, i) => {
              const dayStyles = RISK_STYLES[day.frost_risk];
              return (
                <div key={day.date} className="flex items-center justify-between">
                  <span className={`text-xs w-20 ${styles.text} opacity-75`}>
                    {dayLabel(day.date, i, t)}
                  </span>
                  <div className="flex items-center gap-3">
                    {day.precipitation_mm > 0 && (
                      <div className={`flex items-center gap-0.5 text-xs opacity-60 ${styles.text}`}>
                        <Droplets size={10} />
                        {day.precipitation_mm}mm
                      </div>
                    )}
                    <span className={`text-xs ${styles.text} opacity-75`}>
                      {day.min_temp}° / {day.max_temp}°
                    </span>
                    <span className={`h-1.5 w-1.5 rounded-full ${dayStyles.dot}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className={`px-4 py-2 border-t border-white/10 text-[10px] flex justify-between items-center opacity-50 ${styles.text}`}>
            <span>{t('poweredBy')} · {formatTime(data.updated_at)}</span>
            <a 
              href="https://tarimiklim.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity underline decoration-white/20"
            >
              tarimiklim.com
            </a>
          </div>
        </div>
      )}

      {/* ── Compact trigger button ── */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        aria-label={t('widgetTitle')}
        className={`flex items-center gap-2 rounded-full px-3.5 py-2 shadow-lg backdrop-blur-md border transition-all hover:scale-105 active:scale-95 ${styles.bg} ${styles.border}`}
      >
        {risk === 'safe' ? (
          <Thermometer size={16} className={styles.text} />
        ) : (
          <Snowflake size={16} className={`${styles.text} ${risk === 'danger' ? 'animate-pulse' : ''}`} />
        )}
        <span className={`text-xs font-bold ${styles.text}`}>
          {todayForecast ? `${todayForecast.min_temp}°C` : '—'}
        </span>
        <span className={`text-xs opacity-75 ${styles.text}`}>{t(risk)}</span>
        {expanded ? (
          <ChevronDown size={14} className={`${styles.text} opacity-60`} />
        ) : (
          <ChevronUp size={14} className={`${styles.text} opacity-60`} />
        )}
      </button>
    </div>
  );
}
