"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { searchPosts } from "@/lib/api";
import { PostCardWide } from "@/components/post/PostCardWide";
import type { PostSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

const POPULAR_QUERIES = [
  "Beaches",
  "City breaks",
  "Hiking trails",
  "Food & culture",
  "Budget travel",
  "Hidden gems",
];

type Status = "idle" | "loading" | "done" | "error";

function readInitialQuery(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

export function SearchExperience() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<PostSummary[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  // Hydrate the query from the URL once on mount.
  useEffect(() => {
    const initial = readInitialQuery();
    if (initial) setQuery(initial);
  }, []);

  // Keep the URL (?q=) in sync without triggering a navigation.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const trimmed = query.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [query]);

  // Debounced AJAX search.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    let active = true;
    const handle = window.setTimeout(() => {
      searchPosts(trimmed)
        .then((posts) => {
          if (!active) return;
          setResults(posts);
          setStatus("done");
        })
        .catch(() => {
          if (!active) return;
          setResults([]);
          setStatus("error");
        });
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [query]);

  const trimmed = query.trim();
  const showResults = status === "done" || status === "error";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="relative"
      >
        <label htmlFor="search-input" className="sr-only">
          Search travel guides
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-400"
        >
          <Search className="h-5 w-5" />
        </span>
        <input
          id="search-input"
          ref={inputRef}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          type="search"
          inputMode="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search destinations, guides, tips…"
          aria-label="Search travel guides"
          className="w-full rounded-full border border-line bg-surface py-4 pl-14 pr-28 text-base text-ink-900 shadow-soft outline-none transition placeholder:text-ink-400 focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600/40"
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {status === "loading" ? (
            <Loader2
              aria-hidden="true"
              className="h-5 w-5 animate-spin text-brand-600"
            />
          ) : null}
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition hover:bg-surface-2 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </form>

      {/* Idle state: suggested popular queries */}
      {!trimmed ? (
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-ink-500">Popular searches</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {POPULAR_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuery(q);
                  inputRef.current?.focus();
                }}
                className="pill pill-violet transition hover:shadow-glow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Live result count for assistive tech + visible header */}
      <p aria-live="polite" role="status" className="sr-only">
        {status === "loading"
          ? "Searching"
          : showResults
            ? `${results.length} ${results.length === 1 ? "guide" : "guides"} found`
            : ""}
      </p>

      {trimmed && status !== "idle" ? (
        <div className="mt-8">
          {status === "loading" && results.length === 0 ? (
            <div
              className="flex items-center justify-center gap-3 py-16 text-ink-500"
              aria-hidden="true"
            >
              <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
              <span className="text-sm font-medium">Searching guides…</span>
            </div>
          ) : null}

          {showResults && results.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-ink-500">
                <span className="font-semibold text-ink-900">
                  {results.length}
                </span>{" "}
                {results.length === 1 ? "guide" : "guides"} for{" "}
                <span className="font-semibold text-ink-900">
                  &ldquo;{trimmed}&rdquo;
                </span>
              </p>
              <div
                data-reveal-stagger
                className="flex flex-col gap-4"
              >
                {results.map((post) => (
                  <PostCardWide key={post.slug} post={post} />
                ))}
              </div>
            </>
          ) : null}

          {status === "done" && results.length === 0 ? (
            <div
              data-reveal
              className={cn(
                "card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
              )}
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-ink-400">
                <Search className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-bold text-ink-900">
                No guides match &ldquo;{trimmed}&rdquo;
              </h3>
              <p className="max-w-sm text-sm text-ink-500">
                Try a different destination, broaden your keywords, or pick one of
                the popular searches above.
              </p>
            </div>
          ) : null}

          {status === "error" ? (
            <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center">
              <h3 className="font-display text-lg font-bold text-ink-900">
                Something went wrong
              </h3>
              <p className="text-sm text-ink-500">
                We couldn&apos;t load results just now. Please try again.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default SearchExperience;
