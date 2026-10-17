import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import type {
  Post,
  Category,
  CommentItem,
  SiteSettings,
} from "@examblog/shared";

interface SharedStore {
  posts: Post[];
  categories: Category[];
  settings: SiteSettings;
  comments?: CommentItem[];
}

const SHARED_DB_FILE = path.resolve(
  process.cwd(),
  "../exam-blog-nextjs/.data/blog-db.json"
);

const COMMENTS_FILE = path.join(process.cwd(), ".data/comments.json");

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: "cmt-1",
    postSlug: "nextjs-16-cache-components-use-cache",
    author: "Nattapong S.",
    body: "อธิบายเรื่อง use cache กับ updateTag ได้เห็นภาพชัดเจนมากครับ ลองเอาไปปรับใช้กับโปรเจกต์แล้วเร็วขึ้นมาก",
    createdAt: "2026-10-16T09:30:00.000Z",
  },
  {
    id: "cmt-2",
    postSlug: "parallel-and-intercepting-routes-pattern",
    author: "Pimchanok K.",
    body: "ชอบเทคนิคการแยก @comments กับ @related เป็น Parallel Slots ทำให้หน้าบทความไม่ต้องรอโหลดพร้อมกันทั้งหมด",
    createdAt: "2026-10-16T11:15:00.000Z",
  },
];

export async function readSharedDb(): Promise<SharedStore> {
  try {
    const raw = await fs.readFile(SHARED_DB_FILE, "utf-8");
    return JSON.parse(raw) as SharedStore;
  } catch {
    const res = await fetch("http://localhost:3001/api/content", {
      cache: "no-store",
    });
    return (await res.json()) as SharedStore;
  }
}

export async function getPublishedPosts(includeDrafts = false): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const db = await readSharedDb();
  const list = includeDrafts
    ? db.posts.filter((p) => p.status !== "archived")
    : db.posts.filter((p) => p.status === "published");

  return list.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getPostBySlug(
  slug: string,
  includeDrafts = false
): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts", `post-${slug}`);

  const db = await readSharedDb();
  const post = db.posts.find((p) => p.slug === slug);
  if (!post) return null;
  if (!includeDrafts && post.status !== "published") return null;
  return post;
}

export async function getReaderCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  const db = await readSharedDb();
  return db.categories;
}

export async function getReaderSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("settings");

  const db = await readSharedDb();
  return db.settings;
}

export async function getCommentsBySlug(slug: string): Promise<CommentItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("comments", `comments-${slug}`);

  try {
    const raw = await fs.readFile(COMMENTS_FILE, "utf-8");
    const all = JSON.parse(raw) as CommentItem[];
    return all.filter((c) => c.postSlug === slug);
  } catch {
    await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true });
    await fs.writeFile(
      COMMENTS_FILE,
      JSON.stringify(DEFAULT_COMMENTS, null, 2),
      "utf-8"
    );
    return DEFAULT_COMMENTS.filter((c) => c.postSlug === slug);
  }
}

export async function appendComment(item: CommentItem): Promise<void> {
  let all: CommentItem[] = DEFAULT_COMMENTS;
  try {
    const raw = await fs.readFile(COMMENTS_FILE, "utf-8");
    all = JSON.parse(raw) as CommentItem[];
  } catch {
    // initialize default
  }
  all.unshift(item);
  await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true });
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(all, null, 2), "utf-8");
}

export async function incrementPostCounter(
  slug: string,
  type: "increment_view" | "clap"
): Promise<void> {
  try {
    const raw = await fs.readFile(SHARED_DB_FILE, "utf-8");
    const db = JSON.parse(raw) as SharedStore;
    const post = db.posts.find((p) => p.slug === slug);
    if (post) {
      if (type === "increment_view") {
        post.views = (post.views || 0) + 1;
      } else {
        post.claps = (post.claps || 0) + 1;
      }
      await fs.writeFile(SHARED_DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    }
  } catch {
    // fallback if file locked
  }
}
