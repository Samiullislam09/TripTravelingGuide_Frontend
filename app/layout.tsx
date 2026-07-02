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
  },
  twitter: { card: "summary_large_image" },
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
        {/* Sitewide Organization + WebSite schema — present on every page. */}
        <JsonLd data={baseGraph()} />
        {/* Google AdSense — loads the library + enables Auto Ads (responsive,
            earnings-optimized placements). Individual <AdSlot> units also use
            this client id. Only injected when a publisher id is configured. */}
        {site.analytics.adsenseClient ? (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.analytics.adsenseClient}`}
          />
        ) : null}
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
