# Revival plan: rebuild what actually earned

**Written 17 July 2026, from real GA4 + AdSense exports.** This file replaces every
earlier guess about where the traffic came from.

Governed by `WRITING_RULES.md`. **Rule 0 applies to every line below: no revenue
number here justifies fabricating anything.** Drafts land `pending_review`.

---

## The numbers this plan is built on (real, not estimated)

GA4 property "Trip traveling Guide - GA4", 19 Jun 2022 to 16 Jul 2026, 929 pages:

- **Lifetime: 520,834 views, $2,225.85 revenue, $4.27 site RPM.**
- Peak day **28 Dec 2023: $43.13**. One winter (Nov 2023 to Mar 2024) carried it.
  Collapsed to ~zero mid-2024 when the HCU classification landed. Flat ever since.
- **The "3 million visits" belief was wrong by ~6x.** Real target: a few thousand
  dollars per US winter. That is achievable. Millions of visits is not, and chasing
  it is what sent us to Europe, which was never there.

AdSense by country (3y): **United States $1,787.67 (75%), RPM $9.87**. India $221.86
at **$1.06 RPM**. UK $86.76. Germany $6.41. **All Europe ~4% of revenue.**

| Cluster | Pages | Views | Revenue | RPM |
|---|---|---|---|---|
| **SNOW** | 126 | 151,741 (29%) | **$1,136 (51%)** | **$7.49** |
| SHIP | 166 | 209,497 (40%) | $556 (25%) | **$2.66** |
| OTHER | 637 | 159,596 (31%) | $533 (24%) | $3.34 |

**Snow made half the money from under a third of the traffic.** India ship content
is the opposite: `Kochi to Lakshadweep Ship Ticket Price` is the biggest page in
site history at 128,985 views and earned **$139**.

**Top 20 pages = $1,912 of $2,226 = 86% of all revenue ever.** That is the list.

---

## Same slug: yes on equity, no on dated URLs

The instinct is right: the old URLs hold whatever links and history exist, and
throwing that away is free money lost. But most top slugs are **date-stamped**
(`snow-predictions-for-virginia-2023-2024`), and reviving a 2023-24 URL in 2026 with
2026-27 content makes the URL contradict the page.

Worse, minting a new URL per season is **what built the bloat that got us flagged**:
126 snow pages, most of them near-duplicates a year apart.

**The move: one evergreen page per topic, 301 the dated ones onto it.**

```
snow-predictions-for-virginia-2023-2024/  ->  301  ->  virginia-snow-predictions/
snow-predictions-for-tennessee-2023-2024/ ->  301  ->  tennessee-snow-predictions/
snow-predictions-for-georgia-2023-2024/   ->  301  ->  georgia-snow-predictions/
snow-predictions-for-georgia-2024-2025/   ->  301  ->  georgia-snow-predictions/
```

A 301 passes the equity. The evergreen URL then gets **updated every autumn** rather
than replaced, so the cluster stops growing. `next.config.mjs` already has the
`redirects()` block and a comment marking exactly where these go.

Two old slugs are **already evergreen** and should be reused as-is:
`pennsylvania-snow-predictions/` and `snow-predictions-for-wisconsin/`.

---

## Two things that must be said before the list

**1. These pages earned in a pre-HCU world.** The revenue below is what they made
*before* the classification. Rebuilding them does not automatically return it: the
site-level suppression is still on. This is the content half of the recovery, not a
shortcut past it.

**2. They earned by fabricating, and that is why they died.** Every one of these
snow posts was an Almanac rehash; the migration flagged them for
`repeated identical prices (likely fabricated table)`. **We cannot rebuild what they
were.** We can only rebuild the *topic*, honestly:
- Cite the **NOAA CPC seasonal outlook** and say what it actually says.
- Cite historical state climatology (NOAA/NWS records) for "what a normal winter
  looks like here".
- **Never state a snowfall number we cannot source.** No invented tables. Ever.
- The model already exists and is unflagged: our live 3,358-word
  `the-two-sides-of-the-winter-2025-26-forecast-la-nina-vs-the-almanacs`.

**And the season premise changed:** La Nina is over; a strong **El Nino** is
developing for 2026-27 (NOAA CPC, ~97% into early 2027). El Nino winters look
*different* in the US south-east, which is exactly where Virginia / Tennessee /
Georgia / NC sit. That is a real, sourceable, genuinely useful story and nobody
rehashing an almanac will tell it correctly.

---

## The list: top 20 by lifetime revenue

`GONE` = never survived the WordPress migration, verified via `scripts/find-slugs.mjs`.
`PRUNED` = taken off the site 17 Jul 2026 (restorable from `scripts/backups/`).

| # | Old page | Rev | Views | RPM | State | Action |
|---|---|---|---|---|---|---|
| 1 | Snow Predictions For Virginia 2023-2024 | $279 | 34,326 | $8.1 | **GONE** | **Rebuild** → `virginia-snow-predictions/` + 301 |
| 2 | Costco Travel Cruises 2023/2024 | **$244** | 3,289 | **$74.1** | **PRUNED** | **Research first** (see below) |
| 3 | Snow Predictions For Tennessee 2023-2024 | $226 | 28,669 | $7.9 | **GONE** | **Rebuild** → `tennessee-snow-predictions/` + 301 |
| 4 | Snow Predictions For Georgia 2023-2024 | $225 | 29,889 | $7.5 | **GONE** | **Rebuild** → `georgia-snow-predictions/` + 301 |
| 5 | How Can I Check The Passenger List On an Airplane? | $184 | 35,328 | $5.2 | **LIVE, flagged** | **Rewrite in place** (slug already evergreen) |
| 6 | Snow Predictions For nc 2023-2024 | $174 | 21,291 | $8.2 | **GONE** | **Rebuild** → `north-carolina-snow-predictions/` + 301 |
| 7 | Kochi to Lakshadweep Ship Ticket Price | $139 | 128,985 | **$1.1** | LIVE, flagged | Rewrite for readers, **not** for revenue |
| 8 | Red Bull Soapbox Race 2024 | $121 | 32,918 | $3.7 | GONE (2025 ver. live) | Low priority, event content |
| 9 | Snow Predictions For Maryland 2024 | $54 | 6,955 | $7.7 | PRUNED | Fold into `maryland-snow-predictions/` |
| 10 | Copa America 2024 | $40 | 6,833 | $5.9 | GONE | **Skip** (not travel, one-off event) |
| 11 | Snow Prediction Toronto 2024 2023 | $29 | 5,869 | $4.9 | GONE | Later |
| 12 | Snow Predictions 2023 2024 Kentucky | $28 | 4,397 | $6.4 | GONE | Later |
| 13 | How Do you Ride a Passenger On a Cargo Ship 2024 | $25 | 2,362 | **$10.7** | LIVE | Interesting RPM, small. Later. |
| 14 | Snow Forecast For United States 2023-2024 | $24 | 3,585 | $6.8 | GONE | Becomes the **hub** (see below) |
| 15 | Red Bull Soapbox Race 2025 | $24 | 4,204 | $5.7 | LIVE | Leave |
| 16 | Snow Predictions Pennsylvania 2023-2024 | $23 | 3,058 | $7.6 | PRUNED | **Restore slug** (already evergreen) |
| 17 | India to Sri Lanka Ship Ticket Price | $23 | 20,098 | $1.1 | LIVE, flagged | Rewrite for readers, not revenue |
| 18 | Dubai to Pakistan By Ship Ticket Price 2024 | $21 | 3,476 | $5.9 | LIVE, flagged | Has `Ship Ownar` fabrication markers |
| 19 | Florida Snowfall Prediction 2023 2024 | $16 | 2,814 | $5.6 | GONE | Later |
| 20 | Home | $15 | 7,122 | $2.1 | LIVE | n/a |

---

## What to actually build, in order

**Phase 1: the four that made 40% of all revenue.** Virginia, Tennessee, Georgia, NC.
All south-eastern US, all `GONE`, all $7.50-8.20 RPM, and all four sit in the region
where an El Nino winter genuinely differs from a La Nina one. One evergreen page
each, plus a 301 from every dated predecessor.

Each page, honestly:
- What the **NOAA CPC outlook** actually says for this state this winter, cited.
- What a **normal** winter looks like here, from NOAA/NWS historical records.
- **What El Nino has historically meant for this state**, with the record, not a guess.
- Plainly: *"nobody can tell you the snowfall total in advance, and anyone giving you
  a number is guessing."* That contradicts the entire SERP and it is true.
- The honest disclosure: we are not meteorologists, here are the sources.

**Phase 2: `snow-forecast-united-states/` as the hub.** Was #14. Links down to each
state page; each state links up. Kills the orphan problem.

**Phase 3: Costco (see below), and only if the research clears it.**

**Not doing:** Copa America (not travel). Toronto/Kentucky/Florida (small, later).
More India ship content for revenue reasons ($1 RPM).

---

## Costco Travel Cruises: the $74 RPM page, and its catch

RPM $74.06 is **17x site average** and the #2 revenue page ever, on only 3,289 views.
Pattern: US audience + high commercial intent. Advertisers pay for people about to
buy a cruise.

**The catch, and it is serious.** The pruned post is flagged
`repeated identical prices (likely fabricated table)`. So the version that earned
$244 **was partly made up**. And Costco Travel puts real pricing behind a membership
login, which means **we may not be able to source prices at all**.

**Do not write this post until this question is answered: what can we say about
Costco Travel Cruises that is verifiable without a membership?** Likely honest
angles: how the membership requirement works, the Costco Shop Card benefit, how
their cancellation terms compare, what is included. All checkable on public pages.

**If the honest version needs prices we cannot verify, we do not write it.** $74 RPM
is exactly the size of bait that gets a site to fabricate. Rule 0 outranks it.

Same slug rule applies: `costco-travel-cruises-2023-2024/` → 301 →
`costco-travel-cruises/`.

---

## Status

- [ ] GSC export (Queries + Pages, 16mo) — tells us current positions, not just history
- [ ] Costco research: is an honest version possible without a membership?
- [ ] Virginia rebuilt + 301s added to `next.config.mjs`
- [ ] Tennessee rebuilt + 301s
- [ ] Georgia rebuilt + 301s (two old slugs fold in)
- [ ] North Carolina rebuilt + 301s
- [ ] `snow-forecast-united-states/` hub + internal links
- [ ] Pennsylvania restored (slug already evergreen)

Recovered old slugs come from the Wayback CDX index; 972 archived URLs were pulled
on 17 Jul 2026 and the snow set is confirmed against it.
