import { Suspense } from "react";
import Link from "next/link";
import {
  getPublishedPosts,
  getReaderCategories,
} from "@/lib/content";
import { HomeFeedExplorer } from "@/components/home-feed-explorer";
import { ChevronRight, Folder, Compass } from "lucide-react";

async function CategoryArchiveContent({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const activeSlug = slug && slug.length > 0 ? slug.join("/") : "";

  const [posts, categories] = await Promise.all([
    getPublishedPosts(false),
    getReaderCategories(),
  ]);

  const currentCategory = categories.find((c) => c.slug === activeSlug);
  const subCategories = categories.filter(
    (c) => c.parentSlug === (activeSlug || null)
  );

  return (
    <div className="space-y-8">
      {/* Friendly Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1.5 text-[13px] text-slate-500"
      >
        <Link href="/" className="hover:text-indigo-600 font-medium">
          หน้าแรก
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/category" className="hover:text-indigo-600 font-medium">
          หมวดหมู่ทั้งหมด
        </Link>
        {slug?.map((part, idx) => {
          const hrefSlug = slug.slice(0, idx + 1).join("/");
          const catObj = categories.find((c) => c.slug === hrefSlug);
          const href = `/category/${hrefSlug}`;
          return (
            <span key={href} className="inline-flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href={href}
                className="text-indigo-700 font-bold hover:underline"
              >
                {catObj ? catObj.name : part}
              </Link>
            </span>
          );
        })}
      </nav>

      {/* Category Hero Header */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-[12px] font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>สารบัญหมวดหมู่บทความ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {currentCategory ? currentCategory.name : "หมวดหมู่บทความทั้งหมด"}
          </h1>
          <p className="text-[14.5px] text-slate-600 max-w-2xl">
            {currentCategory
              ? currentCategory.description
              : "เลือกหมวดหมู่หลักหรือหมวดหมู่ย่อยด้านล่างเพื่ออ่านบทความเฉพาะทางที่คุณสนใจ"}
          </p>
        </div>

        {subCategories.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-[12px] font-semibold text-slate-400">
              {activeSlug ? "หมวดหมู่ย่อยภายในหมวดนี้:" : "หมวดหมู่หลัก:"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {subCategories.map((sub) => {
                const subCount = posts.filter(
                  (p) =>
                    p.categorySlug === sub.slug ||
                    p.categorySlug.startsWith(`${sub.slug}/`)
                ).length;
                return (
                  <Link
                    key={sub.id}
                    href={`/category/${sub.slug}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-300 p-4 transition flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-[14px] font-bold text-slate-900 group-hover:text-indigo-700">
                        <Folder className="w-4 h-4 text-indigo-500" />
                        <span>{sub.name}</span>
                      </div>
                      <p className="text-[12px] text-slate-500 line-clamp-1">
                        {sub.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 shrink-0">
                      {subCount}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Feed Filtered by Current Category */}
      <HomeFeedExplorer
        key={activeSlug || "all"}
        posts={posts}
        categories={categories}
        initialCategory={activeSlug || "all"}
      />
    </div>
  );
}

export default function CategoryCatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-64 rounded-3xl border border-slate-200 bg-white animate-pulse" />
      }
    >
      <CategoryArchiveContent params={params} />
    </Suspense>
  );
}
