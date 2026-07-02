import type { Metadata } from "next";

import { getAllPosts, getCategories } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/ui/Container";
import { PostExplorer } from "@/components/blog/PostExplorer";
import { PageBanner } from "@/components/layout/PageBanner";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "All articles",
  description:
    "Browse every TripTravelingGuide article, from destination comparisons to transport guides and honest trip-planning advice. Filter by category or search live.",
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
      <PageBanner
        eyebrow="All articles"
        title={<>Every travel guide, <span className="text-gradient">in one place</span></>}
        description={`Browse ${posts.length} honest travel guides and side by side comparisons. Filter by category or search live to plan your next trip faster.`}
        crumbs={[{ name: "Home", url: "/" }, { name: "Articles", url: "/blog" }]}
        accent="coral"
      />

      {/* Explorer */}
      <section className="py-12 sm:py-16">
        <Container>
          <PostExplorer posts={posts} categories={categories} selectableGrid />
        </Container>
      </section>
    </>
  );
}
