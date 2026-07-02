"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { XIcon, FacebookIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

interface ShareBarProps {
  title: string;
  url: string;
  className?: string;
}

const buttonClass =
  "rounded-full size-10 grid place-items-center border border-line bg-surface text-ink-700 transition-colors hover:text-brand-600 hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400";

function absoluteUrl(url: string): string {
  if (url.startsWith("/") && typeof window !== "undefined") {
    return window.location.origin + url;
  }
  return url;
}

export default function ShareBar({ title, url, className }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (value: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        const el = document.createElement("textarea");
        el.value = value;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleNativeShare = async () => {
    const shareUrl = absoluteUrl(url);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      await copyToClipboard(shareUrl);
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(absoluteUrl(url));
  };

  const openIntent = (intentUrl: string) => {
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  };

  const shareUrl = absoluteUrl(url);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const intents = [
    {
      key: "twitter",
      label: "Share on X",
      icon: XIcon,
      onClick: () =>
        openIntent(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`),
    },
    {
      key: "facebook",
      label: "Share on Facebook",
      icon: FacebookIcon,
      onClick: () => openIntent(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`),
    },
    {
      key: "whatsapp",
      label: "Share on WhatsApp",
      icon: WhatsappIcon,
      onClick: () => openIntent(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`),
    },
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      icon: LinkedinIcon,
      onClick: () =>
        openIntent(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`),
    },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="text-sm font-medium text-ink-400">Share</span>

      <button type="button" onClick={handleNativeShare} aria-label="Share this post" className={buttonClass}>
        <Share2 className="size-4" aria-hidden="true" />
      </button>

      {intents.map(({ key, label, icon: Icon, onClick }) => (
        <button key={key} type="button" onClick={onClick} aria-label={label} className={buttonClass}>
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}

      <div className="relative">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className={cn(buttonClass, copied && "text-brand-600 border-brand-400")}
        >
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Link2 className="size-4" aria-hidden="true" />
          )}
        </button>
        {copied && (
          <span
            role="status"
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-gradient px-3 py-1 text-xs font-medium text-white shadow-soft"
          >
            Copied!
          </span>
        )}
      </div>
    </div>
  );
}
