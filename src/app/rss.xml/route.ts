import { NextResponse } from "next/server";
import { getPublishedPosts, getReaderSettings } from "@/lib/content";

export async function GET() {
  const [posts, settings] = await Promise.all([
    getPublishedPosts(false),
    getReaderSettings(),
  ]);

  const baseUrl = (settings.siteUrl || "https://nextblog.example.com").replace(
    /\/$/,
    ""
  );

  const itemsXml = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.seoTitle || post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.seoDescription || post.excerpt}]]></description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${settings.siteName}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${settings.defaultSeoDescription}]]></description>
    <language>th</language>${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
