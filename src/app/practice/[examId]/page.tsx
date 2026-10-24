import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prefetch as prefetchStage, navigation } from "next/cache";
import { PRACTICE_EXAM_SETS } from "@/lib/exam-features-data";
import { MockExamClient } from "@/components/mock-exam-client";
import { Users, Zap } from "lucide-react";

export async function generateStaticParams() {
  return PRACTICE_EXAM_SETS.map((exam) => ({
    examId: exam.id,
  }));
}

async function getExplanationsDictionary(
  examId: string
): Promise<Record<string, string>> {
  const exam = PRACTICE_EXAM_SETS.find((e) => e.id === examId);
  if (!exam) return {};
  const map: Record<string, string> = {};
  for (const q of exam.questions) {
    map[q.id] = q.explanation;
  }
  return map;
}

async function PrefetchStageBanner({ examTitle }: { examTitle: string }) {
  // Stage 2: Runs during per-link prefetch (<Link prefetch={true}>) or navigation, deferred out of App Shell
  await prefetchStage();
  return (
    <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/60 px-4 py-2.5 text-[12px] text-indigo-900 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
        <span>
          <strong>Stage 2 (`await prefetch()`):</strong> โหลดคำแนะนำสำหรับ{" "}
          <em>{examTitle}</em> ล่วงหน้าเมื่อชี้ลิงก์ (`prefetch=&#123;true&#125;`)
        </span>
      </div>
      <span className="font-mono text-[11px] text-indigo-700 shrink-0">
        next/cache prefetch()
      </span>
    </div>
  );
}

async function NavigationStageCohortStats({ examId }: { examId: string }) {
  // Stage 3: Deferred until the user actually navigates to this route
  await navigation();
  const baseCount =
    examId === "ocsc-69" ? 1420 : examId === "dla-69" ? 980 : 640;

  return (
    <div className="rounded-2xl border border-violet-200/80 bg-violet-50/60 px-4 py-2.5 text-[12px] text-violet-900 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Users className="w-3.5 h-3.5 text-violet-600 shrink-0" />
        <span>
          <strong>Stage 3 (`await navigation()`):</strong> สถิติผู้เข้าสอบชุดนี้{" "}
          <strong>{baseCount.toLocaleString()} คน</strong> (รันเฉพาะเมื่อคลิกเข้าหน้าจริงเท่านั้น)
        </span>
      </div>
      <span className="font-mono text-[11px] text-violet-700 shrink-0">
        next/cache navigation()
      </span>
    </div>
  );
}

export default async function PracticeExamRoomPage(
  props: PageProps<"/practice/[examId]">
) {
  const { examId } = await props.params;
  const exam = PRACTICE_EXAM_SETS.find((e) => e.id === examId);

  if (!exam) {
    notFound();
  }

  // Pass an unawaited Promise to Client Component to unwrap with React 19 use(promise)
  const explanationsPromise = getExplanationsDictionary(exam.id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Suspense
          fallback={
            <div className="h-10 rounded-2xl bg-indigo-50/50 animate-pulse" />
          }
        >
          <PrefetchStageBanner examTitle={exam.title} />
        </Suspense>

        <Suspense
          fallback={
            <div className="h-10 rounded-2xl bg-violet-50/50 animate-pulse" />
          }
        >
          <NavigationStageCohortStats examId={exam.id} />
        </Suspense>
      </div>

      <MockExamClient exam={exam} explanationsPromise={explanationsPromise} />
    </div>
  );
}
