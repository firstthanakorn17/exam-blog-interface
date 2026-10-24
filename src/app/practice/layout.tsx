import Link from "next/link";
import { PRACTICE_EXAM_SETS } from "@/lib/exam-features-data";
import { Timer, Sparkles } from "lucide-react";

export const instant = true;

export default function PracticeLayout(props: LayoutProps<"/practice">) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-[11px] font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                Next.js 16 LayoutProps + template.tsx + React 19 Activity & useEffectEvent
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Timer className="w-7 h-7 text-amber-400 shrink-0" />
              <span>ห้องจำลองสอบจับเวลาเสมือนจริง (Mock Exam Simulator)</span>
            </h1>
            <p className="text-[13.5px] text-slate-300 max-w-2xl">
              สลับชุดข้อสอบด้านล่างเพื่อทดสอบการทำงานของ{" "}
              <code className="text-amber-300 font-mono">template.tsx</code>{" "}
              ที่จะรีเซ็ตเวลาและกระดาษคำตอบอัตโนมัติเมื่อเปลี่ยนชุดสอบ แต่คงกระดาษทดไว้เมื่อสลับวิชาด้วย{" "}
              <code className="text-emerald-300 font-mono">&lt;Activity&gt;</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/practice"
              className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white transition"
            >
              รวมชุดข้อสอบ
            </Link>
            {PRACTICE_EXAM_SETS.map((set) => (
              <Link
                key={set.id}
                href={`/practice/${set.id}`}
                prefetch={true}
                className="rounded-full bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-400/40 px-3.5 py-1.5 text-[12px] font-semibold text-white transition"
              >
                {set.id.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {props.children}
    </div>
  );
}
