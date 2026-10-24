"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans text-slate-900">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm space-y-4">
          <h2 className="text-xl font-bold">ระบบขัดข้องชั่วคราว (Global Error)</h2>
          <p className="text-sm text-slate-600">{error.message}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-indigo-600 text-white px-5 py-2 text-sm font-semibold"
          >
            โหลดหน้าใหม่
          </button>
        </div>
      </body>
    </html>
  );
}
