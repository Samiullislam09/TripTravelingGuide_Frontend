// Content model shared across the site. Mirrors what the dashboard CMS will
// expose via /api/public — keep field names in sync with the dashboard.

export interface Author {
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  url?: string;
  social?: Record<string, string>;
}

export interface Category {
  name: string;
  slug: string;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Post {
  slug: string;
  title: string;
  // SEO overrides (fall back to title/excerpt when absent).
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;

  excerpt: string;
  // Rendered HTML body (from the CMS/markdown). Trusted, already-sanitized server-side.
  contentHtml: string;

  coverImage?: string;
  coverAlt?: string;

  author: Author;
  category: Category;
  tags: string[];

  faq?: FaqItem[];

  publishedAt: string; // ISO
  updatedAt?: string; // ISO
  readingMinutes?: number;

  featured?: boolean;
  // Geographic target audience — drives the hybrid USA/India content strategy.
  region?: "usa-canada" | "south-asia" | "global";
}

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  coverAlt?: string;
  category: Category;
  author: Pick<Author, "name" | "slug" | "image">;
  publishedAt: string;
  readingMinutes?: number;
  featured?: boolean;
}
