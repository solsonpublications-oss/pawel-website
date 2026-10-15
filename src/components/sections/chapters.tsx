"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown, BookMarked, Clock, Check } from "lucide-react";
import { PARTS, chapterReadMinutes } from "@/lib/site-data";
import { SectionHeading } from "./section-heading";
import { ReadingPathRecommender } from "./reading-path-recommender";
import { BookmarkButton } from "@/components/cosmic/bookmark-button";
import { useViewedParts } from "@/hooks/use-viewed-parts";

export function Chapters() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const current = PARTS[active];
  const { list: viewedParts, markViewed } = useViewedParts();

  // Mark a part as viewed when it becomes active.
  useEffect(() => {
    markViewed(active);
  }, [active, markViewed]);

  // Listen for concept "appears in" deep-link events (dispatched by the
  // ConceptDeepDive modal when its appearsIn chip is clicked).
  useEffect(() => {
    const onSelect = (e: Event) => {
      const ce = e as CustomEvent<{ partIndex: number }>;
      if (typeof ce.detail?.partIndex === "number") {
        setActive(ce.detail.partIndex);
      }
    };
    window.addEventListener("chapters:select-part", onSelect as EventListener);
    return () =>
      window.removeEventListener("chapters:select-part", onSelect as EventListener);
  }, []);

  return (
    <section id="chapters" className="relative section-pad px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The Architecture of the Argument"
          title={
            <>
              Five parts. Twenty-two chapters.{" "}
              <span className="text-gradient-cyan-gold">One trajectory.</span>
            </>
          }
          description="The articles build logically — from practical lunar economics to ontology, from technology to theology. The progression mirrors the very process the book describes: the movement from hacking matter to comprehensive administration."
        />

        {/* "Where should I start?" recommender — sits above the grid */}
        <div className="mt-10">
          <ReadingPathRecommender onSelectPart={(i) => setActive(i)} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Part selector */}
          <ol className="relative flex flex-col gap-3">
            {/* vertical guide */}
            <div className="absolute left-[1.35rem] top-3 bottom-3 w-px bg-gradient-to-b from-cyan-glow/40 via-gold-glow/30 to-transparent" />

            {/* 5-dot progress stepper — sits above the parts list */}
            <li className="mb-1 flex items-center gap-3 pl-1">
              <span className="font-mono-proto text-[9px] uppercase tracking-[0.25em] text-stardust-dim">
                Progress
              </span>
              <span className="flex items-center gap-1.5">
                {PARTS.map((_, i) => {
                  const isActive = i === active;
                  const isViewed = viewedParts.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Go to ${PARTS[i].part}${isViewed ? " (viewed)" : ""}`}
                      aria-current={isActive ? "step" : undefined}
                      className="group relative flex h-3.5 w-3.5 items-center justify-center"
                    >
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full transition-all duration-300 ${
                          isActive ? "scale-100 bg-cyan-glow/40 animate-ping" : "scale-0"
                        }`}
                      />
                      <motion.span
                        initial={false}
                        animate={{
                          width: isActive ? 16 : 8,
                          height: isActive ? 16 : 8,
                          opacity: isActive ? 1 : isViewed ? 0.85 : 0.35,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative rounded-full"
                        style={{
                          background: isActive
                            ? "oklch(0.82 0.14 85)"
                            : isViewed
                              ? "oklch(0.65 0.15 160)"
                              : "oklch(0.5 0.08 220)",
                          boxShadow: isActive
                            ? "0 0 12px oklch(0.82 0.14 85 / 0.85), 0 0 26px oklch(0.82 0.14 85 / 0.45)"
                            : isViewed
                              ? "0 0 6px oklch(0.65 0.15 160 / 0.6)"
                              : "none",
                        }}
                      />
                    </button>
                  );
                })}
              </span>
              <span className="font-mono-proto text-[9px] uppercase tracking-[0.25em] text-cyan-glow/80">
                {active + 1} / {PARTS.length}
              </span>
              {viewedParts.length > 0 ? (
                <span className="ml-auto inline-flex items-center gap-1 font-mono-proto text-[9px] uppercase tracking-[0.2em] text-stardust-dim/70">
                  <Check className="h-3 w-3 text-cyan-glow/70" />
                  {viewedParts.length}/{PARTS.length} viewed
                </span>
              ) : null}
            </li>

            {PARTS.map((p, i) => {
              const isActive = i === active;
              const isExpanded = i === expanded;
              const isViewed = viewedParts.includes(i);
              const startIdx = PARTS.slice(0, i).reduce(
                (n, part) => n + part.chapters.length,
                0,
              );
              return (
                <li key={p.part}>
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className={`flex items-stretch overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? "border-cyan-glow/40 bg-gradient-to-r from-cyan-glow/10 to-transparent glow-cyan"
                        : "border-cyan-glow/10 bg-cosmos-surface/30 hover:border-cyan-glow/25 hover:bg-cosmos-surface/50"
                    }`}
                  >
                    {/* main select button (body) */}
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className="group flex flex-1 items-center gap-5 p-4 text-left"
                      aria-label={`Select ${p.part}: ${p.title}${isViewed ? " (viewed)" : ""}`}
                    >
                      <span
                        className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-display text-sm font-bold transition-colors ${
                          isActive
                            ? "border-gold-glow/50 bg-cosmos-deep text-gold-glow"
                            : "border-cyan-glow/30 bg-cosmos-deep text-cyan-glow"
                        }`}
                      >
                        {p.part.split(" ")[1]}
                        {isActive ? (
                          <span className="absolute inset-0 -z-10 rounded-full bg-gold-glow/20 blur-md" />
                        ) : null}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-mono-proto text-[10px] uppercase tracking-[0.25em] ${
                              isActive ? "text-gold-glow" : "text-stardust-dim"
                            }`}
                          >
                            {p.part}
                          </p>
                          {isViewed ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full border border-cyan-glow/25 bg-cyan-glow/10 px-1.5 py-0.5 font-mono-proto text-[8px] uppercase tracking-[0.15em] text-cyan-glow/80">
                              <Check className="h-2.5 w-2.5" />
                              viewed
                            </span>
                          ) : null}
                        </div>
                        <h3
                          className={`truncate font-display text-base font-semibold ${
                            isActive ? "text-stardust" : "text-stardust/85"
                          }`}
                        >
                          {p.title}
                        </h3>
                      </div>
                    </button>
                    {/* expand toggle (separate button — avoids nested-button issue) */}
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : i)}
                      aria-label={isExpanded ? `Collapse ${p.part} chapter list` : `Expand ${p.part} chapter list`}
                      aria-expanded={isExpanded}
                      className="flex w-10 shrink-0 items-center justify-center border-l border-cyan-glow/10 text-stardust-dim transition-colors hover:bg-cyan-glow/10 hover:text-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-cyan-glow" : ""
                        }`}
                      />
                    </button>
                  </motion.div>

                  {/* collapsible inline chapter list (quick scan mode) */}
                  <AnimatePresence initial={false}>
                    {isExpanded ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <ol className="ml-12 mt-1 mb-2 space-y-0.5 border-l border-cyan-glow/15 pl-4">
                          {p.chapters.map((ch, j) => {
                            const globalIdx = startIdx + j;
                            const mins = chapterReadMinutes(globalIdx);
                            return (
                              <li
                                key={ch}
                                className="flex items-start gap-2 rounded-md px-1.5 py-1 text-xs text-stardust-dim transition-colors hover:bg-cyan-glow/5 hover:text-stardust"
                              >
                                <span className="mt-0.5 font-mono-proto text-[10px] text-cyan-glow/50">
                                  {String(globalIdx + 1).padStart(2, "0")}
                                </span>
                                <span className="flex-1 leading-relaxed">{ch}</span>
                                <span className="mt-0.5 inline-flex shrink-0 items-center gap-0.5 font-mono-proto text-[9px] text-stardust-dim/50">
                                  <Clock className="h-2.5 w-2.5" />
                                  {mins}m
                                </span>
                              </li>
                            );
                          })}
                        </ol>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>

          {/* Active part detail */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-3xl border border-cyan-glow/15 glass-panel p-6 sm:p-8"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.78 0.15 200 / 0.4), transparent 70%)",
              }}
            />
            <div className="flex items-center gap-3">
              <BookMarked className="h-5 w-5 text-gold-glow" />
              <p className="font-mono-proto text-[11px] uppercase tracking-[0.3em] text-gold-glow">
                {current.part} · {current.chapters.length} chapters
              </p>
              {/* bookmark the current part */}
              <div className="ml-auto">
                <BookmarkButton
                  id={`part:${current.part}`}
                  type="chapter"
                  title={`${current.part}: ${current.title}`}
                  source={`${current.chapters.length} chapters`}
                  size="sm"
                />
              </div>
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold text-stardust sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-stardust-dim">
              {current.summary}
            </p>

            {/* Part reading-time summary + progress bar */}
            {(() => {
              const startIdx = PARTS.slice(0, active).reduce(
                (n, p) => n + p.chapters.length,
                0,
              );
              const partMinutes = current.chapters.reduce(
                (sum, _, j) => sum + chapterReadMinutes(startIdx + j),
                0,
              );
              const partPages = current.chapters.reduce((sum, _, j) => {
                return sum + chapterReadMinutes(startIdx + j);
              }, 0);
              return (
                <div className="mt-4 rounded-xl border border-cyan-glow/10 bg-cosmos-deep/40 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-stardust-dim">
                      <Clock className="h-3.5 w-3.5 text-cyan-glow" />
                      Est. reading time
                    </span>
                    <span className="font-mono-proto text-cyan-glow">
                      ~{partMinutes} min · {partPages} pages
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="my-6 h-px w-full bg-gradient-to-r from-cyan-glow/30 via-transparent to-transparent" />

            <ol className="relative space-y-2.5">
              {current.chapters.map((ch, i) => {
                const globalIdx =
                  PARTS.slice(0, active).reduce(
                    (n, part) => n + part.chapters.length,
                    0,
                  ) + i;
                const mins = chapterReadMinutes(globalIdx);
                return (
                  <motion.li
                    key={ch}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    className="group flex items-start gap-4 rounded-xl p-2 transition-colors hover:bg-cyan-glow/5"
                  >
                    <span className="mt-0.5 font-mono-proto text-xs font-semibold text-cyan-glow/70">
                      {String(globalIdx + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm leading-relaxed text-stardust/85 group-hover:text-stardust">
                      {ch}
                    </span>
                    <span
                      className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-glow/25 bg-cosmos-deep/60 px-2 py-0.5 font-mono-proto text-[10px] font-medium text-cyan-glow/80 transition-colors group-hover:border-cyan-glow/50 group-hover:text-cyan-glow"
                      title={`~${mins} min read`}
                    >
                      <Clock className="h-3 w-3" />
                      {mins}m
                    </span>
                  </motion.li>
                );
              })}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
