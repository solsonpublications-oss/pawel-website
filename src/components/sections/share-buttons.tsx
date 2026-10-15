"use client";

import { useSyncExternalStore, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Linkedin, Link2, Check, Share2 } from "lucide-react";

// Client-only snapshots via useSyncExternalStore — avoids the
// React 19 set-state-in-effect rule and prevents hydration mismatch.
const noopSubscribe = () => () => {};
const readShareUrl = () =>
  typeof window !== "undefined" ? window.location.href : "";
const readCanNativeShare = () =>
  typeof navigator !== "undefined" && !!navigator.share;

/**
 * ShareButtons — social share row for the final CTA.
 * Uses intent URLs for X (Twitter) and LinkedIn, and clipboard copy
 * with a 2s "copied" confirmation. Falls back gracefully if the
 * Web Share API is available (native sheet) — a dedicated "Share" button
 * triggers it on capable devices.
 */
export function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const shareUrl = useSyncExternalStore(noopSubscribe, readShareUrl, () => "");
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    readCanNativeShare,
    () => false,
  );

  const shareText =
    "Algorithm of the Future by Pawel Kozycz — a neo-evolutionary manifesto. EvmDNA < Eskm1DAA.";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  const onNativeShare = async () => {
    try {
      await navigator.share({
        title: "Algorithm of the Future — Pawel Kozycz",
        text: shareText,
        url: shareUrl,
      });
    } catch {
      /* user dismissed — no-op */
    }
  };

  const btnClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-glow/20 bg-cosmos-surface/50 text-stardust-dim backdrop-blur-sm transition-all duration-300 hover:border-cyan-glow/50 hover:bg-cyan-glow/10 hover:text-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="mr-1 font-mono-proto text-[10px] uppercase tracking-[0.25em] text-stardust-dim">
          Share the Algorithm
        </span>
        {canNativeShare ? (
          <button
            type="button"
            onClick={onNativeShare}
            aria-label="Share via device"
            className={btnClass}
          >
            <Share2 className="h-4 w-4" />
          </button>
        ) : null}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (Twitter)"
          className={btnClass}
        >
          <Twitter className="h-4 w-4" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className={btnClass}
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy link to clipboard"
          className={btnClass}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="h-4 w-4 text-gold-glow" />
              </motion.span>
            ) : (
              <motion.span
                key="link"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link2 className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <AnimatePresence>
        {copied ? (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-gold-glow"
          >
            ✓ Link copied
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
