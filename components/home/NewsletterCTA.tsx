"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { subscribeNewsletter } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isLoading = status === "loading";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;

    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await subscribeNewsletter(value);
      if (res.ok) {
        setStatus("success");
        setMessage("You're in! ✦");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="newsletter" className="py-12 sm:py-24">
      <Container>
        <div
          data-reveal="zoom"
          className="relative overflow-hidden rounded-5xl bg-brand-gradient text-white px-6 py-12 text-center shadow-glow sm:px-8 sm:py-14"
        >
          <div
            className="blob absolute -top-24 -right-16 h-72 w-72 bg-white/20"
            aria-hidden="true"
          />
          <div
            className="blob absolute -bottom-28 -left-20 h-72 w-72 bg-white/10"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get the best trips in your inbox
            </h2>
            <p className="mt-4 text-base text-white/80 sm:text-lg">
              One thoughtful travel guide a week. No spam.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 flex flex-col items-stretch gap-3 sm:mx-auto sm:max-w-lg sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") {
                    setStatus("idle");
                    setMessage("");
                  }
                }}
                disabled={isLoading}
                aria-invalid={status === "error"}
                className="w-full flex-1 rounded-full bg-surface px-6 py-3.5 text-ink-900 placeholder:text-ink-400 shadow-soft outline-none ring-2 ring-transparent transition focus-visible:ring-white/70 disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "btn inline-flex items-center justify-center gap-2 rounded-full bg-brand-900 px-7 py-3.5 font-semibold text-white shadow-soft transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-70",
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    <span>Subscribing…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" aria-hidden="true" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </form>

            <p
              aria-live="polite"
              role="status"
              className={cn(
                "mt-4 min-h-[1.5rem] text-sm font-medium transition",
                status === "success" && "text-white",
                status === "error" && "text-coral-100",
                (status === "idle" || status === "loading") && "text-transparent",
              )}
            >
              {message}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
