import Link from "next/link";
import { Lock, KeyRound, Crown, ArrowLeft } from "lucide-react";
import { setVaultRoleAction } from "@/actions/features.actions";

export default function UnauthorizedPage() {
  return (
    <div className="max-w-2xl mx-auto my-8 rounded-3xl border border-amber-200 bg-white p-8 sm:p-10 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-0.5 text-[11px] font-bold">
            HTTP 401 • Next.js 16 unauthorized.tsx
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            กรุณาเข้าสู่ระบบเพื่อเข้าถึงคลังแนวข้อสอบจริง
          </h1>
        </div>
      </div>

      <p className="text-[14px] text-slate-600 leading-relaxed">
        หน้านี้ถูกป้องกันด้วยฟังก์ชัน <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-indigo-700">unauthorized()</code> ของ Next.js 16 App Router (`authInterrupts: true`) คุณสามารถจำลองการเข้าสู่ระบบได้ 2 ระดับด้านล่างเพื่อทดสอบสิทธิ์:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <form action={setVaultRoleAction} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between gap-4">
          <input type="hidden" name="role" value="member" />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span>บัญชีสมาชิกทั่วไป (Member)</span>
            </div>
            <p className="text-[12px] text-slate-600">
              ดูคลังข้อสอบพื้นฐานได้ แต่เมื่อกดเข้าโหมดเฉลยละเอียด VIP จะถูกตัดเข้าหน้า <code className="font-mono text-rose-600">forbidden.tsx (403)</code>
            </p>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-[12.5px] font-semibold transition cursor-pointer"
          >
            จำลองล็อกอินเป็น Member
          </button>
        </form>

        <form action={setVaultRoleAction} className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 flex flex-col justify-between gap-4">
          <input type="hidden" name="role" value="vip" />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[13px] font-bold text-indigo-950">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>บัญชีสมาชิก VIP (Full Access)</span>
            </div>
            <p className="text-[12px] text-indigo-900/80">
              ปลดล็อกคลังข้อสอบย้อนหลังพร้อมเฉลยละเอียดทุกข้อและเทคนิคตัดช้อยส์ครบ 100%
            </p>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-[12.5px] font-semibold transition cursor-pointer"
          >
            จำลองล็อกอินเป็น VIP ทันที
          </button>
        </form>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[12.5px]">
        <Link href="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับหน้าแรก</span>
        </Link>
        <span className="text-slate-400 font-mono text-[11px]">authInterrupts: unauthorized()</span>
      </div>
    </div>
  );
}
