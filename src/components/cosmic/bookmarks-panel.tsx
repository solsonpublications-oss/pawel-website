"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, X, Trash2, BookOpen, Lightbulb, Share2, Check, Link2 } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { BUY_URL } from "@/lib/site-data";

/**
 * BookmarksPanel — a floating bookmark button (bottom-right, desktop only
 * — above the section-progress indicator which sits at bottom-4 right-4;
 * this sits higher at bottom-16) that opens a slide-over panel listing
 * the user's bookmarked concepts and chapters (stored in localStorage).
 *
 * Features: add/remove bookmarks (via BookmarkButton elsewhere), shareable
 * links (export/import via URL hash), clear all, buy CTA.
 *
 * Hidden when there are no bookmarks (unless the panel is open) to avoid
 * clutter on first visit.
 */
export function BookmarksPanel() {
  const { list, remove, clear, exportHash, importHash } = useBookmarks();
  const [open, setOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imported, setImported] = useState(0);

  // Avoid SSR hydration mismatch: only render the floating button after mount
  // (localStorage is client-only). setState inside setTimeout (async) so no
  // set-state-in-effect lint violation.
  useEffect(() => {
    const id = setTimeout(() => {
      setHasMounted(true);
      // Auto-import bookmarks from URL hash on first mount (if present).
      // Lets users share curated reading lists via a URL.
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash && hash.includes("bookmarks=")) {
        const count = importHash(hash);
        if (count > 0) {
          setImported(count);
          // open the panel to show the imported bookmarks
          setOpen(true);
          // clear the hash so it doesn't re-import on refresh
          if (typeof window !== "undefined") {
            history.replaceState(null, "", window.location.pathname + window.location.search);
          }
          // dismiss the "imported" badge after 4s
          setTimeout(() => setImported(0), 4000);
        }
      }
    }, 0);
    return () => clearTimeout(id);
  }, [importHash]);

  const onShare = async () => {
    const hash = exportHash();
    if (!hash) return;
    const url = typeof window !== "undefined" ? window.location.origin + window.location.pathname + hash : hash;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link to share your reading list:", url);
    }
  };

  if (!hasMounted) return null;

  const showButton = list.length > 0 || open;

  return (
    <>
      {/* floating trigger button (desktop only, above section-progress) */}
      {showButton ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open your reading list (${list.length} bookmarked)`}
          className="fixed bottom-16 right-4 z-40 hidden h-10 w-10 items-center justify-center rounded-full border border-gold-glow/30 bg-cosmos-deep/80 text-gold-glow backdrop-blur-md transition-all hover:border-gold-glow/60 hover:bg-gold-glow/10 hover:scale-105 lg:flex"
        >
          <Bookmark className="h-4 w-4 fill-gold-glow/30" />
          {list.length > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-glow px-1 font-mono-proto text-[9px] font-bold text-cosmos-deep">
              {list.length}
            </span>
          ) : null}
          <span className="absolute inset-0 -z-10 rounded-full bg-gold-glow/20 blur-md" />
        </button>
      ) : null}

      {/* slide-over panel */}
      <AnimatePresence>
        {open ? (
          <>
            {/* overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-cosmos-deep/70 backdrop-blur-sm"
            />
            {/* panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-sm flex-col border-l border-cyan-glow/20 bg-cosmos-deep/95 backdrop-blur-xl"
              role="dialog"
              aria-label="Your reading list"
            >
              {/* header */}
              <div className="flex items-center justify-between border-b border-cyan-glow/15 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-gold-glow" />
                  <h3 className="font-display text-base font-bold text-stardust">
                    Your Reading List
                  </h3>
                  {list.length > 0 ? (
                    <span className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-gold-glow">
                      {list.length}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5">
                  {list.length > 0 ? (
                    <button
                      type="button"
                      onClick={onShare}
                      aria-label="Share your reading list"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-glow/20 text-stardust-dim transition-colors hover:border-cyan-glow/50 hover:text-cyan-glow"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-gold-glow" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close reading list"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-glow/20 text-stardust-dim transition-colors hover:border-cyan-glow/50 hover:text-cyan-glow"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* imported notification */}
              <AnimatePresence>
                {imported > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-gold-glow/25 bg-gold-glow/10 px-3 py-2 text-xs text-gold-glow">
                      <Link2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Imported {imported} bookmark{imported === 1 ? "" : "s"} from shared link.</span>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* copied notification */}
              <AnimatePresence>
                {copied ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-cyan-glow/25 bg-cyan-glow/10 px-3 py-2 text-xs text-cyan-glow">
                      <Check className="h-3.5 w-3.5 shrink-0" />
                      <span>Shareable link copied to clipboard.</span>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* list */}
              <div className="cosmic-scroll flex-1 overflow-y-auto px-5 py-4">
                {list.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-glow/20 bg-cosmos-surface/40 text-cyan-glow/60">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-stardust-dim">
                      No bookmarks yet.
                    </p>
                    <p className="text-xs leading-relaxed text-stardust-dim/70">
                      Tap the bookmark icon on any concept or chapter to save
                      it here for later.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {list.map((b) => (
                      <motion.li
                        key={b.id}
                        layout
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.25 }}
                        className="group relative flex items-start gap-3 rounded-xl border border-cyan-glow/12 bg-cosmos-surface/40 p-3 transition-colors hover:border-cyan-glow/25"
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${b.type === "concept" ? "border-cyan-glow/30 text-cyan-glow" : "border-gold-glow/30 text-gold-glow"}`}>
                          {b.type === "concept" ? (
                            <Lightbulb className="h-3.5 w-3.5" />
                          ) : (
                            <BookOpen className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm font-medium text-stardust">
                            {b.title}
                          </p>
                          <p className="mt-0.5 truncate font-mono-proto text-[10px] uppercase tracking-[0.15em] text-stardust-dim">
                            {b.source}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(b.id)}
                          aria-label={`Remove ${b.title} from bookmarks`}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-stardust-dim/50 transition-colors hover:bg-red-500/15 hover:text-red-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {/* footer */}
              {list.length > 0 ? (
                <div className="border-t border-cyan-glow/15 px-5 py-4">
                  <a
                    href={BUY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-cosmos-deep transition-transform hover:scale-[1.02]"
                    style={{
                      background:
                        "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
                    }}
                  >
                    <BookOpen className="h-4 w-4" />
                    Read the book
                  </a>
                  <button
                    type="button"
                    onClick={clear}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-cyan-glow/15 px-4 py-2 text-xs font-medium text-stardust-dim transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear all bookmarks
                  </button>
                </div>
              ) : null}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
