import Image from "next/image";
import Link from "next/link";

import { Greeting } from "@/components/Greeting";
import { NavWeatherBadge } from "@/components/NavWeatherBadge";
import { ThemeControls } from "@/components/ThemeControls";
import { BLOG_COPY } from "@/lib/copy/blog";
import { SITE } from "@/lib/site";

export function HomeHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
      <nav aria-label="Primary" className="mx-auto w-full max-w-6xl px-5 py-3">
        <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <Image
                src={SITE.brand.logoPath}
                alt={SITE.author.name}
                width={36}
                height={36}
                priority
              />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {SITE.author.name}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <Greeting />
              </span>
            </span>
            </Link>

            <div className="flex items-center gap-2 sm:hidden">
              <Link
                href="/blog"
                className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                aria-label={BLOG_COPY.title}
              >
                {BLOG_COPY.title}
              </Link>
              <div className="shrink-0">
                <ThemeControls />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <NavWeatherBadge />
          </div>

          <div className="hidden items-center justify-end gap-2 sm:flex">
            <Link
              href="/blog"
              className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              aria-label={BLOG_COPY.title}
            >
              {BLOG_COPY.title}
            </Link>
            <div className="shrink-0">
              <ThemeControls />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
