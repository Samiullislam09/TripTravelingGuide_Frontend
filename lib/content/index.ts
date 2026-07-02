// Content access layer. Prefers the live CMS (dashboard /api/public) and falls
// back to local sample posts so the site always builds. All page components go
// through these functions — never fetch directly.
//
// When the dashboard public API is ready, set DASHBOARD_API_URL in env and the
// fetchers below light up automatically. Until then, sample data is served.

import type { Post, PostSummary, Category } from "@/lib/types";
import { samplePosts } from "./sample-posts";
import { extraPosts } from "./sample-posts-extra";
import { readingTimeMinutes } from "@/lib/utils";

const allSamples = [...samplePosts, ...extraPosts];

const API = process.env.DASHBOARD_API_URL?.replace(/\/$/, "");

// Revalidate cached CMS responses every 5 minutes (ISR-friendly).
const REVALIDATE = 300;

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

async function fromApi<T>(path: string): Promise<T | null> {
  if (!API) return null;
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: REVALIDATE },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const live = await fromApi<Post[]>("/api/public/posts");
  const source = live && live.length ? live : allSamples;
  return source
    .map(toSummary)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export async function getPostSlugs(): Promise<string[]> {
  const live = await fromApi<Post[]>("/api/public/posts");
  const source = live && live.length ? live : allSamples;
  return source.map((p) => p.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const live = await fromApi<Post>(`/api/public/posts/${slug}`);
  if (live) return live;
  return allSamples.find((p) => p.slug === slug) ?? null;
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

export async function getRelatedPosts(
  post: Post,
  limit = 3
): Promise<PostSummary[]> {
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
