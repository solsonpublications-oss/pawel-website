"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SectionProgressIndicator — a small fixed element (bottom-right on desktop,
 * hidden on mobile to avoid clutter with the sticky buy button) that shows:
 *   - The current section's name
 *   - A mini progress bar for how far through that section the user is
 *
 * Complements the global CosmicProgressBar (which shows overall page progress).
 * Hidden until the user scrolls past the hero, and hidden again near the
 * final CTA (#buy) to avoid overlap with its content.
 */

const SECTIONS = [
  { id: "book", label: "The Book" },
  { id: "equation", label: "The Equation" },
  { id: "concepts", label: "Concepts" },
  { id: "chapters", label: "Chapters" },
  { id: "author", label: "The Author" },
  { id: "praise", label: "Praise" },
  { id: "faq", label: "FAQ" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function SectionProgressIndicator() {
  const [active, setActive] = useState<SectionId | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 within the active section
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // hide until past hero, hide near final CTA
      const pastHero = scrollY > vh * 0.9;
      const buyEl = document.getElementById("buy");
      const nearBuy = buyEl
        ? buyEl.getBoundingClientRect().top < vh * 0.5
        : false;
      setVisible(pastHero && !nearBuy);

      // find the active section: the one whose top is closest to 35% viewport
      let best: SectionId | null = null;
      let bestDist = Infinity;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        const dist = Math.abs(top - vh * 0.35);
        if (dist < bestDist) {
          bestDist = dist;
          best = s.id;
        }
      }
      setActive(best);

      // compute progress within the active section
      if (best) {
        const el = document.getElementById(best);
        if (el) {
          const rect = el.getBoundingClientRect();
          const sectionHeight = rect.height;
          const scrolledIntoSection = Math.max(0, -rect.top);
          const p = sectionHeight > 0
            ? Math.min(1, Math.max(0, scrolledIntoSection / sectionHeight))
            : 0;
          setProgress(p);
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const activeLabel = SECTIONS.find((s) => s.id === active)?.label ?? "";

  return (
    <AnimatePresence>
      {visible && active ? (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-none fixed bottom-4 right-4 z-40 hidden lg:block"
          aria-hidden="true"
        >
          <div className="flex items-center gap-2.5 rounded-full border border-cyan-glow/20 bg-cosmos-deep/80 px-3.5 py-2 backdrop-blur-md">
            {/* mini orbital dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-glow/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-glow" />
            </span>
            {/* section label */}
            <span className="font-mono-proto text-[10px] uppercase tracking-[0.25em] text-stardust">
              {activeLabel}
            </span>
            {/* mini progress bar */}
            <span className="relative h-0.5 w-16 overflow-hidden rounded-full bg-cyan-glow/15">
              <motion.span
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-glow to-gold-glow"
                animate={{ width: `${progress * 100}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
