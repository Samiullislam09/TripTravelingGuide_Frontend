import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How TripTravelingGuide collects, uses, and protects your data, including analytics, newsletter email, and advertising cookies.",
  path: "/privacy-policy",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Privacy Policy", url: "/privacy-policy" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={baseGraph([breadcrumbNode(crumbs)])} />
      <PageBanner
        eyebrow="Legal"
        title={
          <>
            Privacy <span className="text-gradient">Policy</span>
          </>
        }
        description="How we handle your data when you read and use TripTravelingGuide."
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
                TripTravelingGuide publishes travel guides and honest comparisons for people
                planning trips across the USA, Canada, and the wider world. This policy explains
                what information we collect when you visit the site, why we collect it, and the
                choices you have. We keep data collection to the minimum a modern content site
                needs to run, measure what readers find useful, and cover the cost of publishing
                through advertising.
              </p>

              <h2>Information we collect</h2>
              <p>
                Most people read our guides without giving us any personal details at all. We do
                collect a few kinds of information depending on how you use the site:
              </p>
              <ul>
                <li>
                  <strong>Usage and device data.</strong> When you load a page, our analytics
                  tools record standard technical details such as the pages you view, your
                  approximate region, browser type, screen size, and the site that referred you.
                  This is aggregated and helps us see which guides work and which need fixing.
                </li>
                <li>
                  <strong>Newsletter email.</strong> If you sign up for our newsletter, we store
                  the email address you give us so we can send new guides and updates. You can
                  unsubscribe from any email at any time.
                </li>
                <li>
                  <strong>Contact form details.</strong> If you write to us, we keep the name,
                  email, and message you send so we can reply and follow up if needed.
                </li>
                <li>
                  <strong>Comments.</strong> If you leave a comment on a guide, we store the
                  comment text and the name and email you attach to it.
                </li>
              </ul>

              <h2>Cookies and third parties</h2>
              <p>
                Cookies are small text files a site stores in your browser. We use them to keep
                the site working, to understand traffic, and to support advertising. Two of the
                main third parties that set cookies on our pages are Google Analytics, which we
                use to measure readership, and Google AdSense, which serves the ads that keep the
                site free to read. For a full breakdown of the specific cookies involved, see our{" "}
                <Link href="/cookie-policy">Cookie Policy</Link>.
              </p>

              <h2>Advertising and the Google advertising cookie</h2>
              <p>
                We are a Google AdSense publisher. Google and its partners use cookies to serve
                ads based on your prior visits to our site and other sites. Google&apos;s use of
                advertising cookies, including the DoubleClick DART cookie, lets it and its
                partners show ads to you across the web. You can opt out of personalized
                advertising by visiting{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  adssettings.google.com
                </a>
                . You can also opt out of many third-party vendor cookies at{" "}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aboutads.info
                </a>
                . Turning off personalized ads does not remove ads, it simply makes them less
                tailored to you.
              </p>

              <h2>How we use your information</h2>
              <p>We use the information described above to:</p>
              <ul>
                <li>show and improve the travel guides you came to read;</li>
                <li>measure which content is helpful so we can write more of it;</li>
                <li>send newsletter emails to people who asked for them;</li>
                <li>reply to messages and comments;</li>
                <li>serve advertising that helps fund the site;</li>
                <li>keep the site secure and detect abuse.</li>
              </ul>
              <p>
                We do not sell your personal information, and we do not share your email address
                with advertisers.
              </p>

              <h2>Your choices and opt-outs</h2>
              <p>
                You can control cookies through your browser settings, block or delete them, and
                opt out of personalized ads using the Google and industry links above. You can
                unsubscribe from the newsletter with the link in any email, and you can ask us to
                delete a comment or a contact message you sent. If you want a copy of the data we
                hold about you, or want it removed, write to us and we will help.
              </p>

              <h2>Data retention</h2>
              <p>
                We keep newsletter subscriptions until you unsubscribe. Contact messages and
                comments are kept for as long as they are useful for support and moderation, and
                then removed. Analytics data is retained in aggregated form according to the
                default retention settings of the tools we use.
              </p>

              <h2>Children</h2>
              <p>
                TripTravelingGuide is a general travel site and is not directed at children under
                13. We do not knowingly collect personal information from children under 13. If
                you believe a child has provided us with personal details, contact us and we will
                delete it.
              </p>

              <h2>International readers</h2>
              <p>
                We publish from one place but our readers come from all over the world. If you
                access the site from outside the country where our services are hosted, your
                information may be processed in a different country than the one you live in. By
                using the site you understand that data may cross borders in this way.
              </p>

              <h2>Changes to this policy</h2>
              <p>
                We may update this policy as the site grows or as the tools and rules around
                advertising change. When we make a meaningful change we will update the date at
                the top of this page. Continuing to use the site after an update means you accept
                the revised policy.
              </p>

              <h2>Contact us</h2>
              <p>
                If you have any question about your privacy or this policy, email us at{" "}
                <a href="mailto:triptravelingguide@gmail.com">
                  triptravelingguide@gmail.com
                </a>{" "}
                or use our <Link href="/contact">contact page</Link>. You may also want to read
                our <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/disclaimer">Disclaimer</Link>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
