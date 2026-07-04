"use client";

import dynamic from "next/dynamic";
import { Container } from "@/components/ui/Container";

// FlightPath is a purely decorative (aria-hidden), below-the-fold GSAP
// MotionPath animation used only on the homepage. Loading it via next/dynamic
// with ssr:false splits it (plus the MotionPathPlugin it pulls in) into its
// own chunk that's fetched after hydration instead of being parsed as part of
// the homepage's initial JS bundle — it has no content worth server-rendering
// anyway. The placeholder below reserves the same rounded band so nothing
// jumps once the real component mounts.
const FlightPath = dynamic(() => import("./FlightPath"), {
  ssr: false,
  loading: () => (
    <section className="py-8 sm:py-12" aria-hidden>
      <Container>
        <div className="h-[220px] w-full animate-pulse rounded-5xl border border-line bg-brand-soft sm:h-[260px]" />
      </Container>
    </section>
  ),
});

export default FlightPath;
