"use server";

import { updateTag } from "next/cache";
import {
  appendComment,
  incrementPostCounter,
} from "@/lib/content";

export interface CommentActionState {
  success?: boolean;
  error?: string;
}

export async function addCommentAction(
  _prevState: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  const postSlug = (formData.get("postSlug") as string | null)?.trim() || "";
  const author = (formData.get("author") as string | null)?.trim() || "ผู้อ่านทั่วไป";
  const body = (formData.get("body") as string | null)?.trim() || "";

  if (!postSlug || body.length < 2) {
    return { error: "กรุณาพิมพ์ความคิดเห็นอย่างน้อย 2 ตัวอักษร" };
  }

  await appendComment({
    id: `cmt-${Date.now()}`,
    postSlug,
    author,
    body,
    createdAt: new Date().toISOString(),
  });

  updateTag("comments");
  updateTag(`comments-${postSlug}`);

  return { success: true };
}

export async function clapPostAction(slug: string): Promise<void> {
  await incrementPostCounter(slug, "clap");
  updateTag("posts");
  updateTag(`post-${slug}`);
}
