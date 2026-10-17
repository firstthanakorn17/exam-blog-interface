"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { clapPostAction } from "@/actions/reader.actions";
import { Heart } from "lucide-react";

export function ClapButton({
  slug,
  initialClaps = 12,
}: {
  slug: string;
  initialClaps?: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticClaps, addOptimisticClap] = useOptimistic<number, number>(
    initialClaps,
    (current, delta) => current + delta
  );

  const handleClap = () => {
    startTransition(async () => {
      addOptimisticClap(1);
      await clapPostAction(slug);
      toast.success("ขอบคุณสำหรับกำลังใจให้กับบทความนี้!");
    });
  };

  return (
    <button
      type="button"
      onClick={handleClap}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13px] font-medium text-zinc-800 hover:border-zinc-900 hover:bg-zinc-50 shadow-2xs transition cursor-pointer"
    >
      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
      <span>ถูกใจบทความ</span>
      <span className="font-mono text-[12px] text-zinc-500 pl-1 border-l border-zinc-200">
        {optimisticClaps}
      </span>
    </button>
  );
}
