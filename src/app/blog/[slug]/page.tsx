import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import {
  getPublishedPosts,
  getPostBySlug,
  getReaderSettings,
  getReaderCategories,
} from "@/lib/content";
import {
  formatDate,
  calculateReadingStats,
  extractHeadings,
  buildBlogPostingJsonLd,
} from "@examblog/shared";
import { ViewTracker } from "@/components/view-tracker";
import { ArticleReaderClient } from "@/components/article-reader-client";
import { getCategoryLabel } from "@/lib/category-utils";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Eye,
  Calendar,
} from "lucide-react";

export async function generateStaticParams() {
  const posts = await getPublishedPosts(false);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPostBySlug(slug, true),
    getReaderSettings(),
  ]);

  if (!post) {
    return { title: "ไม่พบบทความ" };
  }

  const baseUrl = (settings.siteUrl || "https://nextblog.example.com").replace(
    /\/$/,
    ""
  );
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title,
    description,
    keywords: post.focusKeyword
      ? post.focusKeyword.split(",").map((k) => k.trim())
      : [post.categorySlug],
    alternates: {
      canonical: post.canonicalUrl || `${baseUrl}/blog/${post.slug}`,
    },
    robots: post.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: settings.twitterHandle || "@nextblog",
    },
  };
}

async function ArticleReaderBody({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const draft = await draftMode();
  const [post, settings, categories, allPosts] = await Promise.all([
    getPostBySlug(slug, draft.isEnabled),
    getReaderSettings(),
    getReaderCategories(),
    getPublishedPosts(draft.isEnabled),
  ]);

  if (!post) {
    notFound();
  }

  const stats = calculateReadingStats(post.content);
  const headings = extractHeadings(post.content);
  const jsonLd = buildBlogPostingJsonLd(post, settings);
  const categoryName = getCategoryLabel(post.categorySlug, categories);

  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  return (
    <article className="space-y-6">
      <ViewTracker slug={post.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Friendly Article Hero Header */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับหน้าหลัก</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
            {post.status !== "published" && (
              <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-0.5 font-mono font-semibold">
                ฉบับร่าง (Draft Preview)
              </span>
            )}
            <Link
              href={`/category/${post.categorySlug}`}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 font-semibold text-indigo-700 hover:bg-indigo-100 transition"
            >
              หมวด: {categoryName}
            </Link>
          </div>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {post.title}
          </h1>

          <p className="text-[16px] text-slate-600 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[13px] text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {post.author.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <span className="font-bold text-slate-900 block leading-none">
                {post.author}
              </span>
              <span className="text-[11px] text-slate-400">ผู้เขียนบทความ</span>
            </div>
          </div>

          <span className="text-slate-200">|</span>

          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            อัปเดต {formatDate(post.updatedAt)}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            ใช้เวลาอ่าน ~{stats.minutes} นาที ({stats.words.toLocaleString()} คำ)
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            อ่านแล้ว {post.views.toLocaleString()} ครั้ง
          </span>
        </div>
      </div>

      {/* Interactive Reader Comfort Toolbar + Article Content + TOC */}
      <ArticleReaderClient
        slug={post.slug}
        title={post.title}
        content={post.content}
        initialClaps={post.claps ?? 18}
        headings={headings}
      />

      {/* Previous / Next Article Navigation */}
      {(prevPost || nextPost) && (
        <nav
          aria-label="เปลี่ยนบทความก่อนหน้าหรือถัดไป"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
        >
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-indigo-300 hover:shadow-sm transition flex flex-col justify-between gap-2"
            >
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400 group-hover:text-indigo-600">
                <ArrowLeft className="w-3.5 h-3.5" />
                บทความก่อนหน้า
              </span>
              <span className="text-[14.5px] font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-indigo-300 hover:shadow-sm transition flex flex-col justify-between gap-2 sm:text-right sm:items-end"
            >
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400 group-hover:text-indigo-600">
                <span>บทความถัดไป</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-[14.5px] font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-44 rounded-3xl bg-white border border-slate-200 animate-pulse" />
          <div className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse" />
        </div>
      }
    >
      <ArticleReaderBody params={params} />
    </Suspense>
  );
}
