"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Post, Category } from "@examblog/shared";
import { formatDate, calculateReadingStats } from "@examblog/shared";
import { BookmarkButton } from "@/components/bookmarks-provider";
import {
  Search,
  Clock,
  Eye,
  Heart,
  LayoutGrid,
  List,
  ArrowRight,
  X,
  SlidersHorizontal,
} from "lucide-react";

import {
  getCategoryLabel,
  getCategoryBadgeClass,
} from "@/lib/category-utils";

type SortOption = "latest" | "popular" | "claps" | "quick";

export function HomeFeedExplorer({
  posts,
  categories,
  initialQuery = "",
  initialCategory = "all",
}: {
  posts: Post[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = posts.filter((post) => {
      const matchCategory =
        selectedCategory === "all" ||
        post.categorySlug === selectedCategory ||
        post.categorySlug.startsWith(`${selectedCategory}/`);

      const matchQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        (post.focusKeyword || "").toLowerCase().includes(q);

      return matchCategory && matchQuery;
    });

    return list.sort((a, b) => {
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "claps") return (b.claps ?? 0) - (a.claps ?? 0);
      if (sortBy === "quick") {
        return (
          calculateReadingStats(a.content).words -
          calculateReadingStats(b.content).words
        );
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [posts, query, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      {/* Friendly Filter & Search Toolbar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Instant Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="พิมพ์ค้นหาบทความ หัวข้อ หรือชื่อผู้เขียน..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white pl-10 pr-9 py-2.5 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & View Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-[12.5px] text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline text-slate-400">เรียงตาม:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="latest">อัปเดตล่าสุด</option>
                <option value="popular">ยอดอ่านสูงสุด</option>
                <option value="claps">ถูกใจมากสุด</option>
                <option value="quick">อ่านจบไวสุด</option>
              </select>
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="มุมมองการ์ด"
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-2xs"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                title="มุมมองรายการ"
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-2xs"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            <span>ทั้งหมด</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[11px] ${
                selectedCategory === "all"
                  ? "bg-white/20 text-white"
                  : "bg-white text-slate-600"
              }`}
            >
              {posts.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = posts.filter(
              (p) =>
                p.categorySlug === cat.slug ||
                p.categorySlug.startsWith(`${cat.slug}/`)
            ).length;
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[11px] ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-[13px] text-slate-500 px-1">
        <span>
          แสดง <strong className="text-slate-900">{filteredPosts.length}</strong>{" "}
          บทความ
          {selectedCategory !== "all" && (
            <>
              {" "}
              ในหมวด{" "}
              <strong className="text-indigo-600">
                {getCategoryLabel(selectedCategory, categories)}
              </strong>
            </>
          )}
        </span>
        {(query || selectedCategory !== "all") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
            }}
            className="text-indigo-600 hover:underline font-medium cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <p className="text-base font-bold text-slate-800">
            ไม่พบบทความที่ตรงกับเงื่อนไขที่คุณเลือก
          </p>
          <p className="text-[13px] text-slate-500">
            ลองเปลี่ยนคำค้นหา หรือเลือกดูจากหมวดหมู่อื่นๆ
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 text-white px-4 py-2 text-[13px] font-medium hover:bg-indigo-500 transition cursor-pointer"
          >
            แสดงบทความทั้งหมด
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-5"
              : "space-y-4"
          }
        >
          {filteredPosts.map((post) => {
            const stats = calculateReadingStats(post.content);
            const categoryLabel = getCategoryLabel(
              post.categorySlug,
              categories
            );
            const badgeClass = getCategoryBadgeClass(post.categorySlug);

            return (
              <article
                key={post.id}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-[12px]">
                      {post.status !== "published" && (
                        <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 font-mono text-[11px] font-semibold">
                          ฉบับร่าง (Draft)
                        </span>
                      )}
                      <Link
                        href={`/category/${post.categorySlug}`}
                        className={`rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold transition hover:opacity-80 ${badgeClass}`}
                      >
                        {categoryLabel}
                      </Link>
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        อ่าน {stats.minutes} นาที
                      </span>
                    </div>

                    <BookmarkButton
                      slug={post.slug}
                      title={post.title}
                      compact
                    />
                  </div>

                  {/* Title & Excerpt */}
                  <div className="space-y-2">
                    <h3 className="text-[18px] font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                      <Link href={`/blog/${post.slug}`} className="block">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-[13.5px] text-slate-600 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[12px] text-slate-500">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center">
                      {post.author.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700">
                      {post.author}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span>{formatDate(post.updatedAt)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Eye className="w-3.5 h-3.5" />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      {post.claps ?? 12}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:translate-x-0.5 transition"
                    >
                      <span>อ่าน</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
