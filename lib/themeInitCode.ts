export const THEME_INIT_CODE = `(() => {
  try {
    const raw = localStorage.getItem('portfolio:theme-v1');
    const stored = raw ? JSON.parse(raw) : null;
    const storedPrimary = localStorage.getItem('portfolio:primary-v1');

    function isValidMode(v) {
      return v === 'dark' || v === 'light';
    }

    function isValidPalette(v) {
      return v === 'brand' || v === 'zinc';
    }

    function isValidRgbTriplet(v) {
      if (typeof v !== 'string') return false;
      const parts = v.trim().split(/\s+/g).filter(Boolean);
      if (parts.length !== 3) return false;
      for (const p of parts) {
        const n = parseInt(p, 10);
        if (!Number.isFinite(n) || n < 0 || n > 255) return false;
      }
      return true;
    }

    // Auto theme (local time): day = light+brand, night = dark+zinc
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour < 7;
    const autoTheme = isNight ? { mode: 'dark', palette: 'zinc' } : { mode: 'light', palette: 'brand' };

    const hasStoredTheme = stored && typeof stored === 'object' && isValidMode(stored.mode) && isValidPalette(stored.palette);
    const theme = hasStoredTheme ? { mode: stored.mode, palette: stored.palette } : autoTheme;

    const paletteMap = {
      'brand': { primary: '255 182 185', secondary: '250 227 217' },
      'zinc': { primary: '63 63 70', secondary: '161 161 170' },
    };

    const root = document.documentElement;
    root.classList.toggle('dark', theme.mode === 'dark');
    root.style.setProperty('--app-font-primary', 'var(--font-plus-jakarta, ui-sans-serif)');
    root.style.setProperty('--app-font-secondary', 'var(--font-newsreader, ui-serif)');
    root.style.setProperty('--app-primary', paletteMap[theme.palette].primary);
    root.style.setProperty('--app-secondary', paletteMap[theme.palette].secondary);

    if (isValidRgbTriplet(storedPrimary)) {
      root.style.setProperty('--app-primary', storedPrimary.trim());
    }
  } catch {
    // ignore
  }
})();`;
