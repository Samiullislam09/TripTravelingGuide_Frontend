import Image from "next/image";
import type { ComponentType } from "react";
import { ArrowUpRight, Globe } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  YoutubeIcon,
  XIcon,
  FacebookIcon,
} from "@/components/ui/BrandIcons";
import type { Author } from "@/lib/types";

// E-E-A-T author box. A real avatar, an overview (bio), and social links are a
// meaningful trust signal for Helpful-Content recovery — they show a person
// stands behind the guide.

type IconType = ComponentType<{ className?: string }>;

const SOCIAL: Record<string, { icon: IconType; label: string }> = {
  portfolio: { icon: Globe, label: "Portfolio" },
  github: { icon: GithubIcon, label: "GitHub" },
  linkedin: { icon: LinkedinIcon, label: "LinkedIn" },
  instagram: { icon: InstagramIcon, label: "Instagram" },
  youtube: { icon: YoutubeIcon, label: "YouTube" },
  twitter: { icon: XIcon, label: "X" },
  facebook: { icon: FacebookIcon, label: "Facebook" },
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AuthorBox({ author }: { author: Author }) {
  const links = Object.entries(author.social ?? {}).filter(
    ([key, url]) => SOCIAL[key] && typeof url === "string" && url.trim().length > 0,
  );

  return (
    <aside
      data-reveal
      className="mt-12 rounded-4xl bg-brand-soft p-6 sm:p-8"
    >
      <div className="flex items-start gap-5">
        {author.image ? (
          <Image
            src={author.image}
            alt={author.name}
            width={72}
            height={72}
            className="size-[72px] shrink-0 rounded-full object-cover ring-1 ring-line"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-[72px] shrink-0 place-items-center rounded-full bg-brand-600 font-display text-xl font-bold text-white"
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
          {author.role ? (
            <p className="text-sm font-semibold text-brand-600">{author.role}</p>
          ) : null}

          {/* Overview */}
          {author.bio ? (
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{author.bio}</p>
          ) : null}

          {/* Social media */}
          {links.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {links.map(([key, url]) => {
                const { icon: Icon, label } = SOCIAL[key];
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={label}
                    title={label}
                    className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          ) : null}

          {author.url ? (
            <div className="mt-5 flex flex-wrap items-center gap-4">
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
      </div>
    </aside>
  );
}
