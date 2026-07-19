"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Globe, Loader2, X } from "lucide-react";

/**
 * On-page article translation, run entirely in the reader's browser.
 *
 * WHY IT WORKS THIS WAY (this is a Rule 0 constraint, not a preference):
 * Google's spam policies list "scaled content abuse" as including pages created
 * by automatically translating content without human review. Publishing
 * machine-translated copies of every post at their own URLs would turn ~90 pages
 * into several hundred unreviewed translated pages on a site that is already
 * under an algorithmic demotion. So this feature deliberately creates NO new
 * URLs, no alternate routes and no hreflang. It rewrites text nodes in the live
 * DOM after a click. Googlebot only ever sees the English page, because the
 * translated state exists only in one reader's tab and is never linked to.
 *
 * The engine is the browser's built-in on-device Translator API (Chrome/Edge
 * 138+). No API key, no server round-trip, no per-request cost, and the article
 * text never leaves the device. Where the API is missing we say so plainly
 * rather than silently doing nothing.
 *
 * The original English strings are kept in a WeakMap-ish parallel array so
 * switching back to English is exact, not a re-translation.
 */

type Availability = "unavailable" | "downloadable" | "downloading" | "available";

interface TranslatorInstance {
  translate: (input: string) => Promise<string>;
  destroy?: () => void;
}

interface TranslatorCtor {
  availability: (opts: {
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<Availability>;
  create: (opts: {
    sourceLanguage: string;
    targetLanguage: string;
    monitor?: (m: EventTarget) => void;
  }) => Promise<TranslatorInstance>;
}

declare global {
  interface Window {
    Translator?: TranslatorCtor;
  }
}

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "zh", label: "Chinese", native: "中文" },
];

const RTL = new Set(["ar"]);

// Text nodes shorter than this are punctuation, stray whitespace or single
// symbols. Translating them wastes calls and often returns them mangled.
const MIN_CHARS = 2;

interface Props {
  /**
   * "inline" is the card that sits in the article body. "header" is the compact
   * navbar control that takes the Subscribe button's slot on article pages.
   */
  variant?: "inline" | "header";
  /**
   * Header variant only: what to render instead when this page has no article
   * body, or the browser cannot translate on-device. Lets the navbar fall back
   * to Subscribe rather than showing a control that would do nothing.
   */
  fallback?: ReactNode;
}

export default function TranslateArticle({
  variant = "inline",
  fallback = null,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("en");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [hasArticle, setHasArticle] = useState(false);

  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  // Captured once, on first translation: the pristine English text of every
  // node we touch, so "English" restores rather than round-trips.
  const originals = useRef<{ node: Text; text: string }[] | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "Translator" in window);
  }, []);

  // Which pages get the control is decided by whether there is prose to
  // translate, not by matching route patterns. Article slugs live at the root
  // (`/costco-travel-cruises/`) alongside `/about` and `/explore`, so a path
  // test cannot tell them apart, and any allowlist would silently miss new
  // templates. Presence of `.prose-article` is the actual precondition.
  useEffect(() => {
    setHasArticle(document.querySelector(".prose-article") !== null);
    // A client-side navigation swaps the body without remounting the header, so
    // the previous page's stored originals must not leak into the next one.
    originals.current = null;
    setActive("en");
    setError(null);
  }, [pathname]);

  // Close the menu on outside click and on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const collect = useCallback(() => {
    if (originals.current) return originals.current;

    const blocks = Array.from(
      document.querySelectorAll<HTMLElement>(".prose-article"),
    );
    const found: { node: Text; text: string }[] = [];

    for (const block of blocks) {
      const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          // Never touch code samples: a translated identifier or URL is worse
          // than an untranslated one.
          if (parent?.closest("code, pre, script, style")) {
            return NodeFilter.FILTER_REJECT;
          }
          const value = node.nodeValue?.trim() ?? "";
          return value.length >= MIN_CHARS
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      });

      let n = walker.nextNode();
      while (n) {
        found.push({ node: n as Text, text: n.nodeValue ?? "" });
        n = walker.nextNode();
      }
    }

    originals.current = found;
    return found;
  }, []);

  // The disclosure has to live inside the article, not next to the control.
  // With the picker up in the navbar a reader can scroll past it in a second
  // and then be reading translated prices, cancellation windows and policy
  // quotes with nothing on screen saying the wording is machine-produced. So
  // the notice is injected at the top of the body and travels with the text.
  const setNotice = useCallback((code: string | null) => {
    const existing = document.getElementById("translation-notice");
    if (existing) existing.remove();
    if (!code) return;

    const block = document.querySelector(".prose-article");
    if (!block) return;

    const el = document.createElement("p");
    el.id = "translation-notice";
    el.lang = "en";
    el.dir = "ltr";
    el.setAttribute("role", "status");
    el.className =
      "mb-6 rounded-2xl border border-line bg-surface-2/70 px-4 py-3 text-sm text-ink-500";
    el.textContent =
      "Machine translated from English in your browser. Prices, dates and policy wording are only verified in the English original.";
    // Sibling, not first child: `.prose-article > p:first-child::first-letter`
    // is the magazine drop-cap, and it would land on this notice instead of the
    // article's opening line.
    block.parentElement?.insertBefore(el, block);
  }, []);

  const restoreEnglish = useCallback(() => {
    setNotice(null);
    for (const { node, text } of originals.current ?? []) {
      node.nodeValue = text;
    }
    document.querySelectorAll<HTMLElement>(".prose-article").forEach((el) => {
      el.removeAttribute("dir");
      el.lang = "en";
    });
    setActive("en");
    setError(null);
  }, []);

  async function translateTo(code: string) {
    setOpen(false);
    if (code === active) return;
    if (code === "en") {
      restoreEnglish();
      return;
    }
    if (!window.Translator) {
      setError("This browser cannot translate on-device yet.");
      return;
    }

    setBusy(true);
    setError(null);
    setProgress(0);

    try {
      const availability = await window.Translator.availability({
        sourceLanguage: "en",
        targetLanguage: code,
      });

      if (availability === "unavailable") {
        setError("This language is not available in your browser.");
        setBusy(false);
        return;
      }

      const translator = await window.Translator.create({
        sourceLanguage: "en",
        targetLanguage: code,
      });

      // Always translate FROM the stored English, never from whatever is
      // currently rendered. Translating an already-translated page compounds
      // errors fast.
      const nodes = collect();

      // Small concurrent batches: one call per node is too chatty on a long
      // article, and one giant call loses the node boundaries we need to write
      // the results back in place.
      const BATCH = 8;
      for (let i = 0; i < nodes.length; i += BATCH) {
        const slice = nodes.slice(i, i + BATCH);
        const out = await Promise.all(
          slice.map((item) =>
            translator.translate(item.text).catch(() => item.text),
          ),
        );
        slice.forEach((item, j) => {
          item.node.nodeValue = out[j];
        });
        setProgress(Math.round(((i + slice.length) / nodes.length) * 100));
      }

      document.querySelectorAll<HTMLElement>(".prose-article").forEach((el) => {
        el.lang = code;
        if (RTL.has(code)) el.dir = "rtl";
        else el.removeAttribute("dir");
      });

      translator.destroy?.();
      setNotice(code);
      setActive(code);
    } catch {
      setError("Translation failed. The article is unchanged.");
      restoreEnglish();
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  // Rendering nothing until the capability check has run avoids a flash of a
  // control that is about to disappear.
  if (supported === null) return variant === "header" ? <>{fallback}</> : null;

  const current = LANGUAGES.find((l) => l.code === active) ?? LANGUAGES[0];

  const menu =
    open && supported ? (
      <ul
        role="listbox"
        aria-label="Choose a language"
        className="absolute right-0 z-50 mt-2 grid w-64 grid-cols-1 gap-1 rounded-3xl border border-line bg-surface p-2 shadow-lg sm:w-72 sm:grid-cols-2"
      >
        {LANGUAGES.map((lang) => {
          const selected = lang.code === active;
          return (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => translateTo(lang.code)}
                className={`flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
                  selected
                    ? "bg-brand-600/10 font-semibold text-brand-700"
                    : "text-ink-700 hover:bg-ink-50"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate">{lang.native}</span>
                  <span className="block truncate text-xs text-ink-400">
                    {lang.label}
                  </span>
                </span>
                {selected ? (
                  <Check aria-hidden className="h-4 w-4 shrink-0" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  if (variant === "header") {
    // No prose on this page, or no on-device engine: hand the slot back so the
    // navbar shows Subscribe instead of a button that cannot do anything.
    if (!hasArticle || !supported) return <>{fallback}</>;

    return (
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={busy}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`Translate this article. Current language ${current.label}`}
          className="brand-fill inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-70 sm:px-3.5"
        >
          {busy ? (
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
          ) : (
            <Globe aria-hidden className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {busy ? (progress > 0 ? `${progress}%` : "Preparing") : current.native}
          </span>
        </button>
        {menu}
        {error ? (
          <p
            role="status"
            className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-surface px-3 py-2 text-xs text-ink-500 shadow-lg"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative my-6">
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-line bg-surface-2/60 px-4 py-3">
        <Globe aria-hidden className="h-5 w-5 shrink-0 text-brand-600" />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-900">Read in your language</p>
          <p className="text-xs leading-snug text-ink-500">
            {supported
              ? "Translated on your device. The English version stays the original."
              : "Your browser cannot translate on-device. Chrome or Edge on desktop can."}
          </p>
        </div>

        {supported ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            disabled={busy}
            aria-expanded={open}
            aria-haspopup="listbox"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-400 hover:text-brand-600 disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                {progress > 0 ? `${progress}%` : "Preparing"}
              </>
            ) : (
              <>
                {current.native}
                <span aria-hidden className="text-ink-400">
                  ▾
                </span>
              </>
            )}
          </button>
        ) : null}
      </div>

      {menu}

      {error ? (
        <p
          role="status"
          className="mt-2 flex items-center gap-2 text-xs text-ink-500"
        >
          <X aria-hidden className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
