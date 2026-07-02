// Next.js Metadata helpers — every page's title/description/canonical/OpenGraph/
// Twitter card flows through here so SEO tags stay consistent.

import type { Metadata } from "next";
import { site, absoluteUrl } from "@/lib/site";
import type { Post } from "@/lib/types";

interface BuildMetaArgs {
  title: string;
  description: string;
  path: string; // relative, e.g. "/road-trips/"
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex,
}: BuildMetaArgs): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image || site.ogImage);
  // Brand suffix unless the title already includes it.
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;

  return {
    // `absolute` bypasses the root layout's "%s | Brand" template. fullTitle
    // already carries the brand (added above only when missing), so this stops
    // the brand being appended twice (e.g. "... | Brand | Brand").
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      url: canonical,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article"
        ? { publishedTime, modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

// Metadata for a blog post (uses SEO overrides when present).
export function postMetadata(post: Post): Metadata {
  return buildMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/${post.slug}/`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt,
  });
}
