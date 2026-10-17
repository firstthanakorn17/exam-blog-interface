"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SharedMarkdownProse } from "@examblog/shared";
import { BookmarkButton } from "@/components/bookmarks-provider";
import { ClapButton } from "@/components/clap-button";
import {
  List,
  Share2,
  Check,
  Type,
  Sun,
  Moon,
  BookOpen,
  ArrowUp,
  ChevronDown,
} from "lucide-react";

type FontSizeScale = "sm" | "md" | "lg";
type ReadingSurface = "light" | "sepia" | "dark";

export function ArticleReaderClient({
  slug,
  title,
  content,
  initialClaps,
  headings,
}: {
  slug: string;
  title: string;
  content: string;
  initialClaps: number;
  headings: Array<{ id: string; text: string; level: number }>;
}) {
  const [fontScale, setFontScale] = useState<FontSizeScale>("md");
  const [surface, setSurface] = useState<ReadingSurface>("light");
  const [copied, setCopied] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Fallback for browsers without CSS scroll-driven animation support (scroll-progress-indicator guide)
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof CSS === "undefined" ||
      CSS.supports("animation-timeline", "scroll()")
    ) {
      return;
    }

    const progress = document.querySelector<HTMLElement>("#reading-progress");
    if (!progress) return;

    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const ratio =
        scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("คัดลอกลิงก์บทความไปยังคลิปบอร์ดแล้ว");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("ไม่สามารถคัดลอกลิงก์ได้");
    }
  };

  const surfaceClasses: Record<ReadingSurface, string> = {
    light: "bg-white border-slate-200/90 text-slate-900",
    sepia: "bg-[#fbf7ee] border-[#e6dec8] text-[#3c332a]",
    dark: "bg-slate-900 border-slate-800 text-slate-100 [&_h2]:text-white [&_h3]:text-slate-100 [&_p]:text-slate-300",
  };

  const fontSizeClasses: Record<FontSizeScale, string> = {
    sm: "text-[14px] [&_p]:text-[14px] [&_p]:leading-7",
    md: "text-[15.5px] [&_p]:text-[15.5px] [&_p]:leading-8",
    lg: "text-[17.5px] [&_p]:text-[17.5px] [&_p]:leading-9",
  };

  return (
    <>
      {/* Decorative visual scroll progress bar (aria-hidden="true" per modern-web-guidance) */}
      <div
        id="reading-progress"
        aria-hidden="true"
        className="fixed top-0 left-0 z-50 h-1 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-amber-500"
      />

      {/* Reader Comfort & Action Toolbar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:px-5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ClapButton slug={slug} initialClaps={initialClaps} />
          <BookmarkButton slug={slug} title={title} />
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-3.5 py-2 text-[13px] font-medium text-slate-700 transition cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4 text-slate-400" />
            )}
            <span>{copied ? "คัดลอกลิงก์แล้ว" : "แชร์บทความ"}</span>
          </button>
        </div>

        {/* Reading Comfort Controls (Font Size + Theme Surface) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 text-[12px]">
            <span className="px-2 text-slate-400 inline-flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ขนาดตัวอักษร</span>
            </span>
            <button
              type="button"
              onClick={() => setFontScale("sm")}
              className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                fontScale === "sm"
                  ? "bg-white text-indigo-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontScale("md")}
              className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                fontScale === "md"
                  ? "bg-white text-indigo-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontScale("lg")}
              className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                fontScale === "lg"
                  ? "bg-white text-indigo-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              A+
            </button>
          </div>

          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 text-[12px]">
            <button
              type="button"
              onClick={() => setSurface("light")}
              title="พื้นหลังสว่างปกติ"
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition cursor-pointer ${
                surface === "light"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden md:inline">สว่าง</span>
            </button>
            <button
              type="button"
              onClick={() => setSurface("sepia")}
              title="โหมดถนอมสายตา (Sepia)"
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition cursor-pointer ${
                surface === "sepia"
                  ? "bg-[#f5ebd6] text-[#5b4636] shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ถนอมสายตา</span>
            </button>
            <button
              type="button"
              onClick={() => setSurface("dark")}
              title="โหมดมืด (Dark)"
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition cursor-pointer ${
                surface === "dark"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">มืด</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Table of Contents */}
      {headings.length > 0 && (
        <div className="lg:hidden rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileTocOpen((v) => !v)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-[13.5px] font-bold text-slate-800 cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <List className="w-4 h-4 text-indigo-600" />
              <span>สารบัญบทความ ({headings.length} หัวข้อ)</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition ${
                mobileTocOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {mobileTocOpen && (
            <ul className="px-5 pb-4 pt-1 space-y-2 border-t border-slate-100 text-[13px]">
              {headings.map((h) => (
                <li
                  key={h.id}
                  style={{ paddingLeft: `${(h.level - 1) * 10}px` }}
                >
                  <a
                    href={`#${h.id}`}
                    onClick={() => setMobileTocOpen(false)}
                    className="text-slate-600 hover:text-indigo-600 py-1 block"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Main Article Body + Sticky Desktop Table of Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div
          className={`lg:col-span-8 rounded-3xl border p-6 sm:p-10 shadow-2xs transition-colors ${surfaceClasses[surface]} ${fontSizeClasses[fontScale]}`}
        >
          <SharedMarkdownProse content={content} />

          {/* Bottom Engagement Callout inside Paper */}
          <div className="mt-10 pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-[14px] font-bold">
                บทความนี้เป็นประโยชน์กับคุณไหม?
              </p>
              <p className="text-[12.5px] opacity-75">
                กดถูกใจเพื่อเป็นกำลังใจให้ผู้เขียน หรือบันทึกเก็บไว้อ่านทบทวนได้
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ClapButton slug={slug} initialClaps={initialClaps} />
              <BookmarkButton slug={slug} title={title} />
            </div>
          </div>
        </div>

        <aside className="hidden lg:block lg:col-span-4 space-y-5 sticky top-24">
          {headings.length > 0 && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900 border-b border-slate-100 pb-3">
                <List className="w-4 h-4 text-indigo-600" />
                <span>สารบัญหัวข้อในบทความ</span>
              </div>
              <ul className="space-y-2 text-[13px]">
                {headings.map((h) => (
                  <li
                    key={h.id}
                    style={{ paddingLeft: `${(h.level - 1) * 10}px` }}
                  >
                    <a
                      href={`#${h.id}`}
                      className="text-slate-600 hover:text-indigo-600 hover:translate-x-0.5 transition block truncate py-0.5"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-indigo-600 transition cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>กลับขึ้นด้านบนสุด</span>
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
