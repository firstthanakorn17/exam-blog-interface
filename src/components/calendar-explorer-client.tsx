"use client";

import { useState, useDeferredValue } from "react";
import type { ExamCalendarEvent } from "@/lib/exam-features-data";
import {
  Calendar,
  ExternalLink,
  Search,
  Sparkles,
  GraduationCap,
  Users,
} from "lucide-react";

export function CalendarExplorerClient({
  events,
  initialQuery = "",
  initialCategory = "all",
}: {
  events: ExamCalendarEvent[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [liveFilter, setLiveFilter] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // React 19 useDeferredValue keeps input typing snappy while filtering large lists
  const deferredFilter = useDeferredValue(liveFilter);
  const deferredCategory = useDeferredValue(selectedCategory);
  const isStale =
    liveFilter !== deferredFilter || selectedCategory !== deferredCategory;

  const filtered = events.filter((ev) => {
    const matchCategory =
      deferredCategory === "all" || ev.category === deferredCategory;
    const q = deferredFilter.trim().toLowerCase();
    const matchQuery =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      ev.organization.toLowerCase().includes(q) ||
      ev.degreeLevel.toLowerCase().includes(q);
    return matchCategory && matchQuery;
  });

  const categories = ["all", "ก.พ. & ราชการ", "ท้องถิ่น", "รัฐวิสาหกิจ"];

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={liveFilter}
            onChange={(e) => setLiveFilter(e.target.value)}
            placeholder="กรองทันทีด้วย React 19 useDeferredValue (พิมพ์ชื่อหน่วยงาน / ตำแหน่ง / วุฒิ)..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-[13px] text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "ทุกสนามสอบ" : cat}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${
          isStale ? "opacity-60" : "opacity-100"
        }`}
      >
        {filtered.map((ev, index) => (
          <article
            key={ev.id}
            // Apply content-visibility: auto only to below-the-fold cards (index >= 2) per modern-web-guidance
            className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between gap-4 ${
              index >= 2 ? "defer-offscreen-card" : ""
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-0.5 text-[11px] font-bold">
                  {ev.category}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    ev.status === "เปิดรับสมัคร"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {ev.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {ev.title}
              </h3>
              <p className="text-[12.5px] text-slate-500">{ev.organization}</p>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[12px] text-slate-700">
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[10.5px] text-slate-400 block">
                    วันเปิดรับสมัคร
                  </span>
                  <span className="font-semibold flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    {ev.applyWindow}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[10.5px] text-slate-400 block">
                    วุฒิ / อัตราว่าง
                  </span>
                  <span className="font-semibold flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    {ev.degreeLevel} ({ev.seatsOrPositions})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[12px]">
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>กำหนดสอบ: {ev.examDate}</span>
              </span>
              <a
                href={ev.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>เว็บรับสมัครทางการ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 text-sm">
          ไม่พบกำหนดการสอบที่ตรงกับคำค้นหา &ldquo;{deferredFilter}&rdquo;
        </div>
      )}

      <div className="text-[11.5px] text-slate-400 flex items-center justify-between px-1">
        <span className="inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>
            การ์ดด้านล่าง Fold ใช้ CSS{" "}
            <code className="font-mono">content-visibility: auto; contain-intrinsic-size: auto 260px</code>
          </span>
        </span>
        <span className="font-mono">React 19 useDeferredValue</span>
      </div>
    </div>
  );
}
