import Link from "next/link";

import { Hero3DLazy } from "@/components/Hero3DLazy";
import { GitHubProof } from "@/components/GitHubProof";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/layout/Section";
import { HOME_COPY } from "@/lib/copy/home";
import type { BlogPost } from "@/lib/blog";
import type { StatusData } from "@/lib/status";

export function HomeIntro({
  status,
  latest,
}: {
  status: StatusData;
  latest: BlogPost | null;
}) {
  return (
    <Section id="intro" className="pt-12">
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <Reveal as="article">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {HOME_COPY.hero.roleLine}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            {HOME_COPY.hero.headline}
          </h1>
          <p className="mt-4 max-w-prose text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {HOME_COPY.hero.lead}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--app-primary))] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
            >
              {HOME_COPY.hero.ctaWork}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            >
              {HOME_COPY.hero.ctaContact}
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3">
            <article className="app-card rounded-3xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-2xl font-semibold">{HOME_COPY.stats.shippedValue}</p>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{HOME_COPY.stats.shippedLabel}</p>
            </article>
            <article className="app-card rounded-3xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-2xl font-semibold">{HOME_COPY.stats.prsValue}</p>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{HOME_COPY.stats.prsLabel}</p>
            </article>
            <Link
              href="/certificates"
              className="app-card block rounded-3xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
              aria-label={HOME_COPY.stats.certsAria}
            >
              <p className="text-2xl font-semibold">{HOME_COPY.stats.certsValue}</p>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{HOME_COPY.stats.certsLabel}</p>
            </Link>
          </div>

          <section
            className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            aria-labelledby="live-proof-title"
          >
            <h2 id="live-proof-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {HOME_COPY.liveProof.title}
            </h2>
            <section className="mt-3 grid gap-3 md:grid-cols-2" aria-label={HOME_COPY.liveProof.title}>
              {status.nowBuilding ? (
                <article className="app-card rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{HOME_COPY.liveProof.nowBuildingLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {status.nowBuilding}
                  </p>
                </article>
              ) : null}

              {latest ? (
                <Link
                  href={`/blog/${latest.slug}`}
                  className="app-card rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
                >
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{HOME_COPY.liveProof.latestJournalLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {latest.title}
                  </p>
                </Link>
              ) : null}

              {status.githubUsername ? (
                <article className="app-card rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <GitHubProof username={status.githubUsername} />
                </article>
              ) : null}

              {status.stravaWeeklyKm > 0 ? (
                <article className="app-card rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{HOME_COPY.liveProof.stravaWeekLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {status.stravaWeeklyKm} km
                  </p>
                </article>
              ) : null}
            </section>
          </section>
        </Reveal>

        <Reveal as="section" className="h-[360px] sm:h-[420px] md:h-[520px]">
          <Hero3DLazy />
        </Reveal>
      </section>
    </Section>
  );
}
