"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";

/**
 * A decorative "flight path" band. As the user scrolls, a dashed contrail draws
 * itself across a world-map arc while a realistic airliner flies along the exact
 * curve (GSAP MotionPath, auto-rotating so the nose always follows the path).
 * Departure/arrival pins pulse at each end. Honors prefers-reduced-motion.
 *
 * The plane and the trail live in the SAME <svg> user-space (viewBox 0 0 1200
 * 260) so MotionPath alignment is pixel-perfect at any screen width.
 */
export function FlightPath() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const trail = trailRef.current;
    const plane = planeRef.current;
    if (!root || !trail || !plane) return;

    const len = trail.getTotalLength();
    gsap.set(trail, { strokeDasharray: len });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(trail, { strokeDashoffset: 0 });
      gsap.set(plane, {
        autoAlpha: 1,
        motionPath: {
          path: trail,
          align: trail,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 1,
        },
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          end: "bottom 20%",
          scrub: 0.6,
        },
      });

      tl.fromTo(
        trail,
        { strokeDashoffset: len },
        { strokeDashoffset: 0, ease: "none" },
        0,
      ).fromTo(
        plane,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: "none",
          duration: 0.05,
          motionPath: {
            path: trail,
            align: trail,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0,
            end: 1,
          },
        },
        0,
      );

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-8 sm:py-12" aria-hidden>
      <Container>
        <div
          ref={rootRef}
          className="relative overflow-hidden rounded-5xl border border-line bg-brand-soft px-4 py-8 sm:px-8 sm:py-10"
        >
          {/* Copy overlay */}
          <div className="pointer-events-none absolute left-6 top-6 z-10 max-w-[14rem] sm:left-10 sm:top-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              Where to next?
            </p>
            <p className="mt-1 font-display text-lg font-bold leading-snug text-ink-900 sm:text-xl">
              We map the route — you enjoy the ride.
            </p>
          </div>

          <svg
            viewBox="0 0 1200 260"
            className="h-auto w-full"
            role="presentation"
          >
            <defs>
              <linearGradient id="fp-plane" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="fp-trail" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="55%" stopColor="#f43f2e" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Faint full route (guide) */}
            <path
              d="M60,210 C 320,120 520,70 720,120 S 1010,215 1150,70"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-line"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />

            {/* Animated drawing contrail */}
            <path
              ref={trailRef}
              d="M60,210 C 320,120 520,70 720,120 S 1010,215 1150,70"
              fill="none"
              stroke="url(#fp-trail)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="7 9"
            />

            {/* Departure pin */}
            <g>
              <circle cx="60" cy="210" r="12" fill="#f97316" opacity="0.18">
                <animate
                  attributeName="r"
                  values="9;16;9"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="60" cy="210" r="6" fill="#f97316" />
              <circle cx="60" cy="210" r="2.4" fill="#fff" />
            </g>

            {/* Arrival pin */}
            <g>
              <circle cx="1150" cy="70" r="12" fill="#ef4444" opacity="0.18">
                <animate
                  attributeName="r"
                  values="9;16;9"
                  dur="2.4s"
                  begin="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="1150" cy="70" r="6" fill="#ef4444" />
              <circle cx="1150" cy="70" r="2.4" fill="#fff" />
            </g>

            {/* Airliner (nose points +x; MotionPath auto-rotates it) */}
            <g ref={planeRef} style={{ visibility: "hidden" }}>
              {/* wings */}
              <path
                d="M2,-2 L-18,-24 L-9,-24 L7,-2 Z"
                fill="url(#fp-plane)"
              />
              <path
                d="M2,2 L-18,24 L-9,24 L7,2 Z"
                fill="url(#fp-plane)"
              />
              {/* tail planes */}
              <path
                d="M-20,-1.6 L-30,-10 L-24,-10 L-17,-1.6 Z"
                fill="url(#fp-plane)"
              />
              <path
                d="M-20,1.6 L-30,10 L-24,10 L-17,1.6 Z"
                fill="url(#fp-plane)"
              />
              {/* fuselage */}
              <path
                d="M-26,0 C-26,-2.2 -23,-3.6 -14,-3.7 L10,-3.3 C17,-2.9 23,-1.5 28,0 C23,1.5 17,2.9 10,3.3 L-14,3.7 C-23,3.6 -26,2.2 -26,0 Z"
                fill="url(#fp-plane)"
              />
              {/* cockpit windows */}
              <circle cx="18" cy="0" r="1.7" fill="#fff" opacity="0.9" />
              <circle cx="12" cy="0" r="1.4" fill="#fff" opacity="0.65" />
            </g>
          </svg>
        </div>
      </Container>
    </section>
  );
}

export default FlightPath;
