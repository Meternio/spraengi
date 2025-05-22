import { revalidatePath, revalidateTag } from "next/cache";

import { SB_CACHE_VERSION_TAG } from "@/lib/cacheTags";

export async function POST(request: Request) {
  const data = await request.json();
  //const { searchParams } = new URL(request.url);
  //const secret = searchParams.get("signature");

  //if (!data || !secret) {
  if (!data) {
    return Response.json(
      { error: "No body or secret provided" },
      { status: 400 }
    );
  }

  /*if (secret !== process.env.STORYBOOK_WEBHOOK_REVALIDATE_SECRET) {
    return Response.json({ error: "No secret provided" }, { status: 400 });
  }*/

  const correctSlug = data.full_slug === "home" ? "/" : `/${data.full_slug}`;

  revalidateTag(SB_CACHE_VERSION_TAG);
  revalidatePath(correctSlug);

  await fetch(process.env.VERCEL_REDEPLOY_HOOK_URL!, {
    method: "POST",
  });

  return Response.json({ revalidated: true, now: Date.now() });
}
