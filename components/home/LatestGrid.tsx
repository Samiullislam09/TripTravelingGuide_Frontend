import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category, PostSummary } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostExplorer } from "@/components/blog/PostExplorer";

interface LatestGridProps {
  posts: PostSummary[];
  categories: Category[];
}

export function LatestGrid({ posts, categories }: LatestGridProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Fresh off the press"
          title="Latest articles"
          action={{ label: "View all articles", href: "/blog" }}
        />

        <div className="mt-8">
          <PostExplorer posts={posts} categories={categories} />
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/blog" className="btn btn-outline">
            Browse all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default LatestGrid;
