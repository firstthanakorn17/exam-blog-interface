"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RootErrorBoundary]", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto my-12 rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm space-y-5">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-2">
        <span className="inline-block rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700 uppercase tracking-wider">
          Next.js Error Boundary (error.tsx)
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          เกิดข้อผิดพลาดระหว่างการแสดงผลหน้านี้
        </h2>
        <p className="text-[13.5px] text-slate-600">
          {error.message || "ระบบตรวจพบข้อผิดพลาดที่ไม่คาดคิด กรุณาลองโหลดใหม่อีกครั้ง"}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-[13px] font-semibold transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>ลองใหม่อีกครั้ง (reset)</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 text-[13px] font-semibold transition"
        >
          <Home className="w-4 h-4" />
          <span>กลับหน้าแรก</span>
        </Link>
      </div>
    </div>
  );
}
