import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/content";
import { pingIndexNow } from "@/lib/server/indexnow";
import { absoluteUrl } from "@/lib/site";

export const runtime = "nodejs";

// POST { "urls": ["https://triptravelingguide.com/some-post/"] }
//   → submit specific URLs to IndexNow (call this from the dashboard right after
//     it publishes or updates a post).
export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const urls = Array.isArray((body as { urls?: unknown })?.urls)
    ? ((body as { urls: unknown[] }).urls.filter((u) => typeof u === "string") as string[])
    : [];
  if (urls.length === 0) {
    return NextResponse.json({ ok: false, error: "No urls provided" }, { status: 400 });
  }
  const result = await pingIndexNow(urls);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

// GET /api/indexnow?token=<INDEXNOW_KEY>
//   → submit every published post URL (handy for a cron or a one-off resubmit).
export async function GET(request: Request): Promise<NextResponse> {
  const token = new URL(request.url).searchParams.get("token");
  const key = process.env.INDEXNOW_KEY;
  if (!key || token !== key) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const posts = await getAllPosts();
  const urls = posts.map((p) => absoluteUrl(`/${p.slug}/`));
  const result = await pingIndexNow(urls);
  return NextResponse.json(result);
}
