// Local fallback content so the frontend builds and previews WITHOUT the CMS.
// Once the dashboard exposes /api/public, the client in lib/content/index.ts
// prefers live data and only falls back to these. Two posts intentionally
// model the hybrid strategy: one high-RPM USA post, one South-Asia cash-cow.

import type { Post } from "@/lib/types";

const editorial = {
  name: "TripTravelingGuide Editorial Team",
  slug: "editorial",
  bio: "Travel writers and trip planners covering destinations across North America, Asia, and beyond.",
  image: "/author.jpg",
  url: "/about",
};

export const samplePosts: Post[] = [
  {
    slug: "banff-vs-jasper-which-canadian-rockies-trip",
    title: "Banff vs Jasper: Which Canadian Rockies Trip Is Right for You?",
    metaTitle: "Banff vs Jasper: Which to Visit in 2026 (Honest Guide)",
    metaDescription:
      "Banff vs Jasper compared for US and Canadian travelers — cost, crowds, wildlife, hikes, and the best season for each. A clear pick for your Rockies trip.",
    focusKeyword: "banff vs jasper",
    excerpt:
      "Both are stunning, but they suit very different trips. Here's the honest breakdown on cost, crowds, drives, and which one fits your travel style.",
    contentHtml: `
      <p>If you're planning a Canadian Rockies trip, you've probably narrowed it down to Banff or Jasper. Both are world-class — but they reward very different kinds of travelers.</p>
      <h2>Quick verdict</h2>
      <p><strong>Choose Banff</strong> for easy access, turquoise lakes, and a lively town. <strong>Choose Jasper</strong> for wilder, quieter landscapes and better odds of seeing wildlife.</p>
      <h2>Cost comparison</h2>
      <table class="comparison-table">
        <thead><tr><th>Factor</th><th>Banff</th><th>Jasper</th></tr></thead>
        <tbody>
          <tr><td>Avg. hotel / night</td><td>$220 USD</td><td>$160 USD</td></tr>
          <tr><td>Crowds (summer)</td><td>Very high</td><td>Moderate</td></tr>
          <tr><td>Nearest airport</td><td>Calgary (90 min)</td><td>Edmonton (4 hr)</td></tr>
        </tbody>
      </table>
      <h2>Which one should you choose?</h2>
      <p>First-time visitors who want iconic views with minimal driving should start with Banff. Travelers chasing solitude and wildlife should pick Jasper.</p>
    `,
    coverImage: "https://picsum.photos/seed/banff-rockies/1200/800",
    coverAlt: "Turquoise lake and snow-capped peaks in Banff National Park",
    author: editorial,
    category: { name: "Destinations", slug: "destinations" },
    tags: ["banff", "jasper", "canadian rockies", "canada travel"],
    faq: [
      {
        question: "Is Banff or Jasper better for first-time visitors?",
        answer:
          "Banff is better for first-timers — it's closer to Calgary airport, has more lodging, and the famous lakes are easy to reach.",
      },
      {
        question: "Which is cheaper, Banff or Jasper?",
        answer:
          "Jasper is generally cheaper for lodging and is far less crowded, though it requires more driving to reach.",
      },
    ],
    publishedAt: "2026-05-12T09:00:00.000Z",
    updatedAt: "2026-06-10T09:00:00.000Z",
    readingMinutes: 8,
    featured: true,
    region: "usa-canada",
  },
  {
    slug: "kochi-to-lakshadweep-ship-ticket-price",
    title: "Kochi to Lakshadweep Ship Ticket Price (2026): Fares, Times & Booking",
    metaTitle: "Kochi to Lakshadweep Ship Ticket Price 2026 — Full Guide",
    metaDescription:
      "Updated Kochi to Lakshadweep ship ticket prices, ship names, travel times, and how to book your permit and passage for 2026.",
    focusKeyword: "kochi to lakshadweep ship ticket price",
    excerpt:
      "Current ship fares from Kochi to Lakshadweep, journey times, and the exact booking + permit steps so you don't get stuck at the port.",
    contentHtml: `
      <p>Ships from Kochi to Lakshadweep are the most affordable way to reach the islands. Here are the current fares, timings, and the booking steps for 2026.</p>
      <h2>Ship fares at a glance</h2>
      <table class="comparison-table">
        <thead><tr><th>Class</th><th>Approx. fare (one way)</th><th>Journey time</th></tr></thead>
        <tbody>
          <tr><td>Bunk class</td><td>₹2,200</td><td>14–18 hours</td></tr>
          <tr><td>First class cabin</td><td>₹7,500</td><td>14–18 hours</td></tr>
        </tbody>
      </table>
      <h2>How to book + permit</h2>
      <p>You'll need an entry permit before boarding. Apply through the official Lakshadweep administration portal and carry valid ID.</p>
    `,
    coverImage: "https://picsum.photos/seed/lakshadweep-ship/1200/800",
    coverAlt: "Passenger ship approaching a Lakshadweep island lagoon",
    author: editorial,
    category: { name: "Transport", slug: "transport" },
    tags: ["lakshadweep", "kochi", "ship ticket", "india travel"],
    faq: [
      {
        question: "How much is the Kochi to Lakshadweep ship ticket?",
        answer:
          "Bunk class is around ₹2,200 one way, while a first-class cabin is around ₹7,500 one way for 2026.",
      },
      {
        question: "Do I need a permit for Lakshadweep?",
        answer:
          "Yes. All visitors need an entry permit from the Lakshadweep administration before boarding the ship.",
      },
    ],
    publishedAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-06-15T09:00:00.000Z",
    readingMinutes: 7,
    featured: true,
    region: "south-asia",
  },
  {
    slug: "how-to-visit-mackinac-island",
    title: "How to Visit Mackinac Island: A Complete First-Timer's Guide",
    metaDescription:
      "Everything you need to plan a Mackinac Island trip — ferries, no-car rules, where to stay, what to eat, and the best things to do.",
    focusKeyword: "how to visit mackinac island",
    excerpt:
      "Ferries, the no-cars rule, fudge, and the best things to do — a complete first-timer's guide to Michigan's car-free island.",
    contentHtml: `
      <p>Mackinac Island is one of the most unique getaways in the US Midwest — no cars allowed, just bikes, horses, and fudge.</p>
      <h2>Getting there</h2>
      <p>Take a ferry from Mackinaw City or St. Ignace. The crossing takes about 20 minutes.</p>
      <h2>Best things to do</h2>
      <ul><li>Bike the 8-mile shoreline loop</li><li>Visit Fort Mackinac</li><li>Try the island's famous fudge</li></ul>
    `,
    coverImage: "https://picsum.photos/seed/mackinac-island/1200/800",
    coverAlt: "Victorian buildings and bicycles on car-free Mackinac Island",
    author: editorial,
    category: { name: "Destinations", slug: "destinations" },
    tags: ["mackinac island", "michigan", "usa travel"],
    publishedAt: "2026-03-20T09:00:00.000Z",
    readingMinutes: 6,
    region: "usa-canada",
  },
];
