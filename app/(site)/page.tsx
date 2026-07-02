import { getAllPosts, getCategories, getFeaturedPosts, getLatestPosts } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { AdSlot } from "@/components/ads/AdSlot";
import { site } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { HomeStories } from "@/components/home/HomeStories";
import { FlightPath } from "@/components/home/FlightPath";
import DestinationsMarquee from "@/components/home/DestinationsMarquee";
import { LatestGrid } from "@/components/home/LatestGrid";
import { StatsBand } from "@/components/home/StatsBand";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import NewsletterCTA from "@/components/home/NewsletterCTA";

// Keep the home page fresh: re-fetch CMS content every 5 minutes (ISR) so new
// posts, categories and stories appear without a redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const [featured, latest, categories, allPosts] = await Promise.all([
    getFeaturedPosts(9),
    getLatestPosts(12),
    getCategories(),
    getAllPosts(),
  ]);

  return (
    <>
      <Hero categories={categories} />
      <HomeStories />
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
