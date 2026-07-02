"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Single registration point for GSAP plugins. Import { gsap, ScrollTrigger,
// MotionPathPlugin } from here everywhere so the plugins are only registered
// once and tree-shaking stays predictable.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

export { gsap, ScrollTrigger, MotionPathPlugin };
