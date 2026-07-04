import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, MapPin, ArrowRight, Snowflake, Compass, Boxes } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseGraph, breadcrumbNode, personNode } from "@/lib/seo/schema";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/ui/BrandIcons";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

const FOUNDER_EMAIL = "heysamiul09@gmail.com";

export const metadata: Metadata = buildMetadata({
  title: "Samiul Islam — Founder of TripTravelingGuide",
  description:
    "Meet Samiul Islam, founder of TripTravelingGuide and a full-stack web developer with 3+ years of experience and 26+ launched sites, behind projects like CGHEVEN, WCA Global, and SnowPredictions.",
  path: "/founder",
  image: site.founder.image,
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Founder", url: "/founder" },
];

// Person schema for the founder — a real E-E-A-T trust signal on the page that
// is literally about a person.
const founderPerson = {
  name: "Samiul Islam",
  slug: "samiul-islam",
  role: "Founder of TripTravelingGuide",
  bio: "Samiul Islam is the founder of TripTravelingGuide and a full-stack web developer with 3+ years of experience and 26+ launched sites, behind projects like CGHEVEN, WCA Global, and SnowPredictions.",
  image: site.founder.image,
  url: "/founder",
  social: {
    portfolio: site.social.portfolio,
    github: site.social.github,
    linkedin: site.social.linkedin,
    instagram: site.social.instagram,
    youtube: site.social.youtube,
  },
};

const stats = [
  { value: "3+", label: "Years experience" },
  { value: "26+", label: "Sites launched" },
  { value: "500+", label: "Guides on this site" },
  { value: "India", label: "Based in" },
];

const skills = [
  "Next.js",
  "React",
  "JavaScript",
  "GSAP",
  "Node.js",
  "WordPress",
  "REST APIs",
  "SEO",
];

const projects = [
  {
    icon: Boxes,
    name: "CGHEVEN",
    body: "The world's first CC0 CG asset hub for 3D models and VFX resources.",
  },
  {
    icon: Globe,
    name: "WCA Global",
    body: "An international business network spanning 14 country-specific websites.",
  },
  {
    icon: Snowflake,
    name: "SnowPredictions",
    body: "A weather and winter-sports platform with forecasts and trip planning.",
  },
  {
    icon: Compass,
    name: "TripTravelingGuide",
    body: "This travel platform: 500+ destination guides and honest comparisons.",
  },
];

const socials = [
  { label: "Portfolio", href: site.social.portfolio, Icon: Globe },
  { label: "GitHub", href: site.social.github, Icon: GithubIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedinIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon },
].filter((s) => s.href);

export default function FounderPage() {
  return (
    <div className="pb-20">
      <JsonLd data={baseGraph([personNode(founderPerson), breadcrumbNode(crumbs)])} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-soft py-12 sm:py-16">
        <div
          aria-hidden
          className="blob -left-20 -top-20 h-56 w-56 animate-blob-spin bg-addon-blender/30"
        />
        <div
          aria-hidden
          className="blob right-[-4rem] top-4 h-52 w-52 animate-float bg-addon-davinci/25"
        />
        <Container className="relative z-10">
          <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
            <div className="mx-auto lg:mx-0">
              <div className="relative h-40 w-40 overflow-hidden rounded-4xl ring-4 ring-white shadow-glow sm:h-48 sm:w-48">
                <Image
                  src={site.founder.image}
                  alt="Samiul Islam"
                  fill
                  priority
                  sizes="192px"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <span className="pill pill-coral">Founder</span>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl lg:text-[3rem]">
                Samiul Islam
              </h1>
              <p className="mt-2 text-lg font-semibold text-brand-600">
                Founder of TripTravelingGuide · Full-stack Web Developer
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-600">
                Creative, results-driven developer who builds user-friendly websites
                and digital platforms that solve real problems. Passionate about using
                modern technologies and AI to ship high-quality work, fast. Samiul
                founded and built TripTravelingGuide end to end.
              </p>

              {/* Socials */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`Samiul Islam on ${label}`}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16">
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

      {/* Skills */}
      <section className="pb-4">
        <Container>
          <SectionHeading align="center" eyebrow="Toolkit" title="Skills & stack" />
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {skills.map((skill) => (
              <span key={skill} className="pill bg-brand-600/10 text-brand-700">
                {skill}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Projects */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Selected work"
            title="Projects & platforms"
            description="A few of the products Samiul has designed and built."
          />
          <div
            data-reveal-stagger
            className="mt-10 grid gap-6 sm:grid-cols-2"
          >
            {projects.map((p) => {
              const Icon = p.icon;
              return (
                <article key={p.name} className="card card-hover flex gap-5 p-6">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-600">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-900">
                      {p.name}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-ink-500">{p.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-4">
        <Container>
          <div className="relative overflow-hidden rounded-5xl bg-brand-gradient px-8 py-14 text-center shadow-glow sm:px-12 sm:py-16">
            <span className="blob -left-10 -top-10 opacity-30" aria-hidden="true" />
            <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Work with Samiul
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-white/85">
              Website development, custom platforms, WordPress, and SEO. Have a project
              in mind? Reach out and let&apos;s build it.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`mailto:${FOUNDER_EMAIL}`} className="btn btn-primary">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {FOUNDER_EMAIL}
              </a>
              <a
                href={site.social.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline border-white/40 text-white hover:bg-white/10"
              >
                View portfolio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className="relative mt-6 inline-flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Based in India
            </p>
          </div>
        </Container>
      </section>

      {/* Back to about */}
      <Container>
        <div className="mt-10 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            About TripTravelingGuide
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
