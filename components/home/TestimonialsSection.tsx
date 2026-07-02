import { MapPin, Clock, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Honest editorial-trust block. We do not publish fabricated reviews or invented
// engagement numbers here — that is an E-E-A-T liability and works against the
// Helpful-Content recovery goal. Instead this states the standards we actually
// hold every guide to, in plain language.

interface Promise {
  icon: typeof MapPin;
  title: string;
  body: string;
  color: string;
}

const PROMISES: Promise[] = [
  {
    icon: MapPin,
    title: "Real comparisons, not filler",
    body: "We line up routes, costs, and trade-offs side by side so you can decide in minutes. Each guide answers the question you actually searched for, then gets out of the way.",
    color: "#f97316",
  },
  {
    icon: Clock,
    title: "Kept current for 2026",
    body: "Prices, schedules, and entry rules change. We revisit our most-read guides through the year and stamp each one with the date it was last checked, so you never plan on stale advice.",
    color: "#00a2e8",
  },
  {
    icon: Check,
    title: "Written to be useful",
    body: "No thin listicles and no padding to hit a word count. A person reviews and edits every guide before it goes live, and we say plainly when something is our opinion rather than a hard fact.",
    color: "#9999ff",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Our promise"
          title="Why readers trust our guides"
          align="center"
        />

        <div
          data-reveal-stagger
          className="mt-8 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PROMISES.map((promise) => {
            const Icon = promise.icon;
            return (
              <div key={promise.title} className="card p-6">
                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                  style={{ background: promise.color }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink-900">
                  {promise.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-500">
                  {promise.body}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default TestimonialsSection;
