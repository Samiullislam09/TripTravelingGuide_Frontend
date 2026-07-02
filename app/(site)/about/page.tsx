import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdSlot } from "@/components/ads/AdSlot";
import { PageBanner } from "@/components/layout/PageBanner";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About TripTravelingGuide",
  description: `Who we are and why we build honest travel guides. ${site.tagline}`,
  path: "/about",
});

const values = [
  {
    icon: ShieldCheck,
    title: "Honest first",
    body: "Every comparison and recommendation is based on real research and first-hand experience, never paid placement dressed up as advice.",
  },
  {
    icon: Compass,
    title: "Genuinely useful",
    body: "We answer the questions travelers actually ask: what to skip, what to book early, and how to get the most from limited time and budget.",
  },
  {
    icon: HeartHandshake,
    title: "Made for people",
    body: "Clear, human writing for USA, Canada, and global travelers, no fluff, no filler, just guidance you can act on with confidence.",
  },
];

const stats = [
  { value: "200+", label: "Researched guides" },
  { value: "30+", label: "Destinations covered" },
  { value: "50k+", label: "Trips planned" },
  { value: "100%", label: "Independent reviews" },
];

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* Hero band */}
      <PageBanner
        eyebrow="About us"
        title={<>Honest travel guides, <span className="text-gradient">made to help</span></>}
        description={site.description}
        accent="violet"
        align="center"
        ad={false}
      />

      {/* Our values */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="What we stand for"
            title="Our values"
            description="Three principles shape every guide we publish."
          />
          <div
            data-reveal-stagger
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="card card-hover p-7"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-600">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink-900">
                    {value.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-500">{value.body}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Founder / editorial bio */}
      <section className="py-4">
        <Container>
          <div
            data-reveal
            className="glass overflow-hidden rounded-4xl p-6 sm:p-12"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
              <div
                data-reveal="left"
                className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-5xl bg-brand-gradient text-3xl font-bold text-white shadow-glow sm:h-52 sm:w-52"
              >
                <BookOpen className="h-16 w-16" aria-hidden="true" />
              </div>
              <div data-reveal="right">
                <span className="pill pill-coral">Behind the guides</span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                  Our mission
                </h2>
                <p className="mt-4 leading-relaxed text-ink-700">
                  {site.name} publishes researched destination comparisons, transport
                  guides, and trip-planning advice for travelers in the USA, Canada, and
                  beyond. We obsess over the practical details (costs, timing, and the
                  trade-offs that decide a trip) so you can plan with confidence.
                </p>
                <p className="mt-4 leading-relaxed text-ink-500">
                  Independent and reader-first: we test, compare, and write only what we
                  would tell a friend. No sponsored fluff, no copy-paste itineraries.
                </p>
                <Link
                  href="/founder"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                  Meet the founder
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Advertisement */}
      <section className="py-6 sm:py-8">
        <Container>
          <AdSlot label="Advertisement" {...site.adUnits.postTop} />
        </Container>
      </section>

      {/* Stats row */}
      <section className="py-16 sm:py-20">
        <Container>
          <div
            data-reveal-stagger
            className="grid grid-cols-2 gap-6 rounded-4xl border border-line bg-surface p-8 shadow-card sm:p-10 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-gradient sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-medium text-ink-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-4">
        <Container>
          <div
            data-reveal="zoom"
            className="relative overflow-hidden rounded-5xl bg-brand-gradient px-8 py-14 text-center shadow-glow sm:px-12 sm:py-16"
          >
            <span className="blob -left-10 -top-10 opacity-30" aria-hidden="true" />
            <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to plan a smarter trip?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85">
              Have a question or a destination in mind? Get in touch, or explore our
              latest visual travel stories.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="btn btn-primary">
                Contact us
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/web-stories" className="btn btn-outline border-white/40 text-white hover:bg-white/10">
                Explore web stories
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
