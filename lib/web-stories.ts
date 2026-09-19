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

// Our own Supabase-hosted story frames, uploaded by the dashboard's
// scripts/host-images.mjs --portrait. Preferred over U for new stories.
const S =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/how-can-i-check-the-passenger-list-on-an-airplane/";

const C =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/costco-travel-cruises/";

const V =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/snow-predictions-for-virginia-2026-2027/";

// South Carolina's frames are generic but real, CC-licensed winter photographs
// (Wikimedia Commons: a snow-covered parked car, two pine-forest snow scenes,
// a snow-covered dirt road), not photos of the actual January 2026 storm: no
// CC-licensed photograph of that specific event exists on Commons yet, so we
// have not passed off a generic image as being "from" it. The story's numbers
// are all real and dated regardless of the frame art.
const SC =
  "/media/articles/snow-predictions-for-south-carolina-2026-2027/";

// Alabama's frames are generic but real, CC-licensed winter photographs
// (Wikimedia Commons), not photos of any specific Alabama storm; no
// CC-licensed photo of the January 2025 Mobile event or Winter Storm Fern
// exists on Commons yet, so nothing is passed off as being "from" either.
const AL =
  "/media/articles/snow-predictions-for-alabama-2026-2027/";

// Louisiana's frames are generic but real, CC-licensed winter photographs
// (Wikimedia Commons), not photos of the actual January 2025 Gulf Coast
// blizzard or January 2026 Winter Storm Fern; no CC-licensed photo of either
// event exists on Commons yet, so nothing is passed off as being "from" it.
const LA =
  "/media/articles/snow-predictions-for-louisiana-2026-2027/";

// The shutdown frames are real, dated photographs from the actual October 2025
// government shutdown (Wikimedia Commons, EXIF-dated): a Detroit airport
// shutdown notice, Mesa Verde's closure sign, the National Gallery of Art's
// closed notice and the WWII Memorial's closed information station. Not
// generic stock, and not the December 2026 event, which has not happened.
const GSH =
  "/media/articles/government-shutdown-holiday-travel-2026/";

// The Christmas-flights frames: three real photographs (JFK Terminal 8 departure
// hall 2024, an American 737 at O'Hare 2025, Denver security lines 2021, all
// Wikimedia Commons with licenses credited in the guide) and two original date
// cards built from Google's published low-price ranges, counted back to 2026.
const XM =
  "/media/articles/when-to-book-christmas-flights-2026/";

// Thanksgiving-flights frames: one real Wikimedia Commons photo (Austin airport
// crowd, April 2022, CC BY 4.0) and four original text/date cards built from
// Google's Thanksgiving low-price range and Points Path fare data.
const TF =
  "/media/articles/when-to-book-thanksgiving-flights-2026/";

// Flight-cancelled-by-snow frames: one real Wikimedia Commons photo (Lufthansa
// 747 snowed in at Denver gate A41, February 2016, CC BY-SA 4.0) and four original
// text cards built from 14 CFR 260.2 and 260.6 and the AP guide of 24 Jan 2026.
const FC =
  "/media/articles/flight-cancelled-due-to-snow/";

// Georgia's frames are real CC0 photographs of Georgia snow from Wikimedia
// Commons, not stock: Cherokee County 2016, Piedmont Park 2008, an Atlanta
// street after the 2014 storm, Valdosta 2025 and Fairmount 2017. The point of
// the story is how thin and patchy this snow actually is, and stock winter
// scenery would have argued the opposite.
const G =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/snow-predictions-for-georgia-2026-2027/";

// Maryland's frames are real dated photographs of Maryland snow, not stock:
// Fells Point on 7 Feb 2010 (Laura Swiecicki, CC BY 2.0), Mount Vernon on
// 4 Jan 2018 and an MTA bus the same morning (Elvert Barnes, CC BY-SA 2.0),
// Howard Street on 23 Jan 2016 (Seth Sawyers, CC BY 2.0), and NASA's MODIS
// scene of the Chesapeake under snow after the February 2010 blizzard, which
// is public domain. Credits ride in the frame text because AMP stories have
// no caption slot. The first candidate we tried, a public-domain "Deep Creek
// Lake, December 2018" shot, was dropped after opening it: no snow in frame.
const MD =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/snow-predictions-for-maryland-2026-2027/";

// North Carolina's frames are real photographs of North Carolina snow: the
// Omni Grove Park golf course in Asheville (Bill McMannis, CC BY 2.0), Sanford
// Mall at Appalachian State in Boone (Clayhefner, CC0), NASA's MODIS scene of
// the coastal plain under snow on 14 Feb 2010, Asheville during the March 1993
// Superstorm (NOAA) and the Blue Ridge Parkway's own snow warning sign (Ken
// Thomas). The MODIS frame is the whole argument of the page in one image: the
// coast white, the interior bare.
const NC =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/snow-predictions-for-north-carolina-2026-2027/";

// Colorado's frames are public-domain photographs of Colorado snow: FEMA's
// coverage of the 20 December 2006 storm (Michael Rieger), NASA's MODIS scene
// of the state with the mountains white and the plains bare, and the Flattop
// Mountain trail in Rocky Mountain National Park. The MODIS frame carries the
// page's argument: Crested Butte averages 193.7 inches and Grand Junction 17.1,
// inside one state.
const CO =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/snow-predictions-for-colorado-2026-2027/";

// The Thanksgiving frames are real photographs of US checkpoints and terminals,
// chosen so each one argues its own number: an empty Portland checkpoint for the
// quietest day of the year, a packed O'Hare concourse for the busiest. The story
// carries counts from the TSA record, never a forecast.
const TG =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/best-day-to-fly-thanksgiving/";

// The Australia frames are real photographs of the aircraft and cities the
// guide is actually about: a Qantas A380 and a United 787-9, then Melbourne and
// Sydney. The story used to run generic stock of an airplane wing and told
// readers the Qsuite was "widely rated the best business seat", which is the
// unsourced superlative the guide itself was rewritten to remove. Every frame
// now carries a number the guide can defend.
const AU =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/best-airlines-travel-internationally-business-class-to-australia/";

// Vantara is closed to the public, so no usable photography of it exists: the
// only image on Wikimedia Commons is a 525x262 shot of the elephant camp gate,
// too small for a story frame. Rather than pass off stock as Vantara, frames 2
// to 4 show the Jamnagar coast and Khijadiya, which are the places this guide
// actually sends people, and the alt text never claims otherwise.
const VN =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/how-to-visit-vantara-step-by-step-guide/";

// Lakshadweep package frames are real photos of the actual ship (M.V. Kavaratti
// at Kochi) and the islands on the Samudram itinerary (Kalpeni, Kavaratti), from
// Wikimedia Commons. Prices in the frames are the official Samudram tariff
// verified against samudram.utl.gov.in, not the inflated operator figures.
const LK =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/lakshadweep-tour-packages-from-kochi/";

// Disneyland vs Disney World frames are real CC photos of each resort's icons
// from Wikimedia Commons: Disneyland's Sleeping Beauty Castle and Radiator
// Springs Racers (California), Disney World's Cinderella Castle, EPCOT Spaceship
// Earth and Magic Kingdom Main Street (Florida). Two of each side, honestly
// labelled.
const DVW =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/disneyland-vs-disney-world/";

// The American Airlines frames are real CC photographs, and each one is the
// aircraft or the place its own frame is about: a 787-9 for the headline count,
// a 777-200ER for the Tel Aviv resumption (the type that actually flies it), an
// A321neo for the seasonal-Europe point, the Bimini shallows shot from a plane
// window for the shortest route, and Narita with Japan Airlines on the apron for
// the Chicago to Tokyo launch, which is the partnership the guide cites. Two
// earlier candidates were dropped after cropping and looking at them: a Zurich
// apron shot that turned out to carry Swissair titles (defunct since 2002, so it
// reads as an archive photo in a 2026 story) and a Philadelphia frame that was a
// close-up of identifiable baggage handlers and argued nothing about routes.
const AA =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/american-airlines-new-international-routes-2026/";

// The government-shutdown frames reuse the guide's own vetted photos, cropped
// separately to 720x1280 since Supabase ignores storyImage()'s Unsplash-only
// crop params: the Capitol (Martin Falbisoner-style shot, no people) opens and
// closes the story, the Global Entry kiosk (CBP, public domain) covers the one
// program that was actually suspended, and the Joshua Tree closure sign (NPS,
// public domain) covers parks. Only 3 source photos exist for this guide, so
// frames 4 and 5 reuse frames 1 and 2, the same pattern already used on the
// Costco and Lakshadweep-booking stories above when photo variety is limited.
const GS =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/government-shutdown-travel-2026/";

// The Royal Caribbean 2027 frames are five DISTINCT real photographs of the
// exact ships and ports the story is about, so unlike the government-shutdown
// story above there is no frame reuse here: Freedom of the Seas at Port Miami
// (Kiran891, CC BY-SA 4.0), Navigator of the Seas docked at Ensenada (Jack
// Adamenko, CC BY 4.0), Ovation of the Seas in Sydney Harbour (Dicklyon,
// CC BY-SA 4.0), Icon of the Seas under way (Chakie2, CC BY-SA 4.0) and Royal
// Caribbean's own Terminal 10 at Galveston (Larry D. Moore, CC BY 4.0).
// Ensenada is deliberate: it is one of the ports Royal Caribbean named in the
// November 2025 Los Angeles deployment it later cancelled, so frame 2 shows
// the actual ship at an actual cancelled port. Frame 3's caption says Sydney,
// not Brisbane, because that is where the photograph was taken; Ovation's 2027
// home port is Brisbane and the frame text carries that separately. Cropped to
// 720x1280 by scripts/host-images.mjs --portrait, since Supabase ignores
// storyImage()'s Unsplash-only crop params.
const RC =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/royal-caribbean-2027-cruise-changes/";

// The Pittsburgh frames are five distinct real photographs of Pittsburgh in
// winter, no reuse: snow falling on the Smithfield Street Bridge (daveynin,
// CC BY 2.0), the Duquesne Incline over an ice-choked river with the Fort Pitt
// Bridge behind it (daveynin, CC BY 2.0), a bare grey December skyline
// (Cbaile19, CC0), cars buried during the 2010 storms (Asamudra, CC BY 3.0) and
// I-376 the morning after a snowfall (daveynin, CC BY 2.0).
// Two of these are deliberate arguments rather than decoration. Frame 3 shows
// NO snow on purpose: it carries the 16.3 inch line, which is what the last
// strong El Nino winter actually looked like on the ground, and a pretty snow
// scene would have contradicted the number. Frame 4 is genuinely from the
// 2009-10 winter the frame is about, the 77.4 inch counterexample, so the
// story's own caveat is illustrated by the season that produced it.
// This story replaces a page pruned on 8 Aug 2026 whose frames quoted a 97-99%
// NOAA El Nino confidence figure that was never published; every number below
// traces to the guide, which sources each one. That dead story slug stays a 410
// in middleware.ts, and its slug differs from this one, so there is no clash.
// Cropped to 720x1280 by scripts/host-images.mjs --portrait, since storyImage()
// only appends Unsplash crop params and Supabase ignores them.
const PGH =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/pittsburgh-winter-forecast-2026-2027/";

// Texas is five real photographs of Texas winter from five different places and
// four different winters: NASA's ISS view of North Texas under snow (28 Feb
// 2013, public domain), El Paso from the air with the Franklin Mountains white
// behind it (Dicklyon, CC BY-SA 4.0), Laredo at night with snow falling through
// the palms (Miguel Angel Omana Rojas, CC BY 4.0, 8 Dec 2017), a live oak in
// Austin during Winter Storm Uri (David Kitto, CC0) and downtown Dallas in the
// same storm (Matthew T Rader, CC BY-SA 4.0, 15 Feb 2021).
// Frame 2 is a deliberate argument. It was taken on 28 December 2015, inside the
// last very strong El Nino, and El Paso is the city whose snowfall nearly triples
// in those winters, so the picture is the claim. It is a companion shot to the
// article's own El Paso body image: same photographer, same day, different
// vantage. It was still the right choice because it is natively 2270x3775, so it
// crops to 720x1280 without losing anything, and because no other El Paso snow
// photograph on Commons sits inside a super El Nino winter.
// Frame 3 is Laredo rather than Brownsville because Commons has no Brownsville
// snow photograph, and 8 Dec 2017 is the same date Corpus Christi and Brownsville
// last recorded measurable snow, so the frame is at least of the right event.
// Wikimedia Commons has no usable Amarillo or Lubbock snow photograph at all,
// which is why the Panhandle appears here only through the satellite frame. A
// Cadillac Ranch shot from a January 2016 series was rejected after looking at
// it: the whole frame is bare brown dirt with no snow anywhere in it.
// Cropped to 720x1280 by scripts/host-images.mjs --portrait, since storyImage()
// only appends Unsplash crop params and Supabase ignores them.
const TX =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/snow-predictions-for-texas-2026-2027/";

// Michigan is five real photographs from five different places and five
// different winters, and each frame is the place its own claim is about:
// Keweenaw County's roadside snow gauge on US-41 (Richie Diesterheft, CC BY 2.0,
// October 2008), the Soo Locks at Sault Ste Marie in heavy snow (US Army Corps
// of Engineers, public domain, 25 March 2015), Pentwater's main street on the
// west lakeshore (Luensu1959, CC BY-SA 4.0, 29 December 2018), the Grand River
// full of ice floes below the Grand Rapids skyline (Eric Lanning, CC BY 2.0,
// 2 February 2013) and Michigan Stadium under snow at Ann Arbor (jeff wilcox,
// CC BY 2.0, 20 February 2005).
// Frame 1 is a deliberate argument rather than scenery. The sign carries
// Keweenaw County's own numbers, a 390.4 inch record in 1978-79 against a 161.1
// inch all-time low, which is the point of the whole guide: the spread inside
// Michigan is larger than the spread any forecast is talking about. It was shot
// in October so there is no snow on the ground, and the frame text says what it
// is instead of implying otherwise.
// Frames 2 and 3 are paired on purpose. Sault Ste Marie is the north, which
// barely moves in a strong El Nino; Pentwater sits on the west lakeshore beside
// Muskegon, which loses half its snow in the same winters. Putting a lake effect
// town on both sides of that split is what breaks the standard explanation.
// Cropped to 720x1280 by scripts/host-images.mjs --portrait, since storyImage()
// only appends Unsplash crop params and Supabase ignores them.
const MI =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/snow-predictions-for-michigan-2026-2027/";

// Ohio is five real photographs from five different places and five different
// winters, and every frame is the place its own claim is about: the Harpersfield
// Covered Bridge in Ashtabula County (Andre Carrotflower, CC BY-SA 4.0,
// 16 February 2022), Chardon Square and the Geauga County Courthouse (Andre
// Carrotflower, CC BY-SA 4.0, 12 February 2020), downtown Cleveland in falling
// snow (Erik Drost, CC BY 2.0, 13 December 2017), drifts burying a Mansfield
// back garden (User OHWiki, public domain, 8 March 2008) and a Clifton street in
// Cincinnati under a thin, sunlit cover (Warren LeMay, CC0, 20 January 2019).
// The sequence is the argument. Frames 1 to 3 walk the snowbelt down to the
// lakeshore city; frame 5 is deliberately bright and barely covered, because
// Cincinnati normals 23.3 inches against Chardon's 113.7 and a stock winter
// scene would have argued the opposite. Frame 4 is the twist: the deepest snow
// in the story is Mansfield, the station that later posted 8.4 inches for a
// whole season, its lowest ever, in the last El Nino.
// Frame 2 matters more than it looks. Chardon is the town the disputed 113.7
// inch normal actually comes from, and showing it named is what lets the frame
// text carry the number honestly.
// Cropped to 720x1280 by scripts/host-images.mjs --portrait, since storyImage()
// only appends Unsplash crop params and Supabase ignores them. Each crop got its
// own horizontal focus: a centre crop cut the bridge out of frame 1 and left
// frame 5 as a photograph of a slide.
const OH =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/snow-predictions-for-ohio-2026-2027/";

// The almanac story is the only one here that is not about a place, so its
// frames carry the argument instead of scenery: the instruments the actual
// numbers come from, then three dated satellite scenes showing snow edges that
// cut across the region lines a single forecast has to cover. All five are
// public domain or CC BY-SA and every date is the one the file itself records.
// Frame 3 is false-colour, where snow reads red, so the frame text says so.
const FA =
  "https://etuqhwpyfdpkgykexhnb.supabase.co/storage/v1/object/public/post-images/articles/how-accurate-is-the-farmers-almanac/";

// The national forecast-comparison story's frames: a real GOES storm scene over
// the Great Lakes (30 Dec 2025), a NASA MODIS scene of snow across the Mountain
// West (16 Jan 2025), a NOAA weather balloon launch during a public open house
// (Davenport, Iowa, 17 Oct 2005, illustrating how NOAA's own data is actually
// gathered), and two real dated street scenes, Atlanta (Feb 2014) and Boston
// (7 Feb 2015), standing in for how differently this same pattern plays out by
// state. Hosted on the NEW Supabase project from the start, unlike the older
// story constants above.
const NW =
  "/media/articles/usa-winter-forecast-2026-2027/";

// Boston's frames: an authentic City of Boston Archives photo of the Blizzard
// of 1978 (Mayor Kevin White's office, buried car outside a Mobil station), a
// real MassDOT photo of a snow blower clearing a Logan Airport runway, the same
// Bromfield Street scene used as the article's cover, a 27 Jan 2015 street
// scene from Providence during Winter Storm Juno (illustrating the same kind
// of nor'easter that set Providence's all-time record in Feb 2026, not that
// storm itself, captioned with its own real date), and the Massachusetts State
// House under snow for the close. All real, dated, CC0/CC-BY-SA/public domain.
const BOS =
  "/media/articles/boston-snow-forecast-2026-2027/";

// Florida's frames are five real, dated photographs of the January 20-22,
// 2025 Gulf Coast blizzard, the actual event the guide's record numbers come
// from, not stock winter scenery: a snow-covered car in Niceville with "JAN
// 21, 2025" written into the snow itself (Dane314pizza, CC0), a snow field in
// Century, the panhandle town that took the storm's single highest total
// (Necroticneurotic, CC0), a whiteout street scene in Milton with a palm tree
// visible through the blowing snow (Jesselikesweather, CC BY-SA), a
// Tallahassee restaurant under a light dusting with Spanish moss on the oaks
// behind it (The Bushranger, CC BY-SA), and NOAA Climate.gov's own map of
// every station record broken across the Southeast that week, which is the
// close because it shows the scale beyond any single city. All five carry the
// storm's real date in the frame text rather than a vague "recently."
const FL =
  "/media/articles/does-it-snow-in-florida/";

// The snow-forecast-accuracy frames are five real photographs of how a snow
// forecast actually gets made and measured, not decorative winter scenery: a
// WSR-88D NEXRAD radar tower under mammatus clouds near Sterling, Virginia
// (Famartin, CC BY-SA), NOAA incident meteorologists launching a weather
// balloon during 2023 training (NOAA, public domain), a USDA snow course
// marker station below a Montana peak (USDA NRCS Montana, public domain), the
// National Weather Service forecast office for Northern Indiana (Chris Light,
// CC BY-SA), and NASA's MODIS satellite view of snow cutting across the Great
// Lakes and Northeast on 13 February 2026 (public domain), used as the close
// because it is the scale a single point forecast is trying to capture.
// Frames 1 and 3 are the same two photographs used as the guide's own cover
// and body image, reused deliberately rather than duplicated stock, the same
// pattern already used on this site's Boston story.
const SA =
  "/media/articles/how-accurate-are-weather-forecasts-for-snowfall/";

// Buffalo's frames are five real, dated photographs of the two storms this guide's own record
// numbers come from, plus the ordinary winters between them: snow being dumped at Buffalo's
// Central Terminal after the December 2022 blizzard (the guide's own cover, Andre Carrotflower,
// CC BY-SA), a "City of Buffalo" sign in the November 2014 Snowvember whiteout (the guide's own
// body image, Anthony Quintano, CC BY 2.0), a skid-steer clearing a mountain of plowed snow at a
// Delaware Avenue Burger King during the same December 2022 storm (Andre Carrotflower, CC
// BY-SA), a car reduced to a snow-covered mound on West Ferry Street in January 2022 (Andre
// Carrotflower, CC BY-SA), and the season's first light snowfall on a Laurel Street rooftop in
// November 2020 (Andre Carrotflower, CC BY-SA), used as the close because it is the ordinary,
// unremarkable start every one of Buffalo's famous storms actually begins as.
const BUF =
  "/media/articles/buffalo-snow-forecast-2026-2027/";

// Kentucky's frames are five real, dated photographs from Wikimedia Commons, not
// stock: Waterfront Park in Louisville under snow with the Ohio River bridges
// behind it (William Alden, CC BY-SA, the guide's own cover), a frosted rural
// road in the Bluegrass region (PEO ACWA, CC BY, the guide's own body image), a
// Kentucky National Guard Humvee helping a jack-knifed semi on I-75 during the
// January 2016 storm (The National Guard, CC BY), a car buried in a Paducah
// snowdrift in December 2004 (Beau Dodson, public domain), and kids sledding on
// a Kentucky hillside (PEO ACWA, CC BY, the guide's own body image), used as the
// close since it is the ordinary end of most Kentucky snow days: a hill, not a
// headline.
const KY =
  "/media/articles/snow-predictions-for-kentucky-2026-2027/";

export const webStories: WebStory[] = [
  {
    slug: "how-accurate-is-the-farmers-almanac",
    postSlug: "how-accurate-is-the-farmers-almanac",
    title: "The Almanac Says 80%. We Got 29.5%.",
    description:
      "We pulled five winters of archived Farmers' Almanac forecasts off the Wayback Machine and scored them against NOAA station records for the almanac's own cities.",
    pages: [
      {
        image: FA + "story-1.jpg",
        alt: "A WSR-88D Doppler radar tower under heavy storm clouds at a National Weather Service forecast office",
        kicker: "Almanac accuracy",
        heading: "80 percent, or 29.5?",
        text: "The almanacs claim about 80 percent. We scored five winters of their archived forecasts and got 29.5. Photo: Famartin, CC BY-SA.",
      },
      {
        image: FA + "story-2.jpg",
        alt: "An alter-shielded precipitation gauge inside a fenced National Weather Service Cooperative Observer weather station",
        kicker: "The method",
        heading: "Scored against real gauges",
        text: "139 station-seasons from NOAA daily records, at the 50 cities the almanac itself lists. We did not get to pick the sample.",
      },
      {
        image: FA + "story-3.jpg",
        alt: "False-colour satellite view where snow appears bright red, showing the snow edge stopping partway across Pennsylvania and Maryland",
        kicker: "25 Feb 2021",
        heading: "Snow stops at a line",
        text: "False colour: red is snow, green is bare ground. The edge cuts straight through states. One forecast covers all of it. Image: NASA.",
      },
      {
        image: FA + "story-4.jpg",
        alt: "Satellite view of a patch of snow lying on the eastern Colorado plains surrounded by bare brown ground",
        kicker: "Colorado",
        heading: "One state, two calls",
        text: "Denver sits in the region called below normal this winter, Grand Junction in the one called above normal. Same state. Image: NASA, 13 Nov 2024.",
      },
      {
        image: FA + "story-5.jpg",
        alt: "Satellite view of the Great Lakes in ice with snow covering the Appalachians and bare ground to the south",
        kicker: "Last winter",
        heading: "It was partly right",
        text: "For 2025-26 it called below normal and 66% of our stations finished below. A rule saying below normal every year scored 82%.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-ohio-2026-2027",
    postSlug: "snow-predictions-for-ohio-2026-2027",
    title: "Ohio Snow: 114 Inches, or 23",
    description:
      "Chardon normals 113.7 inches a season and Cincinnati 23.3. What 77 winters of daily records show about a very strong El Nino, and which part of Ohio it actually hits.",
    pages: [
      {
        image: OH + "story-1.jpg",
        alt: "The Harpersfield Covered Bridge in Ashtabula County, Ohio under snow with icicles along its roof line",
        kicker: "Ohio 2026-27",
        heading: "One state, two winters",
        text: "Chardon averages 113.7 inches a season. Cincinnati averages 23.3. Same state, 4.6 times the snow. Photo: Andre Carrotflower, CC BY-SA.",
      },
      {
        image: OH + "story-2.jpg",
        alt: "Snow on Chardon Square at dusk with the lit Geauga County Courthouse clock tower behind it",
        kicker: "The snowbelt",
        heading: "The number nobody agrees on",
        text: "One aggregator says Chardon gets 47.5 inches. Ohio State said 106, the Weather Service says 70 to over 100, NOAA's own station says 113.7.",
      },
      {
        image: OH + "story-3.jpg",
        alt: "Snow falling on a downtown Cleveland street corner with brick buildings and a traffic light",
        kicker: "Cleveland",
        heading: "The airport misses it",
        text: "Cleveland Hopkins normals 63.8 inches, sitting west of the city and out of the fetch. Twenty-five miles east and 350 feet up, the total nearly doubles.",
      },
      {
        image: OH + "story-4.jpg",
        alt: "Deep drifted snow burying raised garden beds in a Mansfield, Ohio back garden during a snowstorm",
        kicker: "But",
        heading: "This town set the record low",
        text: "Mansfield, March 2008. In the 2023-24 El Nino it took 8.4 inches for the entire season, 20% of its own average and the lowest ever measured there.",
      },
      {
        image: OH + "story-5.jpg",
        alt: "A Victorian house in Clifton, Cincinnati behind a lawn under a thin cover of sunlit snow",
        kicker: "The exception",
        heading: "Cincinnati barely flinches",
        text: "In the three strongest El Ninos it held 81% of its average, the best in Ohio, while Dayton kept 36%. Full 77-year record in the guide.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-michigan-2026-2027",
    postSlug: "snow-predictions-for-michigan-2026-2027",
    title: "Michigan Snow: 197 Inches, or 45",
    description:
      "Marquette averages 196.8 inches a season and Detroit Metro 45.0. What 77 winters of daily records show about a record El Nino, and where it actually bites.",
    pages: [
      {
        image: MI + "story-1.jpg",
        alt: "A tall roadside snowfall gauge sign in Keweenaw County, Michigan marked with a record of 390.4 inches",
        kicker: "Michigan 2026-27",
        heading: "A record El Nino is coming",
        text: "Keweenaw County keeps its own scoreboard by the road: 390.4 inches in 1978-79, 161.1 in 1999-2000. Photo: Richie Diesterheft, CC BY.",
      },
      {
        image: MI + "story-2.jpg",
        alt: "Heavy snow falling over the observation platform and flag at the Soo Locks in Sault Ste Marie, Michigan",
        kicker: "The north",
        heading: "The UP barely notices",
        text: "Across the three strongest El Ninos Marquette held 99% of its own average and Alpena 102%. Photo: US Army Corps of Engineers.",
      },
      {
        image: MI + "story-3.jpg",
        alt: "The snow-covered main street of Pentwater on the west Michigan lakeshore during a snowfall",
        kicker: "The west shore",
        heading: "Muskegon loses half",
        text: "51% of its own average in those same winters, the biggest deficit in the state. It is a lake effect town, which breaks the usual explanation.",
      },
      {
        image: MI + "story-4.jpg",
        alt: "Ice floes on the Grand River below a snow-covered truss bridge and the Grand Rapids skyline",
        kicker: "1982-83",
        heading: "Four record lows at once",
        text: "Grand Rapids, Muskegon, Traverse City and Pellston all set their lowest season ever. Marquette took 199.3 inches the same winter.",
      },
      {
        image: MI + "story-5.jpg",
        alt: "Michigan Stadium in Ann Arbor with its seats and field completely covered in snow",
        kicker: "But",
        heading: "The biggest one was normal",
        text: "2015-16 was the strongest El Nino on record and Michigan finished near average. Full 77-year record in the guide.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-texas-2026-2027",
    postSlug: "snow-predictions-for-texas-2026-2027",
    title: "Texas Snow: 16 Inches, or Two Days Ever",
    description:
      "Amarillo averages 16.5 inches a season and Brownsville has recorded snow on two days in its entire history. What 76 winters show about a record El Nino.",
    pages: [
      {
        image: TX + "story-1.jpg",
        alt: "Astronaut photograph looking down on North Texas farmland, roads and a town all covered in snow",
        kicker: "Texas 2026-27",
        heading: "A record El Nino is coming",
        text: "NOAA gives it a greater than 90% chance. Texas is two snow states, and it will not treat them alike. NASA image.",
      },
      {
        image: TX + "story-2.jpg",
        alt: "Aerial view of snow-covered El Paso neighbourhoods with the white Franklin Mountains rising behind the city",
        kicker: "West Texas",
        heading: "El Paso averages 12 inches",
        text: "That is its average in strong El Nino winters, against 4.5 normally. This photo is from the last one. Dicklyon, CC BY-SA.",
      },
      {
        image: TX + "story-3.jpg",
        alt: "Snow falling at night through palm trees behind a chain link fence in Laredo, south Texas",
        kicker: "The other half",
        heading: "16 of 17 came up empty",
        text: "Across the three strongest El Ninos, east and south Texas recorded no snow at all. Photo: Miguel Angel Omana Rojas, CC BY.",
      },
      {
        image: TX + "story-4.jpg",
        alt: "A person in a red coat walking across deep snow past a live oak during heavy snowfall in Austin, Texas",
        kicker: "But",
        heading: "The biggest one was a La Nina",
        text: "February 2021 set the snowiest season on record at Abilene, Waco and Austin. Photo: David Kitto, CC0.",
      },
      {
        image: TX + "story-5.jpg",
        alt: "A downtown Dallas office tower at night with snow falling and snow covering the empty street below",
        kicker: "What matters",
        heading: "Geography, not the forecast",
        text: "Dallas averages 2.3 inches and runs below normal in strong El Ninos. Full record in the guide.",
      },
    ],
  },
  {
    slug: "pittsburgh-winter-forecast-2026-2027",
    postSlug: "pittsburgh-winter-forecast-2026-2027",
    title: "Pittsburgh Winter 2026-27: What 73 Winters Show",
    description:
      "NOAA expects the strongest El Nino since 1950. Pittsburgh's own record says 8 of its 9 strong El Nino winters finished below normal, and one buried the city anyway.",
    pages: [
      {
        image: PGH + "story-1.jpg",
        alt: "Snow falling on the walkway of the yellow Smithfield Street Bridge in downtown Pittsburgh, with footprints in the snow",
        kicker: "Pittsburgh 2026-27",
        heading: "Nobody forecasts a snow total",
        text: "No agency issues a seasonal snowfall number for a city. What exists is 73 years of record. Photo: daveynin, CC BY.",
      },
      {
        image: PGH + "story-2.jpg",
        alt: "The red Duquesne Incline car above an ice-covered river, with the yellow Fort Pitt Bridge and the Pittsburgh skyline behind it",
        kicker: "NOAA, 13 August 2026",
        heading: "A record El Nino is coming",
        text: "Greater than 90% chance of a very strong event, and a 69% chance it beats every El Nino since 1950. Photo: daveynin, CC BY.",
      },
      {
        image: PGH + "story-3.jpg",
        alt: "The downtown Pittsburgh skyline on a grey December day with no snow anywhere on the ground",
        kicker: "The last one",
        heading: "16.3 inches, the lowest ever",
        text: "2023-24 was a strong El Nino and the emptiest winter in the record. Eight of nine finished below normal. Photo: Cbaile19, CC0.",
      },
      {
        image: PGH + "story-4.jpg",
        alt: "Cars buried under deep snow beneath snow-laden tree branches during the 2010 Pittsburgh snowstorms",
        kicker: "But",
        heading: "2009-10 gave 77.4 inches",
        text: "Second snowiest season on record, under an El Nino. A tendency is not a promise. This is that winter. Photo: Asamudra, CC BY.",
      },
      {
        image: PGH + "story-5.jpg",
        alt: "Traffic on Interstate 376 in Pittsburgh the morning after a snowfall, with snow-covered hillsides above the clear road",
        kicker: "What matters",
        heading: "Hills, not the total",
        text: "Only 14 days a year bring an inch or more. Two inches on a Pittsburgh grade beats six on flat ground. Full record in the guide.",
      },
    ],
  },
  {
    slug: "royal-caribbean-2027-cruise-changes",
    postSlug: "royal-caribbean-2027-cruise-changes",
    title: "Royal Caribbean 2027: What Actually Changed",
    description:
      "Seven ships, three announcements and about 20 cancelled sailings. Which 2027 cruises are gone, what refund you actually get, and where the ships went instead.",
    pages: [
      {
        image: RC + "story-1.jpg",
        alt: "Freedom of the Seas, a Royal Caribbean cruise ship, berthed at Port Miami with its name visible on the hull",
        kicker: "Royal Caribbean 2027",
        heading: "About 20 sailings cancelled",
        text: "Freedom of the Seas leaves Miami and the Caribbean for Southampton, May to October 2027. Photo: Kiran891, CC BY-SA.",
      },
      {
        image: RC + "story-2.jpg",
        alt: "Navigator of the Seas docked at the cruise port in Ensenada, Mexico, with port cranes behind it",
        kicker: "Los Angeles",
        heading: "The Mexican Riviera season vanished",
        text: "Announced November 2025 with Ensenada and Cabo named. Pulled nine months later. Photo: Jack Adamenko, CC BY.",
      },
      {
        image: RC + "story-3.jpg",
        alt: "Ovation of the Seas berthed in Sydney Harbour, towering over the surrounding buildings",
        kicker: "Where the ships went",
        heading: "Singapore and Brisbane",
        text: "Navigator stays in Singapore year-round; Ovation home ports in Brisbane from November 2027. Shown here in Sydney. Photo: Dicklyon, CC BY-SA.",
      },
      {
        image: RC + "story-4.jpg",
        alt: "Icon of the Seas, a large Royal Caribbean cruise ship with a glass dome, under way at sea",
        kicker: "Know your rights",
        heading: "Cancelled means a refund",
        text: "Port swapped but the ship still sails? By Royal Caribbean's own terms, no fare refund is owed. Photo: Chakie2, CC BY-SA.",
      },
      {
        image: RC + "story-5.jpg",
        alt: "The Royal Caribbean crown logo on the terminal building at the Port of Galveston, Texas",
        kicker: "The good news",
        heading: "Icon of the Seas comes to Galveston",
        text: "From August 2027, on 6 to 8-night Caribbean runs. See the full guide for every ship affected. Photo: Larry D. Moore, CC BY.",
      },
    ],
  },
  {
    slug: "government-shutdown-travel-2026",
    postSlug: "government-shutdown-travel-2026",
    title: "Government Shutdown Travel: The Dec 11 Deadline",
    description:
      "Congress funded the government only through December 11, 2026, two weeks after Thanksgiving. What the two 2026 shutdowns already showed about flights, TSA lines and parks.",
    pages: [
      {
        image: GS + "story-1.jpg",
        alt: "The east front of the United States Capitol building under a clear blue sky",
        kicker: "Government shutdown",
        heading: "Funded only through December 11, 2026",
        text: "Two weeks after Thanksgiving, two weeks before Christmas. Photo: Martin Falbisoner, CC BY-SA.",
      },
      {
        image: GS + "story-2.jpg",
        alt: "Automated Passport Control kiosks at an airport, the kind of self-service kiosk Global Entry members use",
        kicker: "What actually closed",
        heading: "Global Entry, not PreCheck",
        text: "DHS suspended Global Entry in Feb 2026 and reversed a PreCheck suspension within a day. Photo: US CBP, public domain.",
      },
      {
        image: GS + "story-3.jpg",
        alt: "A Road Closed Ahead sign at a Joshua Tree National Park entrance, with a park ranger vehicle behind it",
        kicker: "National parks",
        heading: "Roads stay open, staff don't",
        text: "Permits, visitor centres and restrooms stop; the road and trail usually don't. Photo: NPS.",
      },
      {
        image: GS + "story-4.jpg",
        alt: "The east front of the United States Capitol building under a clear blue sky",
        kicker: "Know your rights",
        heading: "Cancelled flight? You get a refund",
        text: "Even on a nonrefundable fare, by DOT rule. Accepting a rebooking forfeits it.",
      },
      {
        image: GS + "story-5.jpg",
        alt: "Automated Passport Control kiosks at an airport terminal",
        kicker: "Full guide",
        heading: "How to fly smart before Dec 11",
        text: "What the two 2026 shutdowns proved, and what still isn't known. See the full guide.",
      },
    ],
  },
  {
    slug: "american-airlines-new-international-routes-2026",
    postSlug: "american-airlines-new-international-routes-2026",
    title: "American Airlines 2026: 15 New Routes, Not 13",
    description:
      "American added 15 new international routes in 2026, not the 13 most lists print. The two left out are New York to Tel Aviv and Dallas to Buenos Aires.",
    pages: [
      {
        image: AA + "story-1.jpg",
        alt: "An American Airlines Boeing 787-9 Dreamliner on the taxiway under a bright blue sky with scattered cloud",
        kicker: "American Airlines",
        heading: "Every list says 13 new routes",
        text: "The real count for 2026 is 15. Two of them get left out of almost every roundup. Photo: Umedha Hettigoda, CC BY-SA.",
      },
      {
        image: AA + "story-2.jpg",
        alt: "An American Airlines Boeing 777-200ER with its landing gear down, coming in to land in evening light",
        kicker: "The one they missed",
        heading: "New York to Tel Aviv came back",
        text: "Daily on the 777-200 from 28 March 2026, after a suspension that started in October 2023. Photo: BriYYZ, CC BY-SA.",
      },
      {
        image: AA + "story-3.jpg",
        alt: "An American Airlines Airbus A321neo climbing against a clear blue sky, wing and both engines in view",
        kicker: "The catch",
        heading: "Only one new European route runs all year",
        text: "Miami to Milan. Dallas to Zurich lasted about ten weeks and finished on 4 August 2026. Photo: 4300streetcar, CC BY.",
      },
      {
        image: AA + "story-4.jpg",
        alt: "The Bimini islands and their turquoise shallows seen from the air, with deep blue ocean alongside",
        kicker: "Shortest flight",
        heading: "Miami to Bimini, about 50 miles",
        text: "American's shortest route, three days a week on an Embraer E175, from 14 February 2026. Photo: LBM1948, CC BY-SA.",
      },
      {
        image: AA + "story-5.jpg",
        alt: "Japan Airlines and Jetstar aircraft parked on the apron beside Terminal 3 at Tokyo Narita Airport",
        kicker: "Full guide",
        heading: "The biggest one starts in 2027",
        text: "Chicago to Tokyo Narita, daily on the 787-9 from 27 March 2027. See all 15 routes. Photo: Calistemon, CC BY-SA.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-virginia-2026-2027",
    postSlug: "snow-predictions-for-virginia-2026-2027",
    popularRank: 4,
    title: "Virginia Snow: What the Records Actually Show",
    description:
      "Virginia averages 3.4 inches a season at Virginia Beach and 47.1 at Wise. Nobody can forecast the coming winter, and NOAA says so itself.",
    pages: [
      {
        image: V + "story-1.jpg",
        alt: "An ice-covered lane between bare trees after a winter storm",
        kicker: "Virginia snow",
        heading: "How much snow does Virginia get?",
        text: "The honest answer is a range, not a number. And the range is enormous.",
      },
      {
        image: V + "story-2.jpg",
        alt: "Aerial view of snow lying between conifers across low forested ridges",
        kicker: "Snowiest place",
        heading: "Wise, at 47.1 inches a season",
        text: "Fourteen times what Virginia Beach gets. It never shows up in the city tables.",
      },
      {
        image: V + "story-3.jpg",
        alt: "A snow-covered woodland track with fresh snow falling",
        kicker: "Last five winters",
        heading: "2022-23 delivered almost nothing",
        text: "Dulles managed 0.4 inches all season. Two winters later Norfolk took 16.8.",
      },
      {
        image: V + "story-4.jpg",
        alt: "A snowbound residential street of brick rowhouses under a clear sky",
        kicker: "Why the state stops",
        heading: "Richmond gets 2.7 snow days a year",
        text: "Not enough to pay for a plow fleet. So the roads go bad instead.",
      },
      {
        image: V + "story-5.jpg",
        alt: "A four-wheel-drive parked on a snow-covered forest road",
        kicker: "Winter 2026-27",
        heading: "No one can forecast this winter's snow",
        text: "NOAA will not publish a seasonal total. See what the records do show.",
      },
    ],
  },
  {
    slug: "disneyland-vs-disney-world",
    postSlug: "disneyland-vs-disney-world",
    popularRank: 1,
    title: "Disneyland vs Disney World: Pick One",
    description:
      "Disneyland is smaller, walkable and needs 2-3 days. Disney World is 50 times bigger with 4 parks and needs a week. They are 2,500 miles apart.",
    pages: [
      {
        image: DVW + "story-1.jpg",
        alt: "Sleeping Beauty Castle at Disneyland in California with visitors walking below it",
        kicker: "Disneyland vs Disney World",
        heading: "Two places, opposite coasts",
        text: "Disneyland is in California, Disney World in Florida, 2,500 miles apart. You pick one.",
      },
      {
        image: DVW + "story-2.jpg",
        alt: "Cinderella Castle at Magic Kingdom, Walt Disney World in Florida",
        kicker: "The size gap",
        heading: "Disney World is about 50x bigger",
        text: "25,000 acres and 4 parks in Florida, versus 500 acres and 2 parks in California.",
      },
      {
        image: DVW + "story-3.jpg",
        alt: "Spaceship Earth, the geodesic sphere at EPCOT, Walt Disney World",
        kicker: "How many days",
        heading: "2-3 days vs a whole week",
        text: "Disneyland fits a long weekend. Disney World's 4 parks need 4 to 7 days.",
      },
      {
        image: DVW + "story-4.jpg",
        alt: "Radiator Springs Racers ride in Cars Land at Disney California Adventure",
        kicker: "For young kids",
        heading: "Disneyland usually wins",
        text: "Walkable, less overwhelming, cheaper. Little kids do not miss the bigger resort.",
      },
      {
        image: DVW + "story-5.jpg",
        alt: "Main Street USA at Magic Kingdom, Walt Disney World, leading toward the castle",
        kicker: "Which first?",
        heading: "Start with Disneyland",
        text: "Cheaper and shorter for a first trip. Scale up to Disney World later. See the full comparison.",
      },
    ],
  },
  {
    slug: "lakshadweep-tour-packages-from-kochi",
    postSlug: "lakshadweep-tour-packages-from-kochi",
    popularRank: 2,
    title: "Lakshadweep by Ship: The Real Package Price",
    description:
      "The official Samudram cruise from Kochi is 22,500 rupees per adult in Gold class, 30,500 in Diamond. Not the 44,000 you see quoted online.",
    pages: [
      {
        image: LK + "story-1.jpg",
        alt: "The government passenger ship M.V. Kavaratti docked at Kochi with its name painted on the hull",
        kicker: "Lakshadweep by ship",
        heading: "One ship package from Kochi",
        text: "The government Samudram cruise: 5 days, 4 nights, sleeping aboard M.V. Kavaratti.",
      },
      {
        image: LK + "story-2.jpg",
        alt: "Clear turquoise lagoon water over coral at Kalpeni island in Lakshadweep",
        kicker: "Three islands",
        heading: "Kavaratti, Kalpeni, Minicoy",
        text: "You sail overnight and step onto a different island each day, lunch served ashore.",
      },
      {
        image: LK + "story-3.jpg",
        alt: "A palm frond over calm turquoise sea at Kavaratti, a boat on the far horizon",
        kicker: "The real price",
        heading: "22,500 in Gold, 30,500 in Diamond",
        text: "Per adult, official 2026 tariff. The 42,000 to 44,000 quotes online are not the government fare.",
      },
      {
        image: LK + "story-4.jpg",
        alt: "Palm trees silhouetted against a pink sunset over the beach at Kavaratti, Lakshadweep",
        kicker: "Before you book",
        heading: "Every visitor needs a permit",
        text: "A Lakshadweep entry permit is the law, handled through the package booking.",
      },
      {
        image: LK + "story-5.jpg",
        alt: "A Lakshadweep passenger ship at sea at dusk with people watching from shore",
        kicker: "How to book",
        heading: "Online only, book early",
        text: "The cruise sells only through the official portal, and dates are released close in.",
      },
    ],
  },
  {
    slug: "how-to-visit-vantara-step-by-step-guide",
    postSlug: "how-to-visit-vantara-step-by-step-guide",
    popularRank: 3,
    title: "Vantara: Can You Actually Visit?",
    description:
      "Vantara is not open to the public. There is no ticket, no booking and no published entry fee, whatever the price tables online tell you.",
    pages: [
      {
        image: VN + "story-1.jpg",
        alt: "An Asian elephant walking along a dusty forest track with its ears spread",
        kicker: "Vantara, Jamnagar",
        heading: "Can you visit Vantara?",
        text: "It cares for 275 elephants and more than 40,000 animals. You still cannot walk in.",
      },
      {
        image: VN + "story-2.jpg",
        alt: "A flock of black and white crab-plovers on a narrow sandbar surrounded by shallow sea",
        kicker: "The honest answer",
        heading: "No, and there is no ticket",
        text: "No counter, no online booking, no published fee. Entry needs regulatory approval.",
      },
      {
        image: VN + "story-3.jpg",
        alt: "A long line of great white pelicans resting on a mudbank in front of tall reeds",
        kicker: "Watch out",
        heading: "Every entry fee online is invented",
        text: "Family combo tickets, student discounts, 2026 price tables. None of it exists.",
      },
      {
        image: VN + "story-4.jpg",
        alt: "Crab-plovers standing in shallow water along a sandy shoreline",
        kicker: "Go here instead",
        heading: "The Jamnagar coast needs no permission",
        text: "Marine National Park, Khijadiya and Lakhota Lake are open, and genuinely good.",
      },
      {
        image: VN + "story-5.jpg",
        alt: "An Asian elephant on a forest track, seen head on through drifting dust",
        kicker: "Before you book",
        heading: "Check vantara.in, and nothing else",
        text: "No opening date has been announced. See what the official record actually says.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-georgia-2026-2027",
    postSlug: "snow-predictions-for-georgia-2026-2027",
    popularRank: 5,
    title: "Georgia Snow: 2.2 Inches, and Often None",
    description:
      "Georgia averages 2.2 inches of snow a season at Atlanta, and eight of the last sixteen winters brought none at all. What the records show for 2026-2027.",
    pages: [
      {
        image: G + "story-1.jpg",
        alt: "A rural road curving through wooded foothills with thin snow on the grass verges",
        kicker: "Georgia snow",
        heading: "Will it snow in Georgia this winter?",
        text: "Some years yes, most years barely. Eight of the last sixteen winters brought none.",
      },
      {
        image: G + "story-2.jpg",
        alt: "People standing on a bare grassy slope with a city skyline behind them as snow falls",
        kicker: "Atlanta",
        heading: "2.2 inches in an average season",
        text: "That is the NOAA 1991-2020 normal. January carries almost half of it on its own.",
      },
      {
        image: G + "story-3.jpg",
        alt: "An empty suburban street covered in slush and tyre tracks after a snowfall",
        kicker: "Snowjam 2014",
        heading: "2.6 inches shut down Atlanta",
        text: "Thousands slept in their cars. The depth was never the problem. The timing was.",
      },
      {
        image: G + "story-4.jpg",
        alt: "A snow-covered residential street with parked cars under a magnolia tree at dawn",
        kicker: "El Nino",
        heading: "Georgia's big snows were not El Nino winters",
        text: "1993 and 2014 were neutral. The 2011 shutdown landed in a strong La Nina.",
      },
      {
        image: G + "story-5.jpg",
        alt: "Snow falling on a small-town main road with shopfronts and power lines behind",
        kicker: "Winter 2026-27",
        heading: "Nobody forecasts Georgia snowfall",
        text: "NOAA will not publish a seasonal total. See what the records actually show.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-south-carolina-2026-2027",
    postSlug: "snow-predictions-for-south-carolina-2026-2027",
    popularRank: 10,
    title: "South Carolina Snow: What January 2026 Showed",
    description:
      "South Carolina's coast averages 0.2 inches of snow a season, and the Upstate 2.6. Then January 2026 put 7-8 inches on the ground statewide. What that means for 2026-2027.",
    pages: [
      {
        image: SC + "story-1.jpg",
        alt: "A car on a residential street buried under a thick layer of snow",
        kicker: "South Carolina snow",
        heading: "Will it snow in South Carolina in 2027?",
        text: "Nobody can say yet. But January 2026 just showed what it looks like when it does.",
      },
      {
        image: SC + "story-2.jpg",
        alt: "Snow-covered pine trees in a dense forest under an overcast sky",
        kicker: "The 30-year average",
        heading: "Most of the coast: 0.2 inches a year",
        text: "NOAA's 1991-2020 normal. Charleston, Beaufort and the Lowcountry mostly go without.",
      },
      {
        image: SC + "story-3.jpg",
        alt: "Sunlight breaking through snow-laden pine branches after a storm",
        kicker: "January 2026",
        heading: "Then Spartanburg took 7 inches in a day",
        text: "Fingerville hit 8.4. A band near the NC line saw 13 to 18. Four people died statewide.",
      },
      {
        image: SC + "story-4.jpg",
        alt: "A dirt road covered in snow winding between bare winter trees",
        kicker: "Why it shuts down",
        heading: "SC does not run a northern plow fleet",
        text: "A storm like that happens once every four or five years. The state does not equip for it.",
      },
      {
        image: SC + "story-5.jpg",
        alt: "A car parked on a snow-covered street after a winter storm",
        kicker: "Winter 2026-27",
        heading: "NOAA leans wetter, not snowier",
        text: "A strong El Nino favors more precipitation. Whether it's snow depends on cold air, not odds.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-alabama-2026-2027",
    postSlug: "snow-predictions-for-alabama-2026-2027",
    popularRank: 11,
    title: "Alabama Snow: Mobile's 130-Year Record",
    description:
      "Mobile averages 0.2 inches of snow a season. In January 2025 it got 7.5, breaking a record that stood since 1895. What that means for 2026-2027.",
    pages: [
      {
        image: AL + "story-1.jpg",
        alt: "A dirt road covered in snow winding between bare winter trees",
        kicker: "Alabama snow",
        heading: "Will it snow in Alabama in 2027?",
        text: "North Alabama has real odds. The coast is usually a no, until it isn't.",
      },
      {
        image: AL + "story-2.jpg",
        alt: "Snow-covered pine trees in a dense forest under an overcast sky",
        kicker: "The 30-year average",
        heading: "Huntsville: 2.4 inches a year",
        text: "Mobile, on the coast, averages just 0.2. Twelve times less snow, on paper.",
      },
      {
        image: AL + "story-3.jpg",
        alt: "A tree branch coated in a thick layer of ice after an ice storm",
        kicker: "January 2026",
        heading: "Winter Storm Fern hit Alabama twice over",
        text: "Ice forced a 19-county emergency in the north. An EF2 tornado hit the south.",
      },
      {
        image: AL + "story-4.jpg",
        alt: "A snow-covered rural road running between bare trees",
        kicker: "January 2025",
        heading: "Then Mobile broke a 130-year record",
        text: "7.5 inches, beating the 6 inches set in 1895. On the coast, not the hills.",
      },
      {
        image: AL + "story-5.jpg",
        alt: "Sunlight breaking through snow-covered pine branches after a winter storm",
        kicker: "Winter 2026-27",
        heading: "NOAA leans wetter, not snowier",
        text: "A strong El Nino favors more precipitation. Snow depends on cold air, not odds.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-louisiana-2026-2027",
    postSlug: "snow-predictions-for-louisiana-2026-2027",
    popularRank: 12,
    title: "Louisiana Snow: The 2025 Gulf Blizzard",
    description:
      "New Orleans averages 0.0 inches of snow a year. In January 2025 it got 10, in a blizzard the region had never seen before. What that means for 2026-2027.",
    pages: [
      {
        image: LA + "story-1.jpg",
        alt: "Palm trees dusted with snow after a rare cold-weather event",
        kicker: "Louisiana snow",
        heading: "Will it snow in Louisiana in 2027?",
        text: "Most years, barely at all. Then January 2025 happened.",
      },
      {
        image: LA + "story-2.jpg",
        alt: "Snow-covered pine trees in a dense forest under an overcast sky",
        kicker: "The 30-year average",
        heading: "New Orleans: 0.0 inches a year",
        text: "Shreveport in the north is the state's snowiest city, at just 0.9.",
      },
      {
        image: LA + "story-3.jpg",
        alt: "A tree branch coated in a thick layer of ice after an ice storm",
        kicker: "January 2026",
        heading: "Winter Storm Fern hit Louisiana too",
        text: "Ice, not snow. Two hypothermia deaths in the Shreveport area.",
      },
      {
        image: LA + "story-4.jpg",
        alt: "A snow-covered rural road running between bare trees",
        kicker: "January 2025",
        heading: "Then New Orleans got 10 inches",
        text: "The first-ever Blizzard Warning on this coast. 13 deaths, $200M in damage.",
      },
      {
        image: LA + "story-5.jpg",
        alt: "Sunlight breaking through snow-covered pine branches after a winter storm",
        kicker: "Winter 2026-27",
        heading: "NOAA leans wetter, not snowier",
        text: "A strong El Nino favors more storms. A repeat blizzard isn't the base case.",
      },
    ],
  },
  {
    slug: "government-shutdown-holiday-travel-2026",
    postSlug: "government-shutdown-holiday-travel-2026",
    popularRank: 13,
    title: "Shutdown Deadline: 11 December 2026",
    description:
      "Government funding runs out 11 December 2026, days before Christmas. What the last two shutdowns did to flights, TSA lines, parks and DC museums.",
    pages: [
      {
        image: GSH + "story-1.jpg",
        alt: "A federal shutdown notice posted at Detroit Metropolitan Airport during the October 2025 shutdown",
        kicker: "Holiday travel",
        heading: "Funding runs out 11 December",
        text: "Two weeks before Christmas. Congress has to act again in peak travel season.",
      },
      {
        image: GSH + "story-2.jpg",
        alt: "A closure notice at the entrance to Mesa Verde National Park during the 2025 shutdown",
        kicker: "National parks",
        heading: "Parks stay open, services do not",
        text: "Roads and trails stay accessible. Visitor centers and rangers do not.",
      },
      {
        image: GSH + "story-3.jpg",
        alt: "The National Gallery of Art in Washington DC closed during the October 2025 shutdown",
        kicker: "Washington DC",
        heading: "Smithsonian museums close first",
        text: "Smithsonian museums were documented closed by 15 October 2025.",
      },
      {
        image: GSH + "story-4.jpg",
        alt: "A closed information station at the WWII Memorial during a lapse in appropriations",
        kicker: "Cost",
        heading: "$1 billion a week for travel",
        text: "US Travel Association's estimate. The 43-day 2025 shutdown cost $6.1 billion.",
      },
      {
        image: GSH + "story-5.jpg",
        alt: "A shutdown notice at a US airport",
        kicker: "Before you fly",
        heading: "Flights keep flying, lines get longer",
        text: "TSA and controllers work unpaid. Arrive early. See what the record shows.",
      },
    ],
  },
  {
    slug: "when-to-book-christmas-flights-2026",
    postSlug: "when-to-book-christmas-flights-2026",
    popularRank: 14,
    title: "When to Book Christmas Flights in 2026",
    description:
      "Google says Christmas fares bottom out 32 to 73 days before departure. That is October 7 to November 1 for December 19 to 23 flights. Here is why this year's fares change the advice.",
    pages: [
      {
        image: XM + "story-1.jpg",
        alt: "The departure hall of Terminal 8 at John F. Kennedy International Airport in New York",
        kicker: "Christmas flights 2026",
        heading: "When should you book?",
        text: "Google's data says 32 to 73 days out. For December 19 to 23 flights, that is October 7 to November 1.",
      },
      {
        image: XM + "story-2.jpg",
        alt: "An American Airlines Boeing 737-800 at gate H17 at Chicago O'Hare with ground service vehicles beside it",
        kicker: "Why this year",
        heading: "Airfares are up 23.4%",
        text: "Jet fuel is $4.71 a gallon, and airlines say they are cutting their least profitable flights.",
      },
      {
        image: XM + "story-3.jpg",
        alt: "Passengers waiting in line to clear the TSA security checkpoint at Denver International Airport",
        kicker: "Cheapest days",
        heading: "Fly Christmas Eve or Christmas Day",
        text: "The least crowded days in NerdWallet's TSA analysis. Mondays to Wednesdays run about 13% cheaper.",
      },
      {
        image: XM + "story-4.jpg",
        alt: "A date card showing the October 7 to November 1 booking window for December 19 to 23 flights",
        kicker: "Our advice",
        heading: "Buy by October 30",
        text: "Halloween falls on a Saturday, so Friday, October 30 is the practical last day.",
      },
      {
        image: XM + "story-5.jpg",
        alt: "A date card showing the Thanksgiving booking window opening on September 26",
        kicker: "Thanksgiving",
        heading: "That window opens September 26",
        text: "For a Tuesday, November 24 flight, the low point is October 20. See the full guide.",
      },
    ],
  },
  {
    slug: "when-to-book-thanksgiving-flights-2026",
    postSlug: "when-to-book-thanksgiving-flights-2026",
    popularRank: 15,
    title: "When to Book Thanksgiving Flights in 2026",
    description:
      "Google says Thanksgiving fares bottom out 24 to 59 days before departure. That is September 26 to October 31 for a November 24 flight. Fares are up 9% to 13% this year.",
    pages: [
      {
        image: TF + "story-1.jpg",
        alt: "Travelers with luggage walking through the crowded Barbara Jordan Terminal at Austin-Bergstrom International Airport",
        kicker: "Thanksgiving flights 2026",
        heading: "When should you book?",
        text: "Google's data says 24 to 59 days out. For a Tuesday, November 24 flight, that is September 26 to October 31.",
      },
      {
        image: TF + "story-2.jpg",
        alt: "A purple card reading up 9 to 13 percent for Thanksgiving fares compared with last year",
        kicker: "Why now",
        heading: "Fares are up 9% to 13%",
        text: "Points Path data shows Thanksgiving fares above 2025. Last year, waiting saved travelers essentially nothing.",
      },
      {
        image: TF + "story-3.jpg",
        alt: "A card reading about 13 percent cheaper for Monday to Wednesday flights compared with the weekend",
        kicker: "Save money",
        heading: "Fly Monday to Wednesday",
        text: "About 13% cheaper than the weekend, per Google. A layover saves about 22%.",
      },
      {
        image: TF + "story-4.jpg",
        alt: "A date card showing the September 26 to October 20 booking window for Tuesday, November 24 flights",
        kicker: "The window",
        heading: "September 26 to October 20",
        text: "Google's low-price range counted back to 2026 dates. The lowest point for November 24 is October 20.",
      },
      {
        image: TF + "story-5.jpg",
        alt: "A date card showing October 30 as the last day to buy Thanksgiving flights",
        kicker: "Our advice",
        heading: "Buy by October 30",
        text: "Halloween falls on a Saturday, so Friday is the practical last day. See the full guide.",
      },
    ],
  },
  {
    slug: "flight-cancelled-due-to-snow",
    postSlug: "flight-cancelled-due-to-snow",
    popularRank: 16,
    title: "Flight Cancelled Due to Snow? What You're Owed",
    description:
      "US rules give you a full refund when snow cancels your flight, even on a non-refundable ticket. They do not require cash compensation, meals or a hotel. Here is what to do next.",
    pages: [
      {
        image: FC + "story-1.jpg",
        alt: "A snow-covered Lufthansa Boeing 747 at gate A41 at Denver International Airport",
        kicker: "Winter travel",
        heading: "Flight cancelled by snow?",
        text: "Here is what US rules say you are owed, and what they do not cover.",
      },
      {
        image: FC + "story-2.jpg",
        alt: "A green card reading Refund: yes, even on a non-refundable ticket",
        kicker: "Your right",
        heading: "You get a full refund",
        text: "If the airline cancels and you decline the rebooking or a voucher. The cause, weather included, does not matter.",
      },
      {
        image: FC + "story-3.jpg",
        alt: "A red card reading Hotel and meals: no, not required when snow is the cause",
        kicker: "Not required",
        heading: "No hotel, meals or cash",
        text: "Federal rules do not require them for weather. Your card's trip-delay cover might pay.",
      },
      {
        image: FC + "story-4.jpg",
        alt: "A card reading 7 or 20 days for the refund deadline",
        kicker: "The clock",
        heading: "7 business days by card",
        text: "20 calendar days if you paid by cash, check or debit.",
      },
      {
        image: FC + "story-5.jpg",
        alt: "A purple card reading Ask for the refund and decline the voucher unless you want it",
        kicker: "Our advice",
        heading: "Ask for the refund",
        text: "A voucher is the airline's offer, not your right. See the full guide.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-maryland-2026-2027",
    postSlug: "snow-predictions-for-maryland-2026-2027",
    popularRank: 6,
    title: "Maryland Snow: 19.3 Inches, or Almost None",
    description:
      "Baltimore averages 19.3 inches of snow a season. Its record winter hit 77 inches and its worst hit 0.2. What the NOAA records show going into 2026-2027.",
    pages: [
      {
        image: MD + "story-1.jpg",
        alt: "A Baltimore rowhouse street in Fells Point buried in deep snow under a blue sky, with cars covered to the roof",
        kicker: "Maryland snow",
        heading: "How much snow does Maryland get?",
        text: "Baltimore averages 19.3 inches a season. Garrett County averages 104.9. Photo: Laura Swiecicki, CC BY.",
      },
      {
        image: MD + "story-2.jpg",
        alt: "A man in a winter coat walking a Baltimore pavement with only patchy melting snow, the Washington Monument behind him",
        kicker: "A normal winter",
        heading: "Most winters look like this",
        text: "Nine seasons in a row have finished below normal. Photo: Elvert Barnes, CC BY-SA.",
      },
      {
        image: MD + "story-3.jpg",
        alt: "Satellite view of the Chesapeake Bay and Maryland almost entirely white with snow after the February 2010 blizzard",
        kicker: "February 2010",
        heading: "77 inches, the all-time record",
        text: "The whole state went under. Still Baltimore's snowiest season since 1883. NASA image.",
      },
      {
        image: MD + "story-4.jpg",
        alt: "Cars buried to the roof outside Baltimore rowhouses on Howard Street during the January 2016 blizzard, snow still falling",
        kicker: "El Nino",
        heading: "A strong El Nino is not a promise",
        text: "1997-98 was stronger and gave 3.2 inches. 2015-16 gave 35.1. Photo: Seth Sawyers, CC BY.",
      },
      {
        image: MD + "story-5.jpg",
        alt: "A red and yellow Baltimore transit bus on a wet cobbled street with light snow at the kerb",
        kicker: "Winter 2026-27",
        heading: "Nobody forecasts Maryland snowfall",
        text: "NOAA does not publish a seasonal total. See what the records actually show.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-colorado-2026-2027",
    postSlug: "snow-predictions-for-colorado-2026-2027",
    popularRank: 6,
    title: "Colorado Snow: What El Nino Actually Did",
    description:
      "In seven strong El Nino winters since 1950, southern Colorado ran well above normal and Steamboat ran below. What 12 station records show for 2026-2027.",
    pages: [
      {
        image: CO + "story-1.jpg",
        alt: "A snowplough with headlights on clearing a Colorado residential street in heavy falling snow",
        kicker: "Colorado snow",
        heading: "How much snow does Colorado get?",
        text: "Anywhere from 194 inches to 17, depending on which side of the divide you stand. FEMA photo.",
      },
      {
        image: CO + "story-2.jpg",
        alt: "Satellite view of Colorado with the Rocky Mountains white with snow and the eastern plains bare brown",
        kicker: "One state, two climates",
        heading: "Crested Butte 194in, Grand Junction 17in",
        text: "An eleven-fold gap inside one state. A statewide average describes nowhere. NASA image.",
      },
      {
        image: CO + "story-3.jpg",
        alt: "A snowplough clearing a Colorado street past a tavern during a heavy snowstorm",
        kicker: "Last winter",
        heading: "The worst season on record",
        text: "2025-26 finished dead last at Fort Collins, Steamboat and Telluride. Denver came second worst.",
      },
      {
        image: CO + "story-4.jpg",
        alt: "A snow-covered trail through spruce forest in the Colorado high country under a blue sky",
        kicker: "El Nino",
        heading: "The south wins, the north does not",
        text: "Colorado Springs beat its normal in all seven strong El Nino winters. Steamboat managed two.",
      },
      {
        image: CO + "story-5.jpg",
        alt: "A snowplough and a pickup truck on a snow-covered Colorado street during falling snow",
        kicker: "Denver",
        heading: "First snow lands 18 October",
        text: "That is the median across 78 seasons. The earliest was 3 September, the latest 10 December.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-north-carolina-2026-2027",
    postSlug: "snow-predictions-for-north-carolina-2026-2027",
    popularRank: 6,
    title: "North Carolina Snow: 89 Inches, or Under One",
    description:
      "Mount Mitchell averages 89 inches of snow a season and Wilmington averages under an inch. What eight NWS station records show going into 2026-2027.",
    pages: [
      {
        image: NC + "story-1.jpg",
        alt: "Snow lying across the golf course and fairway trees at the Omni Grove Park Inn in Asheville, North Carolina",
        kicker: "North Carolina snow",
        heading: "How much snow does NC get?",
        text: "Anything from 89 inches to under one, depending where you stand. Photo: Bill McMannis, CC BY.",
      },
      {
        image: NC + "story-2.jpg",
        alt: "Students crossing a snow-covered Sanford Mall on the Appalachian State University campus in Boone",
        kicker: "Boone",
        heading: "27 inches, and never a blank year",
        text: "Boone has finished all 46 of its recorded seasons with measurable snow. Photo: Clayhefner, CC0.",
      },
      {
        image: NC + "story-3.jpg",
        alt: "Satellite view of eastern North Carolina with the coastal plain and Outer Banks white with snow while the interior stays bare brown",
        kicker: "Last winter",
        heading: "The coast beat the mountains",
        text: "Wilmington had its 6th snowiest season in 76 years. Asheville ranked 47th. NASA image.",
      },
      {
        image: NC + "story-4.jpg",
        alt: "A snow-buried Asheville street during the March 1993 Storm of the Century",
        kicker: "March 1993",
        heading: "36 inches in 24 hours",
        text: "The Superstorm still holds both state records: 36 inches in a day, 50 in total. NOAA photo.",
      },
      {
        image: NC + "story-5.jpg",
        alt: "A Blue Ridge Parkway sign warning drivers to avoid the parkway during fog, snow and ice",
        kicker: "Winter 2026-27",
        heading: "Check the road before you go",
        text: "Parkway sections are still closed from Helene. See what the station records actually show.",
      },
    ],
  },
  {
    slug: "costco-travel-cruises",
    postSlug: "costco-travel-cruises",
    popularRank: 6,
    title: "Costco Travel Cruises: What You Actually Get",
    description:
      "Costco puts a Digital Costco Shop Card on every sailing but does not show the amount until your invoice. What Costco's own pages confirm.",
    pages: [
      { image: C + "story-1.jpg", alt: "A cruise ship berthed at dusk", kicker: "Costco Travel", heading: "Booking a Cruise Through Costco", text: "What you get, and the one number Costco will not show you." },
      { image: C + "story-2.jpg", alt: "Two cruise ships seen from above at a Caribbean port", kicker: "Every sailing", heading: "A Digital Costco Shop Card", text: "Costco puts one on every cruise it sells. The amount is not shown before you book." },
      { image: C + "story-4.jpg", alt: "Passengers on a busy cruise ship pool deck", kicker: "Timing", heading: "It arrives 10 days after you sail", text: "Not after the trip ends. Costco emails it about 10 days after your cruise starts." },
      { image: C + "story-3.jpg", alt: "Celebrity Equinox at sea off Key West", kicker: "Check first", heading: "It will not work at the pump", text: "Costco says the card is not accepted at gas stations, car washes or food court kiosks." },
      { image: C + "story-5.jpg", alt: "A cruise ship photographed from directly overhead", kicker: "Full guide", heading: "What Costco confirms, and what it hides", text: "The 12 lines it sells, the 72-hour cancellation trap, and four claims other sites get wrong." },
    ],
  },
  {
    slug: "kochi-to-lakshadweep-ship-ticket-price",
    postSlug: "kochi-to-lakshadweep-ship-ticket-price",
    popularRank: 7,
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
    popularRank: 8,
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
    // The story URL keeps its original undated slug (it is indexed and drew
    // impressions), but the post it linked to was pruned in July 2026. Point it
    // at the live 2026 rewrite instead of a 404.
    slug: "mangalore-to-lakshadweep-ship-ticket-price",
    postSlug: "mangalore-to-lakshadweep-ship-ticket-price-2026",
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
    slug: "best-day-to-fly-thanksgiving",
    postSlug: "best-day-to-fly-thanksgiving",
    title: "Best Day to Fly for Thanksgiving",
    description:
      "Thanksgiving Day is the quietest US flying day of the year and the Sunday after is the busiest. Counted from six years of TSA checkpoint records.",
    pages: [
      {
        image: TG + "s1.jpg",
        alt: "A passenger waiting at a Please Wait Here sign at an airport security checkpoint",
        kicker: "Thanksgiving",
        heading: "The busiest day is not the one you think",
        text: "Six years of TSA counts, not forecasts. The peak is not the Wednesday. Photo: Michael Ball, CC0.",
      },
      {
        image: TG + "s4.jpg",
        alt: "An almost empty airport security checkpoint with stacked bins and one officer on duty",
        kicker: "The quiet day",
        heading: "Thanksgiving Day is the emptiest",
        text: "TSA screened 1,559,165 people on Thanksgiving 2025, the quietest day of that whole year. Photo: M.O. Stevens, CC BY.",
      },
      {
        image: TG + "s3.jpg",
        alt: "A crowded airport concourse at Chicago O'Hare full of walking passengers",
        kicker: "The peak",
        heading: "The Sunday after is the busiest",
        text: "3,134,613 screened on 30 November 2025. Busiest day of the year, six years running. Photo: Mattpopovich, CC0.",
      },
      {
        image: TG + "s2.jpg",
        alt: "Passengers queuing in the security line under the tented roof of Denver International Airport",
        kicker: "The myth",
        heading: "The Wednesday before is not the peak",
        text: "In six years of records it has never been the busiest day even of its own week. Photo: Dbenbenn, CC BY-SA.",
      },
      {
        image: TG + "s5.jpg",
        alt: "A Thanksgiving dinner spread of side dishes laid out on a dark table",
        kicker: "Full guide",
        heading: "Fly out Thursday, home Tuesday",
        text: "Thanksgiving 2026 is 26 November. Keep off Sunday 29 November. Photo: HaJunkiyada, CC BY-SA.",
      },
    ],
  },
  {
    slug: "best-airlines-travel-internationally-business-class-to-australia",
    postSlug: "best-airlines-travel-internationally-business-class-to-australia",
    title: "Business Class to Australia From the US",
    description:
      "Four airlines fly business class nonstop from the US to Australia. The gateways, the cities, and why a Gulf connection adds up to 95% more flying.",
    pages: [
      {
        image: AU + "story1.jpg",
        alt: "A Qantas Airbus A380 with Spirit of Australia titles on the taxiway at Los Angeles International Airport",
        kicker: "Business class",
        heading: "Only four airlines fly it nonstop",
        text: "Qantas, United, Delta and American, from four mainland US gateways. Photo: Glenn Beltz, CC BY.",
      },
      {
        image: AU + "story2.jpg",
        alt: "A United Airlines Boeing 787-9 Dreamliner taxiing beside the water",
        kicker: "United",
        heading: "Four Australian cities from SFO",
        text: "Sydney, Melbourne and Brisbane year round, Adelaide seasonally. Photo: Bill Abbott, CC BY-SA.",
      },
      {
        image: AU + "story3.jpg",
        alt: "The Melbourne skyline rising above the Yarra River on a clear day",
        kicker: "Melbourne",
        heading: "Three airlines fly there nonstop",
        text: "Qantas from Dallas and LA, United from LA and San Francisco, Delta from LA. Photo: melalouise, CC BY.",
      },
      {
        image: AU + "story4.jpg",
        alt: "Sydney Opera House and the Harbour Bridge at dusk seen across the water",
        kicker: "The detour",
        heading: "Doha adds 45% more flying",
        text: "New York to Sydney is 9,951 miles direct. Over Doha it is 14,382. Photo: Benh Lieu Song, CC BY-SA.",
      },
      {
        image: AU + "story5.jpg",
        alt: "A Qantas Airbus A380 at Los Angeles International Airport with other airline tails behind it",
        kicker: "Full guide",
        heading: "Every nonstop, city by city",
        text: "Flight times from your airport and which cabin each airline flies. Photo: Eric Salard, CC BY-SA.",
      },
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
    popularRank: 9,
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
  // REMOVED 2026-08-08: the Pittsburgh winter story. Its post was pruned in
  // July 2026, so the story linked to a 404, and the story itself carried a
  // fabricated number: "NOAA expects El Nino present and strengthening through
  // winter, at 97-99% confidence". The CPC's actual 9 July 2026 discussion puts
  // El Nino at 81% for October to December. The slug also said 2024-2025 while
  // the copy said 2026-2027. The URL now returns 410 via middleware.ts.
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
  {
    // First story built on our own hosted images rather than Unsplash, and the
    // first covering a US-audience page. Frames are stored at 720x1280 because
    // storyImage()'s crop params are Unsplash-only and Supabase ignores them.
    slug: "how-can-i-check-the-passenger-list-on-an-airplane",
    postSlug: "how-can-i-check-the-passenger-list-on-an-airplane",
    popularRank: 4,
    title: "Can You Check a Flight's Passenger List?",
    description:
      "You cannot see who else is on your flight. What the rules actually say, and what you can find out instead.",
    pages: [
      { image: S + "story-1.jpg", alt: "Airport information screen listing airline check-in areas", kicker: "Air travel", heading: "Can you check a passenger list?", text: "Short answer: no. Not by phone, not in the app, not on any tracker." },
      { image: S + "story-2.jpg", alt: "A row of airline check-in counters in a terminal", kicker: "The myth", heading: "Nobody can download a manifest", text: "There is no such option on any airline site. Agents cannot confirm whether a named person is booked." },
      { image: S + "story-3.jpg", alt: "Rows of empty seats inside an aircraft cabin", kicker: "Seat maps", heading: "Occupied is not a name", text: "Seat maps show status only. Blocked seats are often held for crew, with no passenger attached at all." },
      { image: S + "story-4.jpg", alt: "A phone showing a travel app being held in one hand", kicker: "What works", heading: "Track the flight instead", text: "Status, gate, delays and landing time are all public. That answers the real question." },
      { image: S + "story-5.jpg", alt: "People waiting in an airport arrivals hall", kicker: "Read this", heading: "Your boarding pass leaks more", text: "That six-character code opens your booking and your co-travellers' details. Cover it before you post." },
    ],
  },
  {
    slug: "usa-winter-forecast-2026-2027",
    postSlug: "usa-winter-forecast-2026-2027",
    title: "5 Forecasters, 14 States, 1 Storm",
    description:
      "NOAA, both almanacs, AccuWeather and the Weather Channel each said something different about winter 2026-2027. We checked every one against real station data, state by state.",
    pages: [
      {
        image: NW + "story-1.jpg",
        alt: "GOES satellite view of a large winter storm system covering the Great Lakes and Midwest, with lake-effect snow bands over Lake Michigan and Lake Erie",
        kicker: "Winter 2026-2027",
        heading: "5 forecasts, 1 storm",
        text: "NOAA, two almanacs, AccuWeather and the Weather Channel. We checked what each one actually said, not what the internet assumed. Image: CSU/CIRA & NOAA.",
      },
      {
        image: NW + "story-3.jpg",
        alt: "A NOAA meteorologist launching a white weather balloon outside a National Weather Service office under a clear blue sky",
        kicker: "Only one is checkable",
        heading: "NOAA shows its work",
        text: "Real balloon launches, real station data, a published model. Both almanacs use a formula they have never fully disclosed.",
      },
      {
        image: NW + "story-2.jpg",
        alt: "NASA satellite image of the Rocky Mountains blanketed in snow across Wyoming, Montana, Colorado, Utah and Idaho",
        kicker: "Colorado & Utah",
        heading: "Split by one mountain range",
        text: "Colorado's own state climatologist says it is too early to call. Utah's NOAA source calls it the hardest state on the map.",
      },
      {
        image: NW + "story-4.jpg",
        alt: "A snow and slush covered residential street in Atlanta, Georgia, with bare trees overhead",
        kicker: "Georgia",
        heading: "8 snow events, maybe",
        text: "A CPC meteorologist told Atlanta News First to expect wetter weather and real ice risk in North Georgia this winter.",
      },
      {
        image: NW + "story-5.jpg",
        alt: "A snow-covered street in downtown Boston at dusk, with tall buildings and illuminated street lamps",
        kicker: "Read the full comparison",
        heading: "14 states, one page",
        text: "Georgia to Washington state, each with NOAA, both almanacs and our own read of which source to actually trust.",
      },
    ],
  },
  {
    slug: "boston-snow-forecast-2026-2027",
    postSlug: "boston-snow-forecast-2026-2027",
    title: "Boston's 17.1 Inches, and 90 Years Before It",
    description:
      "Last winter's February 2026 blizzard dropped 17.1 inches on Logan Airport and set Rhode Island's all-time snow record. Here is how that compares to 90 years of Boston winters, and what a strong El Nino usually does next.",
    pages: [
      {
        image: BOS + "story-1.jpg",
        alt: "A black-and-white archival photo of a car buried in a snow bank outside a Mobil Service station after the Blizzard of 1978 in Boston",
        kicker: "Boston, February 1978",
        heading: "The blizzard that set the bar",
        text: "27.1 inches over two days. Almost 50 years later, Boston has only beaten it once. Photo: City of Boston Archives.",
      },
      {
        image: BOS + "story-2.jpg",
        alt: "A snow blower throws a huge plume of snow across a runway at Boston Logan International Airport as a plane takes off in the background",
        kicker: "Logan Airport",
        heading: "958 flights, cancelled",
        text: "The February 2026 storm alone grounded most of a day's schedule. The official snow count came from right here.",
      },
      {
        image: BOS + "story-3.jpg",
        alt: "A snow-covered downtown Boston street at dusk near Bromfield Street, with tall buildings and illuminated street lamps",
        kicker: "23 February 2026",
        heading: "17.1 inches, one day",
        text: "That is the National Weather Service's own number for Logan Airport. Towns south of the city saw more than double it.",
      },
      {
        image: BOS + "story-4.jpg",
        alt: "A snow-covered street at night in Providence, Rhode Island, with illuminated shop signs and a person walking through the snow",
        kicker: "Next door",
        heading: "Rhode Island's record fell",
        text: "The same February storm dropped 37.9 inches on Providence, a new all-time state record. Photo from a similar 2015 nor'easter.",
      },
      {
        image: BOS + "story-5.jpg",
        alt: "The golden dome of the Massachusetts State House seen across a snow-covered Boston Common park",
        kicker: "Read the full forecast",
        heading: "So what happens next winter?",
        text: "Strong El Nino winters here have run from 20 to 91 percent of normal. We pulled all seven to find out.",
      },
    ],
  },
  {
    slug: "does-it-snow-in-florida",
    postSlug: "does-it-snow-in-florida",
    title: "Does It Snow in Florida? Yes, Actually",
    description:
      "Florida has recorded snow at least seven times since the 1800s, most recently a state record 8.9 inches at Pensacola in January 2025. Here is the real history, city by city.",
    pages: [
      {
        image: FL + "story-1.jpg",
        alt: "A snow-covered car in Niceville, Florida with the date January 21, 2025 written into the snow on the windshield",
        kicker: "Florida, January 2025",
        heading: "Yes, it really snowed here",
        text: "Written into the snow itself: January 21, 2025. Not a typo, not an old photo. Photo: Dane314pizza, CC0.",
      },
      {
        image: FL + "story-2.jpg",
        alt: "A snow-covered field with bare trees under a clear blue sky in Century, Florida",
        kicker: "Century",
        heading: "10 inches, the storm's highest total",
        text: "This panhandle town took the deepest snow of the whole event. Photo: Necroticneurotic, CC0.",
      },
      {
        image: FL + "story-3.jpg",
        alt: "A whiteout snowstorm on a street in Milton, Florida with a palm tree visible through the blowing snow",
        kicker: "Milton",
        heading: "A palm tree, in a blizzard",
        text: "Milton reported up to 10 inches, the same storm that set Pensacola's official state record next door. Photo: Jesselikesweather, CC BY-SA.",
      },
      {
        image: FL + "story-4.jpg",
        alt: "A Tallahassee restaurant with a light dusting of snow on its roof, Spanish moss hanging from the oak trees behind it",
        kicker: "Tallahassee",
        heading: "Even the state capital got snow",
        text: "Tallahassee also holds Florida's coldest verified temperature on record, set back in 1899. Photo: The Bushranger, CC BY-SA.",
      },
      {
        image: FL + "story-5.jpg",
        alt: "A NOAA Climate.gov map showing snowfall records broken at weather stations across the southeastern United States in January 2025",
        kicker: "Read the full guide",
        heading: "How rare is this, really?",
        text: "Seven documented snow events since 1800, and a city-by-city breakdown of who actually gets it. See the full record.",
      },
    ],
  },
  {
    slug: "how-accurate-are-weather-forecasts-for-snowfall",
    postSlug: "how-accurate-are-weather-forecasts-for-snowfall",
    title: "Snow Forecasts: Accurate to 1.7 Inches, Or 2.5",
    description:
      "Real station data on how accurate a snow forecast actually is by lead time, why totals vary a mile apart, and why big storms get under-forecast the most.",
    pages: [
      {
        image: SA + "story-1.jpg",
        alt: "A WSR-88D NEXRAD weather radar tower under mammatus clouds at sunset near Sterling, Virginia",
        kicker: "Snow forecast accuracy",
        heading: "1.7 inches off, one day out",
        text: "That is the real average error, based on 754 station comparisons. Nobody prints that number. We did. Photo: Famartin, CC BY-SA.",
      },
      {
        image: SA + "story-2.jpg",
        alt: "NOAA incident meteorologists launching a weather balloon during training, with support vehicles behind them",
        kicker: "Where the data comes from",
        heading: "It starts with a balloon",
        text: "Weather balloons, radar and satellites feed every model a snow forecast depends on. Photo: NOAA.",
      },
      {
        image: SA + "story-3.jpg",
        alt: "A green USDA snow course marker station in a snow-covered forest below a mountain peak",
        kicker: "Ground truth",
        heading: "This is what gets measured",
        text: "Stations like this one are how a forecast gets checked against what actually fell. Photo: USDA NRCS Montana.",
      },
      {
        image: SA + "story-4.jpg",
        alt: "The brick National Weather Service forecast office building for Northern Indiana, with an American flag out front",
        kicker: "The source that matters",
        heading: "Free, and no login required",
        text: "The National Weather Service's own point forecast beats most apps inside a week. Photo: Chris Light, CC BY-SA.",
      },
      {
        image: SA + "story-5.jpg",
        alt: "NASA satellite image of snow cutting across the Great Lakes and northeastern United States on 13 February 2026",
        kicker: "Read the full guide",
        heading: "The bigger the storm, the bigger the miss",
        text: "Storms over 10 inches got under-forecast the most. See the full lead-time data and why.",
      },
    ],
  },
  {
    slug: "buffalo-snow-forecast-2026-2027",
    postSlug: "buffalo-snow-forecast-2026-2027",
    title: "Buffalo Snow: Airport vs. the Real Number",
    description:
      "Buffalo's airport averages 95 inches a season, but the southern suburbs have measured 65 inches in a single storm. The real, sourced record behind both numbers.",
    pages: [
      {
        image: BUF + "story-1.jpg",
        alt: "Dump trucks unloading snow at Central Terminal after the December 2022 Buffalo blizzard, with the terminal's tower visible in the background",
        kicker: "Buffalo, December 2022",
        heading: "50 inches, at the airport alone",
        text: "The Elliott blizzard buried the city for five days straight. Photo: Andre Carrotflower, CC BY-SA.",
      },
      {
        image: BUF + "story-2.jpg",
        alt: "A City of Buffalo sign in a whiteout snowstorm at night during the November 2014 Snowvember lake-effect event",
        kicker: "Snowvember, 2014",
        heading: "The airport saw 17 inches",
        text: "A few miles south, South Cheektowaga measured 65. Same storm, two different storms. Photo: Anthony Quintano, CC BY.",
      },
      {
        image: BUF + "story-3.jpg",
        alt: "A skid-steer loader clearing a massive pile of plowed snow in a Burger King parking lot after the December 2022 Buffalo blizzard",
        kicker: "The cleanup",
        heading: "Where do you even put it all",
        text: "Snow got trucked out of the city and dumped at Central Terminal by the ton. Photo: Andre Carrotflower, CC BY-SA.",
      },
      {
        image: BUF + "story-4.jpg",
        alt: "A car completely buried under a smooth mound of snow on a residential street in Buffalo, New York",
        kicker: "January 2022",
        heading: "Somewhere under here is a car",
        text: "An ordinary lake-effect week, not even one of the famous storms. Photo: Andre Carrotflower, CC BY-SA.",
      },
      {
        image: BUF + "story-5.jpg",
        alt: "A light dusting of the season's first snow on a residential street in Buffalo, New York in late November",
        kicker: "Read the full guide",
        heading: "It all starts this quietly",
        text: "December and January carry more than half the season. See the real month-by-month numbers.",
      },
    ],
  },
  {
    slug: "snow-predictions-for-kentucky-2026-2027",
    postSlug: "snow-predictions-for-kentucky-2026-2027",
    title: "Kentucky Snow: 22 Inches, or 9?",
    description:
      "Louisville's 10-year average is 9 inches a winter. Lexington's is 10.3. Then 2024-25 gave both cities over 21. What 150 years of real records show.",
    pages: [
      {
        image: KY + "story-1.jpg",
        alt: "Snow-covered benches and the Gracehoper sculpture at Waterfront Park in Louisville, Kentucky, with the Ohio River bridges behind it",
        kicker: "Kentucky 2026-27",
        heading: "A record El Nino is coming",
        text: "NOAA gives it a greater than 90% chance. But the Ohio Valley gets no confident temperature lean either way. Photo: William Alden, CC BY-SA.",
      },
      {
        image: KY + "story-2.jpg",
        alt: "A frost and snow covered rural road through the Bluegrass region of Kentucky, lined with bare winter trees",
        kicker: "Central Kentucky",
        heading: "Lexington averages 14 inches",
        text: "Under the 30-year NWS normal, concentrated almost entirely in January and February. Photo: PEO ACWA, CC BY.",
      },
      {
        image: KY + "story-3.jpg",
        alt: "A Kentucky National Guard Humvee stopped beside a jack-knifed semi truck buried in snow on Interstate 75",
        kicker: "On the road",
        heading: "I-75 gets caught off guard",
        text: "Kentucky's snow events are short and sharp, not steady. This is January 2016. Photo: The National Guard, CC BY.",
      },
      {
        image: KY + "story-4.jpg",
        alt: "A car almost completely buried under a deep snowdrift outside a house in Paducah, Kentucky",
        kicker: "Western Kentucky",
        heading: "Louisville's end averages 9 inches",
        text: "The mildest of the state's three snow regions. This is Paducah, December 2004. Photo: Beau Dodson, public domain.",
      },
      {
        image: KY + "story-5.jpg",
        alt: "Children sledding down a snow-covered hill in Kentucky, with a house and bare trees in the background",
        kicker: "Read the full guide",
        heading: "2024-25 was the decade's snowiest",
        text: "22.1 inches at Louisville, 21.6 at Lexington. See the full 10-year, city-by-city history.",
      },
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
