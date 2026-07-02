import Image from "next/image";
import Link from "next/link";
import { Globe } from "lucide-react";
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  GithubIcon,
} from "@/components/ui/BrandIcons";
import { Container } from "@/components/ui/Container";
import { getCategories } from "@/lib/content";
import { site } from "@/lib/site";

const exploreLinks = [
  { label: "All articles", href: "/blog" },
  { label: "All categories", href: "/explore" },
  { label: "Web Stories", href: "/web-stories" },
  { label: "Search", href: "/search" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

const socials = [
  { label: "Portfolio", href: site.social.portfolio, Icon: Globe },
  { label: "GitHub", href: site.social.github, Icon: GithubIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedinIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon },
].filter((s) => s.href);

export async function Footer() {
  const year = new Date().getFullYear();
  const categories = await getCategories();

  return (
    <footer className="mt-24 border-t border-line bg-brand-soft">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr]">
        {/* Brand column */}
        <div data-reveal>
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="TripTravelingGuide"
              width={431}
              height={121}
              className="h-9 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
            {site.tagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-500 transition hover:border-brand-600 hover:bg-brand-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/60"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore column */}
        <div data-reveal data-reveal-delay="0.05">
          <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900">
            Explore
          </h4>
          <ul className="mt-4 space-y-2.5">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ink-500 transition hover:text-brand-600"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories column */}
        {categories.length > 0 && (
          <div data-reveal data-reveal-delay="0.08">
            <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900">
              Categories
            </h4>
            <ul className="mt-4 space-y-2.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}/`}
                    className="text-sm text-ink-500 transition hover:text-brand-600"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Company column */}
        <div data-reveal data-reveal-delay="0.1">
          <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ink-500 transition hover:text-brand-600"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal column */}
        <div data-reveal data-reveal-delay="0.12">
          <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900">
            Legal
          </h4>
          <ul className="mt-4 space-y-2.5">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ink-500 transition hover:text-brand-600"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Stay in the loop column */}
        <div data-reveal data-reveal-delay="0.15">
          <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900">
            Stay in the loop
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            Get new destination guides and honest comparisons straight to your
            inbox.
          </p>
          <Link
            href="/#newsletter"
            className="btn-primary mt-4 inline-flex px-5 py-2 text-sm"
          >
            Subscribe
          </Link>
        </div>
      </Container>

      <div className="border-t border-line/70">
        <Container className="flex flex-col items-center gap-3 py-5 text-xs text-ink-400 sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-1.5">
            Designed &amp; developed by
            <a
              href={site.founder.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 transition hover:text-brand-700"
            >
              {site.founder.name}
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
