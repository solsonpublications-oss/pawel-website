"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks, type BookmarkType } from "@/hooks/use-bookmarks";

/**
 * BookmarkButton — a compact toggle that adds/removes an item from the
 * user's localStorage bookmarks. Used on concept cards and concept
 * deep-dive modals. Icon + fill state reflect bookmarked status.
 *
 * Click is stopPropagation'd so it doesn't trigger the parent button's
 * onClick (e.g. opening a modal).
 */
export function BookmarkButton({
  id,
  type,
  title,
  source,
  size = "md",
  className = "",
}: {
  id: string;
  type: BookmarkType;
  title: string;
  source: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const { has, toggle } = useBookmarks();
  const isBookmarked = has(id);

  const sizeClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggle({ id, type, title, source });
      }}
      aria-label={isBookmarked ? `Remove ${title} from bookmarks` : `Bookmark ${title}`}
      aria-pressed={isBookmarked}
      className={`inline-flex ${sizeClass} items-center justify-center rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60 ${
        isBookmarked
          ? "border-gold-glow/50 bg-gold-glow/15 text-gold-glow"
          : "border-cyan-glow/20 bg-cosmos-deep/40 text-stardust-dim hover:border-cyan-glow/50 hover:text-cyan-glow"
      } ${className}`}
      title={isBookmarked ? "Bookmarked" : "Bookmark this"}
    >
      {isBookmarked ? (
        <BookmarkCheck className={`${iconClass} fill-gold-glow/30`} />
      ) : (
        <Bookmark className={iconClass} />
      )}
    </button>
  );
}
