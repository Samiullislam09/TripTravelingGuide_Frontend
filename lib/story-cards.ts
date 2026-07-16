// Story cards = a web story joined to the guide it points at, so a card can be
// filtered by category and sorted by date without duplicating either fact in
// lib/web-stories.ts. The post row stays the single source of truth for both.
//
// Server-only: it reads posts from Supabase. Client components (the home rail)
// take the resulting array as a prop.

import "server-only";

import { getAllPosts } from "@/lib/content";
import { webStories, storyImage } from "@/lib/web-stories";

export interface StoryCard {
  slug: string; // the /web-stories/<slug> page
  title: string;
  image: string; // ready-to-render poster URL
  categoryName: string;
  categorySlug: string;
  publishedAt: string; // ISO, from the guide
  popularRank?: number;
}

/**
 * Every web story whose guide is published, newest first.
 *
 * A story whose post is missing or unpublished is dropped: its card would link
 * to a live AMP page whose only CTA 404s.
 */
export async function getStoryCards(): Promise<StoryCard[]> {
  const posts = await getAllPosts();
  const bySlug = new Map(posts.map((p) => [p.slug, p]));

  return webStories
    .flatMap((story) => {
      const post = bySlug.get(story.postSlug);
      if (!post) return [];
      return [
        {
          slug: story.slug,
          title: story.title,
          image: storyImage(story.pages[0].image),
          categoryName: post.category.name,
          categorySlug: post.category.slug,
          publishedAt: post.publishedAt,
          popularRank: story.popularRank,
        },
      ];
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
