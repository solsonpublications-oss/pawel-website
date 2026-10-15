"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AUTHOR_TIMELINE } from "@/lib/site-data";

/**
 * AuthorTimeline — a horizontally-scrollable cosmic timeline of Pawel
 * Kozycz's 2-year intellectual journey from the MoonNow blog (Feb 2024)
 * to the book's publication (2026).
 *
 * Each milestone is a "creative period" card with a glowing node on a
 * horizontal constellation track. Left/right scroll buttons appear on
 * desktop; on touch the track scrolls natively (overflow-x-auto).
 *
 * Subtle gradient fade cues on the left/right edges signal that more
 * content is scrollable in that direction — the cue fades out when the
 * corresponding scroll end is reached.
 */
export function AuthorTimeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    // 4px tolerance for sub-pixel rounding
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-glow/60" />
          <h4 className="font-mono-proto text-[11px] uppercase tracking-[0.3em] text-cyan-glow">
            The Two-Year Journey
          </h4>
        </div>
        {/* desktop scroll buttons */}
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Scroll timeline left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-glow/20 bg-cosmos-surface/50 text-stardust-dim backdrop-blur-sm transition-all hover:border-cyan-glow/50 hover:text-cyan-glow disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-cyan-glow/20 disabled:hover:text-stardust-dim"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Scroll timeline right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-glow/20 bg-cosmos-surface/50 text-stardust-dim backdrop-blur-sm transition-all hover:border-cyan-glow/50 hover:text-cyan-glow disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-cyan-glow/20 disabled:hover:text-stardust-dim"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* track */}
      <div className="relative">
        {/* horizontal constellation line */}
        <div className="pointer-events-none absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-cyan-glow/40 via-gold-glow/30 to-transparent" />

        {/* left edge fade cue — fades out when at start */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 bottom-4 z-10 w-8 transition-opacity duration-300 ${
            atStart ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(to right, var(--cosmos-deep), transparent)",
          }}
        />
        {/* right edge fade cue — fades out when at end */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 bottom-4 z-10 w-8 transition-opacity duration-300 ${
            atEnd ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(to left, var(--cosmos-deep), transparent)",
          }}
        />

        <div
          ref={trackRef}
          className="cosmic-scroll flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] sm:snap-x sm:snap-mandatory"
          style={{ scrollbarWidth: "thin" }}
        >
          {AUTHOR_TIMELINE.map((m, i) => {
            const isLast = i === AUTHOR_TIMELINE.length - 1;
            return (
              <article
                key={m.phase}
                className="group relative w-[260px] shrink-0 snap-start sm:w-[280px]"
              >
                {/* node on the track */}
                <div className="relative mb-4 flex h-10 items-center">
                  <span
                    className={`relative z-10 flex h-3 w-3 items-center justify-center rounded-full ${
                      isLast ? "bg-gold-glow" : "bg-cyan-glow"
                    }`}
                  >
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isLast ? "bg-gold-glow/40" : "bg-cyan-glow/40"
                      } ${isLast ? "animate-ping" : ""}`}
                    />
                    <span
                      className={`absolute -z-10 h-6 w-6 rounded-full blur-md ${
                        isLast ? "bg-gold-glow/40" : "bg-cyan-glow/30"
                      }`}
                    />
                  </span>
                </div>

                {/* card */}
                <div className="rounded-2xl border border-cyan-glow/12 bg-cosmos-surface/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-cyan-glow/30 hover:bg-cosmos-surface/60">
                  <p
                    className={`font-mono-proto text-[10px] uppercase tracking-[0.25em] ${
                      isLast ? "text-gold-glow" : "text-cyan-glow"
                    }`}
                  >
                    {m.period}
                  </p>
                  <h5 className="mt-1 font-display text-base font-semibold text-stardust">
                    {m.title}
                  </h5>
                  <p className="mt-2 text-xs leading-relaxed text-stardust-dim">
                    {m.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
