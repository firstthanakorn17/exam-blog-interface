import { Suspense } from "react";
import { getCommentsBySlug } from "@/lib/content";
import { formatDate } from "@examblog/shared";
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
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5 text-[16px] font-bold text-slate-900">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span>ความคิดเห็นจากผู้อ่าน ({comments.length})</span>
        </div>
      </div>

      <CommentForm postSlug={slug} />

      <div className="space-y-3 pt-1">
        {comments.map((cmt) => (
          <div
            key={cmt.id}
            className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2"
          >
            <div className="flex items-center justify-between text-[12.5px]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center">
                  {cmt.author.slice(0, 1).toUpperCase()}
                </div>
                <span className="font-bold text-slate-900">{cmt.author}</span>
              </div>
              <span className="text-slate-400">{formatDate(cmt.createdAt)}</span>
            </div>
            <p className="text-[14px] text-slate-700 leading-relaxed pl-8">
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
        <div className="h-56 rounded-3xl border border-slate-200 bg-white animate-pulse" />
      }
    >
      <CommentsSlotContent params={params} />
    </Suspense>
  );
}
