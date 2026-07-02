import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostSummary } from "@/lib/types";

// A contextual internal-link block dropped inside the article body. Real in-body
// internal links with descriptive anchor text (the post titles) build topical
// authority and keep readers on related guides — a genuine SEO signal that was
// missing from the migrated content.
export function InContentLinks({
  posts,
  heading = "Keep reading",
}: {
  posts: PostSummary[];
  heading?: string;
}) {
  if (posts.length === 0) return null;

  return (
    <aside className="my-8 rounded-2xl border border-line bg-brand-soft/60 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-600">
        {heading}
      </p>
      <ul className="space-y-2.5">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/${p.slug}/`}
              className="inline-flex items-start gap-1.5 font-semibold leading-snug text-ink-800 transition-colors hover:text-brand-600"
            >
              <ArrowUpRight
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                aria-hidden="true"
              />
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default InContentLinks;
