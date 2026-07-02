// Structured-data (JSON-LD) engine. Every page gets Organization + WebSite
// schema; posts additionally get BlogPosting + BreadcrumbList + (optional)
// FAQPage. Google reads these for rich snippets, sitelinks searchbox, breadcrumb
// trails, and FAQ accordions in search results.
//
// We emit ONE combined @graph per page (Google's recommended pattern) so the
// node @ids cross-reference cleanly (article -> publisher -> logo, etc.).

import { site, absoluteUrl, socialUrls } from "@/lib/site";
import type { Post, Author } from "@/lib/types";

type Json = Record<string, unknown>;

const ORG_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");
const LOGO_ID = absoluteUrl("/#logo");

export function organizationNode(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.legalName,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: absoluteUrl(site.logo),
      contentUrl: absoluteUrl(site.logo),
    },
    image: { "@id": LOGO_ID },
    description: site.description,
    ...(socialUrls().length ? { sameAs: socialUrls() } : {}),
    ...(site.contact.email || site.contact.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            ...(site.contact.email ? { email: site.contact.email } : {}),
            ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
          },
        }
      : {}),
  };
}

export function websiteNode(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: site.name,
    description: site.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
    // Sitelinks searchbox — lets Google show a search box under the brand result.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function personNode(author: Author): Json {
  return {
    "@type": "Person",
    "@id": absoluteUrl(`/author/${author.slug}#person`),
    name: author.name,
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.image ? { image: absoluteUrl(author.image) } : {}),
    url: absoluteUrl(author.url || `/author/${author.slug}`),
    ...(author.social && Object.values(author.social).filter(Boolean).length
      ? { sameAs: Object.values(author.social).filter(Boolean) }
      : {}),
  };
}

export interface Crumb {
  name: string;
  url: string; // relative path
}

export function breadcrumbNode(crumbs: Crumb[]): Json {
  return {
    "@type": "BreadcrumbList",
    "@id": absoluteUrl(crumbs[crumbs.length - 1]?.url || "/") + "#breadcrumb",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.url),
    })),
  };
}

export function articleNode(post: Post, crumbs?: Crumb[]): Json {
  const urlPath = `/${post.slug}/`;
  const url = absoluteUrl(urlPath);
  return {
    "@type": "BlogPosting",
    "@id": url + "#article",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    ...(post.coverImage
      ? {
          image: {
            "@type": "ImageObject",
            url: absoluteUrl(post.coverImage),
            ...(post.coverAlt ? { caption: post.coverAlt } : {}),
          },
        }
      : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@id": absoluteUrl(`/author/${post.author.slug}#person`) },
    publisher: { "@id": ORG_ID },
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
    articleSection: post.category.name,
    inLanguage: "en",
    url,
    ...(crumbs?.length ? { breadcrumb: { "@id": url + "#breadcrumb" } } : {}),
  };
}

export function faqNode(post: Post): Json | null {
  if (!post.faq || post.faq.length === 0) return null;
  return {
    "@type": "FAQPage",
    "@id": absoluteUrl(`/${post.slug}/`) + "#faq",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

// Wrap a set of nodes into a single JSON-LD @graph document.
export function graph(nodes: (Json | null)[]): Json {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean) as Json[],
  };
}

// Convenience builders for whole-page schema -------------------------------

// Sitewide nodes injected on every page (home, lists, static pages).
export function baseGraph(extra: (Json | null)[] = []): Json {
  return graph([organizationNode(), websiteNode(), ...extra]);
}

// Full schema document for a single blog post.
export function postGraph(post: Post, crumbs: Crumb[]): Json {
  return graph([
    organizationNode(),
    websiteNode(),
    personNode(post.author),
    breadcrumbNode(crumbs),
    articleNode(post, crumbs),
    faqNode(post),
  ]);
}
