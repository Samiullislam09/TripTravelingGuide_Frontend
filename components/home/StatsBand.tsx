"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";

type Stat = {
  label: string;
  value: number;
  decimals: number;
  suffix: string;
  color: string;
};

interface StatsBandProps {
  // Real counts computed on the server from the live catalog. We only display
  // numbers we can actually stand behind — no invented reader counts or ratings.
  guides: number;
  categories: number;
}

function formatStat(current: number, stat: Stat): string {
  const fixed = current.toFixed(stat.decimals);
  const withCommas =
    stat.decimals > 0
      ? (() => {
          const [intPart, fracPart] = fixed.split(".");
          return `${Number(intPart).toLocaleString("en-US")}.${fracPart}`;
        })()
      : Number(fixed).toLocaleString("en-US");
  return `${withCommas}${stat.suffix}`;
}

export function StatsBand({ guides, categories }: StatsBandProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Each stat carries one of the 4 CGHEVEN add-on accent colors. Every value is
  // truthful: live guide/category counts, an always-free promise, and the year
  // our guides are maintained for.
  const stats: Stat[] = [
    { label: "Travel guides", value: guides, decimals: 0, suffix: "", color: "#f97316" },
    { label: "Categories", value: categories, decimals: 0, suffix: "", color: "#00a2e8" },
    { label: "Free to read", value: 100, decimals: 0, suffix: "%", color: "#9999ff" },
    { label: "Updated for", value: 2026, decimals: 0, suffix: "", color: "#c8a2ff" },
  ];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      stats.forEach((stat, i) => {
        const el = valueRefs.current[i];
        if (el) el.textContent = formatStat(stat.value, stat);
      });
      return;
    }

    const ctx = gsap.context(() => {
      stats.forEach((stat, i) => {
        const el = valueRefs.current[i];
        if (!el) return;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: stat.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = formatStat(counter.val, stat);
          },
        });
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guides, categories]);

  return (
    <Container className="my-8">
      <section
        ref={rootRef}
        className="relative overflow-hidden rounded-5xl border border-line bg-surface-2 px-6 py-12 sm:px-8 sm:py-14"
        aria-label="TripTravelingGuide by the numbers"
      >
        <div
          data-reveal-stagger
          className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-3xl bg-surface p-4 text-center ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:[--tw-ring-color:var(--c)] sm:p-5"
              style={{ ["--c" as string]: stat.color }}
            >
              <div
                className="font-display text-3xl font-extrabold tabular-nums sm:text-4xl"
                style={{ color: stat.color }}
              >
                <span
                  ref={(el) => {
                    valueRefs.current[i] = el;
                  }}
                >
                  {formatStat(0, stat)}
                </span>
              </div>
              <div
                aria-hidden
                className="mx-auto mt-3 h-1 w-8 rounded-full"
                style={{ background: stat.color }}
              />
              <div className="mt-3 text-sm font-medium text-ink-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}

export default StatsBand;
