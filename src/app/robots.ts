import type { MetadataRoute } from "next";
import { getReaderSettings } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getReaderSettings();
  const baseUrl = (settings.siteUrl || "http://localhost:3002").replace(
    /\/$/,
    ""
  );

  if (settings.maintenanceMode) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: [
          "*",
          "Googlebot",
          "Googlebot-Image",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
        ],
        allow: ["/", "/blog/", "/category/", "/rss.xml"],
        disallow: ["/api/"],
      },
    ],
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
