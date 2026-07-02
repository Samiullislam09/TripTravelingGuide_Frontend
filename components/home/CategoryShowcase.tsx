import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { iconForCategory } from "@/lib/category-icon";

interface CategoryShowcaseProps {
  categories: Category[];
}

// The 4 CGHEVEN add-on accent colors — cycled across the category tiles.
const ACCENTS = [
  { color: "#f97316", soft: "rgba(249,115,22,0.12)" }, // brand orange
  { color: "#00a2e8", soft: "rgba(0,162,232,0.12)" }, // DaVinci blue
  { color: "#9999ff", soft: "rgba(153,153,255,0.16)" }, // After Effects periwinkle
  { color: "#c8a2ff", soft: "rgba(200,162,255,0.16)" }, // Premiere violet
];

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <Container>
        <SectionHeading
          eyebrow="Browse by"
          title="Explore categories"
          align="center"
        />

        <div
          data-reveal-stagger
          className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        >
          {categories.map((category, index) => {
            const Icon = iconForCategory(category.slug);
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}/`}
                aria-label={`Browse all ${category.name} guides`}
                className="card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:[--tw-ring-color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                style={{ ["--accent" as string]: accent.color }}
              >
                <div
                  className="flex h-24 items-center justify-center sm:h-32"
                  style={{ background: accent.soft }}
                >
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                    style={{ background: accent.color }}
                  >
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-1 p-4 sm:p-5">
                  <h3 className="font-bold text-ink-900">{category.name}</h3>
                  {category.description ? (
                    <p className="line-clamp-2 text-sm text-ink-500">
                      {category.description}
                    </p>
                  ) : null}
                  <span
                    className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold"
                    style={{ color: accent.color }}
                  >
                    View all guides
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default CategoryShowcase;
