"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const DESTINATIONS = [
  "Tokyo",
  "Banff",
  "Lisbon",
  "Bali",
  "Reykjavik",
  "Cape Town",
  "Queenstown",
  "Kyoto",
  "Santorini",
  "Patagonia",
  "Marrakech",
  "Hanoi",
  "Cusco",
  "Amalfi",
  "Hallstatt",
] as const;

function DestinationChip({ name }: { name: string }) {
  return (
    <span className="pill bg-surface-2 ring-1 ring-line text-ink-700 whitespace-nowrap">
      <span aria-hidden className="text-brand-600">
        &#9679;
      </span>
      {name}
    </span>
  );
}

export default function DestinationsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
        modifiers: {
          xPercent: gsap.utils.wrap(-50, 0),
        },
      });

      const pause = () => tween.pause();
      const play = () => tween.play();

      track.addEventListener("mouseenter", pause);
      track.addEventListener("mouseleave", play);
      track.addEventListener("focusin", pause);
      track.addEventListener("focusout", play);

      return () => {
        track.removeEventListener("mouseenter", pause);
        track.removeEventListener("mouseleave", play);
        track.removeEventListener("focusin", pause);
        track.removeEventListener("focusout", play);
      };
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-10 overflow-hidden" aria-label="Loved destinations">
      <p
        data-reveal
        className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-400"
      >
        Loved destinations
      </p>

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-base to-transparent sm:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-base to-transparent sm:w-28"
        />

        <div ref={trackRef} className="flex w-max gap-3 pr-3">
          {[0, 1].map((row) => (
            <div
              key={row}
              className="flex shrink-0 gap-3 pr-3"
              aria-hidden={row === 1}
            >
              {DESTINATIONS.map((name) => (
                <DestinationChip key={`${row}-${name}`} name={name} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
