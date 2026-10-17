import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "";
  const disable = searchParams.get("disable") === "1";

  const draft = await draftMode();
  if (disable) {
    draft.disable();
    redirect(slug ? `/blog/${slug}` : "/");
  }

  draft.enable();
  redirect(slug ? `/blog/${slug}` : "/");
}
