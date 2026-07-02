import type { Metadata } from "next";

import { getAllPosts, getCategories } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/ui/Container";
import { PostExplorer } from "@/components/blog/PostExplorer";
import { AdSlot } from "@/components/ads/AdSlot";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "All articles",
  description:
    "Browse every TripTravelingGuide article — destination comparisons, transport guides and honest trip-planning advice. Filter by category or search live.",
  path: "/blog",
});

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);

  return (
    <>
      {/* Header band */}
      <section className="bg-brand-soft py-12 sm:py-16">
        <Container>
          <div data-reveal className="max-w-2xl">
            <span className="pill pill-coral">All articles</span>
            <h1 className="mt-4 break-words font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-5xl">
              Every travel guide, in one place
            </h1>
            <p className="mt-3 text-base text-ink-500 sm:text-lg">
              {posts.length} honest guides and comparisons. Filter by category or
              search live to find your next trip.
            </p>
          </div>
        </Container>
      </section>

      {/* Ad band — responsive, full-width between header and explorer */}
      <section className="pt-8 sm:pt-10">
        <Container>
          <AdSlot label="Advertisement" />
        </Container>
      </section>

      {/* Explorer */}
      <section className="py-12 sm:py-16">
        <Container>
          <PostExplorer posts={posts} categories={categories} />
        </Container>
      </section>
    </>
  );
}
