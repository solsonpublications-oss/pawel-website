"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Scale,
  TrendingUp,
  Atom,
  Infinity as InfinityIcon,
  Compass,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { READING_PATHS, PARTS } from "@/lib/site-data";

const ICONS: Record<string, LucideIcon> = {
  Moon,
  Scale,
  TrendingUp,
  Atom,
  Infinity: InfinityIcon,
};

/**
 * ReadingPathRecommender — a "Where should I start?" interactive widget for
 * the Chapters section. The reader picks their interest from 5 options; the
 * recommender reveals the best starting Part + a one-line rationale, with a
 * button to jump to that part's detail.
 *
 * Designed for onboarding visitors to a dense 22-chapter book.
 */
export function ReadingPathRecommender({
  onSelectPart,
}: {
  onSelectPart?: (partIndex: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (i: number) => {
    setSelected(i === selected ? null : i);
  };

  const go = () => {
    if (selected !== null) {
      onSelectPart?.(READING_PATHS[selected].partIndex);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold-glow/15 bg-cosmos-surface/30 p-5 backdrop-blur-sm">
      {/* subtle glow */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.14 85 / 0.3), transparent 70%)",
        }}
      />
      {/* header */}
      <div className="relative mb-4 flex items-center gap-2">
        <Compass className="h-4 w-4 text-gold-glow" />
        <h4 className="font-mono-proto text-[10px] uppercase tracking-[0.25em] text-gold-glow">
          Where should I start?
        </h4>
      </div>
      <p className="relative mb-4 text-xs leading-relaxed text-stardust-dim">
        Twenty-two chapters is a lot. Pick what draws you — the book is structured
        so any part can be an entry point.
      </p>

      {/* interest options */}
      <div className="relative flex flex-wrap gap-2">
        {READING_PATHS.map((p, i) => {
          const Icon = ICONS[p.icon] ?? Compass;
          const isSel = i === selected;
          return (
            <button
              key={p.interest}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={isSel}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60 ${
                isSel
                  ? "border-gold-glow/50 bg-gold-glow/10 text-gold-glow"
                  : "border-cyan-glow/15 bg-cosmos-deep/40 text-stardust-dim hover:border-cyan-glow/35 hover:text-stardust"
              }`}
            >
              <Icon className="h-3 w-3" />
              {p.interest}
            </button>
          );
        })}
      </div>

      {/* recommendation reveal */}
      <AnimatePresence>
        {selected !== null ? (
          <motion.div
            key={selected}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative overflow-hidden"
          >
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-gold-glow/20 bg-gradient-to-r from-gold-glow/8 to-transparent p-3">
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-gold-glow">
                  {READING_PATHS[selected].title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-stardust-dim">
                  {READING_PATHS[selected].rationale}
                </p>
                <p className="mt-1.5 font-mono-proto text-[10px] uppercase tracking-[0.2em] text-cyan-glow/70">
                  {PARTS[READING_PATHS[selected].partIndex].part} · {PARTS[READING_PATHS[selected].partIndex].title}
                </p>
              </div>
              <button
                type="button"
                onClick={go}
                className="group inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-cyan-glow to-gold-glow px-3 py-1.5 text-[11px] font-semibold text-cosmos-deep transition-transform hover:scale-[1.03]"
              >
                Go
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
