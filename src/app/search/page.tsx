import Link from "next/link";
import { getPublishedPosts } from "@/lib/content";
import { formatDate, calculateReadingStats } from "@examblog/shared";

export default async function FullSearchPage() {
  const posts = await getPublishedPosts(false);

  return (
    <div className="space-y-6">
      <div className="space-y-1 border-b border-zinc-200 pb-5">
        <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
          Directory & Archive
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          คลังบทความทั้งหมด ({posts.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.map((post) => {
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
                อัปเดตเมื่อ {formatDate(post.updatedAt)}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
