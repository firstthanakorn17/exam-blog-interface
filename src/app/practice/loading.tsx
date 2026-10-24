export default function PracticeLoading() {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true">
      <div className="h-24 rounded-2xl bg-slate-200/70" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-48 rounded-2xl bg-slate-200/60" />
        <div className="h-48 rounded-2xl bg-slate-200/60" />
        <div className="h-48 rounded-2xl bg-slate-200/60" />
      </div>
    </div>
  );
}
