"use client";

import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS, type SortKey } from "@/lib/sort-posts";
import { cn } from "@/lib/utils";

interface SortTabsProps {
  value: SortKey;
  onChange: (key: SortKey) => void;
  className?: string;
}

// Compact segmented control: Latest / Oldest / Popular.
export function SortTabs({ value, onChange, className }: SortTabsProps) {
  return (
    <div
      role="group"
      aria-label="Sort articles"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1",
        className,
      )}
    >
      <ArrowUpDown className="ml-1.5 mr-0.5 h-4 w-4 text-ink-400" aria-hidden />
      {SORT_OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          aria-pressed={value === o.key}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
            value === o.key
              ? "brand-fill text-white"
              : "text-ink-500 hover:text-brand-600",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default SortTabs;
