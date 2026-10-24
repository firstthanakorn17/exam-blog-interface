export default function RootLoading() {
  return (
    <div className="space-y-6 animate-pulse py-4" aria-busy="true" aria-label="กำลังโหลดข้อมูล">
      <div className="h-32 rounded-3xl bg-slate-200/70 border border-slate-200" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="h-56 rounded-2xl bg-slate-200/60" />
        <div className="h-56 rounded-2xl bg-slate-200/60" />
        <div className="h-56 rounded-2xl bg-slate-200/60" />
      </div>
    </div>
  );
}
