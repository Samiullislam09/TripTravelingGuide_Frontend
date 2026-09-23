// Content access layer — reads published posts straight from Supabase (the
// `Article` table the dashboard writes to). Every page component goes through
// these functions; none of them fetch Supabase directly.
//
// Reads run server-side with the service-role client (RLS-bypassing) and are
// deduped per-render with React cache(). Supabase is always up, so there is no
// sample-data fallback anymore — a read failure yields an empty list, not stale
// dummy content.

import "server-only";

import { cache } from "react";
import type { Post, PostSummary, Category, FaqItem } from "@/lib/types";
import { supabaseAdmin } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { readingTimeMinutes } from "@/lib/utils";

const TABLE = "Article";

// Prisma stores columns in camelCase (quoted identifiers) — select them as-is.
//
// Two column sets, on purpose. `contentHtml` is the only large field on this
// table (each post runs ~15-20KB of HTML; everything else is a few hundred
// bytes), so selecting it for every listing query is what blew the Supabase
// free-tier egress quota to 340% in September 2026 and took the whole site
// down with a 402 "exceed_egress_quota" — every list-type page (home, blog,
// explore, every category page, sitemap.xml, /api/search, /api/indexnow, and
// getRelatedPosts on EVERY single post page) pulled the full body of every
// published post just to read a title and an excerpt, then threw the HTML
// away. SUMMARY_COLUMNS drops contentHtml and adds wordCount (already written
// by the CMS) so reading time can still be computed without transferring the
// body. Only loadPostBySlug — the single targeted row a post page renders —
// still selects the full COLUMNS including contentHtml.
const SUMMARY_COLUMNS =
  "slug,title,metaTitle,metaDescription,primaryKeyword,wordCount," +
  "coverImageUrl,coverImageAlt,categoryName,categorySlug,tags,publishedAt,createdAt,status";
const COLUMNS =
  "slug,title,metaTitle,metaDescription,primaryKeyword,contentHtml," +
  "coverImageUrl,coverImageAlt,categoryName,categorySlug,tags,publishedAt,createdAt,status";

// Posts carry no author column yet; every byline uses the editorial identity.
// A real bio + social links here are a genuine E-E-A-T trust signal (they show
// a person stands behind the guide), which matters for Helpful-Content recovery.
const DEFAULT_AUTHOR = {
  name: "Samiul Islam",
  slug: "samiul-islam",
  role: "Founder of TripTravelingGuide",
  image:
    "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/2025/face.jpg",
  url: "/founder",
  bio:
    "Samiul Islam is the founder of TripTravelingGuide and a full-stack web developer behind projects like CGHEVEN and SnowPredictions. He researches routes, prices, and the on-the-ground details that decide a trip, fact-checks every guide before it goes live, and revisits the most-read ones through the year.",
  // Only the profiles that are actually filled in on lib/site.ts. Empty ones are
  // dropped by the AuthorBox, so no dead icons ever render.
  social: {
    portfolio: site.social.portfolio,
    github: site.social.github,
    linkedin: site.social.linkedin,
    instagram: site.social.instagram,
    youtube: site.social.youtube,
  } as Record<string, string>,
} as const;

interface Row {
  slug: string;
  title: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  primaryKeyword: string | null;
  contentHtml: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  tags: string | null;
  publishedAt: string | null;
  createdAt: string | null;
  status: string | null;
}

// Same row shape minus contentHtml, plus wordCount — what SUMMARY_COLUMNS
// actually returns. See the comment on SUMMARY_COLUMNS above.
type SummaryRow = Omit<Row, "contentHtml"> & { wordCount: number | null };

function toIso(value: string | null): string {
  const d = value ? new Date(value) : new Date();
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// Migrated WordPress excerpts carry artifacts that read as low-quality in the
// SERP: "[…]" truncation placeholders, raw HTML entities, and em/en dashes
// (against our house style). Clean them so meta descriptions, JSON-LD, and cards
// all show polished, human-looking copy.
function cleanExcerpt(raw: string): string {
  return raw
    .replace(/&hellip;/gi, "…")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#8217;|&rsquo;/gi, "’")
    .replace(/&amp;/gi, "&")
    .replace(/\s*\[\s*(?:…|\.{3})\s*\]\s*/g, " ") // remove "[ … ]" placeholder
    .replace(/\s*[—–]\s*/g, ", ") // no em/en dashes
    .replace(/\s+/g, " ")
    .replace(/\s*…\s*$/, "") // drop a trailing ellipsis
    .replace(/[\s,]+$/, "")
    .trim();
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/gi, "&")
    .replace(/&#8217;|&rsquo;/gi, "’")
    .replace(/&#8211;|&ndash;/gi, "-")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Pull the on-page FAQ (an <h2>Frequently asked questions</h2> followed by
// <h3>Q</h3><p>A</p> pairs) out of the article HTML so it can also be emitted as
// FAQPage JSON-LD for rich results. Returns [] when there is no FAQ block.
function extractFaq(html: string): FaqItem[] {
  const section = html.match(
    /<h2[^>]*>\s*(?:frequently asked questions|faqs?)\s*<\/h2>([\s\S]*?)(?:<h2|$)/i,
  );
  if (!section) return [];
  const items: FaqItem[] = [];
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let x: RegExpExecArray | null;
  while ((x = re.exec(section[1])) !== null) {
    const question = stripTags(x[1]);
    const answer = stripTags(x[2]);
    if (question && answer) items.push({ question, answer });
  }
  return items;
}

// `faq` extraction runs a handful of regexes over the full article HTML — only
// the single-post page actually renders FAQs (for the on-page accordion + the
// FAQPage schema), so it's opt-in. Every list/summary page (home, blog,
// category, related posts, …) shares one cached bulk fetch of every post; if
// it computed the FAQ for all of them on every render, that's O(all posts)
// regex work paid on every page that never uses it. Only getPostBySlug (which
// queries a single row) turns it on.
function rowToPost(r: Row, opts: { faq?: boolean } = {}): Post {
  const tags = (r.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const category: Category = {
    name: r.categoryName?.trim() || "Travel",
    slug: r.categorySlug?.trim() || "travel",
  };

  const contentHtml = r.contentHtml || "";
  const coverImage = r.coverImageUrl?.trim() || undefined;
  const excerpt = cleanExcerpt(r.metaDescription || "");

  return {
    slug: r.slug,
    title: r.title || r.slug,
    metaTitle: r.metaTitle?.trim() || undefined,
    metaDescription: excerpt || undefined,
    focusKeyword: r.primaryKeyword?.trim() || undefined,
    excerpt,
    contentHtml,
    coverImage,
    coverAlt: r.coverImageAlt?.trim() || undefined,
    author: { ...DEFAULT_AUTHOR },
    category,
    tags,
    faq: opts.faq ? extractFaq(contentHtml) : [],
    publishedAt: toIso(r.publishedAt || r.createdAt),
    readingMinutes: readingTimeMinutes(contentHtml),
    // Surface posts that actually have a real image on the homepage hero.
    featured: Boolean(coverImage),
  };
}

// Builds a PostSummary straight from a summary row — no contentHtml ever
// crosses the wire for a listing/related/category/sitemap read. Reading time
// comes from the CMS-computed wordCount column instead of stripping HTML;
// a post somehow missing wordCount just gets a flat estimate rather than
// paying for a full-body fetch to compute it precisely.
function rowToSummary(r: SummaryRow): PostSummary {
  const category: Category = {
    name: r.categoryName?.trim() || "Travel",
    slug: r.categorySlug?.trim() || "travel",
  };
  const coverImage = r.coverImageUrl?.trim() || undefined;
  const excerpt = cleanExcerpt(r.metaDescription || "");
  const words = r.wordCount ?? 0;

  return {
    slug: r.slug,
    title: r.title || r.slug,
    excerpt,
    coverImage,
    coverAlt: r.coverImageAlt?.trim() || undefined,
    category,
    author: { name: DEFAULT_AUTHOR.name, slug: DEFAULT_AUTHOR.slug, image: DEFAULT_AUTHOR.image },
    publishedAt: toIso(r.publishedAt || r.createdAt),
    readingMinutes: words > 0 ? Math.max(1, Math.round(words / 220)) : 5,
    featured: Boolean(coverImage),
  };
}

// One Supabase round-trip per render, shared across all callers. Summary
// columns only — see SUMMARY_COLUMNS above for why this matters.
const loadPosts = cache(async (): Promise<PostSummary[]> => {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from(TABLE)
      .select(SUMMARY_COLUMNS)
      .eq("status", "published")
      .order("publishedAt", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("[content] Supabase read failed:", error.message);
      return [];
    }
    return ((data ?? []) as unknown as SummaryRow[]).map((r) => rowToSummary(r));
  } catch (e) {
    console.error("[content] Supabase read threw:", (e as Error).message);
    return [];
  }
});

export async function getAllPosts(): Promise<PostSummary[]> {
  return loadPosts();
}

export async function getPostSlugs(): Promise<string[]> {
  return (await loadPosts()).map((p) => p.slug);
}

// Single-post fetch — queries Supabase directly for the one row instead of
// loading + parsing every published post's full HTML just to .find() one.
// Post pages are the highest-traffic page type on this site (organic search
// lands here), so this is the fetch worth keeping as light as possible.
// Cached per-slug with React cache() so repeat calls in the same request
// (generateMetadata + the page component both call this) still dedupe to one
// Supabase round trip.
const loadPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from(TABLE)
      .select(COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error("[content] Supabase read failed:", error.message);
      return null;
    }
    if (!data) return null;
    return rowToPost(data as unknown as Row, { faq: true });
  } catch (e) {
    console.error("[content] Supabase read threw:", (e as Error).message);
    return null;
  }
});

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return loadPostBySlug(slug);
}

export async function getFeaturedPosts(limit = 3): Promise<PostSummary[]> {
  const all = await getAllPosts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getLatestPosts(limit = 9): Promise<PostSummary[]> {
  return (await getAllPosts()).slice(0, limit);
}

// "Popular" without analytics: approximate deterministically so the ordering is
// stable across renders. Posts with a real cover image surface first, then the
// more substantial reads. Swap this for real GA4/GSC pageview data once wired.
export async function getPopularPosts(limit = 12): Promise<PostSummary[]> {
  const all = await getAllPosts();
  return [...all]
    .sort((a, b) => {
      const af = a.featured ? 1 : 0;
      const bf = b.featured ? 1 : 0;
      if (bf !== af) return bf - af;
      return (b.readingMinutes ?? 0) - (a.readingMinutes ?? 0);
    })
    .slice(0, limit);
}

export async function getPostsByCategory(slug: string): Promise<PostSummary[]> {
  return (await getAllPosts()).filter((p) => p.category.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  const all = await getAllPosts();
  const map = new Map<string, Category>();
  // `all` is already newest-first, so the first cover we see per category is the
  // most recent one — a good representative "asset" image for that category.
  for (const p of all) {
    const existing = map.get(p.category.slug);
    if (!existing) {
      map.set(p.category.slug, {
        ...p.category,
        image: p.coverImage,
        count: 1,
      });
    } else {
      existing.count = (existing.count ?? 0) + 1;
      if (!existing.image && p.coverImage) existing.image = p.coverImage;
    }
  }
  return Array.from(map.values());
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<PostSummary[]> {
  const all = await getAllPosts();
  return all
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aMatch = a.category.slug === post.category.slug ? 1 : 0;
      const bMatch = b.category.slug === post.category.slug ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, limit);
}
