import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Editorial Policy",
  description:
    "How we research, write, source, fact-check and update our travel guides, and why our recommendations stay independent from advertisers.",
  path: "/editorial-policy",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Editorial Policy", url: "/editorial-policy" },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <JsonLd data={baseGraph([breadcrumbNode(crumbs)])} />
      <PageBanner
        eyebrow="How we work"
        title={
          <>
            Editorial <span className="text-gradient">Policy</span>
          </>
        }
        description="Our standards for research, sourcing, accuracy and independence."
        crumbs={crumbs}
        accent="coral"
        ad
      />
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-ink-400">Last updated: July 2, 2026</p>
            <div className="prose-article mt-6">
              <p>
                {site.name} exists to help people plan better trips. That only
                works if you can trust what you read here. This page explains
                exactly how our guides come together, who checks them, and where
                our loyalty sits. If we ever fall short of the standards below,
                we want to hear about it and fix it.
              </p>

              <h2>How our guides are researched</h2>
              <p>
                Every guide starts with a real question a traveler is trying to
                answer: is it worth flying instead of taking the train, which
                neighborhood to book, how many days a city actually needs. We
                map out the practical decisions first, then do the legwork to
                answer them. That means pulling current fares and timetables,
                reading the fine print on tickets and passes, and comparing the
                real trade-offs in cost, time and comfort rather than repeating
                what other sites say.
              </p>
              <p>
                Where we have been somewhere ourselves, we say so and we lean on
                that first-hand experience: what the transfer was actually like,
                whether a &quot;10 minute walk&quot; is really 10 minutes with
                luggage, and the small things that guidebooks skip. When we have
                not visited a place, we do not pretend we have. We research it
                carefully, note what is verified versus what is reported, and
                keep the writing honest about the difference.
              </p>

              <h2>Sourcing and fact-checking</h2>
              <p>
                Details that change a traveler&apos;s plans get checked against
                primary sources. Prices, schedules, baggage rules, opening hours
                and border and visa requirements are verified against official
                operators and government pages, not against blog posts or
                aggregators. Visa and entry rules in particular can shift with
                little notice, so we date-stamp that kind of guidance and point
                you to the official source to confirm before you book. Numbers we
                quote are the numbers we found at the time of writing, and we try
                to make the &quot;as of&quot; clear so you can judge how fresh
                they are.
              </p>

              <h2>How often we review and update content</h2>
              <p>
                Travel information goes stale. A fare table from two years ago
                can be actively misleading, so we treat updating as part of the
                job rather than an afterthought. Guides covering fast-moving
                details like prices and transport schedules are reviewed on a
                regular cycle, and any guide can be pulled forward for a refresh
                when an operator changes a route, a price jumps, or a reader
                flags something. Each guide shows when it was last reviewed so
                you always know how current it is.
              </p>

              <h2>Corrections</h2>
              <p>
                We get things wrong sometimes, and when we do we fix them in the
                open. If you spot an error, an out-of-date price, a schedule that
                has changed, or anything that reads as unfair, tell us through
                our{" "}
                <Link href="/contact">contact page</Link> and point to the
                specific guide. We check reader reports, correct the guide, and
                update the review date so the change is visible. Meaningful
                corrections are made promptly rather than quietly buried.
              </p>

              <h2>Independence from advertisers and sponsors</h2>
              <p>
                Our recommendations are not for sale. No company can pay to be
                ranked higher, described more kindly, or added to a list of
                &quot;best&quot; options. The people who research and edit our
                guides work separately from anything commercial, and a business
                relationship never earns a better write-up. If money is involved
                in any link on the site, we disclose it plainly in our{" "}
                <Link href="/affiliate-disclosure">affiliate disclosure</Link>,
                and that arrangement still does not change what we recommend.
              </p>

              <h2>How we use AI, honestly</h2>
              <p>
                We use AI tools to help with the early, mechanical parts of
                research, such as gathering sources to check, organizing notes,
                and spotting gaps to look into. We do not publish machine-written
                guides. Every guide is checked, edited and stood behind by a
                person, the facts are verified against real sources by a human,
                and the voice and judgment you read are ours. AI helps us work
                faster; it does not decide what we recommend or replace the
                editing that makes a guide trustworthy.
              </p>

              <h2>Who stands behind this</h2>
              <p>
                {site.name} is founded and edited by {site.founder.name}, who is
                responsible for the standards on this page and for the guides we
                publish. You can read more about the people and the thinking
                behind the site on our{" "}
                <Link href="/about">about page</Link>. If something here does not
                match your experience of the site, that is exactly the kind of
                thing we want you to tell us.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
