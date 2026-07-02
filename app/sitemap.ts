import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getAllPosts, getCategories } from "@/lib/content";

// Native Next.js sitemap — regenerated on each build/revalidate. Submitted to
// Google Search Console as /sitemap.xml.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
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

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/${p.slug}/`),
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
