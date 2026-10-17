"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Post } from "@examblog/shared";
import { calculateReadingStats } from "@examblog/shared";
import { Search, X, ArrowRight, Clock, Sparkles } from "lucide-react";

const QUICK_KEYWORDS = ["Next.js 16", "use cache", "Parallel Routes", "React 19", "SEO"];

export function SearchModalClient({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const isOpen = pathname === "/search";
  const q = query.trim().toLowerCase();
  const results = posts.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      (p.focusKeyword || "").toLowerCase().includes(q)
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        router.back();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          results.length > 0 ? (prev + 1) % results.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          results.length > 0 ? (prev - 1 + results.length) % results.length : 0
        );
      } else if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        router.push(`/blog/${results[activeIndex].slug}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, activeIndex, router]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ค้นหาบทความด่วน"
      className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4"
      onClick={() => router.back()}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="พิมพ์ชื่อบทความ หัวข้อ หรือคีย์เวิร์ดที่ต้องการค้นหา..."
            className="w-full text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 cursor-pointer"
            >
              ล้างคำ
            </button>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            title="ปิดหน้าต่าง (Esc)"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
          >
            <span>ESC</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Keyword Suggestion Chips */}
        <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-[12px]">
          <span className="inline-flex items-center gap-1 text-slate-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>คำค้นยอดฮิต:</span>
          </span>
          {QUICK_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => setQuery(kw)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer ${
                query.toLowerCase() === kw.toLowerCase()
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2.5 space-y-1">
          {results.map((post, idx) => {
            const stats = calculateReadingStats(post.content);
            const active = idx === activeIndex;
            return (
              <button
                key={post.id}
                type="button"
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => router.push(`/blog/${post.slug}`)}
                className={`w-full text-left flex items-start justify-between gap-4 rounded-2xl p-3.5 transition cursor-pointer ${
                  active ? "bg-indigo-50/80 text-indigo-950" : "hover:bg-slate-50"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="text-[14px] font-bold text-slate-900 truncate">
                    {post.title}
                  </div>
                  <p className="text-[12.5px] text-slate-500 line-clamp-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                    <span>โดย {post.author}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      อ่าน {stats.minutes} นาที
                    </span>
                  </div>
                </div>
                <ArrowRight
                  className={`w-4 h-4 shrink-0 mt-1 transition ${
                    active
                      ? "text-indigo-600 translate-x-0.5"
                      : "text-slate-300"
                  }`}
                />
              </button>
            );
          })}

          {results.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-[14px] font-semibold text-slate-700">
                ไม่พบบทความที่ตรงกับ &ldquo;{query}&rdquo;
              </p>
              <p className="text-[12px] text-slate-400">
                ลองใช้คำค้นหาอื่น หรือเลือกจากคำค้นยอดฮิตด้านบน
              </p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11.5px] text-slate-400">
          <span>ใช้ปุ่มลูกศร ↑↓ เพื่อเลื่อน และกด Enter เพื่อเปิดอ่าน</span>
          <span>พบ {results.length} บทความ</span>
        </div>
      </div>
    </div>
  );
}
