import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { buildMetadata } from "@/lib/seo/metadata";
import { webStories, storyImage } from "@/lib/web-stories";

export const metadata: Metadata = buildMetadata({
  title: "Web Stories",
  description:
    "Tap through quick, full-screen visual travel guides from TripTravelingGuide, on ships, wildlife, heritage, and more.",
  path: "/web-stories",
});

// The 4 CGHEVEN add-on accent colors for the story kickers.
const ACCENTS = ["#f97316", "#00a2e8", "#9999ff", "#c8a2ff"];

export default function WebStoriesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Web stories"
        title={<>Travel stories you can <span className="text-gradient">tap through</span></>}
        description="Quick, full screen visual guides to real destinations. Tap through in seconds and open the full guide when you want the detail."
        accent="pink"
      />

      <section className="py-12 sm:py-16">
        <Container>
          <div
            data-reveal-stagger
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
          >
            {webStories.map((story, i) => (
              <Link
                key={story.slug}
                href={`/web-stories/${story.slug}/`}
                className="group relative block aspect-[9/16] overflow-hidden rounded-3xl bg-surface-2 ring-1 ring-line transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label={`Open web story: ${story.title}`}
              >
                <Image
                  src={storyImage(story.pages[0].image)}
                  alt={story.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"
                />
                <span
                  className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full text-white shadow-sm"
                  style={{ background: ACCENTS[i % ACCENTS.length] }}
                  aria-hidden
                >
                  <PlayCircle className="h-5 w-5" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-3">
                  <span className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow">
                    {story.title}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
