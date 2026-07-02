import { getWebStory, renderAmpStory, webStories } from "@/lib/web-stories";

// Standalone AMP Web Story pages at /web-stories/<slug>. Route handlers bypass
// the (site) layout, so these ship as pure AMP HTML (no header/footer), which is
// what Google requires to index them as Web Stories.

export const dynamic = "force-static";

export function generateStaticParams() {
  return webStories.map((s) => ({ slug: s.slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  const story = getWebStory(slug);
  if (!story) return new Response("Not found", { status: 404 });
  return new Response(renderAmpStory(story), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
