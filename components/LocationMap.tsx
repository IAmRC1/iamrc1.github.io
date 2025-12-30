"use client";

import { useMemo } from "react";

import { LOCATION_COPY } from "@/lib/copy/location";
import { buildOsmOpenUrl, MY_LOCATION } from "@/lib/location";

function buildOsmEmbedUrl(lat: number, lon: number) {
  // Roughly a ~2km viewport; tweak delta to zoom in/out.
  const dLon = 0.02;
  const dLat = 0.012;
  const left = lon - dLon;
  const right = lon + dLon;
  const top = lat + dLat;
  const bottom = lat - dLat;

  const params = new URLSearchParams({
    bbox: `${left},${bottom},${right},${top}`,
    layer: "mapnik",
    marker: `${lat},${lon}`,
  });

  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

export function LocationMap() {
  const embedUrl = useMemo(() => {
    return buildOsmEmbedUrl(MY_LOCATION.lat, MY_LOCATION.lon);
  }, []);

  return (
    <div className="app-card h-full rounded-3xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {LOCATION_COPY.cardTitle}
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{MY_LOCATION.shortLabel}</p>
        </div>
        <a
          className="text-sm font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-200"
          href={buildOsmOpenUrl(MY_LOCATION.lat, MY_LOCATION.lon)}
          target="_blank"
          rel="noreferrer"
        >
          {LOCATION_COPY.openInMaps}
        </a>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
        {embedUrl ? (
          <iframe
            title={MY_LOCATION.iframeTitle}
            src={embedUrl}
            className="h-[120px] w-full sm:h-[160px]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-[120px] w-full sm:h-[160px]" />
        )}
      </div>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{MY_LOCATION.label}</p>

      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{LOCATION_COPY.mapAttribution}</p>
    </div>
  );
}
