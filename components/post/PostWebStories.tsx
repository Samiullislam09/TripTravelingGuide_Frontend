import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { getStoriesForPost, storyImage } from "@/lib/web-stories";

// The 4 CGHEVEN add-on accent colors — cycled across the story rings.
const RING = ["#f97316", "#00a2e8", "#9999ff", "#c8a2ff"];

/**
 * Story strip under a guide. Automatic: it renders every story in
 * lib/web-stories.ts whose `postSlug` is this post, and renders nothing when the
 * post has none. Publish a story for a guide and its section appears there on
 * the next build, with no edit to the post page.
 */
export function PostWebStories({ postSlug }: { postSlug: string }) {
  const stories = getStoriesForPost(postSlug);
  if (stories.length === 0) return null;

  return (
    <section className="border-t border-line py-12 sm:py-16">
      <Container>
        <Reveal className="mb-8">
          <span className="pill-coral">Tap through</span>
          <h2 className="mt-3 text-xl text-ink-900 sm:text-2xl md:text-3xl">
            {stories.length === 1
              ? "This guide as a web story"
              : "Web stories from this guide"}
          </h2>
        </Reveal>

        <div className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:px-0">
          {stories.map((story, i) => (
            <Link
              key={story.slug}
              href={`/web-stories/${story.slug}/`}
              aria-label={`Open web story: ${story.title}`}
              className="group relative aspect-[9/16] w-44 shrink-0 snap-start overflow-hidden rounded-3xl bg-surface-2 ring-1 ring-line transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:w-48 lg:w-52"
            >
              <Image
                src={storyImage(story.pages[0].image)}
                alt={story.title}
                fill
                sizes="(max-width: 640px) 11rem, 13rem"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
              />
              <span
                aria-hidden
                className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full text-white shadow-sm"
                style={{ background: RING[i % RING.length] }}
              >
                <PlayCircle className="h-5 w-5" />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-3 text-left">
                <span className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow">
                  {story.title}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default PostWebStories;
