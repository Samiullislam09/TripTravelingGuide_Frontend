import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/post/Breadcrumbs";
import { AdSlot } from "@/components/ads/AdSlot";
import type { Crumb } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

/**
 * PageBanner — the one compact hero band used at the top of every page
 * (article list, category, search, web stories, about, contact, and the
 * legal/trust pages). It reuses the home-hero palette: the warm brand-soft
 * wash, softly floating accent blobs in the four CGHEVEN add-on colors, a
 * pill eyebrow, and a gradient headline word.
 *
 * Why one shared band:
 *  - A single, honest <h1> per page in the first paint keeps the on-page SEO
 *    clean and consistent, which matters for the traffic-recovery work.
 *  - Every page reads the same, so the site feels finished and edited rather
 *    than stitched together.
 *
 * It is a server component so the headline ships in the initial HTML (good for
 * crawlers and LCP). The gentle motion is pure CSS plus the site-wide
 * `data-reveal` hook, so no client JavaScript is needed here.
 */

type Accent = "coral" | "violet" | "pink";

const accentPill: Record<Accent, string> = {
  coral: "pill-coral",
  violet: "pill-violet",
  pink: "pill-pink",
};

export type PageBannerProps = {
  /** Small label shown in the pill above the headline. */
  eyebrow?: string;
  /** The page <h1>. Pass a plain string, or JSX with a <span className="text-gradient"> highlight. */
  title: React.ReactNode;
  /** One or two honest sentences under the headline. Keep it human and specific. */
  description?: React.ReactNode;
  /** Optional breadcrumb trail, rendered above the pill. */
  crumbs?: Crumb[];
  /** Headline / body alignment. Left reads best when a side ad is shown. */
  align?: "left" | "center";
  /** Pill colour. Defaults to the coral (red) accent. */
  accent?: Accent;
  /** Show the compact side ad (desktop) and a matching mobile ad below. Default true. */
  ad?: boolean;
  /** Optional extra content under the copy (a live count, a small chip row, etc.). */
  children?: React.ReactNode;
  className?: string;
};

export function PageBanner({
  eyebrow,
  title,
  description,
  crumbs,
  align = "left",
  accent = "coral",
  ad = true,
  children,
  className,
}: PageBannerProps) {
  const centered = align === "center";

  const copy = (
    <div
      data-reveal
      className={cn(
        "max-w-2xl",
        centered && "mx-auto text-center"
      )}
    >
      {eyebrow ? <span className={accentPill[accent]}>{eyebrow}</span> : null}

      <h1
        className={cn(
          "break-words font-display font-bold tracking-tight text-ink-900",
          "text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          eyebrow ? "mt-4" : ""
        )}
      >
        {title}
      </h1>

      {description ? (
        <p
          className={cn(
            "mt-3 text-base leading-relaxed text-ink-500 sm:text-lg",
            centered && "mx-auto max-w-xl"
          )}
        >
          {description}
        </p>
      ) : null}

      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-brand-soft py-9 sm:py-12",
        className
      )}
    >
      {/* Home-hero accent blobs, kept small so the band stays short. */}
      <div
        aria-hidden
        className="blob -left-20 -top-20 h-56 w-56 animate-blob-spin bg-addon-blender/30"
      />
      <div
        aria-hidden
        className="blob right-[-4rem] top-4 h-52 w-52 animate-float bg-addon-davinci/25"
      />
      <div
        aria-hidden
        className="blob -bottom-24 left-1/3 h-52 w-52 animate-blob-spin bg-addon-premiere/25"
      />

      <Container className="relative z-10">
        {crumbs?.length ? (
          <div className={cn("mb-5", centered && "flex justify-center")}>
            <Breadcrumbs crumbs={crumbs} />
          </div>
        ) : null}

        {ad && !centered ? (
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            {copy}
            {/* Compact side ad — desktop only, matches the header height. */}
            <div
              data-reveal
              data-reveal-delay="0.1"
              className="hidden rounded-3xl border border-line bg-surface/60 p-4 lg:block"
            >
              <AdSlot label="Sponsored" className="my-0" minHeight={140} />
            </div>
          </div>
        ) : (
          copy
        )}

        {/* Mobile / tablet ad — the side ad is hidden below lg. */}
        {ad ? (
          <div
            data-reveal
            className="mt-7 rounded-3xl border border-line bg-surface/60 p-4 lg:hidden"
          >
            <AdSlot label="Sponsored" className="my-0" minHeight={120} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default PageBanner;
