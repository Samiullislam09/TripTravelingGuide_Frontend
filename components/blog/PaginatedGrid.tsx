"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PostSummary } from "@/lib/types";
import { PostCard } from "@/components/post/PostCard";
import { Pagination } from "@/components/blog/Pagination";
import { SortTabs } from "@/components/blog/SortTabs";
import { sortPosts, type SortKey } from "@/lib/sort-posts";
import { cn } from "@/lib/utils";

interface PaginatedGridProps {
  posts: PostSummary[];
  /** Cards per page. Default 12. */
  pageSize?: number;
  className?: string;
}

// Client-side paginated card grid (12 per page) with numbered pages and a
// Latest / Oldest / Popular sort control. Used where there is no search toolbar
// (e.g. a category page).
export function PaginatedGrid({
  posts,
  pageSize = 12,
  className,
}: PaginatedGridProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>("latest");
  const topRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => sortPosts(posts, sort), [posts, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const visible = sorted.slice(start, start + pageSize);

  function goTo(next: number) {
    setPage(next);
    if (topRef.current) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      topRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  // Back to page 1 when the sort changes, and keep the page in range.
  useEffect(() => {
    setPage(1);
  }, [sort]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div ref={topRef} className={cn("scroll-mt-28", className)}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500" aria-live="polite">
          {sorted.length} {sorted.length === 1 ? "guide" : "guides"}
          {totalPages > 1 ? ` · page ${current} of ${totalPages}` : ""}
        </p>
        <SortTabs value={sort} onChange={setSort} />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
        {visible.map((post, i) => (
          <PostCard key={post.slug} post={post} index={start + i} priority={i < 3} />
        ))}
      </div>

      <Pagination page={current} totalPages={totalPages} onChange={goTo} />
    </div>
  );
}

export default PaginatedGrid;
