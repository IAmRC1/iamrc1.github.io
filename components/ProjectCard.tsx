"use client";

import { useEffect, useMemo, useState } from "react";
import { hasTechIcon, TechIcon } from "@/components/TechIcon";
import type { Project } from "@/lib/projects";

export type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  const [tab, setTab] = useState<"impact" | "decisions" | "stack">("impact");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!project.unlockKey) return;

    function read() {
      try {
        setUnlocked(window.localStorage.getItem(`portfolio:unlock:${project.unlockKey}`) === "1");
      } catch {
        setUnlocked(false);
      }
    }

    read();
    const onUnlock = () => read();
    window.addEventListener("portfolio:unlock", onUnlock);
    return () => window.removeEventListener("portfolio:unlock", onUnlock);
  }, [project.unlockKey]);

  const tabs = useMemo(() => {
    return [
      { id: "impact" as const, label: "Impact", value: project.impact ?? "" },
      { id: "decisions" as const, label: "Decisions", value: project.decisions ?? "" },
      { id: "stack" as const, label: "Stack", value: project.stack ?? "" },
    ].filter((t) => t.value.trim().length > 0);
  }, [project.decisions, project.impact, project.stack]);

  useEffect(() => {
    if (!tabs.some((t) => t.id === tab) && tabs.length) setTab(tabs[0].id);
  }, [tab, tabs]);

  const tabValue = tabs.find((t) => t.id === tab)?.value ?? "";

  const content = (
    <div
      className="app-card group relative rounded-3xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
      style={unlocked ? { borderColor: "rgb(var(--app-primary))" } : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {project.title}
        </h3>
        {project.href ? (
          <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 transition group-hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400 dark:group-hover:border-zinc-700">
            Open
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{project.description}</p>

      {project.funFact && unlocked ? (
        <p className="mt-3 text-sm font-medium" style={{ color: "rgb(var(--app-primary))" }}>
          {project.funFact}
        </p>
      ) : null}

      {tabs.length ? (
        <div className="mt-4">
          <div className="max-w-full overflow-x-auto">
            <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={
                    tab === t.id
                      ? "shrink-0 whitespace-nowrap rounded-full bg-[rgb(var(--app-primary))] px-3 py-1 text-xs font-semibold text-white"
                      : "shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                  }
                  onClick={(e) => {
                    // Project cards may be wrapped with a link; tabs should not navigate.
                    e.preventDefault();
                    e.stopPropagation();
                    setTab(t.id);
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {tabValue}
          </p>
        </div>
      ) : null}

      {project.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2 opacity-80 transition group-hover:opacity-100">
          {project.tags.map((tag) => (
            hasTechIcon(tag) ? (
              <span
                key={tag}
                className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                aria-label={tag}
                title={tag}
              >
                <TechIcon name={tag} className="h-4 w-4" />
              </span>
            ) : (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                {tag}
              </span>
            )
          ))}
        </div>
      ) : null}
    </div>
  );

  if (project.href) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
