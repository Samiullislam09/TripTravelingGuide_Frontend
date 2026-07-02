"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import StoryPlayer, { type Story } from "@/components/stories/StoryPlayer";

interface HomeStoriesProps {
  posts: PostSummary[];
}

// The 4 CGHEVEN add-on accent colors — cycled across the story rings.
const RING = ["#f97316", "#00a2e8", "#9999ff", "#c8a2ff"];

/**
 * Facebook-style stories rail: large tall story cards with gradient avatar
 * rings, prev/next arrows, and gentle auto-scroll. Tapping a card opens the
 * full-screen auto-advancing StoryPlayer.
 */
export function HomeStories({ posts }: HomeStoriesProps) {
  const items = posts.slice(0, 10);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const open = useCallback((i: number) => setActiveIndex(i), []);
  const close = useCallback(() => setActiveIndex(null), []);

  const scrollByDir = useCallback((dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-story-card]");
    const step = card ? card.offsetWidth + 16 : 220;
    // Loop back to the start when we've reached the end.
    if (dir === 1 && rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      rail.scrollBy({ left: step * dir, behavior: "smooth" });
    }
  }, []);

  // Auto-slide
  useEffect(() => {
    if (paused || activeIndex !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => scrollByDir(1), 3500);
    return () => window.clearInterval(id);
  }, [paused, activeIndex, scrollByDir]);

  if (items.length === 0) return null;

  const stories: Story[] = items.map((post) => ({
    id: post.slug,
    title: post.title,
    image:
      post.coverImage ?? `https://picsum.photos/seed/${post.slug}/720/1280`,
    href: `/${post.slug}/`,
    category: post.category.name,
  }));

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Tap through"
          title="Web stories"
          action={{ label: "View all", href: "/web-stories" }}
        />

        {/* Rail with arrows overlaid on the LEFT and RIGHT sides */}
        <div className="relative mt-8">
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
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            data-reveal-stagger
            className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:px-0"
          >
          {stories.map((story, i) => {
            const color = RING[i % RING.length];
            const initial = (story.category ?? story.title)
              .charAt(0)
              .toUpperCase();
            return (
              <button
                key={story.id}
                type="button"
                data-story-card
                onClick={() => open(i)}
                aria-label={`Play story: ${story.title}`}
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

                {/* Avatar with gradient ring (top-left, FB style) */}
                <span
                  aria-hidden
                  className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full p-[3px]"
                  style={{ background: color }}
                >
                  <span
                    className="grid h-full w-full place-items-center rounded-full text-sm font-extrabold text-white"
                    style={{ background: color, boxShadow: "0 0 0 2px #000" }}
                  >
                    {initial}
                  </span>
                </span>

                {/* Title (bottom) */}
                <span className="absolute inset-x-0 bottom-0 p-3 text-left">
                  <span className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow">
                    {story.title}
                  </span>
                </span>
              </button>
            );
          })}

          {/* Create-style tail card → all stories */}
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

      <AnimatePresence>
        {activeIndex !== null && (
          <StoryPlayer stories={stories} startIndex={activeIndex} onClose={close} />
        )}
      </AnimatePresence>
    </section>
  );
}

export default HomeStories;
