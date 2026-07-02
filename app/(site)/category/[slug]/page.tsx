import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";

import { getCategories, getPostsByCategory, getPopularPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { baseGraph, breadcrumbNode } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/post/Breadcrumbs";
import { PageBanner } from "@/components/layout/PageBanner";
import { PaginatedGrid } from "@/components/blog/PaginatedGrid";
import { ArticleCarousel } from "@/components/blog/ArticleCarousel";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 300;

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
  const posts = await getPostsByCategory(slug);
  const heroImage = posts.find((p) => p.coverImage)?.coverImage;
  return buildMetadata({
    title: `${cat.name} travel guides`,
    description:
      cat.description ||
      `Browse our latest ${cat.name.toLowerCase()} travel guides and honest comparisons.`,
    path: `/category/${cat.slug}`,
    image: heroImage,
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

  const [posts, popular] = await Promise.all([
    getPostsByCategory(slug),
    getPopularPosts(14),
  ]);

  // The category "asset": the first real cover image in this category doubles as
  // the hero background. Falls back to the standard brand banner when the
  // category has no imagery yet.
  const heroImage = posts.find((p) => p.coverImage)?.coverImage;
  const description =
    cat.description ||
    `Our latest ${cat.name.toLowerCase()} travel guides and honest, hands on comparisons.`;
  const countLabel = `${posts.length} ${posts.length === 1 ? "guide" : "guides"}`;

  const crumbs = [
    { name: "Home", url: "/" },
    { name: cat.name, url: `/category/${cat.slug}` },
  ];

  // Cross-category discovery rail (popular guides outside this category).
  const discovery = popular.filter((p) => p.category.slug !== slug).slice(0, 12);

  return (
    <>
      <JsonLd data={baseGraph([breadcrumbNode(crumbs)])} />

      {heroImage ? (
        <>
          {/* Immersive category asset hero */}
          <header className="relative isolate">
            <div className="relative h-[38vh] min-h-[240px] w-full overflow-hidden sm:h-[44vh] sm:min-h-[300px]">
              <Image
                src={heroImage}
                alt={`${cat.name} travel guides`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25"
              />
            </div>

            <Container className="absolute inset-x-0 bottom-0 z-10 pb-8 sm:pb-10">
              <Reveal>
                <span className="pill bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                  Category
                </span>
                <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl lg:text-[3rem]">
                  {cat.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
                  {description}
                </p>
                <p className="mt-3 text-sm font-semibold text-white/80">{countLabel}</p>
              </Reveal>
            </Container>
          </header>

          {/* Breadcrumb strip below the hero */}
          <Container className="pt-6">
            <Breadcrumbs crumbs={crumbs} />
          </Container>
        </>
      ) : (
        <PageBanner
          eyebrow="Category"
          title={cat.name}
          description={description}
          crumbs={crumbs}
          accent="violet"
        >
          <p className="text-sm font-medium text-ink-500">{countLabel}</p>
        </PageBanner>
      )}

      {/* Posts grid — 12 per page with numbered pagination */}
      <section className="py-12 sm:py-16">
        <Container>
          {posts.length === 0 ? (
            <div
              data-reveal
              className="card flex flex-col items-center justify-center gap-3 py-16 text-center"
            >
              <FolderOpen aria-hidden="true" className="size-10 text-ink-400" />
              <p className="text-lg font-semibold text-ink-900">No guides here yet</p>
              <p className="max-w-sm text-ink-500">
                We&apos;re still writing for this category, check back soon for fresh{" "}
                {cat.name.toLowerCase()} stories.
              </p>
            </div>
          ) : (
            <PaginatedGrid posts={posts} />
          )}
        </Container>
      </section>

      {/* Cross-category discovery rail */}
      {discovery.length > 0 && (
        <section className="border-t border-line bg-surface-2/40 py-12 sm:py-16">
          <Container>
            <ArticleCarousel
              title="Popular across the site"
              eyebrow="Keep exploring"
              posts={discovery}
              accent="coral"
            />
          </Container>
        </section>
      )}
    </>
  );
}
