import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { site, absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseGraph } from "@/lib/seo/schema";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: absoluteUrl("/"),
    // Default share image for the homepage and any page without its own cover.
    images: [
      { url: absoluteUrl(site.ogImage), width: 1200, height: 630, alt: site.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [absoluteUrl(site.ogImage)],
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  ...(site.verification.google
    ? { verification: { google: site.verification.google } }
    : {}),
  // Favicon + apple-touch icon come from app/icon.jpg and app/apple-icon.jpg
  // via Next's file-based icon conventions.
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Open the TCP + TLS handshake to the ad and analytics origins while the
            page is still parsing. These scripts load later by design (see the
            strategies below), so without this the connection setup happens
            serially at the moment they are requested. Costs nothing and does not
            change when anything executes. */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com" />

        {/* Sitewide Organization + WebSite schema — present on every page. */}
        <JsonLd data={baseGraph()} />
        {/* Google AdSense — loads the library for the manual <AdSlot> units.
            NOTE: do not add a code-side `enable_page_level_ads: false` push here.
            When the AdSense account has (or ever had) Auto ads/ad formats enabled,
            Google's own script already pushes its page-level-ads config
            internally — a second manual push throws an uncaught
            "Only one enable_page_level_ads allowed per page" TagError on every
            page load, which can also stop the real <AdSlot> units below from
            rendering. Auto Ads placement must be turned off from the AdSense
            dashboard itself (Sites > Auto ads, and check individual formats like
            Anchor/Vignette/In-page — the master toggle doesn't always cover all
            of them, and changes can take up to 24-48h to propagate). */}
        {site.analytics.adsenseClient ? (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.analytics.adsenseClient}`}
          />
        ) : null}

        {/* Google Analytics 4 — activates automatically once a Measurement ID is
            set in lib/site.ts (analytics.ga4 = "G-XXXXXXXXXX"). Not needed for
            first paint or interactivity, so it loads with the lowest-priority
            strategy (after the browser goes idle) to keep it off the mobile
            critical path. */}
        {site.analytics.ga4 ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${site.analytics.ga4}`}
              strategy="lazyOnload"
            />
            <Script id="ga4-init" strategy="lazyOnload">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${site.analytics.ga4}');`}
            </Script>
          </>
        ) : null}
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
