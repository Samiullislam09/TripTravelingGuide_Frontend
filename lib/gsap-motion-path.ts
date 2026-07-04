"use client";

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Registers MotionPathPlugin — used ONLY by the homepage-only <FlightPath>
// "flying plane" animation. Deliberately kept out of lib/gsap.ts (which the
// sitewide <MotionRoot> imports on every route) so this plugin's code is never
// fetched on pages that don't render <FlightPath>, i.e. every page except "/".
if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

export { MotionPathPlugin };
