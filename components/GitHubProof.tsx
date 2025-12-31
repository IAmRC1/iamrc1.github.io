"use client";

import { Github } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Data = {
  user: string;
  prs30d: number;
  lastActivityDaysAgo: number | null;
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function GitHubProof({ username }: { username: string }) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    (async () => {
      const d = await fetchJson<Data>(`/api/github?user=${encodeURIComponent(username)}`);
      if (cancelled) return;
      if (d) setData(d);
    })();

    return () => {
      cancelled = true;
    };
  }, [username]);

  const text = useMemo(() => {
    if (!data) return null;
    const parts: string[] = [];
    parts.push(`PRs (30d): ${data.prs30d}`);
    if (typeof data.lastActivityDaysAgo === "number") parts.push(`active: ${data.lastActivityDaysAgo}d ago`);
    return parts.join(" · ");
  }, [data]);

  if (!username) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
      <Github className="h-6 w-6" aria-hidden="true" />
      <span className="text-zinc-600 dark:text-zinc-400">{text ?? "loading…"}</span>
    </div>
  );
}
