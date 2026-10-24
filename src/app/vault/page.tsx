import { Suspense } from "react";
import { cookies } from "next/headers";
import { unauthorized, forbidden } from "next/navigation";
import { setVaultRoleAction } from "@/actions/features.actions";
import { PRACTICE_EXAM_SETS } from "@/lib/exam-features-data";
import {
  Crown,
  Lock,
  ShieldCheck,
  FileText,
  KeyRound,
  LogOut,
} from "lucide-react";

// Never prefetch auth-gated vault routes ahead of navigation (Next.js 16 prefetch segment config)
export const prefetch = "force-disabled";

async function VaultProtectedContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const roleParam = typeof sp.role === "string" ? sp.role : undefined;
  const role = roleParam || cookieStore.get("vault_role")?.value || "guest";

  if (role === "guest") {
    // Triggers src/app/unauthorized.tsx (HTTP 401)
    unauthorized();
  }

  if (role === "member") {
    // Triggers src/app/forbidden.tsx (HTTP 403)
    forbidden();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 text-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 px-3 py-1 text-[11px] font-bold">
              <Crown className="w-3.5 h-3.5" />
              <span>
                VIP Vault Unlocked • prefetch = &apos;force-disabled&apos; • authInterrupts
              </span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              <span>คลังข้อสอบย้อนหลัง & เฉลยละเอียดระดับ VIP</span>
            </h1>
            <p className="text-[13.5px] text-slate-300 max-w-2xl">
              คุณกำลังเข้าชมด้วยสิทธิ์ <strong>VIP</strong> สามารถกดปุ่มด้านขวาเพื่อสลับสิทธิ์เป็น{" "}
              <code className="text-amber-300 font-mono">Member (403 forbidden)</code> หรือ{" "}
              <code className="text-rose-300 font-mono">Guest (401 unauthorized)</code> ได้ทันที
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <form action={setVaultRoleAction}>
              <input type="hidden" name="role" value="member" />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 text-[12px] font-semibold text-white transition cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>ทดสอบสลับเป็น Member (403)</span>
              </button>
            </form>

            <form action={setVaultRoleAction}>
              <input type="hidden" name="role" value="guest" />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 px-3.5 py-2 text-[12px] font-semibold text-rose-200 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออกจากระบบเป็น Guest (401)</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {PRACTICE_EXAM_SETS.map((set) => (
          <div
            key={set.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11.5px] font-bold text-indigo-600">
                  {set.organization}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{set.title}</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 px-3 py-1 text-[12px] font-bold">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>เฉลยครบ {set.questions.length} ข้อ</span>
              </span>
            </div>

            <div className="space-y-3">
              {set.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4 space-y-2 text-[13px]"
                >
                  <div className="font-bold text-slate-900">
                    ข้อ {idx + 1}. {q.question}
                  </div>
                  <div className="text-emerald-800 font-semibold">
                    คำตอบที่ถูกต้อง: ตัวเลือกที่ {q.correctIndex + 1} (
                    {q.choices[q.correctIndex]})
                  </div>
                  <div className="text-slate-600 bg-white rounded-xl p-3 border border-slate-200/60">
                    <strong className="text-indigo-700">เทคนิคทำข้อสอบ VIP:</strong>{" "}
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ExamVaultPage(props: PageProps<"/vault">) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 animate-pulse">
          <div className="h-36 rounded-3xl bg-slate-200/70" />
          <div className="h-64 rounded-3xl bg-slate-200/60" />
        </div>
      }
    >
      <VaultProtectedContent searchParams={props.searchParams} />
    </Suspense>
  );
}
