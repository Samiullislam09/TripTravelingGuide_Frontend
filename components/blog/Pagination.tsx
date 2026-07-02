"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number; // 1-based
  totalPages: number;
  onChange: (page: number) => void;
}

// Build a compact page list with ellipses: 1 … 4 5 [6] 7 8 … 20
function pageList(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const items = pageList(page, totalPages);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="size-4" aria-hidden />
      </button>

      {items.map((it, i) =>
        it === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-ink-400" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={() => onChange(it)}
            aria-current={it === page ? "page" : undefined}
            aria-label={`Page ${it}`}
            className={cn(
              "grid size-9 place-items-center rounded-full text-sm font-semibold transition-colors",
              it === page
                ? "brand-fill text-white"
                : "border border-line bg-surface text-ink-700 hover:border-brand-400 hover:text-brand-600",
            )}
          >
            {it}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </nav>
  );
}

export default Pagination;
