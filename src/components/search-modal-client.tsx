"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Post } from "@examblog/shared";
import { Search, X, ArrowRight } from "lucide-react";

export function SearchModalClient({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  if (pathname !== "/search") return null;

  const q = query.trim().toLowerCase();
  const results = posts.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      (p.focusKeyword || "").toLowerCase().includes(q)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-[2px] flex items-start justify-center pt-20 p-4"
      onClick={() => router.back()}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาบทความ, หัวข้อ หรือคีย์เวิร์ด..."
            className="w-full text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-zinc-200 p-1 text-zinc-400 hover:text-zinc-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 p-2">
          {results.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex items-start justify-between gap-4 rounded-xl p-3 hover:bg-zinc-50 transition"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="text-[13px] font-semibold text-zinc-900 truncate">
                  {post.title}
                </div>
                <p className="text-[12px] text-zinc-500 line-clamp-1">
                  {post.excerpt}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0 mt-1" />
            </a>
          ))}

          {results.length === 0 && (
            <div className="py-10 text-center text-[13px] text-zinc-400">
              ไม่พบบทความที่ตรงกับ &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
