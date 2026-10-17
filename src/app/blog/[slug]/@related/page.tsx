import { Suspense } from "react";
import Link from "next/link";
import { getPublishedPosts, getReaderCategories } from "@/lib/content";
import { calculateReadingStats } from "@examblog/shared";
import { getCategoryLabel } from "@/lib/category-utils";
import { Sparkles, Clock, ArrowRight } from "lucide-react";

async function RelatedSlotContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [posts, categories] = await Promise.all([
    getPublishedPosts(false),
    getReaderCategories(),
  ]);
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs space-y-5">
      <div className="flex items-center gap-2.5 text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <span>บทความที่แนะนำให้อ่านต่อ</span>
      </div>

      <div className="space-y-3">
        {related.map((item) => (
          <Link
            key={item.id}
            href={`/blog/${item.slug}`}
            className="group block rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-300 p-4 transition space-y-2"
          >
            <div className="flex items-center justify-between text-[11.5px] text-slate-500">
              <span className="font-semibold text-indigo-600">
                {getCategoryLabel(item.categorySlug, categories)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                อ่าน {calculateReadingStats(item.content).minutes} นาที
              </span>
            </div>
            <div className="text-[14px] font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
              {item.title}
            </div>
            <div className="inline-flex items-center gap-1 text-[12px] font-semibold text-indigo-600 pt-0.5">
              <span>อ่านบทความนี้</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
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
        <div className="h-56 rounded-3xl border border-slate-200 bg-white animate-pulse" />
      }
    >
      <RelatedSlotContent params={params} />
    </Suspense>
  );
}
