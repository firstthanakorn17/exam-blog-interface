import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NextBlog Editorial Publication",
    short_name: "NextBlog",
    description: "Editorial & Technical Publishing Platform powered by Next.js 16",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#09090b",
  };
}
