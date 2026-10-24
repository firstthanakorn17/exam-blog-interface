import Link from "next/link";
import { ShieldAlert, Crown, LogOut, ArrowLeft } from "lucide-react";
import { setVaultRoleAction } from "@/actions/features.actions";

export default function ForbiddenPage() {
  return (
    <div className="max-w-2xl mx-auto my-8 rounded-3xl border border-rose-200 bg-white p-8 sm:p-10 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-900 px-3 py-0.5 text-[11px] font-bold">
            HTTP 403 • Next.js 16 forbidden.tsx
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            สิทธิ์การใช้งานไม่เพียงพอ (ต้องเป็นระดับ VIP เท่านั้น)
          </h1>
        </div>
      </div>

      <p className="text-[14px] text-slate-600 leading-relaxed">
        คุณเข้าสู่ระบบในฐานะ <strong>Member</strong> แล้ว แต่เนื้อหาส่วนนี้เรียกใช้ <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-rose-700">forbidden()</code> ของ Next.js 16 เพื่อจำกัดเฉพาะสมาชิก <strong>VIP</strong> เท่านั้น กดอัปเกรดสิทธิ์ด้านล่างเพื่อเข้าชมทันที:
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <form action={setVaultRoleAction}>
          <input type="hidden" name="role" value="vip" />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-[13px] font-semibold transition cursor-pointer shadow-xs"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>อัปเกรดเป็น VIP ทันที (1-Click Demo)</span>
          </button>
        </form>

        <form action={setVaultRoleAction}>
          <input type="hidden" name="role" value="guest" />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-[13px] font-medium transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>สลับกลับเป็น Guest (ทดสอบ 401)</span>
          </button>
        </form>

        <Link
          href="/vault"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 text-[13px] font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้ารวมคลังข้อสอบ</span>
        </Link>
      </div>
    </div>
  );
}
