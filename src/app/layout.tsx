import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Toaster } from "sonner";
import {
  getReaderSettings,
  getReaderCategories,
  getPublishedPosts,
} from "@/lib/content";
import { BookmarksProvider } from "@/components/bookmarks-provider";
import { ReaderHeader } from "@/components/reader-header";
import { Eye, BookOpen, Rss, Map, ShieldCheck } from "lucide-react";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getReaderSettings();
  const siteUrl = (settings.siteUrl || "http://localhost:3002").replace(
    /\/$/,
    ""
  );

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.siteName} — ${settings.tagline}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultSeoDescription,
    applicationName: settings.siteName,
    category: "technology",
    keywords: [
      settings.siteName,
      "Next.js 16",
      "App Router",
      "React 19",
      "Go Fiber",
      "PostgreSQL",
      "Redis",
      "Technical Blog",
      "วิศวกรรมซอฟต์แวร์",
      "สถาปัตยกรรมระบบ",
    ],
    alternates: {
      canonical: "/",
      languages: {
        "th-TH": "/",
      },
      types: {
        "application/rss+xml": `${siteUrl}/rss.xml`,
      },
    },
    openGraph: {
      type: "website",
      locale: "th_TH",
      url: siteUrl,
      siteName: settings.siteName,
      title: `${settings.siteName} — ${settings.tagline}`,
      description: settings.defaultSeoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.siteName} — ${settings.tagline}`,
      description: settings.defaultSeoDescription,
      creator: settings.twitterHandle || "@nextblog",
    },
    robots: settings.maintenanceMode
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

async function DraftBanner() {
  const draft = await draftMode();
  if (!draft.isEnabled) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-[12.5px] font-medium flex items-center justify-center gap-3">
      <span className="inline-flex items-center gap-1.5 font-semibold">
        <Eye className="w-3.5 h-3.5" />
        โหมดดูตัวอย่างฉบับร่าง (Draft Mode) กำลังทำงาน
      </span>
      <a
        href="/api/draft?disable=1"
        className="rounded-full bg-slate-950 text-white px-3 py-0.5 text-[11px] hover:bg-slate-800 transition"
      >
        ปิดโหมดตัวอย่าง
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
  const [settings, categories, posts] = await Promise.all([
    getReaderSettings(),
    getReaderCategories(),
    getPublishedPosts(false),
  ]);

  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-indigo-600 selection:text-white font-sans">
        <Suspense fallback={null}>
          <DraftBanner />
        </Suspense>

        <BookmarksProvider posts={posts}>
          <Suspense
            fallback={<div className="h-16 border-b border-slate-200 bg-white" />}
          >
            <ReaderHeader settings={settings} categories={categories} />
          </Suspense>

          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {children}
          </main>

          {modal}

          <footer className="border-t border-slate-200/80 bg-white py-10 mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-[14px]">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{settings.siteName}</span>
                </div>
                <p className="text-[12.5px] text-slate-500 max-w-md">
                  {settings.tagline} — ออกแบบให้อ่านง่าย สบายตา รองรับการค้นหาทันทีและบันทึกบทความไว้อ่านภายหลัง
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[12.5px] font-medium text-slate-600">
                <Link href="/search" className="hover:text-indigo-600 transition">
                  ค้นหาทั้งหมด
                </Link>
                <Link href="/category" className="hover:text-indigo-600 transition">
                  สารบัญหมวดหมู่
                </Link>
                <a
                  href="/sitemap.xml"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Sitemap</span>
                </a>
                <a
                  href="/robots.txt"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Robots.txt</span>
                </a>
                <a
                  href="/rss.xml"
                  className="inline-flex items-center gap-1 hover:text-orange-600 transition"
                >
                  <Rss className="w-3.5 h-3.5" />
                  <span>RSS 2.0</span>
                </a>
              </div>
            </div>
          </footer>
        </BookmarksProvider>

        <Toaster richColors position="bottom-right" theme="light" />
      </body>
    </html>
  );
}
