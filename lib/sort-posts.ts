import type { PostSummary } from "@/lib/types";

export type SortKey = "latest" | "oldest" | "popular";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "latest", label: "Latest" },
  { key: "oldest", label: "Oldest" },
  { key: "popular", label: "Popular" },
];

// Client-side sort for the card listings. "Popular" uses the same no-analytics
// heuristic as the server helper (featured first, then longer reads) so the two
// stay consistent until real GA4/GSC data is wired.
export function sortPosts(posts: PostSummary[], sort: SortKey): PostSummary[] {
  const arr = [...posts];
  switch (sort) {
    case "oldest":
      return arr.sort(
        (a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt),
      );
    case "popular":
      return arr.sort((a, b) => {
        const af = a.featured ? 1 : 0;
        const bf = b.featured ? 1 : 0;
        if (bf !== af) return bf - af;
        return (b.readingMinutes ?? 0) - (a.readingMinutes ?? 0);
      });
    case "latest":
    default:
      return arr.sort(
        (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
      );
  }
}
