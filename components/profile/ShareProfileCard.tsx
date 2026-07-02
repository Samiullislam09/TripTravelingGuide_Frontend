"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Link2, Check, Users } from "lucide-react";
import type { Author } from "@/lib/types";
import { cn } from "@/lib/utils";
import ShareBar from "@/components/post/ShareBar";

interface ShareProfileCardProps {
  author: Author;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function absoluteUrl(url: string): string {
  if (url.startsWith("/") && typeof window !== "undefined") {
    return window.location.origin + url;
  }
  return url;
}

export default function ShareProfileCard({ author, className }: ShareProfileCardProps) {
  const [copied, setCopied] = useState(false);

  const profileUrl = author.url || "/about";

  const socialEntries = useMemo(
    () => Object.entries(author.social ?? {}),
    [author.social],
  );

  const copyProfileLink = async () => {
    const value = absoluteUrl(profileUrl);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        const el = document.createElement("textarea");
        el.value = value;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={cn("card p-6", className)} data-reveal>
      <div className="flex items-center gap-4">
        {author.image ? (
          <Image
            src={author.image}
            alt={author.name}
            width={64}
            height={64}
            className="size-16 rounded-full object-cover ring-2 ring-brand-100"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-16 place-items-center rounded-full bg-brand-gradient text-lg font-semibold text-white"
          >
            {getInitials(author.name)}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-ink-900">{author.name}</h3>
          {socialEntries.length > 0 && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-ink-400">
              <Users className="size-3.5" aria-hidden="true" />
              {socialEntries.length} social {socialEntries.length === 1 ? "link" : "links"}
            </p>
          )}
        </div>
      </div>

      {author.bio && (
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-500">{author.bio}</p>
      )}

      {socialEntries.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {socialEntries.map(([key, value]) => (
            <li key={key}>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-violet capitalize transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                {key}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <ShareBar title={author.name} url={profileUrl} />
      </div>

      <button
        type="button"
        onClick={copyProfileLink}
        aria-label={copied ? "Profile link copied" : "Copy profile link"}
        className={cn(
          "btn btn-outline mt-4 w-full gap-2",
          copied && "text-brand-600 border-brand-400",
        )}
      >
        {copied ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            Link copied
          </>
        ) : (
          <>
            <Link2 className="size-4" aria-hidden="true" />
            Copy profile link
          </>
        )}
      </button>
    </div>
  );
}
