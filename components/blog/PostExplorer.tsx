"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Loader2, X, SlidersHorizontal, LayoutGrid, ChevronDown, Check } from "lucide-react";
import type { Category, PostSummary } from "@/lib/types";
import { searchPosts } from "@/lib/api";
import { PostCard } from "@/components/post/PostCard";
import { Pagination } from "@/components/blog/Pagination";
import { SortTabs } from "@/components/blog/SortTabs";
import { sortPosts, type SortKey } from "@/lib/sort-posts";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

interface PostExplorerProps {
  /** Full list shown when there's no search query. */
  posts: PostSummary[];
  categories: Category[];
  /** Show a 2 / 3 / 4 column chooser (blog page). Home leaves it off. */
  selectableGrid?: boolean;
}

// Static column presets so Tailwind keeps the classes at build time. Phones
// always show a single full-width column (a card must never be squeezed to
// half-width on a ~375-430px screen); the chosen density kicks in from `sm` up.
const GRID_COLS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

/**
 * Category filter chips + AJAX live search over posts. When the query is empty
 * we show `posts` filtered by the active category; when the user types we hit
 * `/api/search` (debounced) and filter those results by category too.
 */
export function PostExplorer({
  posts,
  categories,
  selectableGrid = false,
}: PostExplorerProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const [results, setResults] = useState<PostSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [cols, setCols] = useState<number>(4);
  const [sort, setSort] = useState<SortKey>("latest");
  const [gridOpen, setGridOpen] = useState(false);
  const [page, setPage] = useState(1);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridTop = useRef<HTMLParagraphElement>(null);

  // Remember the reader's column choice across visits (blog page only).
  useEffect(() => {
    if (!selectableGrid) return;
    const saved = Number(window.localStorage.getItem("blogGridCols"));
    if (saved === 2 || saved === 3 || saved === 4) setCols(saved);
  }, [selectableGrid]);

  function chooseCols(n: number) {
    setCols(n);
    if (selectableGrid) window.localStorage.setItem("blogGridCols", String(n));
  }

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

  const sorted = useMemo(() => sortPosts(visible, sort), [visible, sort]);

  // Reset to the first page whenever the filtered / searched / sorted set changes.
  useEffect(() => {
    setPage(1);
  }, [query, active, results, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function goToPage(next: number) {
    setPage(next);
    if (gridTop.current) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gridTop.current.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }
  }

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

        {/* Category filter chips — one neat row that scrolls sideways on mobile */}
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="mr-1 hidden shrink-0 items-center gap-1.5 text-sm font-medium text-ink-500 sm:inline-flex">
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

        {/* Controls: sort + a click-to-open grid density chooser */}
        <div className="flex items-center justify-end gap-2">
          <SortTabs value={sort} onChange={setSort} />
          {selectableGrid ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setGridOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={gridOpen}
                aria-label="Choose grid columns"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-600"
              >
                <LayoutGrid className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Grid</span>
                <span>{cols}</span>
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", gridOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
              {gridOpen && (
                <>
                  {/* click-away backdrop */}
                  <button
                    type="button"
                    aria-hidden
                    tabIndex={-1}
                    onClick={() => setGridOpen(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-2xl border border-line bg-surface p-1 shadow-soft"
                  >
                    {[2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="menuitemradio"
                        aria-checked={cols === n}
                        onClick={() => {
                          chooseCols(n);
                          setGridOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                          cols === n
                            ? "bg-brand-50 text-brand-600"
                            : "text-ink-700 hover:bg-ink-50",
                        )}
                      >
                        <LayoutGrid className="h-4 w-4" aria-hidden />
                        {n} columns
                        {cols === n && <Check className="ml-auto h-4 w-4" aria-hidden />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Results */}
      <p ref={gridTop} className="mt-6 scroll-mt-28 text-sm text-ink-500" aria-live="polite">
        {visible.length} {visible.length === 1 ? "article" : "articles"}
        {query.trim() ? ` for “${query.trim()}”` : ""}
        {totalPages > 1 ? ` · page ${currentPage} of ${totalPages}` : ""}
      </p>

      {visible.length > 0 ? (
        <>
          <div
            className={cn(
              "mt-5 grid items-stretch gap-5 sm:gap-6",
              GRID_COLS[cols] ?? GRID_COLS[4],
            )}
          >
            {paged.map((post, i) => (
              <PostCard
                key={post.slug}
                post={post}
                index={(currentPage - 1) * PAGE_SIZE + i}
                priority={i < 4}
              />
            ))}
          </div>

          <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
        </>
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
        "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base",
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
