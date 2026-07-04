"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Single registration point for the GSAP plugins used sitewide. Import
// { gsap, ScrollTrigger } from here everywhere so the plugin is only
// registered once and tree-shaking stays predictable.
//
// MotionPathPlugin is intentionally NOT registered here: it's only used by the
// homepage-only <FlightPath> animation (see lib/gsap-motion-path.ts), and this
// module is imported by the sitewide <MotionRoot>, i.e. every single route.
// Keeping MotionPathPlugin out of it means every non-homepage page (all blog
// posts, category pages, etc.) never downloads that plugin's code at all.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
