import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { iconForCategory } from "@/lib/category-icon";

// The 4 CGHEVEN add-on accent colors — cycled across the category tiles.
const ACCENTS = [
  { color: "#f97316", soft: "rgba(249,115,22,0.12)" }, // brand orange
  { color: "#00a2e8", soft: "rgba(0,162,232,0.12)" }, // DaVinci blue
  { color: "#9999ff", soft: "rgba(153,153,255,0.16)" }, // After Effects periwinkle
  { color: "#c8a2ff", soft: "rgba(200,162,255,0.16)" }, // Premiere violet
];

interface CategoryCardProps {
  category: Category;
  index?: number;
}

/**
 * A category tile with the category's real "asset" photo (its top post's cover)
 * and an accent icon badge. Falls back to a gently floating icon when the
 * category has no imagery yet. Shared by the home CategoryShowcase and the
 * Explore page so both always look the same.
 */
export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const Icon = iconForCategory(category.slug);
  const accent = ACCENTS[index % ACCENTS.length];
  const count = category.count ?? 0;

  return (
    <Link
      href={`/category/${category.slug}/`}
      aria-label={`Browse all ${category.name} guides`}
      className="card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:[--tw-ring-color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
      style={{ ["--accent" as string]: accent.color }}
    >
      <div
        className="relative flex h-28 items-center justify-center overflow-hidden sm:h-36"
        style={{ background: accent.soft }}
      >
        {category.image ? (
          <>
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"
            />
            <span
              className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-white/30 backdrop-blur"
              style={{ background: `${accent.color}cc` }}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          </>
        ) : (
          <>
            <span
              aria-hidden
              className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-40 blur-xl"
              style={{ background: accent.color }}
            />
            <span
              className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm transition-transform duration-300 motion-safe:animate-float group-hover:scale-110"
              style={{ background: accent.color, animationDelay: `${index * 0.4}s` }}
            >
              <Icon className="h-7 w-7" aria-hidden="true" />
            </span>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4 sm:p-5">
        <h3 className="font-bold text-ink-900">{category.name}</h3>
        {count > 0 ? (
          <p className="text-sm text-ink-500">
            {count} {count === 1 ? "guide" : "guides"}
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
}

export default CategoryCard;
