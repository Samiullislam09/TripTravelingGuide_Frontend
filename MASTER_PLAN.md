# Trip Traveling Guide — Master Build Plan

## Executive Summary??? 

Rebuild `triptravelingguide.com` as a Next.js (App Router) travel-comparison blog on Vercel, fed by the existing `triptravelguide-dashboard` (Prisma) via a public read API. The site is **SEO-first** with **app-like mobile UX**, **heavy-but-tasteful animation**, **Web Stories**, **AdSense monetization**, comments, and full analytics.

**Headline goal:** recover the organic traffic that collapsed from ~500k to ~1–2k/mo. A 99%+ drop is a catastrophic, sitewide event (most likely Helpful-Content/scaled-content suppression, deindexing, a manual action, or a botched prior migration) — **not** a normal core-update wobble. The rebuild alone will not fix algorithmic suppression; it must be paired with diagnosis, slug-perfect migration of the 20 surviving posts, E-E-A-T content remediation, and quality-gated publishing.

**Realistic trajectory (state to owner):** 90 days → full re-indexation, the 20 posts recovered to near-prior positions, **10–40k/mo and rising**. Approaching prior peaks is a **6–12 month** path dependent on Google classifier refreshes *after* genuine quality improvement. Anyone promising fast 500k recovery is wrong.

**The single most important rule:** every ranking URL keeps its exact path, or returns a single 301 hop. Slug/canonical/robots mistakes turn a recoverable suppression into a permanent one.

---

## Tech Stack & Dependencies (single source of truth)

Three specs disagreed on framework/Tailwind/animation versions. **Reconciled decisions below are binding** — do not ship alternatives.

| Concern | Decision | Rationale |
|---|---|---|
| Framework | **Next.js 15.x**, App Router, Node 20 on Vercel | Stable RSC, `revalidateTag`, native metadata routes. |
| React | **React 18.3.1** (not 19) | Avoid transitive-dep conflicts with animation/comment libs on Vercel. Upgrade to 19 only after launch stability. |
| Language | **TypeScript 5.6+**, `strict: true` | Catch content-shape drift between dashboard API and frontend. |
| Source layout | `src/` dir, import alias `@/*` | `--src-dir` scaffold. |
| Styling | **Tailwind CSS 3.4** (NOT v4) | Plugin ecosystem (typography, aspect-ratio), shadcn/cva patterns, Framer interplay all smoother on 3.4. Lock to avoid churn. |
| Animation (primary) | **Framer Motion 11.x** (`motion/react`) | 95% of work: `whileInView` reveals, stagger, hover/tap, page transitions, reduced-motion. |
| Animation (cinematic) | **GSAP 3.12 + `@gsap/react` + ScrollTrigger** | ONLY hero parallax, pinned/scrubbed sequences, marquee. Never both libs on one element. |
| Smooth scroll | **lenis** (official `lenis/react`, NOT deprecated `@studio-freight/lenis`) | One rAF loop drives parallax + GSAP via a bridge. |
| Carousels | **embla-carousel-react** (+ `embla-carousel-autoplay`) | Story rows, mobile rails, lightbox. Lighter + less CLS than Swiper. |
| Bottom sheets | **vaul** | Native-feeling drawers (search overlay, filters). |
| Icons | **lucide-react** | Line icons, tree-shakeable; matches brand. No icon fonts. |
| Content source | **API-first (dashboard public read API) + ISR**; MDX only as build-time fallback/cornerstone pages | Posts live in DB as `contentHtml`. |
| Client data (islands only) | **TanStack Query** (comments/search/story feed) | No global store; content is RSC-fetched. |
| Client UI state | **Zustand** (mobile nav, story viewer, search modal) | Tiny; avoid Redux. |
| Validation | **Zod** | Validate API responses at the boundary. |
| HTML sanitize | **isomorphic-dompurify** (render guard) + **sanitize-html** (server enrich in dashboard) | Never render raw CMS HTML. |
| HTML transform | **cheerio** (dashboard enrich) / **node-html-parser** or **html-react-parser** (frontend selective hydration) | Heading IDs, ad anchors, image rewrite, link rels. |
| Lightbox | **yet-another-react-lightbox** | In-article image zoom. |
| Search | **Pagefind** (static, free, client-side) | ~20→hundreds of posts; swap to Algolia only past ~1k posts. |
| OG images | **`next/og`** (built-in `ImageResponse`) | Dynamic per-post/author cards. |
| Structured data types | **schema-dts** (dev) | Type-checked JSON-LD. |
| RSS | **`feed`** | Correct XML/escaping; don't hand-roll. |
| PWA | **`@ducanh2912/next-pwa`** (maintained fork) | App-Router-friendly installable shell. |
| Forms | **react-hook-form** + **@hookform/resolvers** + Zod | Contact + newsletter. |
| Email | **Resend** + **@react-email/components** | Serverless-safe; avoid Nodemailer/SMTP on Vercel. |
| Rate limiting | **@upstash/ratelimit** + **@upstash/redis** | Stateless serverless-safe. |
| Spam | honeypot + time-trap + **hCaptcha** (`@hcaptcha/react-hcaptcha`) + **Akismet** (plain fetch) | Defense in depth; no reCAPTCHA. |
| Analytics | **@next/third-parties** (GA4), **@vercel/analytics**, **@vercel/speed-insights** | CWV field data is the ranking signal. |
| Errors | **@sentry/nextjs** | Source maps, replay-on-error, `tunnelRoute`. |
| KPI sync (dashboard) | **googleapis** | GSC + GA4 + AdSense → `AnalyticsSnapshot`. |
| Server guard | **server-only** | Keep API keys out of client bundle. |
| Class utils | **clsx** + **tailwind-merge** + **class-variance-authority** | `cn()` helper + component variants. |
| Image opt | **sharp** (auto on Vercel) | AVIF/WebP + LQIP generation. |
| Build-time helpers | **reading-time**, **he**, **turndown**, **p-limit**, **fast-xml-parser** | Migration/enrich scripts. |

**Explicitly rejected:** `next-sitemap`, `next-seo` (App Router native covers both), Swiper, GSAP SplitText (paid), `react-adsense`, `react-insta-stories`, Disqus/Giscus/Hyvor (see Comments), Algolia at launch, `@phosphor-icons/react` (heavy; only if duotone is truly needed).

### Scaffold

```bash
npx create-next-app@15 triptravelingguide-frontend \
  --ts --app --tailwind --eslint --src-dir --import-alias "@/*" --no-turbopack
```

Disable Turbopack in **build** (GSAP/HMR edge cases); dev Turbopack is fine.

### Environment variables

| Scope | Var | Purpose |
|---|---|---|
| Frontend (server) | `DASHBOARD_API_URL` / `CMS_API_BASE_URL` | Dashboard origin |
| Frontend (server) | `DASHBOARD_API_KEY` / `CMS_API_TOKEN` | Public-API bearer/x-api-key |
| Frontend (server) | `REVALIDATE_SECRET` | `/api/revalidate` webhook auth |
| Frontend (public) | `NEXT_PUBLIC_SITE_URL` | `https://triptravelingguide.com` (no trailing slash) |
| Frontend (public) | `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXX` |
| Frontend (public) | `NEXT_PUBLIC_ADS_ENABLED` | Kill-switch (`false` on preview) |
| Frontend (public) | `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_HCAPTCHA_SITEKEY` | Client SDKs |
| Frontend (server) | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `UPSTASH_*` | Contact form |
| Dashboard | `FRONTEND_URL`, `REVALIDATE_SECRET` | Publish webhook target |
| Dashboard | `DATABASE_URL` (**Postgres**), `BLOB_READ_WRITE_TOKEN` | DB + image store |
| Dashboard | `HCAPTCHA_SECRET`, `AKISMET_KEY`, `IP_SALT`, `PUBLIC_SITE_ORIGIN` | Comments |
| Dashboard | `GA4_PROPERTY_ID`, `GSC_SA_EMAIL`, `GSC_SA_PRIVATE_KEY`, `CRON_SECRET` | KPI sync |

Only `NEXT_PUBLIC_*` reach the browser. Mark dashboard read tokens Production-only if preview must not hit live content.

> **CRITICAL infra blocker:** the dashboard runs **SQLite on a file DB**, which cannot run on Vercel serverless (ephemeral, read-only FS) and locks under concurrent comment writes. **Migrate the dashboard to Postgres (Neon/Supabase) before launch**, or host it persistently (Railway/Fly). The schema is Postgres-compatible. Public-API code is identical either way.

> **CRITICAL dashboard middleware blocker:** the dashboard `middleware.ts` matcher includes `/api/:path*` and will 401 the new public API. **Add `/api/public` to the public allowlist** (or exclude from the matcher) — otherwise the frontend gets total content loss.

---

## Full Route / File Tree (`src/app/`)

URL decision (locked, Option A): **migrated WordPress posts stay at root-level `/[slug]`** to preserve their live URLs. The single post route sits *inside* the `(site)` route group so it inherits chrome while keeping a root URL (route groups don't affect URLs). Confirm trailing-slash + permalink shape against the live site before locking (see Migration).

```
src/
  app/
    layout.tsx                         # <html>, fonts, AdSense script, providers, JSON-LD org+website, SpeedInsights/Analytics, viewport
    template.tsx                       # page transition (Framer, opacity-led)
    globals.css                        # Tailwind layers + tokens + reduced-motion guard
    page.tsx                           # HOME (RSC shell + client animation islands)
    not-found.tsx                      # branded 404 (fires not_found event)
    error.tsx                          # route error boundary (client)
    global-error.tsx                   # root render errors (Sentry)
    sitemap.ts                         # native sitemap.xml
    robots.ts                          # native robots.txt
    rss.xml/route.ts                   # feed package
    opengraph-image.tsx                # default OG

    (site)/                            # shares Header + Footer + MobileBottomNav (AppShell)
      layout.tsx
      [slug]/                          # SINGLE POST — root-level URL, WP slug preservation
        page.tsx
        not-found.tsx
        opengraph-image.tsx
        ArticleBody.tsx                # client island: parser, ad hydration, lightbox
      blog/
        page.tsx                       # all-posts index (paginated)
        page/[page]/page.tsx
      destinations/page.tsx            # HUB: comparisonType=destination
      transport/page.tsx               # HUB: comparisonType=transport
      stays/page.tsx                   # HUB: comparisonType=stay
      category/[slug]/                 # (alias of hubs if a /category/ scheme is needed)
        page.tsx
        page/[page]/page.tsx
      tags/[tag]/page.tsx              # tag archive (noindex if <3 posts)
      authors/[slug]/                  # author portfolio (E-E-A-T)
        page.tsx
        opengraph-image.tsx
      about/page.tsx
      contact/page.tsx
      contact/ContactForm.tsx
      contact/actions.ts               # 'use server' submitContact
      search/
        page.tsx                       # <Suspense> wrapper
        SearchClient.tsx
      (legal)/
        privacy-policy/page.tsx        # AdSense REQUIRES this
        terms/page.tsx
        disclaimer/page.tsx            # affiliate/ad disclosure
        cookie-policy/page.tsx

    web-stories/                       # OUTSIDE (site) — chrome-free
      page.tsx                         # indexable HTML hub (ItemList JSON-LD)
      [slug]/route.ts                  # AMP HTML via route handler (NOT page.tsx)
      sitemap.ts                       # separate stories sitemap

    api/
      og/route.tsx                     # dynamic OG (edge)
      revalidate/route.ts              # on-publish webhook target (Node)
      comments/route.ts                # proxy → dashboard (or direct if shared DB)
      newsletter/route.ts              # optional

  components/
    ui/         (Button, Card, Badge, Pill, SectionHeading, Container, Section,
                 StoryBubble/StoryRow, DestinationCard, PostCard, StatBlock,
                 IconBadge, SearchBar, AdSlot, GradientText)
    nav/        (Header, HeaderClient, Footer, Breadcrumbs)
    mobile/     (AppShell, BottomTabBar, MobileTopBar, SearchOverlay, StoryRow,
                 StoryViewer, CategoryChips, SegmentedTabs, PhotoGrid, StickyCTA,
                 PullToRefresh, InstallPrompt)
    home/       (Hero, HeroParallax, WebStoriesRow, TopCategories, PopularGuides,
                 ExploreDestinations, AdventuresStats/PinnedAdventures, LatestPosts,
                 NewsletterCTA)
    post/       (PostHero, PostBody, TableOfContents, Callout, PostImage,
                 InArticleAd, ShareBar, FaqAccordion, AuthorBox, RelatedPosts,
                 CommentSection, ReadingProgressBar)
    author/     (AuthorHero, AuthorCredentials, ExpertiseTags, SocialProofStrip,
                 TeamGrid, AuthorArticleList)
    comments/   (CommentSection, CommentItem, CommentForm, ReplyButton, CommentJsonLd)
    discovery/  (RelatedPosts, ContextualLinks, TrendingRail, TagChips, HubGrid)
    motion/     (Reveal, Stagger/StaggerItem, Counter, Parallax, Marquee,
                 ScrollProgress, RevealOnScrollChildren)
    ads/        (AdSenseScript, AdSlot)
    media/      (SmartImage)

  providers/    (SmoothScroll, GsapLenisBridge, Providers[QueryClient+LazyMotion])

  lib/
    api.ts / cms.ts            # typed dashboard client (server-only)
    types.ts / content.ts      # Post/Story/Author/Category contracts
    schemas.ts                 # Zod
    cn.ts
    nav.ts                     # MAIN_NAV/CATEGORY_NAV/BOTTOM_NAV/FOOTER_NAV
    seo/ (config, meta, jsonld)
    posts.ts / stories.ts / authors.ts
    sanitize.ts / toc.ts / faq.ts
    discovery/ (related, taxonomy, trending, linkmap)
    ads/ (config, injectAds)
    analytics.ts
    motion/ (tokens, variants)

  content/posts/*.mdx          # cornerstone/fallback fixtures

  middleware.ts                # 301 redirect map (legacy URLs, ?p=, /feed/, /amp/)
  next.config.mjs
  tailwind.config.ts
  public/ (ads.txt, manifest.webmanifest, icons/, badges/, categories/, images/migrated/)
```

**Route-group rationale:** `(site)` provides Header/Footer/BottomNav to all standard pages. `[slug]` lives inside it (root URL preserved). `web-stories` sits outside for full-bleed chrome-free AMP. `(legal)` shares a prose `LegalLayout`. The root `[slug]` catch-all is the riskiest routing decision — guard it with a reserved-word denylist + `generateStaticParams` from real slugs only + `notFound()` on miss.

---

## Design System (tokens)

Brand: vibrant travel — violet→pink→coral gradients, rounded pills, soft colored shadows, friendly geometric display type. **Tokens are the contract; never hardcode hex in components.**

### Fonts (`next/font/google`)
- **Display/headings:** Plus Jakarta Sans (weights 400/600/700/800) → `--font-display`.
- **Body/UI:** Inter → `--font-sans`.
- `adjustFontFallback: true`, `display: 'swap'`, subset tightly. Set vars on `<html>`.

### Color tokens

| Token | Hex | Use |
|---|---|---|
| `ink-900` | `#1A1A2E` | display headings, primary text |
| `ink-700` | `#3A3A52` | body text |
| `ink-500` | `#6B6B82` | muted/captions |
| `ink-300` | `#A8A8BD` | placeholders/disabled |
| `line` | `#ECEAF3` | borders/dividers |
| `surface` | `#FFFFFF` | base/cards |
| `surface-alt` | `#F8F7FC` | soft lavender section bg |
| `surface-mint` | `#EAF7F1` | mint section bg |
| `surface-peach` | `#FFF1EC` | warm/coral section bg |
| `violet-600` | `#7C3AED` | **primary** accent + focus ring |
| `violet-500` | `#8B5CF6` | hover |
| `violet-50` | `#F3EEFF` | chip bg |
| `pink-500` | `#EC4899` | secondary accent |
| `pink-50` | `#FCE9F3` | chip bg |
| `coral-500` | `#FB5B3F` | tertiary / "hot" / highlight words |
| `coral-400` | `#FF6B4A` | coral hover |
| `coral-50` | `#FFEDE8` | chip bg |
| `mint-500` | `#22C39A` | success/available |
| `amber-500` | `#F5A524` | ratings/popular |

**Gradients:** `--grad-primary: linear-gradient(135deg,#7C3AED,#EC4899)` (CTAs, story rings) · `--grad-warm/coral: linear-gradient(135deg,#FB5B3F,#EC4899)` (hero blobs) · `--grad-text: linear-gradient(90deg,#7C3AED,#EC4899)` (headline words) · `--grad-soft: linear-gradient(180deg,#F8F7FC,#FFFFFF)`.

### Typography scale (fluid `clamp()`)
`display-xl` `clamp(2.5rem,6vw,4.5rem)`/800 · `display-lg` `clamp(2rem,4vw,3.25rem)`/800 · `h2` `clamp(1.5rem,2.5vw,2.25rem)`/700 · `h3` `1.5rem`/700 · `h4` `1.25rem`/600 · `lead` `1.125rem`/1.7 · `body` `1rem`/1.75 · `sm` `0.875rem` · `xs` `0.75rem` uppercase eyebrow.
Article prose = scoped `.prose-tt` (18px/1.75, measure `68ch`, ink-700 body, Jakarta headings, `scroll-mt-24` on h2/h3). Override Tailwind Typography defaults, don't inherit them blindly.

### Spacing / radii / shadows
- Section rhythm: `--space-section: clamp(4rem,8vw,7rem)`; gutter `--space-gutter: clamp(1rem,5vw,2rem)`.
- Container max `1200px`; `.container-tight` `760px` (article).
- Radii: `lg 16` · `xl 20` · `2xl 24` (default card) · `3xl 32` (hero panels) · `full` (pills/bubbles).
- Shadows (soft, colored — not gray): `sm 0 4px 12px rgba(26,26,46,.06)` · `md 0 8px 24px …08` · `lg 0 16px 40px …10` · `violet 0 12px 28px rgba(124,58,237,.28)` · `coral 0 12px 28px rgba(251,91,63,.28)`.
- Easing token `--ease-out-soft: cubic-bezier(.22,1,.36,1)` shared with the animation system.
- Safe-area: `spacing.safe-b/safe-t = env(safe-area-inset-*)`, `height.tabbar = calc(56px + env(safe-area-inset-bottom))`.

### Base components
`cva` + `cn()`, `forwardRef`, spread `...props`, `className` last. Server components unless stateful.
- **Button** — pill default; variants `primary` (grad), `coral`, `outline`, `ghost`, `soft`; sizes sm/md/lg; `asChild` via Radix Slot; focus ring `ring-2 ring-violet-600 ring-offset-2`.
- **Card** (`elevated|outline|ghost`, `interactive` hover-lift), **Badge** (tone chips), **Pill** (filter tabs), **SectionHeading** (eyebrow + gradient-word title + subtitle), **DestinationCard** (image-fill, scrim, floating badge, rating), **PostCard** (consumes Post DTO), **StoryBubble/StoryRow** (gradient ring), **StatBlock**, **IconBadge**, **SearchBar**, **Container**, **Section** (tone bg), **AdSlot** (reserved min-height).

### Cross-cutting rules
Hover-lift via `transform` only (no CLS). Every interactive element keeps a visible focus ring. `prefers-reduced-motion` resets hover/transitions globally. Text-over-image always sits on a gradient scrim (WCAG AA). Blob shapes = absolutely-positioned `div`s (`--grad-warm` + `blur-3xl` + `rounded-full`, `aria-hidden`), never `<img>`.

---

## Content Data Model & Dashboard→Frontend API

Source of truth: dashboard `Article` model — `slug @unique`, `status` (`published` literal), `comparisonType ∈ {destination,transport,stay}`, `tags` (comma string), `titleAlternatives` (JSON string), `contentHtml`, `metaTitle/metaDescription`, `primaryKeyword`, `wordCount`, `publishedAt`, `wordpressPostId/wordpressUrl`, plus internal scoring/`InternalLink`/`AnalyticsSnapshot`/`HumanInputMarker` relations.

**Never consume the internal `/api/articles`** (returns drafts + internal scoring). Add dedicated **public, published-only, cached, key-gated** endpoints on the dashboard.

### New dashboard endpoints (all under `/api/public/`)

```
GET /api/public/posts            ?page=&pageSize=&category=&type=&tag=&q=   → Paginated<PostSummary>
GET /api/public/posts/[slug]                                                → { post: Post } | 404
GET /api/public/posts/slugs                                                 → { slug, updatedAt }[]   (build params/sitemap)
GET /api/public/manifest                                                    → lean corpus (related/search/sitemap)
GET /api/public/categories  +  /categories/[slug]
GET /api/public/web-stories  +  /web-stories/[slug]
GET /api/public/authors  +  /authors/[slug]
GET /api/public/comments  (GET list + POST submit)
GET /api/public/trending
GET /api/public/sitemap-data
```

All: `WHERE status='published' AND publishedAt<=now()`, strip internal fields, `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`, `X-Robots-Tag: noindex`, gate behind `x-api-key`, CORS locked to the prod origin. A shared `lib/public-serializer.ts` normalizes `Article → Post` (splits tags CSV, derives `readingTimeMinutes = ceil(wordCount/220)`, resolves `featuredImage`, parses JSON-string columns, sanitizes HTML, injects heading IDs).

### Frontend contract (`lib/content.ts`)

```ts
export type ComparisonType = 'destination'|'transport'|'stay';
export type CategorySlug = 'destinations'|'transport'|'stays';

export interface PostSummary {
  slug: string; title: string; metaTitle: string; metaDescription: string;
  excerpt: string; comparisonType: ComparisonType;
  category: { slug: string; name: string } | null;
  tags: string[]; primaryKeyword: string;
  featuredImage: ImageRef | null; readingTimeMinutes: number;
  publishedAt: string; updatedAt: string;
}
export interface Post extends PostSummary {
  contentHtml: string; tableOfContents: TocItem[];
  author: Author; faq: { question: string; answer: string }[];
  internalLinks: { slug: string; title: string; anchorText: string }[];
}
export interface ImageRef { url: string; alt: string; width: number; height: number; blurDataURL?: string }
```

### Frontend fetcher (`lib/cms.ts`, server-only)
Wrap `fetch` with `next: { revalidate, tags }` so the webhook purges precisely. `getPost`/`getPostSlugs`/`getPosts`/`getCategories`/`getWebStories`/`getAuthor`. 404 → `notFound()`. **MDX fallback:** if `CMS_API_BASE_URL` unset or API 404s, fall back to `content/posts/*.mdx` so the frontend builds in CI/preview with zero dashboard dependency.

### Schema additions required on the dashboard (additive migrations)
- `Article`: `updatedAt @updatedAt`, `featuredImageUrl/Alt/W/H/Blur`, `categoryId`+`category`, `authorId`+`author`, `reviewedBy`, `reviewedAt`, `faqJson`, `sources`, `canonicalUrl`, optional `legacySlug`, optional `disableAds`.
- New models: `Category`, `Author`, `Pillar` (optional explicit hub ordering), `WebStory`+`StoryPage`, `Comment`.
- Backfill `authorId` on the 20 migrated posts (default founder) — never render an authorless post.

### Image hosting
Generation pipeline uploads the **rendered** image to **Vercel Blob** (or R2/S3) and writes `featuredImageUrl` + `sharp`-generated base64 `blurDataURL`. Never serve image bytes through API JSON. `next.config` `remotePatterns`: blob host + legacy `i0.wp.com`/`*.wp.com` (whitelist so migrated inline `<img>` don't 500). The schema today only has `featuredImagePrompt` — **treat `featuredImageUrl` as always-present** on the frontend; the API maps a deterministic category fallback (`/public/categories/{type}.jpg`) until images are persisted.

### On-publish revalidation
Dashboard publish/edit/unpublish/delete POSTs `{ slug, tags, secret }` to frontend `/api/revalidate`, which calls `revalidateTag('posts')`, `revalidateTag(\`post:${slug}\`)`, plus `categories|stories|sitemap`. Fire-and-forget (`.catch`) so a frontend hiccup never blocks publishing.

---

## Home Page

RSC shell (`(site)/page.tsx`, `export const revalidate = 300`) fetches once and passes plain props to client animation islands. Composition order:

```
<Hero/> · <WebStoriesRow/> · <TopCategories/> · <PopularGuides/> · <ExploreDestinations/>
<AdSlot id="home-incontent-1"/> · <AdventuresStats/> · <LatestPosts/> · <NewsletterCTA/>
```

- **Hero** — 2-col (text/blob-photo), blurred gradient blobs behind. Eyebrow pill, multi-color H1 (`Travel <span class="text-coral">top destinations</span>`), sub-paragraph, **real search bar** (`router.push('/search?q=')`), trust badges, floating glass stat bubbles. Hero image `priority` + masked blob; mount stagger + slow float loop. LCP element — static, not animated entrance.
- **WebStoriesRow** — embla `dragFree` rail of gradient-ring bubbles → `/web-stories/{slug}`; first = "All stories". Thumbnails `sizes="96px"`, no `priority`. Render nothing if empty.
- **TopCategories** — 3 feature cards = the comparisonType pillars (Destinations/Transport/Stays); desktop grid, mobile snap rail.
- **PopularGuides** — bento (1 feature + smaller) of newest/featured `PostCard`s, links flat `/{slug}`.
- **ExploreDestinations** — mosaic image grid with scrim labels + guide counts; subtle desktop-only parallax.
- **AdventuresStats** — full-width band, count-up stats on scroll (Framer `animate()`, `tabular-nums` to avoid width shift; reduced-motion → final value).
- **LatestPosts** — 3-col grid (sliced after Popular to avoid dupes); hide if zero.
- **NewsletterCTA** — client form → `/api/newsletter`, honeypot, equal-height success swap (no layout shift near ads).

**Empty states:** site launches with ~20 posts; every posts-driven section handles `< expected` and `0` gracefully. Reveals use opacity+transform only; reserve all media boxes (CLS). Keep ≥1 viewport between any reveal and an ad slot.

---

## Single Post Page (priority)

`(site)/[slug]/page.tsx` — RSC: fetch → `generateMetadata` → JSON-LD → layout. `generateStaticParams` from `getPostSlugs()`, `export const revalidate = 3600`, `dynamicParams = true`, fetch tagged `post:${slug}`. Denylist guard reserved words; `notFound()` on miss. Do heavy HTML work **once server-side**.

### Sanitize + enrich pipeline (server, in dashboard serializer or `lib/sanitize.ts`)
`sanitize-html` allowlist (`h2-h4,p,ul,ol,li,blockquote,figure,figcaption,img,table…,a,strong,em,code,pre,hr,br,span`; drop `script/style/iframe` except allowlisted YouTube). Then `cheerio`: slugify heading IDs + collect TOC (h2/h3); external links → `target=_blank rel="nofollow noopener noreferrer"`; images → ensure `width/height` + `loading=lazy decoding=async`, wrap captioned in `<figure>`; tables → wrap `.table-scroll` + `data-comparison` (gradient header, zebra, sticky first col); blockquote `Tip:/Note:/Warning:` → `data-callout`; insert `<div data-ad-slot="in-article-N">` anchors (never before ~150 words, after `</p>`, ≥4 blocks apart, max 3, skip if `wordCount<600`). Extract FAQ (`<h2>` matching `/faq/i` → h3 Q / sibling A) into `faq[]` and strip from body.

### Render (`PostBody`, client)
`html-react-parser` `replace` swaps `data-ad-slot` → `<InArticleAd>`, `<img>` → `<PostImage>` (next/image + lightbox), `data-callout` → `<Callout>`. Body in `.prose-tt`. No client re-sanitize (trusts API), but `dangerouslySetInnerHTML` paths still go through DOMPurify defensively.

### Layout
`<ReadingProgressBar/>` (fixed, scaleX from `scrollYProgress`) → `<article>`: `<PostHero/>` (cover `priority fill`, breadcrumbs + BreadcrumbList JSON-LD, title, meta, read time) → 3-col desktop grid (`[1fr_minmax(0,720px)_300px]`): left sticky **TOC** (IntersectionObserver active highlight; `<details>` on mobile), center `PostBody` + `FaqAccordion` + `ShareBar` + `AuthorBox` + `CommentSection`, right sticky sidebar ad + compact related rail → full-width `RelatedPosts` grid below.

**Mobile:** full-bleed hero (`aspect-3/4`), back chevron, Web-Share button; **SegmentedTabs** Overview/Detail/Reviews (Radix, `forceMount` + CSS hide so Googlebot sees full content — never lazy-mount panels); PhotoGrid→lightbox; `StickyCTA` ("Read next guide"); hide bottom tab on detail for immersive reading.

JSON-LD: `Article`/`BlogPosting` (headline, image, datePublished, dateModified, author `@id`, publisher, mainEntityOfPage, wordCount), `BreadcrumbList`, `FAQPage` (only when ≥2 visible Q/A), `Comment`+`commentCount`. Block-level scroll reveals only (never word-by-word — hurts INP). Author injected from `lib/authors.ts` if none set.

---

## Animations

One rAF loop: Lenis root + GSAP ticker bridge in `app/layout.tsx` (`<SmoothScroll><GsapLenisBridge/>{children}</SmoothScroll>`). Tokens in `lib/motion/tokens.ts` (`EASE.out=[0.16,1,0.3,1]`, `DUR`, `DIST`). **Every motion wrapper calls `useReducedMotion()` and returns a static fallback** — baked in so consumers can't forget. Global CSS reduced-motion guard as belt-and-suspenders; Lenis `smoothWheel:false` when reduced.

- **Framer (default):** `<Reveal>` (direction/distance/blur, `once`, viewport `amount`), `<Stagger>/<StaggerItem>` (variant propagation), `<Counter>` (in-view count-up, SSR initial value to avoid hydration shift), `<Parallax>` (small floating elements), `<ScrollProgress>` (reading bar), `<RevealOnScrollChildren>` (IO + CSS class over `.prose` h2/h3/figure/blockquote — keeps motion out of injected HTML), `app/template.tsx` page transition (≤400ms, opacity-led, no exit anims).
- **GSAP (scoped, `useGSAP()`):** `HeroParallax` (scrub blobs slow / foreground fast), `PinnedAdventures` (`next/dynamic ssr:false`, ≥1024 only, `matchMedia` gated, `ScrollTrigger.refresh()` after images/fonts). `<Marquee>` = CSS translate loop (trust badges), GSAP only if velocity-reactive.

**Performance:** animate only `transform`/`opacity`/`filter`; `will-change` only while animating; `viewport:{once:true}` everywhere except marquee; disable parallax/pin under 768px; code-split GSAP. **AdSense guard:** never wrap/parallax ad units; never animate height/width/margin near ads — only transform/opacity; reserve ad heights.

---

## Mobile App Experience

`lg` (1024px) is the mobile↔desktop switch. Mobile-first unprefixed = app UI; `lg:` = desktop. Chrome renders server-side (`lg:hidden` / `hidden lg:block`) — no `useMediaQuery` for layout (hydration flash); `useMediaQuery` only for behavior. `viewport` export: `themeColor:'#7C3AED'`, `viewportFit:'cover'` (required for safe-area insets). Use `min-h-dvh` / `100dvh`, never `100vh`.

- **AppShell** wraps everything: `MobileTopBar` (sticky, auto-hide on scroll-down via `useScrollDirection`, search pill `<button>` → SearchOverlay), `PullToRefresh` (~40 lines, only at `scrollY===0`, threshold 60px, `router.refresh()`), `<main pb-tabbar>`, `BottomTabBar`, desktop header/footer.
- **BottomTabBar** — fixed 5 tabs (Home/Explore/Search/Stories/More), `pb-safe-b`, `usePathname` active state with Framer `layoutId` indicator, ≥48px targets, prefetch links. Hidden on `lg` and on detail/story routes.
- **StoryRow + StoryViewer** — gradient-ring bubbles (seen state in localStorage); fullscreen viewer in portal, embla per story, segmented progress bars (~5s), tap zones (L=prev, R=next), hold=pause, swipe-down=dismiss, body-scroll-lock, `next/image priority` active+preload-next, video pages advance on `onEnded`, CTA → `linkedPostSlug`, reduced-motion safe.
- **CategoryChips** (snap rail, gradient active, updates `?cat=`), **DestinationCard** (adapts by container; shelf carousels peek next via `basis-[78%]`), **PhotoGrid**→lightbox.
- **PWA:** `@ducanh2912/next-pwa` (`disable` in dev), `manifest.webmanifest`, icons (192/512/maskable), `InstallPrompt` after 2nd visit (+ iOS hint sheet). **SW must bypass** `pagead2.googlesyndication.com` + `/api/public/*` (NetworkOnly) — caching AdSense breaks fill/policy.
- **Gotchas:** hide BottomTabBar while any sheet/overlay open (keyboard overlap); reserve `min-h-[280px]` for in-feed mobile ads; passive listeners except active PTR pull; `touch-action: pan-y` on carousel parents; prefetch story/card links on pointerdown/intersection.

---

## Web Stories

Build **both** modes from one data model: Google Web Stories (AMP) = the SEO/Discover asset; on-site viewer = engagement.

### Google Web Stories (AMP) — ship first
`web-stories/[slug]/route.ts` is a **GET route handler returning raw AMP HTML** (NOT a React page — Next hydration scripts break AMP validation). `renderAmpStory()` is a pure string builder emitting valid `<amp-story>` with `poster-portrait-src` (≥640×853, 3:4, **mandatory**), `publisher-logo-src` (square ≥96×96, **mandatory**), every `amp-img` with explicit `width/height layout=responsive`, `<style amp-custom>` only (≤75KB), all HTTPS, escaped CMS text. Self-canonical. Inline `Article` JSON-LD. Validate each via `npx amphtml-validator` in CI + Rich Results Test before "published".

**Discoverability:** add every `/web-stories/[slug]` to `web-stories/sitemap.ts` with `<image:image>` = `posterPortrait`; link from the `/web-stories` hub (indexable HTML, `ItemList` JSON-LD) + home bubble row; submit sitemap in GSC. Reference both sitemaps in `robots.ts`.

### On-site viewer (engagement) — custom (~250 lines), framer-motion only
`StoryBubbleRow` + portal `StoryViewer` (progress bars, tap zones, autoplay, hold-pause, swipe-dismiss, video, preload-next, CTA deep-link, `?story=slug` deep-link via `history.replaceState`, localStorage seen-state, reduced-motion). No AdSense inside viewer or AMP body — monetize stories only via official `amp-story-auto-ads` if ever desired. Reserve fixed bubble-row height (no CLS).

Data: `WebStory`/`StoryPage` Prisma models + public API; `lib/stories.ts` (`getAllStories` lean, `getStory` full), `next: { revalidate: 600 }`.

---

## AdSense

Approved publisher. Goal: monetize without harming CWV (CLS) or policy.

- **Loader:** `AdSenseScript` (`next/script strategy="afterInteractive" crossOrigin="anonymous"`), mounted **once** in `layout.tsx`. One `adsbygoogle.js` per page (deduped by `id`). Never paste the raw snippet too.
- **Strategy:** **manual units as backbone**; enable **Anchor + Vignette Auto Ads only** (no CLS). **Disable in-page Auto Ads** — runtime DOM injection spikes CLS and fights animations.
- **`<AdSlot>`** (`lib/ads/config.ts` slot map + `NEXT_PUBLIC_ADS_ENABLED` kill-switch): reserves `minHeight` on wrapper **and** `<ins>` (CLS≈0); lazy-activates via IntersectionObserver (`rootMargin 600px`); pushes **exactly once** per `<ins>` (`pushed` ref — re-push throws); `"Advertisement"` label (policy); swallows errors (never crash page). Tracks `ad_impression`/`ad_click` (pointerdown proxy — never incentivize).
- **`lib/ads/injectAds.ts`:** split sanitized HTML on `</p>`, interleave 1 unit per ~4–5 paragraphs, max ~3 in-article; only when word count >300. Below-header leaderboard, desktop sticky sidebar (`hidden lg:block`), end-of-article unit before comments. Home: ≤1 in-feed unit low in the grid, none in hero. Category/search: 1 in-feed per N cards. **No ads** on contact/about/404/thank-you/thin pages or inside Web Stories. Respect post `disableAds`.
- **`public/ads.txt`:** `google.com, pub-XXXX, DIRECT, f08c47fec0942fa0`. Verify Authorized post-deploy.
- **Consent:** enable Google's built-in GDPR + US-states messaging in AdSense UI (Privacy & messaging); footer "Do Not Sell/Share" link. Add a custom CMP only if needed.

---

## Comments

**Decision: custom DB-backed comments** in the dashboard Prisma DB (own the data, server-rendered → crawlable, no third-party ad/iframe conflict). Reject Disqus/Giscus/Hyvor.

- **Model `Comment`:** `articleId`, `parentId` (1-level threading), `authorName/Email/Url`, `body`, `status` (pending/published/spam/trash), `isPinned`, `ipHash`, `userAgent`, `akismetSpam`, timestamps. `@@index([articleId,status,parentId])`.
- **Write path:** frontend POSTs to dashboard `POST /api/public/comments` → Zod → honeypot (`website_url`, silent drop) → Upstash rate-limit (3/10min per ipHash) → hCaptcha verify → Akismet → insert (`published` if clean, else `spam`/`pending`). CORS locked to exact prod origin, `OPTIONS` preflight handled. Validate `parentId` belongs to same article + is top-level.
- **Read path:** RSC `CommentSection` fetches `GET /api/public/comments?slug=` (email/IP stripped) and renders in initial HTML (the entire SEO win). `CommentItem` re-sanitizes (DOMPurify, allow `br/a/b/i/strong/em`), forces `rel="nofollow ugc noopener"` on all user links. Emit `Comment` JSON-LD nodes + `commentCount` on the Article. `CommentForm` is a small client island (hCaptcha widget, honeypot, localStorage name/email, `router.refresh()` on success; uncached fetch for freshness).
- **Moderation:** new "Comments" tab in the existing dashboard admin (reuse auth); pending-queue badge; PATCH status/pin, DELETE cascade.
- **Gotchas:** Postgres before prod (SQLite write locks); never `include` email/ipHash in public selects; reset hCaptcha widget after submit; reserve comment-section `min-height` (no CLS); Akismet fail-open in dev only (prod → hold).

---

## Contact

`(site)/contact/page.tsx` (2-col: form left, info/map/socials right) using a **Server Action** (`actions.ts`, progressive enhancement, keeps Resend key server-only). Shared Zod `contactSchema` (name/email/subject-enum/message/consent + honeypot `company`/time-trap `ts`). 3-layer spam: honeypot, time-trap (<3s or >1h reject), Upstash rate-limit (3/10min per IP). `submitContact` → validate → drop silently on honeypot/time-trap → rate-limit → `resend.emails.send` (verified domain `from`, `replyTo` sender, React email template). `ContactForm` is `'use client'` with `useActionState` + RHF + `zodResolver`; surface server field errors; reset form + re-stamp `ts` on success.

Page: `ContactPage`+`Organization`(`contactPoint`) JSON-LD; lazy static Google Maps `<iframe loading="lazy">` (no JS API) with fixed dimensions (CLS); FB/Instagram social pills. No physical address/phone unless real. Resend domain must be SPF/DKIM-verified or sends silently fail.

---

## About / Author Portfolio (E-E-A-T)

E-E-A-T is core to HCU recovery. Real named authors, credentials, dates, sources.

- **Schema (dashboard):** `Author` model (slug, name, role, shortBio, bioHtml, avatar/cover, location, yearsExperience, countriesVisited, JSON-string `expertiseAreas/credentials/socialLinks/pressMentions`, sortOrder, isPublished) + `Article.authorId`/`reviewedBy`. Public API `/api/public/authors` (+ `[slug]`), strips raw email.
- **`/authors/[slug]`** (SSG/ISR, `generateStaticParams`, `dynamicParams=true`): AuthorHero (cover blob, avatar `priority`, stat pills) → `bioHtml` prose (first-person, specific = Experience signal) → ExpertiseTags → AuthorCredentials → SocialProofStrip (press logos + `sameAs` socials) → AuthorArticleList → contact CTA (`/contact?author=`). `ProfilePage`+`Person` JSON-LD with stable `@id` (`.../authors/{slug}#person`).
- **`/about`:** brand story + editorial-standards/methodology block (Google rewards this for YMYL-adjacent) + TeamGrid + SocialProofStrip + CTAs; `Organization` JSON-LD (founder, sameAs, logo, contactPoint).
- **`<AuthorBox>`** on every post (under H1 + compact at end): avatar, name→author page, role, "Published · Updated · Fact-checked by", expertise chips, socials. Article `Article.author` references the **same `@id`** so author authority consolidates sitewide. Fallback to "Editorial Team" author if none — never authorless.
- Don't animate the LCP avatar/hero; sanitize `bioHtml`; `revalidateTag('author:{slug}')` on dashboard update.

---

## SEO — Technical

- **Foundations** (`lib/seo/config.ts`): `metadataBase` mandatory in root layout; canonicals absolute/lowercase/no-trailing-slash (except `/`), self-referencing on every page. `buildMetadata()` helper (`lib/seo/meta.ts`) → title/desc/canonical/OG/Twitter; per-post `metaTitle || title`, `metaDescription || stripped contentHtml ≤160`; `og:type=article` with publishedTime/modifiedTime; use `title:{absolute}` when dashboard wrote a full SEO title.
- **JSON-LD** (`lib/seo/jsonld.ts`, rendered as `<script>` with `</script>` escaped): root `@graph` Organization + WebSite(SearchAction → working `/search?q=`); post Article + BreadcrumbList (+ FAQPage when visible); hub CollectionPage + ItemList; author ProfilePage+Person. `schema-dts` types; validate in Rich Results Test.
- **OG images:** per-post `opengraph-image.tsx` via `next/og` (title + comparisonType badge on brand gradient); prefer real featured image, fall back to dynamic.
- **Sitemaps/robots/RSS (native):** `app/sitemap.ts` (statics + posts + hubs + categories + tags-with-≥3-posts, `lastModified` from updatedAt) + separate `web-stories/sitemap.ts`; `app/robots.ts` (allow all, sitemap refs, **`Disallow:/` on non-production** via `VERCEL_ENV` guard); `rss.xml/route.ts` via `feed`, linked from `<head>` `alternates.types`.
- **Pagination:** path-based (`/blog/page/2`), self-canonical per page, unique titles; noindex thin filter combos; real crawlable URLs (infinite scroll only supplements).
- **404/error:** `not-found.tsx` returns real 404 (`notFound()` on missing/unpublished); `error.tsx` + `global-error.tsx` return non-200.
- **No hreflang** (single en-US market).
- **CWV is a ranking factor** — see Performance.

---

## SEO — Content & Topical Authority

- **Pillar/cluster (hub-and-spoke):** 3 hubs = `comparisonType` → `/destinations`, `/transport`, `/stays`. Spokes stay flat `/[slug]` (legacy + new, consistent — do NOT nest new posts). Hub = curated hand-ordered index + 300–500 words original framing (ranks head terms); spokes rank long-tail. Optional explicit `Pillar` model for editable ordering.
- **Internal linking (highest-leverage):** consume the dashboard's pre-computed `InternalLink.anchorText` (don't re-derive contextual links). Every spoke links **up** to hub (breadcrumb) + **down** from hub ItemList + **sideways** via weighted related grid (keyword-stem 8 > shared-tags 5 > same-pillar 4 + recency). Enforce ≥3 internal links per post at publish; no orphans; diverse anchors (not always exact `primaryKeyword`). Build-time `linkmap.ts` fails build on dangling `InternalLink` targets.
- **E-E-A-T plumbing:** author bylines + author pages; visible Published/Updated/Fact-checked dates (and in JSON-LD); resolve `HumanInputMarker` (photo/price/experience) before publish (real photos, real prices, lived detail); render `sources` as a visible citations block (dofollow to authoritative refs).
- **FAQ targeting (PAA capture):** 4–6 Q/A `faqJson` per draft phrased as literal long-tail queries; render visible `FaqAccordion` → FAQPage (only when visible).
- **Decay refresh (70% of recovery):** refresh the 20 first; trigger on worsening position or >180 days; update prices/dates + 1 new PAA section + 2 internal links + new photo + `dateModified` (meaningful change, not date-touch).
- **Safe AI scaling:** hard 2–5/week cap (spaced Mon/Wed/Fri), mandatory human review gate (markers resolved + ≥3 links + FAQ + sources + author + readability/duplicate thresholds), depth-first (complete Destinations cluster before next pillar), quality over volume.

---

## Ranking Recovery (500k → 1–2k)

### Phase 0 — Diagnose first (Days 1–7, parallel to build; blocking for strategy)
Secure **GSC** (verify both properties via DNS), **Bing Webmaster**, **Screaming Frog** crawl. Export WP URL list + 16-month GSC Pages/Queries CSV → `migration/wp-export.json`. Run the 5-check decision tree:

| Check | Bad signal | Verdict |
|---|---|---|
| Manual Actions panel | any entry | penalty → reconsideration |
| Security panel | hacked/cloaking | clean + reconsideration |
| Pages (Index coverage) | indexed count crashed, "Crawled/Discovered – not indexed" | deindex/suppression |
| Impressions 16mo shape | single-date cliff vs slope | algorithmic (date-align to update calendar) vs decay |
| `site:` query | few/no results | deindex confirmed |

**Date-alignment is the highest-signal diagnostic.** Record verdict in `migration/diagnosis.md`. **If manual action: pause all AI publishing** and file reconsideration with a remediation log. Seed `AnalyticsSnapshot` with the 20 posts' pre-launch baseline (`migration/seed-baseline.ts`).

### Equity-preservation contract (the rebuild MUST honor)
1. **URL parity is law** — confirm live permalink + trailing-slash shape; match exactly (`trailingSlash` in next.config). Mismatch = a 301 on every page.
2. **Generated redirect map** (`migration/redirects.json` from WP-export diff) — every old URL → 200 (same path, preferred) or single 301. **Never 302/404/redirect-to-homepage.** Static via `next.config redirects()`; pattern-based (`/category/`, `?p=ID`, `/feed/`, `/amp/`, date-prefixed) via `middleware.ts`.
3. **On-page signals 1:1** — keep title/meta/H1 identical on the 20; self-canonical; preserve original `publishedAt` (date_gmt, never `now`); preserve internal-link graph.
4. **Sitemap/robots tripwires** — never ship `Disallow:/` or accidental `noindex` (a shared-layout `robots:{index:false}` cascades sitewide). CI test asserts every route returns `index,follow`.
5. **Freeze the 20** for 30 days — cosmetic redesign OK; no slug/title/canonical/content changes.

### 90-day roadmap
- **Days 8–30:** build equity-safe rebuild; generate+test redirects (zero old URL 404s); pre-launch QA gate (all routes `index,follow`; every old URL 200/301; self-canonicals; sitemap reachable; LCP<2.5s, CLS<0.1 via Lighthouse CI). Launch: DNS→Vercel, re-check robots + `site:` within hours, submit sitemaps in GSC+Bing, Request-Index the 20, enable 404 watchdog (`app/api/internal/404-log` + GSC daily for 2 weeks).
- **Days 31–60:** drive "Discovered/Crawled – not indexed" → Indexed (internal links, unique value, batch request-index, prune/merge thin pages); content quality remediation (HumanInputMarkers, E-E-A-T bylines); begin disavow if toxic links.
- **Days 61–90:** publish new high-quality posts at sane cadence (never dump the backlog — re-triggers scaled-content signal); track `AnalyticsSnapshot` deltas (20 posts recover before new pages); pursue 5–15 earned backlinks. Day-90 review.

**Top re-kill gotchas:** staging noindex/Disallow leaking to prod; slug/trailing-slash drift; wrong cascading canonical; redirect-to-homepage soft-404; dumping AI backlog; changing the 20 at launch; AdSense/animation CLS; dashboard middleware 401ing the public API.

---

## WordPress Migration (20 posts)

- **Source:** WP REST API (`/wp-json/wp/v2/posts?per_page=100&status=publish&_embed=1`) primary (clean JSON, rendered HTML, Yoast `yoast_head_json` meta); WXR XML export as frozen backup.
- **Pre-audit FIRST:** pull `sitemap_index.xml` + GSC Pages CSV; record per post the exact URL/slug/canonical/title/meta/date/featured image/terms; **confirm permalink structure** (`/%postname%/` → root `/[slug]`; never silently add `/blog/`).
- **Script** `dashboard/scripts/migrate-wp.ts` (`tsx`): idempotent `prisma.article.upsert({ where:{slug} })` — never touch `slug`/`publishedAt` on re-run. Map REST→Article (`he.decode` titles, `cheerio` content rewrite, `sanitize-html`, `date_gmt`→publishedAt with `Z`, `status:'published'`, `wordpressPostId`/`wordpressUrl`, classify `comparisonType` heuristic + CSV report for human review). Packages: `he`, `cheerio`, `turndown`(opt), `sanitize-html`, `p-limit`.
- **Images:** download featured + in-content `<img>` → Vercel Blob (or `public/images/migrated/<id>/`); `cheerio` rewrites `src`, strips `srcset/sizes`, keeps `alt`, adds `loading=lazy`; rewrite internal links to relative paths. Never hotlink WP uploads (die on decommission).
- **Frontend post:** `dynamicParams=false` for the strict migrated set (or `true` with denylist for mixed); self-referential canonical; **regenerate fresh JSON-LD** (never copy Yoast's blob — dead WP IDs/authors).
- **Cutover:** migrate→verify in public API → deploy to **preview domain**, QA all 20 (render/meta/images/Rich Results) → DNS switch (keep WP reachable ~48h for image re-pulls) → confirm no Disallow, self-canonicals, all 20 = 200, redirects = 301 → submit sitemap + Request-Index top URLs. **Don't** use GSC Change-of-Address (domain unchanged).
- **Verify (+3/+7/+14 days):** Screaming Frog old-vs-new (200s, single-hop 301s, zero unexpected 404, self-canonical, indexable); diff canonicals/titles; watch GSC for "Crawled-not-indexed"/"Duplicate-chose-different-canonical"/soft-404; track position vs baseline (cliff = bug).

---

## Performance / Core Web Vitals

Budgets (p75 mobile): **LCP ≤ 2.0s**, **CLS ≤ 0.05**, **INP ≤ 150ms**. JS budget **≤130KB gzip First Load** for `/` and `/[slug]`.

- **`next.config.mjs`:** images `formats:[avif,webp]`, `remotePatterns` (blob + legacy WP), `deviceSizes/imageSizes`, `minimumCacheTTL`; `experimental.optimizePackageImports:['lucide-react','framer-motion','date-fns']` (highest-leverage flag); `compress`, `poweredByHeader:false`.
- **Images (`SmartImage`):** always intrinsic `width/height` or `fill`+aspect parent; `priority` on **exactly one** image per route (hero/featured) — multiple compete and hurt LCP; `sizes` mandatory; `quality={70}`; blur placeholder above-fold (LQIP from dashboard); decorative blobs = CSS/SVG not `<img>`. Migrated `contentHtml` `<img>` rewritten at enrich-time with dimensions + lazy.
- **Fonts:** `next/font` self-host, `display:swap`, `adjustFontFallback`, only used weights, no `@import`/icon fonts.
- **JS/animation:** one animation lib (Framer) + scoped GSAP; prefer CSS for cheap animations; animate only transform/opacity; `next/dynamic` below-fold (StatsCounter, StoryViewer on tap, Comments, parallax) with height-reserving skeletons; keep hero non-dynamic.
- **INP:** small client islands; debounce search 150ms; `startTransition`/`requestIdleCallback` for tabs/filters; ads `afterInteractive`, analytics `lazyOnload`; no sync localStorage in render paths.
- **CLS:** reserve every ad container `min-height`; no in-page Auto Ads; ads between content (never above LCP); aspect wrappers for embeds.
- **Rendering:** posts SSG+ISR (`generateStaticParams` + `revalidate:3600` + on-publish webhook over short intervals); tag CMS fetches; home/category ISR; static about/contact; 301s in `next.config redirects()` (edge, no JS); tight middleware matcher.
- **Measurement/CI:** `<SpeedInsights/>` + `<Analytics/>`; Lighthouse CI gate (`@lhci/cli`) on `/`, a post, a category, mobile+desktop (perf≥0.9, LCP≤2500, CLS≤0.1, TBT≤200); bundle-budget assertion; `@next/bundle-analyzer` (dev) for regressions.

---

## Analytics

- **GA4** via `@next/third-parties` `<GoogleAnalytics>` (production only; auto SPA page_view — turn OFF GA4 enhanced "page changes" to avoid double-count); Consent Mode v2 default `beforeInteractive` shim.
- **Typed events** (`lib/analytics.ts`, snake_case, registered as Key Events): `scroll_depth` (IO sentinels 25/50/75/100), `ad_impression`/`ad_click`, `story_open/view/complete`, `comment_submit`, `newsletter_signup`, `outbound_click`, `internal_search`, `related_post_click`, `web_vitals`.
- **Vercel** `@vercel/analytics` + `@vercel/speed-insights` (CWV field data = ranking source of truth; pipe vitals to GA4 via `useReportWebVitals`).
- **GSC:** URL-prefix property, DNS or `metadata.verification.google`; submit both sitemaps; Inspect+Request-Index the 20 on day 1; weekly monitor "not indexed" reasons + single-hop 301s.
- **Sentry** (`@sentry/nextjs` wizard): `tracesSampleRate:0.1`, replay-on-error, `tunnelRoute:'/monitoring'`, `global-error.tsx`, ignore AdSense/ResizeObserver noise, alert → `musab@cgheven.com`.
- **KPI feedback loop:** Vercel Cron (`0 7 * * *`) → dashboard `/api/cron/sync-analytics` (`googleapis`: GSC + GA4 + AdSense) upserts `AnalyticsSnapshot` per article. `/dashboard/kpi` page (server component, Prisma `groupBy` WoW deltas, recharts sparklines, "20 Legacy Posts" filtered view) + weekly email digest. Scoreboard: organic clicks/impressions (7d), avg position (all + 20), indexed count, sessions, CWV pass %, AdSense revenue/RPM, scroll-75% rate, story completion, error rate. Prefer free GSC `avgPosition`; add paid rank tracker only for daily keyword sets.

---

## Phased Build Roadmap

Ordered so the team can start coding immediately. Phases 0–2 unblock everything.

### Phase 0 — Diagnose & decide (Days 1–7, parallel)
Secure GSC/Bing; export WP URLs + 16-mo GSC data; run diagnosis decision tree → `migration/diagnosis.md`. **Crawl live site to lock URL pattern** (root vs `/blog/`, trailing slash). Seed `AnalyticsSnapshot` baseline for the 20. File reconsideration if manual action. **Deliverable:** verdict + locked URL strategy + redirect plan.

### Phase 1 — Foundations & contracts (unblocks all frontend work)
Scaffold Next 15 (`--src-dir`); `globals.css` `@theme`/tokens + `lib/cn.ts` + fonts; `tailwind.config.ts`; `next.config.mjs`; `lib/content.ts` types + Zod `schemas.ts` + **MDX fallback + 1 fixture per content type**; `lib/nav.ts`; env wiring; providers (Lenis + GSAP bridge + QueryClient + LazyMotion); motion tokens + wrappers (`Reveal`/`Stagger`/`Counter`/`Parallax`/`Marquee`/`ScrollProgress`). **Deliverable:** buildable app with zero dashboard dependency.

### Phase 2 — Dashboard backend (parallel to Phase 1)
**Migrate dashboard to Postgres.** Add `/api/public` to middleware allowlist. Schema additions (`updatedAt`, image fields, `Category`, `Author`, `WebStory/StoryPage`, `Comment`, `categoryId/authorId`, `faqJson/sources/reviewedBy`). `lib/public-serializer.ts` + `content-utils.ts` + `sanitize-html`. Build the `/api/public/*` routes (posts/slugs/manifest/categories/authors/web-stories/comments/trending/sitemap-data). Publish webhook → frontend `/api/revalidate`. Image-render+store + LQIP pipeline. **Deliverable:** live public API serving published content.

### Phase 3 — Migration (after Phase 2 API)
`scripts/migrate-wp.ts` (idempotent upsert, image re-host, classification CSV for review). Verify 20 in public API. **Deliverable:** 20 posts in DB with preserved slugs/dates/images.

### Phase 4 — Design system & shell
UI primitives (Button/Card/Badge/Pill/SectionHeading/Container/Section/SmartImage); cards (DestinationCard/PostCard/StoryBubble/StoryRow/SearchBar/StatBlock/AdSlot); `(site)/layout.tsx` chrome (Header/HeaderClient/Footer/Breadcrumbs); mobile AppShell + BottomTabBar + MobileTopBar + SearchOverlay + PullToRefresh. **Deliverable:** navigable shell on all breakpoints.

### Phase 5 — Single post (priority page)
`(site)/[slug]/page.tsx` + enrich/sanitize/TOC/FAQ pipeline + `PostBody` parser + `PostHero`/`TableOfContents`/`Callout`/`ShareBar`/`AuthorBox`/`ReadingProgressBar`; `generateMetadata` + Article/Breadcrumb/FAQ JSON-LD; per-post OG; SegmentedTabs mobile. **Deliverable:** the 20 posts render perfectly with correct SEO signals.

### Phase 6 — Home + discovery + archives
Home sections + animations; hubs (`/destinations`,`/transport`,`/stays`) + `/blog` + pagination + `/tags/[tag]`; RelatedPosts/TrendingRail/TagChips/ContextualLinks; Pagefind search (`/search` + SearchClient + `postbuild` index). **Deliverable:** full content browsing + internal-link mesh.

### Phase 7 — Web Stories
`WebStory/StoryPage` API consumption; AMP route handler (validator + Rich Results); `/web-stories` hub + `web-stories/sitemap.ts` (`image:image`); StoryBubbleRow + StoryViewer + deep-link. **Deliverable:** indexable stories + on-site viewer.

### Phase 8 — Monetization, engagement, supporting pages
AdSense (`AdSenseScript`/`AdSlot`/`injectAds`/`ads.txt`/consent); Comments (model + write/read/moderation + RSC section); Contact (server action + Resend + spam); About + `/authors/[slug]` (E-E-A-T); legal pages; newsletter. **Deliverable:** monetized, interactive, policy-complete site.

### Phase 9 — SEO/perf/analytics hardening + launch
`sitemap.ts`/`robots.ts` (env-gated)/`rss.xml`; `not-found`/`error`/`global-error`; GA4 + Vercel Analytics + Speed Insights + Sentry; KPI cron + `/dashboard/kpi`; PWA. **Pre-launch QA gate** (all routes `index,follow`; every old URL 200/301; self-canonicals; CWV budgets; AMP/Rich Results pass). Deploy to preview → QA the 20 → DNS cutover → submit sitemaps + Request-Index → 404 watchdog. **Deliverable:** live site.

### Phase 10 — Recovery operations (ongoing, Days 31–90+)
Drive indexation; refresh the 20; complete Destinations cluster; scale 2–5/week pillar-by-pillar; track `AnalyticsSnapshot`; earn backlinks; weekly KPI review.

---

## What I Need From You (the Owner)

**Blocking — needed Day 1:**
- [ ] **Google Search Console** access (verify `https://` + Domain properties; DNS access to add TXT). Export 16-month Performance → Pages/Queries CSV.
- [ ] **Live WordPress access** — REST API reachable (or admin to confirm), and confirmation of the **permalink structure + trailing-slash** for the 20 posts. A WXR export (`Tools → Export → Posts`) as backup.
- [ ] **Confirm the exact live URL of 2–3 known ranking posts** (so we lock root-level vs `/blog/` and trailing slash before building routes).

**Needed before backend (Phase 2):**
- [ ] Decision/budget to **migrate the dashboard DB to Postgres** (Neon/Supabase recommended) and host both apps on Vercel.
- [ ] **Image hosting** choice (Vercel Blob recommended) + `BLOB_READ_WRITE_TOKEN`.

**Needed before monetization/analytics (Phase 8–9):**
- [ ] **AdSense:** publisher ID (`ca-pub-XXXX`), the 5 manual ad-unit slot IDs (created in AdSense UI), confirmation `ads.txt` can be served at apex. Enable Anchor/Vignette + GDPR/US-states messaging in the AdSense UI.
- [ ] **GA4** Measurement ID + a service account (Viewer in GA4, restricted user in GSC) for KPI sync; AdSense API OAuth/refresh token (or accept manual RPM entry).
- [ ] **Sentry** DSN + auth token (or approval to create the project).
- [ ] **Resend** account + domain DNS verification (SPF/DKIM) + contact inbox address; **Upstash Redis** + **hCaptcha** + **Akismet** keys for comments/forms.

**Brand & content assets:**
- [ ] **Logo** (square ≥512px PNG for Article/AMP publisher logo + horizontal for header), favicon, PWA icons source (192/512/maskable).
- [ ] **Brand confirmation** — sign-off on the violet→pink→coral palette + Plus Jakarta Sans/Inter type, or supply preferred fonts/colors.
- [ ] **Author identities** — real name(s), photos, bios, credentials (years/countries/expertise), social links, and a designated reviewer for "Fact-checked by". At least one real founder/author persona is non-negotiable for E-E-A-T.
- [ ] **Trust badges** (TripAdvisor/Booking "as featured" SVGs) if you have rights; otherwise we omit.
- [ ] **Social handles** (Facebook, Instagram, X) for `sameAs` + footer + contact.
- [ ] **Legal copy** decisions — privacy policy, terms, affiliate/ad disclosure, cookie policy (we can draft from templates; you approve).
- [ ] **Newsletter provider** (if any) or confirm we stub it for now.

**Decisions to confirm:**
- [ ] Premoderation vs auto-publish-clean for comments.
- [ ] Whether any of the 20 posts changed slugs (so we map 301s) vs all stay identical.
- [ ] Realistic-expectations sign-off: 90 days = re-indexation + 20 recovered + 10–40k/mo; 6–12 months toward prior peaks, contingent on quality-gated publishing.
