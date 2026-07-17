import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getAllPosts, getCategories } from "@/lib/content";
import { webStories } from "@/lib/web-stories";

// Native Next.js sitemap, submitted to Google Search Console as /sitemap.xml.
//
// Posts publish straight from the CMS with no redeploy, so this must revalidate
// on the same 5-minute clock as the pages it lists. Without this export Next
// builds the sitemap once at deploy time and serves that copy forever: a post
// published after a deploy stays out of the sitemap until someone happens to
// redeploy, which is how `cordelia-cruise-rules` went missing on 17 Jul 2026.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/blog"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/explore"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/founder"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/web-stories"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/editorial-policy"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/affiliate-disclosure"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy-policy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/disclaimer"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/cookie-policy"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/category/${c.slug}`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const storyPages: MetadataRoute.Sitemap = webStories.map((s) => ({
    url: absoluteUrl(`/web-stories/${s.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/${p.slug}/`),
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...storyPages, ...categoryPages, ...postPages];
}
