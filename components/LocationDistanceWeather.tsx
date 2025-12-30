"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DISTANCE_WEATHER_COPY } from "@/lib/copy/weather";
import { fetchJson } from "@/lib/fetchJson";
import { MY_LOCATION } from "@/lib/location";

type Geo = { lat: number; lon: number };

type WeatherResult = {
  temperatureC: number;
  weatherCode?: number;
};

function haversineKm(a: Geo, b: Geo) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);

  const h = s1 * s1 + Math.cos(lat1) * Math.cos(lat2) * s2 * s2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function tempEmoji(tempC: number) {
  if (tempC <= 0) return "🥶";
  if (tempC <= 10) return "🧥";
  if (tempC <= 18) return "🌥️";
  if (tempC <= 26) return "☀️";
  if (tempC <= 34) return "🥵";
  return "🔥";
}

export function LocationDistanceWeather() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "loading"; message: string }
    | { kind: "ready"; user: Geo; location: Geo; locationLabel: string; weather?: WeatherResult }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const distanceKm = useMemo(() => {
    if (status.kind !== "ready") return null;
    return haversineKm(status.user, status.location);
  }, [status]);

  useEffect(() => {
    // If the browser doesn't support <dialog>, we still render content inline.
  }, []);

  function open() {
    if (dialogRef.current?.showModal) dialogRef.current.showModal();
  }

  function close() {
    if (dialogRef.current?.close) dialogRef.current.close();
  }

  async function requestLocation() {
    if (!navigator.geolocation) {
      setStatus({ kind: "error", message: DISTANCE_WEATHER_COPY.status.geolocationUnsupported });
      return;
    }

    setStatus({ kind: "loading", message: DISTANCE_WEATHER_COPY.status.requestingLocation });

    const user = await new Promise<Geo>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => reject(err),
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 }
      );
    }).catch(() => null);

    if (!user) {
      setStatus({
        kind: "error",
        message: DISTANCE_WEATHER_COPY.status.couldNotAccess,
      });
      return;
    }

    // Hardcoded coordinates: avoids flaky geocoding.
    const location = MY_LOCATION;

    setStatus({
      kind: "loading",
      message: DISTANCE_WEATHER_COPY.status.fetchingWeather,
    });

    const weather = await fetchJson<{ temperatureC: number; weatherCode?: number }>(
      `/api/weather?lat=${encodeURIComponent(String(user.lat))}&lon=${encodeURIComponent(String(user.lon))}`
    );

    setStatus({
      kind: "ready",
      user,
      location: { lat: location.lat, lon: location.lon },
      locationLabel: location.label,
      weather: weather ?? undefined,
    });
  }

  const content = (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{DISTANCE_WEATHER_COPY.title}</p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {DISTANCE_WEATHER_COPY.intro}
        </p>
      </div>

      {status.kind === "idle" ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--app-primary))] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
            onClick={requestLocation}
          >
            {DISTANCE_WEATHER_COPY.buttons.shareLocation}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            onClick={close}
          >
            {DISTANCE_WEATHER_COPY.buttons.notNow}
          </button>
        </div>
      ) : null}

      {status.kind === "loading" ? (
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{status.message}</p>
      ) : null}

      {status.kind === "error" ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {DISTANCE_WEATHER_COPY.status.couldntLoadTitle}
          </p>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{status.message}</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--app-primary))] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
              onClick={() => setStatus({ kind: "idle" })}
            >
              {DISTANCE_WEATHER_COPY.buttons.tryAgain}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              onClick={close}
            >
              {DISTANCE_WEATHER_COPY.buttons.close}
            </button>
          </div>
        </div>
      ) : null}

      {status.kind === "ready" ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {DISTANCE_WEATHER_COPY.results.title}
          </p>

          <div className="mt-2 grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <p>
              {DISTANCE_WEATHER_COPY.results.distanceToPrefix}{" "}
              <span className="font-medium">{status.locationLabel}</span>: {" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {distanceKm
                  ? distanceKm.toFixed(distanceKm < 10 ? 1 : 0)
                  : DISTANCE_WEATHER_COPY.results.distanceUnknown}{" "}
                {DISTANCE_WEATHER_COPY.results.distanceUnit}
              </span>
            </p>

            {status.weather ? (
              <p>
                {DISTANCE_WEATHER_COPY.results.yourTemperaturePrefix}{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {status.weather.temperatureC.toFixed(0)}°C
                </span>{" "}
                <span
                  aria-label={DISTANCE_WEATHER_COPY.results.weatherAriaLabel}
                  title={DISTANCE_WEATHER_COPY.results.weatherTitle}
                >
                  {tempEmoji(status.weather.temperatureC)}
                </span>
              </p>
            ) : (
              <p>{DISTANCE_WEATHER_COPY.results.weatherUnavailable}</p>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              onClick={close}
            >
              {DISTANCE_WEATHER_COPY.buttons.close}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
        onClick={() => {
          setStatus({ kind: "idle" });
          open();
        }}
      >
        {DISTANCE_WEATHER_COPY.title}
      </button>

      <dialog
        ref={dialogRef}
        className="w-[min(560px,calc(100vw-32px))] rounded-3xl border border-zinc-200 bg-white p-6 backdrop:bg-black/30 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <form method="dialog">
          {content}
        </form>
      </dialog>
    </div>
  );
}
