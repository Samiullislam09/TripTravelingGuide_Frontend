"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Responsive AdSense unit. Renders a real <ins class="adsbygoogle"> and pushes
// it to the ad queue when BOTH a publisher id and a slot id are configured;
// otherwise it shows a clean, correctly-sized responsive placeholder so page
// spacing is right during development. The global loader + Auto Ads live in
// app/layout.tsx. Fully fluid width, so it adapts to phones and desktops.

type AdSlotProps = {
  /** AdSense ad-unit slot id (data-ad-slot). Without it → placeholder. */
  slot?: string;
  /** "auto" (responsive display) | "fluid" (in-article/in-feed) | "autorelaxed" (multiplex). */
  format?: string;
  /** data-ad-layout — e.g. "in-article" for a fluid In-article unit. */
  layout?: string;
  /** data-ad-layout-key — required for In-feed units (from the AdSense unit code). */
  layoutKey?: string;
  className?: string;
  label?: string;
  /** Reserve height so layout doesn't jump before the ad fills. */
  minHeight?: number;
};

export function AdSlot({
  slot,
  format = "auto",
  layout,
  layoutKey,
  className,
  label = "Advertisement",
  minHeight = 100,
}: AdSlotProps) {
  const pushed = useRef(false);
  const ready = Boolean(site.analytics.adsenseClient && slot);

  useEffect(() => {
    if (!ready || pushed.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense not ready yet — Auto Ads / next mount will handle it. */
    }
  }, [ready]);

  // Only responsive display units take full-width-responsive; fluid/multiplex
  // units size themselves and must not receive it.
  const isDisplay = format === "auto";

  return (
    <div className={cn("mx-auto w-full text-center", className)}>
      <p className="mb-1 text-[10px] uppercase tracking-widest text-ink-400">
        {label}
      </p>
      {ready ? (
        <ins
          key={slot}
          className="adsbygoogle block w-full"
          style={{ display: "block", minHeight }}
          data-ad-client={site.analytics.adsenseClient}
          data-ad-slot={slot}
          data-ad-format={format}
          {...(layout ? { "data-ad-layout": layout } : {})}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
          {...(isDisplay ? { "data-full-width-responsive": "true" } : {})}
        />
      ) : (
        <div
          style={{ minHeight }}
          className="flex w-full items-center justify-center rounded-2xl border border-dashed border-line bg-surface-2 px-4 text-xs text-ink-400"
        >
          Ad space
        </div>
      )}
    </div>
  );
}

export default AdSlot;
