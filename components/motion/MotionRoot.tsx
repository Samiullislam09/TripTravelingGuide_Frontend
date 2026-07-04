"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * App-wide motion root. Mounts Lenis smooth-scroll and bridges it to GSAP
 * ScrollTrigger (one rAF loop drives both). Then wires a global scroll-reveal:
 * any element with `data-reveal` fades/slides in as it enters the viewport —
 * this powers the "full scroll animation" feel without each component importing
 * GSAP. Honors prefers-reduced-motion by skipping all motion.
 *
 * Opt-in attributes (set by components):
 *   data-reveal            → fade + slide up (default)
 *   data-reveal="left|right|up|down|zoom|none"
 *   data-reveal-delay="0.15"  (seconds)
 *   data-reveal-stagger        → on a container; its direct children stagger in
 */
export function MotionRoot() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Touch devices (phones/tablets) already get smooth, momentum-based native
    // scrolling from the OS — Lenis's wheel-hijacking is a desktop-mouse nicety
    // that adds a permanent per-frame rAF cost for no visible benefit on touch,
    // which is exactly the kind of always-on JS that hurts low-end mobile CPUs.
    // Skip it there; ScrollTrigger-driven reveals still work fine off the
    // native scroll position.
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    if (!reduce && !coarsePointer) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      // Single driver: gsap.ticker already runs its own rAF loop at display
      // refresh rate, so this is the only tick Lenis needs. (A second,
      // independent requestAnimationFrame loop used to also call lenis.raf()
      // every frame — that drove Lenis's scroll-interpolation math twice per
      // frame, all the time, on every page. Removed.)
      ticker = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");
    }

    const ctx = gsap.context(() => {
      const offsets: Record<string, gsap.TweenVars> = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: 48 },
        right: { x: -48 },
        zoom: { scale: 0.92 },
        none: {},
      };

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const dir = el.dataset.reveal || "up";
        const delay = parseFloat(el.dataset.revealDelay || "0");
        const from = offsets[dir] ?? offsets.up;

        if (reduce) {
          gsap.set(el, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
          return;
        }
        gsap.set(el, { autoAlpha: 0, ...from });
        gsap.to(el, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((container) => {
        const items = Array.from(container.children) as HTMLElement[];
        if (reduce) {
          gsap.set(items, { autoAlpha: 1, y: 0 });
          return;
        }
        gsap.set(items, { autoAlpha: 0, y: 32 });
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: container, start: "top 85%", once: true },
        });
      });

      ScrollTrigger.refresh();
    });

    // Safety net: any reveal whose trigger start sits beyond the max scroll
    // (e.g. the footer pinned at the very bottom) can never be reached, so its
    // tween would never play and the element would stay invisible. After every
    // refresh, force-complete those so content is NEVER left hidden.
    const revealUnreachable = () => {
      const max = ScrollTrigger.maxScroll(window);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.animation && st.start > max + 1) st.animation.progress(1).pause();
      });
    };
    const onRefresh = () => revealUnreachable();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Re-measure once images/fonts settle (they change page height).
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t1 = window.setTimeout(refresh, 400);
    const t2 = window.setTimeout(refresh, 1500);
    requestAnimationFrame(revealUnreachable);

    return () => {
      ctx.revert();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      if (lenis) {
        // Remove the exact function reference that was added — passing a new
        // closure here (as before) silently fails to unregister it.
        if (ticker) gsap.ticker.remove(ticker);
        lenis.destroy();
        document.documentElement.classList.remove("lenis");
      }
    };
  }, []);

  return null;
}
