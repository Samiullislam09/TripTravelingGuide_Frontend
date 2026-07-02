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
import type { Post, PostSummary, Category } from "@/lib/types";
import { supabaseAdmin } from "@/lib/supabase/server";
import { readingTimeMinutes } from "@/lib/utils";

const TABLE = "Article";

// Prisma stores columns in camelCase (quoted identifiers) — select them as-is.
const COLUMNS =
  "slug,title,metaTitle,metaDescription,primaryKeyword,contentHtml," +
  "coverImageUrl,coverImageAlt,categoryName,categorySlug,tags,publishedAt,createdAt,status";

// Posts carry no author column yet; every byline uses the editorial identity.
// (E-E-A-T author work is a later SEO step.)
const DEFAULT_AUTHOR = {
  name: "TripTravelingGuide Editorial Team",
  slug: "editorial",
  image:
    "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/2025/face.jpg",
  url: "/about",
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

function toIso(value: string | null): string {
  const d = value ? new Date(value) : new Date();
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function rowToPost(r: Row): Post {
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

  return {
    slug: r.slug,
    title: r.title || r.slug,
    metaTitle: r.metaTitle?.trim() || undefined,
    metaDescription: r.metaDescription?.trim() || undefined,
    focusKeyword: r.primaryKeyword?.trim() || undefined,
    excerpt: r.metaDescription?.trim() || "",
    contentHtml,
    coverImage,
    coverAlt: r.coverImageAlt?.trim() || undefined,
    author: { ...DEFAULT_AUTHOR },
    category,
    tags,
    publishedAt: toIso(r.publishedAt || r.createdAt),
    readingMinutes: readingTimeMinutes(contentHtml),
    // Surface posts that actually have a real image on the homepage hero.
    featured: Boolean(coverImage),
  };
}

function toSummary(p: Post): PostSummary {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    coverAlt: p.coverAlt,
    category: p.category,
    author: { name: p.author.name, slug: p.author.slug, image: p.author.image },
    publishedAt: p.publishedAt,
    readingMinutes: p.readingMinutes ?? readingTimeMinutes(p.contentHtml),
    featured: p.featured,
  };
}

// One Supabase round-trip per render, shared across all callers.
const loadPosts = cache(async (): Promise<Post[]> => {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from(TABLE)
      .select(COLUMNS)
      .eq("status", "published")
      .order("publishedAt", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("[content] Supabase read failed:", error.message);
      return [];
    }
    return ((data ?? []) as unknown as Row[]).map(rowToPost);
  } catch (e) {
    console.error("[content] Supabase read threw:", (e as Error).message);
    return [];
  }
});

export async function getAllPosts(): Promise<PostSummary[]> {
  return (await loadPosts()).map(toSummary);
}

export async function getPostSlugs(): Promise<string[]> {
  return (await loadPosts()).map((p) => p.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return (await loadPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedPosts(limit = 3): Promise<PostSummary[]> {
  const all = await getAllPosts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getLatestPosts(limit = 9): Promise<PostSummary[]> {
  return (await getAllPosts()).slice(0, limit);
}

export async function getPostsByCategory(slug: string): Promise<PostSummary[]> {
  return (await getAllPosts()).filter((p) => p.category.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  const all = await getAllPosts();
  const map = new Map<string, Category>();
  for (const p of all) map.set(p.category.slug, p.category);
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
