"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, X } from "lucide-react";
import {
  Moon,
  Scale,
  HandHeart,
  Orbit,
  Sprout,
  Feather,
  Layers,
  Atom,
  Eye,
  Sparkles,
  Search,
  Infinity as InfinityIcon,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Moon,
  Scale,
  HandHeart,
  Orbit,
  Sprout,
  Feather,
  Layers,
  Atom,
  Eye,
  Sparkles,
  Search,
  Infinity: InfinityIcon,
};

type RecentEntry = {
  id: string;
  title: string;
  icon: string;
  viewedAt: number;
};

/**
 * RecentlyViewedRow — a "Continue exploring" row shown at the top of the
 * Key Concepts section. Displays the user's most recently opened concept
 * deep-dives as compact clickable chips. Only renders after mount (to avoid
 * SSR hydration mismatch) and only when there are entries.
 *
 * Takes the recent list + an onPick callback (opens the concept deep-dive)
 * + an optional onClear to dismiss the row.
 */
export function RecentlyViewedRow({
  list,
  onPick,
  onClear,
}: {
  list: RecentEntry[];
  onPick: (title: string) => void;
  onClear?: () => void;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  // setTimeout pattern to avoid set-state-in-effect lint rule
  useEffect(() => {
    const id = setTimeout(() => setHasMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!hasMounted || list.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex flex-wrap items-center gap-2 rounded-2xl border border-cyan-glow/12 bg-cosmos-surface/30 p-3 backdrop-blur-sm"
    >
      <span className="mr-1 inline-flex items-center gap-1.5 font-mono-proto text-[10px] uppercase tracking-[0.25em] text-cyan-glow">
        <Clock className="h-3 w-3" />
        Continue exploring
      </span>
      <div className="flex flex-wrap gap-1.5">
        {list.map((entry) => {
          const Icon = ICONS[entry.icon] ?? Sparkles;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onPick(entry.title)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-cyan-glow/15 bg-cosmos-deep/40 px-2.5 py-1 text-xs font-medium text-stardust-dim transition-all hover:border-cyan-glow/40 hover:bg-cyan-glow/10 hover:text-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
            >
              <Icon className="h-3 w-3" />
              {entry.title}
              <ChevronRight className="h-3 w-3 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear recently viewed"
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-stardust-dim/40 transition-colors hover:bg-red-500/15 hover:text-red-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </motion.div>
  );
}
