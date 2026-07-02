import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      data-reveal
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        isCenter && "sm:flex-col sm:items-center",
      )}
    >
      <div className={cn("max-w-2xl", isCenter && "mx-auto text-center")}>
        {eyebrow ? (
          <span
            className={cn(
              "pill",
              isCenter ? "pill-violet" : "pill-coral",
            )}
          >
            {eyebrow}
          </span>
        ) : null}
        <h2
          className={cn(
            "text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl",
            eyebrow && "mt-4",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-base text-ink-500">{description}</p>
        ) : null}
      </div>

      {action && !isCenter ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}

export default SectionHeading;
