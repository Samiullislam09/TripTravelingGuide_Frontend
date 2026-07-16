"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PlayCircle, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StoryCard } from "@/lib/story-cards";

// The 4 CGHEVEN add-on accent colors — cycled across the story rings.
const RING = ["#f97316", "#00a2e8", "#9999ff", "#c8a2ff"];

type Sort = "latest" | "popular";

/**
 * Story rail on the home page. Each card links to a standalone AMP Web Story at
 * /web-stories/<slug> (the real, Google-indexable kind), with a gentle auto-scroll.
 *
 * Filters: Latest (default) / Popular, plus a category dropdown that narrows the
 * rail to one category. Cards arrive pre-sorted newest-first from getStoryCards().
 */
export function HomeStories({ stories }: { stories: StoryCard[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<Sort>("latest");
  const [category, setCategory] = useState("all");

  // Categories that actually have a story, in rail order.
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const s of stories) {
      if (!seen.has(s.categorySlug)) seen.set(s.categorySlug, s.categoryName);
    }
    return [...seen].map(([slug, name]) => ({ slug, name }));
  }, [stories]);

  const visible = useMemo(() => {
    const list =
      category === "all"
        ? stories
        : stories.filter((s) => s.categorySlug === category);
    if (sort === "latest") return list; // already newest-first
    // Popular: ranked stories first (1 = highest), the rest keep date order.
    return [...list].sort(
      (a, b) => (a.popularRank ?? Infinity) - (b.popularRank ?? Infinity)
    );
  }, [stories, category, sort]);

  const scrollByDir = useCallback((dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-story-card]");
    const step = card ? card.offsetWidth + 16 : 220;
    if (dir === 1 && rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      rail.scrollBy({ left: step * dir, behavior: "smooth" });
    }
  }, []);

  // Auto-slide (pauses on hover/touch via the rail handlers below).
  const paused = useRef(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!paused.current) scrollByDir(1);
    }, 3500);
    return () => window.clearInterval(id);
  }, [scrollByDir]);

  // A new filter should start the rail from the first card, not mid-scroll.
  useEffect(() => {
    railRef.current?.scrollTo({ left: 0 });
  }, [sort, category]);

  if (stories.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Tap through"
          title="Web stories"
          action={{ label: "View all", href: "/web-stories" }}
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Sort stories"
            className="flex rounded-full border border-line p-1"
          >
            {(["latest", "popular"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                  sort === key
                    ? "bg-brand-600 text-white"
                    : "text-ink-500 hover:text-brand-600"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <label className="ml-auto flex items-center gap-2 text-sm text-ink-500">
            <span className="sr-only sm:not-sr-only">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="relative mt-6">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            aria-label="Previous stories"
            className="absolute -left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 text-ink-700 shadow-soft backdrop-blur transition hover:border-brand-400 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 sm:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            aria-label="Next stories"
            className="absolute -right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 text-ink-700 shadow-soft backdrop-blur transition hover:border-brand-400 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 sm:grid"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={railRef}
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
            onTouchStart={() => (paused.current = true)}
            className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:px-0"
          >
            {visible.map((story, i) => (
              <Link
                key={story.slug}
                href={`/web-stories/${story.slug}/`}
                data-story-card
                aria-label={`Open web story: ${story.title}`}
                className="group relative aspect-[9/16] w-44 shrink-0 snap-start overflow-hidden rounded-3xl bg-surface-2 ring-1 ring-line transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:w-48 lg:w-52"
              >
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 640px) 11rem, 13rem"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                />
                <span
                  aria-hidden
                  className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full text-white shadow-sm"
                  style={{ background: RING[i % RING.length] }}
                >
                  <PlayCircle className="h-5 w-5" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-3 text-left">
                  <span className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow">
                    {story.title}
                  </span>
                </span>
              </Link>
            ))}

            <Link
              href="/web-stories"
              data-story-card
              className="group relative flex aspect-[9/16] w-44 shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-colors hover:border-brand-400 sm:w-48 lg:w-52"
            >
              <span className="relative h-2/3 w-full overflow-hidden bg-brand-soft">
                <span className="absolute inset-0 bg-brand-gradient opacity-90" />
              </span>
              <span className="relative -mt-6 flex flex-1 flex-col items-center px-2 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full border-4 border-surface bg-brand-600 text-white transition-transform group-hover:scale-110">
                  <Plus className="h-5 w-5" />
                </span>
                <span className="mt-2 text-sm font-bold text-ink-900">
                  See all stories
                </span>
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HomeStories;
