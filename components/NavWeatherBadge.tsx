"use client";

import { useEffect, useMemo, useState } from "react";
import { CloudSun, Flame, Snowflake, Sun } from "lucide-react";
import { fetchJson } from "@/lib/fetchJson";
import { NAV_WEATHER_COPY } from "@/lib/copy/weather";

type WeatherResult = {
  temperatureC: number;
  weatherCode?: number;
};

function TempIcon({ temp }: { temp: number }) {
  if (temp <= 6) return <Snowflake className="h-4 w-4" aria-hidden="true" />;
  if (temp <= 18) return <CloudSun className="h-4 w-4" aria-hidden="true" />;
  if (temp <= 30) return <Sun className="h-4 w-4" aria-hidden="true" />;
  return <Flame className="h-4 w-4" aria-hidden="true" />;
}

export function NavWeatherBadge() {
  const [weather, setWeather] = useState<WeatherResult | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const data = await fetchJson<WeatherResult>(
          `/api/weather?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`
        );

        if (cancelled) return;
        if (data && typeof data.temperatureC === "number") setWeather(data);
      },
      () => {
        // Permission denied or unavailable: show nothing.
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const view = useMemo(() => {
    if (!weather) return null;
    const temp = Math.round(weather.temperatureC);
    return { temp, caption: NAV_WEATHER_COPY.describeTemp(temp) };
  }, [weather]);

  if (!view) return null;

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-2.5 py-1.5 text-xs backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60"
      title={view.caption}
    >
      <span
        aria-hidden="true"
        className="grid h-6 w-6 place-items-center rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgb(var(--app-primary) / 0.35), rgb(var(--app-primary) / 0.12) 55%, transparent 70%)",
        }}
      >
        <span style={{ color: "rgb(var(--app-primary))" }}>
          <TempIcon temp={view.temp} />
        </span>
      </span>

      <span className="inline-flex items-baseline gap-1">
        <span className="text-sm font-semibold" style={{ color: "rgb(var(--app-primary))" }}>
          {view.temp}°
        </span>
        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
          {NAV_WEATHER_COPY.temperatureUnit}
        </span>
      </span>

      <span className="hidden whitespace-nowrap text-[11px] font-medium text-zinc-600 dark:text-zinc-400 sm:inline">
        {view.caption}
      </span>
    </div>
  );
}
