"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Rgb = { r: number; g: number; b: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseTriplet(raw: string): Rgb | null {
  // raw is like: "24 24 27"
  const parts = raw
    .trim()
    .split(/\s+/)
    .map((p) => Number(p));
  if (parts.length < 3) return null;
  const [r, g, b] = parts;
  if (![r, g, b].every((n) => Number.isFinite(n))) return null;
  return {
    r: clamp(Math.round(r), 0, 255),
    g: clamp(Math.round(g), 0, 255),
    b: clamp(Math.round(b), 0, 255),
  };
}

function rgb(c: Rgb, a?: number) {
  return typeof a === "number" ? `rgba(${c.r}, ${c.g}, ${c.b}, ${a})` : `rgb(${c.r}, ${c.g}, ${c.b})`;
}

type Obstacle = {
  id: number;
  kind: "ball" | "star" | "crescent" | "diamond";
  x: number; // 0..1
  y: number; // 0..1
  r: number; // 0..1 (relative to min dimension)
  v: number; // speed (y units per second)
};

function pickObstacleKind(): Obstacle["kind"] {
  // Keep mostly circles for readability, but mix in fun shapes.
  const x = Math.random();
  if (x < 0.58) return "ball";
  if (x < 0.76) return "diamond";
  if (x < 0.90) return "star";
  return "crescent";
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const points = 5;
  const inner = r * 0.45;
  const step = Math.PI / points;
  let angle = -Math.PI / 2;

  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : inner;
    const px = x + Math.cos(angle) * rr;
    const py = y + Math.sin(angle) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
    angle += step;
  }
  ctx.closePath();
  ctx.fill();
}

function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r * 0.92, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r * 0.92, y);
  ctx.closePath();
  ctx.fill();
}

function drawCrescent(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  // Use even-odd fill to carve a crescent.
  const cutX = x + r * 0.38;
  const cutY = y - r * 0.06;
  const cutR = r * 0.92;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(cutX, cutY, cutR, 0, Math.PI * 2, true);
  ctx.fill("evenodd");
}

function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle, x: number, y: number, r: number) {
  switch (o.kind) {
    case "ball":
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "star":
      drawStar(ctx, x, y, r);
      break;
    case "crescent":
      drawCrescent(ctx, x, y, r);
      break;
    case "diamond":
      drawDiamond(ctx, x, y, r);
      break;
  }
}

export function HeroMiniGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const pointerRef = useRef({ x: 0.5, y: 0.68 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const spawnTimerRef = useRef<number | null>(null);
  const idRef = useRef(1);
  const scoreRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const unlockedRef = useRef(false);

  const [colors, setColors] = useState(() => {
    // Defaults (match current root defaults)
    return {
      primary: { r: 24, g: 24, b: 27 },
      secondary: { r: 113, g: 113, b: 122 },
    } as { primary: Rgb; secondary: Rgb };
  });

  const hud = useMemo(() => {
    return {
      title: "Catch",
      subtitle: "Catch all falling shapes — miss one and it's over",
    };
  }, []);

  useEffect(() => {
    // Load best score
    try {
      const v = window.localStorage.getItem("portfolio:heroGame:best");
      const n = v ? Number(v) : 0;
      if (Number.isFinite(n)) setBest(Math.max(0, Math.floor(n)));
    } catch {
      // ignore
    }

    try {
      unlockedRef.current = window.localStorage.getItem("portfolio:unlock:zenith") === "1";
    } catch {
      unlockedRef.current = false;
    }

    // Observe theme changes (palette updates root style vars)
    const root = document.documentElement;

    function readTheme() {
      const cs = window.getComputedStyle(root);
      const primaryRaw = cs.getPropertyValue("--app-primary");
      const secondaryRaw = cs.getPropertyValue("--app-secondary");
      const p = parseTriplet(primaryRaw);
      const s = parseTriplet(secondaryRaw);
      setColors((prev) => ({
        primary: p ?? prev.primary,
        secondary: s ?? prev.secondary,
      }));
    }

    readTheme();

    const mo = new MutationObserver(() => readTheme());
    mo.observe(root, { attributes: true, attributeFilter: ["style", "class"] });

    return () => {
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const canvasEl: HTMLCanvasElement = canvas;
    const ctx2d: CanvasRenderingContext2D = ctx;

    function resize() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const rect = canvasEl.getBoundingClientRect();
      canvasEl.width = Math.max(1, Math.floor(rect.width * dpr));
      canvasEl.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvasEl);

    return () => {
      ro.disconnect();
    };
  }, []);

  function stop() {
    setRunning(false);
    runningRef.current = false;
    if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);
    spawnTimerRef.current = null;
  }

  function reset() {
    obstaclesRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    pointerRef.current = { x: 0.5, y: 0.88 };
    lastRef.current = null;
  }

  function start() {
    reset();
    setRunning(true);
    runningRef.current = true;

    // Spawn cadence: quick but not chaotic.
    if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);
    spawnTimerRef.current = window.setInterval(() => {
      const baseR = 0.014 + Math.random() * 0.018;
      const kind = pickObstacleKind();
      obstaclesRef.current = [
        ...obstaclesRef.current,
        {
          id: idRef.current++,
          kind,
          x: 0.08 + Math.random() * 0.84,
          y: -0.05,
          r: baseR,
          v: 0.26 + Math.random() * 0.32,
        },
      ].slice(-30);
    }, 450);

    // Kick loop if needed
    if (!rafRef.current) {
      rafRef.current = window.requestAnimationFrame(tick);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    pointerRef.current = { x: clamp(x, 0.03, 0.97), y: 0.88 };
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!runningRef.current) start();
      return;
    }

    const p = pointerRef.current;
    const step = 0.04;
    if (e.key === "ArrowLeft") pointerRef.current = { ...p, x: clamp(p.x - step, 0.03, 0.97) };
    if (e.key === "ArrowRight") pointerRef.current = { ...p, x: clamp(p.x + step, 0.03, 0.97) };
    pointerRef.current = { ...pointerRef.current, y: 0.88 };
  }

  function commitBest(nextScore: number) {
    setBest((prev) => {
      const nextBest = Math.max(prev, nextScore);
      try {
        window.localStorage.setItem("portfolio:heroGame:best", String(nextBest));
      } catch {
        // ignore
      }
      return nextBest;
    });
  }

  function maybeUnlock(nextScore: number) {
    // Tie-in: hit a score threshold to unlock a fun fact on a project card.
    if (unlockedRef.current) return;
    if (nextScore < 10) return;

    unlockedRef.current = true;
    try {
      window.localStorage.setItem("portfolio:unlock:zenith", "1");
      window.dispatchEvent(new Event("portfolio:unlock"));
    } catch {
      // ignore
    }
  }

  function tick(ts: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) {
      rafRef.current = null;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const minDim = Math.max(1, Math.min(w, h));

    const last = lastRef.current;
    const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
    lastRef.current = ts;

    // Clear (transparent so the 3D background stays visible)
    ctx.clearRect(0, 0, w, h);

    const p = pointerRef.current;
    const px = p.x * w;
    const bowlY = h * 0.88;
    const bowlR = minDim * 0.11;
    const bowlThickness = Math.max(3, minDim * 0.012);
    const catchBand = Math.max(10, minDim * 0.05);

    // Update obstacles
    if (runningRef.current && dt > 0) {
      let nextScore = scoreRef.current;
      const updated: Obstacle[] = [];
      let ended = false;

      for (const o of obstaclesRef.current) {
        const ny = o.y + o.v * dt;
        const no = { ...o, y: ny };

        // Geometry
        const ox = no.x * w;
        const oy = no.y * h;
        const or = no.r * minDim;

        // Missed => game over
        if (ny - o.r > 1.02) {
          stop();
          commitBest(nextScore);
          ended = true;
          break;
        }

        // Caught by bowl (simple band + width check)
        // We treat the bowl as a horizontal catcher near bowlY.
        if (Math.abs(oy - bowlY) <= catchBand && Math.abs(ox - px) <= bowlR - or * 0.25) {
          nextScore += 1;
          continue;
        }

        updated.push(no);
      }

      obstaclesRef.current = updated;

      if (!ended && nextScore !== scoreRef.current) {
        scoreRef.current = nextScore;
        setScore(nextScore);
        maybeUnlock(nextScore);
      }
    }

    // Draw obstacles
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = rgb(colors.primary, 0.85);
    for (const o of obstaclesRef.current) {
      const ox = o.x * w;
      const oy = o.y * h;
      const or = o.r * minDim;
      drawObstacle(ctx, o, ox, oy, or);
    }
    ctx.restore();

    // Draw bowl catcher
    ctx.save();
    ctx.shadowColor = rgb(colors.primary, 0.45);
    ctx.shadowBlur = 18;
    ctx.strokeStyle = rgb(colors.primary, 0.95);
    ctx.lineWidth = bowlThickness;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    // Semi-circle open downwards (upside-down bowl)
    ctx.arc(px, bowlY, bowlR, 0, Math.PI);
    // Tiny uprights
    ctx.moveTo(px - bowlR, bowlY);
    ctx.lineTo(px - bowlR, bowlY + bowlThickness * 0.9);
    ctx.moveTo(px + bowlR, bowlY);
    ctx.lineTo(px + bowlR, bowlY + bowlThickness * 0.9);
    ctx.stroke();
    ctx.restore();

    rafRef.current = window.requestAnimationFrame(tick);
  }

  useEffect(() => {
    // Ensure RAF loop runs (even when idle) so the canvas stays crisp on resize/theme.
    if (!rafRef.current) rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute inset-0 flex flex-col bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/Designer.png)", backgroundSize: "cover" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4">
        {!running ? (
          <div className="rounded-2xl border border-zinc-200 bg-white/75 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
              {hud.title}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-600 dark:text-zinc-400">
              {hud.subtitle}
            </p>
          </div>
        ) : (
          <div />
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white/75 px-3 py-2 text-right backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">Score</p>
          <p className="mt-0.5 text-sm font-semibold" style={{ color: `rgb(${colors.primary.r}, ${colors.primary.g}, ${colors.primary.b})` }}>
            {score}
          </p>
          <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">Best: {best}</p>
        </div>
      </div>

      <div className="relative h-full w-full">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          onPointerMove={onPointerMove}
          style={{ touchAction: "none" }}
          onPointerDown={(e) => {
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
              // ignore
            }
            onPointerMove(e);
            if (!runningRef.current) start();
          }}
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Mini game: catch falling balls"
        />

        {!running ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center p-6">
            <div className="pointer-events-auto w-[min(340px,100%)] rounded-3xl border border-zinc-200 bg-white/80 p-5 text-center backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/65">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {score > 0 ? "Game over" : "Play inside the hero"}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Move your bowl with the cursor to catch. Miss one = game over. Click / tap to start. Space starts too.
              </p>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--app-primary))] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
                  onClick={start}
                >
                  {score > 0 ? "Try again" : "Start"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
