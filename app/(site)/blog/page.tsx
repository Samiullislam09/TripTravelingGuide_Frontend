import type { Metadata } from "next";

import { getAllPosts, getCategories, getPopularPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/ui/Container";
import { PostExplorer } from "@/components/blog/PostExplorer";
import { ArticleCarousel } from "@/components/blog/ArticleCarousel";
import { PageBanner } from "@/components/layout/PageBanner";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "All articles",
  description:
    "Browse every TripTravelingGuide article, from destination comparisons to transport guides and honest trip-planning advice. Filter by category or search live.",
  path: "/blog",
});

const CAROUSEL_ACCENTS = ["violet", "pink", "coral"] as const;

export default async function BlogPage() {
  const [posts, categories, popular] = await Promise.all([
    getAllPosts(),
    getCategories(),
    getPopularPosts(12),
  ]);

  // Build "Latest in {category}" rails for the categories that actually have
  // enough guides to fill a carousel, so no rail looks half-empty.
  const catGroups = categories
    .map((c) => ({
      ...c,
      posts: posts.filter((p) => p.category.slug === c.slug).slice(0, 12),
    }))
    .filter((g) => g.posts.length >= 4)
    .slice(0, 5);

  return (
    <>
      {/* Header band */}
      <PageBanner
        eyebrow="All articles"
        title={<>Every travel guide, <span className="text-gradient">in one place</span></>}
        description={`Browse ${posts.length} honest travel guides and side by side comparisons. Filter by category or search live to plan your next trip faster.`}
        crumbs={[{ name: "Home", url: "/" }, { name: "Articles", url: "/blog" }]}
        accent="coral"
      />

      {/* Explorer — 12 per page, search + filter + numbered pagination */}
      <section className="py-12 sm:py-16">
        <Container>
          <PostExplorer posts={posts} categories={categories} selectableGrid />
        </Container>
      </section>

      {/* Auto-sliding discovery rails: popular first, then a rail per category */}
      {(popular.length > 0 || catGroups.length > 0) && (
        <section className="border-t border-line bg-surface-2/40 py-12 sm:py-16">
          <Container>
            <ArticleCarousel
              title="Popular guides"
              eyebrow="Most read"
              posts={popular}
              accent="coral"
            />
            {catGroups.map((g, i) => (
              <ArticleCarousel
                key={g.slug}
                title={`Latest in ${g.name}`}
                eyebrow="Category"
                posts={g.posts}
                accent={CAROUSEL_ACCENTS[i % CAROUSEL_ACCENTS.length]}
                accentOffset={i + 1}
                autoplayMs={5200 + i * 500}
              />
            ))}
          </Container>
        </section>
      )}
    </>
  );
}
