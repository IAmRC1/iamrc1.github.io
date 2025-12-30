import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
};

export type BlogPostFull = BlogPost & {
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function toExcerpt(text: string, maxLen = 160) {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (normalized.length <= maxLen) return normalized;
  return normalized.slice(0, maxLen - 1).trimEnd() + "…";
}

function safeString(v: unknown, fallback: string) {
  return typeof v === "string" && v.trim() ? v : fallback;
}

function safeStringArray(v: unknown) {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

export async function getAllPosts(): Promise<BlogPost[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const posts = await Promise.all(
    mdFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = await fs.readFile(path.join(BLOG_DIR, filename), "utf8");
      const parsed = matter(raw);

      const title = safeString(parsed.data?.title, slug);
      const date = safeString(parsed.data?.date, "");
      const tags = safeStringArray(parsed.data?.tags);
      const excerpt = toExcerpt(parsed.content);

      const post: BlogPost = { slug, title, date, tags, excerpt };
      return post;
    })
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getPostBySlug(slug: string): Promise<BlogPostFull | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);

    const title = safeString(parsed.data?.title, slug);
    const date = safeString(parsed.data?.date, "");
    const tags = safeStringArray(parsed.data?.tags);

    return {
      slug,
      title,
      date,
      tags,
      excerpt: toExcerpt(parsed.content),
      content: parsed.content,
    };
  } catch {
    return null;
  }
}
