"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { PostCard } from "@/components/post/PostCard";
import { cn } from "@/lib/utils";

type Accent = "coral" | "violet" | "pink";

const accentPill: Record<Accent, string> = {
  coral: "pill-coral",
  violet: "pill-violet",
  pink: "pill-pink",
};

interface ArticleCarouselProps {
  posts: PostSummary[];
  title: string;
  eyebrow?: string;
  accent?: Accent;
  /** Auto-advance interval in ms. 0 disables autoplay. */
  autoplayMs?: number;
  /** Starting accent index so sibling carousels don't all lead with orange. */
  accentOffset?: number;
}

/**
 * Professional auto-sliding article rail. Horizontal scroll-snap track (so it is
 * fully swipeable + keyboard accessible), gentle autoplay that pauses on hover /
 * focus / touch / when the tab is hidden, prev-next controls, and a live progress
 * bar. Respects prefers-reduced-motion (no autoplay, no smooth scroll).
 */
export function ArticleCarousel({
  posts,
  title,
  eyebrow,
  accent = "coral",
  autoplayMs = 4500,
  accentOffset = 0,
}: ArticleCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const paused = useRef(false);
  const reduce = useRef(false);

  const stepWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return track.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 16;
    return first.offsetWidth + gap;
  }, []);

  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? Math.min(1, track.scrollLeft / max) : 0);
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < max - 4);
  }, []);

  const scrollByDir = useCallback(
    (dir: 1 | -1, wrap = false) => {
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      const behavior: ScrollBehavior = reduce.current ? "auto" : "smooth";
      if (wrap && dir === 1 && track.scrollLeft >= max - 4) {
        track.scrollTo({ left: 0, behavior });
        return;
      }
      track.scrollBy({ left: dir * stepWidth(), behavior });
    },
    [stepWidth],
  );

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    updateState();
  }, [updateState]);

  // Autoplay loop, self-cancelling while paused / hidden / reduced-motion.
  useEffect(() => {
    if (!autoplayMs || reduce.current || posts.length <= 1) return;
    const id = window.setInterval(() => {
      if (paused.current || document.hidden) return;
      scrollByDir(1, true);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, posts.length, scrollByDir]);

  if (posts.length === 0) return null;

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  return (
    <section
      data-reveal
      className="py-8"
      aria-label={title}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pause}
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {eyebrow ? <span className={accentPill[accent]}>{eyebrow}</span> : null}
          <h2 className={cn("font-display text-2xl font-bold text-ink-900 sm:text-3xl", eyebrow && "mt-3")}>
            {title}
          </h2>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <CarouselButton dir="prev" disabled={!canPrev} onClick={() => scrollByDir(-1)} />
          <CarouselButton dir="next" disabled={!canNext} onClick={() => scrollByDir(1)} />
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateState}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {posts.map((post, i) => (
          <div
            key={post.slug}
            role="listitem"
            className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-[31.5%] lg:w-[23.5%]"
          >
            <PostCard post={post} index={i + accentOffset} priority={false} />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line" aria-hidden>
        <div
          className="h-full rounded-full bg-brand-gradient transition-[width] duration-200"
          style={{ width: `${Math.max(12, progress * 100)}%` }}
        />
      </div>
    </section>
  );
}

function CarouselButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous articles" : "Next articles"}
      className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}

export default ArticleCarousel;
