import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCategories } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { CategoryCard } from "@/components/category/CategoryCard";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Explore categories",
  description:
    "Browse every TripTravelingGuide category, from destinations and road trips to air travel, cruises, weather, and trip-planning tricks. Pick a theme and dive in.",
  path: "/explore",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Explore", url: "/explore" },
];

export default async function ExplorePage() {
  const categories = await getCategories();

  return (
    <>
      <JsonLd data={baseGraph([breadcrumbNode(crumbs)])} />

      <PageBanner
        eyebrow="Explore"
        title={<>Browse by <span className="text-gradient">category</span></>}
        description="Every guide, sorted by theme. Choose a category to see its latest destinations, comparisons, and trip-planning advice."
        crumbs={crumbs}
        accent="violet"
      />

      <section className="py-12 sm:py-16">
        <Container>
          {categories.length > 0 ? (
            <div
              data-reveal-stagger
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
            >
              {categories.map((category, index) => (
                <CategoryCard key={category.slug} category={category} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-500">Categories are on the way.</p>
          )}

          {/* Browse-everything CTA */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/blog"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              Browse all articles
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
