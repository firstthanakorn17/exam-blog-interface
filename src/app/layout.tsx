import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Toaster } from "sonner";
import {
  getReaderSettings,
  getReaderCategories,
} from "@/lib/content";
import { Search, Rss, ArrowUpRight, Eye } from "lucide-react";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getReaderSettings();
  return {
    metadataBase: new URL(settings.siteUrl || "http://localhost:3002"),
    title: {
      default: `${settings.siteName} — ${settings.tagline}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultSeoDescription,
    alternates: {
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
  };
}

async function DraftBanner() {
  const draft = await draftMode();
  if (!draft.isEnabled) return null;

  return (
    <div className="bg-amber-500 text-zinc-950 px-4 py-2 text-[12px] font-medium flex items-center justify-center gap-3">
      <span className="inline-flex items-center gap-1.5 font-semibold">
        <Eye className="w-3.5 h-3.5" />
        Next.js Draft Mode Enabled (กำลังแสดงตัวอย่างบทความรวมฉบับร่าง)
      </span>
      <a
        href="/api/draft?disable=1"
        className="rounded bg-zinc-950 text-white px-2.5 py-0.5 text-[11px] hover:bg-zinc-800 transition"
      >
        ออกจากโหมดดูตัวอย่าง
      </a>
    </div>
  );
}

export default async function ReaderRootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getReaderSettings(),
    getReaderCategories(),
  ]);

  const rootCategories = categories.filter((c) => c.parentSlug === null);

  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fafaf9] text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans">
        <Suspense fallback={null}>
          <DraftBanner />
        </Suspense>

        {/* Editorial Top Navigation */}
        <header className="border-b border-zinc-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold text-sm flex items-center justify-center">
                  N
                </div>
                <div>
                  <span className="font-bold text-[15px] tracking-tight text-zinc-900 block leading-none">
                    {settings.siteName}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Publication
                  </span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-4 text-[13px] font-medium text-zinc-600">
                <Link href="/" className="hover:text-zinc-900 transition">
                  หน้าแรก
                </Link>
                {rootCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="hover:text-zinc-900 transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Intercepting Route Link to /search */}
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-3.5 py-1.5 text-[12px] text-zinc-600 hover:border-zinc-300 hover:bg-white shadow-2xs transition"
              >
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <span>ค้นหาบทความ...</span>
              </Link>

              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                title="RSS 2.0 Feed"
                className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 hover:text-zinc-900 shadow-2xs transition"
              >
                <Rss className="w-3.5 h-3.5" />
              </a>

              <a
                href="http://localhost:3001/console"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-zinc-800 shadow-2xs transition"
              >
                <span>Admin Console</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
          {children}
        </main>

        {modal}

        <footer className="border-t border-zinc-200/80 bg-white py-8 mt-16">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-zinc-500">
            <div>
              © 2026 {settings.siteName} — {settings.tagline}
            </div>
            <div className="flex items-center gap-4">
              <a href="/sitemap.xml" className="hover:text-zinc-900">
                Sitemap
              </a>
              <a href="/robots.txt" className="hover:text-zinc-900">
                Robots.txt
              </a>
              <a href="/rss.xml" className="hover:text-zinc-900">
                RSS Feed
              </a>
            </div>
          </div>
        </footer>

        <Toaster richColors position="bottom-right" theme="light" />
      </body>
    </html>
  );
}
