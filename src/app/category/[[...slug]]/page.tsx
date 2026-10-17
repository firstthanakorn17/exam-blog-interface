import { Suspense } from "react";
import Link from "next/link";
import {
  getPublishedPosts,
  getReaderCategories,
} from "@/lib/content";
import { formatDate, calculateReadingStats } from "@nextblog/shared";
import { ChevronRight, Folder } from "lucide-react";

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

  const matchingPosts = activeSlug
    ? posts.filter(
        (p) =>
          p.categorySlug === activeSlug ||
          p.categorySlug.startsWith(`${activeSlug}/`)
      )
    : posts;

  return (
    <div className="space-y-8">
      <div className="flex items-center flex-wrap gap-1.5 text-[12px] text-zinc-500">
        <Link href="/" className="hover:text-zinc-900">
          หน้าแรก
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <Link href="/category" className="hover:text-zinc-900">
          หมวดหมู่ทั้งหมด
        </Link>
        {slug?.map((part, idx) => {
          const href = `/category/${slug.slice(0, idx + 1).join("/")}`;
          return (
            <span key={href} className="inline-flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              <Link
                href={href}
                className="font-mono text-zinc-900 font-semibold"
              >
                {part}
              </Link>
            </span>
          );
        })}
      </div>

      <div className="space-y-2 border-b border-zinc-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {currentCategory ? currentCategory.name : "หมวดหมู่บทความทั้งหมด"}
        </h1>
        <p className="text-[14px] text-zinc-600">
          {currentCategory
            ? currentCategory.description
            : "เลือกหมวดหมู่ที่สนใจเพื่ออ่านบทความเฉพาะทาง"}
        </p>

        {subCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3">
            {subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${sub.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[12px] font-medium text-zinc-700 hover:border-zinc-900 shadow-2xs transition"
              >
                <Folder className="w-3.5 h-3.5 text-zinc-400" />
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {matchingPosts.map((post) => {
          const stats = calculateReadingStats(post.content);
          return (
            <article
              key={post.id}
              className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs space-y-3"
            >
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                <span>/{post.categorySlug}</span>
                <span>·</span>
                <span>อ่าน {stats.minutes} นาที</span>
              </div>
              <h2 className="text-lg font-bold text-zinc-900">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-[13px] text-zinc-600 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="text-[11px] text-zinc-400 pt-1">
                {formatDate(post.updatedAt)}
              </div>
            </article>
          );
        })}

        {matchingPosts.length === 0 && (
          <div className="col-span-full py-12 text-center text-[13px] text-zinc-400">
            ยังไม่มีบทความในหมวดหมู่นี้
          </div>
        )}
      </div>
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
        <div className="h-64 rounded-2xl border border-zinc-200 bg-white animate-pulse" />
      }
    >
      <CategoryArchiveContent params={params} />
    </Suspense>
  );
}
