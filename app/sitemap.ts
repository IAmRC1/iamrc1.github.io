import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

function safeDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const now = new Date();

  const posts = await getAllPosts();

  const base: MetadataRoute.Sitemap = [
    {
      url: new URL("/", site).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/blog", site).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: new URL("/certificates", site).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: new URL(`/blog/${p.slug}`, site).toString(),
    lastModified: safeDate(p.date) ?? now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...base, ...blogEntries];
}
