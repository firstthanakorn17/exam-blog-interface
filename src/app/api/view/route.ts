import { NextResponse } from "next/server";
import { after } from "next/server";
import { incrementPostCounter } from "@/lib/content";

export async function POST(request: Request) {
  const { slug } = await request.json();
  if (slug) {
    after(async () => {
      await incrementPostCounter(slug, "increment_view");
    });
  }
  return NextResponse.json({ ok: true });
}
