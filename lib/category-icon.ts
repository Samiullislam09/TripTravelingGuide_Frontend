import {
  Lightbulb,
  MapPin,
  Plane,
  Utensils,
  Mountain,
  Building2,
  Hotel,
  Compass,
  Camera,
  Waves,
  Car,
  Ship,
  PartyPopper,
  CloudSun,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Pick a contextual travel icon from keywords in a category slug/name.
 * Shared by the hero category tiles and the CategoryShowcase section so both
 * always decorate a category the same way. Ordered most-specific first so each
 * real category (road-trips, ship-travel, air-travel, weather-for-traveling,
 * event, travel-tricks, traveling-best-places) gets its own distinct icon.
 */
export function iconForCategory(slug: string): LucideIcon {
  const s = slug.toLowerCase();
  if (/(food|eat|cuisine|dining|restaurant|taste)/.test(s)) return Utensils;
  if (/(weather|climate|snow|rain|season|forecast|temperature)/.test(s)) return CloudSun;
  if (/(ship|cruise|boat|ferry|sail|marine|voyage)/.test(s)) return Ship;
  if (/(road|drive|car|route|roadtrip|highway)/.test(s)) return Car;
  if (/(event|festival|concert|party|celebrat|carnival)/.test(s)) return PartyPopper;
  if (/(beach|coast|island|sea|ocean|surf|dive)/.test(s)) return Waves;
  if (/(mountain|hike|trek|trail|alp|peak|ski)/.test(s)) return Mountain;
  if (/(hotel|stay|resort|lodge|accommodation|room)/.test(s)) return Hotel;
  if (/(city|urban|town|metro)/.test(s)) return Building2;
  if (/(photo|camera|scenic|sight)/.test(s)) return Camera;
  if (/(trick|hack)/.test(s)) return Wand2;
  if (/(flight|fly|air|airport)/.test(s)) return Plane;
  if (/(tip|advice|idea|inspiration|plan|guide)/.test(s)) return Lightbulb;
  if (/(map|region|explore|adventure|place|destination|country|best)/.test(s)) return MapPin;
  return Compass;
}
