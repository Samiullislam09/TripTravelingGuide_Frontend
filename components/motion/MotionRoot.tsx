"use client";

import { useEffect } from "react";

/**
 * App-wide motion root. Drives the global scroll-reveal: any element with
 * `data-reveal` fades/slides in as it enters the viewport, and any
 * `data-reveal-stagger` container staggers its direct children.
 *
 * This used to run on GSAP + ScrollTrigger, with Lenis smooth-scroll bridged
 * into the same ticker. Because MotionRoot lives in the (site) layout, that
 * pulled a 50KB GSAP chunk into EVERY page, including article pages that have
 * no animation beyond these reveals. On a throttled mobile CPU that chunk cost
 * ~7.7s of script evaluation and was the single largest contributor to a 7.7s
 * total blocking time. The reveals themselves are a fade and a translate, which
 * the compositor can do natively, so GSAP was buying us nothing here.
 *
 * Now: IntersectionObserver decides when, CSS does the animating, and nothing
 * ships to the main thread but this file. GSAP still exists in the project for
 * the one thing it is genuinely needed for (the MotionPath flight path on the
 * home page), which imports it directly and lazily.
 *
 * Two correctness rules this has to keep:
 *   1. Content is NEVER left hidden. Elements start visible in the markup; we
 *      only hide one if we are certain it is off-screen and therefore has a
 *      reveal to play. No JS, no observer support, an error, an unreachable
 *      trigger: all fall through to visible.
 *   2. Anything already on screen at mount is revealed with no transition. That
 *      keeps the animation off the LCP element, which on the home page is the
 *      hero paragraph.
 *
 * Opt-in attributes (unchanged, so no component had to be touched):
 *   data-reveal            → fade + slide up (default)
 *   data-reveal="left|right|up|down|zoom|none"
 *   data-reveal-delay="0.15"  (seconds)
 *   data-reveal-stagger        → on a container; its direct children stagger in
 */
export function MotionRoot() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Lenis is a desktop-mouse nicety: touch devices already have momentum
    // scrolling from the OS. Importing it lazily and only when it will actually
    // be used keeps it out of the mobile critical path entirely, which the old
    // static import did not do (it downloaded and parsed on phones regardless).
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let cleanupLenis: (() => void) | null = null;

    if (!reduce && !coarsePointer) {
      let cancelled = false;
      import("lenis")
        .then(({ default: Lenis }) => {
          if (cancelled) return;
          const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
          });
          let raf = 0;
          const loop = (time: number) => {
            lenis.raf(time);
            raf = requestAnimationFrame(loop);
          };
          raf = requestAnimationFrame(loop);
          document.documentElement.classList.add("lenis");
          cleanupLenis = () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
            document.documentElement.classList.remove("lenis");
          };
        })
        .catch(() => {
          /* Smooth scroll is decoration. Native scrolling is the fallback. */
        });
      cleanupLenis = () => {
        cancelled = true;
      };
    }

    // Reduced motion, or a browser without IntersectionObserver: everything is
    // already visible in the markup, so there is simply nothing to do.
    if (reduce || typeof IntersectionObserver === "undefined") {
      return () => cleanupLenis?.();
    }

    // Expand stagger containers into their children so both kinds of reveal
    // share one observer and one code path. The index drives the delay.
    const DIRECTIONS = new Set(["up", "down", "left", "right", "zoom", "none"]);
    const dirOf = (el: HTMLElement) => {
      const d = el.dataset.reveal || "up";
      return DIRECTIONS.has(d) ? d : "up";
    };

    const targets: { el: HTMLElement; delay: number; dir: string }[] = [];

    for (const el of Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    )) {
      targets.push({
        el,
        delay: parseFloat(el.dataset.revealDelay || "0") || 0,
        dir: dirOf(el),
      });
    }

    for (const container of Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal-stagger]"),
    )) {
      const children = Array.from(container.children) as HTMLElement[];
      children.forEach((el, i) => {
        // A stagger child that also carries its own data-reveal is already
        // queued above; don't hide or observe it twice.
        if (el.hasAttribute("data-reveal")) return;
        targets.push({ el, delay: i * 0.1, dir: "up" });
      });
    }

    if (targets.length === 0) return () => cleanupLenis?.();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.setAttribute("data-reveal-in", "");
          observer.unobserve(el);
        }
      },
      // Matches the old ScrollTrigger "top 88%": start the reveal once the
      // element's top has come 12% up into the viewport.
      { rootMargin: "0px 0px -12% 0px" },
    );

    const viewportH = window.innerHeight;

    for (const { el, delay, dir } of targets) {
      const box = el.getBoundingClientRect();
      const onScreen = box.top < viewportH && box.bottom > 0;

      if (onScreen) {
        // Already visible: reveal with no transition at all. Animating these
        // would delay first paint of exactly the content the user came for.
        el.setAttribute("data-reveal-in", "");
        continue;
      }

      if (delay) el.style.transitionDelay = `${delay}s`;
      // The value carries the direction: the CSS keys its starting transform
      // off data-reveal-init="up|down|left|right|zoom|none".
      el.setAttribute("data-reveal-init", dir);
      observer.observe(el);
    }

    // Safety net for the case the old code also guarded: an element that can
    // never be scrolled to (a footer reveal on a page shorter than the
    // viewport, a hidden tab panel) would otherwise stay hidden forever.
    // Anything still un-revealed after the page settles gets shown.
    let remaining = targets.length;
    const flush = () => {
      if (remaining === 0) return;
      for (const { el } of targets) {
        if (!el.hasAttribute("data-reveal-in")) {
          const box = el.getBoundingClientRect();
          if (box.top < window.innerHeight && box.bottom > 0) {
            el.setAttribute("data-reveal-in", "");
            observer.unobserve(el);
            remaining -= 1;
          }
        }
      }
    };

    // Scroll fallback. Chrome does not deliver IntersectionObserver callbacks to
    // a tab that is not visible, so a page opened in a background tab (middle
    // click, "open in new tab", a restored session) can hydrate, hide its
    // off-screen elements, and have no observer running. Callbacks do resume on
    // visibility change, but relying on that alone means the one failure mode
    // is invisible content, which is the worst outcome this file can produce.
    // A rAF-throttled scroll check costs nothing once everything has revealed
    // (it removes itself) and guarantees the system fails open.
    let scheduled = false;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        flush();
        if (remaining === 0) window.removeEventListener("scroll", onScroll);
      });
    };

    window.addEventListener("load", flush);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", flush);
    const t1 = window.setTimeout(flush, 600);
    const t2 = window.setTimeout(flush, 2000);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", flush);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", flush);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      cleanupLenis?.();
    };
  }, []);

  return null;
}
