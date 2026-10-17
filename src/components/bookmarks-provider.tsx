"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Post } from "@examblog/shared";
import { Bookmark, X, Trash2, ArrowRight, BookOpen } from "lucide-react";

interface BookmarksContextValue {
  bookmarkedSlugs: string[];
  isBookmarked: (slug: string) => boolean;
  toggleBookmark: (slug: string, title?: string) => void;
  openDrawer: () => void;
}

const BookmarksContext = createContext<BookmarksContextValue>({
  bookmarkedSlugs: [],
  isBookmarked: () => false,
  toggleBookmark: () => {},
  openDrawer: () => {},
});

const STORAGE_KEY = "examblog:bookmarks";

export function BookmarksProvider({
  posts,
  children,
}: {
  posts: Post[];
  children: React.ReactNode;
}) {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setBookmarkedSlugs(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => bookmarkedSlugs.includes(slug),
    [bookmarkedSlugs]
  );

  const toggleBookmark = useCallback((slug: string, title?: string) => {
    setBookmarkedSlugs((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [slug, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      if (exists) {
        toast("นำออกจากรายการที่บันทึกแล้ว", {
          description: title,
        });
      } else {
        toast.success("บันทึกบทความไว้อ่านภายหลังแล้ว", {
          description: title,
        });
      }
      return next;
    });
  }, []);

  const savedPosts = posts.filter((p) => bookmarkedSlugs.includes(p.slug));

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedSlugs,
        isBookmarked,
        toggleBookmark,
        openDrawer: () => setDrawerOpen(true),
      }}
    >
      {children}

      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="รายการบทความที่บันทึกไว้"
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Bookmark className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-slate-900">
                      รายการที่บันทึกไว้อ่าน ({savedPosts.length})
                    </h2>
                    <p className="text-[12px] text-slate-500">
                      เก็บไว้อ่านต่อได้ทุกเมื่อบนเบราว์เซอร์นี้
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {savedPosts.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[14px] font-semibold text-slate-700">
                      ยังไม่มีบทความที่บันทึกไว้
                    </p>
                    <p className="text-[12.5px] text-slate-500 max-w-xs mx-auto">
                      กดปุ่มรูปที่คั่นหนังสือ (Bookmark) บนการ์ดหรือในหน้าบทความ เพื่อเก็บไว้อ่านภายหลัง
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-slate-300 p-4 transition space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/blog/${post.slug}`}
                          onClick={() => setDrawerOpen(false)}
                          className="text-[14px] font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug"
                        >
                          {post.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(post.slug, post.title)}
                          title="ลบออกจากรายการที่บันทึก"
                          className="text-slate-400 hover:text-rose-600 p-1 shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[12px] text-slate-500 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                        <span>โดย {post.author}</span>
                        <Link
                          href={`/blog/${post.slug}`}
                          onClick={() => setDrawerOpen(false)}
                          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
                        >
                          <span>อ่านต่อ</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-400">
              <span>รายการอ่านส่วนตัว (Local Storage)</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarksContext);
}

export function BookmarkButton({
  slug,
  title,
  compact = false,
}: {
  slug: string;
  title?: string;
  compact?: boolean;
}) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(slug, title);
      }}
      title={saved ? "นำออกจากรายการอ่าน" : "บันทึกไว้อ่านภายหลัง"}
      className={`inline-flex items-center gap-1.5 rounded-full border transition cursor-pointer ${
        compact ? "p-2 text-[12px]" : "px-3.5 py-2 text-[13px] font-medium"
      } ${
        saved
          ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      <Bookmark
        className={`w-4 h-4 ${
          saved ? "fill-amber-500 text-amber-600" : "text-slate-400"
        }`}
      />
      {!compact && <span>{saved ? "บันทึกแล้ว" : "บันทึกไว้อ่าน"}</span>}
    </button>
  );
}
