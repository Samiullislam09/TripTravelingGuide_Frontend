# Top 20 earners: the daily rewrite queue

**Written 18 July 2026.** One page per day, in this order. Every row below is a
page that **really earned money** on this site (GA4 + AdSense, 19 Jun 2022 to
16 Jul 2026). Nothing here is estimated.

Governed by `WRITING_RULES.md`. **Rule 0 first: no revenue number on this page
justifies fabricating anything.** Every draft lands `pending_review`.
Companion file: `REVIVAL_PLAN.md` (the why). This file is the *what, in order*.

---

## Read this before you write a single line

You asked for articles written **"like I went there and this is what I faced"**.

We cannot do that for places we have not been. Google's spam policy lists
**invented experience** next to invented prices and invented credentials, and
`WRITING_RULES.md` §3 bans it outright. Faking "I stood at the Costco Travel
desk" or "I drove through the Virginia snow" is the exact class of thing that
demoted this site. Rule 0 says stop.

**What we do instead, and it scores the same "E":**

| Fake experience (banned) | Real experience (do this) |
|---|---|
| "When I visited Costco Travel..." | "I priced the same 7-night Alaska sailing on Costco Travel and on the cruise line direct on 18 Jul 2026. Here is both screens." |
| "I saw 8 inches fall in Richmond" | "I pulled Richmond's 30-year NWS snowfall record. Here is what a normal winter actually looks like, decade by decade." |
| "The staff told me..." | "I called Cordelia's booking line on 17 Jul. They said X. Their own PDF says Y. The two do not match." |

**First-hand does not mean travelled. It means we did something a rehash-writer
did not.** We checked the source. We ran the numbers. We found the contradiction.
We screenshotted the page on a dated day. That is original work, it is provable,
and it is what the top results are missing. Every article below must carry at
least one of these, named out loud in the text.

---

## Slug rule

You want the **same slug**, and on equity you are right: the old URL holds
whatever links and history exist. So:

- Slug is **already evergreen** (no year in it) → **reuse it exactly.**
- Slug is **date-stamped** (`...-2023-2024`) → **new evergreen slug + 301 from
  the old one.** The 301 hands over the equity, and we stop minting one URL per
  season, which is what grew this into 126 near-duplicate snow pages and got us
  flagged. Then we **update that one page every autumn** forever.

All old slugs below are the real ones, recovered from the Wayback CDX index
(972 archived URLs, pulled 17 Jul 2026).

---

## Web Stories: we have 22, and almost none cover the money

`lib/web-stories.ts` holds 22 AMP stories. **20 of them are India ship/cruise
content**, which is our *worst* earner at $1 to $2 RPM. Only one snow story
exists (`pittsburgh-winter-forecast-2024-2025`) and Pittsburgh is not in the top
20. Only **2 of the top 20 earners have a story at all**.

So the story queue is upside down. Each rewritten page below gets a matching
5-page Web Story **built the same day as the article**, using our own hosted
cover image, not Unsplash.

---

## The queue

`Rev` = lifetime revenue. `RPM` = revenue per 1,000 views. `Story` = does an AMP
Web Story exist today.

### Tier 1 — the four that made 40% of all revenue (days 1 to 4)

| # | Target keyword | Working title | Old slug | Slug to publish on | Rev | RPM | Story |
|---|---|---|---|---|---|---|---|
| 1 | virginia snow predictions | Virginia Snow Forecast: What an El Nino Winter Actually Means | `snow-predictions-for-virginia-2023-2024/` | `virginia-snow-predictions/` **+301** | **$279** | $8.1 | **No** |
| 2 | tennessee snow predictions | Tennessee Snow: The 30-Year Record and This Winter's Outlook | `snow-predictions-for-tennessee-2023-2024/` | `tennessee-snow-predictions/` **+301** | $226 | $7.9 | **No** |
| 3 | georgia snow predictions | Does It Snow in Georgia? What the Records and the CPC Say | `snow-predictions-for-georgia-2023-2024/` + `-2024-2025/` | `georgia-snow-predictions/` **+301 x2** | $225 | $7.5 | **No** |
| 4 | nc / north carolina snow predictions | North Carolina Snow Forecast: Mountains vs Coast | `snow-predictions-for-nc-2023-2024/` | `north-carolina-snow-predictions/` **+301** | $174 | $8.2 | **No** |

All four are **south-eastern US** and all four are **gone from the database** (lost
in the WordPress migration). This is also the region where an El Nino winter
genuinely differs from a La Nina one, so there is a real story to tell in 2026-27
that nobody rehashing an almanac will tell correctly.

**Snippet target for all four:** the question *"does it snow in [state]?"* answered
in the first 45 words with a real number from the NWS record. Then a table of
average seasonal snowfall by city. Then the honest line the whole SERP is missing:
*nobody can give you a seasonal snowfall total in advance, and anyone printing one
is guessing.*

### Tier 2 — live pages, fix in place (days 5 to 7)

| # | Target keyword | Working title | Slug (keep as-is) | Rev | RPM | Story |
|---|---|---|---|---|---|---|
| 5 | check passenger list on a flight | Can You Check the Passenger List on a Flight? | `how-can-i-check-the-passenger-list-on-an-airplane/` | $184 | $5.2 | **No** |
| 7 | kochi to lakshadweep ship ticket price | Kochi to Lakshadweep Ship Ticket Price and Permit | `kochi-to-lakshadweep-ship-ticket-price/` | $139 | $1.1 | **Yes** |
| 17 | india to sri lanka ship ticket price | India to Sri Lanka by Ship: Fares and Current Status | `india-to-sri-lanka-ship-ticket-price/` | $23 | $1.1 | **Yes** |

#5 is our **biggest live earner** and it is flagged `needsRewrite`. It is also a
privacy-law question with a clean, verifiable, genuinely useful answer (no, and
here is why: DPA / GDPR / airline policy). Highest-value single day on this list.

#7 and #17 get rewritten **for the reader, not for revenue.** #7 is the biggest
page in site history (128,985 views) and earned $139. Do not build more of this.

### Tier 3 — restore and consolidate (days 8 to 10)

| # | Target keyword | Working title | Slug | Rev | RPM | Story |
|---|---|---|---|---|---|---|
| 16 | pennsylvania snow predictions | Pennsylvania Snow Forecast and Seasonal Averages | `pennsylvania-snow-predictions/` (already evergreen, **restore**) | $23 | $7.6 | No |
| 9 | maryland snow predictions | Maryland Snow: Baltimore, DC Suburbs, Western Ridges | `maryland-snow-predictions/` **+301** | $54 | $7.7 | No |
| 14 | snow forecast united states | US Winter Snow Outlook: A State-by-State Hub | `snow-forecast-united-states/` **+301** | $24 | $6.8 | No |

#14 becomes the **hub**: it links down to every state page and each state links
back up. That kills the orphan problem the old snow cluster had.

Also already evergreen and restorable as-is: `snow-predictions-for-wisconsin/`.

### Tier 4 — blocked, small, or skipped

| # | Page | Rev | RPM | Decision |
|---|---|---|---|---|
| 2 | Costco Travel Cruises | **$244** | **$74.1** | **BLOCKED on research.** See below. |
| 8 | Red Bull Soapbox Race 2024 | $121 | $3.7 | Event content, dies yearly. Low priority. |
| 10 | Copa America 2024 | $40 | $5.9 | **Skip.** Not travel. |
| 11 | Snow Prediction Toronto | $29 | $4.9 | Later, after the US states land. |
| 12 | Kentucky snow predictions | $28 | $6.4 | Later. |
| 13 | ride a passenger on a cargo ship | $25 | **$10.7** | Live. Interesting RPM, tiny traffic. Later. |
| 15 | Red Bull Soapbox Race 2025 | $24 | $5.7 | Live. Leave alone. |
| 18 | dubai to pakistan by ship | $21 | $5.9 | Live, carries `Ship Ownar` fabrication markers. Rewrite or prune. |
| 19 | Florida snowfall prediction | $16 | $5.6 | Later. |
| 20 | Home | $15 | $2.1 | n/a |

---

## Costco: the $74 page, and why it is not day one

RPM $74.06 is **17x site average** and the #2 revenue page we ever had, off only
3,289 views. US audience, high commercial intent, advertisers paying for people
about to book a cruise. It is the most valuable single lead in the whole dataset.

**And the version that earned it was flagged `repeated identical prices (likely
fabricated table)`.** Part of that $244 was built on made-up numbers. Costco
Travel also puts real pricing behind a membership login, so we may not be able to
source prices at all.

**The question that has to be answered before a word is written: what can we say
about Costco Travel Cruises that is verifiable without a membership?** Likely
honest angles, all checkable on public pages: how the membership requirement
works, the Costco Shop Card benefit, how their cancellation terms compare, what is
and is not included.

**If the honest version needs prices we cannot verify, we do not write it.**
$74 RPM is exactly the size of bait that gets a site to fabricate. Rule 0 wins.

Slug when it clears: `costco-travel-cruises-2023-2024/` → 301 → `costco-travel-cruises/`.

---

## The daily routine

For each article, in one sitting:

1. **Research first.** Pull the primary source (NWS/NOAA record, airline policy,
   official operator PDF). Save what you pulled and the date you pulled it.
2. **Find the original element.** The number nobody else ran, the contradiction
   nobody else caught, the screenshot nobody else took. If you cannot find one,
   the page is not ready. Do not write it anyway.
3. **Snippet block first.** Direct answer in 40 to 55 words, right under the H1.
4. **Question H2s.** One comparison table. A real FAQ (H3 question, one-paragraph
   answer) so `extractFaq` emits FAQPage schema.
5. **Draft as `pending_review`.** Never publish from a script.
6. **Human read-through**, fact-check every number against the saved source.
7. **Publish, then build the Web Story** the same day, own image, links to the guide.
8. **Add the 301** to `next.config.mjs` in the same commit as the new slug.
9. Ping IndexNow.

**Pace: one per day, max 5 published per week.** That is a deliberate ceiling.
Ten genuinely better pages beat a hundred, and a post count as a target is the
scaled-content-abuse policy by definition.

---

## Honest expectation

These twenty pages made **$1,912 of $2,226, which is 86% of everything this site
has ever earned.** Rebuilding them well is the single highest-value content work
available.

But they earned in a **pre-HCU world**, and the site-level suppression is still
switched on. Rebuilding them does not flip it back by itself. This is the content
half of the recovery. The other half is time and a core update.

---

## Progress

- [ ] Day 1 — Virginia + 301 + story
- [ ] Day 2 — Tennessee + 301 + story
- [ ] Day 3 — Georgia + 2x 301 + story
- [ ] Day 4 — North Carolina + 301 + story
- [ ] Day 5 — Passenger list (rewrite in place) + story
- [ ] Day 6 — Kochi to Lakshadweep (rewrite in place, story exists)
- [ ] Day 7 — India to Sri Lanka (rewrite in place, story exists)
- [ ] Day 8 — Pennsylvania restore + story
- [ ] Day 9 — Maryland + 301 + story
- [ ] Day 10 — US hub + internal link pass
- [ ] Blocked — Costco research
- [ ] Pending — GSC export (Queries + Pages, 16 months) to confirm current positions
