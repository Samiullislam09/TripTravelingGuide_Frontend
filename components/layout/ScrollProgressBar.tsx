"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-progress bar that doubles as the top nav's BOTTOM BORDER: pinned at
 * the header's bottom edge (top-16 = the 4rem sticky header height) and grown
 * left→right in the brand gradient as the page is scrolled, so the nav border
 * fills with brand colour the closer you get to the end. Uses a passive scroll
 * listener throttled with requestAnimationFrame for smoothness.
 */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      frameRef.current = null;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-[51] h-[3px]"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-brand-gradient"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
