// Renders a JSON-LD @graph into a <script type="application/ld+json"> tag.
// Server component — emitted inline in the page HTML so Google sees it on
// first crawl (no JS execution needed).

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Schema is generated server-side from trusted data; safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
