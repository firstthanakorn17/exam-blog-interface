import { Suspense } from "react";
import { connection } from "next/server";
import { getRecentScoreStats } from "@/actions/features.actions";
import { ScoreCalculatorClient } from "@/components/score-calculator-client";
import { Calculator, Activity, CheckCircle2, XCircle } from "lucide-react";

async function LiveScoreStatsBoard() {
  // Next.js 16 connection() waits for an incoming user request so live stats are never frozen at build time
  await connection();
  const stats = await getRecentScoreStats();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-[15px]">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>
            สถิติผู้คำนวณคะแนนล่าสุด (บันทึกเบื้องหลังด้วย{" "}
            <code className="font-mono text-indigo-600">after()</code> + รีเฟรชด้วย{" "}
            <code className="font-mono text-indigo-600">refresh()</code>)
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          next/server connection()
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <span className="text-[12px] text-slate-500">จำนวนครั้งที่คำนวณทั้งหมด</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {stats.totalSubmissions} ครั้ง
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100">
          <span className="text-[12px] text-emerald-800">อัตราการผ่านเกณฑ์เฉลี่ย</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {stats.passRatePct}%
          </div>
        </div>
        <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100">
          <span className="text-[12px] text-indigo-800">
            คะแนนเฉลี่ยวิชาคิดวิเคราะห์+ไทย
          </span>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">
            {stats.avgGeneralPct}%
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <span className="text-[12px] font-semibold text-slate-500 block">
          รายการคำนวณล่าสุด (อัปเดตทันทีเมื่อกดคำนวณ):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {stats.recentLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 py-2.5 text-[12px] flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-800 block">
                  วุฒิ {log.level}
                </span>
                <span className="text-slate-500">
                  คิดวิเคราะห์+ไทย: {log.generalPct}%
                </span>
              </div>
              {log.passed ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่าน
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                  <XCircle className="w-3.5 h-3.5" /> ไม่ผ่าน
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ScoreCalculatorPage(
  _props: PageProps<"/calculator">
) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-[11px] font-bold">
          Next.js 16 after() + refresh() + connection() + React 19 useFormStatus()
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Calculator className="w-7 h-7 text-indigo-600" />
          <span>ระบบคำนวณคะแนนสอบ ก.พ. ภาค ก. & วิเคราะห์โอกาสสอบผ่าน</span>
        </h1>
        <p className="text-[13.5px] text-slate-600 max-w-3xl">
          ทดสอบฟอร์มที่ใช้{" "}
          <code className="font-mono text-indigo-600">useFormStatus()</code>,{" "}
          <code className="font-mono text-indigo-600">useActionState()</code>, การตรวจสอบข้อมูลหลังกรอกด้วย{" "}
          <code className="font-mono text-indigo-600">:user-invalid</code> และการบันทึกสถิติเบื้องหลังด้วย{" "}
          <code className="font-mono text-indigo-600">after()</code>
        </p>
      </div>

      <ScoreCalculatorClient />

      <Suspense
        fallback={
          <div className="h-48 rounded-3xl bg-slate-200/60 animate-pulse" />
        }
      >
        <LiveScoreStatsBoard />
      </Suspense>
    </div>
  );
}
