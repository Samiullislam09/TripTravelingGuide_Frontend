import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { PostSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: PostSummary;
  priority?: boolean;
  /** Cycles the 4 CGHEVEN add-on accent colors across a grid of cards. */
  index?: number;
}

// Blender orange · DaVinci blue · After Effects periwinkle · Premiere violet.
const ACCENTS = [
  { color: "#f97316", soft: "rgba(249,115,22,0.12)" },
  { color: "#00a2e8", soft: "rgba(0,162,232,0.12)" },
  { color: "#9999ff", soft: "rgba(153,153,255,0.16)" },
  { color: "#c8a2ff", soft: "rgba(200,162,255,0.16)" },
];

export function PostCard({ post, priority = false, index = 0 }: PostCardProps) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <article
      className="card group flex h-full flex-col overflow-hidden !rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:ring-2 hover:[--tw-ring-color:var(--accent)]"
      style={{ ["--accent" as string]: accent.color }}
    >
      <Link
        href={`/${post.slug}/`}
        className="flex h-full flex-col focus-visible:outline-none"
      >
        {/* Cover */}
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-gradient" />
          )}

          {/* Accent category pill */}
          <span
            className="pill absolute left-2.5 top-2.5 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur"
            style={{ background: accent.soft, color: accent.color, boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset" }}
          >
            <span
              aria-hidden
              className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: accent.color }}
            />
            {post.category.name}
          </span>
        </div>

        {/* Body — title, excerpt, byline, read link */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-[0.95rem] font-bold leading-snug text-ink-900 transition-colors line-clamp-2 group-hover:[color:var(--accent)]">
            {post.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
            {post.excerpt}
          </p>

          {/* Byline — author · date · reading time */}
          <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11.5px] text-ink-400">
            <span className="font-semibold text-ink-600">{post.author.name}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-ink-300" />
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingMinutes ? (
              <>
                <span aria-hidden className="h-1 w-1 rounded-full bg-ink-300" />
                <span>{post.readingMinutes} min read</span>
              </>
            ) : null}
          </div>

          {/* Read more */}
          <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[12.5px] font-semibold text-ink-400 transition-colors duration-300 group-hover:[color:var(--accent)]">
            Read guide
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
