"use client";

import { useEffect, useState } from "react";
import { UI_COPY } from "@/lib/copy/ui";
import {
  applyThemeToDocument,
  DEFAULT_THEME,
  getAutoTheme,
  loadStoredTheme,
  storeTheme,
  type ThemeState,
} from "@/lib/theme";

function IconSun(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
    </svg>
  );
}

function IconMoon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3c.06.39.09.79.09 1.2a7.5 7.5 0 0 0 9.7 8.59Z" />
    </svg>
  );
}

export function ThemeControls() {
  const [theme, setTheme] = useState<ThemeState>(DEFAULT_THEME);

  useEffect(() => {
    const stored = loadStoredTheme();
    const next = stored ?? getAutoTheme();
    setTheme(next);
    applyThemeToDocument(document, next);
  }, []);

  function update(next: ThemeState) {
    setTheme(next);
    applyThemeToDocument(document, next);
    storeTheme(next);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
        onClick={() => {
          const nextMode: ThemeState["mode"] = theme.mode === "dark" ? "light" : "dark";
          update({
            mode: nextMode,
            palette: nextMode === "dark" ? "zinc" : "brand",
          });
        }}
        aria-label={
          theme.mode === "dark" ? UI_COPY.theme.switchToLightMode : UI_COPY.theme.switchToDarkMode
        }
        title={theme.mode === "dark" ? UI_COPY.theme.lightModeTitle : UI_COPY.theme.darkModeTitle}
      >
        {theme.mode === "dark" ? (
          <IconSun className="h-5 w-5" />
        ) : (
          <IconMoon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
