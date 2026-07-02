import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate Disclosure",
  description:
    "Some links on our travel guides may earn us a commission at no extra cost to you. Here is how that works and why it never changes what we recommend.",
  path: "/affiliate-disclosure",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Affiliate Disclosure", url: "/affiliate-disclosure" },
];

export default function AffiliateDisclosurePage() {
  return (
    <>
      <JsonLd data={baseGraph([breadcrumbNode(crumbs)])} />
      <PageBanner
        eyebrow="Full transparency"
        title={
          <>
            Affiliate <span className="text-gradient">Disclosure</span>
          </>
        }
        description="How links on this site work, and our promise that they never sway our advice."
        crumbs={crumbs}
        accent="pink"
        ad
      />
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-ink-400">Last updated: July 2, 2026</p>
            <div className="prose-article mt-6">
              <p>
                Here is the plain version. Some of the links on {site.name} are
                affiliate links. If you click one and go on to book or buy
                something, we may earn a small commission. It costs you nothing
                extra, the price is exactly the same as if you had gone there
                directly, and you are never obligated to use our links. That is
                the whole arrangement, with no fine print hiding underneath it.
              </p>

              <h2>What an affiliate link actually is</h2>
              <p>
                When we mention a hotel, a rail pass, a tour, a travel card or a
                piece of gear, the link may be tagged so the partner knows the
                visit came from us. If a booking happens, they pay us a
                percentage. Think of it as a finder&apos;s fee that the company
                pays, not you. Plenty of the links we include are not affiliate
                links at all, because our first job is to point you to the right
                option, whether or not there is anything in it for us.
              </p>

              <h2>It never changes our recommendations</h2>
              <p>
                This is the part that matters most. A commission never buys a
                better review, a higher ranking, or a spot on a &quot;best&quot;
                list. We decide what to recommend first, based on research and
                real trade-offs in price, time and comfort, and only then check
                whether a partner link happens to exist. If the best choice for
                you pays us nothing, we still tell you it is the best choice. If
                a paying partner is not the right pick, it does not make the cut.
                You can read the full standard behind that promise in our{" "}
                <Link href="/editorial-policy">editorial policy</Link>.
              </p>

              <h2>How we choose partners</h2>
              <p>
                We only link to companies we would be comfortable sending a
                friend to: established booking sites, transport operators and
                brands with a real track record and a fair returns or
                cancellation stance. We do not chase the highest payout, and we
                drop a partner if the service goes downhill or readers tell us it
                let them down. The point is to make booking easier for you, not
                to fill the page with whichever program pays the most.
              </p>

              <h2>Advertising is separate</h2>
              <p>
                Alongside affiliate links, we show ads through Google AdSense.
                Those ads are served automatically and are kept entirely separate
                from our writing. Advertisers cannot commission a guide, edit our
                words, or influence what we recommend, and we do not always know
                which specific ad you will see. To understand what AdSense and
                similar services collect, see our{" "}
                <Link href="/privacy-policy">privacy policy</Link>.
              </p>

              <h2>Why we tell you all this</h2>
              <p>
                Being upfront about how a site makes money is simply the honest
                thing to do, and it is what guidelines like the FTC&apos;s ask
                for. We would rather over-explain than leave you guessing. If any
                link or arrangement on the site is ever unclear, ask us through
                the <Link href="/contact">contact page</Link> and we will give
                you a straight answer.
              </p>

              <h2>A genuine thank you</h2>
              <p>
                When you book through one of our links, you help keep {site.name}{" "}
                running and free to read, and you make it possible for us to keep
                researching and updating guides. It is a real support and we do
                not take it for granted. Thank you for trusting us with your trip
                planning, and for helping us keep the advice independent.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
