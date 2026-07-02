"use client";

import { useEffect, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TableOfContents({
  html,
  variant = "sidebar",
}: {
  html: string;
  /** "sidebar" = desktop rail (open by default). "inline" = mobile card (collapsed). */
  variant?: "sidebar" | "inline";
}) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(variant === "sidebar");

  // Build the list from the actual rendered article DOM so ids match anchors.
  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".prose-article");
    if (!article) {
      setItems([]);
      return;
    }

    const headings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h2, h3"),
    );
    const used = new Set<string>();
    const next: TocItem[] = [];

    for (const heading of headings) {
      const text = (heading.textContent ?? "").trim();
      if (!text) continue;

      let id = heading.id;
      if (!id) {
        id = slugify(text) || "section";
        let unique = id;
        let i = 2;
        while (used.has(unique)) {
          unique = `${id}-${i}`;
          i += 1;
        }
        id = unique;
        heading.id = id;
      }
      used.add(id);

      next.push({
        id,
        text,
        level: heading.tagName === "H3" ? 3 : 2,
      });
    }

    setItems(next);
  }, [html]);

  // Scrollspy: highlight the heading currently in view.
  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    setActiveId(id);

    if (history.replaceState) {
      history.replaceState(null, "", `#${id}`);
    }

    // On mobile the panel is a space-saving toggle, so collapse after a jump.
    if (variant === "inline") setOpen(false);
  };

  if (items.length === 0) return null;

  const list = (
    <ul
      className={cn(
        "space-y-2 border-l border-line",
        variant === "sidebar" && "max-h-[calc(100vh-14rem)] overflow-y-auto",
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => handleClick(event, item.id)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1 text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-base",
                item.level === 3 ? "pl-7" : "pl-4",
                isActive
                  ? "border-brand-600 font-semibold text-brand-600"
                  : "border-transparent text-ink-500 hover:border-line hover:text-ink-700",
              )}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        variant === "inline" && "rounded-3xl border border-line bg-surface p-4",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
          <List className="size-4" aria-hidden />
          On this page
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-ink-400 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{list}</div>
      </div>
    </nav>
  );
}
