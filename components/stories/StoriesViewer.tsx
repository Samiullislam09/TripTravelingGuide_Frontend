"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import StoryPlayer, { type Story } from "./StoryPlayer";

export type { Story };

interface StoriesViewerProps {
  stories: Story[];
  className?: string;
}

export default function StoriesViewer({ stories, className }: StoriesViewerProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);

  if (stories.length === 0) return null;

  return (
    <>
      {/* Story card grid */}
      <ul
        data-reveal-stagger
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5",
          className,
        )}
      >
        {stories.map((story, index) => (
          <li key={story.id}>
            <button
              type="button"
              onClick={() => open(index)}
              aria-label={`Open story: ${story.title}`}
              className={cn(
                "group relative block aspect-[9/16] w-full overflow-hidden rounded-3xl",
                "ring-2 ring-transparent transition-all duration-300",
                "hover:ring-brand-500",
                "focus-visible:outline-none focus-visible:ring-brand-500",
              )}
            >
              <Image
                src={story.image}
                alt={story.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* gradient overlay */}
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
              />
              {/* live ring accent */}
              <span
                aria-hidden
                className="absolute inset-2 rounded-[1.35rem] ring-2 ring-white/20 transition group-hover:ring-white/40"
              />
              <span className="absolute inset-x-0 bottom-0 p-3 text-left">
                <span className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow">
                  {story.title}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {activeIndex !== null && (
          <StoryPlayer
            stories={stories}
            startIndex={activeIndex}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </>
  );
}
