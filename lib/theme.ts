export type ColorPaletteId = "brand" | "zinc";

export type ThemeState = {
  mode: "light" | "dark";
  palette: ColorPaletteId;
};

export const THEME_STORAGE_KEY = "portfolio:theme-v1" as const;
export const PRIMARY_STORAGE_KEY = "portfolio:primary-v1" as const;

function isValidRgbTriplet(v: string | null): v is string {
  if (!v) return false;
  const parts = v.trim().split(/\s+/g).filter(Boolean);
  if (parts.length !== 3) return false;
  const nums = parts.map((p) => Number.parseInt(p, 10));
  if (!nums.every((n) => Number.isFinite(n))) return false;
  return nums.every((n) => n >= 0 && n <= 255);
}

// Color-blind-friendly-ish palettes: avoid red/green as the primary/secondary pair.
// Values are Tailwind default RGB triplets.
export const COLOR_PALETTES: Array<{ id: ColorPaletteId; label: string; primary: string; secondary: string }> = [
  // Brand palette (requested):
  // primary: #FFB6B9 → 255 182 185
  // secondary: #FAE3D9 → 250 227 217
  { id: "brand", label: "Brand", primary: "255 182 185", secondary: "250 227 217" },

  // Night / dark fallback: neutral zinc accents.
  // (Chosen to keep white text readable on primary buttons.)
  { id: "zinc", label: "Zinc", primary: "63 63 70", secondary: "161 161 170" },
];

export const DEFAULT_THEME: ThemeState = {
  mode: "light",
  palette: "brand",
};

export function getAutoTheme(now = new Date()): ThemeState {
  const hour = now.getHours();
  // Simple local-time heuristic.
  const isNight = hour >= 19 || hour < 7;
  return isNight
    ? { mode: "dark", palette: "zinc" }
    : { mode: "light", palette: "brand" };
}

export function safeParseTheme(raw: string | null): ThemeState | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Partial<ThemeState>;
    if (obj.mode !== "light" && obj.mode !== "dark") return null;
    if (!COLOR_PALETTES.some((p) => p.id === obj.palette)) return null;
    return { mode: obj.mode, palette: obj.palette } as ThemeState;
  } catch {
    return null;
  }
}

export function applyThemeToDocument(doc: Document, theme: ThemeState) {
  const root = doc.documentElement;
  root.classList.toggle("dark", theme.mode === "dark");

  const palette = COLOR_PALETTES.find((p) => p.id === theme.palette) ?? COLOR_PALETTES[0];

  // Fixed font pair across the site.
  root.style.setProperty("--app-font-primary", "var(--font-plus-jakarta, ui-sans-serif)");
  root.style.setProperty("--app-font-secondary", "var(--font-newsreader, ui-serif)");
  root.style.setProperty("--app-primary", palette.primary);
  root.style.setProperty("--app-secondary", palette.secondary);

  // If the user picked a custom accent, prefer it over the palette.
  try {
    const storedPrimary = window.localStorage.getItem(PRIMARY_STORAGE_KEY);
    if (isValidRgbTriplet(storedPrimary)) {
      root.style.setProperty("--app-primary", storedPrimary.trim());
    }
  } catch {
    // ignore
  }
}

export function loadStoredTheme(): ThemeState | null {
  try {
    return safeParseTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function storeTheme(theme: ThemeState) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // ignore
  }
}
