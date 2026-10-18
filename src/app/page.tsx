import { Suspense } from "react";
import Link from "next/link";
import { draftMode } from "next/headers";
import {
  getPublishedPosts,
  getReaderCategories,
  getReaderSettings,
} from "@/lib/content";
import {
  formatDate,
  calculateReadingStats,
  buildWebSiteJsonLd,
} from "@examblog/shared";
import { HomeFeedExplorer } from "@/components/home-feed-explorer";
import { getCategoryLabel } from "@/lib/category-utils";
import { BookmarkButton } from "@/components/bookmarks-provider";
import {
  ArrowRight,
  Flame,
  Eye,
  Clock,
  Folder,
  Sparkles,
  BookOpen,
} from "lucide-react";

async function HomeFeedContent() {
  const draft = await draftMode();
  const [posts, categories, settings] = await Promise.all([
    getPublishedPosts(draft.isEnabled),
    getReaderCategories(),
    getReaderSettings(),
  ]);

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const trending = [...posts].sort((a, b) => b.views - a.views).slice(0, 4);
  const websiteJsonLd = buildWebSiteJsonLd(settings, posts);

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Featured Hero Story Card */}
      {featuredPost && (
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/35 to-violet-50/40 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 text-[12.5px]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 text-white px-3 py-1 font-semibold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>บทความแนะนำประจำสัปดาห์</span>
                </span>
                {featuredPost.status !== "published" && (
                  <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 font-mono text-[11px] font-semibold">
                    DRAFT PREVIEW
                  </span>
                )}
                <Link
                  href={`/category/${featuredPost.categorySlug}`}
                  className="rounded-full border border-indigo-200 bg-white px-3 py-0.5 font-semibold text-indigo-700 hover:bg-indigo-50 transition"
                >
                  {getCategoryLabel(featuredPost.categorySlug, categories)}
                </Link>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600 inline-flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  อ่านจบใน {calculateReadingStats(featuredPost.content).minutes} นาที
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="hover:text-indigo-600 transition"
                >
                  {featuredPost.title}
                </Link>
              </h1>

              <p className="text-[15.5px] text-slate-600 leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 text-[13.5px] font-semibold shadow-sm transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>อ่านบทความนี้เลย</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <BookmarkButton
                  slug={featuredPost.slug}
                  title={featuredPost.title}
                />

                <div className="flex items-center gap-2.5 text-[12.5px] text-slate-500 pl-1">
                  <span>
                    โดย <strong className="text-slate-800">{featuredPost.author}</strong>
                  </span>
                  <span>·</span>
                  <span>{formatDate(featuredPost.updatedAt)}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {featuredPost.views.toLocaleString()} ครั้ง
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Grid: Interactive Explorer + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <HomeFeedExplorer posts={posts} categories={categories} />
        </div>

        {/* Helpful Sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Trending Widget */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[14px] font-bold text-slate-900">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>บทความยอดฮิตติดอันดับ</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                Most Read
              </span>
            </div>

            <div className="space-y-3.5">
              {trending.map((post, idx) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-3.5 rounded-xl p-2 -mx-2 hover:bg-slate-50 transition"
                >
                  <span
                    className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      idx === 0
                        ? "bg-amber-100 text-amber-800"
                        : idx === 1
                        ? "bg-slate-200 text-slate-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 leading-snug">
                      {post.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11.5px] text-slate-400">
                      <span>{getCategoryLabel(post.categorySlug, categories)}</span>
                      <span>·</span>
                      <span>อ่าน {post.views.toLocaleString()} ครั้ง</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Guide Widget */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[14px] font-bold text-slate-900">
                <Folder className="w-4 h-4 text-indigo-500" />
                <span>เลือกอ่านตามหมวดหมู่</span>
              </div>
              <Link
                href="/category"
                className="text-[12px] font-medium text-indigo-600 hover:underline"
              >
                ดูทั้งหมด
              </Link>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => {
                const count = posts.filter(
                  (p) =>
                    p.categorySlug === cat.slug ||
                    p.categorySlug.startsWith(`${cat.slug}/`)
                ).length;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-200 px-3.5 py-2.5 transition group"
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-slate-800 group-hover:text-indigo-700">
                        {cat.name}
                      </div>
                      <div className="text-[11.5px] text-slate-500 line-clamp-1">
                        {cat.description}
                      </div>
                    </div>
                    <span className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 shrink-0">
                      {count} บทความ
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Tip Card */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-[12.5px] text-slate-600 space-y-1.5">
            <div className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>เคล็ดลับการใช้งานไว</span>
            </div>
            <p className="leading-relaxed">
              กดปุ่ม <kbd className="rounded bg-white border border-slate-200 px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd> หรือ <kbd className="rounded bg-white border border-slate-200 px-1.5 py-0.5 font-mono text-[11px]">Ctrl+K</kbd> ได้จากทุกหน้าเพื่อค้นหาบทความทันที หรือกดปุ่ม <strong>บันทึกไว้อ่าน</strong> เพื่อเก็บเข้าคลังส่วนตัวของคุณ
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function ReaderHomePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-64 rounded-3xl bg-white border border-slate-200 animate-pulse" />
          <div className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse" />
        </div>
      }
    >
      <HomeFeedContent />
    </Suspense>
  );
}
