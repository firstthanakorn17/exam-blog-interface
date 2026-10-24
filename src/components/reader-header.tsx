"use client";

import { useEffect } from "react";
import Link, { useLinkStatus } from "next/link";
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
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
  Timer,
  CalendarDays,
  Calculator,
  Lock,
} from "lucide-react";

function LinkPendingHint() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      aria-hidden="true"
      className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1 shrink-0"
    />
  );
}

export function ReaderHeader({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
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

  const featureLinks = [
    {
      href: "/practice",
      seg: "practice",
      label: "จำลองสอบจับเวลา",
      icon: Timer,
    },
    {
      href: "/calendar",
      seg: "calendar",
      label: "ปฏิทินสอบ",
      icon: CalendarDays,
    },
    {
      href: "/calculator",
      seg: "calculator",
      label: "คำนวณคะแนน",
      icon: Calculator,
    },
    {
      href: "/vault",
      seg: "vault",
      label: "คลังข้อสอบ VIP",
      icon: Lock,
    },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand + Desktop Nav */}
        <div className="flex items-center gap-5 min-w-0">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-sm flex items-center justify-center shadow-sm group-hover:scale-105 transition">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[15px] tracking-tight text-slate-900 block leading-none">
                {settings.siteName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                ศูนย์รวมข่าวสอบ & คลังข้อสอบ
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-[12.5px] font-medium">
            <Link
              href="/"
              className={`inline-flex items-center px-3 py-1.5 rounded-full transition ${
                segment === null
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span>หน้าแรก</span>
              <LinkPendingHint />
            </Link>

            {featureLinks.map((item) => {
              const Icon = item.icon;
              const isActive = segment === item.seg;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  <LinkPendingHint />
                </Link>
              );
            })}

            <Link
              href="/category"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                segment === "category"
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>หมวดหมู่</span>
              <LinkPendingHint />
            </Link>
          </nav>
        </div>

        {/* Right Actions: Search (Cmd+K), Saved List, RSS, Admin Console */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/search"
            className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50/90 hover:bg-white hover:border-indigo-300 px-3.5 py-1.5 text-[12.5px] text-slate-600 shadow-2xs transition"
          >
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">ค้นหา...</span>
            <kbd className="hidden md:inline-block rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
            <LinkPendingHint />
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
            <span>หลังบ้าน</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Mobile & Sub-bar with Feature Links & Categories */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11.5px]">
        <div className="flex lg:hidden items-center gap-1.5 pr-2 border-r border-slate-200">
          {featureLinks.map((item) => {
            const Icon = item.icon;
            const isActive = segment === item.seg;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
                <LinkPendingHint />
              </Link>
            );
          })}
        </div>
        <div className="max-w-6xl mx-auto w-full flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">
            หมวดข่าวสอบ:
          </span>
          {rootCategories.map((cat) => {
            const active = pathname.startsWith(`/category/${cat.slug}`);
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full font-medium transition ${
                  active
                    ? "bg-indigo-100 text-indigo-800 font-semibold"
                    : "bg-white border border-slate-200/80 text-slate-600 hover:border-indigo-200 hover:text-indigo-700"
                }`}
              >
                <span>{cat.name}</span>
                <LinkPendingHint />
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
