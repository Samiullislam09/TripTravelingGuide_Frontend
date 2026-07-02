"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Globe2, ArrowUpRight, Compass, PlayCircle } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";
import { iconForCategory } from "@/lib/category-icon";
import type { Category } from "@/lib/types";

// Cinematic animated landing hero — parallax gradient blobs, staggered headline
// words, a routing search field, and a gently floating glass card that surfaces
// the top travel categories as icon-only tiles.

// The 4 CGHEVEN add-on accent colors, cycled across the category tiles.
const ACCENTS = ["#f97316", "#00a2e8", "#9999ff", "#c8a2ff"];

const HEADLINE_WORDS = ["Plan", "trips", "you'll", "actually"];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const riseVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero({ categories = [] }: { categories?: Category[] }) {
  const router = useRouter();
  const cats = categories.slice(0, 4);
  const sectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = Number(el.dataset.parallax) || 0;
        gsap.to(el, {
          yPercent: depth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-brand-soft pb-20 pt-14 sm:pt-20"
    >
      {/* Decorative parallax blobs */}
      <div
        aria-hidden
        data-parallax="-22"
        className="blob -left-24 -top-24 h-80 w-80 animate-blob-spin bg-addon-blender/40"
      />
      <div
        aria-hidden
        data-parallax="18"
        className="blob right-[-6rem] top-10 h-72 w-72 animate-float bg-addon-davinci/30"
      />
      <div
        aria-hidden
        data-parallax="30"
        className="blob bottom-[-8rem] left-1/3 h-72 w-72 animate-blob-spin bg-addon-premiere/30"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.span
              variants={riseVariants}
              className="pill-coral inline-flex"
            >
              ✦ Honest travel guides since 2023
            </motion.span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              {HEADLINE_WORDS.map((word) => (
                <motion.span
                  key={word}
                  variants={riseVariants}
                  className="mr-[0.28em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span variants={riseVariants} className="inline-block">
                <span className="text-gradient">love.</span>
              </motion.span>
            </h1>

            <motion.p
              variants={riseVariants}
              className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500"
            >
              Real destination comparisons, transport guides and trip-planning
              advice — researched, honest, and built to help you decide fast.
            </motion.p>

            {/* Routing search */}
            <motion.form
              variants={riseVariants}
              onSubmit={handleSearch}
              role="search"
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-line bg-surface p-2 shadow-card focus-within:ring-2 focus-within:ring-brand-600/50"
            >
              <label htmlFor="hero-search" className="sr-only">
                Search destinations and guides
              </label>
              <Search
                aria-hidden
                className="ml-2 h-5 w-5 shrink-0 text-ink-400"
              />
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, tips, guides…"
                className="min-w-0 flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <button
                type="submit"
                className="btn btn-primary shrink-0 rounded-full px-5"
              >
                Search
              </button>
            </motion.form>

            {/* CTAs — one row, equal width, frosted-glass */}
            <motion.div
              variants={riseVariants}
              className="mt-8 grid max-w-md grid-cols-2 gap-3"
            >
              <Link
                href="/category/destinations"
                className="btn glass w-full justify-center whitespace-nowrap border border-line/60 px-3 py-3.5 text-[13px] text-ink-900 transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-600 sm:text-sm"
              >
                <Compass className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">Explore</span>
              </Link>
              <Link
                href="/web-stories"
                className="btn glass w-full justify-center whitespace-nowrap border border-line/60 px-3 py-3.5 text-[13px] text-ink-900 transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-600 sm:text-sm"
              >
                <PlayCircle className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">Web stories</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right column — floating glass stat card */}
          <motion.div
            data-parallax="-12"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-lg lg:mx-0"
          >
            <div className="card animate-float p-7 sm:p-8">
              {/* Orange→red gradient panel */}
              <div className="flex items-center gap-3 rounded-4xl bg-brand-gradient p-6 text-white shadow-glow-sm">
                <Globe2 aria-hidden className="h-10 w-10 shrink-0 opacity-90" />
                <p className="text-lg font-semibold leading-snug">
                  Trusted by travelers in 30+ countries
                </p>
              </div>

              {/* Explore categories — icon-only modern tiles */}
              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-ink-400">
                Explore categories
              </p>
              <div className="mt-3.5 grid grid-cols-2 gap-3.5">
                {cats.map((cat, i) => {
                  const Icon = iconForCategory(cat.slug);
                  const color = ACCENTS[i % ACCENTS.length];
                  return (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}/`}
                      aria-label={`Browse ${cat.name} guides`}
                      className="group flex items-center gap-3 rounded-3xl border border-line bg-surface-2 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:ring-2"
                      style={{ ["--tw-ring-color" as string]: color }}
                    >
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110"
                        style={{ background: color }}
                      >
                        <Icon aria-hidden className="h-6 w-6" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink-900">
                          {cat.name}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="h-4 w-4 shrink-0 text-ink-400 transition-colors group-hover:text-ink-900"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
