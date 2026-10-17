import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center space-y-3 max-w-md mx-auto my-12 shadow-2xs">
      <div className="text-[11px] font-mono text-zinc-400">404 Article Not Found</div>
      <h2 className="text-xl font-bold text-zinc-900">ไม่พบบทความที่คุณต้องการ</h2>
      <p className="text-[13px] text-zinc-500">
        บทความนี้อาจยังเป็นฉบับร่าง (Draft) หรือถูกย้ายไปแล้ว
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-[12px] font-medium text-white hover:bg-zinc-800 transition"
        >
          กลับสู่หน้าแรก
        </Link>
      </div>
    </div>
  );
}
