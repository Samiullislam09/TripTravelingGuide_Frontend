import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SearchExperience } from "@/components/search/SearchExperience";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Search",
    description:
      "Search TripTravelingGuide for destinations, transport guides, trip ideas, and travel tips.",
    path: "/search",
  }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        {/* Header band */}
        <header className="mx-auto max-w-3xl text-center" data-reveal>
          <span className="pill pill-violet">Search</span>
          <h1 className="mt-4 text-4xl sm:text-5xl">Search guides</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-500">
            Find destinations, transport guides, and trip ideas across every
            TripTravelingGuide story.
          </p>
        </header>

        <div className="mt-10">
          <Suspense fallback={null}>
            <SearchExperience />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
