"use client";

import { useMemo, useState } from "react";

type NodeId = "client" | "api" | "db" | "observability";

type Node = {
  id: NodeId;
  title: string;
  summary: string;
  detail: string;
};

export function CaseStudyHotspots() {
  const nodes = useMemo<Node[]>(
    () => [
      {
        id: "client",
        title: "Client",
        summary: "Fast first paint + crisp interactions",
        detail:
          "Shipped a UI system with theme tokens, scroll reveals, and small interactive affordances to keep the page feeling responsive without over-animating.",
      },
      {
        id: "api",
        title: "API",
        summary: "Small endpoints, cached",
        detail:
          "Added lightweight proof endpoints (like GitHub activity) with caching to avoid blocking the page and to keep data fresh without hammering third-party APIs.",
      },
      {
        id: "db",
        title: "Content",
        summary: "Markdown + JSON = simple",
        detail:
          "Kept content authoring friction low: Markdown for posts, JSON for “now building” style status. Server reads keep the client bundle lean.",
      },
      {
        id: "observability",
        title: "Polish",
        summary: "Accessibility + motion safety",
        detail:
          "IntersectionObserver reveals respect reduced motion; interactive elements are keyboard reachable and announce intent with labels and focus states.",
      },
    ],
    []
  );

  const [active, setActive] = useState<NodeId>("client");
  const current = nodes.find((n) => n.id === active) ?? nodes[0];

  return (
    <article className="app-card rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <section className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between" aria-label="Case study">
        <header>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Interactive case study</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            From “nice page” to “proof-driven product”.
          </h3>
          <p className="mt-2 max-w-prose text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Hover / tap the blocks to see what changed.
          </p>
        </header>

        <section className="grid w-full max-w-xl grid-cols-1 gap-3 min-[420px]:grid-cols-2" aria-label="Case study areas">
          {nodes.map((n) => {
            const selected = n.id === active;
            return (
              <button
                key={n.id}
                type="button"
                onMouseEnter={() => setActive(n.id)}
                onFocus={() => setActive(n.id)}
                onClick={() => setActive(n.id)}
                className={
                  selected
                    ? "rounded-2xl border px-4 py-3 text-left transition"
                    : "rounded-2xl border border-zinc-200 px-4 py-3 text-left transition hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }
                style={selected ? { borderColor: "rgb(var(--app-primary))" } : undefined}
                aria-pressed={selected}
              >
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{n.title}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{n.summary}</p>
              </button>
            );
          })}
        </section>
      </section>

      <section className="app-card mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40" aria-label="Case study detail">
        <p className="text-sm font-semibold" style={{ color: "rgb(var(--app-primary))" }}>
          {current.title}
        </p>
        <p className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{current.detail}</p>
      </section>
    </article>
  );
}
