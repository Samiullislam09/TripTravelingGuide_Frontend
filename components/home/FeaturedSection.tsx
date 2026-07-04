import type { PostSummary } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/post/PostCard";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";

interface FeaturedSectionProps {
  /** Editor's picks — power the big auto-sliding carousel. */
  posts: PostSummary[];
  /** Extra pool used to fill the right-hand 2×2 grid (deduped vs the carousel). */
  gridPosts?: PostSummary[];
}

export function FeaturedSection({ posts, gridPosts = [] }: FeaturedSectionProps) {
  if (posts.length === 0) return null;

  // Left: one big card that auto-slides through up to 5 guides.
  const carousel = posts.slice(0, 5);
  const used = new Set(carousel.map((p) => p.slug));

  // Right: a compact 2×2 grid of 4 guides — prefer the extra pool, then fall
  // back to any leftover featured posts, so the grid is never empty.
  const pool = [...gridPosts, ...posts];
  const grid: PostSummary[] = [];
  for (const p of pool) {
    if (used.has(p.slug)) continue;
    used.add(p.slug);
    grid.push(p);
    if (grid.length === 4) break;
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <SectionHeading
          eyebrow="Editor's picks"
          title="Featured guides"
          action={{ label: "View all", href: "/blog" }}
        />

        <div className="mt-7 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.35fr_1fr] lg:gap-6">
          {/* Auto-sliding featured card */}
          <div data-reveal>
            <FeaturedCarousel posts={carousel} />
          </div>

          {/* Compact 2×2 grid on the right */}
          {grid.length > 0 && (
            <div
              data-reveal-stagger
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {grid.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedSection;
