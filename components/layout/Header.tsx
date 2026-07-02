"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/blog" },
  { label: "Explore", href: "/explore" },
  { label: "Best Places", href: "/category/traveling-best-places" },
  { label: "Road Trips", href: "/category/road-trips" },
  { label: "Web Stories", href: "/web-stories" },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Frosted header after a small scroll threshold.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll + ESC-to-close while the mobile drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "glass border-b border-line"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href="/"
          aria-label="TripTravelingGuide home"
          className="group flex items-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <Image
            src="/logo.png"
            alt="TripTravelingGuide"
            width={431}
            height={121}
            priority
            className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
                  active
                    ? "bg-brand-50 text-brand-600"
                    : "text-ink-700 hover:bg-ink-50 hover:text-brand-600"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <Link
            href="/#newsletter"
            className="brand-fill hidden items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 sm:inline-flex"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Subscribe
          </Link>

          <Link
            href="/search"
            aria-label="Search posts"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-line bg-surface shadow-soft transition-all duration-300 lg:hidden",
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        )}
        aria-hidden={!menuOpen}
      >
        <Container className="flex flex-col gap-1 py-4">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_ITEMS.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={menuOpen ? 0 : -1}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
                    active
                      ? "bg-brand-50 text-brand-600"
                      : "text-ink-700 hover:bg-ink-50 hover:text-brand-600"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-2 flex flex-col gap-2">
            <Link
              href="/#newsletter"
              tabIndex={menuOpen ? 0 : -1}
              className="brand-fill inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-base font-semibold text-white transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Subscribe
            </Link>
            <Link
              href="/search"
              tabIndex={menuOpen ? 0 : -1}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-base font-semibold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              Search posts
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}

export default Header;
