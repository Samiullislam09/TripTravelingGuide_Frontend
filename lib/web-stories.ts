import { site, absoluteUrl } from "@/lib/site";

// Real Google Web Stories (AMP). Each story is a standalone /web-stories/<slug>
// AMP page (rendered by app/web-stories/[slug]/route.ts) that Google can index in
// the Stories experience, Discover, and Images. Every story maps to one of the
// rewritten guides and links back to it.

export interface WebStoryPage {
  image: string; // Unsplash photo base URL (no query)
  alt: string;
  kicker?: string;
  heading: string;
  text?: string;
}

export interface WebStory {
  slug: string; // == the AMP page slug
  postSlug: string; // the guide it links to
  title: string;
  description: string;
  pages: WebStoryPage[];
  /**
   * Editorial rank for the home page's "Popular" filter (1 = show first).
   * This is a hand-picked order, NOT measured traffic: GA4/GSC are still empty,
   * so there is no real pageview signal to sort by yet. Swap this for actual
   * analytics once they report, and keep the label honest until then.
   */
  popularRank?: number;
}

const U = "https://images.unsplash.com/photo-";

export const webStories: WebStory[] = [
  {
    slug: "kochi-to-lakshadweep-ship-ticket-price",
    postSlug: "kochi-to-lakshadweep-ship-ticket-price",
    popularRank: 3,
    title: "Kochi to Lakshadweep by Ship",
    description:
      "Ship fares from Kochi to Lakshadweep, the entry permit you need, and how to book.",
    pages: [
      { image: U + "1572431447238-425af66a273b", alt: "Lakshadweep island lagoon", kicker: "Ship Travel", heading: "Kochi to Lakshadweep by Ship", text: "Fares, the permit you need, and how to book." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Turquoise sea in Lakshadweep", kicker: "Ticket price", heading: "From ₹2,200 per person", text: "A second-class seat is the cheapest way across. Cabins run ₹3,500 to ₹6,000 by ship." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Boat on clear water", kicker: "Do not skip this", heading: "You need an entry permit", text: "Every non-islander needs a permit before boarding. Apply well ahead of travel." },
      { image: U + "1572431447238-425af66a273b", alt: "Lakshadweep beach", kicker: "Plan it right", heading: "Best time to sail", text: "Seas are calmest from October to May. Avoid the rough monsoon months." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Lakshadweep lagoon", kicker: "Full guide", heading: "See every ship and fare", text: "Prices, the permit, and how to book, all in one guide." },
    ],
  },
  {
    slug: "how-to-visit-vantara-step-by-step-guide",
    postSlug: "how-to-visit-vantara-step-by-step-guide",
    popularRank: 6,
    title: "Visiting Vantara, Jamnagar",
    description:
      "The real 2026 status of Vantara in Jamnagar, who can visit, and why there are no public tickets.",
    pages: [
      { image: U + "1500614922032-b6dd337b1313", alt: "Elephant in the wild", kicker: "Jamnagar", heading: "Visiting Vantara", text: "The honest 2026 status before you plan." },
      { image: U + "1524309199871-1817307e6d36", alt: "Elephant close up", kicker: "Important", heading: "Not open to the public yet", text: "As of 2026 there is no public ticket counter and no online booking." },
      { image: U + "1695339060174-7bdca449f485", alt: "Wildlife in a sanctuary", kicker: "What it is", heading: "A 3,000-acre rescue centre", text: "A Reliance animal rescue and rehabilitation home, not a zoo or theme park." },
      { image: U + "1500614922032-b6dd337b1313", alt: "Elephant", kicker: "Stay safe", heading: "Ignore fake ticket sites", text: "No official price has been announced. Do not pay any third-party ticket site." },
      { image: U + "1524309199871-1817307e6d36", alt: "Elephant portrait", kicker: "Full guide", heading: "Read the real 2026 status", text: "Who can visit now, and how to know when it opens." },
    ],
  },
  {
    slug: "how-to-get-permission-to-visit-isro-sriharikota",
    postSlug: "how-to-get-permission-to-visit-isro-sriharikota",
    title: "Watch a Rocket Launch at Sriharikota",
    description:
      "How to register for the free Launch View Gallery at ISRO Sriharikota and watch a launch.",
    pages: [
      { image: U + "1517976487492-5750f3195933", alt: "Rocket launching", kicker: "ISRO Sriharikota", heading: "Watch a Rocket Launch", text: "From the Launch View Gallery at Sriharikota." },
      { image: U + "1614728263952-84ea256f9679", alt: "Rocket lifting off", kicker: "Good news", heading: "It is completely free", text: "The space centre does not charge to watch a launch from the gallery." },
      { image: U + "1628126235206-5260b9ea6441", alt: "Night rocket launch", kicker: "How to", heading: "Register a few days before", text: "Sign up on the official Launch View Gallery portal. Seats fill up fast." },
      { image: U + "1517976487492-5750f3195933", alt: "Rocket on the pad", kicker: "Who can go", heading: "Indian citizens with photo ID", text: "Carry a valid government ID that matches your registration." },
      { image: U + "1628126235206-5260b9ea6441", alt: "Rocket launch trail", kicker: "Full guide", heading: "All the registration steps", text: "The portal, the documents, and how to reach Sriharikota." },
    ],
  },
  {
    slug: "how-to-visit-marble-palace-kolkata",
    postSlug: "how-to-visit-marble-palace-kolkata",
    title: "Marble Palace, Kolkata",
    description:
      "Marble Palace Kolkata is free to visit with a permit. Timings, permit steps, and rules.",
    pages: [
      { image: U + "1569564161148-5c34311fa682", alt: "Kolkata heritage architecture", kicker: "Kolkata", heading: "Marble Palace", text: "A 19th-century marble mansion, free to visit." },
      { image: U + "1768099476169-1f4fb3b517fd", alt: "Heritage building facade", kicker: "The catch", heading: "Free, but you need a permit", text: "Get a free permit 24 hours ahead from the West Bengal Tourism bureau." },
      { image: U + "1767803556286-f484d1ebb9a9", alt: "Old mansion in Kolkata", kicker: "Timings", heading: "10 AM to 4 PM", text: "Closed on Mondays and Thursdays. Plan around those days." },
      { image: U + "1569564161148-5c34311fa682", alt: "Kolkata heritage", kicker: "Inside", heading: "No photography allowed", text: "It is a private residence, so you get an escorted, camera-free tour." },
      { image: U + "1767803556286-f484d1ebb9a9", alt: "Kolkata mansion", kicker: "Full guide", heading: "How to get your permit", text: "The steps, timings, and what to see inside." },
    ],
  },
  {
    slug: "how-to-visit-burj-khalifa-for-free",
    postSlug: "how-to-visit-burj-khalifa-for-free",
    popularRank: 4,
    title: "See Burj Khalifa for Free",
    description:
      "You cannot go up Burj Khalifa for free, but here are the best free views and the fountain show.",
    pages: [
      { image: U + "1512453979798-5ea266f8880c", alt: "Burj Khalifa at dusk", kicker: "Dubai", heading: "See Burj Khalifa for Free", text: "The best free views and the fountain show." },
      { image: U + "1582672060674-bc2bd808a8b5", alt: "Burj Khalifa tower", kicker: "Be honest", heading: "You cannot go up for free", text: "The observation deck always needs a paid ticket." },
      { image: U + "1634007626524-f47fa37810a7", alt: "Dubai skyline", kicker: "Free views", heading: "Fountain promenade and Burj Park", text: "Both give a full view of the tower at no cost. Souk Al Bahar bridge is the best photo spot." },
      { image: U + "1512453979798-5ea266f8880c", alt: "Burj Khalifa lit up", kicker: "Free show", heading: "The Dubai Fountain", text: "Runs free every 30 minutes, roughly 6 PM to 11 PM." },
      { image: U + "1634007626524-f47fa37810a7", alt: "Dubai skyline at night", kicker: "Full guide", heading: "All the free viewpoints", text: "Every free spot to see the tower and the show." },
    ],
  },
  {
    slug: "india-to-sri-lanka-ship-ticket-price",
    postSlug: "india-to-sri-lanka-ship-ticket-price",
    title: "India to Sri Lanka by Ferry",
    description:
      "The one real passenger ferry from India to Sri Lanka, its fare, timings, and how to book.",
    pages: [
      { image: U + "1683043430721-f4a25e539cd5", alt: "Passenger boat on a calm sea", kicker: "India to Sri Lanka", heading: "The Ferry to Sri Lanka", text: "The one real passenger service, and how to take it." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Open sea horizon", kicker: "The route", heading: "Nagapattinam to Kankesanthurai", text: "A fast ferry to Jaffna, about 110 km and 3 to 4 hours." },
      { image: U + "1518623489648-a173ef7824f3", alt: "Aerial view of an island in blue sea", kicker: "Ticket price", heading: "From about ₹5,000 one way", text: "Economy around ₹5,000, premium around ₹7,500, plus tax." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Boat on clear water", kicker: "Before you sail", heading: "Carry a passport and visa", text: "It is an international crossing, so you need a valid passport and Sri Lanka visa." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Turquoise sea", kicker: "Full guide", heading: "Fares, timings and booking", text: "Everything to plan the crossing, and where to book." },
    ],
  },
  {
    slug: "mangalore-to-lakshadweep-ship-ticket-price",
    postSlug: "mangalore-to-lakshadweep-ship-ticket-price",
    title: "Mangalore to Lakshadweep by Ship",
    description:
      "The Mangalore to Lakshadweep ship, MV Minicoy to Kadmat, the permit you need, and how to book.",
    pages: [
      { image: U + "1518623489648-a173ef7824f3", alt: "Aerial island in turquoise sea", kicker: "Mangalore to Lakshadweep", heading: "Sailing to Lakshadweep", text: "The ship from Mangalore, and how it works." },
      { image: U + "1572431447238-425af66a273b", alt: "Lakshadweep lagoon", kicker: "The ship", heading: "MV Minicoy to Kadmat", text: "From the Old Mangalore Port, around 14 hours across the sea." },
      { image: U + "1518623489648-a173ef7824f3", alt: "Island beach from above", kicker: "Ticket price", heading: "Fares are fixed by class", text: "A second-class seat is cheapest and cabins cost more. Confirm at the counter." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Boat on clear water", kicker: "Do not skip this", heading: "You need an entry permit", text: "Every non-islander needs a permit before boarding. Apply well ahead." },
      { image: U + "1572431447238-425af66a273b", alt: "Lakshadweep beach", kicker: "Full guide", heading: "Distance, fares and booking", text: "How the route works and where to book." },
    ],
  },
  {
    slug: "cordelia-cruise-mumbai-to-lakshadweep-price",
    postSlug: "cordelia-cruise-mumbai-to-lakshadweep-price",
    title: "Cordelia Cruise to Lakshadweep",
    description:
      "What the Cordelia cruise from Mumbai to Lakshadweep costs, what's included, and how to book.",
    pages: [
      { image: U + "1548574505-5e239809ee19", alt: "Cruise ships at a tropical port", kicker: "Mumbai to Lakshadweep", heading: "The Cordelia Cruise", text: "India's own cruise to the Lakshadweep islands." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Turquoise island sea", kicker: "The trip", heading: "A 4-night island cruise", text: "Sail from Mumbai to islands like Kavaratti, Kalpeni and Kadmat." },
      { image: U + "1548574505-5e239809ee19", alt: "Cruise ship deck", kicker: "The price", heading: "It depends on your cabin", text: "Interior cabins are cheapest, suites the priciest. Fares move with the season." },
      { image: U + "1572431447238-425af66a273b", alt: "Lakshadweep lagoon", kicker: "Included", heading: "Meals and shows on board", text: "Your cabin, meals and entertainment are included; excursions and drinks cost extra." },
      { image: U + "1548574505-5e239809ee19", alt: "Cruise ship at sea", kicker: "Full guide", heading: "Costs, itinerary and booking", text: "What it really costs and how to book officially." },
    ],
  },
  {
    slug: "best-airlines-travel-internationally-business-class-to-australia",
    postSlug: "best-airlines-travel-internationally-business-class-to-australia",
    title: "Business Class to Australia",
    description:
      "The best airlines for business class to Australia, what each does best, and how to find a fare.",
    pages: [
      { image: U + "1436491865332-7a61a109cc05", alt: "Airplane wing above the clouds", kicker: "Business Class", heading: "Flying to Australia in Style", text: "The airlines that do the long haul best." },
      { image: U + "1556388158-158ea5ccacbd", alt: "Airliner coming in to land", kicker: "Top pick", heading: "Qatar Airways Qsuite", text: "A private suite with a door, widely rated the best business seat." },
      { image: U + "1569154941061-e231b4725ef1", alt: "Wide-body jet on the tarmac", kicker: "Also great", heading: "Singapore, Emirates, Qantas", text: "Singapore for service, Emirates for the A380 bar, Qantas for non-stop flights." },
      { image: U + "1436491865332-7a61a109cc05", alt: "View from an aircraft window", kicker: "Save money", heading: "Book early and use points", text: "Fares swing with the season, and miles stretch furthest in business class." },
      { image: U + "1556388158-158ea5ccacbd", alt: "Aircraft landing at dusk", kicker: "Full guide", heading: "Every airline compared", text: "What each does best and how to find a good fare." },
    ],
  },
  {
    slug: "cargo-ship-price-in-indian-rupees",
    postSlug: "cargo-ship-price-in-indian-rupees",
    title: "What a Cargo Ship Costs",
    description:
      "How much a cargo ship costs in Indian rupees, by type, with new versus used prices.",
    pages: [
      { image: U + "1578575437130-527eed3abbec", alt: "Container ship loading at a port", kicker: "Cargo Ships", heading: "What a Cargo Ship Costs", text: "The real price, in dollars and rupees." },
      { image: U + "1494412519320-aa613dfb7738", alt: "Aerial view of a container yard", kicker: "The range", heading: "A few million to $300M+", text: "Most working ships cost $20M to $150M, roughly ₹170 to ₹1,275 crore." },
      { image: U + "1578575437130-527eed3abbec", alt: "Cargo ship with containers", kicker: "By type", heading: "Container, bulk and tanker", text: "A large container ship runs $60M to $110M; an LNG carrier around $190M." },
      { image: U + "1494412519320-aa613dfb7738", alt: "Shipping containers stacked at a port", kicker: "Why in dollars", heading: "Ships trade in US dollars", text: "A rupee price is just the dollar price at today's exchange rate." },
      { image: U + "1578575437130-527eed3abbec", alt: "Container ship at dock", kicker: "Full guide", heading: "Prices by ship type", text: "New versus used, and what moves the market." },
    ],
  },
  {
    slug: "chennai-to-andaman-ship-ticket-price",
    postSlug: "chennai-to-andaman-ship-ticket-price",
    title: "Chennai to Andaman by Ship",
    description:
      "How the Chennai to Port Blair government ship works in 2026 — fares, sailing time, and booking.",
    pages: [
      { image: U + "1684334919617-df67b48b3371", alt: "Passenger ferry crossing the sea", kicker: "Ship Travel", heading: "Chennai to Andaman by Ship", text: "Fares, the 2.5-day crossing, and how to book." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Turquoise sea near the Andaman Islands", kicker: "Ticket price", heading: "Bunk to Deluxe cabin", text: "The 2026 DSS schedule runs roughly ₹4,100 to ₹16,000 one way. Confirm the live fare." },
      { image: U + "1684334919617-df67b48b3371", alt: "Government passenger ship at sea", kicker: "Who runs it", heading: "A government ship, not a cruise", text: "The Directorate of Shipping Services operates the mainland sailings to Port Blair." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Open sea on the way to Andaman", kicker: "Plan ahead", heading: "Sailings every 10–15 days", text: "Departures are infrequent and sell out. Book as early as the counter allows." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Andaman island lagoon", kicker: "Full guide", heading: "Fares, classes and booking", text: "Everything you need before you sail to Port Blair." },
    ],
  },
  {
    slug: "vizag-to-andaman-ship-ticket-price",
    postSlug: "vizag-to-andaman-ship-ticket-price",
    title: "Vizag to Andaman by Ship",
    description:
      "The Visakhapatnam to Port Blair ship for 2026 — fares, the long crossing, and how to book.",
    pages: [
      { image: U + "1707584189430-9677d21a4704", alt: "Large passenger ferry at sea", kicker: "Ship Travel", heading: "Vizag to Andaman by Ship", text: "Fares, sailing time, and where to book." },
      { image: U + "1707584189430-9677d21a4704", alt: "Passenger ship crossing the ocean", kicker: "Ticket price", heading: "Bunk to Deluxe cabin", text: "The 2026 DSS schedule runs roughly ₹4,100 to ₹17,500 one way. Always confirm the fare." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Open ocean between Vizag and Port Blair", kicker: "Be ready", heading: "The longest crossing", text: "Vizag to Port Blair takes about 56–60 hours — around two and a half days at sea." },
      { image: U + "1572431447238-425af66a273b", alt: "Andaman island shore", kicker: "Plan ahead", heading: "Only a few sailings a month", text: "The schedule, not the fare, usually decides your dates. Book early." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Turquoise Andaman waters", kicker: "Full guide", heading: "Fares, time and booking", text: "All you need for the Vizag–Andaman ship." },
    ],
  },
  {
    slug: "lakshadweep-ship-ticket-online-booking",
    postSlug: "lakshadweep-ship-ticket-online-booking",
    title: "Book a Lakshadweep Ship Online",
    description:
      "Step-by-step Lakshadweep ship ticket booking for 2026 — the portal, the permit, and the ships.",
    pages: [
      { image: U + "1572025310208-2fd6b91764c1", alt: "Aerial view of a Lakshadweep island and lagoon", kicker: "Lakshadweep", heading: "Book a Ship Online", text: "The portal, the permit, and how to plan." },
      { image: U + "1572431447238-425af66a273b", alt: "Lakshadweep beach and reef", kicker: "Do this first", heading: "You need an entry permit", text: "Every visitor needs a SPORTS entry permit, tied into the booking system." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Boat on clear Lakshadweep water", kicker: "How to", heading: "Register and choose your island", text: "Sign up with Aadhaar, pick a route like Kochi–Kavaratti, then a ship and class." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Lakshadweep lagoon from above", kicker: "Don't wait", heading: "Book 3–4 months ahead", text: "Berths are limited and sell out fast in the October–May season." },
      { image: U + "1572431447238-425af66a273b", alt: "Lakshadweep island", kicker: "Full guide", heading: "Every step to book", text: "The official portal, the permit, ships and fares." },
    ],
  },
  {
    slug: "statue-of-unity-ticket-prices-2024",
    postSlug: "statue-of-unity-ticket-prices-2024",
    title: "Statue of Unity Tickets",
    description:
      "Statue of Unity ticket types and prices for 2026 — entry, viewing gallery, timings and booking.",
    pages: [
      { image: U + "1642841819300-20ed449c02a1", alt: "The Statue of Unity beside the Sardar Sarovar Dam", kicker: "Gujarat", heading: "Statue of Unity Tickets", text: "Ticket types, prices and how to book for 2026." },
      { image: U + "1598435006252-3f2499fad7e1", alt: "The Statue of Unity seen from below", kicker: "The choice", heading: "Entry vs Viewing Gallery", text: "Basic entry is about ₹150; the viewing-gallery ticket is around ₹350 for adults." },
      { image: U + "1615033321768-6eaef881fc81", alt: "Full view of the Statue of Unity", kicker: "The highlight", heading: "153 metres up", text: "The viewing gallery inside the statue looks over the dam, the Narmada and the hills." },
      { image: U + "1642841819300-20ed449c02a1", alt: "Statue of Unity and the river valley", kicker: "Note", heading: "Closed on Mondays", text: "Plan around the Monday closing day, except on national holidays." },
      { image: U + "1598435006252-3f2499fad7e1", alt: "The Statue of Unity", kicker: "Full guide", heading: "Book on soutickets.in", text: "Ticket types, timings and the official portal." },
    ],
  },
  {
    slug: "sundarban-national-park-entry-fee",
    postSlug: "sundarban-national-park-entry-fee",
    title: "Sundarban Entry Fees",
    description:
      "Sundarban National Park entry fee for 2026 — park fee, boat and guide charges, and the permit.",
    pages: [
      { image: U + "1661707744987-57711014b7fa", alt: "Boat cruising past mangroves in the Sundarban", kicker: "West Bengal", heading: "Sundarban Entry Fees", text: "What you really pay to visit the mangrove delta." },
      { image: U + "1661707744987-57711014b7fa", alt: "Mangrove creek in the Sundarban", kicker: "The fee", heading: "₹60 for Indians", text: "The park entry fee is small — about ₹60 for Indians and ₹200 for foreign nationals." },
      { image: U + "1562975444-d910f117a84f", alt: "A Royal Bengal tiger", kicker: "The extras", heading: "Boat and guide add up", text: "Boat, per-person forest entry and a compulsory guide are charged on top, per day." },
      { image: U + "1661707744987-57711014b7fa", alt: "Sundarban mangrove waterway", kicker: "Required", heading: "Permit, boat and guide", text: "No one enters the core forest without a valid permit, a registered boat and a guide." },
      { image: U + "1562975444-d910f117a84f", alt: "Tiger in the forest", kicker: "Full guide", heading: "All the charges explained", text: "Fees, permit and why most people book a package." },
    ],
  },
  {
    slug: "mumbai-to-lakshadweep-cruise-price-2024",
    postSlug: "mumbai-to-lakshadweep-cruise-price-2024",
    title: "Mumbai to Lakshadweep Cruise",
    description:
      "The Mumbai to Lakshadweep cruise for 2026 — real fares, the ships, the season and the permit.",
    pages: [
      { image: U + "1572431447238-425af66a273b", alt: "Aerial view of a Lakshadweep coral island and lagoon", kicker: "Cruise", heading: "Mumbai to Lakshadweep", text: "What it really costs, and the permit to sort first." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Turquoise Lakshadweep lagoon", kicker: "The fare", heading: "No single price", text: "Per person swings from ~₹36,000 for a basic cabin to well over ₹75,000 in peak season." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Boat on clear Lakshadweep water", kicker: "Who runs it", heading: "Cordelia Cruises", text: "Seasonal round trips on the Empress and newer Sky, mostly from Mumbai, some from Kochi." },
      { image: U + "1572431447238-425af66a273b", alt: "Lakshadweep island shore", kicker: "Do this first", heading: "The permit is a must", text: "Even Indians need an entry permit at epermit.utl.gov.in. Rules eased from April 2026." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Lakshadweep sea from above", kicker: "Full guide", heading: "Fares, ships and booking", text: "The season, the permit and how to book it right." },
    ],
  },
  {
    slug: "best-places-to-visit-in-lakshadweep",
    postSlug: "best-places-to-visit-in-lakshadweep",
    popularRank: 5,
    title: "Best Islands in Lakshadweep",
    description:
      "Which Lakshadweep islands to visit in 2026 — Agatti, Bangaram, Kadmat, Kavaratti and Minicoy, plus the permit.",
    pages: [
      { image: U + "1572431447238-425af66a273b", alt: "Aerial view of a Lakshadweep coral island", kicker: "Lakshadweep", heading: "Best Islands to Visit", text: "Only a handful are open. Here's how they compare in 2026." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Turquoise Lakshadweep lagoon", kicker: "The gateway", heading: "Agatti & Bangaram", text: "Agatti has the only airport and a stunning lagoon. Bangaram is the quiet, resort-only hideaway." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Boat on clear Lakshadweep water", kicker: "For divers", heading: "Kadmat & Kavaratti", text: "Kadmat is the diver's pick for its reef and wreck. Kavaratti is the lively capital with culture too." },
      { image: U + "1572431447238-425af66a273b", alt: "Lakshadweep island shore", kicker: "Do this first", heading: "You need a permit", text: "Every non-islander, Indians included, needs an entry permit at epermit.utl.gov.in." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Lakshadweep sea from above", kicker: "Full guide", heading: "Pick the right island", text: "Diving, honeymoon or culture, matched to the island, plus how to get there." },
    ],
  },
  {
    slug: "festivals-of-andaman-and-nicobar-islands",
    postSlug: "festivals-of-andaman-and-nicobar-islands",
    title: "Festivals of the Andamans",
    description:
      "The festivals of the Andaman and Nicobar Islands in 2026 — when they happen and which ones you can attend.",
    pages: [
      { image: U + "1715940093974-8836926f3f41", alt: "A traditional outrigger boat on an Andaman beach", kicker: "Andaman & Nicobar", heading: "Festivals of the Andamans", text: "When to go, and which celebrations you can actually attend." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Turquoise Andaman sea", kicker: "The big one", heading: "Island Tourism Festival", text: "The flagship festival runs 5–15 January 2026, with the traditional Nicobari Hodi boat race." },
      { image: U + "1715940093974-8836926f3f41", alt: "Local boat on an island lagoon", kicker: "Same month", heading: "Subhash Mela, 23 Jan", text: "Marking Netaji Subhash Chandra Bose's birthday with culture, exhibitions and sport." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Boat on clear tropical water", kicker: "Respect this", heading: "Tribal festivals are off-limits", text: "Indigenous rituals in the protected tribal reserves are not tourist events. Read, don't intrude." },
      { image: U + "1684334919617-df67b48b3371", alt: "Passenger ferry crossing the sea", kicker: "Full guide", heading: "Plan around a festival", text: "Dates, venues and how to reach Port Blair by air or ship." },
    ],
  },
  {
    slug: "kochi-to-maldives-cruise-2024",
    postSlug: "kochi-to-maldives-cruise-2024",
    title: "Kochi to Maldives Cruise",
    description:
      "Cordelia's new Kochi to Maldives cruise from October 2026 — route, fares, dates and what to pack.",
    pages: [
      { image: U + "1514282401047-d79a71a590e8", alt: "Overwater villas in a Maldives lagoon", kicker: "New for 2026", heading: "Kochi to Maldives Cruise", text: "Cordelia's first-ever international sailing from Kochi." },
      { image: U + "1514282401047-d79a71a590e8", alt: "Turquoise Maldives lagoon from above", kicker: "The route", heading: "Kochi, Male, Colombo", text: "The Empress starts sailing this route on 25 October 2026, taking in the Maldives and Sri Lanka." },
      { image: U + "1683043430721-f4a25e539cd5", alt: "Boat on clear tropical water", kicker: "Two options", heading: "5-night or a weekend", text: "A 5-night Sunday-to-Friday sailing, or a shorter 2-night weekend taster." },
      { image: U + "1572025310208-2fd6b91764c1", alt: "Clear tropical sea", kicker: "Don't forget", heading: "It's international now", text: "You need a passport, plus a Sri Lanka ETA. Indians usually get Maldives visa on arrival." },
      { image: U + "1514282401047-d79a71a590e8", alt: "Maldives overwater resort", kicker: "Full guide", heading: "Fares and how to book", text: "What's included, what's not, and where to book direct." },
    ],
  },
  {
    slug: "pittsburgh-winter-forecast-2024-2025",
    postSlug: "pittsburgh-winter-forecast-2024-2025",
    title: "Pittsburgh Winter 2026-2027",
    description:
      "What to expect from Pittsburgh's winter in 2026-2027, driven by a strengthening El Nino.",
    pages: [
      { image: U + "1611317621952-8317fc747166", alt: "A snow-covered city street during a snowfall", kicker: "Winter 2026-2027", heading: "Pittsburgh's Winter Outlook", text: "One signal is doing most of the talking this year: El Nino." },
      { image: U + "1609650793481-55b352ac866a", alt: "A snowy street lined with glowing lamps at night", kicker: "The driver", heading: "A strengthening El Nino", text: "NOAA expects El Nino present and strengthening through winter, at 97-99% confidence." },
      { image: U + "1611317621952-8317fc747166", alt: "Snow falling on a quiet city street", kicker: "What it means", heading: "Leaning milder", text: "El Nino usually pushes the storm track south, favouring near-to-below-normal snow here." },
      { image: U + "1609650793481-55b352ac866a", alt: "Heavy snowfall on a city path", kicker: "But", heading: "One storm can flip it", text: "A single well-placed system can still dump heavy snow. It's a lean, not a lock." },
      { image: U + "1611317621952-8317fc747166", alt: "Winter in the city", kicker: "Full guide", heading: "Averages and how to prep", text: "Pittsburgh's normal snowfall, what the almanacs say, and a simple prep checklist." },
    ],
  },
  {
    slug: "cordelia-cruise-price",
    postSlug: "cordelia-cruise-price",
    popularRank: 1,
    title: "Cordelia Cruise Price 2026",
    description:
      "What a Cordelia cruise really costs in 2026: fares by cabin and route, hidden charges, and how to book.",
    pages: [
      { image: U + "1580541631950-7282082b53ce", alt: "Aerial view of a cruise ship docked at a tropical island pier", kicker: "India's cruise line", heading: "What a Cordelia cruise costs", text: "Fares start around Rs 16,000 per person for a 2-night interior cabin, twin-sharing." },
      { image: U + "1599640842225-85d111c60e6b", alt: "A large white cruise ship beside a turquoise beach", kicker: "By cabin", heading: "Interior to Suite", text: "Interior is cheapest; ocean view, balcony and suites cost a lot more, per person." },
      { image: U + "1580541631950-7282082b53ce", alt: "Cruise ship at a tropical island", kicker: "By route", heading: "Goa to Lakshadweep", text: "A weekend to Goa is cheap. Lakshadweep and the Maldives run into lakhs per person." },
      { image: U + "1599640842225-85d111c60e6b", alt: "Cruise ship on a bright day at sea", kicker: "Watch out", heading: "Taxes and tips are extra", text: "Gratuities of about USD 12 a night, plus TCS, GST and port charges, sit on top of the fare." },
      { image: U + "1580541631950-7282082b53ce", alt: "Cruise ship near a palm-lined shore", kicker: "Before you book", heading: "Check the live fare", text: "Prices change daily. Confirm the current price on the official site, then read our full guide." },
    ],
  },
  {
    slug: "cordelia-cruise-food-dining",
    postSlug: "cordelia-cruise-food-dining",
    popularRank: 2,
    title: "Cordelia Cruise Food & Dining",
    description:
      "What food is free on a Cordelia cruise and what costs extra: buffet meals, drinks, veg and Jain options.",
    pages: [
      { image: U + "1580541631950-7282082b53ce", alt: "Aerial view of a cruise ship docked at a tropical island pier", kicker: "On board", heading: "Cordelia Cruise Food", text: "What's included in your fare, and what you pay extra for." },
      { image: U + "1599640842225-85d111c60e6b", alt: "A large white cruise ship beside a turquoise beach", kicker: "Included", heading: "Your buffet meals are free", text: "Breakfast, lunch, high tea, dinner and a midnight snack at the Starlight and Food Court restaurants." },
      { image: U + "1580541631950-7282082b53ce", alt: "Cruise ship at a tropical island", kicker: "Costs extra", heading: "Drinks aren't included", text: "Every drink is paid, even water beyond your cabin bottle. The two specialty restaurants cost extra too." },
      { image: U + "1599640842225-85d111c60e6b", alt: "Cruise ship on a bright day at sea", kicker: "Good to know", heading: "Veg, Jain and halal", text: "A separate veg and Jain section, and no beef or pork is served anywhere on the ship." },
      { image: U + "1580541631950-7282082b53ce", alt: "Cruise ship near a palm-lined shore", kicker: "Full guide", heading: "See what's free vs paid", text: "The full food, drinks and dining breakdown before you sail." },
    ],
  },
];

export function getWebStory(slug: string): WebStory | undefined {
  return webStories.find((s) => s.slug === slug);
}

/**
 * Every story that belongs to one guide, matched on `postSlug`. This is what
 * makes the story strip under an article automatic: add a story to `webStories`
 * with the guide's slug as its `postSlug` and the section appears on that post,
 * with no per-post wiring anywhere.
 */
export function getStoriesForPost(postSlug: string): WebStory[] {
  return webStories.filter((s) => s.postSlug === postSlug);
}

// Poster / card image (portrait, sized for a story cover).
export function storyImage(base: string): string {
  return `${base}?w=720&h=1280&fit=crop&crop=entropy&q=75&auto=format`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const BOILERPLATE =
  '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>';

const CUSTOM_CSS = `
amp-story{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#fff}
amp-story-grid-layer.layer{padding:34px 26px}
.end{align-content:end;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.25) 55%,rgba(0,0,0,0) 100%)}
.center{align-content:center;justify-items:center;text-align:center;background:linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5))}
.kicker{display:inline-block;background:linear-gradient(90deg,#f97316,#ef4444);color:#fff;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;padding:6px 13px;border-radius:999px;margin-bottom:12px}
h1{font-size:30px;font-weight:800;line-height:1.15;margin:0;text-shadow:0 2px 12px rgba(0,0,0,.5)}
h2{font-size:27px;font-weight:800;line-height:1.2;margin:0 0 8px;text-shadow:0 2px 12px rgba(0,0,0,.5)}
p{font-size:17px;line-height:1.45;margin:12px 0 0;opacity:.96;text-shadow:0 1px 8px rgba(0,0,0,.5)}
.cta{display:inline-block;background:linear-gradient(90deg,#f97316,#ef4444);color:#fff;font-weight:800;padding:13px 24px;border-radius:999px;text-decoration:none;font-size:16px}
`.trim();

function pageHtml(p: WebStoryPage, i: number, isCta: boolean, postUrl: string): string {
  const img = `<amp-story-grid-layer template="fill"><amp-img src="${esc(storyImage(p.image))}" width="720" height="1280" layout="responsive" alt="${esc(p.alt)}"></amp-img></amp-story-grid-layer>`;
  const kicker = p.kicker ? `<span class="kicker" animate-in="fly-in-bottom">${esc(p.kicker)}</span>` : "";
  const H = isCta ? "h2" : "h1";
  const text = p.text ? `<p animate-in="fly-in-bottom" animate-in-delay="0.3s">${esc(p.text)}</p>` : "";
  const layerClass = isCta ? "layer center" : "layer end";
  const body = `<amp-story-grid-layer template="vertical" class="${layerClass}"><div>${kicker}<${H} animate-in="fly-in-bottom" animate-in-delay="0.1s">${esc(p.heading)}</${H}>${text}</div></amp-story-grid-layer>`;
  const cta = isCta
    ? `<amp-story-cta-layer><a href="${esc(postUrl)}" class="cta">Read the full guide</a></amp-story-cta-layer>`
    : "";
  return `<amp-story-page id="page-${i}">${img}${body}${cta}</amp-story-page>`;
}

export function renderAmpStory(story: WebStory): string {
  const storyUrl = absoluteUrl(`/web-stories/${story.slug}/`);
  const postUrl = absoluteUrl(`/${story.postSlug}/`);
  const poster = storyImage(story.pages[0].image);
  const logo = absoluteUrl("/apple-icon.jpg"); // square publisher logo
  const pages = story.pages
    .map((p, i) => pageHtml(p, i, i === story.pages.length - 1, postUrl))
    .join("");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: storyUrl,
    headline: story.title,
    description: story.description,
    image: [poster],
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: logo },
    },
  });

  return `<!doctype html>
<html amp lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
<link rel="canonical" href="${esc(storyUrl)}">
<title>${esc(story.title)} | ${esc(site.name)}</title>
<meta name="description" content="${esc(story.description)}">
<script async src="https://cdn.ampproject.org/v0.js"></script>
<script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
${BOILERPLATE}
<style amp-custom>${CUSTOM_CSS}</style>
<script type="application/ld+json">${jsonLd}</script>
</head>
<body>
<amp-story standalone title="${esc(story.title)}" publisher="${esc(site.name)}" publisher-logo-src="${esc(logo)}" poster-portrait-src="${esc(poster)}">
${pages}
</amp-story>
</body>
</html>`;
}
