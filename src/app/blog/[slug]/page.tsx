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
  extractKeywordsList,
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
  ChevronRight,
  Tag,
  Award,
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
  const [post, settings, categories] = await Promise.all([
    getPostBySlug(slug, true),
    getReaderSettings(),
    getReaderCategories(),
  ]);

  if (!post) {
    return { title: "ไม่พบบทความ" };
  }

  const baseUrl = (settings.siteUrl || "http://localhost:3002").replace(
    /\/$/,
    ""
  );
  const categoryName = getCategoryLabel(post.categorySlug, categories);
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const canonicalUrl = post.canonicalUrl || `${baseUrl}/blog/${post.slug}`;
  const ogImageUrl = `${baseUrl}/blog/${post.slug}/opengraph-image`;
  const keywords = extractKeywordsList(post, categoryName);
  const stats = calculateReadingStats(post.content);

  return {
    title,
    description,
    keywords,
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: settings.siteName,
    category: categoryName,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "th-TH": canonicalUrl,
      },
    },
    robots: post.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: settings.siteName,
      locale: "th_TH",
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: categoryName,
      tags: keywords,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: settings.twitterHandle || "@nextblog",
      images: [ogImageUrl],
    },
    other: {
      "twitter:label1": "เวลาในการอ่าน",
      "twitter:data1": `${stats.minutes} นาที (${stats.words} คำ)`,
      "twitter:label2": "หมวดหมู่",
      "twitter:data2": categoryName,
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
  const categoryName = getCategoryLabel(post.categorySlug, categories);
  const keywords = extractKeywordsList(post, categoryName);
  const jsonLd = buildBlogPostingJsonLd(post, settings, categoryName);

  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  return (
    <article
      itemScope
      itemType="https://schema.org/BlogPosting"
      className="space-y-6"
    >
      <ViewTracker slug={post.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Semantic Breadcrumb Navigation for SEO & Accessibility */}
      <nav aria-label="Breadcrumb" className="px-1">
        <ol className="flex items-center flex-wrap gap-1.5 text-[13px] text-slate-500">
          <li>
            <Link href="/" className="hover:text-indigo-600 font-medium">
              หน้าแรก
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </li>
          <li>
            <Link
              href={`/category/${post.categorySlug}`}
              className="hover:text-indigo-600 font-medium"
            >
              {categoryName}
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </li>
          <li
            aria-current="page"
            className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md"
          >
            {post.title}
          </li>
        </ol>
      </nav>

      {/* Friendly Article Hero Header */}
      <header className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-2xs space-y-5">
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
              itemProp="articleSection"
              className="rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 font-semibold text-indigo-700 hover:bg-indigo-100 transition"
            >
              หมวด: {categoryName}
            </Link>
          </div>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1
            itemProp="headline"
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            {post.title}
          </h1>

          <p
            itemProp="description"
            className="text-[16px] text-slate-600 leading-relaxed"
          >
            {post.excerpt}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[13px] text-slate-500">
          <div
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {post.author.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <span
                itemProp="name"
                className="font-bold text-slate-900 block leading-none"
              >
                {post.author}
              </span>
              <span className="text-[11px] text-slate-400">ผู้เขียนบทความ</span>
            </div>
          </div>

          <span className="text-slate-200">|</span>

          <time
            dateTime={post.updatedAt}
            itemProp="dateModified"
            className="inline-flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            อัปเดต {formatDate(post.updatedAt)}
          </time>

          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            ใช้เวลาอ่าน ~{stats.minutes} นาที ({stats.words.toLocaleString()} คำ)
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            อ่านแล้ว {post.views.toLocaleString()} ครั้ง
          </span>
        </div>
      </header>

      {/* Interactive Reader Comfort Toolbar + Article Content + TOC */}
      <ArticleReaderClient
        slug={post.slug}
        title={post.title}
        content={post.content}
        initialClaps={post.claps ?? 18}
        headings={headings}
      />

      {/* SEO Topic Keywords & Author E-E-A-T Attribution Card */}
      <section
        aria-label="คีย์เวิร์ดและข้อมูลผู้เขียน"
        className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs space-y-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-slate-700 mr-1">
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            <span>คำค้นหาที่เกี่ยวข้อง (Keywords):</span>
          </span>
          {keywords.map((kw) => (
            <Link
              key={kw}
              href={`/search?q=${encodeURIComponent(kw)}`}
              rel="tag"
              className="rounded-full border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 px-3 py-1 text-[12px] font-medium text-slate-600 transition"
            >
              #{kw}
            </Link>
          ))}
        </div>

        <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-base flex items-center justify-center shrink-0">
              {post.author.slice(0, 1).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[14.5px] font-bold text-slate-900">
                  เขียนและเรียบเรียงโดย {post.author}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10.5px] font-semibold">
                  <Award className="w-3 h-3" />
                  Verified Author (E-E-A-T)
                </span>
              </div>
              <p className="text-[12.5px] text-slate-500">
                ทีมวิศวกรซอฟต์แวร์และสถาปัตยกรรมเว็บยุคใหม่ ถ่ายทอดประสบการณ์จริงด้าน Next.js App Router, React 19 และระบบ Backend ประสิทธิภาพสูง
              </p>
            </div>
          </div>

          <Link
            href={`/category/${post.categorySlug}`}
            className="shrink-0 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-[12.5px] font-semibold text-slate-700 transition"
          >
            ดูบทความในหมวด {categoryName} ทั้งหมด
          </Link>
        </div>
      </section>

      {/* Previous / Next Article Navigation */}
      {(prevPost || nextPost) && (
        <nav
          aria-label="เปลี่ยนบทความก่อนหน้าหรือถัดไป"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
        >
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              rel="prev"
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
              rel="next"
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
