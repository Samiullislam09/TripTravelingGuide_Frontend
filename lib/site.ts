// Single source of truth for site-wide constants. Schema markup, metadata,
// sitemap, and the header/footer all read from here. Fill the TODO values once
// the owner provides brand assets / social links / verification IDs.

export const site = {
  name: "TripTravelingGuide",
  legalName: "TripTravelingGuide", // TODO: confirm registered/brand legal name
  tagline: "Real travel guides, honest comparisons, and trip planning that actually helps.",
  description:
    "TripTravelingGuide helps USA, Canada, and global travelers plan smarter trips with honest destination comparisons, transport guides, and first-hand travel advice.",
  // Production URL — overridden by NEXT_PUBLIC_SITE_URL in Vercel.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://triptravelingguide.com",
  locale: "en_US",
  themeColor: "#f97316",

  // Brand assets (served from /public for now; swap to real logo when provided).
  logo: "/logo.png",
  // Generated at request time by app/og-default/route.tsx (1200x630 PNG), so the
  // default social preview is never a broken/missing file.
  ogImage: "/og-default",

  // Author / E-E-A-T — critical for Helpful-Content recovery.
  founder: {
    name: "Samiul Islam",
    url: "https://samiulislam.vercel.app/",
    image:
      "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/2025/face.jpg",
  },

  // Social profiles — used in Organization sameAs schema + the footer.
  social: {
    portfolio: "https://samiulislam.vercel.app/",
    github: "https://github.com/Samiullislam09",
    linkedin: "https://www.linkedin.com/in/samiulislam09/",
    instagram: "https://www.instagram.com/samiul_islam_65/",
    youtube: "https://www.youtube.com/@WecodeTech",
    facebook: "",
    twitter: "",
    pinterest: "",
  },

  contact: {
    email: "triptravelingguide@gmail.com",
    phone: "", // TODO
  },

  // Search Console / Analytics / Ads — filled when owner provides them.
  verification: {
    google: "vPBdMth8k-xq-lpsNIj1i1HDRu309vHQTPL4hVWKpts", // GSC HTML-tag token
  },
  analytics: {
    ga4: "G-2HFJY898LL", // GA4 Measurement ID (Trip traveling guide web stream)
    adsenseClient: "ca-pub-9402348723832780", // confirmed from AdSense screenshot
  },

  // AdSense ad UNITS (the slot ids under each unit name in AdSense → Ads).
  // Each placement in the pages reads one of these. `format`/`layout` mirror the
  // unit's type so <ins> renders correctly:
  //   display  → format "auto" (responsive)
  //   in-article → format "fluid" + layout "in-article"
  //   multiplex  → format "autorelaxed"
  //   in-feed    → format "fluid" + layoutKey (NOT wired yet — needs the
  //                data-ad-layout-key value from the In-feed unit's code).
  adUnits: {
    postTop: { slot: "2443240984", format: "auto" }, // "display ad"
    postInContent: { slot: "3958668481", format: "fluid", layout: "in-article" }, // "artical ad"
    postEnd: { slot: "9747015932", format: "autorelaxed" }, // "multiple ad" (multiplex)
    postSidebar: { slot: "1202926175", format: "auto" }, // "square ads"
    homeTop: { slot: "8628343178", format: "auto" }, // "mobileres"
    homeMid: { slot: "3282401749", format: "fluid", layout: "in-article" }, // "match ads"
    // inFeed: { slot: "5786681129", format: "fluid", layoutKey: "PASTE_FROM_ADSENSE" },
  },
} as const;

// Helper: absolute URL from a path. Schema + canonical + OG all need absolute.
// Values that are already absolute (e.g. a Supabase-hosted cover image or author
// avatar) are returned untouched so we never produce "site.com/https://...".
export function absoluteUrl(path = "/"): string {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return base + "/";
  if (/^https?:\/\//i.test(path)) return path;
  return base + (path.startsWith("/") ? path : `/${path}`);
}

// Non-empty social links, for Organization.sameAs.
export function socialUrls(): string[] {
  return (Object.values(site.social) as string[]).filter((u) => u.trim().length > 0);
}
