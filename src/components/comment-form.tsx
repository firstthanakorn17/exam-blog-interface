"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  addCommentAction,
  type CommentActionState,
} from "@/actions/reader.actions";
import { Send } from "lucide-react";

const initialState: CommentActionState = {};

export function CommentForm({ postSlug }: { postSlug: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    addCommentAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success("โพสต์ความคิดเห็นเรียบร้อยแล้ว");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-4 space-y-3"
    >
      <input type="hidden" name="postSlug" value={postSlug} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          name="author"
          required
          placeholder="ชื่อของคุณ *"
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none shadow-2xs"
        />
      </div>

      <textarea
        name="body"
        rows={3}
        required
        placeholder="ร่วมแลกเปลี่ยนความคิดเห็นเกี่ยวกับบทความนี้..."
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none shadow-2xs"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-[12px] font-medium text-white hover:bg-zinc-800 disabled:opacity-50 shadow-2xs transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          {isPending ? "กำลังส่ง..." : "ส่งความคิดเห็น"}
        </button>
      </div>
    </form>
  );
}
