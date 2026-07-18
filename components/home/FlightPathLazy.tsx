"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";

// FlightPath is a purely decorative (aria-hidden), below-the-fold GSAP
// MotionPath animation used only on the homepage.
//
// next/dynamic with ssr:false already split it into its own chunk, but Next
// still emits that chunk as an async <script> in the initial HTML, so every home
// page visit downloaded and executed GSAP + ScrollTrigger + MotionPathPlugin
// whether or not the visitor ever scrolled far enough to see a single frame of
// it. On a throttled mobile CPU that was the largest remaining block of script
// evaluation on the page.
//
// So the import is now gated on proximity: nothing is requested until the
// placeholder is within a viewport of being seen. A visitor who reads the hero
// and leaves never pays for the animation at all, and one who scrolls down gets
// it a screen ahead of time, which is far enough to be invisible.
const FlightPath = dynamic(() => import("./FlightPath"), { ssr: false });

export default function FlightPathLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // No IntersectionObserver, or the visitor asked for reduced motion: never
    // load it. The placeholder band keeps the page rhythm either way, and the
    // whole section is aria-hidden decoration, so nothing is lost.
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      // One viewport of lead time: enough for the chunk to arrive and mount
      // before it actually scrolls into view.
      { rootMargin: "100% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // FlightPath renders its own <section><Container>, so swap the whole
  // placeholder out rather than wrapping it: nesting the two would put a
  // section inside a section and double the horizontal padding.
  if (show) return <FlightPath />;

  return (
    <section className="py-8 sm:py-12" aria-hidden>
      <Container>
        <div
          ref={ref}
          className="h-[220px] w-full rounded-5xl border border-line bg-brand-soft sm:h-[260px]"
        />
      </Container>
    </section>
  );
}
