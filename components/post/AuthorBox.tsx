import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Author } from "@/lib/types";

// E-E-A-T author box. Showing a real author with a bio + link is a meaningful
// trust signal for Helpful-Content recovery — fill site.founder with real data.

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AuthorBox({ author }: { author: Author }) {
  return (
    <aside
      data-reveal
      className="mt-12 flex items-start gap-5 rounded-4xl bg-brand-soft p-6 sm:p-8"
    >
      {author.image ? (
        <Image
          src={author.image}
          alt={author.name}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-full object-cover ring-1 ring-line"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-full bg-brand-600 font-display text-xl font-bold text-white"
        >
          {getInitials(author.name)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
          Written by
        </p>
        <h3 className="mt-1 font-display text-lg font-bold text-ink-900">
          {author.name}
        </h3>
        {author.bio ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{author.bio}</p>
        ) : null}

        {author.url ? (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href={author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm"
            >
              Follow
            </a>
            <a
              href={author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              View profile
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
