import type { MetadataRoute } from "next";
import {
  getPublishedPosts,
  getReaderCategories,
  getReaderSettings,
} from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, settings] = await Promise.all([
    getPublishedPosts(false),
    getReaderCategories(),
    getReaderSettings(),
  ]);

  const baseUrl = (settings.siteUrl || "http://localhost:3002").replace(
    /\/$/,
    ""
  );
  const latestPostDate =
    posts.length > 0 ? new Date(posts[0].updatedAt) : new Date("2026-10-18T00:00:00.000Z");

  return [
    {
      url: baseUrl,
      lastModified: latestPostDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts
      .filter((p) => !p.noIndex)
      .map((p) => ({
        url: p.canonicalUrl || `${baseUrl}/blog/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "weekly" as const,
        priority: p.featured ? 0.95 : 0.85,
      })),
    ...categories.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: latestPostDate,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];
}
