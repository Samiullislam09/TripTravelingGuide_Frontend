import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern your use of TripTravelingGuide, including content ownership, user submissions, and limitation of liability.",
  path: "/terms",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Terms of Service", url: "/terms" },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd data={baseGraph([breadcrumbNode(crumbs)])} />
      <PageBanner
        eyebrow="Legal"
        title={
          <>
            Terms of <span className="text-gradient">Service</span>
          </>
        }
        description="The rules for using TripTravelingGuide, written plainly so you know where you stand."
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
                These Terms of Service set out the agreement between you and TripTravelingGuide
                when you use this website. They are written to be readable rather than to bury
                anything in fine print. Please read them, because by using the site you accept
                them.
              </p>

              <h2>Acceptance of terms</h2>
              <p>
                By visiting or using TripTravelingGuide, you agree to these terms and to our{" "}
                <Link href="/privacy-policy">Privacy Policy</Link>. If you do not agree with any
                part of them, the simplest thing is not to use the site. We may update these
                terms from time to time, and the date at the top of this page shows when they
                last changed.
              </p>

              <h2>Use of the site</h2>
              <p>
                You may read, share, and link to our guides for your own personal and
                non-commercial trip planning. In return, you agree not to:
              </p>
              <ul>
                <li>copy or republish large parts of our content as your own;</li>
                <li>scrape the site in a way that harms its performance;</li>
                <li>try to break, probe, or overload our servers or security;</li>
                <li>use the site for anything unlawful or misleading.</li>
              </ul>
              <p>
                We want people to quote and link to our work. If you want to reuse more than a
                short excerpt, ask us first.
              </p>

              <h2>Intellectual property and content ownership</h2>
              <p>
                The articles, guides, comparisons, photography, graphics, layout, and the
                TripTravelingGuide name and logo are owned by us or licensed to us, and are
                protected by copyright and other laws. You may quote a short passage with a clear
                credit and a link back to the original page. You may not reproduce whole guides,
                sell our content, or present it as your own work.
              </p>

              <h2>User submissions</h2>
              <p>
                When you leave a comment, sign up for the newsletter, or send us a message, you
                are responsible for what you submit. Keep comments civil, on topic, and free of
                spam or anything unlawful. By posting a comment you give us permission to display,
                store, and moderate it, and to remove it if it breaks these rules. We are not
                obliged to publish or keep any submission.
              </p>

              <h2>Third-party links</h2>
              <p>
                Our guides link to airlines, hotels, booking tools, tourism boards, and other
                outside sites so you can act on what you read. We do not control those sites and
                are not responsible for their content, pricing, or policies. Following a link is
                at your own discretion, and we encourage you to read the terms and privacy notices
                of any site you visit.
              </p>

              <h2>No booking or professional guarantee</h2>
              <p>
                TripTravelingGuide is a publisher, not a travel agency, tour operator, or booking
                service. We do not sell flights, rooms, tours, or insurance, and we do not
                guarantee that prices, schedules, routes, or entry rules described in a guide will
                still be accurate when you read them. Always confirm the current details with the
                airline, hotel, operator, or official government source before you book or travel.
                For more on this, please read our <Link href="/disclaimer">Disclaimer</Link>.
              </p>

              <h2>Limitation of liability</h2>
              <p>
                We work hard to keep our guides accurate and useful, but we provide the site on an
                as is basis without warranties of any kind. To the fullest extent allowed by law,
                TripTravelingGuide and its founder are not liable for any loss, cost, or
                inconvenience that results from using the site or acting on information found here,
                including missed connections, changed prices, or denied entry. Your travel
                decisions are your own.
              </p>

              <h2>Changes to these terms</h2>
              <p>
                As the site grows we may revise these terms. When we make an important change we
                will update the date above. If you keep using the site after a change, that counts
                as accepting the new version.
              </p>

              <h2>Governing law</h2>
              <p>
                These terms are governed by the laws that apply where TripTravelingGuide operates,
                without regard to conflict of law rules. Any dispute connected to the site will be
                handled under those laws.
              </p>

              <h2>Contact us</h2>
              <p>
                Questions about these terms are welcome. Email us at{" "}
                <a href="mailto:triptravelingguide@gmail.com">
                  triptravelingguide@gmail.com
                </a>{" "}
                or use our <Link href="/contact">contact page</Link>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
