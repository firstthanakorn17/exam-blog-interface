import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getPublishedPosts,
  getReaderCategories,
  getReaderSettings,
} from "@/lib/content";
import { HomeFeedExplorer } from "@/components/home-feed-explorer";
import { Search } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getReaderSettings();
  const baseUrl = (settings.siteUrl || "http://localhost:3002").replace(
    /\/$/,
    ""
  );
  return {
    title: "ค้นหาและสารบัญคลังบทความทั้งหมด",
    description: `ค้นหาบทความวิชาการ คู่มือ Next.js 16, React 19 และสถาปัตยกรรมระบบทั้งหมดจาก ${settings.siteName}`,
    alternates: {
      canonical: `${baseUrl}/search`,
    },
  };
}

async function SearchDirectoryContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, posts, categories] = await Promise.all([
    searchParams,
    getPublishedPosts(false),
    getReaderCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-[12px] font-semibold">
          <Search className="w-3.5 h-3.5" />
          <span>ค้นหาและสำรวจคลังบทความ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          คลังบทความทั้งหมด ({posts.length} บทความ)
        </h1>
        <p className="text-[14.5px] text-slate-600">
          พิมพ์คำค้นหา กรองตามหมวดหมู่ หรือจัดเรียงตามความนิยมได้ทันทีด้านล่าง
        </p>
      </div>

      <HomeFeedExplorer
        key={q || "all"}
        posts={posts}
        categories={categories}
        initialQuery={q || ""}
      />
    </div>
  );
}

export default function FullSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-64 rounded-3xl border border-slate-200 bg-white animate-pulse" />
      }
    >
      <SearchDirectoryContent searchParams={searchParams} />
    </Suspense>
  );
}
