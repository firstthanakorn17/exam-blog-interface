"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  calculateScoreAction,
  type ScoreCalculatorState,
} from "@/actions/features.actions";
import {
  Calculator,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function SubmitScoreButton() {
  // React 19 useFormStatus reads pending & submitted FormData from the enclosing <form>
  const { pending, data } = useFormStatus();
  const submittingLevel = data?.get("degreeLevel") as string | null;

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3.5 px-5 text-[13.5px] font-bold shadow-xs transition cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>
            กำลังคำนวณเกณฑ์ {submittingLevel || ""} (useFormStatus)...
          </span>
        </>
      ) : (
        <>
          <Calculator className="w-4 h-4" />
          <span>คำนวณคะแนน & บันทึกสถิติเบื้องหลังด้วย after()</span>
        </>
      )}
    </button>
  );
}

const initialState: ScoreCalculatorState = {};

export function ScoreCalculatorClient() {
  const [state, formAction] = useActionState(
    calculateScoreAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Sync aria-invalid with :user-invalid and provide WeakMap fallback per modern-web-guidance (validate-input-after-interaction)
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const dirtyState = new WeakMap<
      HTMLInputElement,
      { hasInteracted: boolean; hasBlurred: boolean }
    >();

    const syncAriaAndFallback = (el: EventTarget | null) => {
      if (!(el instanceof HTMLInputElement)) return;
      if (CSS.supports("selector(:user-invalid)")) {
        el.setAttribute(
          "aria-invalid",
          el.matches(":user-invalid") ? "true" : "false"
        );
      } else {
        const isValid = el.checkValidity();
        el.classList.toggle("user-invalid-fallback", !isValid);
        el.classList.toggle("user-valid-fallback", isValid);
        if (!isValid) {
          el.setAttribute("aria-invalid", "true");
        } else {
          el.removeAttribute("aria-invalid");
        }
      }
    };

    const onBlur = (e: Event) => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      const st = dirtyState.get(target) || {
        hasInteracted: false,
        hasBlurred: false,
      };
      st.hasBlurred = true;
      dirtyState.set(target, st);
      if (st.hasInteracted || CSS.supports("selector(:user-invalid)")) {
        syncAriaAndFallback(target);
      }
    };

    const onInput = (e: Event) => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      const st = dirtyState.get(target) || {
        hasInteracted: false,
        hasBlurred: false,
      };
      st.hasInteracted = true;
      dirtyState.set(target, st);
      if (target.hasAttribute("aria-invalid") || st.hasBlurred) {
        syncAriaAndFallback(target);
      }
    };

    form.addEventListener("blur", onBlur, true);
    form.addEventListener("input", onInput);
    return () => {
      form.removeEventListener("blur", onBlur, true);
      form.removeEventListener("input", onInput);
    };
  }, []);

  const res = state.result;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form
        ref={formRef}
        action={formAction}
        className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-5"
      >
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-0.5 text-[11px] font-bold">
            React 19 useActionState + useFormStatus + CSS :user-invalid
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            กรอกคะแนนจำลองสอบ ก.พ. ภาค ก. ของคุณ
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="degreeLevel"
              className="block text-[13px] font-bold text-slate-800"
            >
              ระดับวุฒิที่ใช้สมัครสอบ
            </label>
            <span className="block text-[11.5px] text-slate-500">
              ป.ตรี เกณฑ์คิดวิเคราะห์ ≥60% | ป.โท ≥65%
            </span>
            <select
              id="degreeLevel"
              name="degreeLevel"
              defaultValue="ปริญญาตรี"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13.5px] font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="ปวช./ปวส.">ปวช. / ปวท. / ปวส. (เกณฑ์ 60%)</option>
              <option value="ปริญญาตรี">ปริญญาตรี (เกณฑ์ 60%)</option>
              <option value="ปริญญาโท">ปริญญาโท (เกณฑ์ 65%)</option>
            </select>
          </div>

          <div className="validated-field space-y-1.5">
            <label
              htmlFor="candidateCode"
              className="block text-[13px] font-bold text-slate-800"
            >
              รหัสอ้างอิงผู้เข้าสอบ (ทดสอบ :user-invalid)
            </label>
            {/* Place format hint ABOVE input so mobile keyboards/autocomplete popovers do not cover it */}
            <span
              id="candidate-code-hint"
              className="field-rules block text-[11.5px] text-slate-500"
            >
              รูปแบบ: ตัวพิมพ์ใหญ่ 2-4 ตัว ตามด้วยขีดและตัวเลข 5 หลัก (เช่น OCSC-69001)
            </span>
            <input
              id="candidateCode"
              name="candidateCode"
              type="text"
              required
              defaultValue="OCSC-69001"
              pattern="[A-Z]{2,4}-[0-9]{5}"
              aria-describedby="candidate-code-hint"
              aria-errormessage="candidate-code-error"
              className="validated-input w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13.5px] font-mono text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
            <div
              id="candidate-code-error"
              className="field-error-msg items-center gap-1.5 text-[12px] text-rose-600 font-medium pt-0.5"
            >
              <span aria-hidden="true">❌</span>
              <span>กรุณากรอกรหัสตามรูปแบบ เช่น OCSC-69001</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="validated-field space-y-1">
            <label
              htmlFor="mathScore"
              className="block text-[13px] font-bold text-slate-800"
            >
              1. วิชาการคิดคำนวณและเหตุผล (เต็ม 50)
            </label>
            <span id="math-hint" className="block text-[11px] text-slate-500">
              กรอกตัวเลข 0 – 50 คะแนน
            </span>
            <input
              id="mathScore"
              name="mathScore"
              type="number"
              min={0}
              max={50}
              required
              defaultValue={36}
              aria-describedby="math-hint"
              className="validated-input w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[14px] font-bold text-slate-900"
            />
            <div className="field-error-msg items-center gap-1 text-[11.5px] text-rose-600">
              <span aria-hidden="true">❌</span> ต้องอยู่ระหว่าง 0 ถึง 50 คะแนน
            </div>
          </div>

          <div className="validated-field space-y-1">
            <label
              htmlFor="thaiScore"
              className="block text-[13px] font-bold text-slate-800"
            >
              2. วิชาภาษาไทย (เต็ม 50)
            </label>
            <span id="thai-hint" className="block text-[11px] text-slate-500">
              กรอกตัวเลข 0 – 50 คะแนน
            </span>
            <input
              id="thaiScore"
              name="thaiScore"
              type="number"
              min={0}
              max={50}
              required
              defaultValue={34}
              aria-describedby="thai-hint"
              className="validated-input w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[14px] font-bold text-slate-900"
            />
            <div className="field-error-msg items-center gap-1 text-[11.5px] text-rose-600">
              <span aria-hidden="true">❌</span> ต้องอยู่ระหว่าง 0 ถึง 50 คะแนน
            </div>
          </div>

          <div className="validated-field space-y-1">
            <label
              htmlFor="englishScore"
              className="block text-[13px] font-bold text-slate-800"
            >
              3. วิชาภาษาอังกฤษ (เต็ม 50 • เกณฑ์ผ่าน 50%)
            </label>
            <span id="eng-hint" className="block text-[11px] text-slate-500">
              ต้องได้ตั้งแต่ 25 คะแนนขึ้นไป
            </span>
            <input
              id="englishScore"
              name="englishScore"
              type="number"
              min={0}
              max={50}
              required
              defaultValue={30}
              aria-describedby="eng-hint"
              className="validated-input w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[14px] font-bold text-slate-900"
            />
            <div className="field-error-msg items-center gap-1 text-[11.5px] text-rose-600">
              <span aria-hidden="true">❌</span> ต้องอยู่ระหว่าง 0 ถึง 50 คะแนน
            </div>
          </div>

          <div className="validated-field space-y-1">
            <label
              htmlFor="lawScore"
              className="block text-[13px] font-bold text-slate-800"
            >
              4. วิชาข้าราชการที่ดี/กฎหมาย (เต็ม 50 • เกณฑ์ผ่าน 60%)
            </label>
            <span id="law-hint" className="block text-[11px] text-slate-500">
              ต้องได้ตั้งแต่ 30 คะแนนขึ้นไป
            </span>
            <input
              id="lawScore"
              name="lawScore"
              type="number"
              min={0}
              max={50}
              required
              defaultValue={35}
              aria-describedby="law-hint"
              className="validated-input w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[14px] font-bold text-slate-900"
            />
            <div className="field-error-msg items-center gap-1 text-[11.5px] text-rose-600">
              <span aria-hidden="true">❌</span> ต้องอยู่ระหว่าง 0 ถึง 50 คะแนน
            </div>
          </div>
        </div>

        {state.error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-[13px] text-rose-700 font-medium">
            {state.error}
          </div>
        )}

        <SubmitScoreButton />
      </form>

      {/* Output Card */}
      <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs flex flex-col justify-between gap-6">
        {res ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11.5px] text-slate-500">
                รหัสผู้สอบ: {res.candidateCode}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${
                  res.overallPassed
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-rose-100 text-rose-900"
                }`}
              >
                {res.overallPassed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ผ่านเกณฑ์ภาค ก.!
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    ยังไม่ผ่านเกณฑ์ครบทุกวิชา
                  </>
                )}
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-700">
                  ความสามารถทั่วไป (คณิต+ไทย)
                </span>
                <span
                  className={`font-bold text-[14px] ${
                    res.passedGeneral ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {res.generalTotalPct}% ({res.passedGeneral ? "ผ่าน" : "ไม่ผ่าน"})
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-700">
                  ภาษาอังกฤษ (English)
                </span>
                <span
                  className={`font-bold text-[14px] ${
                    res.passedEnglish ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {res.englishPct}% ({res.passedEnglish ? "ผ่าน" : "ไม่ผ่าน"})
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-700">
                  ข้าราชการที่ดี (กฎหมาย 6 ฉบับ)
                </span>
                <span
                  className={`font-bold text-[14px] ${
                    res.passedLaw ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {res.lawPct}% ({res.passedLaw ? "ผ่าน" : "ไม่ผ่าน"})
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-indigo-950">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>อยู่ใน Percentile ที่ {res.percentileRank} ของผู้ซ้อมสอบ</span>
              </div>
              <p className="text-[12.5px] text-indigo-900 leading-relaxed">
                {res.recommendation}
              </p>
            </div>
          </div>
        ) : (
          <div className="my-auto text-center space-y-3 py-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              พร้อมคำนวณโอกาสสอบติดของคุณ
            </h3>
            <p className="text-[13px] text-slate-500 max-w-xs mx-auto">
              กดปุ่มคำนวณด้านซ้าย ระบบจะประมวลผลด้วย Server Action แล้วใช้{" "}
              <code className="font-mono text-indigo-600">after()</code> บันทึกสถิติและ{" "}
              <code className="font-mono text-indigo-600">refresh()</code> อัปเดตตารางด้านล่างทันที
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 text-[11.5px] text-slate-400 flex items-center justify-between">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>next/server after() + next/cache refresh()</span>
          </span>
          <span>React 19 Form Actions</span>
        </div>
      </div>
    </div>
  );
}
