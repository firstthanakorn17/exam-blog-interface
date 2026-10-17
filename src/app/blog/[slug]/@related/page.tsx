import { Suspense } from "react";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/content";
import { calculateReadingStats } from "@nextblog/shared";
import { Sparkles } from "lucide-react";

async function RelatedSlotContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getPublishedPosts(false);
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[15px] font-bold text-zinc-900">
        <Sparkles className="w-4 h-4 text-zinc-500" />
        <span>บทความที่เกี่ยวข้อง</span>
      </div>

      <div className="space-y-3">
        {related.map((item) => (
          <Link
            key={item.id}
            href={`/blog/${item.slug}`}
            className="block rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xs hover:border-zinc-400 transition space-y-1.5"
          >
            <div className="text-[11px] font-mono text-zinc-400">
              /{item.categorySlug} · อ่าน{" "}
              {calculateReadingStats(item.content).minutes} นาที
            </div>
            <div className="text-[13.5px] font-semibold text-zinc-900 leading-snug">
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function RelatedSlotPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-56 rounded-2xl border border-zinc-200 bg-white animate-pulse" />
      }
    >
      <RelatedSlotContent params={params} />
    </Suspense>
  );
}
