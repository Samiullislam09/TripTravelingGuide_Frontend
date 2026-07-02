import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description:
    "Travel information on TripTravelingGuide is general guidance. Verify prices, schedules, and visa rules with official sources before you travel.",
  path: "/disclaimer",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Disclaimer", url: "/disclaimer" },
];

export default function DisclaimerPage() {
  return (
    <>
      <JsonLd data={baseGraph([breadcrumbNode(crumbs)])} />
      <PageBanner
        eyebrow="Legal"
        title={
          <>
            Disclaimer<span className="text-gradient">.</span>
          </>
        }
        description="What our travel guides can and cannot promise, and why you should always double-check the details."
        crumbs={crumbs}
        accent="violet"
        ad
      />
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-ink-400">Last updated: July 2, 2026</p>
            <div className="prose-article mt-6">
              <p>
                TripTravelingGuide publishes travel guides, route comparisons, and planning
                advice for destinations across the USA, Canada, and the rest of the world. We put
                real effort into getting the details right, but travel changes fast. This page
                explains the limits of the information you find here so you can use it wisely.
              </p>

              <h2>General information only</h2>
              <p>
                Everything on this site is for general information and inspiration. It is not
                personal advice, and it is not a substitute for checking the current facts before
                you commit money or make a trip. A guide reflects what we knew when we wrote or
                last updated it, and details can move quickly after that.
              </p>

              <h2>Prices, schedules, and visa rules change</h2>
              <p>
                Fares, opening hours, transit routes, seasonal closures, entry requirements, and
                visa rules all change, sometimes overnight. A price we quote or a schedule we
                describe may be different by the time you read it. Before you book or travel,
                always confirm the current details directly with the airline, hotel, operator,
                tourism board, or the official government website for the country you are visiting.
                For entry and visa questions, trust the official immigration authority over any
                blog, including ours.
              </p>

              <h2>No guarantee of accuracy</h2>
              <p>
                We do not warrant that the content here is complete, current, or error free. Facts
                can go out of date, and mistakes can slip through despite our editing. If you spot
                something that looks wrong, please tell us through the{" "}
                <Link href="/contact">contact page</Link> so we can fix it for the next reader.
              </p>

              <h2>Affiliate and advertising relationships</h2>
              <p>
                Some pages contain advertising and may contain affiliate links, which means we can
                earn a small commission if you buy through them, at no extra cost to you. This
                never changes what we recommend or how we describe a place. You can read the full
                details in our{" "}
                <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
              </p>

              <h2>Your travel decisions are your own</h2>
              <p>
                You are responsible for your own travel choices. Booking flights, choosing routes,
                arranging insurance, and deciding whether a destination is right for you are all
                decisions only you can make, based on your own situation and the current official
                guidance. TripTravelingGuide is not liable for any loss, cost, or inconvenience
                that follows from acting on information found on the site.
              </p>

              <h2>External links</h2>
              <p>
                Our guides link out to airlines, booking tools, maps, and official sources so you
                can act on what you read. We do not control those sites and are not responsible
                for their content or accuracy. A link is not an endorsement of everything on the
                destination site, and visiting it is at your own discretion.
              </p>

              <h2>Not professional advice</h2>
              <p>
                Nothing here is professional, legal, medical, financial, or immigration advice. If
                your trip involves health precautions, insurance decisions, or complex visa
                matters, speak to a qualified professional or the relevant official authority
                before you rely on what a travel guide says.
              </p>

              <h2>Questions</h2>
              <p>
                If anything here is unclear, email us at{" "}
                <a href="mailto:triptravelingguide@gmail.com">
                  triptravelingguide@gmail.com
                </a>
                . You may also want to read our{" "}
                <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy-policy">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
