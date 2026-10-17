import { Suspense } from "react";
import Link from "next/link";
import { draftMode } from "next/headers";
import {
  getPublishedPosts,
  getReaderCategories,
  getReaderSettings,
} from "@/lib/content";
import { formatDate, calculateReadingStats } from "@examblog/shared";
import { ArrowRight, Flame, Eye, Clock, Folder } from "lucide-react";

async function HomeFeedContent() {
  const draft = await draftMode();
  const [posts, categories, settings] = await Promise.all([
    getPublishedPosts(draft.isEnabled),
    getReaderCategories(),
    getReaderSettings(),
  ]);

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const restPosts = posts.filter((p) => p.id !== featuredPost?.id);
  const trending = [...posts].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Editorial Hero Banner */}
      <section className="space-y-3 border-b border-zinc-200/80 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-mono text-zinc-600 shadow-2xs">
          <span>{settings.siteName} Editorial</span>
          <span>·</span>
          <span>Next.js 16 App Router</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          {settings.tagline}
        </h1>
        <p className="text-[15px] text-zinc-600 max-w-2xl leading-relaxed">
          {settings.defaultSeoDescription}
        </p>
      </section>

      {/* Featured Lead Story */}
      {featuredPost && (
        <section className="rounded-3xl border border-zinc-200/90 bg-white p-7 sm:p-10 shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center gap-2.5 text-[12px]">
            <span className="rounded-full bg-zinc-900 text-white px-3 py-0.5 font-medium">
              บทความแนะนำ (Featured)
            </span>
            {featuredPost.status !== "published" && (
              <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 font-mono text-[11px]">
                DRAFT PREVIEW
              </span>
            )}
            <Link
              href={`/category/${featuredPost.categorySlug}`}
              className="font-mono text-zinc-500 hover:text-zinc-900"
            >
              /{featuredPost.categorySlug}
            </Link>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              อ่าน {calculateReadingStats(featuredPost.content).minutes} นาที
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-snug">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="hover:underline"
              >
                {featuredPost.title}
              </Link>
            </h2>
            <p className="text-[15px] text-zinc-600 leading-relaxed">
              {featuredPost.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-100 text-[12px] text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="font-medium text-zinc-900">
                โดย {featuredPost.author}
              </span>
              <span>·</span>
              <span>{formatDate(featuredPost.updatedAt)}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {featuredPost.views.toLocaleString()} ครั้ง
              </span>
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 hover:underline"
            >
              <span>อ่านบทความฉบับเต็ม</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Main Content Grid + Trending & Taxonomy Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            บทความล่าสุด ({restPosts.length})
          </h3>

          <div className="space-y-4">
            {restPosts.map((post) => {
              const stats = calculateReadingStats(post.content);
              return (
                <article
                  key={post.id}
                  className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs space-y-3 hover:border-zinc-300 transition"
                >
                  <div className="flex items-center gap-2.5 text-[11px] text-zinc-500">
                    {post.status !== "published" && (
                      <span className="rounded bg-amber-100 text-amber-800 px-2 py-0.5 font-mono font-semibold">
                        DRAFT
                      </span>
                    )}
                    <Link
                      href={`/category/${post.categorySlug}`}
                      className="font-mono text-zinc-600 hover:underline"
                    >
                      /{post.categorySlug}
                    </Link>
                    <span>·</span>
                    <span>อ่าน {stats.minutes} นาที</span>
                    <span>·</span>
                    <span>{formatDate(post.updatedAt)}</span>
                  </div>

                  <h4 className="text-lg font-bold tracking-tight text-zinc-900">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h4>

                  <p className="text-[13.5px] text-zinc-600 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Trending Widget */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-900 border-b border-zinc-100 pb-3">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>บทความยอดนิยม (Trending)</span>
            </div>

            <div className="space-y-3.5">
              {trending.map((post, idx) => (
                <div key={post.id} className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-zinc-300 pt-0.5">
                    0{idx + 1}
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[13px] font-medium text-zinc-900 hover:underline line-clamp-2 block"
                    >
                      {post.title}
                    </Link>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {post.views.toLocaleString()} views
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Tree Widget */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-900 border-b border-zinc-100 pb-3">
              <Folder className="w-4 h-4 text-zinc-500" />
              <span>หมวดหมู่ทั้งหมด</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5 py-1 text-[12px] text-zinc-700 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
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
          <div className="h-36 rounded-2xl bg-zinc-200/60 animate-pulse" />
          <div className="h-64 rounded-3xl bg-white border border-zinc-200 animate-pulse" />
        </div>
      }
    >
      <HomeFeedContent />
    </Suspense>
  );
}
