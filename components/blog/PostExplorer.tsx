"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Loader2, X, SlidersHorizontal } from "lucide-react";
import type { Category, PostSummary } from "@/lib/types";
import { searchPosts } from "@/lib/api";
import { PostCard } from "@/components/post/PostCard";
import { cn } from "@/lib/utils";

interface PostExplorerProps {
  /** Full list shown when there's no search query. */
  posts: PostSummary[];
  categories: Category[];
}

/**
 * Category filter chips + AJAX live search over posts. When the query is empty
 * we show `posts` filtered by the active category; when the user types we hit
 * `/api/search` (debounced) and filter those results by category too.
 */
export function PostExplorer({ posts, categories }: PostExplorerProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const [results, setResults] = useState<PostSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced AJAX live search.
  useEffect(() => {
    const q = query.trim();
    if (debounce.current) clearTimeout(debounce.current);
    if (!q) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounce.current = setTimeout(async () => {
      try {
        const found = await searchPosts(q);
        setResults(found);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  const visible = useMemo(() => {
    const base = results ?? posts;
    if (active === "all") return base;
    return base.filter((p) => p.category.slug === active);
  }, [results, posts, active]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        {/* Live search */}
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full rounded-full border border-line bg-surface py-3.5 pl-12 pr-11 text-base text-ink-900 outline-none transition placeholder:text-ink-400 focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600/30"
          />
          {loading ? (
            <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-brand-600" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition hover:bg-ink-50 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 hidden items-center gap-1.5 text-sm font-medium text-ink-500 sm:inline-flex">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filter
          </span>
          <FilterChip
            label="All"
            active={active === "all"}
            onClick={() => setActive("all")}
          />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              label={c.name}
              active={active === c.slug}
              onClick={() => setActive(c.slug)}
            />
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="mt-6 text-sm text-ink-500" aria-live="polite">
        {visible.length} {visible.length === 1 ? "article" : "articles"}
        {query.trim() ? ` for “${query.trim()}”` : ""}
      </p>

      {visible.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          {visible.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-4xl border border-dashed border-line bg-surface px-6 py-16 text-center">
          <p className="text-lg font-semibold text-ink-900">No articles found</p>
          <p className="mt-1 text-ink-500">
            Try a different keyword or category filter.
          </p>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base",
        active
          ? "brand-fill text-white"
          : "border border-line bg-surface text-ink-700 hover:border-brand-400 hover:text-brand-600",
      )}
    >
      {label}
    </button>
  );
}

export default PostExplorer;
