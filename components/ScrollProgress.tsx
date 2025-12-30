"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const next = height > 0 ? (scrollTop / height) * 100 : 0;
      const clamped = Math.max(0, Math.min(100, next));
      setProgress(clamped);
      try {
        document.documentElement.style.setProperty("--scroll-pct", String(clamped));
      } catch {
        // ignore
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent">
      <div
        className="h-full"
        style={{ backgroundColor: "rgb(var(--app-primary))", width: `${progress}%` }}
      />
    </div>
  );
}
