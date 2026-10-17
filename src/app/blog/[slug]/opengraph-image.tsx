import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/content";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function ArticleOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, true);

  const title = (post?.seoTitle || post?.title || "NextBlog Editorial").slice(
    0,
    100
  );
  const category = `/${post?.categorySlug || "engineering"}`;
  const author = `By ${post?.author || "Admin First"}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          color: "#fafafa",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              color: "#e4e4e7",
            }}
          >
            NextBlog Publication
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              padding: "6px 16px",
              borderRadius: 999,
              backgroundColor: "#27272a",
              color: "#d4d4d8",
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#ffffff",
            maxWidth: "980px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #27272a",
            paddingTop: "24px",
            fontSize: 20,
            color: "#a1a1aa",
          }}
        >
          <span>{author}</span>
          <span>nextblog.example.com</span>
        </div>
      </div>
    ),
    size
  );
}
