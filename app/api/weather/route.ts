import { NextResponse } from "next/server";

export const runtime = "nodejs";

function toNumber(value: string | null) {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = toNumber(url.searchParams.get("lat"));
  const lon = toNumber(url.searchParams.get("lon"));

  if (lat == null || lon == null) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  // Open-Meteo: no API key required.
  const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
  endpoint.searchParams.set("latitude", String(lat));
  endpoint.searchParams.set("longitude", String(lon));
  endpoint.searchParams.set("current", "temperature_2m,weather_code");
  endpoint.searchParams.set("timezone", "auto");

  const res = await fetch(endpoint.toString(), {
    headers: {
      accept: "application/json",
    },
    // avoid caching surprises
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Weather fetch failed" }, { status: 502 });
  }

  const data = (await res.json()) as {
    current?: {
      temperature_2m?: number;
      weather_code?: number;
    };
  };

  const temperatureC = data.current?.temperature_2m;
  const weatherCode = data.current?.weather_code;

  if (typeof temperatureC !== "number") {
    return NextResponse.json({ error: "Weather unavailable" }, { status: 502 });
  }

  return NextResponse.json({ temperatureC, weatherCode });
}
