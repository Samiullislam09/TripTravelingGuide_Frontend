import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Permanently removed URLs (fabricated / pruned content). Returning HTTP 410 Gone
// tells Google the page is permanently deleted, so it is dropped from the index
// faster and more decisively than a soft 404 (which Google keeps re-checking).
//
// To prune another page: delete its Supabase Article row, add its slug (no leading
// or trailing slash) here, AND add both "/slug" and "/slug/" to `config.matcher`.
const GONE_SLUGS = new Set<string>([
  // Fabricated destination that does not exist ("Yukevalo Island"). SEO audit 2026-07-13.
  "how-to-visit-yukevalo-island",
]);

export function middleware(req: NextRequest): NextResponse {
  const slug = req.nextUrl.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  if (GONE_SLUGS.has(slug)) {
    return new NextResponse(
      "<!doctype html><meta charset=utf-8><title>410 Gone</title>" +
        "<h1>410 — This page has been permanently removed.</h1>",
      { status: 410, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }
  return NextResponse.next();
}

export const config = {
  // Keep in sync with GONE_SLUGS above (both the plain and trailing-slash form).
  matcher: [
    "/how-to-visit-yukevalo-island",
    "/how-to-visit-yukevalo-island/",
  ],
};
