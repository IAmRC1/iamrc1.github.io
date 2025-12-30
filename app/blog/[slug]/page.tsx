import Link from "next/link";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BLOG_COPY } from "@/lib/copy/blog";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-16 pt-10">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {post.title}
          </h1>
          {post.date ? (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {post.date}
            </p>
          ) : null}
        </div>

        <Link
          href="/blog"
          className="text-sm font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-200"
        >
          {BLOG_COPY.allPosts}
        </Link>
      </div>

      {post.tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <article className="blog-content mt-8">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>

      <div className="mt-10">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-200"
        >
          {BLOG_COPY.backHome}
        </Link>
      </div>
    </main>
  );
}
