"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type HeartState = {
  count: number;
  mode: "global" | "local";
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeParseInt(value: string | null) {
  if (!value) return 0;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function playSquish(audioCtxRef: { current: AudioContext | null }) {
  // WebAudio "squish" — short filtered noise burst + pitch drop.
  const AudioContextImpl =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextImpl) return;

  let ctx = audioCtxRef.current;
  if (!ctx) {
    ctx = new AudioContextImpl();
    audioCtxRef.current = ctx;
  }

  const now = ctx.currentTime;

  const duration = 0.09;

  // Noise
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1600, now);
  filter.frequency.exponentialRampToValueAtTime(260, now + duration);
  filter.Q.setValueAtTime(0.6, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);

  // Tiny "pop" tone layer
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.07);

  const og = ctx.createGain();
  og.gain.setValueAtTime(0.0001, now);
  og.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
  og.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

  osc.connect(og);
  og.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

export function HeartButton({
  storageKey = "portfolio:hearts",
  stepPercent,
}: {
  storageKey?: string;
  stepPercent?: number;
}) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [state, setState] = useState<HeartState>({ count: 0, mode: "global" });
  const [fill, setFill] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const celebratedRef = useRef(false);
  const pendingRef = useRef(0);
  const flushTimerRef = useRef<number | null>(null);
  const clipId = `heart-clip-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await fetchJson<{ count: number }>("/api/hearts");
      if (cancelled) return;

      if (data && typeof data.count === "number") {
        setState({ count: Math.max(0, data.count), mode: "global" });
        return;
      }

      const stored = safeParseInt(window.localStorage.getItem(storageKey));
      setState({ count: Math.max(0, stored), mode: "local" });
    })();

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  const fillPercent = useMemo(() => {
    return clamp(fill, 0, 100);
  }, [fill]);

  const fillLabel = useMemo(() => {
    return `${Math.round(fillPercent)}%`;
  }, [fillPercent]);

  useEffect(() => {
    // Allow celebrating again only after the fill drops below 100%.
    if (fillPercent < 100) celebratedRef.current = false;
  }, [fillPercent]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFill((prev) => {
        const prevClamped = clamp(prev, 0, 100);
        const isHardMode = prevClamped >= 75;

        // Drain rules:
        // - < 75%: 1.25% per 500ms
        // - >=75%: 0.5% per 250ms
        // We run a 250ms tick and apply the equivalent drain.
        const drain = isHardMode ? 0.5 : 0.625;
        return clamp(prevClamped - drain, 0, 100);
      });
    }, 250);
    return () => window.clearInterval(interval);
  }, []);

  async function flushPending() {
    if (flushTimerRef.current) {
      window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }

    const increment = pendingRef.current;
    if (increment <= 0) return;
    pendingRef.current = 0;

    const data = await fetchJson<{ count: number }>("/api/hearts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ increment }),
    });

    if (data && typeof data.count === "number") {
      setState({ count: Math.max(0, data.count), mode: "global" });
      return;
    }

    // Fallback to local persistence.
    setState((prev) => {
      const nextCount = prev.count;
      try {
        window.localStorage.setItem(storageKey, String(nextCount));
      } catch {
        // ignore
      }
      return { count: nextCount, mode: "local" };
    });
  }

  function scheduleFlush() {
    if (flushTimerRef.current) return;
    flushTimerRef.current = window.setTimeout(() => {
      void flushPending();
    }, 500);
  }

  function doHeartClick() {
    setState((prev) => ({ ...prev, count: prev.count + 1 }));
    pendingRef.current += 1;
    scheduleFlush();

    setFill((prev) => {
      const prevClamped = clamp(prev, 0, 100);
      const isHardMode = prevClamped >= 75;

      // Fill rules:
      // - < 75%: 2.5% per click
      // - >=75%: 1% per click
      // Allow an explicit stepPercent override if provided.
      const step = typeof stepPercent === "number" ? stepPercent : isHardMode ? 1 : 2.5;
      const next = clamp(prevClamped + step, 0, 100);

      const hitFull = prevClamped < 100 && next >= 100;

      if (hitFull && !celebratedRef.current) {
        celebratedRef.current = true;
        setCelebrating(true);
        window.setTimeout(() => setCelebrating(false), 900);

        const el = buttonRef.current;
        void (async () => {
          try {
            const mod = await import("party-js");
            const party = mod.default;

            // Ensure it shows even when reduced-motion is enabled.
            party.settings.respectReducedMotion = false;

            const origin = (el ?? document.body) as unknown as HTMLElement;
            party.confetti(origin, { count: 90, spread: 55, size: 1.15 });
            party.sparkles(origin, { count: 30 });
          } catch {
            // ignore
          }
        })();
      }

      return next;
    });

    playSquish(audioCtxRef);
  }

  useEffect(() => {
    return () => {
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        ref={buttonRef}
        type="button"
        className="group relative inline-flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        onClick={doHeartClick}
        aria-label="Send a heart"
      >
        <span
          aria-hidden="true"
          className={
            celebrating
              ? "pointer-events-none absolute -top-4 right-2 select-none text-lg opacity-100 transition"
              : "pointer-events-none absolute -top-4 right-2 select-none text-lg opacity-0 transition"
          }
        >
          🎉
        </span>

        <span className="relative inline-flex h-6 w-6">
          <svg
            viewBox="0 0 24 24"
            className={
              celebrating
                ? "h-6 w-6 scale-110 transition-transform duration-200 will-change-transform"
                : "h-6 w-6 transition-transform duration-200 will-change-transform"
            }
            role="img"
            aria-hidden="true"
          >
            <defs>
              <clipPath id={clipId}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </clipPath>
            </defs>

            {/* Outline */}
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              className="fill-none stroke-zinc-900 stroke-[1.6]"
            />

            {/* Fill (clipped to heart) */}
            <g clipPath={`url(#${clipId})`}>
              <rect
                x="0"
                y={24 - (24 * fillPercent) / 100}
                width="24"
                height={(24 * fillPercent) / 100}
                className="fill-red-600"
              />
            </g>
          </svg>
        </span>

        <span>Send a heart</span>
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          {state.count}
        </span>
        <span className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
          {fillLabel}
        </span>
      </button>
    </div>
  );
}
