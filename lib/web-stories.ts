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
}

const U = "https://images.unsplash.com/photo-";

export const webStories: WebStory[] = [
  {
    slug: "kochi-to-lakshadweep-ship-ticket-price",
    postSlug: "kochi-to-lakshadweep-ship-ticket-price",
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
];

export function getWebStory(slug: string): WebStory | undefined {
  return webStories.find((s) => s.slug === slug);
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
