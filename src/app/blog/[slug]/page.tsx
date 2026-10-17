import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import {
  getPublishedPosts,
  getPostBySlug,
  getReaderSettings,
} from "@/lib/content";
import {
  formatDate,
  calculateReadingStats,
  extractHeadings,
  buildBlogPostingJsonLd,
  SharedMarkdownProse,
} from "@examblog/shared";
import { ClapButton } from "@/components/clap-button";
import { ViewTracker } from "@/components/view-tracker";
import { ArrowLeft, Clock, Eye, List } from "lucide-react";

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
  const [post, settings] = await Promise.all([
    getPostBySlug(slug, draft.isEnabled),
    getReaderSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const stats = calculateReadingStats(post.content);
  const headings = extractHeadings(post.content);
  const jsonLd = buildBlogPostingJsonLd(post, settings);

  return (
    <article className="space-y-8">
      <ViewTracker slug={post.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb & Meta Header */}
      <div className="space-y-4 border-b border-zinc-200/80 pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          กลับไปหน้าบทความทั้งหมด
        </Link>

        <div className="flex flex-wrap items-center gap-2.5 text-[12px]">
          {post.status !== "published" && (
            <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-0.5 font-mono font-semibold">
              DRAFT MODE PREVIEW
            </span>
          )}
          <Link
            href={`/category/${post.categorySlug}`}
            className="rounded-full border border-zinc-200 bg-white px-3 py-0.5 font-mono text-zinc-700 hover:border-zinc-900 transition"
          >
            /{post.categorySlug}
          </Link>
          <span className="text-zinc-300">·</span>
          <span className="inline-flex items-center gap-1 text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            อ่าน {stats.minutes} นาที ({stats.words} คำ)
          </span>
          <span className="text-zinc-300">·</span>
          <span className="inline-flex items-center gap-1 text-zinc-500">
            <Eye className="w-3.5 h-3.5" />
            {post.views.toLocaleString()} ครั้ง
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight max-w-3xl">
          {post.title}
        </h1>

        <p className="text-[16px] text-zinc-600 leading-relaxed max-w-3xl">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-[13px] text-zinc-600">
            เขียนโดย <strong className="text-zinc-900">{post.author}</strong> ·
            อัปเดตล่าสุด {formatDate(post.updatedAt)}
          </div>

          <ClapButton slug={post.slug} initialClaps={post.claps ?? 18} />
        </div>
      </div>

      {/* Article Body + Auto Table of Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200/90 bg-white p-7 sm:p-9 shadow-2xs">
          <SharedMarkdownProse content={post.content} />
        </div>

        <aside className="lg:col-span-4 space-y-5">
          {headings.length > 0 && (
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-2xs space-y-3 sticky top-24">
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-2.5">
                <List className="w-3.5 h-3.5" />
                <span>สารบัญบทความ (Table of Contents)</span>
              </div>
              <ul className="space-y-2 text-[13px]">
                {headings.map((h) => (
                  <li
                    key={h.id}
                    style={{ paddingLeft: `${(h.level - 1) * 10}px` }}
                  >
                    <a
                      href={`#${h.id}`}
                      className="text-zinc-600 hover:text-zinc-900 hover:underline block truncate"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
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
          <div className="h-44 rounded-2xl bg-white border border-zinc-200 animate-pulse" />
          <div className="h-96 rounded-2xl bg-white border border-zinc-200 animate-pulse" />
        </div>
      }
    >
      <ArticleReaderBody params={params} />
    </Suspense>
  );
}
