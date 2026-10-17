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

  const baseUrl = (settings.siteUrl || "https://nextblog.example.com").replace(
    /\/$/,
    ""
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts
      .filter((p) => !p.noIndex)
      .map((p) => ({
        url: p.canonicalUrl || `${baseUrl}/blog/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "weekly" as const,
        priority: p.featured ? 0.9 : 0.7,
      })),
    ...categories.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
