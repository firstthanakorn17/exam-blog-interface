"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Category, SiteSettings } from "@examblog/shared";
import { useBookmarks } from "@/components/bookmarks-provider";
import {
  Search,
  Rss,
  ArrowUpRight,
  Bookmark,
  Sparkles,
  BookOpen,
  Compass,
} from "lucide-react";

export function ReaderHeader({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { bookmarkedSlugs, openDrawer } = useBookmarks();

  const rootCategories = categories.filter((c) => c.parentSlug === null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (pathname !== "/search") {
          router.push("/search");
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname, router]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand + Desktop Nav */}
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-sm flex items-center justify-center shadow-sm group-hover:scale-105 transition">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[15px] tracking-tight text-slate-900 block leading-none">
                {settings.siteName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                คลังบทความสำหรับนักพัฒนา
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full transition ${
                pathname === "/"
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              หน้าแรก
            </Link>
            <Link
              href="/category"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                pathname === "/category"
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>หมวดหมู่ทั้งหมด</span>
            </Link>
            {rootCategories.map((cat) => {
              const active = pathname.startsWith(`/category/${cat.slug}`);
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-1.5 rounded-full transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Search (Cmd+K), Saved List, RSS, Admin Console */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/search"
            className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50/90 hover:bg-white hover:border-indigo-300 px-3.5 py-1.5 text-[12.5px] text-slate-600 shadow-2xs transition"
          >
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">ค้นหาบทความ...</span>
            <kbd className="hidden md:inline-block rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </Link>

          <button
            type="button"
            onClick={openDrawer}
            title="บทความที่บันทึกไว้อ่าน"
            className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-3 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                bookmarkedSlugs.length > 0
                  ? "fill-amber-500 text-amber-600"
                  : "text-slate-500"
              }`}
            />
            <span className="hidden md:inline">ที่บันทึกไว้</span>
            {bookmarkedSlugs.length > 0 && (
              <span className="rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[11px] font-bold">
                {bookmarkedSlugs.length}
              </span>
            )}
          </button>

          <a
            href="/rss.xml"
            target="_blank"
            rel="noreferrer"
            title="ติดตามผ่าน RSS 2.0 Feed"
            className="hidden sm:inline-flex rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:text-orange-600 hover:border-orange-200 shadow-2xs transition"
          >
            <Rss className="w-3.5 h-3.5" />
          </a>

          <a
            href="http://localhost:3001/console"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 hover:bg-indigo-600 px-3.5 py-1.5 text-[12px] font-medium text-white shadow-2xs transition"
          >
            <Sparkles className="w-3 h-3 text-amber-300 hidden sm:inline" />
            <span>ระบบหลังบ้าน</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Mobile & Tablet Horizontal Category Bar */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50/70 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[12px]">
        <Link
          href="/"
          className={`shrink-0 px-3 py-1 rounded-full font-medium transition ${
            pathname === "/"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          หน้าแรก
        </Link>
        <Link
          href="/category"
          className={`shrink-0 px-3 py-1 rounded-full font-medium transition ${
            pathname === "/category"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          ทุกหมวดหมู่
        </Link>
        {categories.map((cat) => {
          const active = pathname === `/category/${cat.slug}`;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`shrink-0 px-3 py-1 rounded-full font-medium transition ${
                active
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
