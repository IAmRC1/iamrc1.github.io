import { NextResponse } from "next/server";
import { NOMINATIM_USER_AGENT } from "@/lib/http";

export const runtime = "nodejs";

type Cached = {
  q: string;
  at: number;
  lat: number;
  lon: number;
  label: string;
};

const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

function getCache() {
  const g = globalThis as unknown as { __PORTFOLIO_GEOCODE_CACHE__?: Cached };
  return g;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ error: "Missing q" }, { status: 400 });
  }

  const cacheHost = getCache();
  const cached = cacheHost.__PORTFOLIO_GEOCODE_CACHE__;

  if (cached && cached.q === q && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json({ lat: cached.lat, lon: cached.lon, label: cached.label });
  }

  const endpoint = new URL("https://nominatim.openstreetmap.org/search");
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("limit", "1");
  endpoint.searchParams.set("q", q);

  const res = await fetch(endpoint.toString(), {
    headers: {
      accept: "application/json",
      "user-agent": NOMINATIM_USER_AGENT,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Geocode failed" }, { status: 502 });
  }

  const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  const first = data[0];

  if (!first) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const lat = Number(first.lat);
  const lon = Number(first.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Bad result" }, { status: 502 });
  }

  const label = first.display_name;

  cacheHost.__PORTFOLIO_GEOCODE_CACHE__ = { q, at: Date.now(), lat, lon, label };

  return NextResponse.json({ lat, lon, label });
}
