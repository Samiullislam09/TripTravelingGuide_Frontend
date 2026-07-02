// Additional local fallback posts so grids, archives, and category pages look
// full before the CMS (/api/public) is live. These supplement samplePosts and
// intentionally span varied categories and regions.

import type { Post } from "@/lib/types";

const editorial = {
  name: "TripTravelingGuide Editorial Team",
  slug: "editorial",
  image: "/author.jpg",
  url: "/about",
};

export const extraPosts: Post[] = [
  {
    slug: "best-time-to-visit-pacific-coast-highway",
    title: "Best Time to Drive the Pacific Coast Highway (Month-by-Month)",
    excerpt:
      "Fog, crowds, and closures can make or break a PCH road trip. Here's the honest month-by-month breakdown so you pick the right week to go.",
    contentHtml: `
      <p>The Pacific Coast Highway between San Francisco and San Diego is one of the world's great drives — but the experience changes dramatically with the season. Timing your trip well means clearer views, smaller crowds, and fewer surprise road closures.</p>
      <h2>The sweet-spot months</h2>
      <p>Late spring (May–June) and early fall (September–October) deliver the best balance of mild weather, lighter traffic, and clear coastal views. Summer is busy and surprisingly foggy along Big Sur, while winter brings dramatic storms and the risk of landslide closures near Bixby Creek.</p>
      <h2>What to watch for each season</h2>
      <ul>
        <li>Spring: wildflowers on the headlands, occasional rain, great waterfall flow at McWay.</li>
        <li>Summer: peak crowds and the famous coastal "June Gloom" fog until early afternoon.</li>
        <li>Fall: warmest ocean temps, clearest skies, and the easiest parking at popular pullouts.</li>
        <li>Winter: gray-whale migration offshore, but check Caltrans for Big Sur closures first.</li>
      </ul>
    `,
    coverImage: "https://picsum.photos/seed/pacific-coast-highway/1200/800",
    coverAlt: "Coastal highway curving along cliffs above the Pacific Ocean",
    author: editorial,
    category: { name: "Destinations", slug: "destinations" },
    tags: ["pacific coast highway", "california", "road trip", "usa travel"],
    publishedAt: "2026-05-28T09:00:00.000Z",
    readingMinutes: 8,
    featured: true,
    region: "usa-canada",
  },
  {
    slug: "amtrak-vs-flying-northeast-corridor",
    title: "Amtrak vs Flying the Northeast Corridor: Which Is Actually Faster?",
    excerpt:
      "Between Boston, New York, and DC, the train often beats the plane once you count security and transfers. Here's the real door-to-door math.",
    contentHtml: `
      <p>On the Northeast Corridor, the airport-versus-train debate isn't as obvious as the raw flight time suggests. Once you add airport transit, security lines, and boarding buffers, the train frequently wins on total door-to-door time.</p>
      <h2>The door-to-door math</h2>
      <p>A New York to DC flight is about 90 minutes in the air, but trains drop you in the heart of each city with no security theater. For city-center trips under 250 miles, Amtrak's Acela usually matches or beats flying once you count the full journey.</p>
      <h2>When each option wins</h2>
      <ul>
        <li>Choose the train for downtown-to-downtown trips, productive work time, and generous luggage rules.</li>
        <li>Choose to fly for longer hauls, deeply discounted fares, or when you're connecting onward.</li>
        <li>Book Acela seats early — saver fares disappear fast on weekday morning departures.</li>
        <li>Consider Northeast Regional trains for the best price-to-time value on a budget.</li>
      </ul>
    `,
    coverImage: "https://picsum.photos/seed/northeast-amtrak/1200/800",
    coverAlt: "High-speed train pulling into a busy Northeast Corridor station",
    author: editorial,
    category: { name: "Transport", slug: "transport" },
    tags: ["amtrak", "northeast corridor", "train travel", "usa travel"],
    publishedAt: "2026-04-18T09:00:00.000Z",
    readingMinutes: 6,
    region: "usa-canada",
  },
  {
    slug: "national-park-lodges-worth-booking",
    title: "9 National Park Lodges Worth Booking a Year in Advance",
    excerpt:
      "Historic park lodges sell out 12 months ahead for a reason. These are the rooms worth setting a calendar reminder — and a few smart alternatives.",
    contentHtml: `
      <p>Staying inside a national park changes the whole trip — you wake up to sunrise on the canyon rim instead of a 90-minute drive from the gate. The catch is that the best historic lodges book out a full year ahead the moment reservation windows open.</p>
      <h2>Why these rooms vanish</h2>
      <p>Park lodges have limited inventory, no new construction allowed, and demand that far outstrips supply in summer. Setting a reminder for the exact day bookings open — usually 12 to 13 months out — is the single highest-impact thing you can do.</p>
      <h2>Lodges to prioritize</h2>
      <ul>
        <li>El Tovar at the Grand Canyon's South Rim for unbeatable sunset access.</li>
        <li>Old Faithful Inn in Yellowstone for the geyser-front log atrium.</li>
        <li>Many Glacier Hotel in Glacier for the most scenic dining room in the system.</li>
        <li>Ahwahnee in Yosemite for grand 1920s architecture under the granite walls.</li>
      </ul>
    `,
    coverImage: "https://picsum.photos/seed/park-lodges/1200/800",
    coverAlt: "Historic timber national park lodge framed by mountain scenery",
    author: editorial,
    category: { name: "Food & Stays", slug: "food-stays" },
    tags: ["national parks", "lodges", "where to stay", "usa travel"],
    publishedAt: "2026-02-14T09:00:00.000Z",
    readingMinutes: 7,
    featured: true,
    region: "usa-canada",
  },
  {
    slug: "street-food-safety-tips-for-travelers",
    title: "How to Eat Street Food Abroad Without Getting Sick",
    excerpt:
      "Street food is the soul of a destination — and you can enjoy it safely. These field-tested rules keep your stomach happy from Bangkok to Mexico City.",
    contentHtml: `
      <p>Skipping street food means missing the best meals of any trip, but a bad stall can cost you two days in bed. The good news: a handful of simple, repeatable rules dramatically cut your risk while still letting you eat everywhere.</p>
      <h2>Read the stall before you order</h2>
      <p>Busy stalls with high turnover are your friend — fresh ingredients move fast and food doesn't sit. Watch whether the cook handles cash and food with the same hand, and favor anything cooked to order in front of you over pre-plated dishes.</p>
      <h2>Field-tested rules that work</h2>
      <ul>
        <li>Eat where there's a line of locals, especially families and office workers.</li>
        <li>Choose freshly grilled, fried, or boiled items served piping hot.</li>
        <li>Be cautious with raw salads, unpeeled fruit, and ice from unknown water sources.</li>
        <li>Carry rehydration salts so a rare off day doesn't derail the whole trip.</li>
      </ul>
    `,
    coverImage: "https://picsum.photos/seed/street-food-safety/1200/800",
    coverAlt: "Sizzling street food stall with a cook plating a fresh dish",
    author: editorial,
    category: { name: "Food & Stays", slug: "food-stays" },
    tags: ["street food", "travel safety", "food tips", "global travel"],
    publishedAt: "2026-03-09T09:00:00.000Z",
    readingMinutes: 6,
    region: "global",
  },
  {
    slug: "carry-on-only-packing-system",
    title: "The Carry-On-Only Packing System for Two-Week Trips",
    excerpt:
      "You can travel for two weeks out of one bag without doing laundry every night. Here's the repeatable system that makes it work.",
    contentHtml: `
      <p>Checking a bag costs time, money, and the occasional lost suitcase. With a deliberate capsule wardrobe and a simple packing method, a single carry-on can comfortably cover a two-week trip across multiple climates.</p>
      <h2>Build a capsule, not a closet</h2>
      <p>Pick one color palette so every top works with every bottom, then plan around layers instead of bulky single-purpose items. A merino base layer, a light puffy, and a packable shell handle almost any weather you'll meet.</p>
      <h2>The packing method</h2>
      <ul>
        <li>Roll soft items and use one compression cube to claw back space.</li>
        <li>Wear your heaviest shoes and jacket on travel days.</li>
        <li>Decant toiletries into 100ml bottles and ditch anything you can buy on arrival.</li>
        <li>Plan a quick sink-wash midway so you only pack about five days of clothes.</li>
      </ul>
    `,
    coverImage: "https://picsum.photos/seed/carry-on-packing/1200/800",
    coverAlt: "Neatly organized carry-on suitcase with packing cubes and rolled clothes",
    author: editorial,
    category: { name: "Tips", slug: "tips" },
    tags: ["packing", "carry-on", "travel tips", "global travel"],
    publishedAt: "2026-01-22T09:00:00.000Z",
    readingMinutes: 5,
    region: "global",
  },
  {
    slug: "avoid-foreign-transaction-fees-travel",
    title: "How to Avoid Foreign Transaction Fees on Your Next Trip",
    excerpt:
      "Card fees, bad airport exchange rates, and sneaky ATM surcharges quietly drain your budget abroad. Here's how to keep more of your money.",
    contentHtml: `
      <p>The money you lose to fees abroad rarely shows up as one big charge — it leaks out 3% at a time across every purchase and withdrawal. A little prep before you fly can easily save a few hundred dollars on a two-week trip.</p>
      <h2>Set up the right cards before you go</h2>
      <p>Carry at least one credit card with no foreign transaction fee and a debit card that reimburses ATM charges. Always pay in the local currency when a terminal asks — "dynamic currency conversion" in your home currency hides a terrible exchange rate.</p>
      <h2>Smart habits on the ground</h2>
      <ul>
        <li>Withdraw larger amounts less often to minimize per-transaction ATM fees.</li>
        <li>Use bank-affiliated ATMs and skip standalone machines in tourist zones.</li>
        <li>Never exchange cash at the airport counter — the spread is brutal.</li>
        <li>Notify your bank of travel dates so cards don't get frozen mid-trip.</li>
      </ul>
    `,
    coverImage: "https://picsum.photos/seed/foreign-transaction-fees/1200/800",
    coverAlt: "Traveler using a contactless credit card at an overseas payment terminal",
    author: editorial,
    category: { name: "Tips", slug: "tips" },
    tags: ["money", "travel fees", "budget travel", "travel tips"],
    publishedAt: "2026-06-05T09:00:00.000Z",
    readingMinutes: 6,
    region: "global",
  },
];
