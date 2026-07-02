import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import StoriesViewer, { type Story } from "@/components/stories/StoriesViewer";
import { getLatestPosts } from "@/lib/content";
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
    image:
      post.coverImage ??
      `https://picsum.photos/seed/${post.slug}/720/1280`,
    href: `/${post.slug}/`,
  }));

  return (
    <section className="py-12 sm:py-16">
      <Container>
        {/* Header band */}
        <header data-reveal className="max-w-2xl">
          <span className="pill-pink">Web Stories</span>
          <h1 className="mt-4 text-4xl sm:text-5xl">Web Stories</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">
            Tap through quick visual travel guides.
          </p>
        </header>

        {/* Story grid + full-screen viewer */}
        <div className="mt-10 sm:mt-12">
          <StoriesViewer stories={stories} />
        </div>
      </Container>
    </section>
  );
}
