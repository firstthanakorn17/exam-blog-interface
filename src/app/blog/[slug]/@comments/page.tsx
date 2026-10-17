import { Suspense } from "react";
import { getCommentsBySlug } from "@/lib/content";
import { formatDate } from "@nextblog/shared";
import { CommentForm } from "@/components/comment-form";
import { MessageSquare } from "lucide-react";

async function CommentsSlotContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comments = await getCommentsBySlug(slug);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[15px] font-bold text-zinc-900">
        <MessageSquare className="w-4 h-4 text-zinc-500" />
        <span>ความคิดเห็นจากผู้อ่าน ({comments.length})</span>
      </div>

      <CommentForm postSlug={slug} />

      <div className="space-y-3">
        {comments.map((cmt) => (
          <div
            key={cmt.id}
            className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xs space-y-1.5"
          >
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-zinc-900">{cmt.author}</span>
              <span className="text-zinc-400">{formatDate(cmt.createdAt)}</span>
            </div>
            <p className="text-[13.5px] text-zinc-700 leading-relaxed">
              {cmt.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommentsSlotPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-56 rounded-2xl border border-zinc-200 bg-white animate-pulse" />
      }
    >
      <CommentsSlotContent params={params} />
    </Suspense>
  );
}
