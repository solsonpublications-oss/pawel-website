"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Layers,
  FileText,
  Sparkles,
  Languages,
  type LucideIcon,
} from "lucide-react";

type Spec = { icon: LucideIcon; value: string; label: string; tone: "cyan" | "gold" };

const SPECS: Spec[] = [
  { icon: BookOpen, value: "22", label: "Chapters", tone: "cyan" },
  { icon: Layers, value: "5", label: "Parts", tone: "gold" },
  { icon: FileText, value: "246", label: "Pages", tone: "cyan" },
  { icon: Sparkles, value: "Expanded", label: "Edition", tone: "gold" },
  { icon: Languages, value: "4", label: "Languages", tone: "cyan" },
];

export function BookSpecsStrip() {
  return (
    <section
      aria-label="Book specifications"
      className="relative px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto max-w-6xl"
      >
        <div className="relative overflow-hidden rounded-2xl border border-cyan-glow/15 glass-panel">
          {/* faint scanline that drifts across on entry */}
          <motion.span
            aria-hidden="true"
            initial={{ x: "-120%" }}
            whileInView={{ x: "120%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.15 200 / 0.10), transparent)",
            }}
          />

          <ul className="grid grid-cols-2 divide-x divide-y divide-cyan-glow/10 sm:grid-cols-5 sm:divide-y-0">
            {SPECS.map((s, i) => {
              const Icon = s.icon;
              const isGold = s.tone === "gold";
              const accent = isGold
                ? "oklch(0.82 0.14 85)"
                : "oklch(0.78 0.15 200)";
              return (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative flex flex-col items-center justify-center gap-1.5 px-4 py-5 text-center"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border bg-cosmos-deep/50 transition-colors duration-300 group-hover:bg-cosmos-deep/80"
                  style={{
                    borderColor: `oklch(${isGold ? "0.82 0.14 85" : "0.78 0.15 200"} / 0.35)`,
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: accent }}
                  />
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-display text-xl font-bold sm:text-2xl"
                    style={{ color: accent }}
                  >
                    {s.value}
                  </span>
                </div>
                <span className="font-mono-proto text-[9px] uppercase tracking-[0.25em] text-stardust-dim sm:text-[10px]">
                  {s.label}
                </span>
              </motion.li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
