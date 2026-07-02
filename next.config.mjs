/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
    // 301 redirects for migrated/pruned URLs go here (preserve ranking equity).
    return [];
  },
};

export default nextConfig;
