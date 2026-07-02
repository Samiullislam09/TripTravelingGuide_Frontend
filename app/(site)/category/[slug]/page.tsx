import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";

import { getCategories, getPostsByCategory } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/post/Breadcrumbs";
import { PostCard } from "@/components/post/PostCard";
import { AdSlot } from "@/components/ads/AdSlot";

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
      <section className="bg-brand-soft py-12 sm:py-16">
        <Container>
          <Breadcrumbs crumbs={crumbs} />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_336px] lg:items-center">
            <div data-reveal className="max-w-2xl">
              <span className="pill pill-violet inline-flex items-center gap-1.5">
                <FolderOpen aria-hidden="true" className="size-3.5" />
                Category
              </span>

              <h1 className="mt-4 break-words font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-5xl">
                {cat.name}
              </h1>

              <p className="mt-3 text-base text-ink-700 sm:text-lg">
                {cat.description ||
                  `Our latest ${cat.name.toLowerCase()} guides and honest, hands-on comparisons.`}
              </p>

              <p className="mt-4 text-sm font-medium text-ink-500">
                {posts.length} {posts.length === 1 ? "guide" : "guides"}
              </p>
            </div>

            {/* Ad placement — fills the empty right side of the header on large screens */}
            <div
              data-reveal
              data-reveal-delay="0.1"
              className="hidden rounded-3xl border border-line bg-surface/60 p-4 lg:block"
            >
              <AdSlot label="Sponsored" className="my-0" />
            </div>
          </div>

          {/* Mobile / tablet ad — the right-side header ad is hidden below lg */}
          <div
            data-reveal
            className="mt-8 rounded-3xl border border-line bg-surface/60 p-4 lg:hidden"
          >
            <AdSlot label="Sponsored" className="my-0" />
          </div>
        </Container>
      </section>

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
                We&apos;re still writing for this category — check back soon for
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
