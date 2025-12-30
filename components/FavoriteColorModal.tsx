"use client";

import { useEffect, useMemo, useState } from "react";
import { Palette } from "lucide-react";

const PRIMARY_STORAGE_KEY = "portfolio:primary-v1" as const;

function clampByte(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(255, Math.round(n)));
}

function parseRgbTriplet(raw: string | null): { r: number; g: number; b: number } | null {
  if (!raw) return null;
  const parts = raw
    .trim()
    .split(/\s+/g)
    .filter(Boolean);
  if (parts.length !== 3) return null;
  const nums = parts.map((p) => Number.parseInt(p, 10));
  if (!nums.every((n) => Number.isFinite(n))) return null;
  const [r, g, b] = nums;
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null;
  return { r, g, b };
}

function rgbTripletToHex(triplet: string): string {
  const rgb = parseRgbTriplet(triplet);
  if (!rgb) return "#ffb6b9";
  const toHex = (n: number) => clampByte(n).toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function hexToRgbTriplet(hex: string): string | null {
  const raw = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) return null;
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function FavoriteColorModal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("#ffb6b9");
  const [hasCustom, setHasCustom] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(PRIMARY_STORAGE_KEY);
      const parsed = parseRgbTriplet(existing);
      if (parsed) {
        setHasCustom(true);
        setValue(rgbTripletToHex(existing));
        document.documentElement.style.setProperty(
          "--app-primary",
          `${parsed.r} ${parsed.g} ${parsed.b}`
        );
        return;
      }
    } catch {
      // ignore
    }

    const cs = window.getComputedStyle(document.documentElement);
    const currentPrimary = cs.getPropertyValue("--app-primary").trim();
    if (currentPrimary) setValue(rgbTripletToHex(currentPrimary));

    setOpen(true);
  }, []);

  const previewStyle = useMemo(() => {
    const triplet = hexToRgbTriplet(value);
    return triplet ? ({ backgroundColor: `rgb(${triplet.replace(/\s+/g, ", ")})` } as const) : undefined;
  }, [value]);

  return (
    <>
      {hasCustom && !open ? (
        <button
          type="button"
          className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--app-primary))] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow active:translate-y-0"
          aria-label="Change accent color"
          title="Change accent color"
          onClick={() => setOpen(true)}
        >
          <Palette className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/40 p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Pick your favorite color"
        >
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  What’s your favourite color?
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  We’ll use it as the accent color across the site.
                </p>
              </div>
              <span
                className="mt-1 h-7 w-7 shrink-0 rounded-full"
                style={previewStyle}
                aria-hidden="true"
              />
            </header>

            <div className="mt-5 flex items-center gap-3">
              <label
                className="text-sm font-semibold text-zinc-800 dark:text-zinc-200"
                htmlFor="fav-color"
              >
                Color
              </label>
              <input
                id="fav-color"
                type="color"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
                aria-label="Favorite color"
              />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{value.toUpperCase()}</span>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--app-primary))] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
                onClick={() => {
                  const triplet = hexToRgbTriplet(value);
                  if (!triplet) return;
                  try {
                    window.localStorage.setItem(PRIMARY_STORAGE_KEY, triplet);
                  } catch {
                    // ignore
                  }
                  document.documentElement.style.setProperty("--app-primary", triplet);
                  setHasCustom(true);
                  setOpen(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
