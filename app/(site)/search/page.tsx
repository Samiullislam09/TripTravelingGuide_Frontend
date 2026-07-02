import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SearchExperience } from "@/components/search/SearchExperience";
import { PageBanner } from "@/components/layout/PageBanner";
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
    <>
      {/* Header band */}
      <PageBanner
        eyebrow="Search"
        title={<>Search travel <span className="text-gradient">guides</span></>}
        description="Find destinations, transport guides and trip ideas across every TripTravelingGuide story."
        accent="violet"
        align="center"
        ad={false}
      />

      <section className="py-12 sm:py-16">
        <Container>
          <Suspense fallback={null}>
            <SearchExperience />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
