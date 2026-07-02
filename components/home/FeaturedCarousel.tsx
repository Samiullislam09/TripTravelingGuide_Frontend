"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { PostSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface FeaturedCarouselProps {
  posts: PostSummary[];
}

const SLIDE_MS = 5000;

/**
 * The large "hero" card in Featured guides: auto-advances through several
 * featured posts (fade/slide), pauses on hover/focus, with dots + arrows so
 * users can browse many guides from a single big card.
 */
export function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  const slides = posts.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number, d: number) => {
      setDir(d);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );
  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  // Auto-advance
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (paused || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setTimeout(next, SLIDE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, paused, count, next]);

  if (count === 0) return null;
  const post = slides[index];

  return (
    <div
      className="card group relative h-full min-h-[22rem] overflow-hidden sm:min-h-[26rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={post.slug}
          custom={dir}
          initial={{ opacity: 0, x: dir > 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir > 0 ? -60 : 60 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Link href={`/${post.slug}/`} className="block h-full w-full">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-brand-gradient" />
            )}
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="pill bg-brand-gradient text-white">
                {post.category.name}
              </span>
              <h3 className="mt-3 max-w-2xl font-display text-2xl font-bold leading-tight text-white drop-shadow sm:text-3xl">
                {post.title}
              </h3>
              <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-white/80 sm:line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs font-medium text-white/70">
                <span>{post.author.name}</span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-white/50" />
                <span>{formatDate(post.publishedAt)}</span>
                <span className="ml-auto inline-flex items-center gap-1 font-semibold text-white">
                  Read guide
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          {/* Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous featured guide"
            className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur transition-all hover:bg-black/55 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next featured guide"
            className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur transition-all hover:bg-black/55 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => go(i, i > index ? 1 : -1)}
                aria-label={`Go to featured guide ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FeaturedCarousel;
