import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { BLOG_COPY } from "@/lib/copy/blog";

export const metadata = BLOG_COPY.metadata;

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-16 pt-10">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {BLOG_COPY.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            {BLOG_COPY.subtitle}
          </p>
        </div>

        <Link
          href="/"
          className="text-sm font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-200"
        >
          {BLOG_COPY.backHome}
        </Link>
      </header>

      <section className="mt-10">
        {posts.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {BLOG_COPY.empty}
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="app-card block rounded-3xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {post.title}
                  </p>
                  {post.date ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {post.date}
                    </p>
                  ) : null}
                </div>

                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {post.excerpt}
                </p>

                {post.tags.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
