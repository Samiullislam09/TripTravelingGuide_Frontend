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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Pick a contextual travel icon from keywords in a category slug/name.
 * Shared by the hero category tiles and the CategoryShowcase section so both
 * always decorate a category the same way. Falls back to a compass.
 */
export function iconForCategory(slug: string): LucideIcon {
  const s = slug.toLowerCase();
  if (/(food|eat|cuisine|drink|restaurant|dining|taste)/.test(s)) return Utensils;
  if (/(beach|coast|island|sea|ocean|surf|dive)/.test(s)) return Waves;
  if (/(mountain|hike|trek|trail|alp|peak|ski)/.test(s)) return Mountain;
  if (/(hotel|stay|resort|lodge|accommodation|room)/.test(s)) return Hotel;
  if (/(city|urban|town|metro)/.test(s)) return Building2;
  if (/(photo|camera|view|scenic|sight)/.test(s)) return Camera;
  if (/(tip|tips|advice|hack|idea|inspiration|plan|guide)/.test(s)) return Lightbulb;
  if (/(flight|fly|air|transport|destination|place|country)/.test(s)) return Plane;
  if (/(map|region|explore|adventure)/.test(s)) return MapPin;
  return Compass;
}
