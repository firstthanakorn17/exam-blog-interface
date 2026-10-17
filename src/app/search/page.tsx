import {
  getPublishedPosts,
  getReaderCategories,
} from "@/lib/content";
import { HomeFeedExplorer } from "@/components/home-feed-explorer";
import { Search } from "lucide-react";

export default async function FullSearchPage() {
  const [posts, categories] = await Promise.all([
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

      <HomeFeedExplorer posts={posts} categories={categories} />
    </div>
  );
}
