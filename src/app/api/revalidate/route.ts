import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (secret && secret !== "nextblog-shared-secret") {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const tags: string[] = Array.isArray(body.tags) ? body.tags : ["posts"];
    for (const tag of tags) {
      revalidateTag(tag, "max");
    }
    if (body.slug) {
      revalidatePath(`/blog/${body.slug}`);
    }
    revalidatePath("/");
    return NextResponse.json({ revalidated: true, tags });
  } catch {
    revalidateTag("posts", "max");
    revalidatePath("/");
    return NextResponse.json({ revalidated: true });
  }
}
