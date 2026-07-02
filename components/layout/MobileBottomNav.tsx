"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, PlayCircle, Newspaper, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  action?: () => void;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: Home, href: "/" },
  { key: "articles", label: "Articles", icon: Newspaper, href: "/blog" },
  { key: "explore", label: "Explore", icon: Compass, href: "/explore" },
  { key: "search", label: "Search", icon: Search, href: "/search" },
  { key: "stories", label: "Stories", icon: PlayCircle, href: "/web-stories" },
];

function isItemActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileBottomNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden glass border-t border-line bg-surface/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-soft"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(pathname, item.href);

          const inner = (
            <span
              className={cn(
                "relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-[11px] font-medium transition-colors duration-300",
                active ? "text-brand-600" : "text-ink-400"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-brand-600 transition-all duration-300 ease-out",
                  active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  active ? "scale-110" : "scale-100"
                )}
                strokeWidth={active ? 2.4 : 2}
                aria-hidden="true"
              />
              <span className="leading-none">{item.label}</span>
            </span>
          );

          return (
            <li key={item.key} className="flex flex-1">
              {item.href ? (
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-1 items-stretch rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-0"
                >
                  {inner}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-label={item.label}
                  onClick={item.action}
                  className="flex flex-1 items-stretch rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-0"
                >
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
