import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import StoriesViewer, { type Story } from "@/components/stories/StoriesViewer";
import { PageBanner } from "@/components/layout/PageBanner";
import { getLatestPosts } from "@/lib/content";
import { brandCover } from "@/lib/placeholder";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Web Stories",
  description:
    "Tap through quick, full-screen visual travel guides from TripTravelingGuide.",
  path: "/web-stories",
});

export default async function WebStoriesPage() {
  const posts = await getLatestPosts(8);

  const stories: Story[] = posts.map((post) => ({
    id: post.slug,
    title: post.title,
    image: post.coverImage ?? brandCover(post.slug, post.title),
    href: `/${post.slug}/`,
  }));

  return (
    <>
      {/* Header band */}
      <PageBanner
        eyebrow="Web stories"
        title={<>Travel stories you can <span className="text-gradient">tap through</span></>}
        description="Quick, full screen visual guides to real destinations. Tap through in seconds and save the ones you love."
        accent="pink"
      />

      {/* Story grid + full-screen viewer */}
      <section className="py-12 sm:py-16">
        <Container>
          <StoriesViewer stories={stories} />
        </Container>
      </section>
    </>
  );
}
