import Link from "next/link";
import Image from "next/image";
import type { PostSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCardWide({ post }: { post: PostSummary }) {
  return (
    <article className="card-hover group">
      <Link
        href={`/${post.slug}/`}
        className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface-2 sm:w-52 sm:flex-none">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              fill
              sizes="(max-width: 640px) 100vw, 13rem"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-gradient opacity-80" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <span className="pill pill-violet w-fit">{post.category.name}</span>
          <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug text-ink-900 transition group-hover:text-brand-600">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {post.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-ink-400">
            <span>{post.author.name}</span>
            <span className="h-1 w-1 rounded-full bg-ink-400" />
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingMinutes ? (
              <>
                <span className="h-1 w-1 rounded-full bg-ink-400" />
                <span>{post.readingMinutes} min read</span>
              </>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
