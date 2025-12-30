"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Certificate } from "@/lib/certificates";
import { Award, BadgeCheck, ExternalLink } from "lucide-react";
import { CERTIFICATES_COPY } from "@/lib/copy/certificates";

function titleCase(domain: string) {
  if (!domain) return domain;
  return domain
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CertificatesBrowser(props: {
  certificates: Certificate[];
  initialDomain?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const domains = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of props.certificates) {
      map.set(c.domain, (map.get(c.domain) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([domain, count]) => ({ domain, count }));
  }, [props.certificates]);

  const urlDomain = (searchParams?.get("domain") ?? "").toLowerCase();
  const initial = (props.initialDomain ?? urlDomain ?? "").toLowerCase();
  const [domain, setDomain] = useState<string>(initial);

  const filtered = useMemo(() => {
    if (!domain) return props.certificates;
    return props.certificates.filter((c) => c.domain === domain);
  }, [domain, props.certificates]);

  function setDomainAndUrl(next: string) {
    const nextDomain = next.toLowerCase();
    setDomain(nextDomain);

    const sp = new URLSearchParams(searchParams?.toString());
    if (nextDomain) sp.set("domain", nextDomain);
    else sp.delete("domain");

    const qs = sp.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDomainAndUrl("")}
          className={
            !domain
              ? "rounded-full bg-[rgb(var(--app-primary))] px-3 py-1.5 text-xs font-semibold text-white"
              : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-700"
          }
        >
          {CERTIFICATES_COPY.filters.all}
        </button>

        {domains.map((d) => {
          const selected = d.domain === domain;
          return (
            <button
              key={d.domain}
              type="button"
              onClick={() => setDomainAndUrl(d.domain)}
              className={
                selected
                  ? "rounded-full bg-[rgb(var(--app-primary))] px-3 py-1.5 text-xs font-semibold text-white"
                  : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-700"
              }
            >
              {titleCase(d.domain)}
              <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                {d.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((c) => {
          const Icon = c.type === "badge" ? BadgeCheck : Award;
          const card = (
            <div className="app-card rounded-3xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{c.title}</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{c.issuer}</p>
                </div>

                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {c.credentialUrl ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : null}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                  {titleCase(c.domain)}
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                  {c.type === "badge"
                    ? CERTIFICATES_COPY.types.badge
                    : CERTIFICATES_COPY.types.certificate}
                </span>
                {c.date ? (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{c.date}</span>
                ) : null}
              </div>
            </div>
          );

          if (c.credentialUrl) {
            return (
              <a
                key={c.id}
                href={c.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                {card}
              </a>
            );
          }

          return <div key={c.id}>{card}</div>;
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          {CERTIFICATES_COPY.emptyDomain}
        </p>
      ) : null}
    </div>
  );
}
