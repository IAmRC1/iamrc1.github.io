"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Hero3DNoSSR = dynamic(() => import("@/components/Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950" />
  ),
});

function scheduleDelay(delayMs: number, cb: () => void) {
  if (delayMs <= 0) {
    cb();
    return;
  }

  window.setTimeout(cb, delayMs);
}

export function Hero3DLazy({
  delayMs = 300,
  rootMargin = "200px 0px 200px 0px",
}: {
  delayMs?: number;
  rootMargin?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    let cancelled = false;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          scheduleDelay(delayMs, () => {
            if (cancelled) return;
            setShouldRender(true);
          });
          break;
        }
      },
      { root: null, threshold: 0.12, rootMargin }
    );

    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [delayMs, rootMargin]);

  return <div ref={hostRef} className="h-full w-full">{shouldRender ? <Hero3DNoSSR /> : null}</div>;
}
