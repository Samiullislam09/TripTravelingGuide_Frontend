import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";

import { getCategories, getPostsByCategory } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/post/PostCard";
import { PageBanner } from "@/components/layout/PageBanner";

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = (await getCategories()).find((c) => c.slug === slug);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} travel guides`,
    description:
      cat.description ||
      `Browse our latest ${cat.name.toLowerCase()} travel guides and honest comparisons.`,
    path: `/category/${cat.slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = (await getCategories()).find((c) => c.slug === slug);
  if (!cat) notFound();

  const posts = await getPostsByCategory(slug);
  const crumbs = [
    { name: "Home", url: "/" },
    { name: cat.name, url: `/category/${cat.slug}` },
  ];

  return (
    <>
      <JsonLd data={baseGraph([breadcrumbNode(crumbs)])} />

      {/* Header band */}
      <PageBanner
        eyebrow="Category"
        title={cat.name}
        description={
          cat.description ||
          `Our latest ${cat.name.toLowerCase()} travel guides and honest, hands on comparisons.`
        }
        crumbs={crumbs}
        accent="violet"
      >
        <p className="text-sm font-medium text-ink-500">
          {posts.length} {posts.length === 1 ? "guide" : "guides"}
        </p>
      </PageBanner>

      {/* Posts grid */}
      <section className="py-12 sm:py-16">
        <Container>
          {posts.length === 0 ? (
            <div
              data-reveal
              className="card flex flex-col items-center justify-center gap-3 py-16 text-center"
            >
              <FolderOpen
                aria-hidden="true"
                className="size-10 text-ink-400"
              />
              <p className="text-lg font-semibold text-ink-900">
                No guides here yet
              </p>
              <p className="max-w-sm text-ink-500">
                We&apos;re still writing for this category, check back soon for
                fresh {cat.name.toLowerCase()} stories.
              </p>
            </div>
          ) : (
            <div
              data-reveal-stagger
              className="grid items-stretch gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
            >
              {posts.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} priority={i < 3} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
