import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Default Open Graph / Twitter share image, generated at request time so we never
// ship a broken social preview. Any page that does not set its own cover image
// falls back to this (see lib/site.ts `ogImage` and lib/seo/metadata.ts).
// URL: /og-default  →  1200x630 PNG.

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Real travel guides, honest comparisons, trip planning that helps.
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 30,
            fontWeight: 500,
            opacity: 0.92,
          }}
        >
          triptravelingguide.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
