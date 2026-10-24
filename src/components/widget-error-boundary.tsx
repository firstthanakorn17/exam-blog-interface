"use client";

import { catchError, type ErrorInfo } from "next/error";
import { AlertCircle, RotateCcw } from "lucide-react";

function WidgetErrorFallback(
  props: { title?: string; children?: React.ReactNode },
  { error, retry }: ErrorInfo
) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-[13px] text-rose-900 flex items-center justify-between gap-4">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">
            {props.title || "Component Error Boundary (next/error catchError)"}
          </p>
          <p className="text-[12px] text-rose-700 mt-0.5">{message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 text-[12px] font-semibold shrink-0 transition cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Retry</span>
      </button>
    </div>
  );
}

export const WidgetErrorBoundary = catchError(WidgetErrorFallback);
