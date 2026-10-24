"use client";

import { useState, useEffect, useCallback } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { useOffline } from "next/offline";
import { Activity, WifiOff, Wifi, ChevronUp, ChevronDown, Zap } from "lucide-react";

interface MetricItem {
  name: string;
  value: number;
  rating?: string;
}

interface TransitionLog {
  url: string;
  navigationType: string;
  timestamp: number;
}

export function WebVitalsHud() {
  const isOffline = useOffline();
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState<Record<string, MetricItem>>({});
  const [lastTransition, setLastTransition] = useState<TransitionLog | null>(null);

  const handleMetric = useCallback(
    (metric: { name: string; value: number; rating?: string }) => {
      if (["LCP", "INP", "CLS", "FCP", "TTFB"].includes(metric.name)) {
        setMetrics((prev) => ({
          ...prev,
          [metric.name]: {
            name: metric.name,
            value:
              metric.name === "CLS"
                ? Math.round(metric.value * 1000) / 1000
                : Math.round(metric.value),
            rating: metric.rating,
          },
        }));
      }
    },
    []
  );

  useReportWebVitals(handleMetric);

  useEffect(() => {
    const onTransition = (e: Event) => {
      const custom = e as CustomEvent<TransitionLog>;
      if (custom.detail) {
        setLastTransition(custom.detail);
      }
    };
    window.addEventListener("nextjs:router-transition", onTransition);
    return () =>
      window.removeEventListener("nextjs:router-transition", onTransition);
  }, []);

  const metricList = ["LCP", "INP", "CLS", "FCP", "TTFB"];

  return (
    <>
      {isOffline && (
        <div
          role="status"
          aria-live="assertive"
          className="fixed top-16 inset-x-0 z-50 bg-rose-600 text-white px-4 py-2 text-[12.5px] font-semibold flex items-center justify-center gap-2 shadow-md"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            ขณะนี้คุณอยู่ในโหมดออฟไลน์ (Next.js 16 useOffline) — ระบบจะส่งคำขอใหม่อัตโนมัติเมื่อสัญญาณอินเทอร์เน็ตกลับมา
          </span>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-40 font-sans">
        {open ? (
          <div className="w-80 rounded-2xl border border-slate-800 bg-slate-950/95 text-slate-100 p-4 shadow-xl backdrop-blur-md space-y-3 text-[12px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 font-bold text-[12.5px]">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Next.js 16 Telemetry & CWV</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                aria-label="ย่อหน้าต่าง Web Vitals"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2 border border-slate-800">
              <span className="text-slate-400">สถานะเครือข่าย (useOffline):</span>
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${
                  isOffline ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {isOffline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5" /> Offline
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5" /> Online
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center">
              {metricList.map((name) => {
                const m = metrics[name];
                return (
                  <div
                    key={name}
                    className="rounded-lg bg-slate-900 border border-slate-800/90 p-1.5"
                  >
                    <div className="text-[10px] font-bold text-slate-400">
                      {name}
                    </div>
                    <div className="text-[11.5px] font-mono font-bold text-emerald-300 mt-0.5">
                      {m ? (name === "CLS" ? m.value : `${m.value}ms`) : "—"}
                    </div>
                  </div>
                );
              })}
            </div>

            {lastTransition && (
              <div className="rounded-xl bg-indigo-950/60 border border-indigo-800/60 px-3 py-2 text-[11px] space-y-0.5">
                <div className="flex items-center gap-1 text-indigo-300 font-semibold">
                  <Zap className="w-3 h-3" />
                  <span>onRouterTransitionStart (instrumentation-client)</span>
                </div>
                <div className="font-mono text-slate-300 truncate">
                  [{lastTransition.navigationType.toUpperCase()}] {lastTransition.url}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/90 hover:bg-slate-900 text-slate-100 px-3.5 py-2 text-[11.5px] font-semibold shadow-lg backdrop-blur-md transition cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? "bg-rose-500 animate-ping" : "bg-emerald-400"
              }`}
            />
            <span>CWV & Next 16 HUD</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>
    </>
  );
}
