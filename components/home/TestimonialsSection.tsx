import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Maya Rivera",
    role: "Solo backpacker",
    quote:
      "The Kyoto itinerary was flawless — I hit every hidden temple and still had time for late-night ramen. Best trip planning I've ever used.",
  },
  {
    name: "Daniel Osei",
    role: "Weekend explorer",
    quote:
      "Booked a last-minute Lisbon getaway in under ten minutes. The neighborhood guides made me feel like a local on day one.",
  },
  {
    name: "Sofia Lindqvist",
    role: "Digital nomad",
    quote:
      "I plan most of my work-travel through here now. The offline maps and café picks are spot on for getting things done abroad.",
  },
  {
    name: "Arjun Mehta",
    role: "Family traveler",
    quote:
      "Travelling with two kids is hard, but the family-friendly Bali routes kept everyone happy. Stress-free from airport to villa.",
  },
  {
    name: "Chloe Bennett",
    role: "Adventure seeker",
    quote:
      "From Patagonia trekking to fjord kayaking, every recommendation matched my pace perfectly. I've never trusted a guide more.",
  },
  {
    name: "Tomás García",
    role: "Honeymoon planner",
    quote:
      "Planned our Santorini honeymoon down to the sunset dinner spots. Romantic, seamless, and exactly what we dreamed of.",
  },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Travelers ❤"
          title="Trusted by trip planners"
          align="center"
        />

        <div
          data-reveal-stagger
          className="mt-8 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <figure key={testimonial.name} className="card p-6">
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white"
                >
                  {initials(testimonial.name)}
                </div>
                <figcaption>
                  <div className="font-semibold text-ink-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-ink-500">{testimonial.role}</div>
                </figcaption>
              </div>

              <blockquote className="mt-5 leading-relaxed text-ink-700">
                “{testimonial.quote}”
              </blockquote>

              <div
                className="mt-5 flex items-center gap-1"
                role="img"
                aria-label="Rated 5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    aria-hidden="true"
                    className="h-4 w-4 fill-coral-500 text-coral-500"
                  />
                ))}
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default TestimonialsSection;
