import { Suspense } from "react";
import Form from "next/form";
import { cookies } from "next/headers";
import { cacheLife } from "next/cache";
import { EXAM_CALENDAR_EVENTS } from "@/lib/exam-features-data";
import { saveTargetPreferenceAction } from "@/actions/features.actions";
import { CalendarExplorerClient } from "@/components/calendar-explorer-client";
import { CalendarDays, Sparkles, SlidersHorizontal, Search } from "lucide-react";

export const prefetch = "partial";
export const ensureStatic = "shell";

async function getPersonalizedRecommendations() {
  "use cache: private";
  cacheLife("minutes");

  const cookieStore = await cookies();
  const targetLevel =
    cookieStore.get("exam_target_level")?.value || "ปริญญาตรี";
  const targetTrack =
    cookieStore.get("exam_target_track")?.value || "ก.พ. & ราชการ";

  const matched = EXAM_CALENDAR_EVENTS.filter(
    (ev) => ev.degreeLevel === targetLevel || ev.category === targetTrack
  );

  return {
    targetLevel,
    targetTrack,
    matchedCount: matched.length,
    topEvent: matched[0] || EXAM_CALENDAR_EVENTS[0],
    cachedAt: new Date().toLocaleTimeString("th-TH"),
  };
}

async function PersonalizedStudyBanner() {
  const rec = await getPersonalizedRecommendations();

  return (
    <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/60 p-6 shadow-2xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 text-indigo-900 px-3 py-1 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            Next.js 16 <code className="font-mono">&apos;use cache: private&apos;</code>{" "}
            + <code className="font-mono">cookies()</code>
          </span>
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Private Cache Time: {rec.cachedAt}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            แผนสอบเฉพาะบุคคลของคุณ: วุฒิ{" "}
            <span className="text-indigo-600 underline decoration-indigo-300">
              {rec.targetLevel}
            </span>{" "}
            • สาย{" "}
            <span className="text-violet-700 underline decoration-violet-300">
              {rec.targetTrack}
            </span>
          </h2>
          <p className="text-[13px] text-slate-600">
            พบสนามสอบที่ตรงเป้าหมายของคุณ <strong>{rec.matchedCount} สนามสอบ</strong> — แนะนำด่วน:{" "}
            <strong>{rec.topEvent.title}</strong> ({rec.topEvent.applyWindow})
          </p>
        </div>

        <form
          action={saveTargetPreferenceAction}
          className="flex flex-wrap items-center gap-2 shrink-0"
        >
          <select
            name="targetLevel"
            defaultValue={rec.targetLevel}
            aria-label="เลือกระดับวุฒิการศึกษาเป้าหมาย"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-medium text-slate-800"
          >
            <option value="ปวช./ปวส.">วุฒิ ปวช./ปวส.</option>
            <option value="ปริญญาตรี">วุฒิ ปริญญาตรี</option>
            <option value="ปริญญาโท">วุฒิ ปริญญาโท</option>
          </select>
          <select
            name="targetTrack"
            defaultValue={rec.targetTrack}
            aria-label="เลือกสายงานสอบเป้าหมาย"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-medium text-slate-800"
          >
            <option value="ก.พ. & ราชการ">ก.พ. & ราชการ</option>
            <option value="ท้องถิ่น">ท้องถิ่น (สถ./กทม.)</option>
            <option value="รัฐวิสาหกิจ">รัฐวิสาหกิจ</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-[12.5px] font-semibold transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>บันทึกเป้าหมายลง Cookie</span>
          </button>
        </form>
      </div>
    </div>
  );
}

async function CalendarSearchResults({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "all";

  return (
    <CalendarExplorerClient
      events={EXAM_CALENDAR_EVENTS}
      initialQuery={q}
      initialCategory={category}
    />
  );
}

export default async function ExamCalendarPage(props: PageProps<"/calendar">) {
  return (
    <div className="space-y-6">
      {/* Static App Shell Header (enforced by ensureStatic = 'shell') */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-[11px] font-bold">
              ensureStatic = &apos;shell&apos; • prefetch = &apos;partial&apos; • next/form
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <CalendarDays className="w-7 h-7 text-indigo-600" />
              <span>ปฏิทินสอบราชการ & รัฐวิสาหกิจ 2569–2570</span>
            </h1>
            <p className="text-[13.5px] text-slate-600">
              ค้นหากำหนดการสอบด้วย{" "}
              <code className="font-mono text-indigo-600">&lt;Form action=&quot;/calendar&quot;&gt;</code>{" "}
              (`next/form`) ที่อัปเดต URL Search Params แบบ Client Navigation โดยไม่รีโหลดหน้า
            </p>
          </div>

          {/* Next.js <Form> component for URL search submission */}
          <Form
            action="/calendar"
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <input
              type="text"
              name="q"
              placeholder="ค้นหาด้วย next/form..."
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-[13px] text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none w-full md:w-56"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2 text-[12.5px] font-semibold shrink-0 transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>ค้นหา URL</span>
            </button>
          </Form>
        </div>
      </div>

      {/* Private Cached Personalized Study Banner */}
      <Suspense
        fallback={
          <div className="h-32 rounded-3xl bg-indigo-50/50 animate-pulse" />
        }
      >
        <PersonalizedStudyBanner />
      </Suspense>

      {/* Dynamic Search Params inside Suspense so App Shell remains 100% Static */}
      <Suspense
        fallback={
          <div className="h-64 rounded-3xl bg-slate-200/60 animate-pulse" />
        }
      >
        <CalendarSearchResults searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
