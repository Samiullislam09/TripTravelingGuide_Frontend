import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description:
    "What cookies TripTravelingGuide uses, including Google Analytics and Google AdSense cookies, and how to control them in your browser.",
  path: "/cookie-policy",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Cookie Policy", url: "/cookie-policy" },
];

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd data={baseGraph([breadcrumbNode(crumbs)])} />
      <PageBanner
        eyebrow="Legal"
        title={
          <>
            Cookie <span className="text-gradient">Policy</span>
          </>
        }
        description="The cookies we use, why we use them, and how you stay in control of them."
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
                This Cookie Policy explains how TripTravelingGuide uses cookies and similar
                technologies when you visit the site. It sits alongside our{" "}
                <Link href="/privacy-policy">Privacy Policy</Link> and gives you the detail on
                what each type of cookie does and how to switch them off.
              </p>

              <h2>What cookies are</h2>
              <p>
                A cookie is a small text file that a website stores in your browser. It lets the
                site remember things between page loads and between visits, such as whether you
                have seen a notice, or how you reached a page. Cookies cannot run programs or carry
                viruses, and on their own they do not identify you by name. Some are set by us and
                some are set by the third-party services we rely on.
              </p>

              <h2>Types of cookies we use</h2>
              <p>We group the cookies on this site into three kinds:</p>
              <ul>
                <li>
                  <strong>Essential cookies.</strong> These keep the site working. They handle
                  basic things like page delivery, security, and remembering simple preferences.
                  The site cannot run properly without them, so they are always on.
                </li>
                <li>
                  <strong>Analytics cookies.</strong> These help us understand how readers use the
                  site, which guides are popular, and where people run into trouble. We use Google
                  Analytics for this. The data is aggregated so we see patterns rather than
                  individuals.
                </li>
                <li>
                  <strong>Advertising cookies.</strong> These support the ads that keep the site
                  free to read. We use Google AdSense, and Google and its partners set cookies to
                  measure and, where allowed, personalize the ads you see.
                </li>
              </ul>

              <h2>Google Analytics cookies</h2>
              <p>
                Google Analytics sets cookies to measure how the site is used. They record things
                like which pages you view, how long you stay, and the site that referred you, in a
                form that helps us improve our guides. You can opt out of Google Analytics across
                all sites by installing the official Google Analytics opt-out browser add-on at{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tools.google.com/dlpage/gaoptout
                </a>
                .
              </p>

              <h2>Google AdSense cookies</h2>
              <p>
                As a Google AdSense publisher, we allow Google and its advertising partners to set
                cookies on our pages. These include the DoubleClick DART cookie, which Google uses
                to serve ads based on your visits to this and other sites. You can manage or turn
                off personalized advertising at{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  adssettings.google.com
                </a>
                , and opt out of many other vendors at{" "}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aboutads.info
                </a>
                . Opting out means the ads become less tailored, not that they disappear.
              </p>

              <h2>Third-party cookies and consent</h2>
              <p>
                Some cookies are set by the third parties named above rather than by us, and their
                own privacy and cookie policies govern them. Where the law requires consent before
                non-essential cookies are set, we ask for it, and you are free to decline. If you
                are in a region that requires it, Google may serve non-personalized ads based on
                your choices.
              </p>

              <h2>How to control cookies in your browser</h2>
              <p>
                You are always in charge of cookies. Every major browser lets you see the cookies
                that are stored, delete them, and block new ones. Look in the privacy or security
                settings of Chrome, Safari, Firefox, or Edge for the option to manage cookies. You
                can block all cookies, block only third-party cookies, or clear them whenever you
                like. Please note that if you block essential cookies, some parts of the site may
                stop working as expected.
              </p>

              <h2>Updates to this policy</h2>
              <p>
                We may update this Cookie Policy when the tools we use or the rules around
                advertising change. When we make a meaningful change we will update the date at the
                top of the page. If you have any question about cookies, email us at{" "}
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
