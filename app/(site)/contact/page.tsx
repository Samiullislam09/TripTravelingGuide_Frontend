import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact us",
  description:
    "Get in touch with the TripTravelingGuide team for questions, feedback, corrections, or partnerships.",
  path: "/contact",
});

const email = site.contact.email || "hello@triptravelingguide.com";

const channels = [
  { icon: Mail, label: "Email us", value: email, href: `mailto:${email}` },
  {
    icon: MessageCircle,
    label: "Feedback & corrections",
    value: "We read every message",
    href: "#contact-form",
  },
  { icon: Clock, label: "Response time", value: "Usually within 1–2 days" },
  { icon: MapPin, label: "Coverage", value: "USA · Canada · Global guides" },
];

export default function ContactPage() {
  return (
    <>
      {/* Header band */}
      <section className="relative overflow-hidden bg-brand-soft pb-12 pt-12 sm:pt-16">
        <div className="blob -right-16 -top-10 h-64 w-64 bg-brand-300" />
        <Container className="relative max-w-3xl text-center">
          <span className="pill-coral" data-reveal>
            Contact
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl" data-reveal data-reveal-delay="0.05">
            Let&apos;s plan something great
          </h1>
          <p
            className="mx-auto mt-4 max-w-xl text-lg text-ink-500"
            data-reveal
            data-reveal-delay="0.1"
          >
            Questions, corrections, or partnership ideas? Send us a note and the
            editorial team will get back to you.
          </p>
        </Container>
      </section>

      {/* Body */}
      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Info column */}
            <div className="space-y-4" data-reveal>
              {channels.map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <div className="flex items-start gap-4 rounded-3xl border border-line bg-surface p-5 transition hover:border-brand-400/60">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-600/10 text-brand-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{label}</p>
                      <p className="mt-0.5 text-sm text-ink-500">{value}</p>
                    </div>
                  </div>
                );
                return href ? (
                  <Link key={label} href={href} className="block">
                    {inner}
                  </Link>
                ) : (
                  <div key={label}>{inner}</div>
                );
              })}
            </div>

            {/* Form */}
            <div id="contact-form" className="scroll-mt-28" data-reveal data-reveal-delay="0.1">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
