"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Pause, X } from "lucide-react";

export interface Story {
  id: string;
  title: string;
  image: string;
  href?: string;
  category?: string;
}

const STORY_DURATION = 5000; // ms

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

interface StoryPlayerProps {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}

/**
 * Full-screen, auto-advancing story player (Instagram/Facebook style). Tap zones
 * for prev/next, hold to pause, progress bars, keyboard + swipe support.
 */
export default function StoryPlayer({
  stories,
  startIndex,
  onClose,
}: StoryPlayerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  const current = stories[index];

  const goTo = useCallback(
    (next: number, dir: number) => {
      if (next < 0) return;
      if (next >= stories.length) {
        onClose();
        return;
      }
      setDirection(dir);
      setIndex(next);
      setProgress(0);
      elapsedRef.current = 0;
      startRef.current = null;
    },
    [stories.length, onClose],
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Auto-advance timer (disabled for reduced motion)
  useEffect(() => {
    if (reducedMotion) return;
    if (paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now - elapsedRef.current;
      const elapsed = now - startRef.current;
      elapsedRef.current = elapsed;
      const ratio = Math.min(elapsed / STORY_DURATION, 1);
      setProgress(ratio);
      if (ratio >= 1) {
        next();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [index, paused, reducedMotion, next]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, next, prev]);

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.25 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Story: ${current.title}`}
    >
      <div className="relative h-full w-full max-w-md overflow-hidden bg-black sm:h-[92vh] sm:rounded-3xl">
        {/* Progress bars */}
        <div className="absolute inset-x-0 top-0 z-30 flex gap-1.5 p-3 pt-4">
          {stories.map((s, i) => (
            <div
              key={s.id}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width:
                    i < index
                      ? "100%"
                      : i === index
                        ? `${(reducedMotion ? 0 : progress) * 100}%`
                        : "0%",
                  transition: i === index && !paused ? "width 80ms linear" : "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* Top bar: title + close */}
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-4 pb-3 pt-8">
          <div className="min-w-0 flex-1">
            {current.category && (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                {current.category}
              </p>
            )}
            <p className="truncate text-sm font-semibold text-white drop-shadow">
              {current.title}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {paused && !reducedMotion && (
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white"
              >
                <Pause className="h-4 w-4" />
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close stories"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Slide */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current.id}
            custom={direction}
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? 40 : -40 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? -40 : 40 }
            }
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={current.image}
              alt={current.title}
              fill
              sizes="(max-width: 768px) 100vw, 28rem"
              priority
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"
            />
          </motion.div>
        </AnimatePresence>

        {/* Tap zones + hold to pause */}
        <button
          type="button"
          onClick={prev}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          aria-label="Previous story"
          className="absolute inset-y-0 left-0 z-20 w-1/3 focus-visible:outline-none"
        />
        <button
          type="button"
          onClick={next}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          aria-label="Next story"
          className="absolute inset-y-0 right-0 z-20 w-1/3 focus-visible:outline-none"
        />

        {/* Visible prev/next controls (in addition to tap zones) */}
        {index > 0 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous story"
            className="absolute left-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <button
          type="button"
          onClick={next}
          aria-label="Next story"
          className="absolute right-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:grid"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Bottom CTA */}
        {current.href && (
          <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center p-5">
            <Link
              href={current.href}
              className="btn btn-gradient pointer-events-auto inline-flex items-center gap-2 text-sm"
            >
              Read story
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
