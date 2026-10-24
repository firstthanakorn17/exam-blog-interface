"use client";

import {
  Activity,
  Suspense,
  use,
  useState,
  useEffect,
  useEffectEvent,
} from "react";
import { useOffline } from "next/offline";
import type { PracticeExamSet } from "@/lib/exam-features-data";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  RotateCcw,
  StickyNote,
  WifiOff,
  Award,
} from "lucide-react";

function StreamedExplanationBox({
  questionId,
  explanationsPromise,
}: {
  questionId: string;
  explanationsPromise: Promise<Record<string, string>>;
}) {
  // React 19 use(promise) unwraps a Promise passed from a Server Component
  const explanations = use(explanationsPromise);
  const text = explanations[questionId] || "ไม่มีคำอธิบายเพิ่มเติม";

  return (
    <div className="mt-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-[13px] text-indigo-950">
      <span className="font-bold text-indigo-700 block mb-1">
        เฉลยละเอียด (Streamed via React 19 <code className="font-mono">use(promise)</code>):
      </span>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}

export function MockExamClient({
  exam,
  explanationsPromise,
}: {
  exam: PracticeExamSet;
  explanationsPromise: Promise<Record<string, string>>;
}) {
  const isOffline = useOffline();
  const [activeSubject, setActiveSubject] = useState<"math" | "thai" | "english">(
    "math"
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMinutes * 60);

  // React 19 useEffectEvent reads latest answers/submitted without re-subscribing the interval
  const onTimerTick = useEffectEvent(() => {
    if (submitted) return;
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        setSubmitted(true);
        return 0;
      }
      return prev - 1;
    });
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTimerTick();
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const subjectTabs: {
    id: "math" | "thai" | "english";
    label: string;
  }[] = [
    { id: "math", label: "1. คิดวิเคราะห์/คณิต" },
    { id: "thai", label: "2. ภาษาไทย/ราชการ" },
    { id: "english", label: "3. ภาษาอังกฤษ (English)" },
  ];

  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(answers).length;
  const correctCount = exam.questions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;
  const scorePct = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePct >= exam.passScorePct;

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="space-y-6">
      {/* Top Status Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11.5px] font-semibold text-indigo-600">
            {exam.organization}
          </span>
          <h2 className="text-lg font-bold text-slate-900">{exam.title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isOffline && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 px-3 py-1 text-[12px] font-bold">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode (กระดาษคำตอบยังทำงานต่อได้)</span>
            </span>
          )}

          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-sm font-bold text-slate-900">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>
              {mins}:{secs}
            </span>
          </div>

          <div className="text-[12.5px] font-semibold text-slate-600">
            ทำแล้ว {answeredCount}/{totalQuestions} ข้อ
          </div>

          {!submitted ? (
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-[12.5px] font-semibold transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ส่งกระดาษคำตอบ</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setSecondsLeft(exam.durationMinutes * 60);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 text-[12.5px] font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>สอบใหม่อีกครั้ง</span>
            </button>
          )}
        </div>
      </div>

      {/* Score Result Banner */}
      {submitted && (
        <div
          className={`rounded-3xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            passed
              ? "border-emerald-200 bg-emerald-50/80 text-emerald-950"
              : "border-rose-200 bg-rose-50/80 text-rose-950"
          }`}
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 font-bold text-lg">
              <Award className="w-5 h-5" />
              <span>
                ผลคะแนนของคุณ: {correctCount}/{totalQuestions} ข้อ ({scorePct}%) —{" "}
                {passed ? "ผ่านเกณฑ์มาตรฐาน!" : "ยังไม่ผ่านเกณฑ์ (ต้องได้ ≥" + exam.passScorePct + "%)"}
              </span>
            </div>
            <p className="text-[13px] opacity-85">
              ดูเฉลยละเอียดด้านล่างซึ่งโหลดผ่าน{" "}
              <code className="font-mono font-bold">use(explanationsPromise)</code>{" "}
              ของ React 19
            </p>
          </div>
        </div>
      )}

      {/* Subject Switcher powered by React 19 <Activity> */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {subjectTabs.map((tab) => {
            const countInTab = exam.questions.filter(
              (q) => q.subject === tab.id
            ).length;
            const active = activeSubject === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubject(tab.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label} ({countInTab} ข้อ)
              </button>
            );
          })}
        </div>
        <span className="text-[11.5px] text-slate-500 font-mono">
          React 19 &lt;Activity mode=&quot;visible|hidden&quot;&gt; คงกระดาษทดทุกวิชาไว้ไม่หาย
        </span>
      </div>

      {/* Render each subject inside React 19 <Activity> so state & scratchpad persist while hidden */}
      {subjectTabs.map((tab) => {
        const subjectQuestions = exam.questions.filter(
          (q) => q.subject === tab.id
        );
        return (
          <Activity
            key={tab.id}
            mode={activeSubject === tab.id ? "visible" : "hidden"}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {subjectQuestions.map((q, qIdx) => {
                  const selected = answers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4"
                    >
                      <div className="flex items-center justify-between text-[12px] text-slate-500">
                        <span className="font-semibold text-indigo-600">
                          {q.subjectLabel}
                        </span>
                        <span className="font-mono">ข้อที่ {qIdx + 1}</span>
                      </div>

                      <p className="text-[15px] font-bold text-slate-900 leading-relaxed">
                        {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.choices.map((choice, cIdx) => {
                          const isChosen = selected === cIdx;
                          const isCorrect = q.correctIndex === cIdx;
                          let style =
                            "border-slate-200 bg-white hover:border-indigo-300 text-slate-800";
                          if (submitted) {
                            if (isCorrect) {
                              style =
                                "border-emerald-400 bg-emerald-50 text-emerald-950 font-semibold";
                            } else if (isChosen && !isCorrect) {
                              style =
                                "border-rose-400 bg-rose-50 text-rose-950 font-semibold";
                            }
                          } else if (isChosen) {
                            style =
                              "border-indigo-600 bg-indigo-50/90 text-indigo-950 font-semibold";
                          }

                          return (
                            <button
                              key={choice}
                              type="button"
                              disabled={submitted}
                              onClick={() =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: cIdx,
                                }))
                              }
                              className={`w-full text-left rounded-2xl border px-4 py-3 text-[13.5px] flex items-center justify-between gap-3 transition cursor-pointer ${style}`}
                            >
                              <span>
                                <strong className="mr-2">{cIdx + 1}.</strong>
                                {choice}
                              </span>
                              {submitted && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {submitted && isChosen && !isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {submitted && (
                        <Suspense
                          fallback={
                            <div className="h-16 rounded-2xl bg-indigo-50 animate-pulse mt-3" />
                          }
                        >
                          <StreamedExplanationBox
                            questionId={q.id}
                            explanationsPromise={explanationsPromise}
                          />
                        </Suspense>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Persistent Per-Subject Scratchpad preserved by React 19 <Activity> */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs h-fit space-y-3">
                <div className="flex items-center gap-2 text-[13.5px] font-bold text-slate-900">
                  <StickyNote className="w-4 h-4 text-amber-500" />
                  <span>กระดาษทดประจำวิชา ({tab.label})</span>
                </div>
                <p className="text-[12px] text-slate-500">
                  ลองพิมพ์ทดเลขไว้แล้วกดสลับไปแท็บวิชาอื่น ข้อมูลในช่องนี้จะไม่หายเพราะถูกห่อด้วย{" "}
                  <code className="font-mono text-indigo-600">&lt;Activity&gt;</code>
                </p>
                <textarea
                  rows={8}
                  placeholder={`พิมพ์ทดเลขหรือโน้ตย่อสำหรับ ${tab.label} ที่นี่...`}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-[13px] text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </Activity>
        );
      })}
    </div>
  );
}
