"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function PracticeTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mountedAt] = useState(() => new Date().toLocaleTimeString("th-TH"));

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-[12px] text-emerald-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Next.js <code className="font-mono font-bold">template.tsx</code>{" "}
            Active — สร้าง Instance ใหม่และล้าง State อัตโนมัติเมื่อเปลี่ยน Route Segment
          </span>
        </div>
        <span className="font-mono text-[11px] bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 text-emerald-800">
          Mounted at: {mountedAt}
        </span>
      </div>
      {children}
    </div>
  );
}
