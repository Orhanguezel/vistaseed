'use client';

import { useEffect, useState } from 'react';
import { WeatherWidget } from '@agro/ecosystem-weather-widget';

const WEATHER_WIDGET_API_BASE = process.env.NEXT_PUBLIC_WEATHER_WIDGET_API_BASE ?? '/weather-widget-api';

async function requestBrowserLocation(): Promise<{ lat: number; lon: number } | null> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 6000 },
    );
  });
}

export default function FrostWarningWidgetClient() {
  const [open, setOpen] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTemperature() {
      try {
        const browserCoords = await requestBrowserLocation();
        if (cancelled) return;

        if (browserCoords) {
          setCoords(browserCoords);
        }

        const params = new URLSearchParams();
        if (browserCoords) {
          params.set('lat', String(browserCoords.lat));
          params.set('lon', String(browserCoords.lon));
        } else {
          params.set('location', 'antalya');
        }

        const res = await fetch(`${WEATHER_WIDGET_API_BASE}/weather/widget-data?${params.toString()}`, {
          method: 'GET',
          cache: 'no-store',
        });
        if (!res.ok) return;
        const json = (await res.json()) as { data?: { current?: { temp?: number } } };
        const temp = json.data?.current?.temp;
        if (!cancelled && typeof temp === 'number') {
          setTemperature(Math.round(temp));
        }
      } catch {}
    }

    void loadTemperature();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-4 z-[8900] flex flex-col items-start gap-2">
      {open && (
        <div className="shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <WeatherWidget
            brand="vistaseed"
            location="auto"
            apiBase={WEATHER_WIDGET_API_BASE}
            lat={coords?.lat}
            lon={coords?.lon}
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Hava durumu"
        className="flex min-w-[128px] items-center justify-between gap-3 rounded-full border border-emerald-700/30 bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
      >
        <span className="flex flex-col items-start leading-none">
          <span>Hava</span>
          <span className="mt-1 text-[10px] font-medium text-white/75">Durumu</span>
        </span>
        {temperature !== null && (
          <span className="text-lg font-black leading-none">{temperature}°</span>
        )}
        <span className="text-white/70">{open ? '-' : '+'}</span>
      </button>
    </div>
  );
}
