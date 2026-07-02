import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-brand-soft px-5 text-center">
      <div className="blob -left-20 -top-16 h-72 w-72 animate-blob-spin bg-brand-300" />
      <div className="blob bottom-0 right-0 h-64 w-64 animate-float bg-pink-400/40" />

      <div className="relative">
        <p className="font-display text-[5.5rem] font-extrabold leading-none text-gradient sm:text-[7rem]">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">
          This trip took a wrong turn
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink-500">
          The page you&apos;re looking for doesn&apos;t exist or was moved. Let&apos;s
          get you back on the map.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary px-7 py-3.5">
            <Home className="h-4 w-4" /> Back home
          </Link>
          <Link href="/search" className="btn-outline px-7 py-3.5">
            <Search className="h-4 w-4" /> Search guides
          </Link>
        </div>
      </div>
    </main>
  );
}
