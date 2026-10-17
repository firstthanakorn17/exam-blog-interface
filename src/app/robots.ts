import type { MetadataRoute } from "next";
import { getReaderSettings } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getReaderSettings();
  const baseUrl = (settings.siteUrl || "https://nextblog.example.com").replace(
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
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
