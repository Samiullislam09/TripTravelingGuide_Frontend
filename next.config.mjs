/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The site's historically-indexed URLs (WordPress) all end in a trailing
  // slash, and canonical/sitemap emit trailing-slash URLs. Serve them the same
  // way so canonical == served == sitemap == the old Google-indexed URLs.
  trailingSlash: true,
  // Allows an isolated build dir (e.g. NEXT_DIST_DIR=.next-verify) so a CI/verify
  // build doesn't collide with a running `next dev`. Defaults to ".next".
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Allow images served from the dashboard/CMS, WordPress (during migration),
    // and Vercel Blob storage. Add real hosts as they are confirmed.
    remotePatterns: [
      { protocol: "https", hostname: "triptravelingguide.com" },
      // Supabase Storage (post cover images, uploads).
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Canonical host: force www → non-www so ranking signals never split.
      // permanent:true emits an HTTP 308, which Google treats exactly like a 301
      // (equity-passing permanent redirect).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.triptravelingguide.com" }],
        destination: "https://triptravelingguide.com/:path*",
        permanent: true,
      },
      // Old date-stamped Costco URL → the evergreen rebuild. The 2023-2024 page
      // earned $244 lifetime at a $74 RPM (our highest) before it was pruned for
      // carrying a likely-fabricated price table, so its link equity is worth
      // preserving. Dropping the year from the slug also stops us minting one
      // URL per season, which is the pattern that grew the snow cluster into 126
      // near-duplicates and got the site flagged.
      {
        source: "/costco-travel-cruises-2023-2024",
        destination: "/costco-travel-cruises/",
        permanent: true,
      },
    ];
    // Add migrated/pruned per-URL 301s here later (preserve ranking equity).
  },
};

export default nextConfig;
