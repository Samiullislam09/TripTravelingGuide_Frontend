import dynamic from "next/dynamic";
import { getAllPosts, getCategories, getFeaturedPosts, getLatestPosts } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { AdSlot } from "@/components/ads/AdSlot";
import { site } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { HomeStories } from "@/components/home/HomeStories";
import { getStoryCards } from "@/lib/story-cards";
import FlightPath from "@/components/home/FlightPathLazy";
import { LatestGrid } from "@/components/home/LatestGrid";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import NewsletterCTA from "@/components/home/NewsletterCTA";

// Both of these statically import GSAP, and both sit well below the fold. Left
// as plain imports they pulled the 50KB GSAP + ScrollTrigger chunk into the home
// page's initial JS, so the browser paid for a marquee and a counter animation
// before it could finish the hero. Splitting them keeps the server-rendered
// markup identical (still SSR'd, still in the HTML for crawlers) while the
// animation code arrives after hydration.
const DestinationsMarquee = dynamic(
  () => import("@/components/home/DestinationsMarquee"),
);
const StatsBand = dynamic(() =>
  import("@/components/home/StatsBand").then((m) => m.StatsBand),
);

// Keep the home page fresh: re-fetch CMS content every 5 minutes (ISR) so new
// posts, categories and stories appear without a redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const [featured, latest, categories, allPosts, storyCards] = await Promise.all([
    getFeaturedPosts(9),
    getLatestPosts(12),
    getCategories(),
    getAllPosts(),
    getStoryCards(),
  ]);

  return (
    <>
      <Hero categories={categories} />
      <HomeStories stories={storyCards} />
      <FeaturedSection posts={featured} gridPosts={latest} />
      <Container>
        <AdSlot label="Advertisement" className="my-4" {...site.adUnits.homeTop} />
      </Container>
      <CategoryShowcase categories={categories} />
      <DestinationsMarquee />
      <FlightPath />
      <LatestGrid posts={latest} categories={categories} />
      <Container>
        <AdSlot label="Advertisement" className="my-4" {...site.adUnits.homeMid} />
      </Container>
      <Container>
        <StatsBand guides={allPosts.length} categories={categories.length} />
      </Container>
      <TestimonialsSection />
      <Container>
        <NewsletterCTA />
      </Container>
    </>
  );
}
