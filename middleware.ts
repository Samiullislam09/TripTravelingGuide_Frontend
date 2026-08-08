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

  // Two invented seasonal forecasts, removed 2026-08-08. Both published
  // specific snowfall totals for a season that has now ended, and no
  // forecaster issues numbers at that resolution, so the figures were made up:
  // "Boston 45-55 inches", per-city monthly totals for Colorado, White
  // Christmas probabilities to the percent, named "most dangerous travel
  // dates". This is the exact page shape that got the site classified as thin,
  // and neither URL drew a single US impression in the 28 days to 6 Aug 2026,
  // so there is no ranking equity to preserve and nothing honest to 301 them
  // to. 410 rather than 404 because the removal is deliberate and permanent.
  // Rows are backed up at dashboard scripts/backups/
  // prune-expired-forecasts-2026-08-08.json if either is ever needed again.
  "snow-prediction-2025-2026-winter-2025-2026-snow-forecast",
  "colorado-snow-predictions-2025-2026",

  // The Pittsburgh story, removed from lib/web-stories.ts the same day. Its
  // post was pruned in July 2026 and the story quoted a 97-99% El Nino
  // confidence figure NOAA never published. Google had it indexed, so it needs
  // an explicit 410 rather than the generic story 404.
  "web-stories/pittsburgh-winter-forecast-2024-2025",
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
    "/snow-prediction-2025-2026-winter-2025-2026-snow-forecast",
    "/snow-prediction-2025-2026-winter-2025-2026-snow-forecast/",
    "/colorado-snow-predictions-2025-2026",
    "/colorado-snow-predictions-2025-2026/",
    "/web-stories/pittsburgh-winter-forecast-2024-2025",
    "/web-stories/pittsburgh-winter-forecast-2024-2025/",
  ],
};
