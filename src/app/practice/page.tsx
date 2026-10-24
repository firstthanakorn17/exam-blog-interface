import { Suspense } from "react";
import Link from "next/link";
import { io } from "next/cache";
import { PRACTICE_EXAM_SETS } from "@/lib/exam-features-data";
import { WidgetErrorBoundary } from "@/components/widget-error-boundary";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  BookOpenCheck,
} from "lucide-react";

async function DailyQuestionOfTheDay() {
  // Next.js 16 io() suspends during static prerendering so Math.random() / new Date() runs fresh per request
  await io();
  const allQuestions = PRACTICE_EXAM_SETS.flatMap((s) =>
    s.questions.map((q) => ({ ...q, examId: s.id, examTitle: s.title }))
  );
  const randomIdx = Math.floor(Math.random() * allQuestions.length);
  const picked = allQuestions[randomIdx];
  const nowStr = new Date().toLocaleTimeString("th-TH");

  return (
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/90 to-white p-6 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            โจทย์สุ่มประจำวันสดใหม่ทุก Request ด้วย Next.js 16{" "}
            <code className="font-mono">await io()</code>
          </span>
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          สุ่มเมื่อ: {nowStr}
        </span>
      </div>
      <h2 className="text-[15px] font-bold text-slate-900">{picked.question}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
        {picked.choices.map((c, idx) => (
          <div
            key={c}
            className="rounded-xl border border-amber-200/80 bg-white px-3.5 py-2 text-slate-700"
          >
            <span className="font-bold text-amber-700 mr-2">{idx + 1}.</span>
            {c}
          </div>
        ))}
      </div>
      <div className="pt-1 flex items-center justify-between text-[12px] text-slate-500">
        <span>จากชุดข้อสอบ: {picked.examTitle}</span>
        <Link
          href={`/practice/${picked.examId}`}
          prefetch={true}
          className="font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
        >
          <span>เข้าทำข้อสอบชุดนี้เต็มเวลา</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default async function PracticeIndexPage(_props: PageProps<"/practice">) {
  return (
    <div className="space-y-8">
      <WidgetErrorBoundary title="Daily Question Widget Error">
        <Suspense
          fallback={
            <div className="h-44 rounded-3xl border border-amber-100 bg-amber-50/40 animate-pulse p-6" />
          }
        >
          <DailyQuestionOfTheDay />
        </Suspense>
      </WidgetErrorBoundary>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-600" />
            <span>เลือกสนามสอบที่ต้องการฝึกทำข้อสอบจับเวลา</span>
          </h2>
          <span className="text-[12px] text-slate-500">
            รองรับ Per-link Prefetch (<code className="font-mono">prefetch=&#123;true&#125;</code>)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRACTICE_EXAM_SETS.map((exam) => (
            <div
              key={exam.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-0.5 text-[11px] font-bold">
                    {exam.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {exam.durationMinutes} นาที
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {exam.title}
                </h3>
                <p className="text-[12.5px] text-slate-500">
                  หน่วยงาน: {exam.organization} • วุฒิ: {exam.level}
                </p>
                <div className="flex items-center gap-3 text-[12px] text-emerald-700 font-medium pt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    เกณฑ์ผ่าน {exam.passScorePct}% ({exam.questions.length} ข้อพร้อมเฉลยละเอียด)
                  </span>
                </div>
              </div>

              <Link
                href={`/practice/${exam.id}`}
                prefetch={true}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white py-3 px-4 text-[13px] font-semibold transition"
              >
                <span>เริ่มจับเวลาทำข้อสอบ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
