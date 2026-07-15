# Content Quality Checklist — how to write & publish a post

> Why this exists: the SEO audit (2026-07-13) found the site under a site-wide
> Helpful-Content/core quality demotion. Recovery depends on **genuinely helpful,
> verifiable, first-hand content** — not on volume, word count, or passing an
> AI-detector. This checklist is the gate every post must clear before going live.

---

## The publish flow (through the CMS dashboard — NEVER auto-publish)

Posts flow through the **triptravelguide-dashboard** CMS (separate app, `../triptravelguide-dashboard`), which reads/writes the SAME Supabase `Article` table the frontend reads. Verified working end-to-end on 2026-07-13 (create → edit → approve → publish → live on frontend).

```
AI/writer drafts the article
  → detect.mjs = STYLE check only (is it robotic?) — NOT a publish gate
  → insert into Supabase Article as status = "pending_review"  (NOT "published"),
    source = "manual", with full contentHtml + meta + cover
  → it now appears in the dashboard's Content list as a draft
  → owner opens it in the dashboard (/review/[id]): edits, verifies every fact,
    resolves any HUMAN-INPUT markers, adds ≥1 original element
  → owner clicks Approve  (server gates: no unresolved markers, wordCount ≥ 700,
    weekly cap ≤ 5) → status "approved"
  → owner clicks Publish → status "published" → live on the frontend (ISR ~5 min)
  → drip: ≤5 posts/week (enforced by the approve weekly cap)
```

**Rule:** no post goes live without the owner reviewing it in the dashboard. Direct `status:"published"` inserts (bypassing the dashboard) are **banned** — always insert as `status:"pending_review"` so it lands in the review queue. The WordPress mirror on publish is best-effort and non-blocking (the site is migrating off WP; a 403 there does not stop the article going live).

---

## The gate — Google's "Who / How / Why" (this decides publish, not the detector)

- [ ] **Who** — named author byline is visible, plus a genuine "reviewed / verified on [date]".
- [ ] **How** — every price, fare, fee, schedule, date and name is verified against a **dated official source** (e.g. cordeliacruises.com, IRCTC, the operator/govt portal) — or removed. Outbound citations added.
- [ ] **Why** — the page exists to help a real reader, not just to rank. It contains **at least one thing you cannot get from the top 3 results**.
- [ ] **Experience (E-E-A-T)** — at least one original element: an owned photo/screenshot, a price confirmed by call/booking, a first-hand observation, or a comparison table the official sources don't provide.
- [ ] **No fabrication** — the place/topic is real; nothing invented. If a fact can't be verified, it's cut, not guessed. (See the deleted "Yukevalo Island" page for what fabrication looks like.)
- [ ] **YMYL care** — for prices/tickets/safety topics, apply the highest bar: sourced, dated, caveated ("confirm the live price before booking").

---

## Format (for rankability / featured snippets)

- [ ] 700+ words as a **completeness floor** — but never pad to hit a number. (Google: "the best word count is not a thing.")
- [ ] Table/list-heavy, few long paragraphs. Comparison table for "vs / price / best"; numbered steps for "how to".
- [ ] A 40–60 word direct answer right under an H2 phrased as the question.
- [ ] FAQ block (`<h3>Q</h3><p>A</p>` pairs) → auto-emitted as FAQPage schema.
- [ ] Real cover image + descriptive alt. metaTitle ≤ 60 chars, metaDescription ≤ 155.
- [ ] Internal links to related posts; no cannibalizing an existing URL (cross-link instead).

---

## The detector's real role

`detect.mjs` (burstiness CV, tell-words, em-dashes) is a **style smell-check** to catch robotic, uniform writing. A pass (e.g. CV > 0.5) means "reads human", nothing more.

- ❌ It is NOT proof of quality, and Google does not use AI detectors.
- ❌ "100% human score" does not make a page helpful or accurate.
- ✅ Use it to improve readability, then still run the Who/How/Why gate above.

---

## ⛔ Do NOT (verified against Google docs)

- Mass AI-rewrite + auto-publish to rebuild volume (= scaled content abuse — the penalty pattern).
- Chase word count, keyword density, DA/DR, or a publishing cadence "for freshness".
- Use IndexNow / "Request indexing" to try to force *rankings* (it only affects crawling).
- Fabricate authors, testimonials, stats, prices, or places.
- Treat the AI-detector score as a quality or publish signal.
