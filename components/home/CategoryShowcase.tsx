import type { Category } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/category/CategoryCard";

interface CategoryShowcaseProps {
  categories: Category[];
}

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
          action={{ label: "See all", href: "/explore" }}
        />

        <div
          data-reveal-stagger
          className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        >
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default CategoryShowcase;
