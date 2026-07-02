import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/content";
import { postMetadata } from "@/lib/seo/metadata";
import { postGraph, type Crumb } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/post/Breadcrumbs";
import { Faq } from "@/components/post/Faq";
import { AuthorBox } from "@/components/post/AuthorBox";
import { PostCard } from "@/components/post/PostCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { Reveal } from "@/components/motion/Reveal";
import ShareBar from "@/components/post/ShareBar";
import CommentSystem from "@/components/comments/CommentSystem";
import { formatDate, readingTimeMinutes } from "@/lib/utils";

// Strip the WordPress "Easy Table of Contents" block (<div id="ez-toc-container">)
// that is baked into migrated posts' HTML. Removes the whole container by
// balancing <div>/</div> so nested markup goes with it.
function stripInlineToc(html: string): string {
  const marker = '<div id="ez-toc-container"';
  const start = html.indexOf(marker);
  if (start === -1) return html;
  const afterOpen = html.indexOf(">", start);
  if (afterOpen === -1) return html;

  const re = /<\/?div\b[^>]*>/gi;
  re.lastIndex = afterOpen + 1;
  let depth = 1;
  let end = -1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    if (m[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        end = re.lastIndex;
        break;
      }
    } else {
      depth += 1;
    }
  }
  if (end === -1) return html.slice(0, start);
  return html.slice(0, start) + html.slice(end);
}

// Split rendered article HTML into two parts at a paragraph boundary near the
// middle, so we can drop a native in-content ad between them.
function splitHtmlForAd(html: string): [string, string] {
  const marker = "</p>";
  const ends: number[] = [];
  let i = html.indexOf(marker);
  while (i !== -1) {
    ends.push(i + marker.length);
    i = html.indexOf(marker, i + marker.length);
  }
  if (ends.length < 4) return [html, ""]; // too short to split cleanly
  const mid = html.length / 2;
  let best = ends[0];
  for (const idx of ends) {
    if (Math.abs(idx - mid) < Math.abs(best - mid)) best = idx;
  }
  return [html.slice(0, best), html.slice(best)];
}

// Pre-render every known post at build time; revalidate via the content layer.
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return postMetadata(post);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);
  const minutes = post.readingMinutes ?? readingTimeMinutes(post.contentHtml);
  const shareUrl = `/${post.slug}/`;
  const [bodyTop, bodyRest] = splitHtmlForAd(stripInlineToc(post.contentHtml));

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: post.category.name, url: `/category/${post.category.slug}` },
    { name: post.title, url: `/${post.slug}/` },
  ];

  return (
    <>
      {/* Full structured-data graph: Org + WebSite + Person + Breadcrumb + Article + FAQ */}
      <JsonLd data={postGraph(post, crumbs)} />

      <article>
        {post.coverImage ? (
          /* Immersive cover hero — title overlaid on the cover image */
          <header className="relative isolate">
            <div className="relative h-[56vh] min-h-[340px] w-full overflow-hidden sm:min-h-[400px] sm:h-[64vh]">
              <Image
                src={post.coverImage}
                alt={post.coverAlt || post.title}
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

            <Container className="absolute inset-x-0 bottom-0 z-10 max-w-4xl pb-8 sm:pb-12">
              <Reveal>
                <span className="pill bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                  {post.category.name}
                </span>
                <h1 className="mt-4 max-w-3xl text-2xl font-bold leading-tight text-white drop-shadow sm:text-4xl lg:text-[2.9rem]">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/85 sm:mt-5">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-white/20 text-xs font-bold text-white ring-1 ring-white/40"
                    >
                      {post.author.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        post.author.name.charAt(0)
                      )}
                    </span>
                    <span className="font-semibold text-white">
                      {post.author.name}
                    </span>
                  </span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-white/60" />
                  <span>{formatDate(post.publishedAt)}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-white/60" />
                  <span>{minutes} min read</span>
                </div>
              </Reveal>
            </Container>
          </header>
        ) : (
          /* Fallback header band when there's no cover image */
          <header className="bg-brand-soft pb-10 pt-8">
            <Container className="max-w-3xl">
              <Breadcrumbs crumbs={crumbs} />
              <Reveal>
                <span className="pill-violet mt-5">{post.category.name}</span>
                <h1 className="mt-4 text-3xl leading-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
                  {post.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-ink-500">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-400">
                  <span className="font-semibold text-ink-700">
                    {post.author.name}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-ink-400" />
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="h-1 w-1 rounded-full bg-ink-400" />
                  <span>{minutes} min read</span>
                  {post.updatedAt && post.updatedAt !== post.publishedAt && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-ink-400" />
                      <span>Updated {formatDate(post.updatedAt)}</span>
                    </>
                  )}
                </div>
              </Reveal>
            </Container>
          </header>
        )}

        {/* Breadcrumbs + lead excerpt strip (below the immersive hero) */}
        {post.coverImage && (
          <Container className="max-w-3xl pt-6">
            <Breadcrumbs crumbs={crumbs} />
            <p className="mt-4 border-l-4 border-brand-500 pl-4 text-lg leading-relaxed text-ink-500">
              {post.excerpt}
            </p>
          </Container>
        )}

        {/* Body + sticky aside */}
        <Container className="py-12">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
            {/* Main column */}
            <div className="mx-auto w-full max-w-3xl lg:mx-0">
              {/* Article toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-y border-line py-3">
                <span className="text-sm font-medium text-ink-500">
                  {minutes} min read
                </span>
                <ShareBar title={post.title} url={shareUrl} />
              </div>

              <div className="mt-8">
                <AdSlot label="Advertisement" />
              </div>

              <div
                className="prose-article mt-8"
                dangerouslySetInnerHTML={{ __html: bodyTop }}
              />

              {bodyRest ? (
                <>
                  {/* In-content advertisement */}
                  <div className="my-10">
                    <AdSlot label="Advertisement" />
                  </div>
                  <div
                    className="prose-article"
                    dangerouslySetInnerHTML={{ __html: bodyRest }}
                  />
                </>
              ) : null}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 border-t border-line pt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="pill bg-brand-600/10 text-brand-700 transition-colors hover:bg-brand-600/20"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {post.faq && post.faq.length > 0 && (
                <section className="mt-14">
                  <h2 className="text-2xl text-ink-900 sm:text-3xl">
                    Frequently asked questions
                  </h2>
                  <Faq items={post.faq} />
                </section>
              )}

              <div className="mt-12">
                <AdSlot label="Advertisement" />
              </div>

              <AuthorBox author={post.author} />

              <div className="mt-12">
                <ShareBar title={post.title} url={shareUrl} />
              </div>

              <CommentSystem postSlug={post.slug} />
            </div>

            {/* Sticky aside — desktop only: a large ad unit */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <div className="rounded-3xl border border-line bg-surface/60 p-4">
                  <AdSlot label="Advertisement" minHeight={600} />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-line py-16">
          <Container>
            <Reveal className="mb-8">
              <span className="pill-coral">Keep reading</span>
              <h2 className="mt-3 text-2xl text-ink-900 sm:text-3xl">
                Related guides
              </h2>
            </Reveal>
            <div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              data-reveal-stagger
            >
              {related.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
