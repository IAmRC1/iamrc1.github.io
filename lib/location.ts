export const MY_LOCATION = {
  // Hardcoded coordinates: avoids flaky geocoding.
  lat: 28.4890137,
  lon: 77.5440093,
  shortLabel: "My location",
  label: "My location",
  iframeTitle: "My location map",
} as const;

export function buildOsmOpenUrl(lat: number, lon: number) {
  return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(String(lat))}&mlon=${encodeURIComponent(String(lon))}#map=16/${encodeURIComponent(String(lat))}/${encodeURIComponent(String(lon))}`;
}
